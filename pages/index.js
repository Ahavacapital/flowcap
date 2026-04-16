export default function Home() {
  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:#0a0c0f;--bg2:#111318;--bg3:#181c23;--bg4:#1e2330;
          --border:#ffffff0f;--border2:#ffffff18;--border3:#ffffff28;
          --text:#e8eaf0;--text2:#8b90a0;--text3:#555a6a;
          --accent:#3b82f6;--green:#10b981;--amber:#f59e0b;
          --red:#ef4444;--purple:#a78bfa;--teal:#14b8a6;
          --font:'DM Sans',sans-serif;--mono:'DM Mono',monospace;
          --serif:'Playfair Display',serif;
          --r:10px;--rl:16px;--rx:22px;
        }
        html,body{height:100%;background:var(--bg);color:var(--text);font-family:var(--font);font-size:14px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow:hidden}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:var(--border3);border-radius:2px}
        #app{height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px}
        .lm{font-family:Georgia,serif;font-size:32px;color:var(--text)}.lm span{color:var(--accent)}
        .ls{font-size:11px;color:var(--text3);letter-spacing:2px;text-transform:uppercase}
        .lb{width:160px;height:2px;background:var(--border2);border-radius:2px;overflow:hidden}
        .lf{height:100%;background:var(--accent);animation:ld 1.5s ease-in-out infinite}
        @keyframes ld{0%{width:0}50%{width:70%}100%{width:100%}}
        #root{height:100vh;width:100vw;display:flex;overflow:hidden;position:fixed;top:0;left:0}
        .sb{width:210px;min-width:210px;height:100%;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0}
        .sb-body{flex:1;overflow-y:auto}
        .mn{flex:1;min-width:0;height:100%;overflow:hidden;display:flex;flex-direction:column}
        .tb{height:52px;min-height:52px;flex-shrink:0;border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 18px;gap:10px;background:var(--bg2)}
        .pg{flex:1;min-height:0;overflow-y:auto;padding:18px}
        .sbl{padding:14px 16px 12px;border-bottom:1px solid var(--border);flex-shrink:0}
        .ns{padding:10px 12px 4px;font-size:10px;color:var(--text3);letter-spacing:1.5px;text-transform:uppercase;font-family:var(--mono)}
        .ni{display:flex;align-items:center;gap:8px;padding:7px 12px;margin:1px 8px;border-radius:var(--r);cursor:pointer;color:var(--text2);font-size:13px;transition:all .15s;position:relative;user-select:none}
        .ni:hover{background:var(--bg3);color:var(--text)}
        .ni.ac{background:var(--bg4);color:var(--text);font-weight:500}
        .ni.ac::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:14px;background:var(--accent);border-radius:0 2px 2px 0}
        .nb{margin-left:auto;background:var(--amber);color:#000;font-size:10px;font-family:var(--mono);padding:1px 6px;border-radius:10px;font-weight:600}
        .sbb{padding:12px;border-top:1px solid var(--border);flex-shrink:0}
        .av{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--accent),#6366f1);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#fff;flex-shrink:0}
        .pt{font-size:14px;font-weight:500;color:var(--text)}
        .tr{margin-left:auto;display:flex;align-items:center;gap:6px}
        .btn{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:var(--r);font-size:12px;font-weight:500;cursor:pointer;border:none;transition:all .15s;font-family:var(--font);white-space:nowrap;user-select:none}
        .btn:disabled{opacity:.5;cursor:not-allowed}
        .bp{background:var(--accent);color:#fff}.bp:hover:not(:disabled){background:#2563eb}
        .bg{background:transparent;color:var(--text2);border:1px solid var(--border2)}.bg:hover:not(:disabled){background:var(--bg3);color:var(--text)}
        .bs{padding:4px 9px;font-size:11px}
        .bd{background:#ef444415;color:var(--red);border:1px solid #ef444430}
        .bsu{background:#10b98115;color:var(--green);border:1px solid #10b98130}
        .bam{background:#f59e0b15;color:var(--amber);border:1px solid #f59e0b30}
        .cd{background:var(--bg2);border:1px solid var(--border);border-radius:var(--rl);padding:16px}
        .cds{padding:11px 13px}
        .sg{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px}
        .sc{background:var(--bg2);border:1px solid var(--border);border-radius:var(--rl);padding:14px 16px}
        .sl{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono)}
        .sv{font-size:20px;font-weight:600;color:var(--text);margin:4px 0 2px;font-family:var(--mono);letter-spacing:-1px}
        .sd{font-size:11px;font-family:var(--mono)}.sd.up{color:var(--green)}.sd.dn{color:var(--red)}
        .t2{width:100%;border-collapse:collapse}
        .t2 th{text-align:left;padding:7px 11px;font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono);border-bottom:1px solid var(--border);font-weight:400;white-space:nowrap;cursor:pointer;user-select:none}
        .t2 th:hover{color:var(--text2)}
        .t2 td{padding:9px 11px;border-bottom:1px solid var(--border);font-size:13px;vertical-align:middle}
        .t2 tr:last-child td{border-bottom:none}
        .t2 tr.cl:hover td{background:var(--bg3);cursor:pointer}
        .badge{display:inline-flex;align-items:center;gap:4px;padding:2px 7px;border-radius:20px;font-size:10px;font-weight:500;font-family:var(--mono);white-space:nowrap}
        .badge::before{content:'';width:4px;height:4px;border-radius:50%;flex-shrink:0}
        .bn{background:#3b82f615;color:#93c5fd;border:1px solid #3b82f625}.bn::before{background:#93c5fd}
        .bsc{background:#6366f115;color:#c4b5fd;border:1px solid #6366f125}.bsc::before{background:#c4b5fd}
        .buw{background:#f59e0b15;color:#fcd34d;border:1px solid #f59e0b25}.buw::before{background:#fcd34d}
        .bof{background:#14b8a615;color:#5eead4;border:1px solid #14b8a625}.bof::before{background:#5eead4}
        .bdo{background:#a78bfa15;color:#c4b5fd;border:1px solid #a78bfa25}.bdo::before{background:#c4b5fd}
        .bco{background:#3b82f615;color:#93c5fd;border:1px solid #3b82f625}.bco::before{background:#93c5fd}
        .bbv{background:#f59e0b15;color:#fcd34d;border:1px solid #f59e0b25}.bbv::before{background:#fcd34d}
        .bfu{background:#10b98115;color:#6ee7b7;border:1px solid #10b98125}.bfu::before{background:#6ee7b7}
        .bde{background:#ef444415;color:#fca5a5;border:1px solid #ef444425}.bde::before{background:#fca5a5}
        .dg{display:grid;grid-template-columns:1fr 1fr;gap:9px}
        .df{background:var(--bg3);border-radius:var(--r);padding:9px 11px}
        .dl{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono);margin-bottom:2px}
        .dv{font-size:13px;color:var(--text);font-weight:500}
        .mo{position:fixed;inset:0;background:#00000095;display:flex;align-items:center;justify-content:center;z-index:100;padding:16px}
        .md{background:var(--bg2);border:1px solid var(--border2);border-radius:var(--rx);width:680px;max-width:100%;max-height:90vh;overflow-y:auto;padding:22px;position:relative}
        .mt{font-size:16px;font-weight:600;color:var(--text);font-family:var(--serif)}
        .mc{position:absolute;top:14px;right:14px;background:var(--bg3);border:none;color:var(--text2);width:26px;height:26px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center}
        .mc:hover{background:var(--bg4);color:var(--text)}
        .fg{display:grid;grid-template-columns:1fr 1fr;gap:11px}
        .fgg{display:flex;flex-direction:column;gap:4px}
        .fgg.full{grid-column:1/-1}
        .fl{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono)}
        .fi{background:var(--bg3);border:1px solid var(--border2);border-radius:var(--r);padding:7px 11px;color:var(--text);font-size:13px;font-family:var(--font);outline:none;transition:border .15s;width:100%}
        .fi:focus{border-color:var(--accent)}
        .fi::placeholder{color:var(--text3)}
        select.fi option{background:var(--bg2)}
        textarea.fi{resize:vertical;min-height:68px}
        .tabs{display:flex;border-bottom:1px solid var(--border);margin-bottom:13px;overflow-x:auto}
        .tab{padding:7px 12px;font-size:12px;color:var(--text3);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;margin-bottom:-1px;white-space:nowrap;user-select:none}
        .tab:hover{color:var(--text2)}
        .tab.ac{color:var(--text);border-bottom-color:var(--accent);font-weight:500}
        .oc{background:linear-gradient(135deg,#0d1f12,#0d1a2a);border:1px solid #3b82f630;border-radius:var(--rx);padding:16px}
        .oa{font-size:28px;font-weight:600;color:var(--text);font-family:var(--mono);letter-spacing:-1px}
        .ol{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono);margin-bottom:3px}
        .om{display:flex;gap:16px;margin-top:11px;flex-wrap:wrap}
        .omv{font-size:13px;font-weight:500;color:var(--text);font-family:var(--mono)}
        .oml{font-size:10px;color:var(--text3);font-family:var(--mono);text-transform:uppercase}
        .sbar{height:5px;background:var(--bg4);border-radius:3px;overflow:hidden}
        .sfill{height:100%;border-radius:3px}
        .ps{display:flex;margin-bottom:16px;overflow-x:auto}
        .pst{flex:1;min-width:55px;text-align:center;padding:4px 2px;position:relative}
        .pst::after{content:'';position:absolute;right:0;top:40%;width:1px;height:40%;background:var(--border)}
        .pst:last-child::after{display:none}
        .psd{width:20px;height:20px;border-radius:50%;border:2px solid var(--border3);margin:0 auto 3px;display:flex;align-items:center;justify-content:center;font-size:9px;color:var(--text3);font-family:var(--mono)}
        .pst.dn .psd{background:var(--green);border-color:var(--green);color:#fff}
        .pst.av .psd{background:var(--accent);border-color:var(--accent);color:#fff}
        .psl{font-size:9px;color:var(--text3);font-family:var(--mono)}
        .pst.av .psl{color:var(--accent)}.pst.dn .psl{color:var(--green)}
        .rf{padding:8px 11px;border-radius:var(--r);background:var(--bg3);border-left:3px solid var(--border3);margin-bottom:7px}
        .rf.red{border-left-color:var(--red)}.rf.amber{border-left-color:var(--amber)}.rf.green{border-left-color:var(--green)}
        .divr{height:1px;background:var(--border);margin:13px 0}
        .em{text-align:center;padding:32px 16px}
        .emt{font-size:13px;color:var(--text3);margin-top:6px}
        .tw{overflow-x:auto}
        .sp{width:16px;height:16px;border:2px solid var(--border3);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
        .nc{padding:9px 11px;background:var(--bg3);border-radius:var(--r);border-left:3px solid var(--border3);margin-bottom:7px}
        .nc.risk{border-left-color:var(--red)}.nc.approval{border-left-color:var(--green)}.nc.condition{border-left-color:var(--amber)}.nc.followup{border-left-color:var(--purple)}.nc.system{border-left-color:var(--accent)}
        .tl{display:flex;flex-direction:column}
        .tli{display:flex;gap:9px;padding:6px 0}
        .tld{width:7px;height:7px;border-radius:50%;background:var(--accent);margin-top:4px;flex-shrink:0;position:relative}
        .tld::after{content:'';position:absolute;left:3px;top:7px;width:1px;height:calc(100% + 6px);background:var(--border2)}
        .tli:last-child .tld::after{display:none}
        .tld.green{background:var(--green)}.tld.red{background:var(--red)}.tld.amber{background:var(--amber)}
        .tlt{font-size:10px;color:var(--text3);font-family:var(--mono);white-space:nowrap;min-width:70px}
        .tltx{font-size:12px;color:var(--text2)}
        .pb{background:linear-gradient(135deg,#091509,#091520);border:1px solid #10b98130;border-radius:var(--rl);padding:11px 14px}
        .dc{background:var(--bg2);border:1px solid var(--border);border-radius:var(--rl);padding:10px;cursor:pointer;transition:border-color .15s;margin-bottom:7px}
        .dc:hover{border-color:var(--border3)}
        .sw{position:relative;flex:1;min-width:160px}
        .sw input{padding-left:28px !important}
        .si{position:absolute;left:9px;top:50%;transform:translateY(-50%);color:var(--text3);font-size:12px;pointer-events:none}
        .fr{display:flex;gap:7px;margin-bottom:11px;flex-wrap:wrap;align-items:center}
        .ar{display:flex;gap:5px;flex-wrap:wrap;padding-top:3px}
        .toast{position:fixed;bottom:18px;right:18px;background:var(--bg2);border:1px solid var(--border2);border-radius:var(--rl);padding:9px 14px;font-size:12px;color:var(--text);z-index:200;box-shadow:0 4px 20px #00000060;animation:sup .2s ease}
        .toast.success{border-color:#10b98140;color:var(--green)}
        .toast.error{border-color:#ef444440;color:var(--red)}
        @keyframes sup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fi{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fa{animation:fi .2s ease forwards}
        @media(max-width:768px){.sb{display:none}.sg{grid-template-columns:1fr 1fr}}
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet"/>
      <div id="app">
        <div className="lm">Flow<span>Cap</span></div>
        <div className="ls">MCA Platform</div>
        <div className="lb"><div className="lf"/></div>
      </div>
      <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js" defer></script>
      <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js" defer></script>
      <script src="https://unpkg.com/@babel/standalone@7.23.0/babel.min.js" defer></script>
      <script type="text/babel" data-type="module">{`

const {useState,useEffect,useCallback,useRef}=React;

const SL={new:'New',scrubbing:'Scrubbing',underwriting:'Underwriting',offered:'Offered',docs:'Docs',contracts:'Contracts',bankverify:'Bank Verify',funded:'Funded',declined:'Declined',renewal:'Renewal'};
const NEXTS={new:'scrubbing',scrubbing:'underwriting',underwriting:'offered',offered:'docs',docs:'contracts',contracts:'bankverify',bankverify:'funded'};
const NCC={general:'var(--text3)',risk:'var(--red)',approval:'var(--green)',condition:'var(--amber)',followup:'var(--purple)',system:'var(--accent)'};
const f$=n=>n!=null?'$'+Number(n).toLocaleString():'--';
const fx=n=>n!=null?Number(n).toFixed(3)+'x':'--';
const rc=r=>r>=70?'var(--green)':r>=50?'var(--amber)':'var(--red)';
const isToday=d=>{if(!d)return false;return new Date(d).toDateString()===new Date().toDateString()};
const bc=s=>({new:'bn',scrubbing:'bsc',underwriting:'buw',offered:'bof',docs:'bdo',contracts:'bco',bankverify:'bbv',funded:'bfu',declined:'bde',renewal:'bfu'}[s]||'bn');

function mapDeal(d){
  const profit=d.amount_approved&&d.factor_rate?Math.round(d.amount_approved*(1.499-d.factor_rate)):null;
  return{
    id:d.deal_number||d.id,dbId:d.id,
    business:d.business_name||'Unknown',
    contact:d.contact_name||'',email:d.contact_email||'',
    broker:d.broker?.name||d.contact_email||'Unknown',
    amount:d.amount_approved||null,requested:d.amount_requested||null,
    status:d.status||'new',risk:d.risk_score||null,
    factor:d.factor_rate||null,
    termDays:d.term_months?d.term_months*30:null,
    positions:d.positions||0,dailyBal:d.avg_daily_balance||null,
    monthlyRev:d.monthly_revenue||null,
    nyCourt:d.ny_court_result||null,dataMerch:d.datamerch_result||null,
    submitted:d.submitted_at?d.submitted_at.slice(0,10):'',
    submittedAt:d.submitted_at||null,
    funded:d.funded_at?d.funded_at.slice(0,10):null,
    balance:d.balance||null,notes:d.notes||'',
    uwNotes:(d.deal_notes||[]).map(n=>({
      id:n.id,text:n.body||'',cat:n.category||'general',
      author:n.author||'System',
      time:n.created_at?new Date(n.created_at).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}):''
    })),
    profit,payback:d.amount_approved?Math.round(d.amount_approved*1.499):null,
  };
}

function Toast({msg,type,onDone}){
  useEffect(()=>{const t=setTimeout(onDone,3000);return()=>clearTimeout(t)},[]);
  return <div className={'toast '+type}>{msg}</div>;
}

function App(){
  const [pg,setPg]=useState('dashboard');
  const [deals,setDeals]=useState([]);
  const [loading,setLoading]=useState(true);
  const [sel,setSel]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [syncing,setSyncing]=useState(false);
  const [toast,setToast]=useState(null);
  const timer=useRef(null);

  const showToast=(msg,type='success')=>setToast({msg,type});

  const loadDeals=useCallback(async()=>{
    try{
      const r=await fetch('/api/deals/list');
      if(!r.ok)throw new Error('HTTP '+r.status);
      const data=await r.json();
      if(Array.isArray(data.deals))setDeals(data.deals.map(mapDeal));
    }catch(e){console.error('Load deals failed:',e.message);}
    setLoading(false);
  },[]);

  useEffect(()=>{
    loadDeals();
    timer.current=setInterval(loadDeals,60000);
    return()=>clearInterval(timer.current);
  },[loadDeals]);

  const syncSheets=async()=>{
    setSyncing(true);
    try{
      const r=await fetch('/api/sheets/sync',{method:'POST',headers:{Authorization:'Bearer flowcap2024secret'}});
      const d=await r.json();
      if(d.success)showToast('Sheets synced - '+d.submissions+' deals');
      else showToast('Sync error: '+d.error,'error');
    }catch(e){showToast('Sync failed','error');}
    setSyncing(false);
  };

  const updDeal=useCallback(u=>setDeals(ds=>ds.map(d=>d.id===u.id?u:d)),[]);
  const addDeal=useCallback(d=>setDeals(ds=>[d,...ds]),[]);

  const active=deals.filter(d=>!['funded','declined'].includes(d.status));
  const funded=deals.filter(d=>d.status==='funded');
  const todayCnt=deals.filter(d=>isToday(d.submittedAt)).length;
  const tf=funded.reduce((s,d)=>s+(d.amount||0),0);
  const tp=deals.reduce((s,d)=>s+(d.profit||0),0);

  if(loading)return(
    <div id="app">
      <div className="lm">Flow<span>Cap</span></div>
      <div className="ls">Loading deals...</div>
      <div className="lb"><div className="lf"/></div>
    </div>
  );

  const pages={dashboard:'Dashboard',pipeline:'Pipeline',deals:'All Deals',brokers:'Brokers / ISO',contracts:'Contracts','broker-portal':'Broker Portal','merchant-portal':'Merchant Portal','mkt-iso':'ISO Campaigns','mkt-merchant':'Merchant Campaigns',settings:'Settings'};

  return(
    <div id="root">
      <div className="sb">
        <div className="sbl">
          <div style={{fontFamily:'var(--serif)',fontSize:18,color:'var(--text)'}}>Flow<span style={{color:'var(--accent)'}}>Cap</span></div>
          <div style={{fontSize:10,color:'var(--text3)',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'var(--mono)'}}>MCA Platform</div>
        </div>
        <div className="sb-body">
          <div className="ns">Operations</div>
          {[{id:'dashboard',l:'Dashboard'},{id:'pipeline',l:'Pipeline',b:active.length},{id:'deals',l:'All Deals'},{id:'brokers',l:'Brokers / ISO'},{id:'contracts',l:'Contracts'}].map(n=>(
            <div key={n.id} className={'ni'+(pg===n.id?' ac':'')} onClick={()=>setPg(n.id)}>
              {n.l}{n.b>0&&<span className="nb">{n.b}</span>}
            </div>
          ))}
          <div className="ns">Portals</div>
          {[{id:'broker-portal',l:'Broker Portal'},{id:'merchant-portal',l:'Merchant Portal'}].map(n=>(
            <div key={n.id} className={'ni'+(pg===n.id?' ac':'')} onClick={()=>setPg(n.id)}>{n.l}</div>
          ))}
          <div className="ns">Marketing</div>
          {[{id:'mkt-iso',l:'ISO Campaigns'},{id:'mkt-merchant',l:'Merchant Campaigns'}].map(n=>(
            <div key={n.id} className={'ni'+(pg===n.id?' ac':'')} onClick={()=>setPg(n.id)}>{n.l}</div>
          ))}
          <div className="ns">System</div>
          <div className={'ni'+(pg==='settings'?' ac':'')} onClick={()=>setPg('settings')}>Settings</div>
        </div>
        <div className="sbb">
          <div style={{display:'flex',alignItems:'center',gap:8,padding:8,borderRadius:'var(--r)',background:'var(--bg3)'}}>
            <div className="av">JD</div>
            <div>
              <div style={{fontSize:12,fontWeight:500,color:'var(--text)'}}>Jamie Donahue</div>
              <div style={{fontSize:10,color:'var(--text3)',fontFamily:'var(--mono)'}}>Admin</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mn">
        <div className="tb">
          <div className="pt">{pages[pg]||pg}</div>
          {todayCnt>0&&<span style={{fontSize:10,color:'var(--green)',background:'#10b98120',border:'1px solid #10b98140',padding:'2px 7px',borderRadius:10,fontFamily:'var(--mono)'}}>{todayCnt} new today</span>}
          <div className="tr">
            <button className="btn bg bs" onClick={loadDeals}>Refresh</button>
            <button className="btn bg bs" onClick={syncSheets} disabled={syncing}>{syncing?'Syncing...':'Sync Sheets'}</button>
            <button className="btn bp" onClick={()=>setShowNew(true)}>+ New deal</button>
          </div>
        </div>
        <div className="pg">
          {pg==='dashboard'&&<Dashboard deals={deals} setPg={setPg} setSel={d=>{setSel(d);setPg('deals')}} tf={tf} tp={tp} active={active} funded={funded} todayCnt={todayCnt}/>}
          {pg==='pipeline'&&<Pipeline deals={deals} setSel={setSel} setShowNew={setShowNew}/>}
          {pg==='deals'&&<AllDeals deals={deals} setSel={setSel} setShowNew={setShowNew}/>}
          {pg==='brokers'&&<Brokers deals={deals}/>}
          {pg==='contracts'&&<Contracts deals={deals}/>}
          {pg==='broker-portal'&&<BrokerPortal deals={deals}/>}
          {pg==='merchant-portal'&&<MerchantPortal deals={deals}/>}
          {(pg==='mkt-iso'||pg==='mkt-merchant')&&<Mkt type={pg}/>}
          {pg==='settings'&&<Settings/>}
        </div>
      </div>

      {sel&&<DealDetail deal={sel} onClose={()=>setSel(null)} onUpdate={d=>{updDeal(d);setSel(d)}} onRefresh={loadDeals} showToast={showToast}/>}
      {showNew&&<NewDeal onClose={()=>setShowNew(false)} onSave={d=>{addDeal(d);setShowNew(false);showToast('Deal created');}}/>}
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
    </div>
  );
}

function Dashboard({deals,setPg,setSel,tf,tp,active,funded,todayCnt}){
  const today=deals.filter(d=>isToday(d.submittedAt));
  const closed=deals.filter(d=>['funded','declined'].includes(d.status));
  const apr=closed.length>0?Math.round(funded.length/closed.length*100):0;
  const declined=deals.filter(d=>d.status==='declined').length;
  return(
    <div className="fa">
      <div className="sg">
        <div className="sc"><div className="sl">Funded (all time)</div><div className="sv" style={{color:'var(--green)'}}>{f$(tf)}</div><div className="sd up">{funded.length} deals</div></div>
        <div className="sc"><div className="sl">Active pipeline</div><div className="sv">{active.length}</div><div className="sd">{todayCnt} new today</div></div>
        <div className="sc"><div className="sl">Total profit</div><div className="sv" style={{color:'var(--teal)'}}>{f$(tp)}</div><div className="sd up">buy/sell spread</div></div>
        <div className="sc"><div className="sl">Approval rate</div><div className="sv">{apr}%</div><div className="sd dn">{declined} declined</div></div>
      </div>
      {today.length>0&&(
        <div style={{marginBottom:14,padding:'9px 13px',background:'#10b98112',border:'1px solid #10b98140',borderRadius:'var(--rl)',display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:'var(--green)',flexShrink:0}}/>
          <div style={{flex:1,fontSize:13}}>
            <span style={{fontWeight:500,color:'var(--green)'}}>{today.length} new deal{today.length!==1?'s':''} today: </span>
            <span style={{color:'var(--text3)'}}>{today.slice(0,3).map(d=>d.business).join(', ')}{today.length>3?' ...':''}</span>
          </div>
          <button className="btn bsu bs" onClick={()=>setPg('deals')}>View</button>
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'1fr 260px',gap:12}}>
        <div className="cd">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:11}}>
            <div style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>Recent deals</div>
            <button className="btn bg bs" onClick={()=>setPg('deals')}>View all</button>
          </div>
          <div className="tw">
            <table className="t2">
              <thead><tr><th>Business</th><th>Broker</th><th>Amount</th><th>Status</th><th>Risk</th><th>Profit</th></tr></thead>
              <tbody>{deals.slice(0,8).map(d=>(
                <tr key={d.id} className="cl" onClick={()=>setSel(d)}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:5}}>
                      {isToday(d.submittedAt)&&<div style={{width:5,height:5,borderRadius:'50%',background:'var(--green)',flexShrink:0}}/>}
                      <div>
                        <div style={{fontWeight:500,color:'var(--text)',maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.business}</div>
                        <div style={{fontSize:10,color:'var(--text3)',fontFamily:'var(--mono)'}}>{d.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{fontSize:12,color:'var(--text2)',maxWidth:100,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.broker}</td>
                  <td style={{fontFamily:'var(--mono)',fontSize:12,color:d.amount?'var(--teal)':'var(--text3)'}}>{d.amount?f$(d.amount):f$(d.requested)}</td>
                  <td><span className={'badge '+bc(d.status)}>{SL[d.status]}</span></td>
                  <td>{d.risk!=null?<span style={{fontSize:12,fontFamily:'var(--mono)',color:rc(d.risk)}}>{d.risk}</span>:'--'}</td>
                  <td style={{fontFamily:'var(--mono)',fontSize:12,color:d.profit?'var(--green)':'var(--text3)'}}>{d.profit?f$(d.profit):'--'}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <div className="cd">
            <div style={{fontSize:12,fontWeight:500,color:'var(--text)',marginBottom:9}}>Pipeline</div>
            {['new','scrubbing','underwriting','offered','contracts','bankverify'].map(s=>{
              const cnt=deals.filter(d=>d.status===s).length;
              if(!cnt)return null;
              return(
                <div key={s} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
                  <span className={'badge '+bc(s)}>{SL[s]}</span>
                  <span style={{fontSize:12,fontFamily:'var(--mono)',color:'var(--text)'}}>{cnt}</span>
                </div>
              );
            })}
          </div>
          <div className="cd">
            <div style={{fontSize:12,fontWeight:500,color:'var(--text)',marginBottom:9}}>Automation</div>
            {[{l:'Gmail watcher',s:'Every 5 min'},{l:'Sheets sync',s:'Every 15 min'},{l:'AI scrubber',s:'Auto on new deals'},{l:'Doc parser',s:'Auto on attachments'}].map((i,x)=>(
              <div key={x} style={{display:'flex',alignItems:'center',gap:7,marginBottom:6}}>
                <div style={{width:5,height:5,borderRadius:'50%',background:'var(--green)',flexShrink:0}}/>
                <div><div style={{fontSize:12,color:'var(--text)',fontWeight:500}}>{i.l}</div><div style={{fontSize:10,color:'var(--text3)'}}>{i.s}</div></div>
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
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:13}}>
        <div style={{fontSize:13,color:'var(--text3)'}}>Active deals in pipeline — click to open</div>
        <button className="btn bp" onClick={()=>setShowNew(true)}>+ New deal</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:7,minWidth:860,overflowX:'auto'}}>
        {stages.map(s=>{
          const sd=deals.filter(d=>d.status===s);
          return(
            <div key={s}>
              <div style={{marginBottom:6,padding:'3px 7px',background:'var(--bg3)',borderRadius:'var(--r)',display:'flex',justifyContent:'space-between'}}>
                <span style={{fontSize:9,fontFamily:'var(--mono)',color:'var(--text2)',textTransform:'uppercase'}}>{SL[s]}</span>
                <span style={{fontSize:9,fontFamily:'var(--mono)',color:'var(--text3)'}}>{sd.length}</span>
              </div>
              {sd.map(d=>(
                <div key={d.id} className="dc" onClick={()=>setSel(d)}>
                  <div style={{fontSize:11,fontWeight:500,color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:2,display:'flex',alignItems:'center',gap:3}}>
                    {isToday(d.submittedAt)&&<div style={{width:4,height:4,borderRadius:'50%',background:'var(--green)',flexShrink:0}}/>}
                    {d.business}
                  </div>
                  <div style={{fontSize:9,color:'var(--text3)',fontFamily:'var(--mono)',marginBottom:3}}>{d.id}</div>
                  <div style={{fontSize:11,fontFamily:'var(--mono)',color:d.amount?'var(--teal)':'var(--text3)'}}>{d.amount?f$(d.amount):f$(d.requested)}</div>
                  {d.risk!=null&&<div style={{marginTop:3}}><div className="sbar"><div className="sfill" style={{width:d.risk+'%',background:rc(d.risk)}}/></div></div>}
                  {d.profit&&<div style={{fontSize:10,color:'var(--green)',fontFamily:'var(--mono)',marginTop:2}}>+{f$(d.profit)}</div>}
                </div>
              ))}
              {!sd.length&&<div style={{padding:10,textAlign:'center',fontSize:10,color:'var(--text3)'}}>empty</div>}
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
  const [sc,setSc]=useState('submitted');
  const [sd,setSD]=useState('desc');

  const tabs=[
    {id:'all',l:'All',n:deals.length},
    {id:'today',l:'Today',n:deals.filter(d=>isToday(d.submittedAt)).length},
    {id:'active',l:'Active',n:deals.filter(d=>!['funded','declined','offered'].includes(d.status)).length},
    {id:'approved',l:'Approved',n:deals.filter(d=>['offered','docs','contracts','bankverify'].includes(d.status)).length},
    {id:'funded',l:'Funded',n:deals.filter(d=>d.status==='funded').length},
    {id:'declined',l:'Declined',n:deals.filter(d=>d.status==='declined').length},
  ];

  const filtered=deals.filter(d=>{
    if(srch){const s=srch.toLowerCase();if(!d.business.toLowerCase().includes(s)&&!d.id.toLowerCase().includes(s)&&!d.broker.toLowerCase().includes(s)&&!(d.contact||'').toLowerCase().includes(s))return false;}
    if(tab==='today')return isToday(d.submittedAt);
    if(tab==='active')return!['funded','declined','offered'].includes(d.status);
    if(tab==='approved')return['offered','docs','contracts','bankverify'].includes(d.status);
    if(tab==='funded')return d.status==='funded';
    if(tab==='declined')return d.status==='declined';
    return true;
  }).sort((a,b)=>{
    let av,bv;
    if(sc==='risk'){av=a.risk||0;bv=b.risk||0;}
    else if(sc==='amount'){av=a.amount||a.requested||0;bv=b.amount||b.requested||0;}
    else if(sc==='profit'){av=a.profit||0;bv=b.profit||0;}
    else{av=a.submittedAt||'';bv=b.submittedAt||'';}
    return sd==='asc'?(av>bv?1:-1):(av<bv?1:-1);
  });

  const Th=({col,label})=>(
    <th onClick={()=>{if(sc===col)setSD(x=>x==='asc'?'desc':'asc');else{setSc(col);setSD('desc');}}}>
      {label}{sc===col?(sd==='asc'?' ^':' v'):''}
    </th>
  );

  return(
    <div className="fa">
      <div className="fr">
        <div className="sw">
          <span className="si">S</span>
          <input className="fi" placeholder="Search business, broker, deal #..." value={srch} onChange={e=>setSrch(e.target.value)}/>
        </div>
        <button className="btn bp" onClick={()=>setShowNew(true)}>+ New deal</button>
      </div>
      <div className="tabs">
        {tabs.map(t=>(
          <div key={t.id} className={'tab'+(tab===t.id?' ac':'')} onClick={()=>setTab(t.id)}>
            {t.l} <span style={{fontSize:10,fontFamily:'var(--mono)',marginLeft:2,opacity:.7}}>{t.n}</span>
          </div>
        ))}
      </div>
      {tab==='funded'&&filtered.length>0&&(
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:9,marginBottom:12}}>
          <div className="sc" style={{padding:'9px 11px'}}><div className="sl">Total funded</div><div className="sv" style={{fontSize:15,color:'var(--green)'}}>{f$(filtered.reduce((s,d)=>s+(d.amount||0),0))}</div></div>
          <div className="sc" style={{padding:'9px 11px'}}><div className="sl">Total profit</div><div className="sv" style={{fontSize:15,color:'var(--teal)'}}>{f$(filtered.reduce((s,d)=>s+(d.profit||0),0))}</div></div>
          <div className="sc" style={{padding:'9px 11px'}}><div className="sl">Avg deal</div><div className="sv" style={{fontSize:15}}>{f$(Math.round(filtered.reduce((s,d)=>s+(d.amount||0),0)/Math.max(1,filtered.length)))}</div></div>
        </div>
      )}
      <div className="cd" style={{padding:0}}>
        <div className="tw">
          <table className="t2">
            <thead>
              <tr>
                <th>Deal #</th><th>Business</th><th>Broker</th>
                <Th col="amount" label="Amount"/>
                <th>Status</th>
                <Th col="risk" label="Risk"/>
                <Th col="profit" label="Profit"/>
                <th>Rates</th>
                <Th col="submitted" label="Date"/>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d=>(
                <tr key={d.id} className="cl" onClick={()=>setSel(d)}>
                  <td style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--text3)',whiteSpace:'nowrap'}}>
                    {d.id}
                    {isToday(d.submittedAt)&&<span style={{marginLeft:4,fontSize:9,background:'var(--green)',color:'#fff',padding:'1px 3px',borderRadius:3}}>NEW</span>}
                  </td>
                  <td>
                    <div style={{fontWeight:500,color:'var(--text)',maxWidth:150,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.business}</div>
                    <div style={{fontSize:10,color:'var(--text3)'}}>{d.contact}</div>
                  </td>
                  <td style={{fontSize:12,color:'var(--text2)',maxWidth:110,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.broker}</td>
                  <td style={{fontFamily:'var(--mono)',fontSize:12,color:d.amount?'var(--teal)':'var(--text3)'}}>{d.amount?f$(d.amount):f$(d.requested)}</td>
                  <td><span className={'badge '+bc(d.status)}>{SL[d.status]}</span></td>
                  <td>{d.risk!=null?<div><span style={{fontSize:12,fontFamily:'var(--mono)',color:rc(d.risk)}}>{d.risk}</span><div className="sbar" style={{width:44,marginTop:2}}><div className="sfill" style={{width:d.risk+'%',background:rc(d.risk)}}/></div></div>:'--'}</td>
                  <td style={{fontFamily:'var(--mono)',fontSize:12,color:d.profit?'var(--green)':'var(--text3)'}}>{d.profit?f$(d.profit):'--'}</td>
                  <td style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text3)',whiteSpace:'nowrap'}}>{d.factor?fx(d.factor)+' / 1.499x':'--'}</td>
                  <td style={{fontSize:11,color:'var(--text3)',fontFamily:'var(--mono)',whiteSpace:'nowrap'}}>{d.submitted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length&&<div className="em"><div className="emt">No deals match</div></div>}
      </div>
    </div>
  );
}

function DealDetail({deal,onClose,onUpdate,onRefresh,showToast}){
  const [tab,setTab]=useState('overview');
  const [note,setNote]=useState('');
  const [ncat,setNcat]=useState('general');
  const [busy,setBusy]=useState('');

  const steps=['new','scrubbing','underwriting','offered','contracts','bankverify','funded'];
  const si=steps.indexOf(deal.status);

  const flags=[];
  if(deal.nyCourt&&deal.nyCourt!=='clean')flags.push({t:'red',x:'NY Courts: '+deal.nyCourt});
  if(deal.dataMerch&&deal.dataMerch!=='clean')flags.push({t:'amber',x:'DataMerch: '+deal.dataMerch});
  if(deal.positions>=3)flags.push({t:'red',x:deal.positions+' stacked positions — high risk'});
  else if(deal.positions===2)flags.push({t:'amber',x:'2 positions — review stack'});
  if(deal.dailyBal&&deal.dailyBal<1000)flags.push({t:'red',x:'Avg daily balance below $1,000 minimum'});
  if(deal.monthlyRev&&deal.monthlyRev<35000)flags.push({t:'red',x:'Monthly revenue below $35,000 minimum'});
  if(!flags.length&&deal.risk>=65)flags.push({t:'green',x:'All checks passed — strong profile'});

  const api=async(path,body,method='POST')=>{
    const r=await fetch(path,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    if(!r.ok)throw new Error('HTTP '+r.status);
    return r.json();
  };

  const advance=async()=>{
    const next=NEXTS[deal.status];
    if(!next||!deal.dbId)return;
    setBusy('advance');
    try{
      await api('/api/deals/update',{dbId:deal.dbId,status:next});
      onUpdate({...deal,status:next});
      showToast('Advanced to '+SL[next]);
    }catch(e){showToast('Failed: '+e.message,'error');}
    setBusy('');
  };

  const decline=async()=>{
    if(!deal.dbId)return;
    setBusy('decline');
    try{
      await api('/api/deals/update',{dbId:deal.dbId,status:'declined'});
      onUpdate({...deal,status:'declined'});
      showToast('Deal declined');
      onClose();
    }catch(e){showToast('Failed: '+e.message,'error');}
    setBusy('');
  };

  const fund=async()=>{
    if(!deal.dbId)return;
    setBusy('fund');
    try{
      await api('/api/deals/update',{dbId:deal.dbId,status:'funded'});
      onUpdate({...deal,status:'funded'});
      showToast('Deal marked as funded!');
      onClose();
    }catch(e){showToast('Failed: '+e.message,'error');}
    setBusy('');
  };

  const scrub=async()=>{
    if(!deal.dbId)return;
    setBusy('scrub');
    try{
      const data=await api('/api/scrubber/run',{dealId:deal.dbId});
      if(data.riskScore!=null){
        const profit=data.approvedAmount&&data.buyRate?Math.round(data.approvedAmount*(1.499-data.buyRate)):null;
        onUpdate({...deal,status:data.approved?'offered':'declined',risk:data.riskScore,amount:data.approvedAmount,factor:data.buyRate,termDays:data.termDays,profit,payback:data.approvedAmount?Math.round(data.approvedAmount*1.499):null});
        showToast('Scrub done - Risk: '+data.riskScore+'/100 - '+(data.approved?'APPROVED':'DECLINED'));
        onRefresh();
      }else showToast('Scrub error: '+data.error,'error');
    }catch(e){showToast('Failed: '+e.message,'error');}
    setBusy('');
  };

  const saveNote=async()=>{
    if(!note.trim())return;
    const n={id:'l-'+Date.now(),text:note.trim(),cat:ncat,author:'Underwriter',time:new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})};
    onUpdate({...deal,uwNotes:[...(deal.uwNotes||[]),n]});
    setNote('');
    showToast('Note saved');
  };

  return(
    <div className="mo" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="md fa">
        <button className="mc" onClick={onClose}>x</button>
        <div className="mt" style={{paddingRight:28}}>{deal.business}</div>
        <div style={{display:'flex',alignItems:'center',gap:7,margin:'6px 0 13px',flexWrap:'wrap'}}>
          <span style={{fontSize:10,color:'var(--text3)',fontFamily:'var(--mono)'}}>{deal.id}</span>
          <span className={'badge '+bc(deal.status)}>{SL[deal.status]}</span>
          <span style={{fontSize:11,color:'var(--text3)'}}>via {deal.broker}</span>
          {isToday(deal.submittedAt)&&<span style={{fontSize:9,background:'var(--green)',color:'#fff',padding:'1px 6px',borderRadius:10,fontFamily:'var(--mono)'}}>TODAY</span>}
          {deal.status==='scrubbing'&&<div className="sp"/>}
          {(deal.uwNotes||[]).length>0&&<span style={{fontSize:10,color:'var(--purple)',background:'#a78bfa15',border:'1px solid #a78bfa25',padding:'1px 7px',borderRadius:10,fontFamily:'var(--mono)'}}>{deal.uwNotes.length} notes</span>}
        </div>

        {deal.status!=='declined'&&(
          <div className="ps">
            {steps.map((s,i)=>(
              <div key={s} className={'pst'+(i<si?' dn':i===si?' av':'')}>
                <div className="psd">{i<si?'v':i+1}</div>
                <div className="psl">{SL[s]}</div>
              </div>
            ))}
          </div>
        )}

        {deal.status==='declined'&&(
          <div style={{marginBottom:13,padding:'8px 11px',background:'#ef444412',border:'1px solid #ef444425',borderRadius:'var(--r)',fontSize:13,color:'var(--red)'}}>
            Deal declined — {(deal.uwNotes||[]).find(n=>n.cat==='risk')?.text?.slice(0,100)||'See notes'}
          </div>
        )}

        <div className="tabs">
          {['overview','underwriting','documents','notes','timeline'].map(t=>(
            <div key={t} className={'tab'+(tab===t?' ac':'')} onClick={()=>setTab(t)} style={{textTransform:'capitalize',position:'relative'}}>
              {t}
              {t==='notes'&&(deal.uwNotes||[]).length>0&&<span style={{position:'absolute',top:4,right:1,width:5,height:5,borderRadius:'50%',background:'var(--purple)'}}/>}
            </div>
          ))}
        </div>

        {tab==='overview'&&(
          <div>
            {deal.amount?(
              <>
                <div className="oc" style={{marginBottom:11}}>
                  <div className="ol">Approved offer</div>
                  <div className="oa">{f$(deal.amount)}</div>
                  <div className="om">
                    <div><div className="omv">{fx(deal.factor)}</div><div className="oml">Buy rate</div></div>
                    <div><div className="omv">1.499x</div><div className="oml">Sell rate</div></div>
                    <div><div className="omv">{deal.termDays||'--'} days</div><div className="oml">Term</div></div>
                    <div><div className="omv" style={{color:'var(--green)'}}>{f$(deal.profit)}</div><div className="oml">Our profit</div></div>
                    {deal.balance&&<div><div className="omv" style={{color:'var(--amber)'}}>{f$(deal.balance)}</div><div className="oml">Balance</div></div>}
                  </div>
                </div>
                <div className="pb" style={{marginBottom:11}}>
                  <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
                    <div><div className="sl">Merchant payback</div><div style={{fontSize:13,fontFamily:'var(--mono)',color:'var(--text)',marginTop:2}}>{f$(deal.payback)}</div></div>
                    <div><div className="sl">Our cost</div><div style={{fontSize:13,fontFamily:'var(--mono)',color:'var(--text)',marginTop:2}}>{f$(deal.factor?Math.round(deal.amount*deal.factor):null)}</div></div>
                    <div><div className="sl">Our profit</div><div style={{fontSize:13,fontFamily:'var(--mono)',color:'var(--green)',fontWeight:600,marginTop:2}}>{f$(deal.profit)}</div></div>
                    <div><div className="sl">Daily payment</div><div style={{fontSize:13,fontFamily:'var(--mono)',color:'var(--amber)',marginTop:2}}>{f$(deal.payback&&deal.termDays?Math.round(deal.payback/deal.termDays):null)}</div></div>
                  </div>
                </div>
              </>
            ):(
              <div style={{marginBottom:11,padding:'10px 12px',background:'var(--bg3)',borderRadius:'var(--r)',fontSize:13,color:'var(--text3)'}}>
                No offer yet — run the AI scrubber to price this deal
              </div>
            )}
            <div className="dg">
              <div className="df"><div className="dl">Contact</div><div className="dv">{deal.contact||'--'}</div></div>
              <div className="df"><div className="dl">Email</div><div className="dv" style={{fontSize:11,wordBreak:'break-all'}}>{deal.email||'--'}</div></div>
              <div className="df"><div className="dl">Requested</div><div className="dv">{f$(deal.requested)}</div></div>
              <div className="df"><div className="dl">Submitted</div><div className="dv">{deal.submitted}</div></div>
              <div className="df"><div className="dl">Monthly revenue</div><div className="dv" style={{color:deal.monthlyRev>=35000?'var(--green)':deal.monthlyRev?'var(--red)':'inherit'}}>{f$(deal.monthlyRev)}</div></div>
              <div className="df"><div className="dl">Avg daily balance</div><div className="dv" style={{color:deal.dailyBal>=1000?'var(--green)':deal.dailyBal?'var(--red)':'inherit'}}>{f$(deal.dailyBal)}</div></div>
            </div>
            {deal.notes&&<div style={{marginTop:9,padding:'7px 10px',background:'var(--bg3)',borderRadius:'var(--r)',fontSize:12,color:'var(--text2)'}}>{deal.notes.slice(0,300)}</div>}
          </div>
        )}

        {tab==='underwriting'&&(
          <div>
            <div style={{marginBottom:11}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <span style={{fontSize:13,color:'var(--text)'}}>Risk score</span>
                <span style={{fontSize:13,fontFamily:'var(--mono)',fontWeight:600,color:rc(deal.risk||0)}}>{deal.risk!=null?deal.risk+' / 100':'Not scrubbed yet'}</span>
              </div>
              {deal.risk!=null&&<div className="sbar" style={{height:7}}><div className="sfill" style={{width:deal.risk+'%',background:rc(deal.risk)}}/></div>}
            </div>
            <div className="dg" style={{marginBottom:11}}>
              <div className="df"><div className="dl">Positions</div><div className="dv" style={{color:deal.positions>=3?'var(--red)':deal.positions>=2?'var(--amber)':'var(--green)'}}>{deal.positions} position{deal.positions!==1?'s':''}</div></div>
              <div className="df"><div className="dl">NY Courts</div><div className="dv" style={{color:deal.nyCourt==='clean'?'var(--green)':'var(--red)'}}>{deal.nyCourt||'Pending'}</div></div>
              <div className="df"><div className="dl">DataMerch</div><div className="dv" style={{color:deal.dataMerch==='clean'?'var(--green)':'var(--amber)'}}>{deal.dataMerch||'Pending'}</div></div>
              <div className="df"><div className="dl">Monthly revenue</div><div className="dv" style={{color:deal.monthlyRev>=35000?'var(--green)':deal.monthlyRev?'var(--red)':'inherit'}}>{f$(deal.monthlyRev)}</div></div>
            </div>
            {flags.map((fl,i)=><div key={i} className={'rf '+fl.t}><span style={{fontSize:12,color:'var(--text2)'}}>{fl.x}</span></div>)}
            {!flags.length&&deal.risk==null&&<div style={{textAlign:'center',padding:18,color:'var(--text3)',fontSize:13}}>Run AI scrubber to see full underwriting analysis</div>}
          </div>
        )}

        {tab==='documents'&&(
          <div>
            {[{n:'Bank statements (3 months)',ok:deal.status!=='new'},{n:'Voided check',ok:['contracts','bankverify','funded'].includes(deal.status)},{n:'Photo ID',ok:['contracts','bankverify','funded'].includes(deal.status)},{n:'Signed contract',ok:['bankverify','funded'].includes(deal.status)},{n:'Business license',ok:false}].map((d,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 11px',background:'var(--bg3)',borderRadius:'var(--r)',marginBottom:7}}>
                <span style={{fontSize:13,color:'var(--text)'}}>{d.n}</span>
                <span className={'badge '+(d.ok?'bfu':'buw')}>{d.ok?'received':'pending'}</span>
              </div>
            ))}
            <div style={{border:'2px dashed var(--border3)',borderRadius:'var(--rl)',padding:18,textAlign:'center',cursor:'pointer',marginTop:7}}>
              <div style={{fontSize:13,color:'var(--text2)'}}>Drop files here or click to upload</div>
              <div style={{fontSize:11,color:'var(--text3)',marginTop:3}}>PDF, JPG, PNG up to 20MB</div>
            </div>
          </div>
        )}

        {tab==='notes'&&(
          <div>
            <div style={{marginBottom:11,padding:11,background:'var(--bg3)',borderRadius:'var(--rl)',border:'1px solid var(--border2)'}}>
              <div style={{fontSize:12,fontWeight:500,color:'var(--text)',marginBottom:7}}>Add underwriter note</div>
              <div style={{display:'flex',gap:5,marginBottom:7,flexWrap:'wrap'}}>
                {['general','risk','approval','condition','followup'].map(c=>(
                  <button key={c} onClick={()=>setNcat(c)} style={{padding:'2px 8px',borderRadius:20,fontSize:11,cursor:'pointer',border:'1px solid '+(ncat===c?NCC[c]:'var(--border)'),background:ncat===c?NCC[c]+'22':'transparent',color:ncat===c?NCC[c]:'var(--text3)',transition:'all .15s',fontFamily:'var(--font)'}}>{c}</button>
                ))}
              </div>
              <textarea className="fi" style={{minHeight:58,marginBottom:7}} placeholder="Add note..." value={note} onChange={e=>setNote(e.target.value)}/>
              <button className="btn bp bs" onClick={saveNote} disabled={!note.trim()}>Save note</button>
            </div>
            {!(deal.uwNotes||[]).length&&<div className="em"><div className="emt">No notes yet</div></div>}
            {(deal.uwNotes||[]).slice().reverse().map(n=>(
              <div key={n.id} className={'nc '+(n.cat||'general')}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                  <span style={{fontSize:9,fontFamily:'var(--mono)',textTransform:'uppercase',color:NCC[n.cat]||'var(--text3)'}}>{n.cat}</span>
                  <span style={{fontSize:10,color:'var(--text3)',fontFamily:'var(--mono)'}}>{n.author} - {n.time}</span>
                </div>
                <div style={{fontSize:13,color:'var(--text)',lineHeight:1.5}}>{n.text}</div>
              </div>
            ))}
          </div>
        )}

        {tab==='timeline'&&(
          <div className="tl">
            {[
              deal.submitted&&{t:deal.submitted,x:'Deal submitted via email from '+deal.broker,d:''},
              deal.status!=='new'&&{t:deal.submitted,x:'AI scrubber triggered automatically',d:''},
              deal.risk&&{t:deal.submitted,x:'Scrub complete - Risk: '+deal.risk+'/100 | NY Courts: '+(deal.nyCourt||'--')+' | DataMerch: '+(deal.dataMerch||'--'),d:deal.risk>=65?'green':'amber'},
              deal.amount&&{t:deal.submitted,x:'Offer: '+f$(deal.amount)+' @ '+fx(deal.factor)+' buy / 1.499x sell | Profit: '+f$(deal.profit),d:'green'},
              deal.status==='funded'&&{t:deal.funded||'',x:'Funded - ACH disbursement sent',d:'green'},
              deal.status==='declined'&&{t:deal.submitted,x:'Deal declined',d:'red'},
              ...(deal.uwNotes||[]).filter(n=>n.cat!=='system').map(n=>({t:n.time,x:n.author+' - '+n.text.slice(0,80),d:''})),
            ].filter(Boolean).map((e,i)=>(
              <div key={i} className="tli">
                <div className={'tld '+(e.d||'')}/>
                <div><div className="tltx">{e.x}</div><div className="tlt">{e.t}</div></div>
              </div>
            ))}
          </div>
        )}

        <div className="divr"/>
        <div className="ar">
          {['new','scrubbing','underwriting'].includes(deal.status)&&(
            <button className="btn bam bs" onClick={scrub} disabled={busy==='scrub'}>
              {busy==='scrub'?<span style={{display:'flex',alignItems:'center',gap:5}}><div className="sp"/>Scrubbing...</span>:'Run AI Scrub'}
            </button>
          )}
          {deal.status==='offered'&&<button className="btn bp bs" onClick={()=>{onUpdate({...deal,status:'contracts'});showToast('Moved to contracts');}}>Generate contracts</button>}
          {deal.status==='contracts'&&<button className="btn bp bs">Send DocuSign</button>}
          {deal.status==='bankverify'&&<button className="btn bsu bs" onClick={fund} disabled={busy==='fund'}>{busy==='fund'?'...':'Mark as funded'}</button>}
          {!['funded','declined'].includes(deal.status)&&NEXTS[deal.status]&&(
            <button className="btn bg bs" onClick={advance} disabled={busy==='advance'}>
              {busy==='advance'?'...':'Advance to '+SL[NEXTS[deal.status]]}
            </button>
          )}
          {!['funded','declined'].includes(deal.status)&&<button className="btn bd bs" onClick={decline} disabled={busy==='decline'}>{busy==='decline'?'...':'Decline'}</button>}
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
      setRes({risk,dailyBal:Math.floor(Math.random()*12000+2000),monthlyRev:Math.floor(Math.random()*70000+15000),nyCourt:Math.random()>.8?'1 default':'clean',dataMerch:Math.random()>.9?'flagged':'clean'});
      setStep(2);
    },2500);
  };
  const save=()=>{
    const r=res||{};const risk=r.risk||null;
    const amount=risk>=50?Math.round(parseInt(f.requested||0)*0.85/1000)*1000:null;
    const br=risk>=70?1.22:risk>=60?1.29:1.38;
    onSave({id:'D-NEW-'+Date.now(),dbId:null,business:f.business,contact:f.contact,email:f.email,broker:f.broker,requested:parseInt(f.requested)||0,status:risk>=50?'offered':'declined',risk,factor:br,termDays:risk>=70?120:90,positions:0,dailyBal:r.dailyBal,monthlyRev:r.monthlyRev,nyCourt:r.nyCourt,dataMerch:r.dataMerch,amount,submitted:new Date().toISOString().slice(0,10),submittedAt:new Date().toISOString(),funded:null,balance:null,notes:f.notes,uwNotes:[],profit:amount?Math.round(amount*(1.499-br)):null,payback:amount?Math.round(amount*1.499):null});
    onClose();
  };
  return(
    <div className="mo" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="md fa">
        <button className="mc" onClick={onClose}>x</button>
        <div className="mt">New deal intake</div>
        <div style={{fontSize:12,color:'var(--text3)',marginBottom:14,marginTop:4}}>Submit for automated scrubbing and underwriting</div>
        <div className="ps" style={{marginBottom:14}}>
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
              <div className="fgg"><label className="fl">Contact email</label><input className="fi" placeholder="john@business.com" value={f.email} onChange={e=>set('email',e.target.value)}/></div>
              <div className="fgg"><label className="fl">Broker / ISO *</label><input className="fi" placeholder="Broker name or email" value={f.broker} onChange={e=>set('broker',e.target.value)}/></div>
              <div className="fgg"><label className="fl">Amount requested</label><input className="fi" type="number" placeholder="50000" value={f.requested} onChange={e=>set('requested',e.target.value)}/></div>
              <div className="fgg"><label className="fl">Notes</label><textarea className="fi" placeholder="Position info, industry, context..." value={f.notes} onChange={e=>set('notes',e.target.value)}/></div>
            </div>
            <div style={{marginTop:13,display:'flex',gap:7}}>
              <button className="btn bp" onClick={run} disabled={!f.business||!f.broker}>Run AI Scrubber</button>
              <button className="btn bg bs" onClick={onClose}>Cancel</button>
            </div>
          </>
        )}
        {step===1&&(
          <div style={{textAlign:'center',padding:'32px 0'}}>
            <div className="sp" style={{width:26,height:26,margin:'0 auto 13px'}}/>
            <div style={{fontSize:14,color:'var(--text)',marginBottom:5}}>Running automated scrub...</div>
            <div style={{fontSize:12,color:'var(--text3)'}}>Checking guidelines - NY Courts - DataMerch</div>
          </div>
        )}
        {step===2&&res&&(
          <div className="fa">
            <div className="dg" style={{marginBottom:11}}>
              <div className="df"><div className="dl">Risk score</div><div className="dv" style={{color:rc(res.risk)}}>{res.risk}/100</div></div>
              <div className="df"><div className="dl">Decision</div><div className="dv" style={{color:res.risk>=50?'var(--green)':'var(--red)',fontWeight:600}}>{res.risk>=50?'APPROVE':'DECLINE'}</div></div>
              <div className="df"><div className="dl">NY Courts</div><div className="dv" style={{color:res.nyCourt==='clean'?'var(--green)':'var(--red)'}}>{res.nyCourt}</div></div>
              <div className="df"><div className="dl">DataMerch</div><div className="dv" style={{color:res.dataMerch==='clean'?'var(--green)':'var(--amber)'}}>{res.dataMerch}</div></div>
            </div>
            {res.risk>=50&&(
              <div className="oc" style={{marginBottom:11}}>
                <div className="ol">Suggested offer</div>
                <div className="oa">{f$(Math.round(parseInt(f.requested||0)*0.85/1000)*1000)}</div>
                <div className="om">
                  <div><div className="omv">{res.risk>=70?'1.22x':res.risk>=60?'1.29x':'1.38x'}</div><div className="oml">Buy rate</div></div>
                  <div><div className="omv">1.499x</div><div className="oml">Sell rate</div></div>
                  <div><div className="omv">{res.risk>=70?'120':'90'} days</div><div className="oml">Term</div></div>
                </div>
              </div>
            )}
            <div style={{display:'flex',gap:7}}>
              <button className="btn bp" onClick={save}>{res.risk>=50?'Submit deal':'Save as declined'}</button>
              <button className="btn bg bs" onClick={onClose}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Brokers({deals}){
  const [sel,setSel]=useState(null);
  const bmap={};
  deals.forEach(d=>{
    const k=d.broker;if(!k||k==='Unknown')return;
    if(!bmap[k])bmap[k]={name:k,total:0,funded:0,declined:0,volume:0,active:0};
    bmap[k].total++;
    if(d.status==='funded'){bmap[k].funded++;bmap[k].volume+=d.amount||0;}
    if(d.status==='declined')bmap[k].declined++;
    if(!['funded','declined'].includes(d.status))bmap[k].active++;
  });
  const brokers=Object.values(bmap).sort((a,b)=>b.total-a.total);
  return(
    <div className="fa">
      <div style={{display:'grid',gridTemplateColumns:'230px 1fr',gap:11}}>
        <div>
          <div style={{fontSize:10,color:'var(--text3)',fontFamily:'var(--mono)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:7}}>{brokers.length} ISO shops</div>
          {brokers.map(b=>(
            <div key={b.name} className="cd cds" style={{cursor:'pointer',borderColor:sel?.name===b.name?'var(--accent)':'var(--border)',marginBottom:7,transition:'border-color .15s'}} onClick={()=>setSel(b)}>
              <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:5}}>
                <div className="av" style={{fontSize:10,width:24,height:24}}>{b.name.slice(0,2).toUpperCase()}</div>
                <div style={{fontSize:13,fontWeight:500,color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.name}</div>
              </div>
              <div style={{display:'flex',gap:9,fontSize:11,fontFamily:'var(--mono)'}}>
                <span style={{color:'var(--text3)'}}>Deals: <span style={{color:'var(--text)'}}>{b.total}</span></span>
                <span style={{color:'var(--text3)'}}>Funded: <span style={{color:'var(--green)'}}>{b.funded}</span></span>
              </div>
            </div>
          ))}
          {!brokers.length&&<div className="em"><div className="emt">No brokers yet</div></div>}
        </div>
        {sel?(
          <div className="fa">
            <div className="cd" style={{marginBottom:11}}>
              <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:11}}>
                <div className="av" style={{width:36,height:36,fontSize:12}}>{sel.name.slice(0,2).toUpperCase()}</div>
                <div style={{fontSize:15,fontWeight:600,color:'var(--text)',fontFamily:'var(--serif)'}}>{sel.name}</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
                <div className="sc" style={{padding:'8px 10px'}}><div className="sl">Volume</div><div className="sv" style={{fontSize:13}}>{f$(sel.volume)}</div></div>
                <div className="sc" style={{padding:'8px 10px'}}><div className="sl">Funded</div><div className="sv" style={{fontSize:13,color:'var(--green)'}}>{sel.funded}</div></div>
                <div className="sc" style={{padding:'8px 10px'}}><div className="sl">Active</div><div className="sv" style={{fontSize:13,color:'var(--amber)'}}>{sel.active}</div></div>
                <div className="sc" style={{padding:'8px 10px'}}><div className="sl">Conversion</div><div className="sv" style={{fontSize:13}}>{sel.total>0?Math.round(sel.funded/sel.total*100):0}%</div></div>
              </div>
            </div>
            <div className="cd" style={{padding:0}}>
              <table className="t2">
                <thead><tr><th>ID</th><th>Business</th><th>Amount</th><th>Status</th><th>Risk</th></tr></thead>
                <tbody>{deals.filter(d=>d.broker===sel.name).map(d=>(
                  <tr key={d.id}>
                    <td style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--text3)'}}>{d.id}</td>
                    <td style={{color:'var(--text)',fontWeight:500}}>{d.business}</td>
                    <td style={{fontFamily:'var(--mono)',fontSize:12,color:d.amount?'var(--teal)':'var(--text3)'}}>{d.amount?f$(d.amount):f$(d.requested)}</td>
                    <td><span className={'badge '+bc(d.status)}>{SL[d.status]}</span></td>
                    <td>{d.risk!=null?<span style={{fontSize:12,fontFamily:'var(--mono)',color:rc(d.risk)}}>{d.risk}</span>:'--'}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        ):(
          <div className="em" style={{marginTop:50}}><div className="emt">Select a broker to view their deals</div></div>
        )}
      </div>
    </div>
  );
}

function Contracts({deals}){
  const cd=deals.filter(d=>['contracts','bankverify','funded'].includes(d.status));
  return(
    <div className="fa">
      <div style={{marginBottom:13,fontSize:13,color:'var(--text3)'}}>DocuSign integration - auto-generated on offer acceptance</div>
      {cd.map(d=>(
        <div key={d.id} className="cd cds" style={{display:'flex',alignItems:'center',gap:11,marginBottom:7}}>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>{d.business}</div><div style={{fontSize:10,color:'var(--text3)',fontFamily:'var(--mono)'}}>{d.id} - {d.broker}</div></div>
          <div style={{textAlign:'right'}}><div style={{fontSize:13,fontFamily:'var(--mono)',color:'var(--teal)'}}>{f$(d.amount)}</div><div style={{fontSize:10,color:'var(--text3)',fontFamily:'var(--mono)'}}>{fx(d.factor)} buy / 1.499x sell</div></div>
          <span className={'badge '+bc(d.status)}>{SL[d.status]}</span>
          {d.status==='contracts'?<button className="btn bp bs">Send DocuSign</button>:<button className="btn bg bs">View</button>}
        </div>
      ))}
      {!cd.length&&<div className="em"><div className="emt">No contracts yet</div></div>}
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
      <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:13,padding:'9px 13px',background:'var(--bg3)',borderRadius:'var(--rl)',border:'1px solid var(--border)'}}>
        <div className="av" style={{fontSize:10}}>{(br||'??').slice(0,2).toUpperCase()}</div>
        <div style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>{br||'Select broker'}</div>
        <div style={{marginLeft:'auto'}}>
          <select className="fi" style={{width:170}} value={br} onChange={e=>setBr(e.target.value)}>
            <option value="">Select broker...</option>
            {brokers.map((b,i)=><option key={i} value={b}>{b}</option>)}
          </select>
        </div>
      </div>
      <div className="sg">
        <div className="sc"><div className="sl">Active</div><div className="sv">{md.filter(d=>!['funded','declined'].includes(d.status)).length}</div></div>
        <div className="sc"><div className="sl">Funded</div><div className="sv" style={{color:'var(--green)'}}>{mf.length}</div></div>
        <div className="sc"><div className="sl">Volume</div><div className="sv" style={{fontSize:13}}>{f$(mf.reduce((s,d)=>s+(d.amount||0),0))}</div></div>
        <div className="sc"><div className="sl">Conversion</div><div className="sv">{md.length>0?Math.round(mf.length/md.length*100):0}%</div></div>
      </div>
      <div className="cd" style={{padding:0}}>
        <table className="t2">
          <thead><tr><th>Business</th><th>Requested</th><th>Offer</th><th>Status</th></tr></thead>
          <tbody>{md.map(d=>(
            <tr key={d.id}>
              <td><div style={{fontWeight:500,color:'var(--text)'}}>{d.business}</div><div style={{fontSize:10,color:'var(--text3)',fontFamily:'var(--mono)'}}>{d.id}</div></td>
              <td style={{fontFamily:'var(--mono)',fontSize:12}}>{f$(d.requested)}</td>
              <td style={{fontFamily:'var(--mono)',fontSize:12,color:d.amount?'var(--teal)':'var(--text3)'}}>{d.amount?f$(d.amount):'Pending'}</td>
              <td><span className={'badge '+bc(d.status)}>{SL[d.status]}</span></td>
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
      <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:13,padding:'9px 13px',background:'var(--bg3)',borderRadius:'var(--rl)',border:'1px solid var(--border)'}}>
        <div className="av" style={{background:'linear-gradient(135deg,var(--teal),#6366f1)'}}>M</div>
        <div style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>Merchant Portal</div>
        <div style={{marginLeft:'auto'}}>
          <select className="fi" style={{width:190}} value={sel?.id||''} onChange={e=>setSel(fd.find(d=>d.id===e.target.value))}>
            {fd.map(d=><option key={d.id} value={d.id}>{d.business}</option>)}
          </select>
        </div>
      </div>
      {sel?(
        <div className="fa">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:9,marginBottom:13}}>
            <div className="oc">
              <div className="ol">Outstanding balance</div>
              <div className="oa" style={{color:'var(--amber)'}}>{f$(sel.balance)}</div>
              <div style={{marginTop:5,fontSize:11,color:'var(--text3)'}}>of {f$(sel.amount)} funded</div>
              <div style={{marginTop:7,height:3,background:'#ffffff20',borderRadius:2}}><div style={{height:'100%',borderRadius:2,background:'var(--teal)',width:(sel.amount&&sel.balance?Math.round((1-sel.balance/sel.amount)*100):0)+'%'}}/></div>
              <div style={{marginTop:3,fontSize:10,color:'var(--text3)',fontFamily:'var(--mono)'}}>{sel.amount&&sel.balance?Math.round((1-sel.balance/sel.amount)*100):0}% paid</div>
            </div>
            <div className="cd">
              <div className="dl">Payoff amount</div>
              <div style={{fontSize:19,fontWeight:600,fontFamily:'var(--mono)',color:'var(--text)',margin:'4px 0'}}>{f$(po)}</div>
              <div style={{fontSize:11,color:'var(--text3)',marginBottom:9}}>includes 2% early payoff fee</div>
              <button className="btn bg bs" style={{width:'100%'}}>Request payoff letter</button>
            </div>
            <div className="cd">
              <div className="dl" style={{marginBottom:7}}>Documents</div>
              <div style={{display:'flex',flexDirection:'column',gap:5}}>
                <button className="btn bg bs">Balance letter</button>
                <button className="btn bg bs">Payment history</button>
                <button className="btn bg bs">Contract copy</button>
              </div>
            </div>
          </div>
          {sel.balance&&sel.amount&&sel.balance/sel.amount<=0.5&&(
            <div style={{padding:'9px 13px',background:'#1a2a1a',border:'1px solid #10b98140',borderRadius:'var(--rl)',display:'flex',alignItems:'center',gap:9}}>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:'var(--green)'}}>Eligible for renewal!</div><div style={{fontSize:12,color:'var(--text3)'}}>Over 50% paid - contact your broker</div></div>
              <button className="btn bsu bs">Request renewal</button>
            </div>
          )}
        </div>
      ):(
        <div className="em"><div className="emt">No funded deals yet</div></div>
      )}
    </div>
  );
}

function Mkt({type}){
  return(
    <div className="fa">
      <div style={{marginBottom:13,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:13,color:'var(--text3)'}}>{type==='mkt-iso'?'Campaigns for your ISO network':'Automated communications for merchants'}</div>
        <button className="btn bp bs">+ New campaign</button>
      </div>
      <div className="cd">
        <div style={{textAlign:'center',padding:'26px 0'}}>
          <div style={{fontSize:13,fontWeight:500,color:'var(--text)',marginBottom:5}}>Campaign builder coming soon</div>
          <div style={{fontSize:12,color:'var(--text3)'}}>Connect SendGrid or Mailchimp to start sending automated campaigns</div>
        </div>
      </div>
    </div>
  );
}

function Settings(){
  return(
    <div className="fa">
      <div style={{maxWidth:520,display:'flex',flexDirection:'column',gap:7}}>
        {[{t:'Underwriting guidelines',d:'Risk thresholds, position limits, factor rates'},{t:'AI scrubber',d:'Claude API, pricing rules, industry restrictions'},{t:'Gmail integration',d:'Inbox settings, deal detection, OAuth'},{t:'Google Sheets sync',d:'Sheet IDs, tab names, sync frequency'},{t:'DocuSign contracts',d:'Template ID, signing order, webhook URL'},{t:'NY Courts API',d:'Credentials and search config'},{t:'DataMerch API',d:'API key and match threshold'},{t:'Notifications',d:'Email alerts on deal status changes'},{t:'Security',d:'Password protection, user access'}].map((s,i)=>(
          <div key={i} className="cd cds" style={{display:'flex',alignItems:'center',gap:9,cursor:'pointer',transition:'border-color .15s'}} onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border3)'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>{s.t}</div><div style={{fontSize:11,color:'var(--text3)',marginTop:1}}>{s.d}</div></div>
            <span style={{color:'var(--text3)'}}>›</span>
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
