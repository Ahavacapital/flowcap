# FlowCap — Setup Guide
Complete this in order. Takes ~2 hours start to finish.

═══════════════════════════════════════════════════════
STEP 1 — SUPABASE (15 min)
═══════════════════════════════════════════════════════

1. Go to supabase.com → New project
   - Name: flowcap
   - Choose a strong password (save it)
   - Region: US East (or closest to you)

2. Once created, go to SQL Editor → paste the entire
   contents of supabase/schema.sql → Run

3. Go to Storage → New bucket
   - Name: deal-documents
   - Public: NO

4. Go to Settings → API → copy:
   - Project URL → NEXT_PUBLIC_SUPABASE_URL
   - anon/public key → NEXT_PUBLIC_SUPABASE_ANON_KEY
   - service_role key → SUPABASE_SERVICE_ROLE_KEY

═══════════════════════════════════════════════════════
STEP 2 — GOOGLE CLOUD (30 min)
═══════════════════════════════════════════════════════

1. Go to console.cloud.google.com
2. Create a new project: "flowcap"
3. Enable these APIs (APIs & Services → Library):
   - Gmail API
   - Google Sheets API

4. Create Service Account:
   - IAM & Admin → Service Accounts → Create
   - Name: flowcap-service
   - Grant role: Editor
   - Create and download JSON key

5. GMAIL SETUP — Service Account needs delegation:
   a. In Google Workspace Admin (admin.google.com):
      Security → API Controls → Domain-wide Delegation
   b. Add new: paste the service account Client ID
   c. Add scope: https://www.googleapis.com/auth/gmail.readonly
                 https://www.googleapis.com/auth/gmail.modify
   d. NOTE: If you use personal Gmail (not Workspace), use
      OAuth instead. Ask Claude for the OAuth version.

6. SHEETS SETUP:
   - Share each of your 3 Google Sheets with the
     service account email (it looks like:
     flowcap-service@flowcap-xxx.iam.gserviceaccount.com)
   - Give it Editor access
   - Copy the Sheet ID from each URL (the long ID in the URL)

7. Copy the service account JSON key content →
   GOOGLE_SERVICE_ACCOUNT_JSON in .env

═══════════════════════════════════════════════════════
STEP 3 — ANTHROPIC API KEY (2 min)
═══════════════════════════════════════════════════════

1. Go to console.anthropic.com
2. API Keys → Create Key
3. Copy → ANTHROPIC_API_KEY

═══════════════════════════════════════════════════════
STEP 4 — DOCUSIGN (30 min)
═══════════════════════════════════════════════════════

1. Go to developers.docusign.com → Create account
2. Apps & Keys → Add App
   - Name: FlowCap
   - Auth Type: JWT
3. Copy Integration Key → DOCUSIGN_INTEGRATION_KEY
4. Copy User ID (your account) → DOCUSIGN_USER_ID
5. Copy Account ID → DOCUSIGN_ACCOUNT_ID
6. Generate RSA Key Pair → save private key → DOCUSIGN_PRIVATE_KEY
7. Grant consent: visit this URL in browser:
   https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=YOUR_INTEGRATION_KEY&redirect_uri=https://yourapp.vercel.app

8. Create your contract template:
   - Templates → New Template
   - Upload your MCA contract PDF
   - Add signature + text fields
   - Match field names to the textTabs in api/docusign/send.js
   - Copy Template ID → DOCUSIGN_TEMPLATE_ID

9. Set up webhook (after deploying to Vercel):
   - Connect → Add Configuration
   - URL: https://yourapp.vercel.app/api/docusign/webhook
   - Events: envelope-completed, envelope-declined

═══════════════════════════════════════════════════════
STEP 5 — DEPLOY TO VERCEL (10 min)
═══════════════════════════════════════════════════════

1. Push this code to a GitHub repository

2. Go to vercel.com → New Project → Import from GitHub

3. Add ALL environment variables from .env.example:
   Settings → Environment Variables → add each one

4. Deploy — your app gets a URL like flowcap.vercel.app

5. Generate CRON_SECRET:
   Run in terminal: openssl rand -base64 32
   Add to Vercel env vars

6. Generate NEXTAUTH_SECRET:
   Run: openssl rand -base64 32
   Add to Vercel env vars

7. After deploy, confirm cron jobs:
   Vercel dashboard → your project → Cron Jobs
   You should see 3 crons listed

═══════════════════════════════════════════════════════
STEP 6 — TEST EVERYTHING (15 min)
═══════════════════════════════════════════════════════

Test 1 — Gmail watcher:
  Send an email to your deals inbox with a PDF attachment
  Wait 5 min → check Supabase deals table for new row
  OR manually trigger: POST /api/gmail/watch with
  Authorization: Bearer YOUR_CRON_SECRET

Test 2 — AI Scrubber:
  POST /api/scrubber/run { "dealId": "your-deal-uuid" }
  Check Supabase deals table — should have risk_score set

Test 3 — Sheets sync:
  POST /api/sheets/sync (with Authorization header)
  Check your Google Sheets — should have all deals populated

Test 4 — DocuSign (use sandbox first):
  Set DOCUSIGN_BASE_URL=https://demo.docusign.net/restapi
  POST /api/docusign/send { "dealId": "your-deal-uuid" }
  Check email for DocuSign envelope

═══════════════════════════════════════════════════════
GMAIL PERSONAL ACCOUNT NOTE
═══════════════════════════════════════════════════════

If you use personal Gmail (not Google Workspace),
service account delegation won't work. You need OAuth2.
The flow is:
1. Create OAuth2 credentials (Web application type)
2. Get refresh token by authorizing once
3. Store refresh token as GMAIL_REFRESH_TOKEN
4. Exchange for access token on each request

Ask Claude: "Give me the Gmail OAuth2 version of the
watcher for a personal Gmail account"

═══════════════════════════════════════════════════════
YOUR GOOGLE SHEETS COLUMN STRUCTURE
═══════════════════════════════════════════════════════

The sync will create these columns automatically.
If you have existing data, either:
  a) Clear your sheets and let the sync repopulate, OR
  b) Ask Claude to map your existing columns

Deals sheet columns (auto-created):
  Deal # | Business | Contact | Broker | Requested | Approved |
  Factor Rate | Term | Status | Risk Score | Monthly Revenue |
  Avg Daily Bal | Positions | NY Courts | DataMerch |
  Submitted | Funded Date | Balance | Notes

Brokers sheet columns:
  Name | Contact | Email | Phone | Commission % |
  Total Deals | Funded Deals | Total Volume | Conversion % | Active

Funded sheet columns:
  Deal # | Business | Contact | Broker | Funded Amount |
  Factor Rate | Term | Payback Amount | Balance | % Paid |
  Funded Date | Daily Payment | Renewal Eligible
