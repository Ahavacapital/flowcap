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
function noteFromApi(n){
  return{id:n.id,text:n.body||'',cat:n.category||'general',author:n.author||'System',time:n.created_at?new Date(n.created_at).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}):''}
}
const normalizeStatus=s=>{
  const v=String(s||'').toLowerCase().trim()
  if(!v)return 'new'
  const map={
    submitted:'new',
    intake:'new',
    parsed:'scrubbing',
    parsing:'scrubbing',
    in_underwriting:'underwriting',
    manual_review:'underwriting',
    manual:'underwriting',
    uw:'underwriting',
    on_hold:'pending',
    hold:'pending',
    approved:'offered',
    approve:'offered',
    docs_out:'docs',
    documents:'docs',
    document:'docs',
    contract:'contracts',
    contract_sent:'contracts',
    contracts_sent:'contracts',
    bank_verify:'bankverify',
    bank_verification:'bankverify',
    bankverification:'bankverify',
    funding:'funded',
  }
  return map[v]||v
}

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
  const uwNotes=Array.isArray(d.deal_notes)?d.deal_notes.map(noteFromApi):[]
  return{id:d.deal_number||d.id,dbId:d.id,business:d.business_name||'Unknown',contact:d.contact_name||'',email:d.contact_email||'',broker:d.broker?.name||d.contact_email||'Unknown',brokerEmail:d.broker?.email||'',amount:d.amount_approved||null,requested:d.amount_requested||null,status:normalizeStatus(d.status),risk:d.risk_score||null,factor:d.factor_rate||null,termDays:d.term_months?d.term_months*30:null,positions:d.positions||0,dailyBal:d.avg_daily_balance||null,monthlyRev:d.monthly_revenue||null,nyCourt:d.ny_court_result||null,dataMerch:d.datamerch_result||null,submitted:d.submitted_at?d.submitted_at.slice(0,10):'',submittedAt:d.submitted_at||null,funded:d.funded_at?d.funded_at.slice(0,10):null,balance:d.balance||null,notes:d.notes||'',uwNotes,profit,payback:d.amount_approved?Math.round(d.amount_approved*1.499):null}
}

