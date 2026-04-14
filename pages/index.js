export default function Home() {
  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:#0a0c0f;--bg2:#111318;--bg3:#181c23;--bg4:#1e2330;
          --border:#ffffff0f;--border2:#ffffff18;--border3:#ffffff28;
          --text:#e8eaf0;--text2:#8b90a0;--text3:#555a6a;
          --accent:#3b82f6;--accent2:#6366f1;--green:#10b981;
          --amber:#f59e0b;--red:#ef4444;--purple:#a78bfa;--teal:#14b8a6;
          --font:'DM Sans',sans-serif;--mono:'DM Mono',monospace;
          --serif:'Playfair Display',serif;
          --radius:10px;--radius-lg:16px;--radius-xl:24px;
        }
        html,body{height:100%;background:var(--bg);color:var(--text);font-family:var(--font);font-size:14px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow:hidden}
        #app{height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px}
        .lmark{font-family:Georgia,serif;font-size:36px;color:var(--text)}.lmark span{color:var(--accent)}
        .lsub{font-size:12px;color:var(--text3);letter-spacing:2px;text-transform:uppercase}
        .lbar{width:180px;height:2px;background:var(--border2);border-radius:2px;overflow:hidden}
        .lfill{height:100%;background:var(--accent);border-radius:2px;animation:ld 1.5s ease-in-out infinite}
        .lst{font-size:12px;color:var(--text3)}
        @keyframes ld{0%{width:0}50%{width:70%}100%{width:100%}}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:var(--border3);border-radius:2px}
        #root{height:100vh;width:100vw;display:flex;overflow:hidden;position:fixed;top:0;left:0}
        .sb{width:220px;min-width:220px;height:100%;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow-y:auto;flex-shrink:0}
        .mn{flex:1;min-width:0;height:100%;overflow:hidden;display:flex;flex-direction:column}
        .tb{height:56px;min-height:56px;flex-shrink:0;border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 20px;gap:12px;background:var(--bg2)}
        .ct{flex:1;min-height:0;overflow-y:auto;padding:20px}
        .sbl{padding:18px 18px 14px;border-bottom:1px solid var(--border);flex-shrink:0}
        .lm{font-family:var(--serif);font-size:19px;color:var(--text);letter-spacing:-.5px}
        .lm span{color:var(--accent)}
        .ls{font-size:10px;color:var(--text3);letter-spacing:1.5px;text-transform:uppercase;margin-top:2px;font-family:var(--mono)}
        .ns{padding:14px 12px 6px;font-size:10px;color:var(--text3);letter-spacing:1.5px;text-transform:uppercase;font-family:var(--mono)}
        .ni{display:flex;align-items:center;gap:10px;padding:7px 12px;margin:1px 8px;border-radius:var(--radius);cursor:pointer;color:var(--text2);font-size:13px;transition:all .15s;position:relative}
        .ni:hover{background:var(--bg3);color:var(--text)}
        .ni.ac{background:var(--bg4);color:var(--text);font-weight:500}
        .ni.ac::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:16px;background:var(--accent);border-radius:0 2px 2px 0}
        .nb{margin-left:auto;background:var(--accent);color:#fff;font-size:10px;font-family:var(--mono);padding:1px 6px;border-radius:10px}
        .nb.am{background:var(--amber);color:#000}
        .sbb{margin-top:auto;padding:14px;border-top:1px solid var(--border);flex-shrink:0}
        .uc{display:flex;align-items:center;gap:10px;padding:8px;border-radius:var(--radius);background:var(--bg3)}
        .av{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#fff;flex-shrink:0}
        .pt{font-size:15px;font-weight:500;color:var(--text)}
        .tr{margin-left:auto;display:flex;align-items:center;gap:8px}
        .btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:var(--radius);font-size:13px;font-weight:500;cursor:pointer;border:none;transition:all .15s;font-family:var(--font);white-space:nowrap}
        .bp{background:var(--accent);color:#fff}.bp:hover{background:#2563eb}
        .bg{background:transparent;color:var(--text2);border:1px solid var(--border2)}.bg:hover{background:var(--bg3);color:var(--text)}
        .bs{padding:5px 10px;font-size:12px}
        .bd{background:#ef444415;color:var(--red);border:1px solid #ef444430}
        .bsu{background:#10b98115;color:var(--green);border:1px solid #10b98130}
        .bam{background:#f59e0b15;color:var(--amber);border:1px solid #f59e0b30}
        .cd{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px}
        .cds{padding:12px 14px}
        .sg{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
        .sc2{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:16px 18px}
        .sl2{font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono)}
        .sv{font-size:22px;font-weight:600;color:var(--text);margin:5px 0 3px;font-family:var(--mono);letter-spacing:-1px}
        .sd{font-size:11px;font-family:var(--mono)}.sd.up{color:var(--green)}.sd.dn{color:var(--red)}
        .pt2{width:100%;border-collapse:collapse}
        .pt2 th{text-align:left;padding:8px 12px;font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono);border-bottom:1px solid var(--border);font-weight:400;white-space:nowrap;cursor:pointer}
        .pt2 th:hover{color:var(--text2)}
        .pt2 td{padding:10px 12px;border-bottom:1px solid var(--border);font-size:13px;vertical-align:middle}
        .pt2 tr:last-child td{border-bottom:none}
        .pt2 tr:hover td{background:var(--bg3)}
        .pt2 tr{cursor:pointer;transition:background .1s}
        .badge{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:20px;font-size:11px;font-weight:500;font-family:var(--mono);white-space:nowrap}
        .badge::before{content:'';width:5px;height:5px;border-radius:50%;flex-shrink:0}
        .badge-new{background:#3b82f615;color:#93c5fd;border:1px solid #3b82f630}.badge-new::before{background:#93c5fd}
        .badge-scrubbing{background:#6366f115;color:#c4b5fd;border:1px solid #6366f130}.badge-scrubbing::before{background:#c4b5fd}
        .badge-underwriting{background:#f59e0b15;color:#fcd34d;border:1px solid #f59e0b30}.badge-underwriting::before{background:#fcd34d}
        .badge-offered{background:#14b8a615;color:#5eead4;border:1px solid #14b8a630}.badge-offered::before{background:#5eead4}
        .badge-docs{background:#a78bfa15;color:#c4b5fd;border:1px solid #a78bfa30}.badge-docs::before{background:#c4b5fd}
        .badge-contracts{background:#3b82f615;color:#93c5fd;border:1px solid #3b82f630}.badge-contracts::before{background:#93c5fd}
        .badge-bankverify{background:#f59e0b15;color:#fcd34d;border:1px solid #f59e0b30}.badge-bankverify::before{background:#fcd34d}
        .badge-funded{background:#10b98115;color:#6ee7b7;border:1px solid #10b98130}.badge-funded::before{background:#6ee7b7}
        .badge-declined{background:#ef444415;color:#fca5a5;border:1px solid #ef444430}.badge-declined::before{background:#fca5a5}
        .badge-renewal{background:#ec489915;color:#f9a8d4;border:1px solid #ec489930}.badge-renewal::before{background:#f9a8d4}
        .df{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .dff{background:var(--bg3);border-radius:var(--radius);padding:10px 12px}
        .dl{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono);margin-bottom:3px}
        .dv{font-size:13px;color:var(--text);font-weight:500}
        .tl{display:flex;flex-direction:column}
        .tli{display:flex;gap:12px;padding:8px 0}
        .tld{width:8px;height:8px;border-radius:50%;background:var(--accent);margin-top:4px;flex-shrink:0;position:relative}
        .tld::after{content:'';position:absolute;left:3px;top:8px;width:2px;height:calc(100% + 8px);background:var(--border2)}
        .tli:last-child .tld::after{display:none}
        .tld.green{background:var(--green)}.tld.red{background:var(--red)}.tld.amber{background:var(--amber)}
        .tlt{font-size:11px;color:var(--text3);font-family:var(--mono);white-space:nowrap;min-width:80px}
        .tltx{font-size:12px;color:var(--text2)}
        .mo{position:fixed;inset:0;background:#00000090;display:flex;align-items:center;justify-content:center;z-index:1000}
        .md{background:var(--bg2);border:1px solid var(--border2);border-radius:var(--radius-xl);width:720px;max-width:96vw;max-height:88vh;overflow-y:auto;padding:24px;position:relative}
        .mt{font-size:18px;font-weight:600;color:var(--text);margin-bottom:3px;font-family:var(--serif)}
        .mc{position:absolute;top:18px;right:18px;background:var(--bg3);border:none;color:var(--text2);width:28px;height:28px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px}
        .fg{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .fgg{display:flex;flex-direction:column;gap:4px}
        .fgg.full{grid-column:1/-1}
        .fl{font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono)}
        .fi{background:var(--bg3);border:1px solid var(--border2);border-radius:var(--radius);padding:8px 12px;color:var(--text);font-size:13px;font-family:var(--font);outline:none;transition:border .15s;width:100%}
        .fi:focus{border-color:var(--accent)}
        .fi::placeholder{color:var(--text3)}
        select.fi option{background:var(--bg3)}
        textarea.fi{resize:vertical;min-height:72px}
        .tabs{display:flex;border-bottom:1px solid var(--border);margin-bottom:16px;flex-shrink:0}
        .tab{padding:9px 14px;font-size:13px;color:var(--text3);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;margin-bottom:-1px;white-space:nowrap}
        .tab:hover{color:var(--text2)}
        .tab.ac{color:var(--text);border-bottom-color:var(--accent);font-weight:500}
        .oc{background:linear-gradient(135deg,#0f1829,#0f2219);border:1px solid #3b82f640;border-radius:var(--radius-xl);padding:20px}
        .oa{font-size:32px;font-weight:600;color:var(--text);font-family:var(--mono);letter-spacing:-1px}
        .ol{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono);margin-bottom:4px}
        .om{display:flex;gap:20px;margin-top:14px;flex-wrap:wrap}
        .omv{font-size:15px;font-weight:500;color:var(--text);font-family:var(--mono)}
        .oml{font-size:10px;color:var(--text3);font-family:var(--mono);text-transform:uppercase}
        .sb2{height:5px;background:var(--bg4);border-radius:3px;overflow:hidden;margin-top:5px}
        .sf{height:100%;border-radius:3px}
        .ps{display:flex;margin-bottom:20px;overflow-x:auto}
        .pst{flex:1;min-width:70px;text-align:center;padding:6px 4px;position:relative}
        .pst::after{content:'';position:absolute;right:0;top:50%;transform:translateY(-50%);width:1px;height:60%;background:var(--border)}
        .pst:last-child::after{display:none}
        .psd{width:24px;height:24px;border-radius:50%;border:2px solid var(--border3);margin:0 auto 5px;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--text3)}
        .pst.dn .psd{background:var(--green);border-color:var(--green);color:#fff}
        .pst.av .psd{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 0 10px #3b82f640}
        .pst.er .psd{background:var(--red);border-color:var(--red);color:#fff}
        .psl{font-size:9px;color:var(--text3);font-family:var(--mono)}
        .pst.av .psl{color:var(--accent)}.pst.dn .psl{color:var(--green)}.pst.er .psl{color:var(--red)}
        .rf{padding:10px 12px;border-radius:var(--radius);background:var(--bg3);border-left:3px solid;margin-bottom:8px}
        .rf.red{border-color:var(--red)}.rf.amber{border-color:var(--amber)}.rf.green{border-color:var(--green)}
        .uz{border:2px dashed var(--border3);border-radius:var(--radius-lg);padding:24px;text-align:center;cursor:pointer;transition:all .2s}
        .uz:hover{border-color:var(--accent)}
        .dv2{height:1px;background:var(--border);margin:16px 0}
        .em{text-align:center;padding:40px 20px}
        .emi{font-size:32px;margin-bottom:10px;opacity:.4}
        .emt{font-size:13px;color:var(--text3)}
        .tw{overflow-x:auto}
        .sp{width:20px;height:20px;border:2px solid var(--border3);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite;margin:0 auto}
        .profit-box{background:linear-gradient(135deg,#0a1f0a,#0a1a0a);border:1px solid #10b98140;border-radius:var(--radius-lg);padding:14px 16px}
        .search-wrap{position:relative;flex:1;min-width:200px}
        .search-wrap input{padding-left:32px !important}
        .search-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text3);font-size:13px;pointer-events:none}
        .filter-row{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;align-items:center}
        .note-card{padding:10px 12px;background:var(--bg3);border-radius:var(--radius);border-left:3px solid var(--border3);margin-bottom:8px}
        .note-card.risk{border-left-color:var(--red)}
        .note-card.approval{border-left-color:var(--green)}
        .note-card.condition{border-left-color:var(--amber)}
        .note-card.followup{border-left-color:var(--purple)}
        .note-card.system{border-left-color:var(--accent)}
        .deal-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:12px;cursor:pointer;transition:all .15s;margin-bottom:8px}
        .deal-card:hover{border-color:var(--border3)}
        .new-dot{width:6px;height:6px;border-radius:50%;background:var(--green);display:inline-block;flex-shrink:0}
        .action-bar{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px}
        @keyframes fadein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fa{animation:fadein .2s ease forwards}
        @media(max-width:768px){.sb{display:none}.sg{grid-template-columns:1fr 1fr}.fg{grid-column:1fr}}
        @media(max-width:480px){.sg{grid-template-columns:1fr}}
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet"/>
      <div id="app">
        <div className="lmark">Flow<span>Cap</span></div>
        <div className="lsub">MCA Platform</div>
        <div className="lbar"><div className="lfill"/></div>
        <div className="lst">Loading your deals...</div>
      </div>
      <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js" defer></script>
      <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js" defer></script>
      <script src="https://unpkg.com/@babel/standalone@7.23.0/babel.min.js" defer></script>
      <script type="text/babel" data-type="module">{`

const {useState,useEffect,useCallback}=React;

const SL={new:'New',scrubbing:'Scrubbing',underwriting:'Underwriting',offered:'Offered',docs:'Docs',contracts:'Contracts',bankverify:'Bank Verify',funded:'Funded',declined:'Declined',renewal:'Renewal'};
const f$=(n)=>n!=null?'$'+Number(n).toLocaleString():'--';
const sc=(s)=>({new:'badge-new',scrubbing:'badge-scrubbing',underwriting:'badge-underwriting',offered:'badge-offered',docs:'badge-docs',contracts:'badge-contracts',bankverify:'badge-bankverify',funded:'badge-funded',declined:'badge-declined',renewal:'badge-renewal'}[s]||'badge-new');
const rc=(r)=>r>=70?'var(--green)':r>=50?'var(--amber)':'var(--red)';
const isToday=(d)=>{if(!d)return false;const t=new Date();const dd=new Date(d);return dd.toDateString()===t.toDateString();};
const NEXT={new:'scrubbing',scrubbing:'underwriting',underwriting:'offered',offered:'docs',docs:'contracts',contracts:'bankverify',bankverify:'funded'};
const cc={general:'var(--text3)',risk:'var(--red)',approval:'var(--green)',condition:'var(--amber)',followup:'var(--purple)',system:'var(--accent)'};

function mapDeal(d){
  const profit=d.amount_approved&&d.factor_rate?Math.round(d.amount_approved*(1.499-d.factor_rate)):null;
  return {
    id:d.deal_number||d.id, dbId:d.id,
    business:d.business_name||'Unknown',
    contact:d.contact_name||'',
    contactEmail:d.contact_email||'',
    broker:d.broker?.name||d.contact_email||'Unknown',
    amount:d.amount_approved||null,
    requested:d.amount_requested||null,
    status:d.status||'new',
    risk:d.risk_score||null,
    factor:d.factor_rate||null,
    term:d.term_months||null,
    termDays:d.term_months?d.term_months*30:null,
    positions:d.positions||0,
    avgDailyBal:d.avg_daily_balance||null,
    monthlyRev:d.monthly_revenue||null,
    nyCourt:d.ny_court_result||null,
    dataMerch:d.datamerch_result||null,
    submitted:d.submitted_at?.slice(0,10)||'',
    submittedFull:d.submitted_at||null,
    funded:d.funded_at?.slice(0,10)||null,
    balance:d.balance||null,
    notes:d.notes||'',
    uwNotes:(d.deal_notes||[]).map(n=>({
      id:n.id,text:n.body,category:n.category||'general',
      author:n.author||'System',
      time:n.created_at?new Date(n.created_at).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}):''
    })),
    profit,
    merchantPayback:d.amount_approved?Math.round(d.amount_approved*1.499):null,
  };
}

function App(){
  const [pg,setPg]=useState('dashboard');
  const [deals,setDeals]=useState([]);
  const [loading,setLoading]=useState(true);
  const [sel,setSel]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [syncing,setSyncing]=useState(false);

  const loadDeals=useCallback(()=>{
    fetch('/api/deals/list')
      .then(r=>r.json())
      .then(data=>{if(data.deals)setDeals(data.deals.map(mapDeal));setLoading(false);})
      .catch(()=>setLoading(false));
  },[]);

  useEffect(()=>{loadDeals();},[]);

  const syncSheets=async()=>{
    setSyncing(true);
    try{await fetch('/api/sheets/sync',{method:'POST',headers:{'Authorization':'Bearer flowcap2024secret'}});}catch(e){}
    setSyncing(false);
  };

  const upd=d=>setDeals(ds=>ds.map(x=>x.id===d.id?d:x));
  const add=d=>setDeals(ds=>[d,...ds]);
  const funded=deals.filter(d=>d.status==='funded');
  const active=deals.filter(d=>!['funded','declined'].includes(d.status));
  const todayCnt=deals.filter(d=>isToday(d.submittedFull)).length;
  const tf=funded.reduce((s,d)=>s+(d.amount||0),0);
  const tp=deals.reduce((s,d)=>s+(d.profit||0),0);

  const pts={dashboard:'Dashboard',pipeline:'Deal pipeline',deals:'All deals',brokers:'Brokers / ISO',contracts:'Contracts','broker-portal':'Broker portal','merchant-portal':'Merchant portal','mkt-broker':'Broker campaigns','mkt-merchant':'Merchant campaigns',settings:'Settings'};
  const navMain=[{id:'dashboard',l:'Dashboard'},{id:'pipeline',l:'Pipeline',b:active.length,bc:'am'},{id:'deals',l:'All Deals'},{id:'brokers',l:'Brokers / ISO'},{id:'contracts',l:'Contracts'}];
  const navPortal=[{id:'broker-portal',l:'Broker Portal'},{id:'merchant-portal',l:'Merchant Portal'}];
  const navMkt=[{id:'mkt-broker',l:'Broker Campaigns'},{id:'mkt-merchant',l:'Merchant Campaigns'}];

  if(loading&&!deals.length) return(
    <div id="app">
      <div className="lmark">Flow<span>Cap</span></div>
      <div className="lsub">MCA Platform</div>
      <div className="lbar"><div className="lfill"/></div>
      <div className="lst">Loading your deals...</div>
    </div>
  );

  return(
    <div id="root">
      <div className="sb">
        <div className="sbl">
          <div className="lm">Flow<span>Cap</span></div>
          <div className="ls">MCA Platform</div>
        </div>
        <div className="ns">Operations</div>
        {navMain.map(n=>(
          <div key={n.id} className={'ni'+(pg===n.id?' ac':'')} onClick={()=>setPg(n.id)}>
            {n.l}{n.b>0&&<span className={'nb'+(n.bc?' '+n.bc:'')}>{n.b}</span>}
          </div>
        ))}
        <div className="ns">Portals</div>
        {navPortal.map(n=>(
          <div key={n.id} className={'ni'+(pg===n.id?' ac':'')} onClick={()=>setPg(n.id)}>{n.l}</div>
        ))}
        <div className="ns">Marketing</div>
        {navMkt.map(n=>(
          <div key={n.id} className={'ni'+(pg===n.id?' ac':'')} onClick={()=>setPg(n.id)}>{n.l}</div>
        ))}
        <div className="ns">System</div>
        <div className={'ni'+(pg==='settings'?' ac':'')} onClick={()=>setPg('settings')}>Settings</div>
        <div className="sbb">
          <div className="uc">
            <div className="av">JD</div>
            <div>
              <div style={{fontSize:12,fontWeight:500,color:'var(--text)'}}>Jamie Donahue</div>
              <div style={{fontSize:10,color:'var(--text3)',fontFamily:'var(--mono)'}}>Admin - Underwriter</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mn">
        <div className="tb">
          <div className="pt">{pts[pg]||pg}</div>
          {todayCnt>0&&<span style={{fontSize:11,fontFamily:'var(--mono)',color:'var(--green)',background:'#10b98120',border:'1px solid #10b98140',padding:'2px 8px',borderRadius:10}}>{todayCnt} new today</span>}
          <div className="tr">
            <button className="btn bg bs" onClick={loadDeals}>Refresh</button>
            <button className="btn bg bs" onClick={syncSheets} disabled={syncing}>{syncing?'Syncing...':'Sync Sheets'}</button>
            <button className="btn bp" onClick={()=>setShowNew(true)}>+ New deal</button>
          </div>
        </div>

        <div className="ct">
          {pg==='dashboard'&&<Dashboard deals={deals} setPg={setPg} setSel={setSel} tf={tf} tp={tp} active={active} funded={funded} todayCnt={todayCnt}/>}
          {pg==='pipeline'&&<Pipeline deals={deals} setSel={setSel} setShowNew={setShowNew}/>}
          {pg==='deals'&&<AllDeals deals={deals} setSel={setSel} setShowNew={setShowNew}/>}
          {pg==='brokers'&&<BrokersPage deals={deals}/>}
          {pg==='contracts'&&<ContractsPage deals={deals} upd={upd}/>}
          {pg==='broker-portal'&&<BrokerPortal deals={deals}/>}
          {pg==='merchant-portal'&&<MerchantPortal deals={deals}/>}
          {pg==='mkt-broker'&&<MktPage type="broker"/>}
          {pg==='mkt-merchant'&&<MktPage type="merchant"/>}
          {pg==='settings'&&<SettingsPage/>}
        </div>
      </div>

      {sel&&<DealModal deal={sel} onClose={()=>setSel(null)} onUpd={d=>{upd(d);setSel(d)}} onRefresh={loadDeals}/>}
      {showNew&&<NewDeal onClose={()=>setShowNew(false)} onSave={d=>{add(d);setShowNew(false)}}/>}
    </div>
  );
}

function Dashboard({deals,setPg,setSel,tf,tp,active,funded,todayCnt}){
  const declined=deals.filter(d=>d.status==='declined').length;
  const approvalPct=deals.filter(d=>['funded','declined'].includes(d.status)).length>0
    ?Math.round(funded.length/deals.filter(d=>['funded','declined'].includes(d.status)).length*100):0;
  const todayDeals=deals.filter(d=>isToday(d.submittedFull));
  return(
    <div className="fa">
      <div className="sg">
        <div className="sc2"><div className="sl2">Funded (all time)</div><div className="sv" style={{color:'var(--green)'}}>{f$(tf)}</div><div className="sd up">{funded.length} deals</div></div>
        <div className="sc2"><div className="sl2">Active pipeline</div><div className="sv">{active.length}</div><div className="sd up">{todayCnt} new today</div></div>
        <div className="sc2"><div className="sl2">Total profit</div><div className="sv" style={{color:'var(--teal)'}}>{f$(tp)}</div><div className="sd up">buy/sell spread</div></div>
        <div className="sc2"><div className="sl2">Approval rate</div><div className="sv">{approvalPct}%</div><div className="sd dn">{declined} declined</div></div>
      </div>

      {todayDeals.length>0&&(
        <div style={{marginBottom:16,padding:'12px 16px',background:'#10b98112',border:'1px solid #10b98140',borderRadius:'var(--radius-lg)',display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:'var(--green)',flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:500,color:'var(--green)'}}>{todayDeals.length} new deal{todayDeals.length!==1?'s':''} today</div>
            <div style={{fontSize:12,color:'var(--text3)',marginTop:2}}>{todayDeals.map(d=>d.business).slice(0,3).join(', ')}{todayDeals.length>3?' ...':''}</div>
          </div>
          <button className="btn bsu bs" onClick={()=>setPg('deals')}>View</button>
        </div>
      )}

      <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:14}}>
        <div className="cd">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>Recent deals</div>
            <button className="btn bg bs" onClick={()=>setPg('deals')}>View all</button>
          </div>
          <div className="tw">
            <table className="pt2">
              <thead><tr><th>Business</th><th>Broker</th><th>Requested</th><th>Offer</th><th>Status</th><th>Risk</th><th>Profit</th></tr></thead>
              <tbody>{deals.slice(0,8).map(d=>(
                <tr key={d.id} onClick={()=>setSel(d)}>
                  <td>
                    <div style={{fontWeight:500,color:'var(--text)',display:'flex',alignItems:'center',gap:6}}>
                      {isToday(d.submittedFull)&&<span className="new-dot"/>}
                      <span style={{maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',display:'block'}}>{d.business}</span>
                    </div>
                    <div style={{fontSize:11,color:'var(--text3)',fontFamily:'var(--mono)'}}>{d.id}</div>
                  </td>
                  <td style={{color:'var(--text2)',fontSize:12,maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.broker}</td>
                  <td style={{fontFamily:'var(--mono)',fontSize:12}}>{f$(d.requested)}</td>
                  <td style={{fontFamily:'var(--mono)',fontSize:12,color:d.amount?'var(--teal)':'var(--text3)'}}>{d.amount?f$(d.amount):'--'}</td>
                  <td><span className={'badge '+sc(d.status)}>{SL[d.status]}</span></td>
                  <td>{d.risk!=null?<span style={{fontSize:12,fontFamily:'var(--mono)',color:rc(d.risk)}}>{d.risk}</span>:'--'}</td>
                  <td style={{fontFamily:'var(--mono)',fontSize:12,color:d.profit?'var(--green)':'var(--text3)'}}>{d.profit?f$(d.profit):'--'}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className="cd">
            <div style={{fontSize:13,fontWeight:500,color:'var(--text)',marginBottom:12}}>Pipeline status</div>
            {['new','scrubbing','underwriting','offered','contracts','bankverify'].map(s=>{
              const cnt=deals.filter(d=>d.status===s).length;
              if(!cnt)return null;
              return(
                <div key={s} style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                  <span className={'badge '+sc(s)}>{SL[s]}</span>
                  <span style={{fontSize:13,fontFamily:'var(--mono)',color:'var(--text)'}}>{cnt}</span>
                </div>
              );
            })}
          </div>
          <div className="cd">
            <div style={{fontSize:13,fontWeight:500,color:'var(--text)',marginBottom:10}}>System</div>
            {[
              {l:'Gmail watcher',s:'Running every 5 min',c:'green'},
              {l:'Sheets sync',s:'Running every 15 min',c:'green'},
              {l:'AI scrubber',s:'Active on all deals',c:'green'},
            ].map((i,x)=>(
              <div key={x} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:'var(--'+i.c+')',flexShrink:0}}/>
                <div>
                  <div style={{fontSize:12,color:'var(--text)',fontWeight:500}}>{i.l}</div>
                  <div style={{fontSize:11,color:'var(--text3)'}}>{i.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Pipeline({deals,setSel,setShowNew}){
  const stages=['new','scrubbing','underwriting','offered','docs','contracts','bankverify'];
  return(
    <div className="fa">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div style={{fontSize:13,color:'var(--text3)'}}>Active deals in pipeline — click any deal to view details</div>
        <button className="btn bp" onClick={()=>setShowNew(true)}>+ New deal</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:8,overflowX:'auto',minWidth:900}}>
        {stages.map(s=>{
          const sd=deals.filter(d=>d.status===s);
          return(
            <div key={s}>
              <div style={{marginBottom:8,padding:'5px 8px',background:'var(--bg3)',borderRadius:'var(--radius)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:10,fontFamily:'var(--mono)',color:'var(--text2)',textTransform:'uppercase'}}>{SL[s]}</span>
                <span style={{fontSize:10,fontFamily:'var(--mono)',color:'var(--text3)',background:'var(--bg4)',padding:'1px 5px',borderRadius:8}}>{sd.length}</span>
              </div>
              {sd.map(d=>(
                <div key={d.id} className="deal-card" onClick={()=>setSel(d)}>
                  <div style={{fontSize:11,fontWeight:500,color:'var(--text)',marginBottom:2,display:'flex',alignItems:'center',gap:4}}>
                    {isToday(d.submittedFull)&&<span className="new-dot"/>}
                    <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',display:'block'}}>{d.business}</span>
                  </div>
                  <div style={{fontSize:10,color:'var(--text3)',fontFamily:'var(--mono)',marginBottom:4}}>{d.id}</div>
                  <div style={{fontSize:11,fontFamily:'var(--mono)',color:d.amount?'var(--teal)':'var(--text3)'}}>{d.amount?f$(d.amount):f$(d.requested)}</div>
                  {d.risk!=null&&<div style={{marginTop:4}}><div className="sb2"><div className="sf" style={{width:d.risk+'%',background:rc(d.risk)}}/></div></div>}
                  {d.profit&&<div style={{fontSize:10,color:'var(--green)',fontFamily:'var(--mono)',marginTop:3}}>+{f$(d.profit)}</div>}
                </div>
              ))}
              {!sd.length&&<div style={{padding:12,textAlign:'center',fontSize:10,color:'var(--text3)'}}>empty</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AllDeals({deals,setSel,setShowNew}){
  const [tab,setTab]=useState('all');
  const [srch,setSrch]=useState('');
  const [sortCol,setSortCol]=useState('submitted');
  const [sortDir,setSortDir]=useState('desc');

  const tabs=[
    {id:'all',l:'All',cnt:deals.length},
    {id:'today',l:'Today',cnt:deals.filter(d=>isToday(d.submittedFull)).length},
    {id:'active',l:'Active',cnt:deals.filter(d=>!['funded','declined','offered'].includes(d.status)).length},
    {id:'approved',l:'Approved',cnt:deals.filter(d=>['offered','docs','contracts','bankverify'].includes(d.status)).length},
    {id:'funded',l:'Funded',cnt:deals.filter(d=>d.status==='funded').length},
    {id:'declined',l:'Declined',cnt:deals.filter(d=>d.status==='declined').length},
  ];

  const filt=d=>{
    if(srch){
      const s=srch.toLowerCase();
      if(!d.business.toLowerCase().includes(s)&&!d.id.toLowerCase().includes(s)&&!d.broker.toLowerCase().includes(s)&&!d.contact.toLowerCase().includes(s))return false;
    }
    if(tab==='today')return isToday(d.submittedFull);
    if(tab==='active')return!['funded','declined','offered'].includes(d.status);
    if(tab==='approved')return['offered','docs','contracts','bankverify'].includes(d.status);
    if(tab==='funded')return d.status==='funded';
    if(tab==='declined')return d.status==='declined';
    return true;
  };

  const sortFn=(a,b)=>{
    let av,bv;
    if(sortCol==='risk'){av=a.risk||0;bv=b.risk||0;}
    else if(sortCol==='amount'){av=a.amount||a.requested||0;bv=b.amount||b.requested||0;}
    else if(sortCol==='profit'){av=a.profit||0;bv=b.profit||0;}
    else if(sortCol==='business'){av=a.business||'';bv=b.business||'';}
    else{av=a.submittedFull||'';bv=b.submittedFull||'';}
    if(av<bv)return sortDir==='asc'?-1:1;
    if(av>bv)return sortDir==='asc'?1:-1;
    return 0;
  };

  const toggleSort=(col)=>{
    if(sortCol===col)setSortDir(d=>d==='asc'?'desc':'asc');
    else{setSortCol(col);setSortDir('desc');}
  };

  const filtered=deals.filter(filt).sort(sortFn);
  const Th=({col,label})=>(
    <th onClick={()=>toggleSort(col)} style={{cursor:'pointer'}}>
      {label}{sortCol===col?(sortDir==='asc'?' ^':' v'):''}
    </th>
  );

  return(
    <div className="fa">
      <div className="filter-row">
        <div className="search-wrap">
          <span className="search-icon">S</span>
          <input className="fi" placeholder="Search by business, broker, deal #, contact..." value={srch} onChange={e=>setSrch(e.target.value)}/>
        </div>
        <button className="btn bp" onClick={()=>setShowNew(true)}>+ New deal</button>
      </div>

      <div className="tabs">
        {tabs.map(t=>(
          <div key={t.id} className={'tab'+(tab===t.id?' ac':'')} onClick={()=>setTab(t.id)}>
            {t.l}
            <span style={{marginLeft:5,fontSize:10,fontFamily:'var(--mono)',padding:'1px 5px',borderRadius:8,background:tab===t.id?'var(--bg4)':'var(--bg3)',color:tab===t.id?'var(--accent)':'var(--text3)'}}>{t.cnt}</span>
          </div>
        ))}
      </div>

      {tab==='funded'&&filtered.length>0&&(
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:14}}>
          <div className="sc2" style={{padding:'12px 14px'}}><div className="sl2">Total funded</div><div className="sv" style={{fontSize:18,color:'var(--green)'}}>{f$(filtered.reduce((s,d)=>s+(d.amount||0),0))}</div></div>
          <div className="sc2" style={{padding:'12px 14px'}}><div className="sl2">Total profit</div><div className="sv" style={{fontSize:18,color:'var(--teal)'}}>{f$(filtered.reduce((s,d)=>s+(d.profit||0),0))}</div></div>
          <div className="sc2" style={{padding:'12px 14px'}}><div className="sl2">Avg deal</div><div className="sv" style={{fontSize:18}}>{f$(Math.round(filtered.reduce((s,d)=>s+(d.amount||0),0)/Math.max(1,filtered.length)))}</div></div>
        </div>
      )}

      {tab==='declined'&&filtered.length>0&&(
        <div style={{marginBottom:14,padding:'10px 14px',background:'#ef444410',border:'1px solid #ef444430',borderRadius:'var(--radius-lg)',display:'flex',gap:24}}>
          <div><div className="sl2">Total declined</div><div style={{fontSize:18,fontWeight:600,fontFamily:'var(--mono)',color:'var(--red)'}}>{filtered.length}</div></div>
          <div><div className="sl2">Decline rate</div><div style={{fontSize:18,fontWeight:600,fontFamily:'var(--mono)',color:'var(--text)'}}>{deals.length>0?Math.round(filtered.length/deals.length*100):0}%</div></div>
        </div>
      )}

      <div className="cd" style={{padding:0}}>
        <div className="tw">
          <table className="pt2">
            <thead>
              <tr>
                <th>Deal #</th>
                <Th col="business" label="Business"/>
                <th>Broker</th>
                <Th col="amount" label="Amount"/>
                <th>Status</th>
                <Th col="risk" label="Risk"/>
                <Th col="profit" label="Profit"/>
                <th>Rates</th>
                <Th col="submitted" label="Date"/>
                <th>Latest note</th>
              </tr>
            </thead>
            <tbody>{filtered.map(d=>(
              <tr key={d.id} onClick={()=>setSel(d)}>
                <td style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text3)',whiteSpace:'nowrap'}}>
                  {d.id}
                  {isToday(d.submittedFull)&&<span style={{marginLeft:4,fontSize:9,background:'var(--green)',color:'#fff',padding:'1px 4px',borderRadius:4}}>NEW</span>}
                </td>
                <td>
                  <div style={{fontWeight:500,color:'var(--text)',maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.business}</div>
                  <div style={{fontSize:11,color:'var(--text3)'}}>{d.contact}</div>
                </td>
                <td style={{color:'var(--text2)',fontSize:12,maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.broker}</td>
                <td style={{fontFamily:'var(--mono)',fontSize:12}}>
                  {d.amount?<span style={{color:'var(--teal)'}}>{f$(d.amount)}</span>:<span style={{color:'var(--text3)'}}>{f$(d.requested)}</span>}
                </td>
                <td><span className={'badge '+sc(d.status)}>{SL[d.status]}</span></td>
                <td>
                  {d.risk!=null&&(
                    <div>
                      <span style={{fontSize:12,fontFamily:'var(--mono)',color:rc(d.risk)}}>{d.risk}</span>
                      <div className="sb2" style={{width:50}}><div className="sf" style={{width:d.risk+'%',background:rc(d.risk)}}/></div>
                    </div>
                  )}
                  {d.risk==null&&<span style={{color:'var(--text3)'}}>--</span>}
                </td>
                <td style={{fontFamily:'var(--mono)',fontSize:12,color:d.profit?'var(--green)':'var(--text3)'}}>{d.profit?f$(d.profit):'--'}</td>
                <td style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text3)',whiteSpace:'nowrap'}}>
                  {d.factor?d.factor+'x / 1.499x':'--'}
                </td>
                <td style={{fontSize:11,color:'var(--text3)',fontFamily:'var(--mono)',whiteSpace:'nowrap'}}>{d.submitted}</td>
                <td style={{fontSize:11,color:'var(--text2)',maxWidth:150,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                  {d.uwNotes?.length>0?d.uwNotes[d.uwNotes.length-1].text:'--'}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {!filtered.length&&<div className="em"><div className="emi">0</div><div className="emt">No deals match</div></div>}
      </div>
    </div>
  );
}

function DealModal({deal,onClose,onUpd,onRefresh}){
  const [tab,setTab]=useState('overview');
  const [note,setNote]=useState('');
  const [cat,setCat]=useState('general');
  const [advancing,setAdvancing]=useState(false);
  const [scrubbing,setScrubbing]=useState(false);

  const steps=['new','scrubbing','underwriting','offered','contracts','bankverify','funded'];
  const idx=steps.indexOf(deal.status);

  const flags=[];
  if(deal.nyCourt&&deal.nyCourt!=='clean')flags.push({t:'red',x:'NY Courts: '+deal.nyCourt});
  if(deal.dataMerch&&deal.dataMerch!=='clean')flags.push({t:'amber',x:'DataMerch: '+deal.dataMerch});
  if(deal.positions>=3)flags.push({t:'red',x:deal.positions+' stacked positions — high risk'});
  else if(deal.positions>=2)flags.push({t:'amber',x:deal.positions+' positions — review stack'});
  if(deal.avgDailyBal&&deal.avgDailyBal<1000)flags.push({t:'red',x:'Avg daily balance below $1,000 minimum'});
  if(deal.monthlyRev&&deal.monthlyRev<35000)flags.push({t:'red',x:'Monthly revenue below $35,000 minimum'});
  if(!flags.length&&deal.risk&&deal.risk>=65)flags.push({t:'green',x:'All checks passed — strong profile'});

  const addNote=()=>{
    if(!note.trim())return;
    const n={id:Date.now(),text:note.trim(),category:cat,author:'Underwriter',time:new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})};
    onUpd({...deal,uwNotes:[...(deal.uwNotes||[]),n]});
    setNote('');
  };

  const advance=async()=>{
    const next=NEXT[deal.status];
    if(!next)return;
    setAdvancing(true);
    try{
      await fetch('/api/deals/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({dbId:deal.dbId,status:next})});
      onUpd({...deal,status:next});
    }catch(e){}
    setAdvancing(false);
  };

  const runScrub=async()=>{
    if(!deal.dbId)return;
    setScrubbing(true);
    try{
      const r=await fetch('/api/scrubber/run',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({dealId:deal.dbId})});
      const data=await r.json();
      if(data.approved!==undefined){
        onUpd({...deal,status:data.approved?'offered':'declined',risk:data.riskScore,amount:data.approvedAmount,factor:data.buyRate});
        onRefresh();
      }
    }catch(e){}
    setScrubbing(false);
  };

  return(
    <div className="mo" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="md fa">
        <button className="mc" onClick={onClose}>x</button>
        <div className="mt">{deal.business}</div>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16,flexWrap:'wrap'}}>
          <span style={{fontSize:11,color:'var(--text3)',fontFamily:'var(--mono)'}}>{deal.id}</span>
          <span className={'badge '+sc(deal.status)}>{SL[deal.status]}</span>
          <span style={{fontSize:12,color:'var(--text3)'}}>via {deal.broker}</span>
          {isToday(deal.submittedFull)&&<span style={{fontSize:10,background:'var(--green)',color:'#fff',padding:'2px 8px',borderRadius:10,fontFamily:'var(--mono)'}}>Today</span>}
          {deal.uwNotes?.length>0&&<span style={{fontSize:11,fontFamily:'var(--mono)',color:'var(--purple)',background:'#a78bfa15',border:'1px solid #a78bfa30',padding:'2px 8px',borderRadius:10}}>{deal.uwNotes.length} note{deal.uwNotes.length!==1?'s':''}</span>}
        </div>

        {deal.status!=='declined'&&(
          <div className="ps">
            {steps.map((s,i)=>(
              <div key={s} className={'pst'+(i<idx?' dn':i===idx?' av':'')}>
                <div className="psd">{i<idx?'v':i+1}</div>
                <div className="psl">{SL[s]}</div>
              </div>
            ))}
          </div>
        )}

        {deal.status==='declined'&&(
          <div style={{marginBottom:16,padding:'10px 14px',background:'#ef444412',border:'1px solid #ef444430',borderRadius:'var(--radius)',display:'flex',alignItems:'center',gap:10}}>
            <div style={{fontSize:13,fontWeight:500,color:'var(--red)'}}>Deal declined</div>
            {deal.uwNotes?.find(n=>n.category==='risk')&&<div style={{fontSize:12,color:'var(--text3)',marginLeft:8}}>{deal.uwNotes.find(n=>n.category==='risk').text.slice(0,100)}</div>}
          </div>
        )}

        <div className="tabs">
          {['overview','underwriting','documents','notes','timeline'].map(t=>(
            <div key={t} className={'tab'+(tab===t?' ac':'')} onClick={()=>setTab(t)} style={{textTransform:'capitalize',position:'relative'}}>
              {t}
              {t==='notes'&&deal.uwNotes?.length>0&&<span style={{position:'absolute',top:6,right:2,width:6,height:6,borderRadius:'50%',background:'var(--purple)'}}/>}
            </div>
          ))}
        </div>

        {tab==='overview'&&(
          <div>
            {deal.amount&&(
              <div className="oc" style={{marginBottom:14}}>
                <div className="ol">Approved offer</div>
                <div className="oa">{f$(deal.amount)}</div>
                <div className="om">
                  <div><div className="omv">{deal.factor}x</div><div className="oml">Buy rate</div></div>
                  <div><div className="omv">1.499x</div><div className="oml">Sell rate</div></div>
                  <div><div className="omv">{deal.termDays||((deal.term||0)*30)} days</div><div className="oml">Term</div></div>
                  <div><div className="omv" style={{color:'var(--green)'}}>{f$(deal.profit)}</div><div className="oml">Our profit</div></div>
                  {deal.balance&&<div><div className="omv" style={{color:'var(--amber)'}}>{f$(deal.balance)}</div><div className="oml">Balance</div></div>}
                </div>
              </div>
            )}
            {deal.amount&&(
              <div className="profit-box" style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
                  <div><div className="sl2">Merchant payback</div><div style={{fontSize:15,fontFamily:'var(--mono)',color:'var(--text)'}}>{f$(deal.merchantPayback)}</div></div>
                  <div><div className="sl2">Our cost</div><div style={{fontSize:15,fontFamily:'var(--mono)',color:'var(--text)'}}>{f$(Math.round(deal.amount*deal.factor))}</div></div>
                  <div><div className="sl2">Our profit</div><div style={{fontSize:15,fontFamily:'var(--mono)',color:'var(--green)',fontWeight:600}}>{f$(deal.profit)}</div></div>
                  <div><div className="sl2">Daily payment</div><div style={{fontSize:15,fontFamily:'var(--mono)',color:'var(--amber)'}}>{f$(deal.merchantPayback&&deal.termDays?Math.round(deal.merchantPayback/deal.termDays):null)}</div></div>
                </div>
              </div>
            )}
            <div className="df">
              <div className="dff"><div className="dl">Contact</div><div className="dv">{deal.contact||'--'}</div></div>
              <div className="dff"><div className="dl">Email</div><div className="dv" style={{fontSize:12}}>{deal.contactEmail||'--'}</div></div>
              <div className="dff"><div className="dl">Requested</div><div className="dv">{f$(deal.requested)}</div></div>
              <div className="dff"><div className="dl">Submitted</div><div className="dv">{deal.submitted}</div></div>
              <div className="dff"><div className="dl">Monthly revenue</div><div className="dv" style={{color:deal.monthlyRev>=35000?'var(--green)':deal.monthlyRev?'var(--red)':'var(--text)'}}>{f$(deal.monthlyRev)}</div></div>
              <div className="dff"><div className="dl">Avg daily balance</div><div className="dv" style={{color:deal.avgDailyBal>=1000?'var(--green)':deal.avgDailyBal?'var(--red)':'var(--text)'}}>{f$(deal.avgDailyBal)}</div></div>
            </div>
            {deal.notes&&<div style={{marginTop:10,padding:'8px 12px',background:'var(--bg3)',borderRadius:'var(--radius)',fontSize:12,color:'var(--text2)'}}>{deal.notes.slice(0,300)}</div>}
          </div>
        )}

        {tab==='underwriting'&&(
          <div>
            <div style={{marginBottom:14}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                <span style={{fontSize:13,color:'var(--text)'}}>Risk score</span>
                <span style={{fontSize:14,fontFamily:'var(--mono)',color:rc(deal.risk||0)}}>{deal.risk!=null?deal.risk+'/100':'Pending'}</span>
              </div>
              {deal.risk!=null&&<div className="sb2" style={{height:8}}><div className="sf" style={{width:deal.risk+'%',background:rc(deal.risk)}}/></div>}
            </div>
            <div className="df" style={{marginBottom:14}}>
              <div className="dff"><div className="dl">Positions</div><div className="dv" style={{color:deal.positions>=3?'var(--red)':deal.positions>=2?'var(--amber)':'var(--green)'}}>{deal.positions} position{deal.positions!==1?'s':''}</div></div>
              <div className="dff"><div className="dl">NY Courts</div><div className="dv" style={{color:deal.nyCourt==='clean'?'var(--green)':'var(--red)'}}>{deal.nyCourt||'Pending'}</div></div>
              <div className="dff"><div className="dl">DataMerch</div><div className="dv" style={{color:deal.dataMerch==='clean'?'var(--green)':'var(--amber)'}}>{deal.dataMerch||'Pending'}</div></div>
              <div className="dff"><div className="dl">Avg daily bal</div><div className="dv">{f$(deal.avgDailyBal)}</div></div>
            </div>
            {flags.map((fl,i)=><div key={i} className={'rf '+fl.t}><span style={{fontSize:12,color:'var(--text2)'}}>{fl.x}</span></div>)}
            {!flags.length&&<div style={{textAlign:'center',padding:20,color:'var(--text3)',fontSize:13}}>Run scrubber to see full underwriting analysis</div>}
          </div>
        )}

        {tab==='documents'&&(
          <div>
            {[
              {n:'Bank statements (3 months)',ok:deal.status!=='new'},
              {n:'Voided check',ok:['contracts','bankverify','funded'].includes(deal.status)},
              {n:'Photo ID',ok:['contracts','bankverify','funded'].includes(deal.status)},
              {n:'Signed contract',ok:['bankverify','funded'].includes(deal.status)},
              {n:'Business license',ok:false},
            ].map((d,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 12px',background:'var(--bg3)',borderRadius:'var(--radius)',marginBottom:8}}>
                <span style={{fontSize:13,color:'var(--text)'}}>{d.n}</span>
                <span className={'badge '+(d.ok?'badge-funded':'badge-underwriting')}>{d.ok?'received':'pending'}</span>
              </div>
            ))}
            <div className="uz" style={{marginTop:8}}>
              <div style={{fontSize:13,color:'var(--text2)'}}>Drop files here or click to upload</div>
              <div style={{fontSize:11,color:'var(--text3)',marginTop:4}}>PDF, JPG, PNG up to 20MB</div>
            </div>
          </div>
        )}

        {tab==='notes'&&(
          <div>
            <div style={{marginBottom:14,padding:14,background:'var(--bg3)',borderRadius:'var(--radius-lg)',border:'1px solid var(--border2)'}}>
              <div style={{fontSize:12,fontWeight:500,color:'var(--text)',marginBottom:10}}>Add underwriter note</div>
              <div style={{display:'flex',gap:5,marginBottom:10,flexWrap:'wrap'}}>
                {['general','risk','approval','condition','followup'].map(c=>(
                  <button key={c} onClick={()=>setCat(c)} style={{padding:'3px 10px',borderRadius:20,fontSize:11,cursor:'pointer',border:'1px solid '+(cat===c?cc[c]:'var(--border)'),background:cat===c?cc[c]+'22':'transparent',color:cat===c?cc[c]:'var(--text3)',transition:'all .15s',fontFamily:'var(--font)'}}>{c}</button>
                ))}
              </div>
              <textarea className="fi" style={{minHeight:64,marginBottom:8}} placeholder="Add your underwriting note..." value={note} onChange={e=>setNote(e.target.value)}/>
              <button className="btn bp bs" onClick={addNote} disabled={!note.trim()}>Save note</button>
            </div>
            {!(deal.uwNotes||[]).length&&<div className="em"><div className="emi">N</div><div className="emt">No notes yet</div></div>}
            {(deal.uwNotes||[]).slice().reverse().map(n=>(
              <div key={n.id} className={'note-card '+(n.category||'general')}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                  <span style={{fontSize:10,fontFamily:'var(--mono)',textTransform:'uppercase',color:cc[n.category]||'var(--text3)'}}>{n.category}</span>
                  <span style={{fontSize:11,color:'var(--text3)',fontFamily:'var(--mono)'}}>{n.author} - {n.time}</span>
                </div>
                <div style={{fontSize:13,color:'var(--text)',lineHeight:1.5}}>{n.text}</div>
              </div>
            ))}
          </div>
        )}

        {tab==='timeline'&&(
          <div className="tl">
            {[
              {t:deal.submitted+' 09:00',x:'Deal submitted via email',d:''},
              deal.status!=='new'&&{t:deal.submitted,x:'AI scrubber started automatically',d:''},
              deal.risk&&{t:deal.submitted,x:'Scrub complete - risk score '+deal.risk+'/100 | NY courts: '+(deal.nyCourt||'--')+' | DataMerch: '+(deal.dataMerch||'--'),d:deal.risk>=65?'green':'amber'},
              deal.amount&&{t:deal.submitted,x:'Offer priced: '+f$(deal.amount)+' @ '+deal.factor+'x buy / 1.499x sell | Profit: '+f$(deal.profit),d:'green'},
              deal.status==='funded'&&{t:deal.funded||'',x:'Funded - ACH disbursement sent',d:'green'},
              deal.status==='declined'&&{t:deal.submitted,x:'Deal declined',d:'red'},
              ...(deal.uwNotes||[]).map(n=>({t:n.time,x:n.author+' added note: "'+n.text.slice(0,60)+'"',d:''})),
            ].filter(Boolean).map((e,i)=>(
              <div key={i} className="tli">
                <div className={'tld '+e.d}/>
                <div><div className="tltx">{e.x}</div><div className="tlt">{e.t}</div></div>
              </div>
            ))}
          </div>
        )}

        <div className="dv2"/>
        <div className="action-bar">
          {['new','scrubbing','underwriting'].includes(deal.status)&&(
            <button className="btn bam bs" onClick={runScrub} disabled={scrubbing}>
              {scrubbing?'Scrubbing...':'Run AI Scrub'}
            </button>
          )}
          {deal.status==='offered'&&<button className="btn bp bs" onClick={()=>{onUpd({...deal,status:'contracts'});onClose()}}>Generate contracts</button>}
          {deal.status==='contracts'&&<button className="btn bp bs">Send via DocuSign</button>}
          {deal.status==='bankverify'&&<button className="btn bsu bs" onClick={()=>{onUpd({...deal,status:'funded'});onClose()}}>Mark funded</button>}
          {!['funded','declined'].includes(deal.status)&&NEXT[deal.status]&&(
            <button className="btn bg bs" onClick={advance} disabled={advancing}>
              {advancing?'...':'Advance to '+SL[NEXT[deal.status]]}
            </button>
          )}
          {!['funded','declined'].includes(deal.status)&&<button className="btn bd bs" onClick={()=>{onUpd({...deal,status:'declined'});onClose()}}>Decline deal</button>}
          <button className="btn bg bs" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function NewDeal({onClose,onSave}){
  const [f,setF]=useState({business:'',contact:'',email:'',broker:'',requested:'',notes:''});
  const [step,setStep]=useState(0);
  const [res,setRes]=useState(null);
  const set=(k,v)=>setF(x=>({...x,[k]:v}));

  const run=()=>{
    setStep(1);
    setTimeout(()=>{
      const risk=Math.floor(Math.random()*50+40);
      setRes({risk,avgDailyBal:Math.floor(Math.random()*15000+2000),monthlyRev:Math.floor(Math.random()*80000+15000),nyCourt:Math.random()>.8?'1 default':'clean',dataMerch:Math.random()>.9?'flagged':'clean'});
      setStep(2);
    },2500);
  };

  const save=()=>{
    const r=res||{};const risk=r.risk||null;
    const amount=risk>=50?Math.round(parseInt(f.requested||0)*0.85/1000)*1000:null;
    onSave({
      id:'D-NEW-'+Date.now(),dbId:null,
      business:f.business,contact:f.contact,contactEmail:f.email,
      broker:f.broker,requested:parseInt(f.requested)||0,
      status:risk>=50?'offered':'declined',risk,
      factor:risk>=70?1.22:risk>=60?1.29:1.38,
      term:risk>=70?4:3,termDays:risk>=70?120:90,
      positions:0,avgDailyBal:r.avgDailyBal||null,
      monthlyRev:r.monthlyRev||null,
      nyCourt:r.nyCourt||null,dataMerch:r.dataMerch||null,
      amount,submitted:new Date().toISOString().slice(0,10),
      submittedFull:new Date().toISOString(),
      funded:null,balance:null,notes:f.notes,uwNotes:[],
      profit:amount?Math.round(amount*(1.499-(risk>=70?1.22:risk>=60?1.29:1.38))):null,
      merchantPayback:amount?Math.round(amount*1.499):null,
    });
    onClose();
  };

  return(
    <div className="mo" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="md fa">
        <button className="mc" onClick={onClose}>x</button>
        <div className="mt">New deal intake</div>
        <div style={{fontSize:13,color:'var(--text3)',marginBottom:18}}>Submit a deal for automated scrubbing and underwriting</div>
        <div className="ps" style={{marginBottom:20}}>
          {['Application','AI Scrubbing','Decision'].map((s,i)=>(
            <div key={i} className={'pst'+(i<step?' dn':i===step?' av':'')}>
              <div className="psd">{i<step?'v':i+1}</div>
              <div className="psl">{s}</div>
            </div>
          ))}
        </div>
        {step===0&&(
          <>
            <div className="fg">
              <div className="fgg"><label className="fl">Business name *</label><input className="fi" placeholder="Acme Corp LLC" value={f.business} onChange={e=>set('business',e.target.value)}/></div>
              <div className="fgg"><label className="fl">Contact name</label><input className="fi" placeholder="John Smith" value={f.contact} onChange={e=>set('contact',e.target.value)}/></div>
              <div className="fgg"><label className="fl">Contact email</label><input className="fi" placeholder="john@business.com" type="email" value={f.email} onChange={e=>set('email',e.target.value)}/></div>
              <div className="fgg"><label className="fl">Broker / ISO *</label><input className="fi" placeholder="Broker name or email" value={f.broker} onChange={e=>set('broker',e.target.value)}/></div>
              <div className="fgg"><label className="fl">Amount requested</label><input className="fi" placeholder="50000" type="number" value={f.requested} onChange={e=>set('requested',e.target.value)}/></div>
              <div className="fgg"><label className="fl">Notes</label><textarea className="fi" placeholder="Position info, industry, context..." value={f.notes} onChange={e=>set('notes',e.target.value)}/></div>
            </div>
            <div style={{marginTop:16,display:'flex',gap:8}}>
              <button className="btn bp" onClick={run} disabled={!f.business||!f.broker}>Run AI Scrubber</button>
              <button className="btn bg bs" onClick={onClose}>Cancel</button>
            </div>
          </>
        )}
        {step===1&&(
          <div style={{textAlign:'center',padding:'40px 0'}}>
            <div className="sp" style={{width:28,height:28,borderWidth:3,marginBottom:16}}/>
            <div style={{fontSize:14,color:'var(--text)',marginBottom:8}}>Running automated scrub...</div>
            <div style={{fontSize:12,color:'var(--text3)'}}>Checking guidelines - NY Courts - DataMerch</div>
          </div>
        )}
        {step===2&&res&&(
          <div className="fa">
            <div className="df" style={{marginBottom:14}}>
              <div className="dff"><div className="dl">Risk score</div><div className="dv" style={{color:rc(res.risk)}}>{res.risk}/100</div></div>
              <div className="dff"><div className="dl">Avg daily balance</div><div className="dv">{f$(res.avgDailyBal)}</div></div>
              <div className="dff"><div className="dl">NY Courts</div><div className="dv" style={{color:res.nyCourt==='clean'?'var(--green)':'var(--red)'}}>{res.nyCourt}</div></div>
              <div className="dff"><div className="dl">DataMerch</div><div className="dv" style={{color:res.dataMerch==='clean'?'var(--green)':'var(--amber)'}}>{res.dataMerch}</div></div>
              <div className="dff"><div className="dl">Decision</div><div className="dv" style={{color:res.risk>=50?'var(--green)':'var(--red)'}}>{res.risk>=50?'APPROVE':'DECLINE'}</div></div>
              <div className="dff"><div className="dl">Sell rate</div><div className="dv">1.499x (fixed)</div></div>
            </div>
            {res.risk>=50&&(
              <div className="oc" style={{marginBottom:14}}>
                <div className="ol">Suggested offer</div>
                <div className="oa">{f$(Math.round(parseInt(f.requested||0)*0.85/1000)*1000)}</div>
                <div className="om">
                  <div><div className="omv">{res.risk>=70?'1.22x':res.risk>=60?'1.29x':'1.38x'}</div><div className="oml">Buy rate</div></div>
                  <div><div className="omv">1.499x</div><div className="oml">Sell rate</div></div>
                  <div><div className="omv">{res.risk>=70?'120':'90'} days</div><div className="oml">Term</div></div>
                </div>
              </div>
            )}
            <div style={{display:'flex',gap:8}}>
              <button className="btn bp" onClick={save}>{res.risk>=50?'Submit deal':'Save as declined'}</button>
              <button className="btn bg bs" onClick={onClose}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BrokersPage({deals}){
  const [sel,setSel]=useState(null);
  const brokerMap={};
  deals.forEach(d=>{
    const k=d.broker;
    if(!k||k==='Unknown')return;
    if(!brokerMap[k])brokerMap[k]={name:k,total:0,funded:0,declined:0,volume:0,active:0};
    brokerMap[k].total++;
    if(d.status==='funded'){brokerMap[k].funded++;brokerMap[k].volume+=d.amount||0;}
    if(d.status==='declined')brokerMap[k].declined++;
    if(!['funded','declined'].includes(d.status))brokerMap[k].active++;
  });
  const brokers=Object.values(brokerMap).sort((a,b)=>b.total-a.total);

  return(
    <div className="fa">
      <div style={{display:'grid',gridTemplateColumns:'260px 1fr',gap:14}}>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <div style={{fontSize:11,color:'var(--text3)',marginBottom:4,fontFamily:'var(--mono)',textTransform:'uppercase',letterSpacing:'1px'}}>{brokers.length} ISO shops</div>
          {brokers.map(b=>(
            <div key={b.name} className="cd cds" style={{cursor:'pointer',borderColor:sel?.name===b.name?'var(--accent)':'var(--border)',transition:'border-color .15s'}} onClick={()=>setSel(b)}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                <div className="av" style={{fontSize:10}}>{b.name.slice(0,2).toUpperCase()}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:500,color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.name}</div>
                </div>
              </div>
              <div style={{display:'flex',gap:10,fontSize:11,fontFamily:'var(--mono)'}}>
                <span style={{color:'var(--text3)'}}>Deals: <span style={{color:'var(--text)'}}>{b.total}</span></span>
                <span style={{color:'var(--text3)'}}>Funded: <span style={{color:'var(--green)'}}>{b.funded}</span></span>
                {b.active>0&&<span style={{color:'var(--text3)'}}>Active: <span style={{color:'var(--amber)'}}>{b.active}</span></span>}
              </div>
            </div>
          ))}
          {!brokers.length&&<div className="em"><div className="emi">--</div><div className="emt">No brokers yet</div></div>}
        </div>

        {sel?(
          <div className="fa">
            <div className="cd" style={{marginBottom:12}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                <div className="av" style={{width:42,height:42,fontSize:14}}>{sel.name.slice(0,2).toUpperCase()}</div>
                <div style={{fontSize:17,fontWeight:600,color:'var(--text)',fontFamily:'var(--serif)'}}>{sel.name}</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
                <div className="sc2" style={{padding:'10px 12px'}}><div className="sl2">Volume</div><div className="sv" style={{fontSize:16}}>{f$(sel.volume)}</div></div>
                <div className="sc2" style={{padding:'10px 12px'}}><div className="sl2">Funded</div><div className="sv" style={{fontSize:16,color:'var(--green)'}}>{sel.funded}</div></div>
                <div className="sc2" style={{padding:'10px 12px'}}><div className="sl2">In pipeline</div><div className="sv" style={{fontSize:16,color:'var(--amber)'}}>{sel.active}</div></div>
                <div className="sc2" style={{padding:'10px 12px'}}><div className="sl2">Conversion</div><div className="sv" style={{fontSize:16}}>{sel.total>0?Math.round(sel.funded/sel.total*100):0}%</div></div>
              </div>
            </div>
            <div className="cd" style={{padding:0}}>
              <div style={{padding:'12px 14px',borderBottom:'1px solid var(--border)',fontSize:13,fontWeight:500,color:'var(--text)'}}>Deals from {sel.name}</div>
              <table className="pt2">
                <thead><tr><th>ID</th><th>Business</th><th>Amount</th><th>Status</th><th>Risk</th></tr></thead>
                <tbody>{deals.filter(d=>d.broker===sel.name).map(d=>(
                  <tr key={d.id}>
                    <td style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text3)'}}>{d.id}</td>
                    <td style={{color:'var(--text)',fontWeight:500}}>{d.business}</td>
                    <td style={{fontFamily:'var(--mono)',fontSize:12,color:d.amount?'var(--teal)':'var(--text3)'}}>{d.amount?f$(d.amount):f$(d.requested)}</td>
                    <td><span className={'badge '+sc(d.status)}>{SL[d.status]}</span></td>
                    <td>{d.risk!=null?<span style={{fontSize:12,fontFamily:'var(--mono)',color:rc(d.risk)}}>{d.risk}</span>:'--'}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        ):(
          <div className="em" style={{marginTop:60}}><div className="emi">--</div><div className="emt">Select a broker to view their deals</div></div>
        )}
      </div>
    </div>
  );
}

function ContractsPage({deals}){
  const cd=deals.filter(d=>['contracts','bankverify','funded'].includes(d.status));
  return(
    <div className="fa">
      <div style={{marginBottom:16,fontSize:13,color:'var(--text3)'}}>DocuSign integration - contracts auto-generated on offer acceptance</div>
      {cd.map(d=>(
        <div key={d.id} className="cd cds" style={{display:'flex',alignItems:'center',gap:14,marginBottom:8}}>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>{d.business}</div>
            <div style={{fontSize:11,color:'var(--text3)',fontFamily:'var(--mono)'}}>{d.id} - {d.broker}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:13,fontFamily:'var(--mono)',color:'var(--teal)'}}>{f$(d.amount)}</div>
            <div style={{fontSize:10,color:'var(--text3)',fontFamily:'var(--mono)'}}>{d.factor}x buy / 1.499x sell</div>
          </div>
          <span className={'badge '+sc(d.status)}>{SL[d.status]}</span>
          {d.status==='contracts'?<button className="btn bp bs">Send DocuSign</button>:<button className="btn bg bs">View</button>}
        </div>
      ))}
      {!cd.length&&<div className="em"><div className="emi">--</div><div className="emt">No contracts yet</div></div>}
    </div>
  );
}

function BrokerPortal({deals}){
  const brokers=[...new Set(deals.map(d=>d.broker).filter(b=>b&&b!=='Unknown'))];
  const [br,setBr]=useState(brokers[0]||'');
  const md=deals.filter(d=>d.broker===br);
  const mf=md.filter(d=>d.status==='funded');
  return(
    <div className="fa">
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16,padding:'12px 16px',background:'var(--bg3)',borderRadius:'var(--radius-lg)',border:'1px solid var(--border)'}}>
        <div className="av">{(br||'??').slice(0,2).toUpperCase()}</div>
        <div><div style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>{br||'Select broker'}</div><div style={{fontSize:11,color:'var(--text3)'}}>Broker portal view</div></div>
        <div style={{marginLeft:'auto'}}>
          <select className="fi" style={{width:200}} value={br} onChange={e=>setBr(e.target.value)}>
            <option value="">Select broker...</option>
            {brokers.map((b,i)=><option key={i} value={b}>{b}</option>)}
          </select>
        </div>
      </div>
      <div className="sg">
        <div className="sc2"><div className="sl2">Active deals</div><div className="sv">{md.filter(d=>!['funded','declined'].includes(d.status)).length}</div></div>
        <div className="sc2"><div className="sl2">Funded</div><div className="sv" style={{color:'var(--green)'}}>{mf.length}</div></div>
        <div className="sc2"><div className="sl2">Total volume</div><div className="sv" style={{fontSize:16}}>{f$(mf.reduce((s,d)=>s+(d.amount||0),0))}</div></div>
        <div className="sc2"><div className="sl2">Conversion</div><div className="sv">{md.length>0?Math.round(mf.length/md.length*100):0}%</div></div>
      </div>
      <div className="cd" style={{padding:0}}>
        <table className="pt2">
          <thead><tr><th>Business</th><th>Requested</th><th>Offer</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{md.map(d=>(
            <tr key={d.id}>
              <td><div style={{fontWeight:500,color:'var(--text)'}}>{d.business}</div><div style={{fontSize:11,color:'var(--text3)',fontFamily:'var(--mono)'}}>{d.id}</div></td>
              <td style={{fontFamily:'var(--mono)',fontSize:12}}>{f$(d.requested)}</td>
              <td style={{fontFamily:'var(--mono)',fontSize:12,color:d.amount?'var(--teal)':'var(--text3)'}}>{d.amount?f$(d.amount):'Pending'}</td>
              <td><span className={'badge '+sc(d.status)}>{SL[d.status]}</span></td>
              <td>{d.status==='offered'?<button className="btn bp bs">Present offer</button>:d.status==='funded'?<button className="btn bg bs">Statement</button>:'--'}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function MerchantPortal({deals}){
  const fd=deals.filter(d=>d.status==='funded');
  const [sel,setSel]=useState(fd[0]);
  const po=sel&&sel.balance?Math.round(sel.balance*1.02):0;
  return(
    <div className="fa">
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16,padding:'12px 16px',background:'var(--bg3)',borderRadius:'var(--radius-lg)',border:'1px solid var(--border)'}}>
        <div className="av" style={{background:'linear-gradient(135deg,var(--teal),var(--accent2))'}}>M</div>
        <div><div style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>Merchant Portal</div><div style={{fontSize:11,color:'var(--text3)'}}>Balance - letters - performance</div></div>
        <div style={{marginLeft:'auto'}}>
          <select className="fi" style={{width:220}} value={sel?.id||''} onChange={e=>setSel(fd.find(d=>d.id===e.target.value))}>
            {fd.map(d=><option key={d.id} value={d.id}>{d.business} - {d.id}</option>)}
          </select>
        </div>
      </div>
      {sel?(
        <div className="fa">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:16}}>
            <div className="oc">
              <div className="ol">Outstanding balance</div>
              <div className="oa" style={{color:'var(--amber)'}}>{f$(sel.balance)}</div>
              <div style={{marginTop:6,fontSize:11,color:'var(--text3)'}}>of {f$(sel.amount)} funded</div>
              <div style={{marginTop:8,height:4,background:'#ffffff20',borderRadius:2}}><div style={{height:'100%',borderRadius:2,background:'var(--teal)',width:(sel.amount&&sel.balance?Math.round((1-sel.balance/sel.amount)*100):0)+'%'}}/></div>
              <div style={{marginTop:3,fontSize:10,color:'var(--text3)',fontFamily:'var(--mono)'}}>{sel.amount&&sel.balance?Math.round((1-sel.balance/sel.amount)*100):0}% paid</div>
            </div>
            <div className="cd">
              <div className="dl">Payoff amount</div>
              <div style={{fontSize:22,fontWeight:600,fontFamily:'var(--mono)',color:'var(--text)',margin:'6px 0'}}>{f$(po)}</div>
              <div style={{fontSize:11,color:'var(--text3)',marginBottom:10}}>includes 2% early payoff fee</div>
              <button className="btn bg bs" style={{width:'100%'}}>Request payoff letter</button>
            </div>
            <div className="cd">
              <div className="dl">Documents</div>
              <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:8}}>
                <button className="btn bg bs">Balance letter</button>
                <button className="btn bg bs">Payment history</button>
                <button className="btn bg bs">Contract copy</button>
              </div>
            </div>
          </div>
          {sel.balance&&sel.amount&&sel.balance/sel.amount<=0.5&&(
            <div style={{padding:'12px 16px',background:'#1a2a1a',border:'1px solid #10b98140',borderRadius:'var(--radius-lg)',display:'flex',alignItems:'center',gap:12}}>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:'var(--green)',marginBottom:2}}>Eligible for renewal!</div><div style={{fontSize:12,color:'var(--text3)'}}>You have paid over 50% - contact your broker to discuss renewal options</div></div>
              <button className="btn bsu bs">Request renewal</button>
            </div>
          )}
        </div>
      ):(
        <div className="em"><div className="emi">--</div><div className="emt">No funded deals yet</div></div>
      )}
    </div>
  );
}

function MktPage({type}){
  return(
    <div className="fa">
      <div style={{marginBottom:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:13,color:'var(--text3)'}}>{type==='broker'?'Email and SMS campaigns for your ISO network':'Automated communications for funded merchants'}</div>
        <button className="btn bp bs">+ New campaign</button>
      </div>
      <div className="cd">
        <div style={{textAlign:'center',padding:'30px 0'}}>
          <div style={{fontSize:13,color:'var(--text)',marginBottom:8,fontWeight:500}}>Campaign builder coming soon</div>
          <div style={{fontSize:12,color:'var(--text3)'}}>Connect SendGrid or Mailchimp to start sending automated campaigns to your {type==='broker'?'ISO partners':'merchant clients'}</div>
        </div>
      </div>
    </div>
  );
}

function SettingsPage(){
  const settings=[
    {title:'Underwriting guidelines',desc:'Risk score thresholds, position limits, revenue minimums, factor rates'},
    {title:'AI scrubber settings',desc:'Claude API key, pricing rules, industry restrictions'},
    {title:'Gmail integration',desc:'Inbox settings, deal detection keywords, OAuth credentials'},
    {title:'Google Sheets sync',desc:'Sheet IDs, tab names, sync frequency'},
    {title:'DocuSign contracts',desc:'Template ID, signing order, webhook URL'},
    {title:'NY Courts API',desc:'Credentials and search configuration'},
    {title:'DataMerch API',desc:'API key and match threshold settings'},
    {title:'Notifications',desc:'Email alerts on deal status changes'},
    {title:'Security',desc:'Password protection, user access, session settings'},
  ];
  return(
    <div className="fa">
      <div style={{maxWidth:560,display:'flex',flexDirection:'column',gap:10}}>
        {settings.map((s,i)=>(
          <div key={i} className="cd cds" style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer',transition:'border-color .15s'}}
            onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border3)'}
            onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>{s.title}</div>
              <div style={{fontSize:11,color:'var(--text3)',marginTop:2}}>{s.desc}</div>
            </div>
            <span style={{color:'var(--text3)',fontSize:16}}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(React.createElement(App));
      `}</script>
    </>
  )
}
