import { useState, useEffect, useCallback, useRef } from 'react'

const SC={new:'#64748b',scrubbing:'#8b5cf6',underwriting:'#f59e0b',pending:'#ec4899',offered:'#10b981',docs:'#06b6d4',contracts:'#6366f1',bankverify:'#f97316',funded:'#16a34a',declined:'#ef4444',renewal:'#06b6d4'}
const SL={new:'New',scrubbing:'Scrubbing',underwriting:'Underwriting',pending:'On Hold',offered:'Offered',docs:'Docs Out',contracts:'Contracts',bankverify:'Bank Verify',funded:'Funded',declined:'Declined',renewal:'Renewal'}
const NS={new:'scrubbing',scrubbing:'underwriting',underwriting:'offered',offered:'docs',docs:'contracts',contracts:'bankverify',bankverify:'funded'}
const STEPS=['new','scrubbing','underwriting','offered','docs','contracts','bankverify','funded']
const NCC={general:'#9ca3af',risk:'#ef4444',approval:'#10b981',condition:'#f59e0b',followup:'#a78bfa',system:'#6366f1'}

const f$=n=>n!=null?'$'+Number(n).toLocaleString():'--'
const fx=n=>n!=null?Number(n).toFixed(3)+'x':'--'
const rc=r=>r>=70?'#10b981':r>=50?'#f59e0b':'#ef4444'
const isToday=d=>{if(!d)return false;return new Date(d).toDateString()===new Date().toDateString()}

function StatusPill({status}){
  const c=SC[status]||'#64748b'
  return <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'2px 10px',borderRadius:20,fontSize:11,fontWeight:600,background:c+'18',border:'1px solid '+c+'44',color:c,whiteSpace:'nowrap'}}><span style={{width:6,height:6,borderRadius:'50%',background:c,display:'inline-block',flexShrink:0}}/>{SL[status]||status}</span>
}

function Toast({msg,type='success',onClose}){
  useEffect(()=>{const t=setTimeout(onClose,3500);return()=>clearTimeout(t)},[])
  return <div style={{position:'fixed',bottom:24,right:24,zIndex:9999,background:'#fff',border:'1px solid '+(type==='error'?'#fecaca':'#bbf7d0'),borderRadius:12,padding:'12px 18px',display:'flex',alignItems:'center',gap:10,fontSize:13,boxShadow:'0 8px 30px rgba(0,0,0,.1)',animation:'slideUp .3s ease',maxWidth:320}}><span style={{color:type==='error'?'#ef4444':'#10b981',fontSize:16}}>{type==='error'?'✗':'✓'}</span><span>{msg}</span></div>
}

function mapDeal(d){
  const profit=d.amount_approved&&d.factor_rate?Math.round(d.amount_approved*(1.499-d.factor_rate)):null
  return{id:d.deal_number||d.id,dbId:d.id,business:d.business_name||'Unknown',contact:d.contact_name||'',email:d.contact_email||'',broker:d.broker?.name||d.contact_email||'Unknown',amount:d.amount_approved||null,requested:d.amount_requested||null,status:d.status||'new',risk:d.risk_score||null,factor:d.factor_rate||null,termDays:d.term_months?d.term_months*30:null,positions:d.positions||0,dailyBal:d.avg_daily_balance||null,monthlyRev:d.monthly_revenue||null,nyCourt:d.ny_court_result||null,dataMerch:d.datamerch_result||null,submitted:d.submitted_at?d.submitted_at.slice(0,10):'',submittedAt:d.submitted_at||null,funded:d.funded_at?d.funded_at.slice(0,10):null,balance:d.balance||null,notes:d.notes||'',uwNotes:(d.deal_notes||[]).map(n=>({id:n.id,text:n.body||'',cat:n.category||'general',author:n.author||'System',time:n.created_at?new Date(n.created_at).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}):''  })),profit,payback:d.amount_approved?Math.round(d.amount_approved*1.499):null}
}