export default function App(){
  const [pg,setPg]=useState('dashboard')
  const [dealsTab,setDealsTab]=useState('all')
  const [deals,setDeals]=useState([])
  const [integrationStatus,setIntegrationStatus]=useState([])
  const [loading,setLoading]=useState(true)
  const [sel,setSel]=useState(null)
  const [showNew,setShowNew]=useState(false)
  const [syncing,setSyncing]=useState(false)
  const [toast,setToast]=useState(null)
  const timer=useRef(null)
  const notify=(msg,type='success')=>setToast({msg,type})

  const loadDeals=useCallback(async()=>{
    try{
      // Full restore: up to 500 deals per page with embedded deal_notes + broker (original API shape).
      let merged=[]
      let cursor=null
      const pageLimit=500
      for(let page=0;page<40;page++){
        const url=cursor
          ? `/api/deals/list?limit=${pageLimit}&cursor=${encodeURIComponent(cursor)}`
          : `/api/deals/list?limit=${pageLimit}`
        const r=await fetch(url,{cache:'no-store'})
        if(!r.ok)throw new Error('deals list '+r.status)
        const data=await r.json()
        const batch=Array.isArray(data.deals)?data.deals:[]
        if(!batch.length)break
        merged=merged.concat(batch)
        if(batch.length<pageLimit)break
        cursor=data.nextCursor||null
        if(!cursor)break
      }
      const seen=new Set()
      const dedup=merged.filter(d=>{const k=d.id||d.deal_number;if(seen.has(k))return false;seen.add(k);return true})
      setDeals(dedup.map(mapDeal))
    }catch(e){
      console.error('Load deals:',e)
    }
    setLoading(false)
  },[])

  const loadIntegrations=useCallback(async()=>{
    try{
      const r=await fetch('/api/integrations/status')
      if(!r.ok)throw new Error()
      const d=await r.json()
      setIntegrationStatus(Array.isArray(d.integrations)?d.integrations:[])
    }catch(_e){
      setIntegrationStatus([])
    }
  },[])

  useEffect(()=>{loadDeals();loadIntegrations();timer.current=setInterval(loadDeals,60000);return()=>clearInterval(timer.current)},[loadDeals,loadIntegrations])

  const syncSheets=async()=>{
    setSyncing(true)
    try{const r=await fetch('/api/sheets/manual-sync',{method:'POST'});const d=await r.json();notify(d.success?'Sheets synced':'Sync error: '+d.error,d.success?'success':'error')}
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

  const alertCount=deals.filter(d=>['underwriting','pending','offered'].includes(d.status)).length
  const renewalCount=deals.filter(d=>d.status==='funded'&&d.balance&&d.amount&&(d.balance/d.amount)<=0.5).length
  const bvCount=deals.filter(d=>d.status==='bankverify').length
  const contractCount=deals.filter(d=>d.status==='contracts').length
  const fundedCount=deals.filter(d=>d.status==='funded').length
  const NAV=[
    {id:'dashboard',l:'Dashboard',section:'main'},
    {id:'deals',l:'All Deals',b:todayCnt||null,section:'main'},
    {id:'accounts',l:'Accounts',section:'main'},
    {id:'pipeline',l:'Pipeline',section:'main'},
    {id:'uwqueue',l:'UW Queue',b:uwCount||null,section:'main'},
    {id:'contracts',l:'Contracts',b:contractCount||null,section:'main'},
    {id:'bvqueue',l:'Bank Verify Queue',b:bvCount||null,section:'main'},
    {id:'funded',l:'Funded Deals',b:fundedCount||null,section:'main'},
    {id:'renewals',l:'Renewals',b:renewalCount||null,section:'main'},
    {id:'alerts',l:'Alerts',b:alertCount||null,section:'main'},
    {id:'integrations',l:'Integrations',section:'main'},
    {id:'users',l:'Users',section:'main'},
    {id:'iso_campaigns',l:'ISO Campaigns',section:'partners'},
    {id:'merchant_campaigns',l:'Merchant Campaigns',section:'partners'},
  ]

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
        <div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:32,height:32,borderRadius:9,background:'linear-gradient(135deg,#0f766e,#14b8a6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:700,color:'#fff'}}>AC</div><span style={{fontSize:18,fontWeight:700,color:'#111827',letterSpacing:'-.5px'}}>Ahava Capital CRM</span></div>
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
            <div style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:28,height:28,borderRadius:8,background:'linear-gradient(135deg,#0f766e,#14b8a6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#fff'}}>AC</div><div><div style={{fontSize:14,fontWeight:700,color:'#111827',letterSpacing:'-.3px'}}>Ahava Capital</div><div style={{fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'1px',fontFamily:'JetBrains Mono,monospace'}}>Admin CRM</div></div></div>
          </div>
          <nav style={{flex:1,padding:'8px 0',overflowY:'auto'}}>
            <div style={{padding:'0 8px',marginBottom:4}}>
              <div style={{fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'1.2px',padding:'8px 8px 4px',fontFamily:'JetBrains Mono,monospace',fontWeight:600}}>Workspace</div>
              {NAV.map(n=>(
                <button key={n.id} onClick={()=>{if(n.id==='deals')setDealsTab('all');setPg(n.id)}} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 10px',borderRadius:7,fontSize:13,fontWeight:500,color:pg===n.id?'#6366f1':'#4b5563',cursor:'pointer',border:'none',background:pg===n.id?'rgba(99,102,241,.1)':'transparent',width:'100%',textAlign:'left',marginBottom:1,transition:'all .12s'}}>
                  {n.l}{n.b>0&&<span style={{marginLeft:'auto',background:'#6366f1',color:'#fff',borderRadius:10,fontSize:10,padding:'1px 6px',fontFamily:'JetBrains Mono,monospace'}}>{n.b}</span>}
                </button>
              ))}
            </div>
          </nav>
          <div style={{padding:10,borderTop:'1px solid #e5e7eb'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 10px',borderRadius:8,background:'#f9fafb'}}>
              <div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#0f766e,#14b8a6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#fff',flexShrink:0}}>IG</div>
              <div><div style={{fontSize:12,fontWeight:600,color:'#111827'}}>Issac Grunwald</div><div style={{fontSize:10,color:'#9ca3af'}}>Admin Oversight</div></div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div style={{flex:1,minWidth:0,height:'100%',overflow:'hidden',display:'flex',flexDirection:'column'}}>
          <div style={{padding:'0 22px',height:52,minHeight:52,flexShrink:0,borderBottom:'1px solid #e5e7eb',display:'flex',alignItems:'center',gap:10,background:'#fff'}}>
            <div style={{fontSize:14,fontWeight:600,flex:1,color:'#111827'}}>{{dashboard:'Dashboard',deals:'All Deals',accounts:'Accounts',pipeline:'Deal Pipeline',uwqueue:'UW Queue',contracts:'Contracts',bvqueue:'Bank Verify Queue',funded:'Funded Deals',renewals:'Renewals',alerts:'Alerts',integrations:'Integrations',users:'Users',iso_campaigns:'ISO Campaigns',merchant_campaigns:'Merchant Campaigns'}[pg]||pg}</div>
            {todayCnt>0&&<span style={{fontSize:11,color:'#16a34a',background:'rgba(22,163,74,.1)',border:'1px solid rgba(22,163,74,.2)',padding:'2px 8px',borderRadius:10,fontFamily:'JetBrains Mono,monospace'}}>{todayCnt} new today</span>}
            <span style={{fontSize:10,fontWeight:700,color:'#9333ea',background:'rgba(147,51,234,.1)',border:'1px solid rgba(147,51,234,.25)',padding:'3px 8px',borderRadius:12,fontFamily:'JetBrains Mono,monospace'}}>TESTING MODE - NON LIVE (except inbox + scrub)</span>
            <div style={{display:'flex',gap:7}}>
              <Btn sm sec onClick={loadDeals}>Refresh</Btn>
              <Btn sm sec onClick={syncSheets} disabled={syncing}>{syncing?'Syncing...':'Sync Sheets'}</Btn>
              <Btn sm onClick={()=>setShowNew(true)}>+ New Deal</Btn>
            </div>
          </div>
          <div style={{flex:1,minHeight:0,overflowY:'auto',padding:20}}>
            {pg==='dashboard'&&<Dashboard deals={deals} integrationStatus={integrationStatus} setPg={setPg} setSel={setSel} setDealsTab={setDealsTab} tf={tf} tp={tp} funded={funded} todayCnt={todayCnt}/>}
            {pg==='deals'&&<DealsList deals={deals} tab={dealsTab} onTabChange={setDealsTab} setSel={setSel} setShowNew={setShowNew} delDeal={delDeal}/>}
            {pg==='accounts'&&<AccountsPanel deals={deals} setSel={setSel}/>}
            {pg==='pipeline'&&<Pipeline deals={deals} setSel={setSel}/>}
            {pg==='uwqueue'&&<UWQueue deals={deals} setSel={setSel}/>}
            {pg==='contracts'&&<Contracts deals={deals} setSel={setSel}/>}
            {pg==='renewals'&&<Renewals deals={deals} setSel={setSel}/>}
            {pg==='alerts'&&<Alerts deals={deals} setSel={setSel}/>}
            {pg==='integrations'&&<IntegrationsPanel integrations={integrationStatus}/>}
            {pg==='users'&&<UsersPanel deals={deals}/>}
            {pg==='bvqueue'&&<BVQueue deals={deals} setSel={setSel} onUpdate={updDeal} notify={notify}/>}
            {pg==='funded'&&<FundedDeals deals={deals} setSel={setSel}/>}
            {pg==='iso_campaigns'&&<ISOCampaigns deals={deals}/>}
            {pg==='merchant_campaigns'&&<MerchantCampaigns deals={deals}/>}
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
function Dashboard({deals,integrationStatus,setPg,setSel,setDealsTab,tf,tp,funded,todayCnt}){
  const declined=deals.filter(d=>d.status==='declined').length
  const closed=deals.filter(d=>['funded','declined'].includes(d.status))
  const apr=closed.length>0?Math.round(funded.length/closed.length*100):0
  const today=deals.filter(d=>isToday(d.submittedAt))
  const offered=deals.filter(d=>d.status==='offered')
  const pending=deals.filter(d=>d.status==='pending')
  const uw=deals.filter(d=>d.status==='underwriting')
  const pipeline=['new','scrubbing','underwriting','pending','offered','docs','contracts','bankverify']
  const merchantCount=new Set(deals.map(d=>(d.email||'').toLowerCase()).filter(Boolean)).size
  const brokerCount=new Set(deals.map(d=>(d.broker||'').toLowerCase()).filter(Boolean)).size
  const workflowRows=deals.slice(0,12).map(d=>{
    const noteText=(d.uwNotes||[]).map(n=>n.text||'').join(' ')
    return{
      id:d.id,
      business:d.business,
      status:d.status,
      broker:d.broker,
      merchant:d.email||'--',
      contractSent:d.status==='contracts'||d.status==='bankverify'||d.status==='funded'||noteText.includes('KYC_COMPLETE_AND_CONTRACTS_GENERATED'),
      bankVerify:d.status==='bankverify'||d.status==='funded'||noteText.includes('PLAID_BANK_VERIFICATION_COMPLETED'),
      merchantLink:noteText.includes('MERCHANT_ONBOARDING_LINK'),
      brokerLink:noteText.includes('BROKER_PORTAL_LINK')
    }
  })
  const th={textAlign:'left',padding:'7px 10px',fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.8px',borderBottom:'1px solid #f1f4f9',fontWeight:600,fontFamily:'JetBrains Mono,monospace'}
  const td={padding:'10px 10px'}
  return(
    <div>
      {/* TOP STATS */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10,marginBottom:16}}>
        <Stat label="Total Submissions" value={deals.length} sub={'all time'}/>
        <Stat label="Active Pipeline" value={deals.filter(d=>!['funded','declined'].includes(d.status)).length} sub={todayCnt+' new today'} color="#6366f1"/>
        <Stat label="Offered" value={offered.length} sub={'ready for contracts'} color="#10b981"/>
        <Stat label="Funded Volume" value={f$(tf)} sub={funded.length+' deals'} color="#16a34a"/>
        <Stat label="Total Profit" value={f$(tp)} sub={apr+'% approval rate'} color="#6366f1"/>
      </div>

      {/* NEW TODAY BANNER */}
      {today.length>0&&<div style={{marginBottom:14,padding:'10px 14px',background:'rgba(22,163,74,.05)',border:'1px solid rgba(22,163,74,.2)',borderRadius:10,display:'flex',alignItems:'center',gap:10}}>
        <span style={{width:7,height:7,borderRadius:'50%',background:'#16a34a',display:'block',flexShrink:0}}/>
        <div style={{flex:1,fontSize:13}}><span style={{fontWeight:600,color:'#16a34a'}}>{today.length} new submission{today.length!==1?'s':''} today: </span><span style={{color:'#9ca3af'}}>{today.slice(0,4).map(d=>d.business).join(', ')}{today.length>4?' ...':''}</span></div>
        <Btn sm sec onClick={()=>{setDealsTab('today');setPg('deals')}}>View All</Btn>
      </div>}

      {/* ALERTS ROW */}
      {(offered.length>0||pending.length>0)&&<div style={{display:'flex',gap:10,marginBottom:14,flexWrap:'wrap'}}>
        {offered.length>0&&<div style={{flex:1,minWidth:200,padding:'10px 14px',background:'rgba(16,185,129,.06)',border:'1px solid rgba(16,185,129,.2)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div><div style={{fontSize:12,fontWeight:600,color:'#10b981'}}>🟢 {offered.length} deal{offered.length!==1?'s':''} ready to fund</div><div style={{fontSize:11,color:'#9ca3af',marginTop:2}}>Offers sent — awaiting contract signature</div></div>
          <Btn sm onClick={()=>setPg('contracts')}>Send Contracts</Btn>
        </div>}
        {pending.length>0&&<div style={{flex:1,minWidth:200,padding:'10px 14px',background:'rgba(236,72,153,.06)',border:'1px solid rgba(236,72,153,.2)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div><div style={{fontSize:12,fontWeight:600,color:'#ec4899'}}>⏸ {pending.length} deal{pending.length!==1?'s':''} on hold</div><div style={{fontSize:11,color:'#9ca3af',marginTop:2}}>Parser issues — manual review needed</div></div>
          <Btn sm sec onClick={()=>setPg('uwqueue')}>Review</Btn>
        </div>}
        {uw.length>0&&<div style={{flex:1,minWidth:200,padding:'10px 14px',background:'rgba(245,158,11,.06)',border:'1px solid rgba(245,158,11,.2)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div><div style={{fontSize:12,fontWeight:600,color:'#d97706'}}>👁 {uw.length} in underwriting</div><div style={{fontSize:11,color:'#9ca3af',marginTop:2}}>Awaiting manual review or statements</div></div>
          <Btn sm sec onClick={()=>setPg('uwqueue')}>View Queue</Btn>
        </div>}
      </div>}

      {/* MAIN CONTENT GRID */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
        {/* WORKFLOW PIPELINE */}
        <Card>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700}}>Workflow Pipeline</div>
            <Btn sm sec onClick={()=>setPg('pipeline')}>Board</Btn>
          </div>
          <div style={{fontSize:11,color:'#9ca3af',marginBottom:10}}>Click a stage to open All Deals filtered to that status.</div>
          {pipeline.map(s=>{
            const cnt=deals.filter(d=>d.status===s).length
            const total=deals.length||1
            const pct=Math.round(cnt/total*100)
            return(
              <div key={s} onClick={()=>{setDealsTab(s);setPg('deals')}} style={{marginBottom:8,cursor:'pointer',borderRadius:8,padding:'4px 6px',marginLeft:-6,marginRight:-6,transition:'background .12s'}} onMouseEnter={e=>e.currentTarget.style.background='#f9fafb'} onMouseLeave={e=>e.currentTarget.style.background=''} title={'View '+SL[s]+' in All Deals'}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:3}}>
                  <StatusPill status={s}/>
                  <span style={{fontSize:12,fontFamily:'JetBrains Mono,monospace',fontWeight:700,color:'#374151'}}>{cnt}</span>
                </div>
                <div style={{height:4,background:'#f1f4f9',borderRadius:2,overflow:'hidden'}}>
                  <div style={{height:'100%',width:pct+'%',background:SC[s]||'#e5e7eb',borderRadius:2,opacity:.7}}/>
                </div>
              </div>
            )
          })}
        </Card>

        {/* RECENT ACTIVITY */}
        <Card>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700}}>Recent Submissions</div>
            <Btn sm sec onClick={()=>{setDealsTab('all');setPg('deals')}}>View All</Btn>
          </div>
          {deals.slice(0,6).map(d=>(
            <div key={d.id} onClick={()=>setSel(d)} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid #f9fafb',cursor:'pointer'}} onMouseEnter={e=>e.currentTarget.style.background='#fafafa'} onMouseLeave={e=>e.currentTarget.style.background=''}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:5}}>
                  {isToday(d.submittedAt)&&<span style={{width:5,height:5,borderRadius:'50%',background:'#16a34a',display:'block',flexShrink:0}}/>}
                  <div style={{fontWeight:600,fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.business}</div>
                </div>
                <div style={{fontSize:11,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace'}}>{d.id} · {d.broker}</div>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:12,fontWeight:600,color:d.amount?'#6366f1':'#9ca3af'}}>{d.amount?f$(d.amount):f$(d.requested)}</div>
                <StatusPill status={d.status}/>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* BOTTOM ROW */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {/* ADMIN OVERSIGHT */}
        <Card>
          <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Admin Oversight</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
            {[{l:'Merchants',v:merchantCount,c:'#0f766e'},{l:'Brokers',v:brokerCount,c:'#0f766e'},{l:'Contracts Sent',v:deals.filter(d=>['contracts','bankverify','funded'].includes(d.status)).length,c:'#6366f1'},{l:'Bank Verify',v:deals.filter(d=>d.status==='bankverify').length,c:'#d97706'}].map((m,i)=>(
              <div key={i} style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:8,padding:'10px 12px'}}>
                <div style={{fontSize:10,color:'#9ca3af',textTransform:'uppercase',fontFamily:'JetBrains Mono,monospace'}}>{m.l}</div>
                <div style={{fontSize:18,fontWeight:700,color:m.c,marginTop:3}}>{m.v}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:11,color:'#9ca3af'}}>Use <strong>Accounts</strong> (broker roll-up), <strong>All Deals</strong>, <strong>Contracts</strong>, and <strong>Bank Verify Queue</strong> for full backend review.</div>
        </Card>

        {/* AUTOMATION STATUS */}
        <Card>
          <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Automation Status</div>
          {[
            {l:'Gmail watcher',s:'Picks up new submissions every 5 min',ok:true},
            {l:'Document parser',s:'Reads bank statements automatically',ok:true},
            {l:'AI scrubber',s:'Underwrites each deal independently',ok:true},
            {l:'Google Sheets sync',s:'Updates CRM sheet every 15 min',ok:true},
            ...((integrationStatus||[]).map(i=>({l:i.label,s:i.needed,ok:i.status==='configured'}))),
            {l:'Broker approval portal',s:'Sandbox test mode only — non-live links + test uploads',ok:false},
          ].map((i,x)=>(
            <div key={x} style={{display:'flex',alignItems:'center',gap:10,marginBottom:9}}>
              <span style={{width:7,height:7,borderRadius:'50%',background:i.ok?'#16a34a':'#e5e7eb',display:'block',flexShrink:0,border:i.ok?'none':'2px solid #d1d5db'}}/>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:i.ok?'#111827':'#9ca3af'}}>{i.l}</div><div style={{fontSize:11,color:'#9ca3af'}}>{i.s}</div></div>
              <span style={{fontSize:10,fontWeight:600,color:i.ok?'#16a34a':'#d1d5db',fontFamily:'JetBrains Mono,monospace'}}>{i.ok?'LIVE':'PENDING'}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* WORKFLOW MONITOR */}
      <Card style={{marginTop:14}} p={0}>
        <div style={{padding:'14px 16px',borderBottom:'1px solid #f1f4f9',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontSize:13,fontWeight:700}}>Admin Workflow Monitor (Testing)</div>
          <Btn sm sec onClick={()=>setPg('deals')}>Open All Deals</Btn>
        </div>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>{['Deal','Broker','Merchant','Status','Broker Link','Merchant Link','Contracts','Bank Verify'].map(h=><th key={h} style={{textAlign:'left',padding:'8px 10px',fontSize:10,color:'#9ca3af',textTransform:'uppercase',fontFamily:'JetBrains Mono,monospace',borderBottom:'1px solid #f1f4f9'}}>{h}</th>)}</tr></thead>
          <tbody>
            {workflowRows.map(r=>(
              <tr key={r.id} style={{cursor:'pointer'}} onClick={()=>{const d=deals.find(x=>x.id===r.id);if(d)setSel(d)}}>
                <td style={{padding:'9px 10px',fontSize:12,fontWeight:600}}>{r.business}</td>
                <td style={{padding:'9px 10px',fontSize:12,color:'#6b7280'}}>{r.broker}</td>
                <td style={{padding:'9px 10px',fontSize:12,color:'#6b7280'}}>{r.merchant}</td>
                <td style={{padding:'9px 10px'}}><StatusPill status={r.status}/></td>
                <td style={{padding:'9px 10px',fontSize:11,color:r.brokerLink?'#16a34a':'#9ca3af',fontFamily:'JetBrains Mono,monospace'}}>{r.brokerLink?'SENT':'NO'}</td>
                <td style={{padding:'9px 10px',fontSize:11,color:r.merchantLink?'#16a34a':'#9ca3af',fontFamily:'JetBrains Mono,monospace'}}>{r.merchantLink?'SENT':'NO'}</td>
                <td style={{padding:'9px 10px',fontSize:11,color:r.contractSent?'#16a34a':'#9ca3af',fontFamily:'JetBrains Mono,monospace'}}>{r.contractSent?'YES':'NO'}</td>
                <td style={{padding:'9px 10px',fontSize:11,color:r.bankVerify?'#16a34a':'#9ca3af',fontFamily:'JetBrains Mono,monospace'}}>{r.bankVerify?'YES':'NO'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

// ─── DEALS LIST ───────────────────────────────────────────────────────────────
function DealsList({deals,tab,onTabChange,setSel,setShowNew,delDeal}){
  const [srch,setSrch]=useState('')
  const [sc,setSc]=useState('submitted')
  const [sd,setSd]=useState('desc')
  const tabs=[{id:'all',l:'All',n:deals.length},{id:'today',l:'Today',n:deals.filter(d=>isToday(d.submittedAt)).length},{id:'new',l:'New',n:deals.filter(d=>d.status==='new').length},{id:'scrubbing',l:'Scrubbing',n:deals.filter(d=>d.status==='scrubbing').length},{id:'underwriting',l:'Underwriting',n:deals.filter(d=>d.status==='underwriting').length},{id:'pending',l:'On Hold',n:deals.filter(d=>d.status==='pending').length},{id:'offered',l:'Offered',n:deals.filter(d=>d.status==='offered').length},{id:'docs',l:'Docs Out',n:deals.filter(d=>d.status==='docs').length},{id:'contracts',l:'Contracts',n:deals.filter(d=>d.status==='contracts').length},{id:'bankverify',l:'Bank Verify',n:deals.filter(d=>d.status==='bankverify').length},{id:'funded',l:'Funded',n:deals.filter(d=>d.status==='funded').length},{id:'declined',l:'Declined',n:deals.filter(d=>d.status==='declined').length}]
  const filtered=deals.filter(d=>{
    if(srch){const s=srch.toLowerCase();const biz=(d.business||'').toLowerCase();const bid=(String(d.id)||'').toLowerCase();const br=(d.broker||'').toLowerCase();if(!biz.includes(s)&&!bid.includes(s)&&!br.includes(s))return false}
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
        {tabs.map(t=><div key={t.id} onClick={()=>onTabChange(t.id)} style={{padding:'7px 14px',fontSize:12,cursor:'pointer',borderBottom:tab===t.id?'2px solid #6366f1':'2px solid transparent',color:tab===t.id?'#6366f1':'#9ca3af',fontWeight:tab===t.id?600:400,whiteSpace:'nowrap',marginBottom:-1}}>{t.l} <span style={{fontSize:10,fontFamily:'JetBrains Mono,monospace',opacity:.7}}>{t.n}</span></div>)}
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
  const stages=['new','scrubbing','underwriting','pending','offered','docs','contracts','bankverify','funded','declined']
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

// ─── CONTRACTS ────────────────────────────────────────────────────────────────
function Contracts({deals,setSel}){
  const cd=deals.filter(d=>['offered','contracts','bankverify','funded'].includes(d.status))
  const sendApproval=async(e,d)=>{
    e.stopPropagation()
    try{
      const r=await fetch('/api/deals/send-approval',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({dbId:d.dbId})})
      const j=await r.json().catch(()=>({}))
      if(!r.ok)throw new Error(j.sendGridMessage||j.error||('HTTP '+r.status))
      setSel({...d,status:j.status||'contracts'})
      alert(j.sent?'Approval email sent with confirm link.':(j.error||'Approval could not be sent.'))
    }catch(err){
      alert('Could not send approval: '+(err.message||'unknown error'))
    }
  }
  return(
    <div>
      <div style={{marginBottom:14,fontSize:13,color:'#9ca3af'}}>DocuSign integration — contracts auto-generated on offer acceptance</div>
      {cd.map(d=>(
        <Card key={d.id} p="12px 16px" style={{marginBottom:10,cursor:'pointer',display:'flex',alignItems:'center',gap:12}} onClick={()=>setSel(d)}>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{d.business}</div><div style={{fontSize:11,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace',marginTop:2}}>{d.id} · {d.broker}</div></div>
          <div style={{textAlign:'right'}}><div style={{fontFamily:'JetBrains Mono,monospace',fontWeight:700,fontSize:14,color:'#6366f1'}}>{f$(d.amount)}</div><div style={{fontSize:11,color:'#9ca3af'}}>{fx(d.factor)} · 1.499x sell</div></div>
          <StatusPill status={d.status}/>
          {d.status==='offered'&&<Btn sm onClick={e=>sendApproval(e,d)}>Send Approval</Btn>}
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
  const [docs,setDocs]=useState([])
  const [docsLoading,setDocsLoading]=useState(false)
  const [ncat,setNcat]=useState('general')
  const [busy,setBusy]=useState('')
  const [brokerLink,setBrokerLink]=useState('')
  const [merchantLink,setMerchantLink]=useState('')
  const [confirmDel,setConfirmDel]=useState(false)
  const si=STEPS.indexOf(deal.status)

  const api=async(path,body)=>{const r=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}
  const advance=async()=>{const next=NS[deal.status];if(!next||!deal.dbId)return;setBusy('advance');try{await api('/api/deals/update',{dbId:deal.dbId,status:next});onUpdate({...deal,status:next});notify('Advanced to '+SL[next])}catch(e){notify('Failed','error')}setBusy('')}
  const decline=async()=>{if(!deal.dbId)return;const declineReason=window.prompt('Optional decline reason (will be included in testing email):','')||'';setBusy('decline');try{await api('/api/deals/update',{dbId:deal.dbId,status:'declined',declineReason});onUpdate({...deal,status:'declined'});notify('Deal declined and testing email sent to broker');onClose()}catch(e){notify('Failed','error')}setBusy('')}
  const fund=async()=>{if(!deal.dbId)return;setBusy('fund');try{await api('/api/deals/update',{dbId:deal.dbId,status:'funded'});onUpdate({...deal,status:'funded'});notify('Deal funded!');onClose()}catch(e){notify('Failed','error')}setBusy('')}
  const sendApproval=async()=>{
    if(!deal.dbId)return
    setBusy('send-approval')
    try{
      const r=await fetch('/api/deals/send-approval',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({dbId:deal.dbId})})
      const j=await r.json().catch(()=>({}))
      if(!r.ok)throw new Error(j.sendGridMessage||j.error||('HTTP '+r.status))
      onUpdate({...deal,status:j.status||'contracts'})
      notify(j.sent?'Approval email sent with confirm offer link.':(j.error||'Approval could not be sent.'))
    }catch(e){
      notify('Could not send approval: '+(e.message||''),'error')
    }
    setBusy('')
  }
  const genBrokerSandboxLink=async()=>{
    if(!deal.dbId)return
    setBusy('broker-link')
    try{
      const d=await api('/api/broker/sandbox/create-link',{dbId:deal.dbId})
      setBrokerLink(d.link||'')
      notify('Sandbox broker link created (test only)')
    }catch(e){
      notify('Could not create broker link','error')
    }
    setBusy('')
  }
  const genMerchantOnboardingLink=async()=>{
    if(!deal.dbId)return
    setBusy('merchant-link')
    try{
      const d=await api('/api/merchant/sandbox/create-link',{dbId:deal.dbId})
      setMerchantLink(d.link||'')
      notify('Merchant onboarding link created (test only)')
    }catch(e){
      notify('Could not create merchant link','error')
    }
    setBusy('')
  }
  const openTestEmailDraft=()=>{
    if(!brokerLink){notify('Create broker test link first','error');return}
    const to=deal.email||''
    const subj=encodeURIComponent(`TEST: Deal Update - ${deal.business} (${deal.id})`)
    const body=encodeURIComponent(
`Hi ${deal.broker||'Broker'},

This is a TEST workflow email (not live).

Deal: ${deal.business}
Deal #: ${deal.id}
Status: ${deal.status}
Approved Amount: ${deal.amount?f$(deal.amount):'N/A'}

Broker test portal link:
${brokerLink}

Use this link to review the deal and submit VC + ID in sandbox mode.

Thanks,
Ahava CRM (Testing)`
    )
    window.open(`mailto:${to}?subject=${subj}&body=${body}`,'_blank')
  }
  const openMerchantInviteEmailDraft=(target='merchant')=>{
    if(!merchantLink){notify('Create merchant onboarding link first','error');return}
    const to=target==='broker'?(deal.brokerEmail||''):(deal.email||'')
    const label=target==='broker'?'Broker Shop':'Merchant'
    const subj=encodeURIComponent(`TEST: Merchant Onboarding Link - ${deal.business} (${deal.id})`)
    const body=encodeURIComponent(
`Hi ${target==='broker'?(deal.broker||'Broker Team'):(deal.contact||'Merchant')},

This is a TEST onboarding email (${label} copy).

Deal: ${deal.business}
Deal #: ${deal.id}
Approved Amount: ${deal.amount?f$(deal.amount):'N/A'}

Merchant onboarding link:
${merchantLink}

Flow (testing):
1) Merchant uploads VC + Photo ID
2) Contracts are generated
3) Merchant receives Plaid bank verification link

Thanks,
Ahava CRM (Testing)`
    )
    window.open(`mailto:${to}?subject=${subj}&body=${body}`,'_blank')
  }
  const scrub=async()=>{
    if(!deal.dbId)return
    setBusy('scrub')
    try{
      const controller=new AbortController()
      const timeout=setTimeout(()=>controller.abort(),25000)
      const r=await fetch('/api/scrubber/run',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({dealId:deal.dbId}),signal:controller.signal})
      clearTimeout(timeout)
      if(!r.ok)throw new Error('HTTP '+r.status)
      const data=await r.json()
      if(data.approved){
        notify('✅ APPROVED — Risk: '+data.riskScore+'/100 · Offer: '+f$(data.approvedAmount)+' · Profit: '+f$(data.ourProfit))
      }else if(data.status==='declined'){
        notify('❌ DECLINED — '+( data.declineReason||'See notes'),'error')
      }else{
        notify('👁 Manual Review — Risk: '+(data.riskScore||'N/A')+'/100')
      }
      onRefresh()
      setTimeout(onClose,1500)
    }catch(e){
      if(e.name==='AbortError'){
        notify('Scrubber is processing — check back in 30 seconds')
      }else{
        notify('Scrub failed: '+e.message,'error')
      }
    }
    setBusy('')
  }
  const saveNote=()=>{if(!note.trim())return;onUpdate({...deal,uwNotes:[...(deal.uwNotes||[]),{id:'l-'+Date.now(),text:note.trim(),cat:ncat,author:'Underwriter',time:new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}]});setNote('');notify('Note saved')}

  // Load documents when tab changes to documents
  useEffect(()=>{
    if(tab==='documents'&&deal.dbId){
      setDocsLoading(true)
      fetch('/api/deals/documents?dealId='+deal.dbId)
        .then(r=>r.json())
        .then(d=>{setDocs(d.documents||[]);setDocsLoading(false)})
        .catch(()=>setDocsLoading(false))
    }
  },[tab,deal.dbId])

  // Load underwriting notes on demand (after opening a deal) to keep dashboard fast.
  useEffect(()=>{
    if(!deal.dbId)return
    let ignore=false
    fetch('/api/deals/notes?dealId='+deal.dbId)
      .then(r=>r.ok?r.json():Promise.reject(new Error('HTTP '+r.status)))
      .then(d=>{
        if(ignore)return
        const notes=Array.isArray(d.notes)?d.notes.map(noteFromApi):[]
        onUpdate({...deal,uwNotes:notes})
      })
      .catch(()=>{})
    return()=>{ignore=true}
  },[deal.dbId])

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
              <div style={{marginTop:12,paddingTop:10,borderTop:'1px dashed rgba(99,102,241,.25)'}}>
                <div style={{fontSize:11,color:'#9333ea',fontWeight:700,marginBottom:8}}>SANDBOX TEST FLOW (not live)</div>
                <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                  <Btn sm sec onClick={genBrokerSandboxLink} disabled={busy==='broker-link'}>{busy==='broker-link'?'Creating link...':'Create Broker Test Link'}</Btn>
                  {brokerLink&&<a href={brokerLink} target="_blank" rel="noreferrer" style={{fontSize:11,color:'#6366f1',fontFamily:'JetBrains Mono,monospace',textDecoration:'none'}}>{brokerLink}</a>}
                  {brokerLink&&<Btn sm sec onClick={()=>{navigator.clipboard?.writeText(brokerLink);notify('Link copied')}}>Copy Link</Btn>}
                  {brokerLink&&<Btn sm sec onClick={openTestEmailDraft}>Open Test Email Draft</Btn>}
                </div>
                <div style={{fontSize:11,color:'#9ca3af',marginTop:6}}>Broker can view approval, enter sell rate (1.40-1.55 max 12% spread), and submit VC/ID file names to request contracts in sandbox mode.</div>
                <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap',marginTop:10}}>
                  <Btn sm sec onClick={genMerchantOnboardingLink} disabled={busy==='merchant-link'}>{busy==='merchant-link'?'Creating link...':'Create Merchant Onboarding Link'}</Btn>
                  {merchantLink&&<a href={merchantLink} target="_blank" rel="noreferrer" style={{fontSize:11,color:'#0f766e',fontFamily:'JetBrains Mono,monospace',textDecoration:'none'}}>{merchantLink}</a>}
                  {merchantLink&&<Btn sm sec onClick={()=>{navigator.clipboard?.writeText(merchantLink);notify('Merchant link copied')}}>Copy Merchant Link</Btn>}
                  {merchantLink&&<Btn sm sec onClick={()=>openMerchantInviteEmailDraft('merchant')}>Draft Merchant Email</Btn>}
                  {merchantLink&&<Btn sm sec onClick={()=>openMerchantInviteEmailDraft('broker')}>Draft Broker-Shop Email</Btn>}
                </div>
                <div style={{fontSize:11,color:'#9ca3af',marginTop:6}}>Merchant flow (testing): upload VC + Photo ID -&gt; deal moves to Contracts -&gt; Plaid verification link is shown.</div>
              </div>
            </div>
          )}

          <div style={{display:'flex',borderBottom:'1px solid #e5e7eb',marginBottom:14,overflowX:'auto'}}>
            {['overview','underwriting','documents','notes','timeline'].map(t=>(
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
              {/* RISK SCORE BAR */}
              <div style={{background:deal.risk>=65?'rgba(22,163,74,.06)':deal.risk>=50?'rgba(245,158,11,.06)':'rgba(239,68,68,.06)',border:'1px solid '+(deal.risk>=65?'rgba(22,163,74,.2)':deal.risk>=50?'rgba(245,158,11,.2)':'rgba(239,68,68,.2)'),borderRadius:10,padding:'14px 16px',marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                  <span style={{fontSize:13,fontWeight:700}}>Risk Score</span>
                  <span style={{fontSize:22,fontFamily:'JetBrains Mono,monospace',fontWeight:700,color:rc(deal.risk||0)}}>{deal.risk!=null?deal.risk+' / 100':'Not scrubbed'}</span>
                </div>
                <Sbar val={deal.risk||0} color={rc(deal.risk||0)}/>
                <div style={{display:'flex',justifyContent:'space-between',marginTop:4,fontSize:10,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace'}}><span>0 — High Risk</span><span>50 — Moderate</span><span>100 — Strong</span></div>
              </div>

              {/* REVENUE STATISTICS — MoneyThumb style */}
              {(()=>{
                const sc = (deal.uwNotes||[]).find(n=>n.author==='Document Parser'&&n.text.startsWith('{'))
                let s = null
                try { s = sc ? JSON.parse(sc.text) : null } catch(e) {}
                if(!s&&!deal.monthlyRev) return <div style={{textAlign:'center',padding:20,color:'#9ca3af',fontSize:13}}>Run AI Scrub to generate bank statement analysis</div>
                return (
                  <div>
                    {/* Revenue Stats */}
                    <div style={{fontSize:11,fontWeight:700,color:'#6366f1',textTransform:'uppercase',letterSpacing:'1px',marginBottom:8,fontFamily:'JetBrains Mono,monospace'}}>Revenue Statistics</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:14}}>
                      {[
                        {l:'Avg Monthly Revenue',v:f$(s?.avg_monthly_revenue||deal.monthlyRev),c:deal.monthlyRev>=35000?'#16a34a':deal.monthlyRev?'#ef4444':null,ok:deal.monthlyRev>=35000},
                        {l:'Avg True Revenue',v:f$(s?.avg_true_revenue),c:'#111827'},
                        {l:'Avg Expenses',v:f$(s?.avg_expenses),c:'#111827'},
                        {l:'Avg Gross Profit',v:f$(s?.avg_gross_profit),c:s?.avg_gross_profit>0?'#16a34a':'#ef4444'},
                        {l:'Avg Daily Balance',v:f$(s?.avg_daily_balance||deal.dailyBal),c:deal.dailyBal>=1000?'#16a34a':deal.dailyBal?'#ef4444':null,ok:deal.dailyBal>=1000},
                        {l:'MCA Withhold %',v:(s?.mca_withhold_percent||0)+'%',c:s?.mca_withhold_percent>40?'#ef4444':'#111827'},
                      ].map((m,i)=>(
                        <div key={i} style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:8,padding:'10px 12px'}}>
                          <div style={{fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.5px',fontWeight:600,marginBottom:3,fontFamily:'JetBrains Mono,monospace'}}>{m.l}</div>
                          <div style={{fontSize:13,fontWeight:700,fontFamily:'JetBrains Mono,monospace',color:m.c||'#111827'}}>{m.v}</div>
                          {m.ok!=null&&<div style={{fontSize:10,marginTop:2,color:m.ok?'#16a34a':'#ef4444'}}>{m.ok?'✓ Meets minimum':'✗ Below minimum'}</div>}
                        </div>
                      ))}
                    </div>

                    {/* Risk Metrics */}
                    <div style={{fontSize:11,fontWeight:700,color:'#6366f1',textTransform:'uppercase',letterSpacing:'1px',marginBottom:8,fontFamily:'JetBrains Mono,monospace'}}>Risk Metrics</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:14}}>
                      {[
                        {l:'Days Negative',v:s?.negative_days||deal.dailyBal<0?s?.negative_days||0:0,ok:(s?.negative_days||0)<=7,suffix:'/mo'},
                        {l:'NSFs',v:s?.nsf_count||0,ok:(s?.nsf_count||0)===0,suffix:'/mo'},
                        {l:'Positions',v:deal.positions||0,ok:deal.positions<3,suffix:''},
                        {l:'NY Courts',v:deal.nyCourt||'Pending',ok:deal.nyCourt==='clean',suffix:''},
                      ].map((m,i)=>(
                        <div key={i} style={{background:'#f9fafb',border:'1px solid '+(m.ok?'rgba(22,163,74,.2)':'rgba(239,68,68,.2)'),borderRadius:8,padding:'10px 12px',borderLeft:'3px solid '+(m.ok?'#16a34a':'#ef4444')}}>
                          <div style={{fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.5px',fontWeight:600,marginBottom:3,fontFamily:'JetBrains Mono,monospace'}}>{m.l}</div>
                          <div style={{fontSize:16,fontWeight:700,fontFamily:'JetBrains Mono,monospace',color:m.ok?'#16a34a':'#ef4444'}}>{m.v}{m.suffix}</div>
                          <div style={{fontSize:10,color:m.ok?'#16a34a':'#ef4444'}}>{m.ok?'✓ Pass':'✗ Flag'}</div>
                        </div>
                      ))}
                    </div>

                    {/* MCA Positions */}
                    {(s?.mca_payments||[]).length>0&&(
                      <div style={{marginBottom:14}}>
                        <div style={{fontSize:11,fontWeight:700,color:'#6366f1',textTransform:'uppercase',letterSpacing:'1px',marginBottom:8,fontFamily:'JetBrains Mono,monospace'}}>MCA Positions Detected ({(s?.mca_payments||[]).length})</div>
                        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                          <thead><tr>{['Lender','Frequency','Amount','Count','Total Withdrawn'].map(h=><th key={h} style={{textAlign:'left',padding:'6px 10px',fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.5px',borderBottom:'1px solid #f1f4f9',fontFamily:'JetBrains Mono,monospace',fontWeight:600}}>{h}</th>)}</tr></thead>
                          <tbody>{(s?.mca_payments||[]).map((p,i)=>(
                            <tr key={i} style={{borderBottom:'1px solid #f9fafb'}}>
                              <td style={{padding:'8px 10px',fontWeight:600}}>{p.company}</td>
                              <td style={{padding:'8px 10px',color:'#6b7280',textTransform:'capitalize'}}>{p.frequency}</td>
                              <td style={{padding:'8px 10px',fontFamily:'JetBrains Mono,monospace',color:'#ef4444',fontWeight:600}}>{f$(p.amount)}</td>
                              <td style={{padding:'8px 10px',fontFamily:'JetBrains Mono,monospace'}}>{p.withdrawal_count||'--'}</td>
                              <td style={{padding:'8px 10px',fontFamily:'JetBrains Mono,monospace',color:'#ef4444'}}>{f$(p.total_withdrawn)}</td>
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                    )}

                    {/* Monthly Breakdown */}
                    {(s?.monthly_breakdown||[]).length>0&&(
                      <div>
                        <div style={{fontSize:11,fontWeight:700,color:'#6366f1',textTransform:'uppercase',letterSpacing:'1px',marginBottom:8,fontFamily:'JetBrains Mono,monospace'}}>Monthly Breakdown</div>
                        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                          <thead><tr>{['Month','Revenue','Expenses','Starting Balance'].map(h=><th key={h} style={{textAlign:'left',padding:'6px 10px',fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.5px',borderBottom:'1px solid #f1f4f9',fontFamily:'JetBrains Mono,monospace',fontWeight:600}}>{h}</th>)}</tr></thead>
                          <tbody>{(s?.monthly_breakdown||[]).map((m,i)=>(
                            <tr key={i} style={{borderBottom:'1px solid #f9fafb'}}>
                              <td style={{padding:'8px 10px',fontWeight:600}}>{m.month}</td>
                              <td style={{padding:'8px 10px',fontFamily:'JetBrains Mono,monospace',color:'#16a34a',fontWeight:600}}>{f$(m.revenue)}</td>
                              <td style={{padding:'8px 10px',fontFamily:'JetBrains Mono,monospace',color:'#ef4444'}}>{f$(m.expenses)}</td>
                              <td style={{padding:'8px 10px',fontFamily:'JetBrains Mono,monospace',color:'#6b7280'}}>{f$(m.starting_balance)}</td>
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                    )}

                    {/* Flags */}
                    {flags.length>0&&<div style={{marginTop:12}}>{flags.map((fl,i)=>(
                      <div key={i} style={{padding:'7px 12px',borderRadius:7,background:fl.t==='red'?'rgba(239,68,68,.06)':fl.t==='amber'?'rgba(245,158,11,.06)':'rgba(22,163,74,.06)',borderLeft:'3px solid '+(fl.t==='red'?'#ef4444':fl.t==='amber'?'#f59e0b':'#16a34a'),marginBottom:6}}>
                        <span style={{fontSize:12}}>{fl.x}</span>
                      </div>
                    ))}</div>}
                  </div>
                )
              })()}
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

          {tab==='documents'&&(
            <div>
              {/* FOLDER HEADER */}
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',background:'linear-gradient(135deg,rgba(99,102,241,.06),rgba(99,102,241,.02))',border:'1px solid rgba(99,102,241,.15)',borderRadius:10,marginBottom:14}}>
                <span style={{fontSize:28}}>📁</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700}}>{deal.business}</div>
                  <div style={{fontSize:11,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace'}}>{deal.id} · Client Documents Folder</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:18,fontWeight:700,color:'#6366f1',fontFamily:'JetBrains Mono,monospace'}}>{docs.length}</div>
                  <div style={{fontSize:10,color:'#9ca3af'}}>files</div>
                </div>
              </div>

              {docsLoading&&<div style={{textAlign:'center',padding:24,color:'#9ca3af'}}>Loading files...</div>}

              {!docsLoading&&!docs.length&&(
                <div style={{textAlign:'center',padding:32,color:'#9ca3af',background:'#f9fafb',borderRadius:10,border:'2px dashed #e5e7eb'}}>
                  <div style={{fontSize:40,marginBottom:8}}>📭</div>
                  <div style={{fontSize:13,fontWeight:600}}>No files yet</div>
                  <div style={{fontSize:11,marginTop:4}}>Bank statements will appear here automatically when the broker sends them via email</div>
                </div>
              )}

              {!docsLoading&&docs.length>0&&(()=>{
                const groups = {
                  bank_statement: docs.filter(d=>d.doc_type==='bank_statement'),
                  voided_check: docs.filter(d=>d.doc_type==='voided_check'),
                  photo_id: docs.filter(d=>d.doc_type==='photo_id'),
                  contract: docs.filter(d=>d.doc_type==='contract'),
                  other: docs.filter(d=>!['bank_statement','voided_check','photo_id','contract'].includes(d.doc_type))
                }
                const groupLabels = {bank_statement:{label:'Bank Statements',icon:'🏦',color:'#6366f1'},voided_check:{label:'Voided Checks',icon:'✅',color:'#16a34a'},photo_id:{label:'Photo ID',icon:'🪪',color:'#f59e0b'},contract:{label:'Contracts',icon:'📄',color:'#06b6d4'},other:{label:'Other Files',icon:'📎',color:'#9ca3af'}}
                return Object.entries(groups).map(([type, files]) => {
                  if (!files.length) return null
                  const g = groupLabels[type]
                  return (
                    <div key={type} style={{marginBottom:16}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                        <span style={{fontSize:16}}>{g.icon}</span>
                        <span style={{fontSize:11,fontWeight:700,color:g.color,textTransform:'uppercase',letterSpacing:'1px',fontFamily:'JetBrains Mono,monospace'}}>{g.label}</span>
                        <span style={{fontSize:10,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace'}}>({files.length})</span>
                      </div>
                      <div style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:10,overflow:'hidden'}}>
                        {files.map((doc,i)=>{
                          const size=doc.size_bytes?doc.size_bytes>1000000?(doc.size_bytes/1000000).toFixed(1)+' MB':(doc.size_bytes/1000).toFixed(0)+' KB':''
                          const date=doc.created_at?new Date(doc.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):''
                          return(
                            <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',borderBottom:i<files.length-1?'1px solid #e5e7eb':'none',background:i%2===0?'#fff':'#f9fafb'}}>
                              <span style={{fontSize:20,flexShrink:0}}>{g.icon}</span>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{fontSize:13,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{doc.name.replace(/^[a-f0-9-]+-/i,'')}</div>
                                <div style={{fontSize:10,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace',marginTop:1}}>{size}{date?' · '+date:''}</div>
                              </div>
                              {doc.url?<a href={doc.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{display:'inline-flex',alignItems:'center',gap:4,padding:'5px 12px',borderRadius:6,background:'#6366f1',color:'#fff',fontSize:11,fontWeight:600,textDecoration:'none',flexShrink:0}}>⬇ Download</a>:<span style={{fontSize:11,color:'#9ca3af'}}>No link</span>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              })()}
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
            {deal.status==='offered'&&<Btn onClick={sendApproval} disabled={busy==='send-approval'}>{busy==='send-approval'?'Sending...':'Send Approval'}</Btn>}
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



// ─── RENEWALS ─────────────────────────────────────────────────────────────────
function Renewals({deals,setSel}){
  const funded=deals.filter(d=>d.status==='funded')

  // Calculate renewal eligibility for each funded deal
  const withRenewal=funded.map(d=>{
    const paidPct=d.amount&&d.balance?Math.round((1-d.balance/d.amount)*100):0
    const eligible=paidPct>=50
    // Days since funded - estimate from submitted date if no funded date
    const fundedDate=d.funded?new Date(d.funded):new Date(d.submittedAt)
    const daysSinceFunded=Math.round((new Date()-fundedDate)/86400000)
    // Renewal offer = same factor, same term, slightly lower amount as reward
    const renewalAmount=d.amount?Math.round(d.amount*1.1/1000)*1000:null // 10% more than original
    const renewalPayback=renewalAmount?Math.round(renewalAmount*1.499):null
    const renewalProfit=renewalAmount&&d.factor?Math.round(renewalAmount*(1.499-d.factor)):null
    return{...d,paidPct,eligible,daysSinceFunded,renewalAmount,renewalPayback,renewalProfit}
  }).sort((a,b)=>b.paidPct-a.paidPct)

  const eligible=withRenewal.filter(d=>d.eligible)
  const notYet=withRenewal.filter(d=>!d.eligible)

  return(
    <div>
      {/* STATS */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        <Stat label="Funded Deals" value={funded.length} sub="total portfolio"/>
        <Stat label="Renewal Eligible" value={eligible.length} sub="50%+ paid" color="#16a34a"/>
        <Stat label="Potential Volume" value={f$(eligible.reduce((s,d)=>s+(d.renewalAmount||0),0))} sub="if all renew" color="#6366f1"/>
        <Stat label="Potential Profit" value={f$(eligible.reduce((s,d)=>s+(d.renewalProfit||0),0))} sub="renewal spread" color="#10b981"/>
      </div>

      {/* ELIGIBLE NOW */}
      {eligible.length>0&&(
        <div style={{marginBottom:16}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
            <div style={{fontSize:14,fontWeight:700}}>🟢 Eligible for Renewal ({eligible.length})</div>
            <span style={{fontSize:11,color:'#16a34a',background:'rgba(22,163,74,.1)',border:'1px solid rgba(22,163,74,.2)',padding:'2px 8px',borderRadius:10,fontFamily:'JetBrains Mono,monospace'}}>50%+ paid</span>
          </div>
          {eligible.map(d=>(
            <div key={d.id} style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:12,padding:'14px 16px',marginBottom:10,cursor:'pointer'}} onClick={()=>setSel(d)} onMouseEnter={e=>e.currentTarget.style.borderColor='#16a34a'} onMouseLeave={e=>e.currentTarget.style.borderColor='#e5e7eb'}>
              <div style={{display:'flex',alignItems:'flex-start',gap:14}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                    <div style={{fontSize:14,fontWeight:700}}>{d.business}</div>
                    <span style={{fontSize:10,color:'#16a34a',background:'rgba(22,163,74,.1)',border:'1px solid rgba(22,163,74,.2)',padding:'1px 7px',borderRadius:10,fontFamily:'JetBrains Mono,monospace',fontWeight:600}}>RENEWAL READY</span>
                  </div>
                  <div style={{fontSize:11,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace',marginBottom:10}}>{d.id} · {d.broker} · Funded: {d.funded||d.submitted}</div>

                  {/* Progress bar */}
                  <div style={{marginBottom:8}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                      <span style={{fontSize:11,color:'#6b7280'}}>Payback progress</span>
                      <span style={{fontSize:11,fontWeight:700,color:'#16a34a',fontFamily:'JetBrains Mono,monospace'}}>{d.paidPct}% paid</span>
                    </div>
                    <div style={{height:6,background:'#f1f4f9',borderRadius:3,overflow:'hidden'}}>
                      <div style={{height:'100%',width:d.paidPct+'%',background:'linear-gradient(90deg,#16a34a,#10b981)',borderRadius:3}}/>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',marginTop:2}}>
                      <span style={{fontSize:10,color:'#9ca3af'}}>Original: {f$(d.amount)}</span>
                      <span style={{fontSize:10,color:'#9ca3af'}}>Balance: {f$(d.balance)}</span>
                    </div>
                  </div>
                </div>

                {/* Renewal offer box */}
                <div style={{background:'linear-gradient(135deg,rgba(99,102,241,.06),rgba(16,185,129,.04))',border:'1px solid rgba(99,102,241,.2)',borderRadius:10,padding:'12px 14px',minWidth:200,flexShrink:0}}>
                  <div style={{fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:1,fontFamily:'JetBrains Mono,monospace',marginBottom:4}}>Renewal Offer</div>
                  <div style={{fontSize:22,fontWeight:700,fontFamily:'JetBrains Mono,monospace',color:'#111827'}}>{f$(d.renewalAmount)}</div>
                  <div style={{display:'flex',gap:12,marginTop:8,flexWrap:'wrap'}}>
                    <div><div style={{fontSize:10,color:'#9ca3af'}}>Factor</div><div style={{fontSize:12,fontWeight:600,fontFamily:'JetBrains Mono,monospace'}}>{d.factor?d.factor.toFixed(3)+'x':'--'}</div></div>
                    <div><div style={{fontSize:10,color:'#9ca3af'}}>Sell rate</div><div style={{fontSize:12,fontWeight:600,fontFamily:'JetBrains Mono,monospace'}}>1.499x</div></div>
                    <div><div style={{fontSize:10,color:'#9ca3af'}}>Our profit</div><div style={{fontSize:12,fontWeight:700,fontFamily:'JetBrains Mono,monospace',color:'#16a34a'}}>{f$(d.renewalProfit)}</div></div>
                  </div>
                  <div style={{marginTop:10,display:'flex',gap:6}}>
                    <button onClick={e=>{e.stopPropagation();alert('Send renewal offer to '+d.broker+' for '+d.business)}} style={{flex:1,padding:'5px 0',borderRadius:6,background:'#6366f1',color:'#fff',border:'none',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif'}}>Send Offer</button>
                    <button onClick={e=>{e.stopPropagation();setSel(d)}} style={{padding:'5px 10px',borderRadius:6,background:'#f9fafb',color:'#6b7280',border:'1px solid #e5e7eb',fontSize:11,cursor:'pointer',fontFamily:'Inter,sans-serif'}}>View</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NOT YET ELIGIBLE */}
      {notYet.length>0&&(
        <div>
          <div style={{fontSize:14,fontWeight:700,marginBottom:10,color:'#6b7280'}}>⏳ Not Yet Eligible ({notYet.length})</div>
          {notYet.map(d=>(
            <div key={d.id} style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:10,padding:'12px 16px',marginBottom:8,cursor:'pointer',opacity:.8}} onClick={()=>setSel(d)}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600}}>{d.business}</div>
                  <div style={{fontSize:11,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace'}}>{d.id} · {d.broker}</div>
                </div>
                <div style={{width:120}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                    <span style={{fontSize:10,color:'#9ca3af'}}>{d.paidPct}% paid</span>
                    <span style={{fontSize:10,color:'#9ca3af'}}>need 50%</span>
                  </div>
                  <div style={{height:4,background:'#f1f4f9',borderRadius:2,overflow:'hidden'}}>
                    <div style={{height:'100%',width:d.paidPct+'%',background:'#d1d5db',borderRadius:2}}/>
                  </div>
                </div>
                <div style={{textAlign:'right',minWidth:80}}>
                  <div style={{fontSize:12,fontFamily:'JetBrains Mono,monospace',fontWeight:600,color:'#6366f1'}}>{f$(d.amount)}</div>
                  <div style={{fontSize:10,color:'#9ca3af'}}>bal: {f$(d.balance)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!funded.length&&<div style={{textAlign:'center',padding:'48px 0',color:'#9ca3af'}}>No funded deals yet — renewals will appear here once deals are funded and 50% paid</div>}
    </div>
  )
}


// ─── BANK VERIFY QUEUE ────────────────────────────────────────────────────────
function BVQueue({deals,setSel,onUpdate,notify}){
  const queue=deals.filter(d=>d.status==='bankverify')
  const fund=async(deal)=>{
    try{
      await fetch('/api/deals/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({dbId:deal.dbId,status:'funded'})})
      onUpdate({...deal,status:'funded'})
      notify('Deal funded!')
    }catch(e){notify('Failed','error')}
  }
  return(
    <Card>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
        <div style={{fontSize:14,fontWeight:700}}>Bank Verify Queue</div>
        <span style={{background:'rgba(249,115,22,.1)',color:'#f97316',borderRadius:5,fontSize:11,fontWeight:600,padding:'2px 8px'}}>{queue.length} pending</span>
      </div>
      {!queue.length?<div style={{textAlign:'center',padding:32,color:'#9ca3af'}}>No deals awaiting bank verification</div>:queue.map(d=>(
        <div key={d.id} style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:10,padding:'14px 16px',marginBottom:10}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14}}>{d.business}</div>
              <div style={{fontSize:11,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace',marginTop:2}}>{d.id} · {d.broker}</div>
            </div>
            <div style={{textAlign:'right',marginRight:8}}>
              <div style={{fontSize:15,fontWeight:700,fontFamily:'JetBrains Mono,monospace',color:'#6366f1'}}>{f$(d.amount)}</div>
              <div style={{fontSize:10,color:'#9ca3af'}}>approved offer</div>
            </div>
            <button onClick={()=>setSel(d)} style={{padding:'6px 12px',borderRadius:7,background:'#f9fafb',border:'1px solid #e5e7eb',fontSize:12,cursor:'pointer',fontFamily:'Inter,sans-serif',fontWeight:500}}>View</button>
            <button onClick={()=>fund(d)} style={{padding:'6px 14px',borderRadius:7,background:'#16a34a',color:'#fff',border:'none',fontSize:12,cursor:'pointer',fontFamily:'Inter,sans-serif',fontWeight:600}}>✓ Mark Funded</button>
          </div>
        </div>
      ))}
    </Card>
  )
}

// ─── FUNDED DEALS ─────────────────────────────────────────────────────────────
function FundedDeals({deals,setSel}){
  const funded=deals.filter(d=>d.status==='funded').sort((a,b)=>new Date(b.funded||b.submitted)-new Date(a.funded||a.submitted))
  const totalVol=funded.reduce((s,d)=>s+(d.amount||0),0)
  const totalProfit=funded.reduce((s,d)=>s+(d.profit||0),0)
  return(
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:16}}>
        <Stat label="Total Funded" value={funded.length} sub="all time"/>
        <Stat label="Total Volume" value={f$(totalVol)} color="#16a34a"/>
        <Stat label="Total Profit" value={f$(totalProfit)} color="#6366f1"/>
      </div>
      <Card p={0}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>{['Business','Broker','Amount','Factor','Profit','Funded Date'].map(h=><th key={h} style={{textAlign:'left',padding:'8px 14px',fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.8px',borderBottom:'1px solid #f1f4f9',fontWeight:600,fontFamily:'JetBrains Mono,monospace'}}>{h}</th>)}</tr></thead>
          <tbody>{funded.map(d=>(
            <tr key={d.id} onClick={()=>setSel(d)} style={{cursor:'pointer',borderBottom:'1px solid #f9fafb'}} onMouseEnter={e=>e.currentTarget.style.background='#f9fafb'} onMouseLeave={e=>e.currentTarget.style.background=''}>
              <td style={{padding:'12px 14px'}}><div style={{fontWeight:600}}>{d.business}</div><div style={{fontSize:10,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace'}}>{d.id}</div></td>
              <td style={{padding:'12px 14px',fontSize:12,color:'#6b7280'}}>{d.broker}</td>
              <td style={{padding:'12px 14px',fontFamily:'JetBrains Mono,monospace',fontWeight:600,color:'#6366f1'}}>{f$(d.amount)}</td>
              <td style={{padding:'12px 14px',fontFamily:'JetBrains Mono,monospace',fontSize:12}}>{d.factor?d.factor.toFixed(3)+'x':'--'}</td>
              <td style={{padding:'12px 14px',fontFamily:'JetBrains Mono,monospace',fontWeight:600,color:'#16a34a'}}>{f$(d.profit)}</td>
              <td style={{padding:'12px 14px',fontSize:11,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace'}}>{d.funded||d.submitted}</td>
            </tr>
          ))}
          {!funded.length&&<tr><td colSpan={6} style={{textAlign:'center',padding:32,color:'#9ca3af'}}>No funded deals yet</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

// ─── ISO CAMPAIGNS ────────────────────────────────────────────────────────────
function ISOCampaigns({deals}){
  const brokers=[...new Set(deals.map(d=>d.broker))].filter(b=>b&&b!=='Unknown')
  return(
    <div>
      <div style={{marginBottom:16,padding:'14px 16px',background:'rgba(99,102,241,.06)',border:'1px solid rgba(99,102,241,.2)',borderRadius:10}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>📧 ISO Email Campaigns</div>
        <div style={{fontSize:12,color:'#6b7280'}}>Send targeted campaigns to your broker network. Integration with SendGrid coming soon.</div>
      </div>
      <Card>
        <div style={{fontSize:13,fontWeight:700,marginBottom:16}}>Your ISO Network ({brokers.length} brokers)</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:20}}>
          {[{l:'Rate Sheet Update',d:'Send updated buy/sell rates to all ISOs',icon:'📊'},{l:'New Product Launch',d:'Announce new advance products or terms',icon:'🚀'},{l:'Performance Report',d:'Send monthly volume report to top ISOs',icon:'📈'}].map((t,i)=>(
            <div key={i} style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:10,padding:'14px 16px'}}>
              <div style={{fontSize:20,marginBottom:8}}>{t.icon}</div>
              <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>{t.l}</div>
              <div style={{fontSize:11,color:'#9ca3af',marginBottom:10}}>{t.d}</div>
              <button style={{padding:'6px 14px',borderRadius:6,background:'#6366f1',color:'#fff',border:'none',fontSize:11,fontWeight:600,cursor:'not-allowed',opacity:.6,fontFamily:'Inter,sans-serif'}}>Coming Soon</button>
            </div>
          ))}
        </div>
        <div style={{fontSize:11,color:'#9ca3af',padding:'10px 12px',background:'#f9fafb',borderRadius:8,border:'1px solid #e5e7eb'}}>
          💡 To enable email campaigns, connect SendGrid or Mailchimp in Settings. You have {brokers.length} ISO contacts ready to receive campaigns.
        </div>
      </Card>
    </div>
  )
}

// ─── MERCHANT CAMPAIGNS ───────────────────────────────────────────────────────
function MerchantCampaigns({deals}){
  const merchants=deals.filter(d=>d.email&&d.status!=='declined')
  return(
    <div>
      <div style={{marginBottom:16,padding:'14px 16px',background:'rgba(16,185,129,.06)',border:'1px solid rgba(16,185,129,.2)',borderRadius:10}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>📱 Merchant Outreach Campaigns</div>
        <div style={{fontSize:12,color:'#6b7280'}}>Re-engage merchants, send renewal offers, and follow up on pending applications.</div>
      </div>
      <Card>
        <div style={{fontSize:13,fontWeight:700,marginBottom:16}}>Campaign Templates ({merchants.length} merchant contacts)</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:20}}>
          {[{l:'Renewal Offer',d:'Send renewal offers to 50%+ paid merchants',icon:'🔄',color:'#16a34a'},{l:'Application Follow-up',d:'Follow up on pending or underwriting deals',icon:'📞',color:'#f59e0b'},{l:'Welcome Package',d:'Send onboarding info to newly funded merchants',icon:'🎉',color:'#6366f1'}].map((t,i)=>(
            <div key={i} style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:10,padding:'14px 16px'}}>
              <div style={{fontSize:20,marginBottom:8}}>{t.icon}</div>
              <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>{t.l}</div>
              <div style={{fontSize:11,color:'#9ca3af',marginBottom:10}}>{t.d}</div>
              <button style={{padding:'6px 14px',borderRadius:6,background:t.color,color:'#fff',border:'none',fontSize:11,fontWeight:600,cursor:'not-allowed',opacity:.6,fontFamily:'Inter,sans-serif'}}>Coming Soon</button>
            </div>
          ))}
        </div>
        <div style={{fontSize:11,color:'#9ca3af',padding:'10px 12px',background:'#f9fafb',borderRadius:8,border:'1px solid #e5e7eb'}}>
          💡 Connect SendGrid or Mailchimp to activate campaigns. {merchants.length} merchant contacts are ready.
        </div>
      </Card>
    </div>
  )
}

// ─── ALERTS ───────────────────────────────────────────────────────────────────
function Alerts({deals,setSel}){
  const alerts=[]
  deals.forEach(d=>{
    if(d.status==='underwriting')alerts.push({type:'uw',msg:d.business+' needs underwriting review',id:d.id,deal:d,color:'#f59e0b'})
    if(d.status==='pending')alerts.push({type:'hold',msg:d.business+' is ON HOLD — parser issue',id:d.id,deal:d,color:'#ec4899'})
    if(d.status==='offered')alerts.push({type:'offer',msg:'Offer ready to send for '+d.business,id:d.id,deal:d,color:'#6366f1'})
    if(d.monthlyRev&&d.monthlyRev<35000&&!['declined','funded'].includes(d.status))alerts.push({type:'revenue',msg:d.business+' — revenue $'+Number(d.monthlyRev).toLocaleString()+' below $35k minimum',id:d.id,deal:d,color:'#ef4444'})
  })
  return(
    <Card>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
        <div style={{fontSize:14,fontWeight:700}}>System Alerts</div>
        <span style={{background:'rgba(99,102,241,.1)',color:'#6366f1',borderRadius:5,fontSize:11,fontWeight:600,padding:'2px 8px'}}>{alerts.length} active</span>
      </div>
      {!alerts.length?<div style={{textAlign:'center',padding:'32px 0',color:'#9ca3af'}}>✓ No active alerts</div>:alerts.map((a,i)=>(
        <div key={i} onClick={()=>a.deal&&setSel(a.deal)} style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderLeft:'3px solid '+a.color,borderRadius:8,padding:'10px 14px',marginBottom:8,cursor:a.deal?'pointer':'default',display:'flex',alignItems:'center',gap:10}} onMouseEnter={e=>a.deal&&(e.currentTarget.style.borderColor=a.color)} onMouseLeave={e=>a.deal&&(e.currentTarget.style.borderColor='#e5e7eb')}>
          <span style={{fontSize:16}}>{a.type==='hold'?'⏸':a.type==='uw'?'👁':a.type==='offer'?'💰':'⚠️'}</span>
          <span style={{fontSize:13,flex:1}}>{a.msg}</span>
          <span style={{fontSize:10,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace'}}>{a.id}</span>
        </div>
      ))}
    </Card>
  )
}

// ─── ACCOUNTS ─────────────────────────────────────────────────────────────────
function AccountsPanel({deals,setSel}){
  const [tab,setTab]=useState('brokers')
  const [q,setQ]=useState('')
  const text=(q||'').toLowerCase().trim()

  const brokerMap={}
  deals.forEach(d=>{
    const key=(d.broker||'').trim()
    if(!key||key==='Unknown')return
    if(!brokerMap[key]) brokerMap[key]={name:key,email:d.brokerEmail||'',total:0,active:0,funded:0,volume:0,last:''}
    const b=brokerMap[key]
    b.total++
    if(!['funded','declined'].includes(d.status)) b.active++
    if(d.status==='funded'){b.funded++;b.volume+=(d.amount||0)}
    if(!b.last||new Date(d.submittedAt||0)>new Date(b.last||0)) b.last=d.submittedAt||b.last
  })
  const brokers=Object.values(brokerMap)
    .filter(b=>!text||b.name.toLowerCase().includes(text)||(b.email||'').toLowerCase().includes(text))
    .sort((a,b)=>b.total-a.total)

  const merchMap={}
  deals.forEach(d=>{
    const key=(d.email||'').trim().toLowerCase()
    if(!key)return
    if(!merchMap[key]) merchMap[key]={email:key,name:d.contact||'Merchant',businesses:new Set(),total:0,active:0,funded:0,last:'',latestDeal:null}
    const m=merchMap[key]
    m.total++
    m.businesses.add(d.business||'Unknown')
    if(!['funded','declined'].includes(d.status))m.active++
    if(d.status==='funded')m.funded++
    if(!m.last||new Date(d.submittedAt||0)>new Date(m.last||0)){m.last=d.submittedAt||m.last;m.latestDeal=d}
  })
  const merchants=Object.values(merchMap)
    .map(m=>({...m,businessCount:m.businesses.size}))
    .filter(m=>!text||m.email.includes(text)||(m.name||'').toLowerCase().includes(text))
    .sort((a,b)=>b.total-a.total)

  return(
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:14}}>
        <Stat label="Broker Accounts" value={brokers.length} sub="unique brokers"/>
        <Stat label="Merchant Accounts" value={merchants.length} sub="unique merchant emails"/>
        <Stat label="Broker Active Deals" value={brokers.reduce((s,b)=>s+b.active,0)} sub="not funded/declined" color="#0f766e"/>
        <Stat label="Merchant Active Deals" value={merchants.reduce((s,m)=>s+m.active,0)} sub="not funded/declined" color="#0f766e"/>
      </div>

      <Card style={{marginBottom:12}}>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <div style={{display:'flex',border:'1px solid #e5e7eb',borderRadius:8,overflow:'hidden'}}>
            {['brokers','merchants'].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:'6px 12px',border:'none',cursor:'pointer',background:tab===t?'#0f766e':'#fff',color:tab===t?'#fff':'#374151',fontSize:12,fontWeight:600,fontFamily:'Inter,sans-serif'}}>{t==='brokers'?'Brokers':'Merchants'}</button>)}
          </div>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder={tab==='brokers'?'Search brokers/email...':'Search merchants/email...'} style={{flex:1,padding:'7px 12px',borderRadius:7,border:'1px solid #e5e7eb',fontSize:13,fontFamily:'Inter,sans-serif',outline:'none',background:'#fff'}}/>
        </div>
      </Card>

      {tab==='brokers'?(
        <Card p={0}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>{['Broker','Email','Deals','Active','Funded','Funded Volume','Last Activity'].map(h=><th key={h} style={{textAlign:'left',padding:'8px 12px',fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.8px',borderBottom:'1px solid #f1f4f9',fontWeight:600,fontFamily:'JetBrains Mono,monospace'}}>{h}</th>)}</tr></thead>
            <tbody>
              {brokers.map(b=>(
                <tr key={b.name} style={{borderBottom:'1px solid #f9fafb'}}>
                  <td style={{padding:'10px 12px',fontWeight:600}}>{b.name}</td>
                  <td style={{padding:'10px 12px',fontSize:12,color:'#6b7280'}}>{b.email||'--'}</td>
                  <td style={{padding:'10px 12px',fontFamily:'JetBrains Mono,monospace'}}>{b.total}</td>
                  <td style={{padding:'10px 12px',fontFamily:'JetBrains Mono,monospace',color:'#d97706'}}>{b.active}</td>
                  <td style={{padding:'10px 12px',fontFamily:'JetBrains Mono,monospace',color:'#16a34a'}}>{b.funded}</td>
                  <td style={{padding:'10px 12px',fontFamily:'JetBrains Mono,monospace',color:'#0f766e'}}>{f$(b.volume)}</td>
                  <td style={{padding:'10px 12px',fontSize:11,color:'#9ca3af',fontFamily:'JetBrains Mono,monospace'}}>{b.last?new Date(b.last).toLocaleDateString():'--'}</td>
                </tr>
              ))}
              {!brokers.length&&<tr><td colSpan={7} style={{textAlign:'center',padding:28,color:'#9ca3af'}}>No broker accounts found</td></tr>}
            </tbody>
          </table>
        </Card>
      ):(
        <Card p={0}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>{['Merchant','Email','Businesses','Deals','Active','Funded','Latest Stage'].map(h=><th key={h} style={{textAlign:'left',padding:'8px 12px',fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.8px',borderBottom:'1px solid #f1f4f9',fontWeight:600,fontFamily:'JetBrains Mono,monospace'}}>{h}</th>)}</tr></thead>
            <tbody>
              {merchants.map(m=>(
                <tr key={m.email} style={{borderBottom:'1px solid #f9fafb',cursor:m.latestDeal?'pointer':'default'}} onClick={()=>m.latestDeal&&setSel(m.latestDeal)}>
                  <td style={{padding:'10px 12px',fontWeight:600}}>{m.name||'Merchant'}</td>
                  <td style={{padding:'10px 12px',fontSize:12,color:'#6b7280'}}>{m.email}</td>
                  <td style={{padding:'10px 12px',fontFamily:'JetBrains Mono,monospace'}}>{m.businessCount}</td>
                  <td style={{padding:'10px 12px',fontFamily:'JetBrains Mono,monospace'}}>{m.total}</td>
                  <td style={{padding:'10px 12px',fontFamily:'JetBrains Mono,monospace',color:'#d97706'}}>{m.active}</td>
                  <td style={{padding:'10px 12px',fontFamily:'JetBrains Mono,monospace',color:'#16a34a'}}>{m.funded}</td>
                  <td style={{padding:'10px 12px'}}>{m.latestDeal?<StatusPill status={m.latestDeal.status}/>:<span style={{fontSize:11,color:'#9ca3af'}}>--</span>}</td>
                </tr>
              ))}
              {!merchants.length&&<tr><td colSpan={7} style={{textAlign:'center',padding:28,color:'#9ca3af'}}>No merchant accounts found</td></tr>}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}

// ─── INTEGRATIONS ─────────────────────────────────────────────────────────────
function IntegrationsPanel({integrations}){
  const rows=(integrations||[]).length?integrations:[
    {label:'DocuSign',status:'pending',needed:'Create template + wire send contract action'},
    {label:'NY Courts',status:'pending',needed:'Need NY Courts API key'},
    {label:'DataMerch',status:'pending',needed:'Need DataMerch account + API key'},
    {label:'Plaid',status:'pending',needed:'Bank verification for merchants'},
    {label:'SendGrid / Mailchimp',status:'pending',needed:'ISO + Merchant email campaigns'},
    {label:'SMS (Twilio)',status:'pending',needed:'Merchant notifications'},
  ]
  return(
    <Card>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <div style={{fontSize:14,fontWeight:700}}>API Integrations</div>
        <span style={{fontSize:10,fontWeight:700,color:'#9333ea',background:'rgba(147,51,234,.1)',border:'1px solid rgba(147,51,234,.2)',borderRadius:20,padding:'3px 8px',fontFamily:'JetBrains Mono,monospace'}}>NON-LIVE / SETUP MODE</span>
      </div>
      <div style={{fontSize:12,color:'#6b7280',marginBottom:12}}>Status tracking only. No production sends are triggered from this panel.</div>
      <div style={{fontSize:12,color:'#4f46e5',marginBottom:6}}>Broker website login URL (testing): <a href="/broker/login" style={{color:'#4f46e5',textDecoration:'none',fontFamily:'JetBrains Mono,monospace'}}>/broker/login</a></div>
      <div style={{fontSize:12,color:'#0f766e',marginBottom:12}}>Merchant website login URL (testing): <a href="/merchant/login" style={{color:'#0f766e',textDecoration:'none',fontFamily:'JetBrains Mono,monospace'}}>/merchant/login</a></div>
      <div style={{border:'1px solid #e5e7eb',borderRadius:10,overflow:'hidden'}}>
        {rows.map((r,i)=>(
          <div key={r.label} style={{display:'grid',gridTemplateColumns:'220px 120px 1fr',gap:10,alignItems:'center',padding:'10px 12px',borderBottom:i<rows.length-1?'1px solid #f1f4f9':'none',background:i%2===0?'#fff':'#fcfcfd'}}>
            <div style={{fontSize:12,fontWeight:600}}>{r.label}</div>
            <div>
              <span style={{fontSize:10,fontWeight:700,borderRadius:20,padding:'2px 8px',fontFamily:'JetBrains Mono,monospace',background:r.status==='configured'?'rgba(22,163,74,.1)':'rgba(245,158,11,.12)',color:r.status==='configured'?'#16a34a':'#b45309',border:'1px solid '+(r.status==='configured'?'rgba(22,163,74,.2)':'rgba(245,158,11,.25)')}}>
                {r.status==='configured'?'CONFIGURED':'PENDING'}
              </span>
            </div>
            <div style={{fontSize:12,color:'#6b7280'}}>{r.needed}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ─── USERS ────────────────────────────────────────────────────────────────────
function UsersPanel({deals}){
  const brokerEmails=[...new Set(deals.map(d=>(d.brokerEmail||'').toLowerCase()).filter(Boolean))]
  const merchantEmails=[...new Set(deals.map(d=>(d.email||'').toLowerCase()).filter(Boolean))]
  const [adminToken,setAdminToken]=useState('')
  const [users,setUsers]=useState([])
  const [uErr,setUErr]=useState('')
  const [f,setF]=useState({email:'',password:'',role:'ops',brokerId:'',merchantEmail:''})
  const [busy,setBusy]=useState(false)

  const loadUsers=async()=>{
    if(!adminToken){setUErr('Paste admin token to load users');return}
    setUErr('')
    try{
      const r=await fetch('/api/auth/users',{headers:{Authorization:'Bearer '+adminToken}})
      const d=await r.json()
      if(!r.ok)throw new Error(d.error||'failed')
      setUsers(d.users||[])
    }catch(e){setUErr(e.message)}
  }
  const createUser=async()=>{
    if(!adminToken){setUErr('Paste admin token first');return}
    setBusy(true);setUErr('')
    try{
      const body={email:f.email,password:f.password,role:f.role,brokerId:f.brokerId||null,merchantEmail:f.merchantEmail||null}
      const r=await fetch('/api/auth/users',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+adminToken},body:JSON.stringify(body)})
      const d=await r.json()
      if(!r.ok)throw new Error(d.error||'failed')
      setF({email:'',password:'',role:'ops',brokerId:'',merchantEmail:''})
      await loadUsers()
    }catch(e){setUErr(e.message)}
    setBusy(false)
  }
  return(
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:12}}>
        <Stat label="Employee Users" value={users.filter(u=>['admin','underwriter','ops','sales'].includes(u.role)).length||0} sub="from auth users"/>
        <Stat label="Broker Users" value={brokerEmails.length} sub="from broker emails" color="#0f766e"/>
        <Stat label="Merchant Users" value={merchantEmails.length} sub="from deal contacts" color="#0f766e"/>
      </div>
      <Card style={{marginBottom:12}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:8}}>Connection Checklist</div>
        <div style={{fontSize:12,color:'#6b7280',lineHeight:1.7}}>
          1) Website merchant apply endpoint: <code>/api/public/apply-merchant</code><br/>
          2) Website broker signup endpoint: <code>/api/public/signup-broker</code><br/>
          3) Broker login page: <a href="/broker/login" style={{color:'#4f46e5',textDecoration:'none'}}>/broker/login</a><br/>
          4) Merchant login page: <a href="/merchant/login" style={{color:'#0f766e',textDecoration:'none'}}>/merchant/login</a><br/>
          5) Staff login page: <a href="/staff/login" style={{color:'#0f766e',textDecoration:'none'}}>/staff/login</a><br/>
          6) Users API needs table: <code>users(id,email,role,password_hash,is_active,broker_id,merchant_email,created_at)</code>
        </div>
      </Card>
      <Card style={{marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>Admin User Management (Testing)</div>
        <input value={adminToken} onChange={e=>setAdminToken(e.target.value)} placeholder="Paste admin auth token from /staff/login" style={{width:'100%',padding:'8px 10px',border:'1px solid #e5e7eb',borderRadius:8,fontSize:12,marginBottom:8}}/>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr auto',gap:8,alignItems:'center'}}>
          <input value={f.email} onChange={e=>setF(x=>({...x,email:e.target.value}))} placeholder="user email" style={{padding:'7px 9px',border:'1px solid #e5e7eb',borderRadius:7,fontSize:12}}/>
          <input value={f.password} onChange={e=>setF(x=>({...x,password:e.target.value}))} placeholder="password" style={{padding:'7px 9px',border:'1px solid #e5e7eb',borderRadius:7,fontSize:12}}/>
          <select value={f.role} onChange={e=>setF(x=>({...x,role:e.target.value}))} style={{padding:'7px 9px',border:'1px solid #e5e7eb',borderRadius:7,fontSize:12}}>
            {['admin','underwriter','ops','sales','broker','merchant'].map(r=><option key={r} value={r}>{r}</option>)}
          </select>
          <input value={f.merchantEmail} onChange={e=>setF(x=>({...x,merchantEmail:e.target.value}))} placeholder="merchant email (optional)" style={{padding:'7px 9px',border:'1px solid #e5e7eb',borderRadius:7,fontSize:12}}/>
          <Btn sm onClick={createUser} disabled={busy}>{busy?'...':'Create'}</Btn>
        </div>
        <div style={{marginTop:8,display:'flex',gap:8}}>
          <Btn sm sec onClick={loadUsers}>Load Users</Btn>
          {uErr&&<span style={{fontSize:12,color:'#b91c1c'}}>{uErr}</span>}
        </div>
      </Card>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
        <Card>
          <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>Auth Users</div>
          {(users||[]).slice(0,25).map(u=><div key={u.id} style={{fontSize:12,padding:'7px 0',borderBottom:'1px solid #f1f4f9'}}>{u.email} <span style={{color:'#9ca3af'}}>{u.role}</span></div>)}
          {!users.length&&<div style={{fontSize:12,color:'#9ca3af'}}>Load users with admin token</div>}
        </Card>
        <Card>
          <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>Broker User Emails</div>
          {brokerEmails.slice(0,20).map(e=><div key={e} style={{fontSize:12,padding:'7px 0',borderBottom:'1px solid #f1f4f9'}}>{e}</div>)}
          {!brokerEmails.length&&<div style={{fontSize:12,color:'#9ca3af'}}>No broker emails yet</div>}
        </Card>
        <Card>
          <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>Merchant User Emails</div>
          {merchantEmails.slice(0,20).map(e=><div key={e} style={{fontSize:12,padding:'7px 0',borderBottom:'1px solid #f1f4f9'}}>{e}</div>)}
          {!merchantEmails.length&&<div style={{fontSize:12,color:'#9ca3af'}}>No merchant emails yet</div>}
        </Card>
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

export async function getServerSideProps() { return { props: {} } }
