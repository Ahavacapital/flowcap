export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        :root{
          --bg:#f4faf6;--surface:#ffffff;--surface2:#eaf5ee;
          --border:#c6e6d0;--border2:#a3d4b4;
          --text:#0e2718;--text2:#2d6645;--text3:#7aab8a;
          --accent:#16a34a;--accent2:#15803d;
          --green:#16a34a;--amber:#ca8a04;--red:#dc2626;--purple:#7c3aed;
          --font:'Plus Jakarta Sans',sans-serif;--mono:'JetBrains Mono',monospace;
        }
        body{background:var(--bg);color:var(--text);font-family:var(--font)}
        .app{display:flex;height:100vh;overflow:hidden}
        #app{display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:14px;background:var(--bg);font-family:var(--font)}
        .sidebar{width:220px;min-width:220px;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column}
        .sidebar-logo{padding:20px 20px 16px;border-bottom:1px solid var(--border)}
        .logo-badge{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#15803d,#16a34a);border-radius:10px;padding:8px 12px;font-size:13px;font-weight:700;letter-spacing:.5px;color:#dcfce7}
        .logo-sub{margin-top:6px;font-size:11px;color:var(--text3);font-weight:500}
        .sidebar-nav{flex:1;padding:12px 0;overflow-y:auto}
        .nav-section{padding:0 12px 4px;margin-bottom:2px}
        .nav-section-label{font-size:11px;font-weight:600;color:var(--text3);padding:8px 8px 4px}
        .nav-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;font-size:13px;font-weight:500;color:var(--text2);cursor:pointer;transition:all .15s;margin-bottom:2px;border:none;background:none;width:100%;text-align:left}
        .nav-item:hover{background:var(--surface2);color:var(--text)}
        .nav-item.active{background:rgba(22,163,74,.15);color:var(--accent)}
        .nav-item .badge{margin-left:auto;background:var(--accent);color:#fff;border-radius:10px;font-size:10px;padding:1px 6px;font-family:var(--mono)}
        .sidebar-footer{padding:12px;border-top:1px solid var(--border);font-size:11px;color:var(--text3)}
        .user-row{display:flex;align-items:center;gap:8px}
        .avatar{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--accent2),#14532d);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0}
        .main{flex:1;display:flex;flex-direction:column;overflow:hidden}
        .topbar{padding:0 24px;height:56px;min-height:56px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px;background:var(--surface)}
        .topbar-title{font-size:15px;font-weight:600;flex:1}
        .topbar-actions{display:flex;gap:8px}
        .content{flex:1;overflow-y:auto;padding:24px}
        .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:var(--font);transition:all .15s}
        .btn:disabled{opacity:.5;cursor:not-allowed}
        .btn-primary{background:var(--accent);color:#fff}.btn-primary:hover:not(:disabled){background:var(--accent2)}
        .btn-secondary{background:var(--surface2);color:var(--text2);border:1px solid var(--border)}.btn-secondary:hover:not(:disabled){color:var(--text);border-color:var(--border2)}
        .btn-green{background:var(--green);color:#fff}.btn-green:hover:not(:disabled){background:#059669}
        .btn-red{background:var(--red);color:#fff}
        .btn-amber{background:var(--amber);color:#000;font-weight:700}
        .btn-sm{padding:5px 10px;font-size:12px}
        .card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px}
        .card-sm{padding:14px 16px}
        .stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
        .stat-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px}
        .stat-label{font-size:12px;font-weight:500;color:var(--text3)}
        .stat-value{font-size:28px;font-weight:700;margin-top:4px}
        .stat-sub{font-size:11px;color:var(--text3);margin-top:2px}
        .status-pill{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;border:1px solid transparent;white-space:nowrap}
        .status-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
        .table{width:100%;border-collapse:collapse}
        .table th{text-align:left;padding:10px 14px;font-size:12px;font-weight:600;color:var(--text3);border-bottom:1px solid var(--border);cursor:pointer;user-select:none}
        .table th:hover{color:var(--text2)}
        .table td{padding:13px 14px;font-size:13px;border-bottom:1px solid var(--border);vertical-align:middle}
        .table tr:last-child td{border-bottom:none}
        .table tr:hover td{background:var(--surface2)}
        .table tr{cursor:pointer}
        .form-group{margin-bottom:16px}
        .form-label{font-size:13px;color:var(--text2);font-weight:500;margin-bottom:6px;display:block}
        .form-input{width:100%;background:var(--bg);border:1px solid var(--border2);border-radius:8px;padding:9px 12px;color:var(--text);font-size:13px;font-family:var(--font);outline:none;transition:border-color .15s}
        .form-input:focus{border-color:var(--accent)}
        select.form-input option{background:var(--surface)}
        textarea.form-input{resize:vertical;min-height:68px}
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:1000;padding:24px}
        .modal{background:var(--surface);border:1px solid var(--border2);border-radius:16px;width:100%;max-width:640px;max-height:90vh;overflow-y:auto;box-shadow:0 25px 60px rgba(0,0,0,.3)}
        .modal-lg{max-width:820px}
        .modal-header{padding:20px 24px 0;display:flex;align-items:flex-start;justify-content:space-between}
        .modal-title{font-size:17px;font-weight:700}
        .modal-sub{font-size:12px;color:var(--text2);margin-top:3px}
        .modal-body{padding:20px 24px}
        .modal-footer{padding:16px 24px 20px;display:flex;justify-content:flex-end;gap:8px;border-top:1px solid var(--border)}
        .stepper{display:flex;gap:0;margin-bottom:24px;overflow-x:auto}
        .step-item{flex:1;display:flex;flex-direction:column;align-items:center;position:relative;min-width:55px}
        .step-item:not(:last-child)::after{content:'';position:absolute;top:14px;left:50%;width:100%;height:2px;background:var(--border2)}
        .step-item.done:not(:last-child)::after{background:var(--green)}
        .step-dot{width:28px;height:28px;border-radius:50%;background:var(--surface2);border:2px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;z-index:1;color:var(--text3)}
        .step-item.done .step-dot{background:var(--green);border-color:var(--green);color:#fff}
        .step-item.active .step-dot{background:var(--accent);border-color:var(--accent);color:#fff}
        .step-label{font-size:10px;color:var(--text3);margin-top:5px;text-align:center;max-width:70px}
        .step-item.active .step-label{color:var(--accent)}
        .step-item.done .step-label{color:var(--green)}
        .divider{height:1px;background:var(--border);margin:16px 0}
        .section-header{display:flex;align-items:center;justify-content:space-between}
        .section-title{font-size:14px;font-weight:700;color:var(--text)}
        .uw-artifact{background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:12px 14px;margin-bottom:8px}
        .uw-artifact-label{font-size:11px;color:var(--text3);margin-bottom:4px;font-weight:500;text-transform:uppercase;letter-spacing:.5px}
        .tag{display:inline-block;padding:2px 8px;border-radius:5px;font-size:11px;font-weight:600}
        .mono{font-family:var(--mono)}
        .text-sm{font-size:12px}.text-xs{font-size:11px}.text-dim{color:var(--text3)}.text-green{color:var(--green)}.text-red{color:var(--red)}
        .flex{display:flex}.items-center{align-items:center}.justify-between{justify-content:space-between}
        .gap-8{gap:8px}.mb-8{margin-bottom:8px}.mb-12{margin-bottom:12px}.mb-16{margin-bottom:16px}.mb-24{margin-bottom:24px}.mt-8{margin-top:8px}
        .fw-600{font-weight:600}.fw-700{font-weight:700}
        .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .scrollbar::-webkit-scrollbar{width:4px}
        .scrollbar::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}
        .notification-toast{position:fixed;bottom:24px;right:24px;z-index:9999;background:#fff;border:1px solid #c6e6d0;border-radius:12px;padding:14px 18px;display:flex;align-items:center;gap:10px;font-size:13px;box-shadow:0 8px 30px rgba(0,0,0,.2);animation:slideUp .3s ease;max-width:320px}
        @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fade-in{animation:fadeIn .25s ease}
        .spinner{width:14px;height:14px;border:2px solid rgba(22,163,74,.3);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
        .note-card{padding:10px 12px;background:var(--surface2);border-radius:8px;border-left:3px solid var(--border2);margin-bottom:8px}
        .note-card.risk{border-left-color:var(--red)}.note-card.approval{border-left-color:var(--green)}.note-card.condition{border-left-color:var(--amber)}.note-card.system{border-left-color:var(--accent)}
        .sbar{height:6px;background:var(--surface2);border-radius:3px;overflow:hidden}
        .sfill{height:100%;border-radius:3px}
        @media(max-width:768px){.sidebar{display:none}.stat-grid{grid-template-columns:1fr 1fr}}
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <div id="app">
        <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'linear-gradient(135deg,#15803d,#16a34a)',borderRadius:10,padding:'8px 12px',fontSize:13,fontWeight:700,color:'#dcfce7'}}>&#x2B21; CapFlow</div>
        <div style={{fontSize:11,color:'#7aab8a',letterSpacing:'1.5px',textTransform:'uppercase'}}>Loading...</div>
      </div>
      <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js" defer></script>
      <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js" defer></script>
      <script src="https://unpkg.com/@babel/standalone@7.23.0/babel.min.js" defer></script>
      <script type="text/babel" data-type="module">{`
const {useState,useEffect,useCallback,useRef}=React;
const SC={new:'#64748b',scrubbing:'#8b5cf6',underwriting:'#f59e0b',offered:'#16a34a',docs:'#06b6d4',contracts:'#6366f1',bankverify:'#f97316',funded:'#16a34a',declined:'#dc2626',renewal:'#06b6d4'};
const SL={new:'New',scrubbing:'Scrubbing',underwriting:'Underwriting',offered:'Offered',docs:'Docs Out',contracts:'Contracts',bankverify:'Bank Verify',funded:'Funded',declined:'Declined',renewal:'Renewal'};
const NS={new:'scrubbing',scrubbing:'underwriting',underwriting:'offered',offered:'docs',docs:'contracts',contracts:'bankverify',bankverify:'funded'};
const STEPS=['new','scrubbing','underwriting','offered','docs','contracts','bankverify','funded'];
const f$=n=>n!=null?'$'+Number(n).toLocaleString():'--';
const fx=n=>n!=null?Number(n).toFixed(3)+'x':'--';
const rc=r=>r>=70?'var(--green)':r>=50?'var(--amber)':'var(--red)';
const isToday=d=>{if(!d)return false;return new Date(d).toDateString()===new Date().toDateString()};
const NCC={general:'var(--text3)',risk:'var(--red)',approval:'var(--green)',condition:'var(--amber)',followup:'var(--purple)',system:'var(--accent)'};

function StatusPill({status}){
  const c=SC[status]||'#64748b';
  return <span className="status-pill" style={{background:c+'18',borderColor:c+'44',color:c}}><span className="status-dot" style={{background:c}}/>{SL[status]||status}</span>;
}
function Toast({msg,onClose}){
  useEffect(()=>{const t=setTimeout(onClose,3500);return()=>clearTimeout(t)},[]);
  return <div className="notification-toast"><span style={{color:'var(--green)'}}>✓</span><span>{msg}</span></div>;
}
function mapDeal(d){
  const profit=d.amount_approved&&d.factor_rate?Math.round(d.amount_approved*(1.499-d.factor_rate)):null;
  return{id:d.deal_number||d.id,dbId:d.id,business:d.business_name||'Unknown',contact:d.contact_name||'',email:d.contact_email||'',broker:d.broker?.name||d.contact_email||'Unknown',amount:d.amount_approved||null,requested:d.amount_requested||null,status:d.status||'new',risk:d.risk_score||null,factor:d.factor_rate||null,termDays:d.term_months?d.term_months*30:null,positions:d.positions||0,dailyBal:d.avg_daily_balance||null,monthlyRev:d.monthly_revenue||null,nyCourt:d.ny_court_result||null,dataMerch:d.datamerch_result||null,submitted:d.submitted_at?d.submitted_at.slice(0,10):'',submittedAt:d.submitted_at||null,funded:d.funded_at?d.funded_at.slice(0,10):null,balance:d.balance||null,notes:d.notes||'',uwNotes:(d.deal_notes||[]).map(n=>({id:n.id,text:n.body||'',cat:n.category||'general',author:n.author||'System',time:n.created_at?new Date(n.created_at).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}):''  })),profit,payback:d.amount_approved?Math.round(d.amount_approved*1.499):null};
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
  const notify=msg=>setToast(msg);
  const loadDeals=useCallback(async()=>{
    try{const r=await fetch('/api/deals/list');if(!r.ok)throw new Error('HTTP '+r.status);const data=await r.json();if(Array.isArray(data.deals))setDeals(data.deals.map(mapDeal));}catch(e){console.error('Load deals failed:',e.message);}
    setLoading(false);
  },[]);
  useEffect(()=>{loadDeals();timer.current=setInterval(loadDeals,60000);return()=>clearInterval(timer.current)},[loadDeals]);
  const syncSheets=async()=>{setSyncing(true);try{const r=await fetch('/api/sheets/sync',{method:'POST',headers:{Authorization:'Bearer flowcap2024secret'}});const d=await r.json();if(d.success)notify('Sheets synced');else notify('Sync error: '+d.error);}catch(e){notify('Sync failed');}setSyncing(false)};
  const updDeal=useCallback(u=>{setDeals(ds=>ds.map(d=>d.id===u.id?u:d));setSel(s=>s&&s.id===u.id?u:s)},[]);
  const delDeal=useCallback(id=>{setDeals(ds=>ds.filter(d=>d.id!==id));setSel(null);notify('Deal deleted')},[]);
  const active=deals.filter(d=>!['funded','declined'].includes(d.status));
  const funded=deals.filter(d=>d.status==='funded');
  const uwCount=deals.filter(d=>d.status==='underwriting').length;
  const todayCnt=deals.filter(d=>isToday(d.submittedAt)).length;
  const tf=funded.reduce((s,d)=>s+(d.amount||0),0);
  const tp=deals.reduce((s,d)=>s+(d.profit||0),0);
  if(loading)return <div id="app"><div style={{display:'inline-flex',alignItems:'center',gap:8,background:'linear-gradient(135deg,#15803d,#16a34a)',borderRadius:10,padding:'8px 12px',fontSize:13,fontWeight:700,color:'#dcfce7'}}>&#x2B21; CapFlow</div><div style={{fontSize:11,color:'#7aab8a',letterSpacing:'1.5px',textTransform:'uppercase',marginTop:8}}>Loading deals...</div></div>;
  const NAV=[{id:'dashboard',l:'Dashboard'},{id:'deals',l:'All Deals',b:todayCnt>0?todayCnt:null},{id:'pipeline',l:'Pipeline',b:active.length||null},{id:'uwqueue',l:'UW Queue',b:uwCount||null},{id:'brokers',l:'Brokers / ISO'},{id:'contracts',l:'Contracts'}];
  const PT={dashboard:'Dashboard',deals:'All Deals',pipeline:'Pipeline',uwqueue:'UW Queue',brokers:'Brokers / ISO',contracts:'Contracts'};
  return(
    <>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-logo"><div className="logo-badge">&#x2B21; CapFlow</div><div className="logo-sub">Advance Management</div></div>
          <nav className="sidebar-nav">
            <div className="nav-section">
              <div className="nav-section-label">Workspace</div>
              {NAV.map(n=><button key={n.id} className={'nav-item'+(pg===n.id?' active':'')} onClick={()=>setPg(n.id)}>{n.l}{n.b>0&&<span className="badge">{n.b}</span>}</button>)}
            </div>
          </nav>
          <div className="sidebar-footer"><div className="user-row"><div className="avatar">JD</div><div><div style={{fontWeight:600,color:'var(--text2)',fontSize:12}}>Jamie Donahue</div><div style={{fontSize:10,color:'var(--text3)'}}>Internal Ops</div></div></div></div>
        </aside>
        <main className="main">
          <div className="topbar">
            <div className="topbar-title">{PT[pg]||pg}</div>
            {todayCnt>0&&<span style={{fontSize:11,color:'var(--green)',background:'rgba(22,163,74,.1)',border:'1px solid rgba(22,163,74,.2)',padding:'2px 8px',borderRadius:10,fontFamily:'var(--mono)'}}>{todayCnt} new today</span>}
            <div className="topbar-actions">
              <button className="btn btn-secondary btn-sm" onClick={loadDeals}>Refresh</button>
              <button className="btn btn-secondary btn-sm" onClick={syncSheets} disabled={syncing}>{syncing?'Syncing...':'Sync Sheets'}</button>
              <button className="btn btn-primary btn-sm" onClick={()=>setShowNew(true)}>+ New Deal</button>
            </div>
          </div>
          <div className="content scrollbar">
            {pg==='dashboard'&&<Dashboard deals={deals} setPg={setPg} setSel={setSel} tf={tf} tp={tp} active={active} funded={funded} todayCnt={todayCnt}/>}
            {pg==='deals'&&<DealsList deals={deals} setSel={setSel} setShowNew={setShowNew}/>}
            {pg==='pipeline'&&<Pipeline deals={deals} setSel={setSel}/>}
            {pg==='uwqueue'&&<UWQueue deals={deals} setSel={setSel}/>}
            {pg==='brokers'&&<Brokers deals={deals}/>}
            {pg==='contracts'&&<Contracts deals={deals} setSel={setSel}/>}
          </div>
        </main>
      </div>
      {sel&&<DealDetail deal={sel} onClose={()=>setSel(null)} onUpdate={updDeal} onDelete={delDeal} onRefresh={loadDeals} notify={notify}/>}
      {showNew&&<NewDealModal onClose={()=>setShowNew(false)} onSave={d=>{setDeals(ds=>[d,...ds]);setShowNew(false);notify('Deal created');}}/>}
      {toast&&<Toast msg={toast} onClose={()=>setToast(null)}/>}
    </>
  );
}

function Dashboard({deals,setPg,setSel,tf,tp,active,funded,todayCnt}){
  const declined=deals.filter(d=>d.status==='declined').length;
  const closed=deals.filter(d=>['funded','declined'].includes(d.status));
  const apr=closed.length>0?Math.round(funded.length/closed.length*100):0;
  const today=deals.filter(d=>isToday(d.submittedAt));
  return(
    <div className="fade-in">
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Funded (all time)</div><div className="stat-value text-green">{f$(tf)}</div><div className="stat-sub">{funded.length} deals</div></div>
        <div className="stat-card"><div className="stat-label">Active Pipeline</div><div className="stat-value">{active.length}</div><div className="stat-sub">{todayCnt} new today</div></div>
        <div className="stat-card"><div className="stat-label">Total Profit</div><div className="stat-value" style={{color:'var(--accent)'}}>{f$(tp)}</div><div className="stat-sub">buy/sell spread</div></div>
        <div className="stat-card"><div className="stat-label">Approval Rate</div><div className="stat-value">{apr}%</div><div className="stat-sub">{declined} declined</div></div>
      </div>
      {today.length>0&&<div className="card mb-16" style={{background:'rgba(22,163,74,.05)',border:'1px solid rgba(22,163,74,.2)',padding:'12px 16px'}}><div style={{display:'flex',alignItems:'center',gap:8}}><span style={{width:8,height:8,borderRadius:'50%',background:'var(--green)',display:'block',flexShrink:0}}/><div style={{flex:1,fontSize:13}}><span style={{fontWeight:600,color:'var(--green)'}}>{today.length} new today: </span><span style={{color:'var(--text3)'}}>{today.slice(0,3).map(d=>d.business).join(', ')}{today.length>3?' ...':''}</span></div><button className="btn btn-secondary btn-sm" onClick={()=>setPg('deals')}>View All</button></div></div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 280px',gap:16}}>
        <div className="card">
          <div className="section-header mb-16"><div className="section-title">Recent Deals</div><button className="btn btn-secondary btn-sm" onClick={()=>setPg('deals')}>View All</button></div>
          <table className="table">
            <thead><tr><th>Business</th><th>Broker</th><th>Amount</th><th>Status</th><th>Risk</th><th>Profit</th></tr></thead>
            <tbody>{deals.slice(0,8).map(d=>(
              <tr key={d.id} onClick={()=>setSel(d)}>
                <td><div style={{display:'flex',alignItems:'center',gap:6}}>{isToday(d.submittedAt)&&<span style={{width:6,height:6,borderRadius:'50%',background:'var(--green)',display:'block',flexShrink:0}}/>}<div><div style={{fontWeight:600,maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.business}</div><div style={{fontSize:11,color:'var(--text3)',fontFamily:'var(--mono)'}}>{d.id}</div></div></div></td>
                <td style={{fontSize:12,color:'var(--text2)',maxWidth:110,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.broker}</td>
                <td style={{fontFamily:'var(--mono)',fontSize:12,color:d.amount?'var(--accent)':'var(--text3)',fontWeight:600}}>{d.amount?f$(d.amount):f$(d.requested)}</td>
                <td><StatusPill status={d.status}/></td>
                <td>{d.risk!=null?<span style={{fontSize:12,fontFamily:'var(--mono)',fontWeight:700,color:rc(d.risk)}}>{d.risk}</span>:'--'}</td>
                <td style={{fontFamily:'var(--mono)',fontSize:12,color:d.profit?'var(--green)':'var(--text3)',fontWeight:600}}>{d.profit?f$(d.profit):'--'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className="card">
            <div className="section-title mb-12">Pipeline Status</div>
            {['new','scrubbing','underwriting','offered','contracts','bankverify'].map(s=>{const cnt=deals.filter(d=>d.status===s).length;if(!cnt)return null;return<div key={s} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}><StatusPill status={s}/><span style={{fontSize:13,fontFamily:'var(--mono)',fontWeight:700}}>{cnt}</span></div>})}
          </div>
          <div className="card">
            <div className="section-title mb-12">Automation Status</div>
            {[{l:'Gmail watcher',s:'Every 5 min'},{l:'AI scrubber',s:'Every 3 min'},{l:'Sheets sync',s:'Every 15 min'},{l:'Doc parser',s:'Auto on new deals'}].map((i,x)=>(
              <div key={x} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}><span style={{width:6,height:6,borderRadius:'50%',background:'var(--green)',display:'block',flexShrink:0}}/><div><div style={{fontSize:12,fontWeight:600}}>{i.l}</div><div style={{fontSize:11,color:'var(--text3)'}}>{i.s}</div></div></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DealsList({deals,setSel,setShowNew}){
  const [tab,setTab]=useState('all');
  const [srch,setSrch]=useState('');
  const [sc,setSc]=useState('submitted');
  const [sd,setSD]=useState('desc');
  const tabs=[{id:'all',l:'All',n:deals.length},{id:'today',l:'Today',n:deals.filter(d=>isToday(d.submittedAt)).length},{id:'offered',l:'Offered',n:deals.filter(d=>d.status==='offered').length},{id:'underwriting',l:'Underwriting',n:deals.filter(d=>d.status==='underwriting').length},{id:'funded',l:'Funded',n:deals.filter(d=>d.status==='funded').length},{id:'declined',l:'Declined',n:deals.filter(d=>d.status==='declined').length}];
  const filtered=deals.filter(d=>{
    if(srch){const s=srch.toLowerCase();if(!d.business.toLowerCase().includes(s)&&!d.id.toLowerCase().includes(s)&&!d.broker.toLowerCase().includes(s))return false;}
    if(tab==='today')return isToday(d.submittedAt);
    if(tab==='offered')return d.status==='offered';
    if(tab==='underwriting')return d.status==='underwriting';
    if(tab==='funded')return d.status==='funded';
    if(tab==='declined')return d.status==='declined';
    return true;
  }).sort((a,b)=>{
    let av,bv;
    if(sc==='risk'){av=a.risk||0;bv=b.risk||0;}else if(sc==='amount'){av=a.amount||a.requested||0;bv=b.amount||b.requested||0;}else if(sc==='profit'){av=a.profit||0;bv=b.profit||0;}else{av=a.submittedAt||'';bv=b.submittedAt||'';}
    return sd==='asc'?(av>bv?1:-1):(av<bv?1:-1);
  });
  return(
    <div className="fade-in">
      <div style={{display:'flex',gap:8,marginBottom:16,alignItems:'center'}}>
        <input className="form-input" style={{flex:1}} placeholder="Search business, broker, deal #..." value={srch} onChange={e=>setSrch(e.target.value)}/>
        <button className="btn btn-primary btn-sm" onClick={()=>setShowNew(true)}>+ New Deal</button>
      </div>
      <div style={{display:'flex',borderBottom:'1px solid var(--border)',marginBottom:16,overflowX:'auto'}}>
        {tabs.map(t=><div key={t.id} onClick={()=>setTab(t.id)} style={{padding:'8px 14px',fontSize:12,cursor:'pointer',borderBottom:tab===t.id?'2px solid var(--accent)':'2px solid transparent',color:tab===t.id?'var(--accent)':'var(--text3)',fontWeight:tab===t.id?600:400,whiteSpace:'nowrap',marginBottom:-1}}>{t.l} <span style={{fontSize:10,fontFamily:'var(--mono)',opacity:.7}}>{t.n}</span></div>)}
      </div>
      <div className="card" style={{padding:0}}>
        <table className="table">
          <thead><tr>
            <th>Deal #</th><th>Business</th><th>Broker</th>
            <th onClick={()=>{if(sc==='amount')setSD(x=>x==='asc'?'desc':'asc');else{setSc('amount');setSD('desc')}}}>Amount {sc==='amount'?(sd==='asc'?'↑':'↓'):''}</th>
            <th>Status</th>
            <th onClick={()=>{if(sc==='risk')setSD(x=>x==='asc'?'desc':'asc');else{setSc('risk');setSD('desc')}}}>Risk {sc==='risk'?(sd==='asc'?'↑':'↓'):''}</th>
            <th onClick={()=>{if(sc==='profit')setSD(x=>x==='asc'?'desc':'asc');else{setSc('profit');setSD('desc')}}}>Profit {sc==='profit'?(sd==='asc'?'↑':'↓'):''}</th>
            <th>Rates</th>
            <th onClick={()=>{if(sc==='submitted')setSD(x=>x==='asc'?'desc':'asc');else{setSc('submitted');setSD('desc')}}}>Date {sc==='submitted'?(sd==='asc'?'↑':'↓'):''}</th>
          </tr></thead>
          <tbody>{filtered.map(d=>(
            <tr key={d.id} onClick={()=>setSel(d)}>
              <td style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text3)'}}>{d.id}{isToday(d.submittedAt)&&<span style={{marginLeft:4,fontSize:9,background:'var(--green)',color:'#fff',padding:'1px 4px',borderRadius:3}}>NEW</span>}</td>
              <td><div style={{fontWeight:600,maxWidth:150,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.business}</div><div style={{fontSize:11,color:'var(--text3)'}}>{d.contact}</div></td>
              <td style={{fontSize:12,color:'var(--text2)',maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.broker}</td>
              <td style={{fontFamily:'var(--mono)',fontSize:12,color:d.amount?'var(--accent)':'var(--text3)',fontWeight:600}}>{d.amount?f$(d.amount):f$(d.requested)}</td>
              <td><StatusPill status={d.status}/></td>
              <td>{d.risk!=null?<div><span style={{fontSize:12,fontFamily:'var(--mono)',fontWeight:700,color:rc(d.risk)}}>{d.risk}</span><div className="sbar" style={{width:44,marginTop:2}}><div className="sfill" style={{width:d.risk+'%',background:rc(d.risk)}}/></div></div>:'--'}</td>
              <td style={{fontFamily:'var(--mono)',fontSize:12,color:d.profit?'var(--green)':'var(--text3)',fontWeight:600}}>{d.profit?f$(d.profit):'--'}</td>
              <td style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text3)'}}>{d.factor?fx(d.factor)+' / 1.499x':'--'}</td>
              <td style={{fontSize:11,color:'var(--text3)',fontFamily:'var(--mono)'}}>{d.submitted}</td>
            </tr>
          ))}</tbody>
        </table>
        {!filtered.length&&<div style={{textAlign:'center',padding:32,color:'var(--text3)'}}>No deals match</div>}
      </div>
    </div>
  );
}

function Pipeline({deals,setSel}){
  const stages=['new','scrubbing','underwriting','offered','docs','contracts','bankverify'];
  return(
    <div className="fade-in" style={{overflowX:'auto'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:8,minWidth:900}}>
        {stages.map(s=>{
          const sd=deals.filter(d=>d.status===s);
          const c=SC[s]||'#64748b';
          return(
            <div key={s}>
              <div style={{marginBottom:8,padding:'4px 8px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:10,fontFamily:'var(--mono)',fontWeight:600,color:c,textTransform:'uppercase'}}>{SL[s]}</span>
                <span style={{fontSize:10,fontFamily:'var(--mono)',fontWeight:700,color:'var(--text3)'}}>{sd.length}</span>
              </div>
              {sd.map(d=>(
                <div key={d.id} onClick={()=>setSel(d)} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:10,padding:10,cursor:'pointer',marginBottom:7,transition:'border-color .15s'}} onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border2)'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                  <div style={{fontSize:11,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:2}}>{isToday(d.submittedAt)&&<span style={{display:'inline-block',width:5,height:5,borderRadius:'50%',background:'var(--green)',marginRight:4,verticalAlign:'middle'}}/>}{d.business}</div>
                  <div style={{fontSize:10,color:'var(--text3)',fontFamily:'var(--mono)',marginBottom:3}}>{d.id}</div>
                  <div style={{fontSize:11,fontFamily:'var(--mono)',fontWeight:600,color:d.amount?'var(--accent)':'var(--text3)'}}>{d.amount?f$(d.amount):f$(d.requested)}</div>
                  {d.risk!=null&&<div style={{marginTop:4}}><div className="sbar"><div className="sfill" style={{width:d.risk+'%',background:rc(d.risk)}}/></div></div>}
                  {d.profit&&<div style={{fontSize:10,color:'var(--green)',fontFamily:'var(--mono)',marginTop:3,fontWeight:600}}>+{f$(d.profit)}</div>}
                </div>
              ))}
              {!sd.length&&<div style={{padding:12,textAlign:'center',fontSize:11,color:'var(--text3)'}}>empty</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UWQueue({deals,setSel}){
  const uw=deals.filter(d=>d.status==='underwriting');
  return(
    <div className="fade-in">
      <div style={{marginBottom:16,fontSize:13,color:'var(--text3)'}}>Deals requiring manual review — {uw.length} total</div>
      {uw.map(d=>(
        <div key={d.id} className="card card-sm" style={{marginBottom:10,cursor:'pointer'}} onClick={()=>setSel(d)}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14}}>{d.business}</div>
              <div style={{fontSize:11,color:'var(--text3)',fontFamily:'var(--mono)',marginTop:2}}>{d.id} · {d.broker} · {d.submitted}</div>
            </div>
            {d.monthlyRev&&<div style={{textAlign:'right'}}><div style={{fontSize:11,color:'var(--text3)'}}>Monthly Rev</div><div style={{fontSize:14,fontWeight:700,fontFamily:'var(--mono)',color:d.monthlyRev>=35000?'var(--green)':'var(--red)'}}>{f$(d.monthlyRev)}</div></div>}
            {d.positions>0&&<div style={{textAlign:'right'}}><div style={{fontSize:11,color:'var(--text3)'}}>Positions</div><div style={{fontSize:14,fontWeight:700,fontFamily:'var(--mono)',color:d.positions>=3?'var(--red)':'var(--amber)'}}>{d.positions}</div></div>}
            <button className="btn btn-amber btn-sm">Review</button>
          </div>
          {(d.uwNotes||[]).filter(n=>n.cat==='system').slice(-1).map(n=><div key={n.id} style={{marginTop:8,fontSize:12,color:'var(--text2)',background:'var(--surface2)',borderRadius:6,padding:'6px 10px'}}>{n.text.slice(0,120)}</div>)}
        </div>
      ))}
      {!uw.length&&<div style={{textAlign:'center',padding:32,color:'var(--text3)'}}>No deals in underwriting queue</div>}
    </div>
  );
}

function Brokers({deals}){
  const [sel,setSel]=useState(null);
  const bmap={};
  deals.forEach(d=>{const k=d.broker;if(!k||k==='Unknown')return;if(!bmap[k])bmap[k]={name:k,total:0,funded:0,declined:0,volume:0,active:0};bmap[k].total++;if(d.status==='funded'){bmap[k].funded++;bmap[k].volume+=d.amount||0;}if(d.status==='declined')bmap[k].declined++;if(!['funded','declined'].includes(d.status))bmap[k].active++;});
  const brokers=Object.values(bmap).sort((a,b)=>b.total-a.total);
  return(
    <div className="fade-in" style={{display:'grid',gridTemplateColumns:'240px 1fr',gap:16}}>
      <div>
        <div style={{fontSize:11,color:'var(--text3)',fontFamily:'var(--mono)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:10}}>{brokers.length} ISO shops</div>
        {brokers.map(b=>(
          <div key={b.name} className="card card-sm" style={{cursor:'pointer',borderColor:sel?.name===b.name?'var(--accent)':'var(--border)',marginBottom:8,transition:'border-color .15s'}} onClick={()=>setSel(b)}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}><div className="avatar" style={{fontSize:10,width:26,height:26}}>{b.name.slice(0,2).toUpperCase()}</div><div style={{fontSize:13,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.name}</div></div>
            <div style={{display:'flex',gap:10,fontSize:11,fontFamily:'var(--mono)'}}><span style={{color:'var(--text3)'}}>Deals: <span style={{color:'var(--text)',fontWeight:700}}>{b.total}</span></span><span style={{color:'var(--text3)'}}>Funded: <span style={{color:'var(--green)',fontWeight:700}}>{b.funded}</span></span></div>
          </div>
        ))}
        {!brokers.length&&<div style={{color:'var(--text3)',fontSize:13}}>No brokers yet</div>}
      </div>
      {sel?(
        <div className="fade-in">
          <div className="card mb-16">
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}><div className="avatar" style={{width:38,height:38,fontSize:13}}>{sel.name.slice(0,2).toUpperCase()}</div><div style={{fontSize:16,fontWeight:700}}>{sel.name}</div></div>
            <div className="stat-grid" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:0}}>
              <div className="stat-card" style={{padding:'10px 12px'}}><div className="stat-label">Volume</div><div className="stat-value" style={{fontSize:16,color:'var(--accent)'}}>{f$(sel.volume)}</div></div>
              <div className="stat-card" style={{padding:'10px 12px'}}><div className="stat-label">Funded</div><div className="stat-value" style={{fontSize:16,color:'var(--green)'}}>{sel.funded}</div></div>
              <div className="stat-card" style={{padding:'10px 12px'}}><div className="stat-label">Active</div><div className="stat-value" style={{fontSize:16,color:'var(--amber)'}}>{sel.active}</div></div>
              <div className="stat-card" style={{padding:'10px 12px'}}><div className="stat-label">Conversion</div><div className="stat-value" style={{fontSize:16}}>{sel.total>0?Math.round(sel.funded/sel.total*100):0}%</div></div>
            </div>
          </div>
          <div className="card" style={{padding:0}}>
            <table className="table"><thead><tr><th>ID</th><th>Business</th><th>Amount</th><th>Status</th><th>Risk</th></tr></thead>
            <tbody>{deals.filter(d=>d.broker===sel.name).map(d=>(
              <tr key={d.id}><td style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text3)'}}>{d.id}</td><td style={{fontWeight:600}}>{d.business}</td><td style={{fontFamily:'var(--mono)',fontSize:12,color:d.amount?'var(--accent)':'var(--text3)',fontWeight:600}}>{d.amount?f$(d.amount):f$(d.requested)}</td><td><StatusPill status={d.status}/></td><td>{d.risk!=null?<span style={{fontSize:12,fontFamily:'var(--mono)',fontWeight:700,color:rc(d.risk)}}>{d.risk}</span>:'--'}</td></tr>
            ))}</tbody></table>
          </div>
        </div>
      ):<div style={{textAlign:'center',padding:48,color:'var(--text3)'}}>Select a broker to view their deals</div>}
    </div>
  );
}

function Contracts({deals,setSel}){
  const cd=deals.filter(d=>['offered','contracts','bankverify','funded'].includes(d.status));
  return(
    <div className="fade-in">
      <div style={{marginBottom:16,fontSize:13,color:'var(--text3)'}}>DocuSign integration — contracts auto-generated on offer acceptance</div>
      {cd.map(d=>(
        <div key={d.id} className="card card-sm" style={{display:'flex',alignItems:'center',gap:12,marginBottom:10,cursor:'pointer'}} onClick={()=>setSel(d)}>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{d.business}</div><div style={{fontSize:11,color:'var(--text3)',fontFamily:'var(--mono)',marginTop:2}}>{d.id} · {d.broker}</div></div>
          <div style={{textAlign:'right'}}><div style={{fontSize:14,fontFamily:'var(--mono)',fontWeight:700,color:'var(--accent)'}}>{f$(d.amount)}</div><div style={{fontSize:11,color:'var(--text3)',fontFamily:'var(--mono)'}}>{fx(d.factor)} buy · 1.499x sell</div></div>
          <StatusPill status={d.status}/>
          {d.status==='offered'&&<button className="btn btn-primary btn-sm">Send Contract</button>}
        </div>
      ))}
      {!cd.length&&<div style={{textAlign:'center',padding:32,color:'var(--text3)'}}>No contracts yet</div>}
    </div>
  );
}

function DealDetail({deal,onClose,onUpdate,onDelete,onRefresh,notify}){
  const [tab,setTab]=useState('overview');
  const [note,setNote]=useState('');
  const [ncat,setNcat]=useState('general');
  const [busy,setBusy]=useState('');
  const [confirmDel,setConfirmDel]=useState(false);
  const si=STEPS.indexOf(deal.status);
  const api=async(path,body)=>{const r=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('HTTP '+r.status);return r.json()};
  const advance=async()=>{const next=NS[deal.status];if(!next||!deal.dbId)return;setBusy('advance');try{await api('/api/deals/update',{dbId:deal.dbId,status:next});onUpdate({...deal,status:next});notify('Advanced to '+SL[next]);}catch(e){notify('Failed');}setBusy('')};
  const decline=async()=>{if(!deal.dbId)return;setBusy('decline');try{await api('/api/deals/update',{dbId:deal.dbId,status:'declined'});onUpdate({...deal,status:'declined'});notify('Deal declined');onClose();}catch(e){notify('Failed');}setBusy('')};
  const fund=async()=>{if(!deal.dbId)return;setBusy('fund');try{await api('/api/deals/update',{dbId:deal.dbId,status:'funded'});onUpdate({...deal,status:'funded'});notify('Deal funded!');onClose();}catch(e){notify('Failed');}setBusy('')};
  const scrub=async()=>{if(!deal.dbId)return;setBusy('scrub');try{const data=await api('/api/scrubber/run',{dealId:deal.dbId});notify('Scrub complete — '+(data.approved?'APPROVED':'DECLINED/REVIEW')+' Risk: '+(data.riskScore||'N/A')+'/100');onRefresh();onClose();}catch(e){notify('Failed: '+e.message);}setBusy('')};
  const saveNote=()=>{if(!note.trim())return;onUpdate({...deal,uwNotes:[...(deal.uwNotes||[]),{id:'l-'+Date.now(),text:note.trim(),cat:ncat,author:'Underwriter',time:new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}]});setNote('');notify('Note saved')};
  const flags=[];
  if(deal.nyCourt&&deal.nyCourt!=='clean')flags.push({t:'red',x:'NY Courts: '+deal.nyCourt});
  if(deal.dataMerch&&deal.dataMerch!=='clean')flags.push({t:'amber',x:'DataMerch: '+deal.dataMerch});
  if(deal.positions>=3)flags.push({t:'red',x:deal.positions+' stacked positions'});
  else if(deal.positions===2)flags.push({t:'amber',x:'2 positions — review stack'});
  if(deal.dailyBal&&deal.dailyBal<1000)flags.push({t:'red',x:'Daily balance below $1,000 minimum'});
  if(deal.monthlyRev&&deal.monthlyRev<35000)flags.push({t:'red',x:'Monthly revenue below $35,000 minimum'});
  if(!flags.length&&deal.risk>=65)flags.push({t:'green',x:'All checks passed — strong profile'});
  return(
    <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="modal modal-lg fade-in">
        <div className="modal-header">
          <div><div style={{fontSize:11,fontFamily:'var(--mono)',color:'var(--text3)',marginBottom:4}}>{deal.id} · {deal.submitted}</div><div className="modal-title">{deal.business}</div><div className="modal-sub">Broker: {deal.broker}{isToday(deal.submittedAt)?' · 🟢 Today':''}</div></div>
          <div style={{display:'flex',gap:6,alignItems:'center'}}><StatusPill status={deal.status}/>{deal.status==='scrubbing'&&<div className="spinner"/>}<button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button></div>
        </div>
        <div className="modal-body">
          {deal.status!=='declined'&&(
            <div style={{overflowX:'auto',paddingBottom:4,marginBottom:16}}>
              <div className="stepper" style={{minWidth:480}}>
                {STEPS.map((s,i)=><div key={s} className={'step-item'+(i<si?' done':i===si?' active':'')}><div className="step-dot">{i<si?'✓':i+1}</div><div className="step-label">{SL[s]}</div></div>)}
              </div>
            </div>
          )}
          {deal.status==='declined'&&<div style={{marginBottom:14,padding:'10px 14px',background:'rgba(220,38,38,.06)',border:'1px solid rgba(220,38,38,.2)',borderRadius:8,fontSize:13,color:'var(--red)'}}>Deal declined — {(deal.uwNotes||[]).find(n=>n.cat==='risk')?.text?.slice(0,100)||'See notes'}</div>}
          {deal.amount&&(
            <div style={{background:'linear-gradient(135deg,rgba(22,163,74,.08),rgba(5,150,105,.06))',border:'1px solid rgba(22,163,74,.25)',borderRadius:12,padding:16,marginBottom:14}}>
              <div style={{fontSize:11,fontFamily:'var(--mono)',color:'var(--text3)',textTransform:'uppercase',letterSpacing:1,marginBottom:4}}>Approved Offer</div>
              <div style={{fontSize:32,fontWeight:700,fontFamily:'var(--mono)',color:'var(--text)'}}>{f$(deal.amount)}</div>
              <div style={{display:'flex',gap:20,marginTop:10,flexWrap:'wrap'}}>
                {[{l:'Buy rate',v:fx(deal.factor)},{l:'Sell rate',v:'1.499x'},{l:'Term',v:(deal.termDays||'--')+' days'},{l:'Our profit',v:f$(deal.profit),g:true},{l:'Payback',v:f$(deal.payback)},{l:'Daily payment',v:f$(deal.payback&&deal.termDays?Math.round(deal.payback/deal.termDays):null)}].map((m,i)=>(
                  <div key={i}><div style={{fontSize:10,color:'var(--text3)',fontFamily:'var(--mono)',textTransform:'uppercase'}}>{m.l}</div><div style={{fontSize:13,fontWeight:700,fontFamily:'var(--mono)',color:m.g?'var(--green)':'var(--text)',marginTop:2}}>{m.v}</div></div>
                ))}
              </div>
            </div>
          )}
          <div style={{display:'flex',borderBottom:'1px solid var(--border)',marginBottom:14,overflowX:'auto'}}>
            {['overview','underwriting','notes','timeline'].map(t=><div key={t} onClick={()=>setTab(t)} style={{padding:'7px 12px',fontSize:12,cursor:'pointer',borderBottom:tab===t?'2px solid var(--accent)':'2px solid transparent',color:tab===t?'var(--accent)':'var(--text3)',fontWeight:tab===t?600:400,whiteSpace:'nowrap',marginBottom:-1,textTransform:'capitalize',position:'relative'}}>{t}{t==='notes'&&(deal.uwNotes||[]).length>0&&<span style={{position:'absolute',top:4,right:2,width:5,height:5,borderRadius:'50%',background:'var(--purple)',display:'block'}}/>}</div>)}
          </div>
          {tab==='overview'&&(
            <div>
              {!deal.amount&&<div style={{marginBottom:12,padding:'10px 12px',background:'var(--surface2)',borderRadius:8,fontSize:13,color:'var(--text3)'}}>No offer yet — run AI scrubber to price this deal</div>}
              <div className="grid-2">
                <div className="uw-artifact"><div className="uw-artifact-label">Contact</div><div style={{fontSize:13,fontWeight:600}}>{deal.contact||'--'}</div></div>
                <div className="uw-artifact"><div className="uw-artifact-label">Email</div><div style={{fontSize:12,wordBreak:'break-all',fontWeight:500}}>{deal.email||'--'}</div></div>
                <div className="uw-artifact"><div className="uw-artifact-label">Requested</div><div style={{fontSize:13,fontWeight:700,fontFamily:'var(--mono)'}}>{f$(deal.requested)}</div></div>
                <div className="uw-artifact"><div className="uw-artifact-label">Submitted</div><div style={{fontSize:13,fontWeight:600,fontFamily:'var(--mono)'}}>{deal.submitted}</div></div>
                <div className="uw-artifact"><div className="uw-artifact-label">Monthly Revenue</div><div style={{fontSize:13,fontWeight:700,fontFamily:'var(--mono)',color:deal.monthlyRev>=35000?'var(--green)':deal.monthlyRev?'var(--red)':'inherit'}}>{f$(deal.monthlyRev)}</div></div>
                <div className="uw-artifact"><div className="uw-artifact-label">Avg Daily Balance</div><div style={{fontSize:13,fontWeight:700,fontFamily:'var(--mono)',color:deal.dailyBal>=1000?'var(--green)':deal.dailyBal?'var(--red)':'inherit'}}>{f$(deal.dailyBal)}</div></div>
              </div>
              {deal.notes&&<div style={{marginTop:10,padding:'8px 12px',background:'var(--surface2)',borderRadius:8,fontSize:12,color:'var(--text2)'}}>{deal.notes.slice(0,300)}</div>}
            </div>
          )}
          {tab==='underwriting'&&(
            <div>
              <div style={{marginBottom:12}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}><span style={{fontSize:13,fontWeight:600}}>Risk Score</span><span style={{fontSize:15,fontFamily:'var(--mono)',fontWeight:700,color:rc(deal.risk||0)}}>{deal.risk!=null?deal.risk+' / 100':'Not scrubbed'}</span></div>
                {deal.risk!=null&&<div className="sbar" style={{height:8}}><div className="sfill" style={{width:deal.risk+'%',background:rc(deal.risk)}}/></div>}
              </div>
              <div className="grid-2 mb-12">
                <div className="uw-artifact"><div className="uw-artifact-label">Positions</div><div style={{fontSize:13,fontWeight:700,color:deal.positions>=3?'var(--red)':deal.positions>=2?'var(--amber)':'var(--green)'}}>{deal.positions} position{deal.positions!==1?'s':''}</div></div>
                <div className="uw-artifact"><div className="uw-artifact-label">NY Courts</div><div style={{fontSize:13,fontWeight:700,color:deal.nyCourt==='clean'?'var(--green)':'var(--red)'}}>{deal.nyCourt||'Pending'}</div></div>
                <div className="uw-artifact"><div className="uw-artifact-label">DataMerch</div><div style={{fontSize:13,fontWeight:700,color:deal.dataMerch==='clean'?'var(--green)':'var(--amber)'}}>{deal.dataMerch||'Pending'}</div></div>
                <div className="uw-artifact"><div className="uw-artifact-label">Monthly Revenue</div><div style={{fontSize:13,fontWeight:700,fontFamily:'var(--mono)',color:deal.monthlyRev>=35000?'var(--green)':deal.monthlyRev?'var(--red)':'inherit'}}>{f$(deal.monthlyRev)}</div></div>
              </div>
              {flags.map((fl,i)=><div key={i} style={{padding:'8px 12px',borderRadius:8,background:fl.t==='red'?'rgba(220,38,38,.06)':fl.t==='amber'?'rgba(202,138,4,.06)':'rgba(22,163,74,.06)',borderLeft:'3px solid '+(fl.t==='red'?'var(--red)':fl.t==='amber'?'var(--amber)':'var(--green)'),marginBottom:7,border:'1px solid '+(fl.t==='red'?'rgba(220,38,38,.2)':fl.t==='amber'?'rgba(202,138,4,.2)':'rgba(22,163,74,.2)')}}>
                <span style={{fontSize:12}}>{fl.x}</span></div>)}
              {!flags.length&&deal.risk==null&&<div style={{textAlign:'center',padding:20,color:'var(--text3)',fontSize:13}}>Run AI scrubber to see underwriting analysis</div>}
            </div>
          )}
          {tab==='notes'&&(
            <div>
              <div style={{marginBottom:12,padding:12,background:'var(--surface2)',borderRadius:10,border:'1px solid var(--border)'}}>
                <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Add underwriter note</div>
                <div style={{display:'flex',gap:5,marginBottom:8,flexWrap:'wrap'}}>
                  {['general','risk','approval','condition','followup'].map(c=><button key={c} onClick={()=>setNcat(c)} style={{padding:'2px 9px',borderRadius:20,fontSize:11,cursor:'pointer',border:'1px solid '+(ncat===c?NCC[c]:'var(--border)'),background:ncat===c?NCC[c]+'22':'transparent',color:ncat===c?NCC[c]:'var(--text3)',transition:'all .15s',fontFamily:'var(--font)'}}>{c}</button>)}
                </div>
                <textarea className="form-input" style={{minHeight:60,marginBottom:8}} placeholder="Add note..." value={note} onChange={e=>setNote(e.target.value)}/>
                <button className="btn btn-primary btn-sm" onClick={saveNote} disabled={!note.trim()}>Save Note</button>
              </div>
              {!(deal.uwNotes||[]).length&&<div style={{textAlign:'center',padding:24,color:'var(--text3)'}}>No notes yet</div>}
              {(deal.uwNotes||[]).slice().reverse().map(n=>(
                <div key={n.id} className={'note-card '+(n.cat||'general')}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span style={{fontSize:9,fontFamily:'var(--mono)',textTransform:'uppercase',fontWeight:700,color:NCC[n.cat]||'var(--text3)'}}>{n.cat}</span><span style={{fontSize:10,color:'var(--text3)',fontFamily:'var(--mono)'}}>{n.author} · {n.time}</span></div>
                  <div style={{fontSize:13,lineHeight:1.5}}>{n.text}</div>
                </div>
              ))}
            </div>
          )}
          {tab==='timeline'&&(
            <div>
              {[deal.submitted&&{t:deal.submitted,x:'Deal submitted from '+deal.broker,c:'var(--accent)'},deal.status!=='new'&&{t:deal.submitted,x:'AI scrubber triggered',c:'var(--accent)'},deal.risk&&{t:deal.submitted,x:'Scrub complete · Risk: '+deal.risk+'/100',c:deal.risk>=65?'var(--green)':'var(--amber)'},deal.amount&&{t:deal.submitted,x:'Offer: '+f$(deal.amount)+' @ '+fx(deal.factor)+' · Profit: '+f$(deal.profit),c:'var(--green)'},deal.status==='funded'&&{t:deal.funded||'',x:'Funded — ACH sent',c:'var(--green)'},deal.status==='declined'&&{t:deal.submitted,x:'Deal declined',c:'var(--red)'},...(deal.uwNotes||[]).map(n=>({t:n.time,x:n.author+' — '+n.text.slice(0,80),c:NCC[n.cat]||'var(--text3)'}))].filter(Boolean).map((e,i,arr)=>(
                <div key={i} style={{display:'flex',gap:12,paddingBottom:16,position:'relative'}}>
                  {i<arr.length-1&&<div style={{position:'absolute',left:9,top:22,width:2,height:'calc(100% - 10px)',background:'var(--border)'}}/>}
                  <div style={{width:20,height:20,minWidth:20,borderRadius:'50%',background:e.c+'22',border:'2px solid '+e.c,marginTop:1,zIndex:1}}/>
                  <div><div style={{fontSize:12,fontWeight:500}}>{e.x}</div><div style={{fontSize:10,color:'var(--text3)',fontFamily:'var(--mono)',marginTop:2}}>{e.t}</div></div>
                </div>
              ))}
            </div>
          )}
          <div className="divider"/>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {['new','scrubbing','underwriting'].includes(deal.status)&&<button className="btn btn-amber" onClick={scrub} disabled={busy==='scrub'}>{busy==='scrub'?<span style={{display:'flex',alignItems:'center',gap:6}}><div className="spinner"/>Scrubbing...</span>:'Run AI Scrub'}</button>}
            {deal.status==='offered'&&<button className="btn btn-primary" onClick={()=>{onUpdate({...deal,status:'contracts'});notify('Moved to contracts');}}>Send Contract</button>}
            {deal.status==='contracts'&&<button className="btn btn-secondary">Open DocuSign</button>}
            {deal.status==='bankverify'&&<button className="btn btn-green" onClick={fund} disabled={busy==='fund'}>{busy==='fund'?'...':'Mark Funded'}</button>}
            {!['funded','declined'].includes(deal.status)&&NS[deal.status]&&<button className="btn btn-secondary" onClick={advance} disabled={busy==='advance'}>{busy==='advance'?'...':'Advance to '+SL[NS[deal.status]]}</button>}
            {!['funded','declined'].includes(deal.status)&&<button className="btn btn-red btn-sm" onClick={decline} disabled={busy==='decline'}>{busy==='decline'?'...':'Decline'}</button>}
          </div>
          <div className="divider"/>
          {!confirmDel?<button className="btn btn-secondary btn-sm" style={{color:'var(--red)',borderColor:'rgba(220,38,38,.3)'}} onClick={()=>setConfirmDel(true)}>Delete Deal</button>:(
            <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(220,38,38,.06)',border:'1px solid rgba(220,38,38,.2)',borderRadius:8,padding:'10px 14px'}}>
              <span style={{fontSize:12,color:'var(--red)',flex:1}}>Delete <strong>{deal.id}</strong>? Cannot be undone.</span>
              <button className="btn btn-secondary btn-sm" onClick={()=>setConfirmDel(false)}>Cancel</button>
              <button className="btn btn-red btn-sm" onClick={()=>{onDelete(deal.id);onClose();}}>Confirm</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NewDealModal({onClose,onSave}){
  const [step,setStep]=useState(0);
  const [f,setF]=useState({business:'',contact:'',email:'',broker:'',requested:'',notes:''});
  const set=(k,v)=>setF(x=>({...x,[k]:v}));
  const save=()=>{onSave({id:'D-NEW-'+Date.now(),dbId:null,business:f.business,contact:f.contact,email:f.email,broker:f.broker,requested:parseInt(f.requested)||0,status:'new',risk:null,factor:null,termDays:null,positions:0,dailyBal:null,monthlyRev:null,nyCourt:null,dataMerch:null,amount:null,submitted:new Date().toISOString().slice(0,10),submittedAt:new Date().toISOString(),funded:null,balance:null,notes:f.notes,uwNotes:[],profit:null,payback:null});onClose()};
  return(
    <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="modal modal-lg fade-in">
        <div className="modal-header"><div><div className="modal-title">New Deal</div><div className="modal-sub">Enter deal info manually</div></div><button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <div className="stepper">{['Merchant Info','Broker Info','Submit'].map((s,i)=><div key={s} className={'step-item'+(i<step?' done':i===step?' active':'')}><div className="step-dot">{i<step?'✓':i+1}</div><div className="step-label">{s}</div></div>)}</div>
          {step===0&&<div className="fade-in"><div className="form-grid"><div className="form-group"><label className="form-label">Business Name *</label><input className="form-input" placeholder="Acme Corp LLC" value={f.business} onChange={e=>set('business',e.target.value)}/></div><div className="form-group"><label className="form-label">Contact Name</label><input className="form-input" placeholder="John Smith" value={f.contact} onChange={e=>set('contact',e.target.value)}/></div><div className="form-group"><label className="form-label">Contact Email</label><input className="form-input" placeholder="john@business.com" value={f.email} onChange={e=>set('email',e.target.value)}/></div><div className="form-group"><label className="form-label">Amount Requested</label><input className="form-input" type="number" placeholder="50000" value={f.requested} onChange={e=>set('requested',e.target.value)}/></div></div><div className="form-group"><label className="form-label">Notes</label><textarea className="form-input" placeholder="Industry, positions, context..." value={f.notes} onChange={e=>set('notes',e.target.value)}/></div></div>}
          {step===1&&<div className="fade-in"><div className="form-group"><label className="form-label">Broker / ISO Name *</label><input className="form-input" placeholder="Capital Partners LLC" value={f.broker} onChange={e=>set('broker',e.target.value)}/></div></div>}
          {step===2&&<div className="fade-in"><div className="uw-artifact mb-12"><div className="uw-artifact-label">Summary</div><div style={{fontSize:13,fontWeight:600}}>{f.business}</div><div style={{fontSize:12,color:'var(--text3)',marginTop:3}}>Broker: {f.broker} · Requested: {f.requested?'$'+Number(f.requested).toLocaleString():'TBD'}</div></div><p style={{fontSize:13,color:'var(--text3)'}}>Deal will be created as New. Run AI Scrub after uploading bank statements.</p></div>}
        </div>
        <div className="modal-footer">
          {step>0&&<button className="btn btn-secondary" onClick={()=>setStep(s=>s-1)}>Back</button>}
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          {step<2&&<button className="btn btn-primary" onClick={()=>setStep(s=>s+1)} disabled={step===0&&!f.business||step===1&&!f.broker}>Next</button>}
          {step===2&&<button className="btn btn-green" onClick={save}>Create Deal</button>}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(React.createElement(App));
      `}</script>
    </>
  );
}