export default function App(){
  const [pg,setPg]=useState('dashboard')
  const [deals,setDeals]=useState([])
  const [loading,setLoading]=useState(true)
  const [sel,setSel]=useState(null)
  const [showNew,setShowNew]=useState(false)
  const [syncing,setSyncing]=useState(false)
  const [toast,setToast]=useState(null)
  const timer=useRef(null)
  const notify=(msg,type='success')=>setToast({msg,type})

  const loadDeals=useCallback(async()=>{
    try{const r=await fetch('/api/deals/list');if(!r.ok)throw new Error();const data=await r.json();if(Array.isArray(data.deals))setDeals(data.deals.map(mapDeal))}
    catch(e){console.error('Load deals:',e)}
    setLoading(false)
  },[])

  useEffect(()=>{loadDeals();timer.current=setInterval(loadDeals,60000);return()=>clearInterval(timer.current)},[loadDeals])

  const syncSheets=async()=>{
    setSyncing(true)
    try{const r=await fetch('/api/sheets/sync',{method:'POST',headers:{Authorization:'Bearer flowcap2024secret'}});const d=await r.json();notify(d.success?'Sheets synced':'Sync error: '+d.error,d.success?'success':'error')}
    catch(e){notify('Sync failed','error')}
    setSyncing(false)
  }

  const updDeal=useCallback(u=>{setDeals(ds=>ds.map(d=>d.id===u.id?u:d));setSel(s=>s?.id===u.id?u:s)},[])
  const delDeal=useCallback(id=>{setDeals(ds=>ds.filter(d=>d.id!==id));setSel(null);notify('Deal deleted')},[])

  const active=deals.filter(d=>!['funded','declined'].includes(d.status))
  const funded=deals.filter(d=>d.status==='funded')
  const uwCount=deals.filter(d=>['underwriting','pending'].includes(d.status)).length
  const todayCnt=deals.filter(d=>isToday(d.submittedAt)).length
  const tf=funded.reduce((s,d)=>s+(d.amount||0),0)
  const tp=deals.reduce((s,d)=>s+(d.profit||0),0)

  const NAV=[{id:'dashboard',l:'Dashboard'},{id:'deals',l:'All Deals',b:todayCnt||null},{id:'pipeline',l:'Pipeline',b:active.length||null},{id:'uwqueue',l:'UW Queue',b:uwCount||null},{id:'brokers',l:'Brokers'},{id:'contracts',l:'Contracts'}]

  const css=`
    *{margin:0;padding:0;box-sizing:border-box}
    :root{--bg:#f8f9fc;--s:#fff;--s2:#f1f4f9;--b:#e5e7eb;--b2:#d1d5db;--t:#111827;--t2:#6b7280;--t3:#9ca3af;--acc:#6366f1;--acc2:#4f46e5;font-family:'Inter',sans-serif}
    body{background:var(--bg);color:var(--t);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased}
    ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:var(--b2);border-radius:2px}
    @keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    .spin{animation:spin .7s linear infinite}
  `

  if(loading)return(
    <>
      <style>{css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',flexDirection:'column',gap:12,background:'#f8f9fc'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:32,height:32,borderRadius:9,background:'linear-gradient(135deg,#6366f1,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:700,color:'#fff'}}>C</div><span style={{fontSize:18,fontWeight:700,color:'#111827',letterSpacing:'-.5px'}}>CapFlow</span></div>
        <div style={{fontSize:11,color:'#9ca3af',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:'JetBrains Mono,monospace'}}>Loading deals...</div>
      </div>
    </>
  )

  return(
    <>
      <style>{css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <div style={{display:'flex',height:'100vh',width:'100vw',overflow:'hidden',position:'fixed',top:0,left:0}}>
        {/* SIDEBAR */}
        <div style={{width:216,minWidth:216,height:'100%',background:'#fff',borderRight:'1px solid #e5e7eb',display:'flex',flexDirection:'column',flexShrink:0}}>
          <div style={{padding:'18px 16px 14px',borderBottom:'1px solid #e5e7eb'}}>
            <div style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:28,height:28,borderRadius:8,background:'linear-gradient(135deg,#6366f1,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#fff'}}>C</div><div><div style={{fontSize:14,fontWeight:700,color:'#111827',letterSpacing:'-.3px'}}>CapFlow</div><div style={{fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'1px',fontFamily:'JetBrains Mono,monospace'}}>MCA Platform</div></div></div>
          </div>
          <nav style={{flex:1,padding:'8px 0',overflowY:'auto'}}>
            <div style={{padding:'0 8px',marginBottom:4}}>
              <div style={{fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'1.2px',padding:'8px 8px 4px',fontFamily:'JetBrains Mono,monospace',fontWeight:600}}>Workspace</div>
              {NAV.map(n=>(
                <button key={n.id} onClick={()=>setPg(n.id)} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 10px',borderRadius:7,fontSize:13,fontWeight:500,color:pg===n.id?'#6366f1':'#4b5563',cursor:'pointer',border:'none',background:pg===n.id?'rgba(99,102,241,.1)':'transparent',width:'100%',textAlign:'left',marginBottom:1,transition:'all .12s'}}>
                  {n.l}{n.b>0&&<span style={{marginLeft:'auto',background:'#6366f1',color:'#fff',borderRadius:10,fontSize:10,padding:'1px 6px',fontFamily:'JetBrains Mono,monospace'}}>{n.b}</span>}
                </button>
              ))}
            </div>
          </nav>
          <div style={{padding:10,borderTop:'1px solid #e5e7eb'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 10px',borderRadius:8,background:'#f9fafb'}}>
              <div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#fff',flexShrink:0}}>JD</div>
              <div><div style={{fontSize:12,fontWeight:600,color:'#111827'}}>Jamie Donahue</div><div style={{fontSize:10,color:'#9ca3af'}}>Internal Ops</div></div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div style={{flex:1,minWidth:0,height:'100%',overflow:'hidden',display:'flex',flexDirection:'column'}}>
          <div style={{padding:'0 22px',height:52,minHeight:52,flexShrink:0,borderBottom:'1px solid #e5e7eb',display:'flex',alignItems:'center',gap:10,background:'#fff'}}>
            <div style={{fontSize:14,fontWeight:600,flex:1,color:'#111827'}}>{{dashboard:'Dashboard',deals:'All Deals',pipeline:'Pipeline',uwqueue:'UW Queue',brokers:'Brokers / ISO',contracts:'Contracts'}[pg]||pg}</div>
            {todayCnt>0&&<span style={{fontSize:11,color:'#16a34a',background:'rgba(22,163,74,.1)',border:'1px solid rgba(22,163,74,.2)',padding:'2px 8px',borderRadius:10,fontFamily:'JetBrains Mono,monospace'}}>{todayCnt} new today</span>}
            <div style={{display:'flex',gap:7}}>
              <Btn sm sec onClick={loadDeals}>Refresh</Btn>
              <Btn sm sec onClick={syncSheets} disabled={syncing}>{syncing?'Syncing...':'Sync Sheets'}</Btn>
              <Btn sm onClick={()=>setShowNew(true)}>+ New Deal</Btn>
            </div>
          </div>
          <div style={{flex:1,minHeight:0,overflowY:'auto',padding:20}}>
            {pg==='dashboard'&&<Dashboard deals={deals} setPg={setPg} setSel={setSel} tf={tf} tp={tp} funded={funded} todayCnt={todayCnt}/>}
            {pg==='deals'&&<DealsList deals={deals} setSel={setSel} setShowNew={setShowNew} delDeal={delDeal}/>}
            {pg==='pipeline'&&<Pipeline deals={deals} setSel={setSel}/>}
            {pg==='uwqueue'&&<UWQueue deals={deals} setSel={setSel}/>}
            {pg==='brokers'&&<Brokers deals={deals}/>}
            {pg==='contracts'&&<Contracts deals={deals} setSel={setSel}/>}
          </div>
        </div>
      </div>

      {sel&&<DealDetail deal={sel} onClose={()=>setSel(null)} onUpdate={updDeal} onDelete={delDeal} onRefresh={loadDeals} notify={notify}/>}
      {showNew&&<NewDeal onClose={()=>setShowNew(false)} onSave={d=>{setDeals(ds=>[d,...ds]);setShowNew(false);notify('Deal created')}}/>}
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  )
}

// ─── BUTTON HELPER ────────────────────────────────────────────────────────────
function Btn({children,onClick,disabled,sm,sec,red,grn,amber}){
  const bg=red?'#ef4444':grn?'#16a34a':amber?'#d97706':sec?'#f9fafb':'#6366f1'
  const col=sec?'#4b5563':'#fff'
  const border=sec?'1px solid #e5e7eb':'none'
  return <button onClick={onClick} disabled={disabled} style={{display:'inline-flex',alignItems:'center',gap:5,padding:sm?'5px 10px':'7px 14px',borderRadius:7,fontSize:sm?11:13,fontWeight:600,cursor:'pointer',border,background:disabled?'#e5e7eb':bg,color:disabled?'#9ca3af':col,fontFamily:'Inter,sans-serif',whiteSpace:'nowrap',opacity:disabled?.7:1,transition:'all .12s'}}>{children}</button>
}

// ─── CARD HELPER ──────────────────────────────────────────────────────────────
function Card({children,style,p}){
  return <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:12,padding:p||20,...style}}>{children}</div>
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function Stat({label,value,sub,color}){
  return <Card p="16px 18px"><div style={{fontSize:11,fontWeight:500,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.5px'}}>{label}</div><div style={{fontSize:26,fontWeight:700,margin:'4px 0 2px',color:color||'#111827',fontVariantNumeric:'tabular-nums'}}>{value}</div>{sub&&<div style={{fontSize:11,color:'#9ca3af'}}>{sub}</div>}</Card>
}

// ─── SBAR ─────────────────────────────────────────────────────────────────────
function Sbar({val,color}){
  return <div style={{height:5,background:'#f1f4f9',borderRadius:3,overflow:'hidden',marginTop:3}}><div style={{height:'100%',width:val+'%',background:color||rc(val),borderRadius:3,transition:'width .3s'}}/></div>
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({deals,setPg,setSel,tf,tp,funded,todayCnt}){
  const declined=deals.filter(d=>d.status==='declined').length
  const closed=deals.filter(d=>['funded','declined'].includes(d.status))
  const apr=closed.length>0?Math.round(funded.length/closed.length*100):0
  const today=deals.filter(d=>isToday(d.submittedAt))
  return(
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
        <Stat label="Funded (all time)" value={f$(tf)} sub={funded.length+' deals'} color="#16a34a"/>
        <Stat label="Active Pipeline" value={deals.filter(d=>!['funded','declined'].includes(d.status)).length} sub={todayCnt+' new today'}/>
        <Stat label="Total Profit" value={f$(tp)} sub="buy/sell spread" color="#6366f1"/>
        <Stat label="Approval Rate" value={apr+'%'} sub={declined+' declined'}/>
      </div>
      {today.length>0&&<div style={{marginBottom:16,padding:'10px 14px',background:'rgba(22,163,74,.05)',border:'1px solid rgba(22,163,74,.2)',borderRadius:10,display:'flex',alignItems:'center',gap:10}}><span style={{width:7,height:7,borderRadius:'50%',background:'#16a34a',display:'block',flexShrink:0}}/><div style={{flex:1,fontSize:13}}><span style={{fontWeight:600,color:'#16a34a'}}>{today.length} new today: </span><span style={{color:'#9ca3af'}}>{today.slice(0,3).map(d=>d.business).join(', ')}{today.length>3?' ...':''}</span></div><Btn sm sec onClick={()=>setPg('deals')}>View All</Btn></div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 260px',gap:14}}>
        <Card>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}><div style={{fontSize:14,fontWeight:700}}>Recent Deals</div><Btn sm sec onClick={()=>setPg('deals')}>View All</Btn></div>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>{['Business','Broker','Amount','Status','Risk','Profit'].map(h=><th key={h} style={{textAlign:'left',padding:'7px 10px',fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.8px',borderBottom:'1px solid #f1f4f9',fontWeight:600,fontFamily:'JetBrains Mono,monospace'}}>{h}</th>)}</tr></thead>
            <tbody>{deals.slice(0,8).map(d=>(
              <tr key={d.id} onClick={()=>setSel(d)} style={{cursor:'pointer'}} onMouseEnter={e=>e.currentTarget.style.background='#f9fafb'} onMouseLeave={e=>e.currentTarget.style.background=''}>
                <td style={{padding:'10px 10px'}}><div style={{display:'flex',alignItems:'center',gap:5}}>{isToday(d.submittedAt)&&<span style={{width:5,height:5,borderRadius:'50%',background:'#16a34a',display:'block',flexShrink:0}}/>}<div><div style={{fontWeight:600,maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:13}}>{d.business}</div><div style={{fontSize:10,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace'}}>{d.id}</div></div></div></td>
                <td style={{padding:'10px 10px',fontSize:12,color:'#6b7280',maxWidth:110,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.broker}</td>
                <td style={{padding:'10px 10px',fontFamily:'JetBrains Mono,monospace',fontSize:12,color:d.amount?'#6366f1':'#9ca3af',fontWeight:600}}>{d.amount?f$(d.amount):f$(d.requested)}</td>
                <td style={{padding:'10px 10px'}}><StatusPill status={d.status}/></td>
                <td style={{padding:'10px 10px'}}>{d.risk!=null?<span style={{fontSize:12,fontFamily:'JetBrains Mono,monospace',fontWeight:700,color:rc(d.risk)}}>{d.risk}</span>:'--'}</td>
                <td style={{padding:'10px 10px',fontFamily:'JetBrains Mono,monospace',fontSize:12,color:d.profit?'#16a34a':'#9ca3af',fontWeight:600}}>{d.profit?f$(d.profit):'--'}</td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <Card><div style={{fontSize:13,fontWeight:700,marginBottom:10}}>Pipeline</div>{['new','scrubbing','underwriting','pending','offered','contracts','bankverify'].map(s=>{const cnt=deals.filter(d=>d.status===s).length;if(!cnt)return null;return<div key={s} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}><StatusPill status={s}/><span style={{fontSize:13,fontFamily:'JetBrains Mono,monospace',fontWeight:700}}>{cnt}</span></div>})}</Card>
          <Card><div style={{fontSize:13,fontWeight:700,marginBottom:10}}>Automation</div>{[{l:'Gmail watcher',s:'Every 5 min'},{l:'AI scrubber',s:'Every 3 min'},{l:'Sheets sync',s:'Every 15 min'},{l:'Doc parser',s:'Auto on new deals'}].map((i,x)=><div key={x} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}><span style={{width:6,height:6,borderRadius:'50%',background:'#16a34a',display:'block',flexShrink:0}}/><div><div style={{fontSize:12,fontWeight:600}}>{i.l}</div><div style={{fontSize:11,color:'#9ca3af'}}>{i.s}</div></div></div>)}</Card>
        </div>
      </div>
    </div>
  )
}

// ─── DEALS LIST ───────────────────────────────────────────────────────────────
function DealsList({deals,setSel,setShowNew,delDeal}){
  const [tab,setTab]=useState('all')
  const [srch,setSrch]=useState('')
  const [sc,setSc]=useState('submitted')
  const [sd,setSd]=useState('desc')
  const tabs=[{id:'all',l:'All',n:deals.length},{id:'today',l:'Today',n:deals.filter(d=>isToday(d.submittedAt)).length},{id:'offered',l:'Offered',n:deals.filter(d=>d.status==='offered').length},{id:'underwriting',l:'Underwriting',n:deals.filter(d=>d.status==='underwriting').length},{id:'pending',l:'On Hold',n:deals.filter(d=>d.status==='pending').length},{id:'funded',l:'Funded',n:deals.filter(d=>d.status==='funded').length},{id:'declined',l:'Declined',n:deals.filter(d=>d.status==='declined').length}]
  const filtered=deals.filter(d=>{
    if(srch){const s=srch.toLowerCase();if(!d.business.toLowerCase().includes(s)&&!d.id.toLowerCase().includes(s)&&!d.broker.toLowerCase().includes(s))return false}
    if(tab==='today')return isToday(d.submittedAt)
    if(tab!=='all')return d.status===tab
    return true
  }).sort((a,b)=>{
    let av=sc==='risk'?a.risk||0:sc==='amount'?a.amount||a.requested||0:sc==='profit'?a.profit||0:a.submittedAt||''
    let bv=sc==='risk'?b.risk||0:sc==='amount'?b.amount||b.requested||0:sc==='profit'?b.profit||0:b.submittedAt||''
    return sd==='asc'?(av>bv?1:-1):(av<bv?1:-1)
  })
  const Th=({col,l})=><th onClick={()=>{if(sc===col)setSd(x=>x==='asc'?'desc':'asc');else{setSc(col);setSd('desc')}}} style={{textAlign:'left',padding:'7px 10px',fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.8px',borderBottom:'1px solid #f1f4f9',fontWeight:600,fontFamily:'JetBrains Mono,monospace',cursor:'pointer',userSelect:'none'}}>{l}{sc===col?(sd==='asc'?' ↑':' ↓'):''}</th>
  return(
    <div>
      <div style={{display:'flex',gap:8,marginBottom:14,alignItems:'center'}}>
        <input value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Search deals..." style={{flex:1,padding:'7px 12px',borderRadius:7,border:'1px solid #e5e7eb',fontSize:13,fontFamily:'Inter,sans-serif',outline:'none',background:'#fff'}}/>
        <Btn onClick={()=>setShowNew(true)}>+ New Deal</Btn>
      </div>
      <div style={{display:'flex',borderBottom:'1px solid #e5e7eb',marginBottom:14,overflowX:'auto'}}>
        {tabs.map(t=><div key={t.id} onClick={()=>setTab(t.id)} style={{padding:'7px 14px',fontSize:12,cursor:'pointer',borderBottom:tab===t.id?'2px solid #6366f1':'2px solid transparent',color:tab===t.id?'#6366f1':'#9ca3af',fontWeight:tab===t.id?600:400,whiteSpace:'nowrap',marginBottom:-1}}>{t.l} <span style={{fontSize:10,fontFamily:'JetBrains Mono,monospace',opacity:.7}}>{t.n}</span></div>)}
      </div>
      <Card p={0}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr><th style={{textAlign:'left',padding:'7px 10px',fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.8px',borderBottom:'1px solid #f1f4f9',fontWeight:600,fontFamily:'JetBrains Mono,monospace'}}>Deal #</th><th style={{textAlign:'left',padding:'7px 10px',fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.8px',borderBottom:'1px solid #f1f4f9',fontWeight:600,fontFamily:'JetBrains Mono,monospace'}}>Business</th><th style={{textAlign:'left',padding:'7px 10px',fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.8px',borderBottom:'1px solid #f1f4f9',fontWeight:600,fontFamily:'JetBrains Mono,monospace'}}>Broker</th><Th col="amount" l="Amount"/><th style={{textAlign:'left',padding:'7px 10px',fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.8px',borderBottom:'1px solid #f1f4f9',fontWeight:600,fontFamily:'JetBrains Mono,monospace'}}>Status</th><Th col="risk" l="Risk"/><Th col="profit" l="Profit"/><th style={{textAlign:'left',padding:'7px 10px',fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.8px',borderBottom:'1px solid #f1f4f9',fontWeight:600,fontFamily:'JetBrains Mono,monospace'}}>Rates</th><Th col="submitted" l="Date"/><th style={{textAlign:'left',padding:'7px 10px',fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.8px',borderBottom:'1px solid #f1f4f9',fontWeight:600,fontFamily:'JetBrains Mono,monospace'}}></th></tr></thead>
          <tbody>{filtered.map(d=>(
            <tr key={d.id} onClick={()=>setSel(d)} style={{cursor:'pointer'}} onMouseEnter={e=>e.currentTarget.style.background='#f9fafb'} onMouseLeave={e=>e.currentTarget.style.background=''}>
              <td style={{padding:'11px 10px',fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'#9ca3af'}}>{d.id}{isToday(d.submittedAt)&&<span style={{marginLeft:4,fontSize:9,background:'#16a34a',color:'#fff',padding:'1px 4px',borderRadius:3}}>NEW</span>}</td>
              <td style={{padding:'11px 10px'}}><div style={{fontWeight:600,maxWidth:150,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:13}}>{d.business}</div><div style={{fontSize:10,color:'#9ca3af'}}>{d.contact}</div></td>
              <td style={{padding:'11px 10px',fontSize:12,color:'#6b7280',maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.broker}</td>
              <td style={{padding:'11px 10px',fontFamily:'JetBrains Mono,monospace',fontSize:12,color:d.amount?'#6366f1':'#9ca3af',fontWeight:600}}>{d.amount?f$(d.amount):f$(d.requested)}</td>
              <td style={{padding:'11px 10px'}}><StatusPill status={d.status}/></td>
              <td style={{padding:'11px 10px'}}>{d.risk!=null?<div><span style={{fontSize:12,fontFamily:'JetBrains Mono,monospace',fontWeight:700,color:rc(d.risk)}}>{d.risk}</span><Sbar val={d.risk}/></div>:'--'}</td>
              <td style={{padding:'11px 10px',fontFamily:'JetBrains Mono,monospace',fontSize:12,color:d.profit?'#16a34a':'#9ca3af',fontWeight:600}}>{d.profit?f$(d.profit):'--'}</td>
              <td style={{padding:'11px 10px',fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'#9ca3af'}}>{d.factor?fx(d.factor)+' / 1.499x':'--'}</td>
              <td style={{padding:'11px 10px',fontSize:11,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace'}}>{d.submitted}</td>
              <td style={{padding:'11px 10px'}} onClick={e=>e.stopPropagation()}><Btn sm red onClick={()=>delDeal(d.id)}>✕</Btn></td>
            </tr>
          ))}
          {!filtered.length&&<tr><td colSpan={10} style={{textAlign:'center',padding:32,color:'#9ca3af'}}>No deals found</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

// ─── PIPELINE ─────────────────────────────────────────────────────────────────
function Pipeline({deals,setSel}){
  const stages=['new','scrubbing','underwriting','pending','offered','docs','contracts','bankverify']
  return(
    <div style={{display:'flex',gap:10,overflowX:'auto',alignItems:'flex-start',paddingBottom:8}}>
      {stages.map(s=>{
        const sd=deals.filter(d=>d.status===s)
        const c=SC[s]||'#64748b'
        return(
          <div key={s} style={{width:175,minWidth:175,flexShrink:0}}>
            <div style={{padding:'4px 8px',background:'#fff',border:'1px solid #e5e7eb',borderRadius:7,display:'flex',justifyContent:'space-between',marginBottom:7}}>
              <span style={{fontSize:10,fontFamily:'JetBrains Mono,monospace',fontWeight:600,color:c,textTransform:'uppercase'}}>{SL[s]}</span>
              <span style={{fontSize:10,fontFamily:'JetBrains Mono,monospace',fontWeight:700,color:'#9ca3af'}}>{sd.length}</span>
            </div>
            {sd.map(d=>(
              <div key={d.id} onClick={()=>setSel(d)} style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:9,padding:10,cursor:'pointer',marginBottom:7,transition:'border-color .15s'}} onMouseEnter={e=>e.currentTarget.style.borderColor='#6366f1'} onMouseLeave={e=>e.currentTarget.style.borderColor='#e5e7eb'}>
                <div style={{fontSize:11,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:2}}>{isToday(d.submittedAt)&&<span style={{display:'inline-block',width:5,height:5,borderRadius:'50%',background:'#16a34a',marginRight:4,verticalAlign:'middle'}}/>}{d.business}</div>
                <div style={{fontSize:10,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace',marginBottom:3}}>{d.id}</div>
                <div style={{fontSize:11,fontFamily:'JetBrains Mono,monospace',fontWeight:600,color:d.amount?'#6366f1':'#9ca3af'}}>{d.amount?f$(d.amount):f$(d.requested)}</div>
                {d.risk!=null&&<Sbar val={d.risk}/>}
                {d.profit&&<div style={{fontSize:10,color:'#16a34a',fontFamily:'JetBrains Mono,monospace',marginTop:3,fontWeight:600}}>+{f$(d.profit)}</div>}
              </div>
            ))}
            {!sd.length&&<div style={{padding:10,textAlign:'center',fontSize:11,color:'#d1d5db'}}>empty</div>}
          </div>
        )
      })}
    </div>
  )
}

// ─── UW QUEUE ─────────────────────────────────────────────────────────────────
function UWQueue({deals,setSel}){
  const queue=deals.filter(d=>['underwriting','pending'].includes(d.status))
  return(
    <Card>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
        <div style={{fontSize:14,fontWeight:700}}>UW Queue</div>
        <span style={{background:'rgba(245,158,11,.15)',color:'#d97706',borderRadius:5,fontSize:11,fontWeight:600,padding:'2px 8px'}}>{queue.length} pending</span>
      </div>
      {!queue.length?<div style={{textAlign:'center',padding:'32px 0',color:'#9ca3af'}}>✓ No files awaiting review</div>:queue.map(d=>(
        <div key={d.id} onClick={()=>setSel(d)} style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:8,padding:'12px 14px',marginBottom:10,cursor:'pointer'}} onMouseEnter={e=>e.currentTarget.style.borderColor='#6366f1'} onMouseLeave={e=>e.currentTarget.style.borderColor='#e5e7eb'}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div><div style={{fontWeight:700,fontSize:14}}>{d.business}</div><div style={{fontSize:11,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace',marginTop:2}}>{d.id} · {d.broker} · {d.submitted}</div></div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              {d.status==='pending'&&<span style={{background:'rgba(236,72,153,.1)',color:'#ec4899',borderRadius:5,fontSize:11,fontWeight:600,padding:'2px 8px'}}>ON HOLD</span>}
              {d.monthlyRev&&<div style={{textAlign:'right'}}><div style={{fontSize:11,color:'#9ca3af'}}>Monthly Rev</div><div style={{fontSize:13,fontWeight:700,fontFamily:'JetBrains Mono,monospace',color:d.monthlyRev>=35000?'#16a34a':'#ef4444'}}>{f$(d.monthlyRev)}</div></div>}
              <Btn sm amber onClick={e=>{e.stopPropagation();setSel(d)}}>Review →</Btn>
            </div>
          </div>
          {(d.uwNotes||[]).filter(n=>n.cat==='system').slice(-1).map(n=><div key={n.id} style={{marginTop:8,fontSize:12,color:'#6b7280',background:'#fff',borderRadius:6,padding:'6px 10px',borderLeft:'3px solid #6366f1'}}>{n.text.slice(0,150)}</div>)}
        </div>
      ))}
    </Card>
  )
}

// ─── BROKERS ──────────────────────────────────────────────────────────────────
function Brokers({deals}){
  const [sel,setSel]=useState(null)
  const bmap={}
  deals.forEach(d=>{const k=d.broker;if(!k||k==='Unknown')return;if(!bmap[k])bmap[k]={name:k,total:0,funded:0,declined:0,volume:0,active:0};bmap[k].total++;if(d.status==='funded'){bmap[k].funded++;bmap[k].volume+=d.amount||0}if(d.status==='declined')bmap[k].declined++;if(!['funded','declined'].includes(d.status))bmap[k].active++})
  const brokers=Object.values(bmap).sort((a,b)=>b.total-a.total)
  return(
    <div style={{display:'grid',gridTemplateColumns:'230px 1fr',gap:14}}>
      <div>
        <div style={{fontSize:10,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace',textTransform:'uppercase',letterSpacing:'1px',marginBottom:10}}>{brokers.length} ISO shops</div>
        {brokers.map(b=>(
          <div key={b.name} onClick={()=>setSel(b)} style={{background:'#fff',border:'1px solid '+(sel?.name===b.name?'#6366f1':'#e5e7eb'),borderRadius:10,padding:'10px 12px',cursor:'pointer',marginBottom:8,transition:'border-color .15s'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}><div style={{width:26,height:26,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'#fff',flexShrink:0}}>{b.name.slice(0,2).toUpperCase()}</div><div style={{fontSize:13,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.name}</div></div>
            <div style={{display:'flex',gap:10,fontSize:11,fontFamily:'JetBrains Mono,monospace'}}><span style={{color:'#9ca3af'}}>Deals: <span style={{color:'#111827',fontWeight:700}}>{b.total}</span></span><span style={{color:'#9ca3af'}}>Funded: <span style={{color:'#16a34a',fontWeight:700}}>{b.funded}</span></span></div>
          </div>
        ))}
      </div>
      {sel?(
        <div>
          <Card style={{marginBottom:12}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}><div style={{width:38,height:38,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#fff'}}>{sel.name.slice(0,2).toUpperCase()}</div><div style={{fontSize:16,fontWeight:700}}>{sel.name}</div></div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
              {[{l:'Volume',v:f$(sel.volume),c:'#6366f1'},{l:'Funded',v:sel.funded,c:'#16a34a'},{l:'Active',v:sel.active,c:'#d97706'},{l:'Conversion',v:sel.total>0?Math.round(sel.funded/sel.total*100)+'%':'0%'}].map((s,i)=><div key={i} style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:8,padding:'10px 12px'}}><div style={{fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.5px',fontWeight:500,marginBottom:2}}>{s.l}</div><div style={{fontSize:18,fontWeight:700,color:s.c||'#111827'}}>{s.v}</div></div>)}
            </div>
          </Card>
          <Card p={0}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr>{['ID','Business','Amount','Status','Risk'].map(h=><th key={h} style={{textAlign:'left',padding:'7px 12px',fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.8px',borderBottom:'1px solid #f1f4f9',fontWeight:600,fontFamily:'JetBrains Mono,monospace'}}>{h}</th>)}</tr></thead>
              <tbody>{deals.filter(d=>d.broker===sel.name).map(d=>(
                <tr key={d.id} style={{borderBottom:'1px solid #f9fafb'}}><td style={{padding:'10px 12px',fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'#9ca3af'}}>{d.id}</td><td style={{padding:'10px 12px',fontWeight:600,fontSize:13}}>{d.business}</td><td style={{padding:'10px 12px',fontFamily:'JetBrains Mono,monospace',fontSize:12,color:d.amount?'#6366f1':'#9ca3af',fontWeight:600}}>{d.amount?f$(d.amount):f$(d.requested)}</td><td style={{padding:'10px 12px'}}><StatusPill status={d.status}/></td><td style={{padding:'10px 12px'}}>{d.risk!=null?<span style={{fontSize:12,fontFamily:'JetBrains Mono,monospace',fontWeight:700,color:rc(d.risk)}}>{d.risk}</span>:'--'}</td></tr>
              ))}</tbody>
            </table>
          </Card>
        </div>
      ):<div style={{textAlign:'center',padding:48,color:'#9ca3af'}}>Select a broker to view their deals</div>}
    </div>
  )
}

// ─── CONTRACTS ────────────────────────────────────────────────────────────────
function Contracts({deals,setSel}){
  const cd=deals.filter(d=>['offered','contracts','bankverify','funded'].includes(d.status))
  return(
    <div>
      <div style={{marginBottom:14,fontSize:13,color:'#9ca3af'}}>DocuSign integration — contracts auto-generated on offer acceptance</div>
      {cd.map(d=>(
        <Card key={d.id} p="12px 16px" style={{marginBottom:10,cursor:'pointer',display:'flex',alignItems:'center',gap:12}} onClick={()=>setSel(d)}>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{d.business}</div><div style={{fontSize:11,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace',marginTop:2}}>{d.id} · {d.broker}</div></div>
          <div style={{textAlign:'right'}}><div style={{fontFamily:'JetBrains Mono,monospace',fontWeight:700,fontSize:14,color:'#6366f1'}}>{f$(d.amount)}</div><div style={{fontSize:11,color:'#9ca3af'}}>{fx(d.factor)} · 1.499x sell</div></div>
          <StatusPill status={d.status}/>
          {d.status==='offered'&&<Btn sm onClick={e=>{e.stopPropagation()}}>Send Contract</Btn>}
        </Card>
      ))}
      {!cd.length&&<div style={{textAlign:'center',padding:32,color:'#9ca3af'}}>No contracts yet</div>}
    </div>
  )
}

// ─── DEAL DETAIL ──────────────────────────────────────────────────────────────
function DealDetail({deal,onClose,onUpdate,onDelete,onRefresh,notify}){
  const [tab,setTab]=useState('overview')
  const [note,setNote]=useState('')
  const [ncat,setNcat]=useState('general')
  const [busy,setBusy]=useState('')
  const [confirmDel,setConfirmDel]=useState(false)
  const si=STEPS.indexOf(deal.status)

  const api=async(path,body)=>{const r=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}
  const advance=async()=>{const next=NS[deal.status];if(!next||!deal.dbId)return;setBusy('advance');try{await api('/api/deals/update',{dbId:deal.dbId,status:next});onUpdate({...deal,status:next});notify('Advanced to '+SL[next])}catch(e){notify('Failed','error')}setBusy('')}
  const decline=async()=>{if(!deal.dbId)return;setBusy('decline');try{await api('/api/deals/update',{dbId:deal.dbId,status:'declined'});onUpdate({...deal,status:'declined'});notify('Deal declined');onClose()}catch(e){notify('Failed','error')}setBusy('')}
  const fund=async()=>{if(!deal.dbId)return;setBusy('fund');try{await api('/api/deals/update',{dbId:deal.dbId,status:'funded'});onUpdate({...deal,status:'funded'});notify('Deal funded!');onClose()}catch(e){notify('Failed','error')}setBusy('')}
  const scrub=async()=>{if(!deal.dbId)return;setBusy('scrub');try{const data=await api('/api/scrubber/run',{dealId:deal.dbId});notify('Scrub done — '+(data.approved?'APPROVED':'DECLINED/REVIEW')+' Risk: '+(data.riskScore||'N/A')+'/100');onRefresh();onClose()}catch(e){notify('Failed','error')}setBusy('')}
  const saveNote=()=>{if(!note.trim())return;onUpdate({...deal,uwNotes:[...(deal.uwNotes||[]),{id:'l-'+Date.now(),text:note.trim(),cat:ncat,author:'Underwriter',time:new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}]});setNote('');notify('Note saved')}

  const flags=[]
  if(deal.nyCourt&&deal.nyCourt!=='clean')flags.push({t:'red',x:'NY Courts: '+deal.nyCourt})
  if(deal.positions>=3)flags.push({t:'red',x:deal.positions+' stacked positions'})
  else if(deal.positions===2)flags.push({t:'amber',x:'2 positions — review stack'})
  if(deal.dailyBal&&deal.dailyBal<1000)flags.push({t:'red',x:'Daily balance below $1,000 minimum'})
  if(deal.monthlyRev&&deal.monthlyRev<35000)flags.push({t:'red',x:'Monthly revenue below $35,000 minimum'})
  if(!flags.length&&(deal.risk||0)>=65)flags.push({t:'green',x:'All checks passed'})

  const ov={background:'#fff',border:'1px solid #e5e7eb',position:'fixed',inset:0,zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,.5)'}
  const mv={background:'#fff',borderRadius:14,width:'100%',maxWidth:800,maxHeight:'92vh',overflowY:'auto',boxShadow:'0 25px 60px rgba(0,0,0,.2)'}

  return(
    <div style={ov} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={mv}>
        <div style={{padding:'20px 24px 0',display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12}}>
          <div>
            <div style={{fontSize:11,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace',marginBottom:4}}>{deal.id}{isToday(deal.submittedAt)&&<span style={{marginLeft:6,fontSize:9,background:'#16a34a',color:'#fff',padding:'1px 5px',borderRadius:3}}>TODAY</span>}</div>
            <div style={{fontSize:17,fontWeight:700}}>{deal.business}</div>
            <div style={{fontSize:12,color:'#6b7280',marginTop:3}}>Broker: {deal.broker} · {deal.submitted}</div>
          </div>
          <div style={{display:'flex',gap:6,alignItems:'center',flexShrink:0}}><StatusPill status={deal.status}/><Btn sm sec onClick={onClose}>✕</Btn></div>
        </div>

        <div style={{padding:'16px 24px 0',overflowX:'auto'}}>
          {deal.status!=='declined'&&(
            <div style={{display:'flex',marginBottom:16,minWidth:480}}>
              {STEPS.map((s,i)=>(
                <div key={s} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',position:'relative',minWidth:55}}>
                  {i<STEPS.length-1&&<div style={{position:'absolute',top:13,left:'50%',width:'100%',height:2,background:i<si?'#16a34a':'#e5e7eb',zIndex:0}}/>}
                  <div style={{width:26,height:26,borderRadius:'50%',background:i<si?'#16a34a':i===si?'#6366f1':'#f1f4f9',border:'2px solid '+(i<si?'#16a34a':i===si?'#6366f1':'#e5e7eb'),display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:i<=si?'#fff':'#9ca3af',zIndex:1,position:'relative'}}>{i<si?'✓':i+1}</div>
                  <div style={{fontSize:9,color:i===si?'#6366f1':i<si?'#16a34a':'#9ca3af',marginTop:4,textAlign:'center',maxWidth:68,lineHeight:1.3,fontFamily:'JetBrains Mono,monospace',fontWeight:i===si?600:400}}>{SL[s]}</div>
                </div>
              ))}
            </div>
          )}

          {deal.amount&&(
            <div style={{background:'linear-gradient(135deg,rgba(99,102,241,.06),rgba(16,185,129,.04))',border:'1px solid rgba(99,102,241,.2)',borderRadius:12,padding:16,marginBottom:14}}>
              <div style={{fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:1,fontFamily:'JetBrains Mono,monospace',marginBottom:4}}>Approved Offer</div>
              <div style={{fontSize:30,fontWeight:700,fontFamily:'JetBrains Mono,monospace',letterSpacing:-1}}>{f$(deal.amount)}</div>
              <div style={{display:'flex',gap:18,marginTop:10,flexWrap:'wrap'}}>
                {[{l:'Buy rate',v:fx(deal.factor)},{l:'Sell rate',v:'1.499x'},{l:'Term',v:(deal.termDays||'--')+' days'},{l:'Our profit',v:f$(deal.profit),g:true},{l:'Payback',v:f$(deal.payback)},{l:'Daily pmnt',v:f$(deal.payback&&deal.termDays?Math.round(deal.payback/deal.termDays):null)}].map((m,i)=>(
                  <div key={i}><div style={{fontSize:10,color:'#9ca3af',textTransform:'uppercase',fontFamily:'JetBrains Mono,monospace'}}>{m.l}</div><div style={{fontSize:13,fontWeight:700,fontFamily:'JetBrains Mono,monospace',color:m.g?'#16a34a':'#111827',marginTop:2}}>{m.v}</div></div>
                ))}
              </div>
            </div>
          )}

          <div style={{display:'flex',borderBottom:'1px solid #e5e7eb',marginBottom:14,overflowX:'auto'}}>
            {['overview','underwriting','notes','timeline'].map(t=>(
              <div key={t} onClick={()=>setTab(t)} style={{padding:'7px 12px',fontSize:12,cursor:'pointer',borderBottom:tab===t?'2px solid #6366f1':'2px solid transparent',color:tab===t?'#6366f1':'#9ca3af',fontWeight:tab===t?600:400,whiteSpace:'nowrap',marginBottom:-1,textTransform:'capitalize',position:'relative'}}>
                {t}{t==='notes'&&(deal.uwNotes||[]).length>0&&<span style={{position:'absolute',top:4,right:1,width:5,height:5,borderRadius:'50%',background:'#a78bfa',display:'block'}}/>}
              </div>
            ))}
          </div>

          {tab==='overview'&&(
            <div>
              {!deal.amount&&<div style={{marginBottom:12,padding:'10px 12px',background:'#f9fafb',borderRadius:8,fontSize:13,color:'#9ca3af'}}>No offer yet — run AI scrubber to price this deal</div>}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
                {[{l:'Contact',v:deal.contact||'--'},{l:'Email',v:deal.email||'--'},{l:'Requested',v:f$(deal.requested),m:true},{l:'Submitted',v:deal.submitted,m:true},{l:'Monthly Revenue',v:f$(deal.monthlyRev),m:true,c:deal.monthlyRev>=35000?'#16a34a':deal.monthlyRev?'#ef4444':null},{l:'Avg Daily Balance',v:f$(deal.dailyBal),m:true,c:deal.dailyBal>=1000?'#16a34a':deal.dailyBal?'#ef4444':null}].map((f,i)=>(
                  <div key={i} style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:8,padding:'10px 12px'}}>
                    <div style={{fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.8px',fontWeight:600,fontFamily:'JetBrains Mono,monospace',marginBottom:3}}>{f.l}</div>
                    <div style={{fontSize:13,fontWeight:600,fontFamily:f.m?'JetBrains Mono,monospace':null,color:f.c||'#111827',wordBreak:'break-all'}}>{f.v}</div>
                  </div>
                ))}
              </div>
              {deal.notes&&<div style={{padding:'8px 12px',background:'#f9fafb',borderRadius:8,fontSize:12,color:'#6b7280'}}>{deal.notes.slice(0,300)}</div>}
            </div>
          )}

          {tab==='underwriting'&&(
            <div>
              <div style={{marginBottom:12}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}><span style={{fontSize:13,fontWeight:600}}>Risk Score</span><span style={{fontSize:15,fontFamily:'JetBrains Mono,monospace',fontWeight:700,color:rc(deal.risk||0)}}>{deal.risk!=null?deal.risk+' / 100':'Not scrubbed'}</span></div>
                {deal.risk!=null&&<Sbar val={deal.risk} color={rc(deal.risk)}/>}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
                {[{l:'Positions',v:deal.positions+' position'+(deal.positions!==1?'s':''),c:deal.positions>=3?'#ef4444':deal.positions>=2?'#f59e0b':'#16a34a'},{l:'NY Courts',v:deal.nyCourt||'Pending',c:deal.nyCourt==='clean'?'#16a34a':'#ef4444'},{l:'DataMerch',v:deal.dataMerch||'Pending',c:deal.dataMerch==='clean'?'#16a34a':'#f59e0b'},{l:'Monthly Revenue',v:f$(deal.monthlyRev),c:deal.monthlyRev>=35000?'#16a34a':deal.monthlyRev?'#ef4444':null}].map((f,i)=>(
                  <div key={i} style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:8,padding:'10px 12px'}}><div style={{fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.8px',fontWeight:600,fontFamily:'JetBrains Mono,monospace',marginBottom:3}}>{f.l}</div><div style={{fontSize:13,fontWeight:700,color:f.c||'#111827'}}>{f.v}</div></div>
                ))}
              </div>
              {flags.map((fl,i)=>(
                <div key={i} style={{padding:'8px 12px',borderRadius:8,background:fl.t==='red'?'rgba(239,68,68,.06)':fl.t==='amber'?'rgba(245,158,11,.06)':'rgba(22,163,74,.06)',borderLeft:'3px solid '+(fl.t==='red'?'#ef4444':fl.t==='amber'?'#f59e0b':'#16a34a'),marginBottom:7,border:'1px solid '+(fl.t==='red'?'rgba(239,68,68,.2)':fl.t==='amber'?'rgba(245,158,11,.2)':'rgba(22,163,74,.2)')}}>
                  <span style={{fontSize:12}}>{fl.x}</span>
                </div>
              ))}
            </div>
          )}

          {tab==='notes'&&(
            <div>
              <div style={{marginBottom:12,padding:12,background:'#f9fafb',borderRadius:10,border:'1px solid #e5e7eb'}}>
                <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Add note</div>
                <div style={{display:'flex',gap:5,marginBottom:8,flexWrap:'wrap'}}>
                  {['general','risk','approval','condition','followup'].map(c=><button key={c} onClick={()=>setNcat(c)} style={{padding:'2px 9px',borderRadius:20,fontSize:11,cursor:'pointer',border:'1px solid '+(ncat===c?NCC[c]:'#e5e7eb'),background:ncat===c?NCC[c]+'22':'transparent',color:ncat===c?NCC[c]:'#9ca3af',fontFamily:'Inter,sans-serif'}}>{c}</button>)}
                </div>
                <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Add note..." style={{width:'100%',padding:'8px 10px',borderRadius:7,border:'1px solid #e5e7eb',fontSize:13,fontFamily:'Inter,sans-serif',outline:'none',resize:'vertical',minHeight:60,marginBottom:8,background:'#fff'}}/>
                <Btn sm onClick={saveNote} disabled={!note.trim()}>Save Note</Btn>
              </div>
              {!(deal.uwNotes||[]).length&&<div style={{textAlign:'center',padding:24,color:'#9ca3af'}}>No notes yet</div>}
              {(deal.uwNotes||[]).slice().reverse().map(n=>(
                <div key={n.id} style={{padding:'9px 12px',background:'#f9fafb',borderRadius:8,borderLeft:'3px solid '+(NCC[n.cat]||'#e5e7eb'),marginBottom:8}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span style={{fontSize:9,fontFamily:'JetBrains Mono,monospace',textTransform:'uppercase',fontWeight:700,color:NCC[n.cat]||'#9ca3af'}}>{n.cat}</span><span style={{fontSize:10,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace'}}>{n.author} · {n.time}</span></div>
                  <div style={{fontSize:13,lineHeight:1.5}}>{n.text}</div>
                </div>
              ))}
            </div>
          )}

          {tab==='timeline'&&(
            <div>
              {[deal.submitted&&{t:deal.submitted,x:'Deal submitted from '+deal.broker,c:'#6366f1'},deal.status!=='new'&&{t:deal.submitted,x:'AI scrubber triggered',c:'#6366f1'},deal.risk&&{t:deal.submitted,x:'Scrub complete · Risk: '+deal.risk+'/100',c:deal.risk>=65?'#16a34a':'#f59e0b'},deal.amount&&{t:deal.submitted,x:'Offer: '+f$(deal.amount)+' @ '+fx(deal.factor)+' · Profit: '+f$(deal.profit),c:'#16a34a'},deal.status==='funded'&&{t:deal.funded||'',x:'Funded — ACH sent',c:'#16a34a'},deal.status==='declined'&&{t:deal.submitted,x:'Deal declined',c:'#ef4444'},...(deal.uwNotes||[]).map(n=>({t:n.time,x:n.author+' — '+n.text.slice(0,80),c:NCC[n.cat]||'#9ca3af'}))].filter(Boolean).map((e,i,arr)=>(
                <div key={i} style={{display:'flex',gap:12,paddingBottom:16,position:'relative'}}>
                  {i<arr.length-1&&<div style={{position:'absolute',left:9,top:22,width:2,height:'calc(100% - 10px)',background:'#e5e7eb'}}/>}
                  <div style={{width:20,height:20,minWidth:20,borderRadius:'50%',background:e.c+'18',border:'2px solid '+e.c,marginTop:1,zIndex:1,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:e.c}}>✓</div>
                  <div><div style={{fontSize:12,fontWeight:500}}>{e.x}</div><div style={{fontSize:10,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace',marginTop:2}}>{e.t}</div></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{padding:'0 24px 20px'}}>
          <div style={{height:1,background:'#e5e7eb',margin:'14px 0'}}/>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {['new','scrubbing','underwriting','pending'].includes(deal.status)&&<Btn amber onClick={scrub} disabled={busy==='scrub'}>{busy==='scrub'?'Scrubbing...':'⚡ Run AI Scrub'}</Btn>}
            {deal.status==='offered'&&<Btn onClick={()=>{onUpdate({...deal,status:'contracts'});notify('Moved to contracts')}}>Send Contract</Btn>}
            {deal.status==='bankverify'&&<Btn grn onClick={fund} disabled={busy==='fund'}>{busy==='fund'?'...':'✓ Mark Funded'}</Btn>}
            {!['funded','declined'].includes(deal.status)&&NS[deal.status]&&<Btn sec onClick={advance} disabled={busy==='advance'}>{busy==='advance'?'...':'Advance → '+SL[NS[deal.status]]}</Btn>}
            {!['funded','declined'].includes(deal.status)&&<Btn red sec onClick={decline} disabled={busy==='decline'}>{busy==='decline'?'...':'Decline'}</Btn>}
          </div>
          <div style={{height:1,background:'#e5e7eb',margin:'14px 0'}}/>
          {!confirmDel?<button onClick={()=>setConfirmDel(true)} style={{fontSize:12,color:'#ef4444',background:'none',border:'1px solid rgba(239,68,68,.3)',borderRadius:6,padding:'4px 10px',cursor:'pointer',fontFamily:'Inter,sans-serif'}}>Delete Deal</button>:(
            <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(239,68,68,.06)',border:'1px solid rgba(239,68,68,.2)',borderRadius:8,padding:'10px 14px'}}>
              <span style={{fontSize:12,color:'#ef4444',flex:1}}>Delete <strong>{deal.id}</strong>? Cannot be undone.</span>
              <Btn sm sec onClick={()=>setConfirmDel(false)}>Cancel</Btn>
              <Btn sm red onClick={()=>{onDelete(deal.id);onClose()}}>Confirm</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── NEW DEAL ─────────────────────────────────────────────────────────────────
function NewDeal({onClose,onSave}){
  const [step,setStep]=useState(0)
  const [f,setF]=useState({business:'',contact:'',email:'',broker:'',requested:'',notes:''})
  const set=(k,v)=>setF(x=>({...x,[k]:v}))
  const save=()=>{onSave({id:'D-NEW-'+Date.now(),dbId:null,business:f.business,contact:f.contact,email:f.email,broker:f.broker,requested:parseInt(f.requested)||0,status:'new',risk:null,factor:null,termDays:null,positions:0,dailyBal:null,monthlyRev:null,nyCourt:null,dataMerch:null,amount:null,submitted:new Date().toISOString().slice(0,10),submittedAt:new Date().toISOString(),funded:null,balance:null,notes:f.notes,uwNotes:[],profit:null,payback:null});onClose()}
  const inp={width:'100%',padding:'8px 10px',borderRadius:7,border:'1px solid #e5e7eb',fontSize:13,fontFamily:'Inter,sans-serif',outline:'none',background:'#fff',marginTop:4}
  const lbl={fontSize:12,fontWeight:500,color:'#4b5563',display:'block'}
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:'#fff',borderRadius:14,width:'100%',maxWidth:580,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 25px 60px rgba(0,0,0,.2)'}}>
        <div style={{padding:'20px 24px 0',display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><div style={{fontSize:17,fontWeight:700}}>New Deal</div><div style={{fontSize:12,color:'#9ca3af',marginTop:3}}>Enter deal info manually</div></div><Btn sm sec onClick={onClose}>✕</Btn></div>
        <div style={{padding:'16px 24px'}}>
          <div style={{display:'flex',marginBottom:20}}>
            {['Merchant','Broker','Submit'].map((s,i)=>(
              <div key={s} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',position:'relative',minWidth:60}}>
                {i<2&&<div style={{position:'absolute',top:13,left:'50%',width:'100%',height:2,background:i<step?'#16a34a':'#e5e7eb'}}/>}
                <div style={{width:26,height:26,borderRadius:'50%',background:i<step?'#16a34a':i===step?'#6366f1':'#f1f4f9',border:'2px solid '+(i<step?'#16a34a':i===step?'#6366f1':'#e5e7eb'),display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:i<=step?'#fff':'#9ca3af',zIndex:1,position:'relative'}}>{i<step?'✓':i+1}</div>
                <div style={{fontSize:9,color:i===step?'#6366f1':i<step?'#16a34a':'#9ca3af',marginTop:4,fontFamily:'JetBrains Mono,monospace',fontWeight:600}}>{s}</div>
              </div>
            ))}
          </div>
          {step===0&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}><div><label style={lbl}>Business Name *</label><input style={inp} placeholder="Acme Corp LLC" value={f.business} onChange={e=>set('business',e.target.value)}/></div><div><label style={lbl}>Contact Name</label><input style={inp} placeholder="John Smith" value={f.contact} onChange={e=>set('contact',e.target.value)}/></div><div><label style={lbl}>Contact Email</label><input style={inp} placeholder="john@business.com" value={f.email} onChange={e=>set('email',e.target.value)}/></div><div><label style={lbl}>Amount Requested</label><input style={inp} type="number" placeholder="50000" value={f.requested} onChange={e=>set('requested',e.target.value)}/></div><div style={{gridColumn:'1/-1'}}><label style={lbl}>Notes</label><textarea style={{...inp,resize:'vertical',minHeight:60}} placeholder="Industry, positions..." value={f.notes} onChange={e=>set('notes',e.target.value)}/></div></div>}
          {step===1&&<div><label style={lbl}>Broker / ISO Name *</label><input style={inp} placeholder="Capital Partners LLC" value={f.broker} onChange={e=>set('broker',e.target.value)}/></div>}
          {step===2&&<div style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:8,padding:'12px 14px'}}><div style={{fontSize:15,fontWeight:700}}>{f.business}</div><div style={{fontSize:12,color:'#9ca3af',marginTop:3}}>Broker: {f.broker} · {f.requested?f$(parseInt(f.requested)):'No amount'}</div><div style={{fontSize:12,color:'#6b7280',marginTop:8}}>Deal will be created as New. Upload bank statements then run AI Scrub to get an offer.</div></div>}
        </div>
        <div style={{padding:'0 24px 20px',display:'flex',justifyContent:'flex-end',gap:8,borderTop:'1px solid #e5e7eb',paddingTop:14}}>
          {step>0&&<Btn sec onClick={()=>setStep(s=>s-1)}>Back</Btn>}
          <Btn sec onClick={onClose}>Cancel</Btn>
          {step<2&&<Btn onClick={()=>setStep(s=>s+1)} disabled={step===0&&!f.business||step===1&&!f.broker}>Next →</Btn>}
          {step===2&&<Btn grn onClick={save}>✓ Create Deal</Btn>}
        </div>
      </div>
    </div>
  )
}
