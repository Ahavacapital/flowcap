-- ============================================================
-- FlowCap MCA Platform — Supabase Schema
-- Run this entire file in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── BROKERS ────────────────────────────────────────────────
create table brokers (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  contact     text,
  email       text unique,
  phone       text,
  company     text,
  commission_pct numeric(5,2) default 5.0,
  active      boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ─── DEALS ──────────────────────────────────────────────────
create table deals (
  id              uuid primary key default uuid_generate_v4(),
  deal_number     text unique not null,       -- e.g. D-0041
  broker_id       uuid references brokers(id),
  
  -- Business info
  business_name   text not null,
  contact_name    text,
  contact_email   text,
  contact_phone   text,
  business_type   text,
  years_in_biz    numeric(4,1),
  
  -- Financials
  amount_requested  numeric(12,2),
  amount_approved   numeric(12,2),
  factor_rate       numeric(5,3),
  term_months       integer,
  monthly_revenue   numeric(12,2),
  avg_daily_balance numeric(12,2),
  
  -- Underwriting
  risk_score        integer,
  positions         integer default 0,
  ny_court_result   text,     -- 'clean' | 'N defaults'
  datamerch_result  text,     -- 'clean' | 'flagged'
  
  -- Status
  status  text not null default 'new'
    check (status in ('new','scrubbing','underwriting','offered',
                      'docs','contracts','bankverify','funded',
                      'declined','renewal')),
  
  -- Funding
  funded_at     timestamptz,
  balance       numeric(12,2),
  
  -- Meta
  source        text default 'email',  -- 'email' | 'portal' | 'manual'
  gmail_thread_id text,
  notes         text,
  submitted_at  timestamptz default now(),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─── UNDERWRITER NOTES ──────────────────────────────────────
create table deal_notes (
  id          uuid primary key default uuid_generate_v4(),
  deal_id     uuid not null references deals(id) on delete cascade,
  author      text not null default 'System',
  category    text default 'general'
    check (category in ('general','risk','approval','condition','followup','system')),
  body        text not null,
  created_at  timestamptz default now()
);

-- ─── DOCUMENTS ──────────────────────────────────────────────
create table documents (
  id          uuid primary key default uuid_generate_v4(),
  deal_id     uuid not null references deals(id) on delete cascade,
  name        text not null,
  doc_type    text,   -- 'bank_statement' | 'voided_check' | 'photo_id' | 'contract' | 'other'
  storage_path text,  -- Supabase Storage path
  mime_type   text,
  size_bytes  bigint,
  source      text default 'upload',  -- 'email' | 'upload' | 'generated'
  created_at  timestamptz default now()
);

-- ─── CONTRACTS ──────────────────────────────────────────────
create table contracts (
  id                  uuid primary key default uuid_generate_v4(),
  deal_id             uuid not null references deals(id) on delete cascade,
  docusign_envelope_id text,
  status              text default 'draft'
    check (status in ('draft','sent','viewed','signed','declined','voided')),
  sent_at             timestamptz,
  signed_at           timestamptz,
  docusign_url        text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- ─── DEAL STATUS HISTORY ────────────────────────────────────
create table deal_status_history (
  id          uuid primary key default uuid_generate_v4(),
  deal_id     uuid not null references deals(id) on delete cascade,
  from_status text,
  to_status   text not null,
  changed_by  text default 'system',
  changed_at  timestamptz default now()
);

-- ─── GMAIL SYNC LOG ─────────────────────────────────────────
create table gmail_sync_log (
  id              uuid primary key default uuid_generate_v4(),
  gmail_thread_id text unique not null,
  gmail_message_id text,
  subject         text,
  from_email      text,
  deal_id         uuid references deals(id),
  processed       boolean default false,
  error           text,
  synced_at       timestamptz default now()
);

-- ─── SHEETS SYNC LOG ────────────────────────────────────────
create table sheets_sync_log (
  id          uuid primary key default uuid_generate_v4(),
  sheet_name  text not null,   -- 'deals' | 'brokers' | 'funded'
  action      text not null,   -- 'push' | 'pull'
  rows        integer,
  error       text,
  synced_at   timestamptz default now()
);

-- ─── MARKETING CAMPAIGNS ────────────────────────────────────
create table campaigns (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  type        text not null check (type in ('broker','merchant')),
  channel     text not null check (channel in ('email','sms','both')),
  audience    text,
  subject     text,
  body        text,
  status      text default 'draft' check (status in ('draft','active','sent','paused')),
  sent_count  integer default 0,
  open_count  integer default 0,
  click_count integer default 0,
  scheduled_at timestamptz,
  sent_at     timestamptz,
  created_at  timestamptz default now()
);

-- ─── INDEXES ────────────────────────────────────────────────
create index idx_deals_status        on deals(status);
create index idx_deals_broker_id     on deals(broker_id);
create index idx_deals_submitted_at  on deals(submitted_at desc);
create index idx_deal_notes_deal_id  on deal_notes(deal_id);
create index idx_documents_deal_id   on documents(deal_id);
create index idx_contracts_deal_id   on contracts(deal_id);
create index idx_history_deal_id     on deal_status_history(deal_id);
create index idx_gmail_thread        on gmail_sync_log(gmail_thread_id);

-- ─── UPDATED_AT TRIGGER ─────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_deals_updated_at
  before update on deals
  for each row execute function update_updated_at();

create trigger trg_brokers_updated_at
  before update on brokers
  for each row execute function update_updated_at();

create trigger trg_contracts_updated_at
  before update on contracts
  for each row execute function update_updated_at();

-- ─── STATUS HISTORY TRIGGER ─────────────────────────────────
create or replace function log_status_change()
returns trigger as $$
begin
  if old.status is distinct from new.status then
    insert into deal_status_history(deal_id, from_status, to_status)
    values (new.id, old.status, new.status);
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_deal_status_history
  after update on deals
  for each row execute function log_status_change();

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────
alter table deals                enable row level security;
alter table brokers              enable row level security;
alter table deal_notes           enable row level security;
alter table documents            enable row level security;
alter table contracts            enable row level security;
alter table deal_status_history  enable row level security;
alter table campaigns            enable row level security;

-- Allow all access with service role key (used by your backend only)
create policy "service_role_all" on deals          for all using (true);
create policy "service_role_all" on brokers        for all using (true);
create policy "service_role_all" on deal_notes     for all using (true);
create policy "service_role_all" on documents      for all using (true);
create policy "service_role_all" on contracts      for all using (true);
create policy "service_role_all" on deal_status_history for all using (true);
create policy "service_role_all" on campaigns      for all using (true);

-- ─── SEED BROKERS ───────────────────────────────────────────
insert into brokers (name, contact, email, commission_pct) values
  ('TCA Capital',    'Alex Thornton', 'alex@tcacapital.com',   5.0),
  ('Apex Brokers',   'Sarah Kim',     'sarah@apexbrokers.com', 5.0),
  ('Blue Ocean Fin', 'Mike Torres',   'mike@blueocean.com',    4.5),
  ('Landmark Cap',   'Donna Reese',   'donna@landmarkcap.com', 5.0);

-- ─── STORAGE BUCKET ─────────────────────────────────────────
-- Run in Supabase dashboard → Storage → New bucket
-- Name: deal-documents
-- Public: false
