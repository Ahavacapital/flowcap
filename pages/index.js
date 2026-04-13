export default function Home() {
  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--bg:#0a0c0f;--bg2:#111318;--bg3:#181c23;--bg4:#1e2330;--border:#ffffff0f;--border2:#ffffff18;--border3:#ffffff28;--text:#e8eaf0;--text2:#8b90a0;--text3:#555a6a;--accent:#3b82f6;--accent2:#6366f1;--green:#10b981;--amber:#f59e0b;--red:#ef4444;--purple:#a78bfa;--teal:#14b8a6;--font:'DM Sans',sans-serif;--mono:'DM Mono',monospace;--serif:'Playfair Display',serif;--radius:10px;--radius-lg:16px;--radius-xl:24px;}
        html,body{height:100%;background:var(--bg);color:var(--text);font-family:var(--font);font-size:14px;line-height:1.6;-webkit-font-smoothing:antialiased}
        #app{height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px}
        .lmark{font-family:Georgia,serif;font-size:36px;color:var(--text)}.lmark span{color:var(--accent)}
        .lsub{font-size:12px;color:var(--text3);letter-spacing:2px;text-transform:uppercase}
        .lbar{width:180px;height:2px;background:var(--border2);border-radius:2px;overflow:hidden}
        .lfill{height:100%;background:var(--accent);border-radius:2px;animation:ld 1.5s ease-in-out infinite}
        .lst{font-size:12px;color:var(--text3)}
        @keyframes ld{0%{width:0}50%{width:70%}100%{width:100%}}
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet"/>
      <div id="app">
        <div className="lmark">Flow<span>Cap</span></div>
        <div className="lsub">MCA Deal Platform</div>
        <div className="lbar"><div className="lfill"/></div>
        <div className="lst">Loading dashboard...</div>
      </div>
      <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js" defer></script>
      <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js" defer></script>
      <script src="https://unpkg.com/@babel/standalone@7.23.0/babel.min.js" defer></script>
      <script type="text/babel" data-type="module">{`

const {useState,useEffect}=React;

function mapDeal(d){
  return {
    id: d.deal_number||d.id,
    dbId: d.id,
    business: d.business_name||'Unknown',
    contact: d.contact_name||'',
    broker: d.broker?.name||d.contact_email||'Unknown',
    amount: d.amount_approved||null,
    requested: d.amount_requested||null,
    status: d.status||'new',
    risk: d.risk_score||null,
    factor: d.factor_rate||null,
    term: d.term_months||null,
    positions: d.positions||0,
    avgDailyBal: d.avg_daily_balance||null,
    monthlyRev: d.monthly_revenue||null,
    nyCourt: d.ny_court_result||null,
    dataMerch: d.datamerch_result||null,
    submitted: d.submitted_at?.slice(0,10)||'',
    funded: d.funded_at?.slice(0,10)||null,
    balance: d.balance||null,
    notes: d.notes||'',
    uwNotes: (d.notes||[]).filter(n=>n&&n.body).map(n=>({
      id: n.id,
      text: n.body,
      category: n.category||'general',
      author: n.author||'System',
      time: n.created_at?new Date(n.created_at).toLocaleString():''
    }))
  };
}

const BROKERS=[
  {id:'B-01',name:'TCA Capital',contact:'Alex Thornton',email:'alex@tcacapital.com',deals:12,funded:8,volume:680000,commission:34000},
  {id:'B-02',name:'Apex Brokers',contact:'Sarah Kim',email:'sarah@apexbrokers.com',deals:7,funded:4,volume:290000,commission:14500},
  {id:'B-03',name:'Blue Ocean Fin',contact:'Mike Torres',email:'mike@blueocean.com',deals:5,funded:3,volume:210000,commission:10500},
  {id:'B-04',name:'Landmark Cap',contact:'Donna Reese',email:'donna@landmarkcap.com',deals:4,funded:2,volume:380000,commission:19000},
];

const SL={new:'New',scrubbing:'Scrubbing',underwriting:'Underwriting',offered:'Offered',docs:'Docs',contracts:'Contracts',bankverify:'Bank Verify',funded:'Funded',declined:'Declined',renewal:'Renewal'};
const f$=(n)=>n!=null?'$'+n.toLocaleString():'—';
const sc=(s)=>({new:'badge-new',scrubbing:'badge-scrubbing',underwriting:'badge-underwriting',offered:'badge-offered',docs:'badge-docs',contracts:'badge-contracts',bankverify:'badge-bankverify',funded:'badge-funded',declined:'badge-declined',renewal:'badge-renewal'}[s]||'');
const rc=(r)=>r>=70?'var(--green)':r>=50?'var(--amber)':'var(--red)';

const CSS=\`
#root{height:100vh;display:flex}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-thumb{background:var(--border3);border-radius:2px}
.sb{width:220px;min-width:220px;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow-y:auto}
.mn{flex:1;overflow:hidden;display:flex;flex-direction:column}
.tb{height:56px;min-height:56px;border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 24px;gap:16px;background:var(--bg2)}
.ct{flex:1;overflow-y:auto;padding:24px}
.sbl{padding:20px 20px 16px;border-bottom:1px solid var(--border)}
.lm{font-family:var(--serif);font-size:20px;color:var(--text);letter-spacing:-.5px}
.lm span{color:var(--accent)}
.ls{font-size:10px;color:var(--text3);letter-spacing:1.5px;text-transform:uppercase;margin-top:2px;font-family:var(--mono)}
.ns{padding:16px 12px 8px;font-size:10px;color:var(--text3);letter-spacing:1.5px;text-transform:uppercase;font-family:var(--mono)}
.ni{display:flex;align-items:center;gap:10px;padding:8px 12px;margin:1px 8px;border-radius:var(--radius);cursor:pointer;color:var(--text2);font-size:13px;transition:all .15s;position:relative}
.ni:hover{background:var(--bg3);color:var(--text)}
.ni.ac{background:var(--bg4);color:var(--text);font-weight:500}
.ni.ac::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:16px;background:var(--accent);border-radius:0 2px 2px 0}
.nb{margin-left:auto;background:var(--accent);color:#fff;font-size:10px;font-family:var(--mono);padding:1px 6px;border-radius:10px}
.nb.am{background:var(--amber);color:#000}
.sbb{margin-top:auto;padding:16px;border-top:1px solid var(--border)}
.uc{display:flex;align-items:center;gap:10px;padding:8px;border-radius:var(--radius);background:var(--bg3)}
.av{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#fff;flex-shrink:0}
.pt{font-size:15px;font-weight:500;color:var(--text)}
.tr{margin-left:auto;display:flex;align-items:center;gap:10px}
.btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:var(--radius);font-size:13px;font-weight:500;cursor:pointer;border:none;transition:all .15s;font-family:var(--font)}
.bp{background:var(--accent);color:#fff}.bp:hover{background:#2563eb}
.bg{background:transparent;color:var(--text2);border:1px solid var(--border2)}.bg:hover{background:var(--bg3);color:var(--text)}
.bs{padding:5px 10px;font-size:12px}
.bd{background:#ef444415;color:var(--red);border:1px solid #ef444430}
.bsu{background:#10b98115;color:var(--green);border:1px solid #10b98130}
.cd{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px}
.cds{padding:14px 16px}
.ch{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.ct2{font-size:13px;font-weight:500;color:var(--text)}
.sg{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
.sc2{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px 20px}
.sl2{font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono)}
.sv{font-size:24px;font-weight:600;color:var(--text);margin:6px 0 4px;font-family:var(--mono);letter-spacing:-1px}
.sd{font-size:11px;font-family:var(--mono)}.sd.up{color:var(--green)}
.pt2{width:100%;border-collapse:collapse}
.pt2 th{text-align:left;padding:8px 14px;font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono);border-bottom:1px solid var(--border);font-weight:400}
.pt2 td{padding:12px 14px;border-bottom:1px solid var(--border);font-size:13px;vertical-align:middle}
.pt2 tr:last-child td{border-bottom:none}
.pt2 tr:hover td{background:var(--bg3)}
.pt2 tr{cursor:pointer;transition:background .1s}
.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:500;font-family:var(--mono)}
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
.df{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.dff{background:var(--bg3);border-radius:var(--radius);padding:12px 14px}
.dl{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono);margin-bottom:4px}
.dv{font-size:13px;color:var(--text);font-weight:500}
.tl{display:flex;flex-direction:column}
.tli{display:flex;gap:12px;padding:10px 0}
.tld{width:8px;height:8px;border-radius:50%;background:var(--accent);margin-top:5px;flex-shrink:0;position:relative}
.tld::after{content:'';position:absolute;left:3px;top:8px;width:2px;height:calc(100% + 12px);background:var(--border2)}
.tli:last-child .tld::after{display:none}
.tld.green{background:var(--green)}.tld.red{background:var(--red)}
.tlt{font-size:11px;color:var(--text3);font-family:var(--mono);white-space:nowrap;min-width:80px}
.tltx{font-size:12px;color:var(--text2)}
.mo{position:fixed;inset:0;background:#00000088;display:flex;align-items:center;justify-content:center;z-index:1000}
.md{background:var(--bg2);border:1px solid var(--border2);border-radius:var(--radius-xl);width:680px;max-width:95vw;max-height:85vh;overflow-y:auto;padding:28px;position:relative}
.mt{font-size:18px;font-weight:600;color:var(--text);margin-bottom:4px;font-family:var(--serif)}
.mc{position:absolute;top:20px;right:20px;background:var(--bg3);border:none;color:var(--text2);width:28px;height:28px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px}
.fg{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.fgg{display:flex;flex-direction:column;gap:5px}
.fgg.full{grid-column:1/-1}
.fl{font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono)}
.fi{background:var(--bg3);border:1px solid var(--border2);border-radius:var(--radius);padding:9px 12px;color:var(--text);font-size:13px;font-family:var(--font);outline:none;transition:border .15s}
.fi:focus{border-color:var(--accent)}
.fi::placeholder{color:var(--text3)}
select.fi option{background:var(--bg3)}
textarea.fi{resize:vertical;min-height:80px}
.tabs{display:flex;border-bottom:1px solid var(--border);margin-bottom:20px}
.tab{padding:10px 16px;font-size:13px;color:var(--text3);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;margin-bottom:-1px}
.tab:hover{color:var(--text2)}
.tab.ac{color:var(--text);border-bottom-color:var(--accent);font-weight:500}
.oc{background:linear-gradient(135deg,#1a2035,#1a2a35);border:1px solid #3b82f640;border-radius:var(--radius-xl);padding:24px}
.oa{font-size:36px;font-weight:600;color:var(--text);font-family:var(--mono);letter-spacing:-2px}
.ol{font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono)}
.om{display:flex;gap:24px;margin-top:16px}
.omv{font-size:16px;font-weight:500;color:var(--text);font-family:var(--mono)}
.oml{font-size:10px;color:var(--text3);font-family:var(--mono);text-transform:uppercase}
.sb2{height:6px;background:var(--bg4);border-radius:3px;overflow:hidden;margin-top:6px}
.sf{height:100%;border-radius:3px}
.ps{display:flex;margin-bottom:24px;overflow-x:auto}
.pst{flex:1;min-width:80px;text-align:center;padding:8px 4px;position:relative}
.pst::after{content:'';position:absolute;right:0;top:50%;transform:translateY(-50%);width:1px;height:60%;background:var(--border)}
.pst:last-child::after{display:none}
.psd{width:26px;height:26px;border-radius:50%;border:2px solid var(--border3);margin:0 auto 6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-family:var(--mono);color:var(--text3)}
.pst.dn .psd{background:var(--green);border-color:var(--green);color:#fff}
.pst.av .psd{background:var(--accent);border-color:var(--accent);color:#fff}
.psl{font-size:10px;color:var(--text3);font-family:var(--mono)}
.pst.av .psl{color:var(--accent)}
.pst.dn .psl{color:var(--green)}
.rf{padding:10px 12px;border-radius:var(--radius);background:var(--bg3);border-left:3px solid}
.rf.red{border-color:var(--red)}.rf.amber{border-color:var(--amber)}.rf.green{border-color:var(--green)}
.uz{border:2px dashed var(--border3);border-radius:var(--radius-lg);padding:28px;text-align:center;cursor:pointer}
.dv2{height:1px;background:var(--border);margin:20px 0}
.em{text-align:center;padding:48px 24px}
.emi{font-size:36px;margin-bottom:12px;opacity:.4}
.emt{font-size:14px;color:var(--text3)}
.tw{overflow-x:auto}
.sp{width:24px;height:24px;border:3px solid var(--border3);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite;margin:0 auto}
@keyframes fi2{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
.fa{animation:fi2 .25s ease forwards}
@media(max-width:600px){.sb{display:none}.sg{grid-template-columns:1fr 1fr}}
\`;

function App(){
  const [pg,setPg]=useState('dashboard');
  const [deals,setDeals]=useState([]);
  const [loading,setLoading]=useState(true);
  const [sel,setSel]=useState(null);
  const [showNew,setShowNew]=useState(false);

  useEffect(()=>{
    fetch('/api/deals/list')
      .then(r=>r.json())
      .then(data=>{
        if(data.deals) setDeals(data.deals.map(mapDeal));
        setLoading(false);
      })
      .catch(err=>{
        console.error('Failed to load deals:',err);
        setLoading(false);
      });
  },[]);

  const refreshDeals=()=>{
    setLoading(true);
    fetch('/api/deals/list')
      .then(r=>r.json())
      .then(data=>{
        if(data.deals) setDeals(data.deals.map(mapDeal));
        setLoading(false);
      })
      .catch(()=>setLoading(false));
  };

  const upd=d=>setDeals(ds=>ds.map(x=>x.id===d.id?d:x));
  const add=d=>setDeals(ds=>[d,...ds]);
  const funded=deals.filter(d=>d.status==='funded');
  const active=deals.filter(d=>!['funded','declined'].includes(d.status));
  const tf=funded.reduce((s,d)=>s+(d.amount||0),0);
  const pts={dashboard:'Dashboard',pipeline:'Deal pipeline',deals:'All deals',brokers:'Brokers',contracts:'Contracts','broker-portal':'Broker portal','merchant-portal':'Merchant portal','mkt-broker':'Broker campaigns','mkt-merchant':'Merchant campaigns',settings:'Settings'};
  const nav=[{id:'dashboard',l:'Dashboard'},{id:'pipeline',l:'Pipeline',b:active.length,bc:'am'},{id:'deals',l:'All Deals'},{id:'brokers',l:'Brokers'},{id:'contracts',l:'Contracts'}];
  const nav2=[{id:'broker-portal',l:'Broker Portal'},{id:'merchant-portal',l:'Merchant Portal'}];
  const nav3=[{id:'mkt-broker',l:'Broker Campaigns'},{id:'mkt-merchant',l:'Merchant Campaigns'}];

  if(loading) return(
    <div id="app">
      <div className="lmark">Flow<span>Cap</span></div>
      <div className="lsub">MCA Platform</div>
      <div className="lbar"><div className="lfill"/></div>
      <div className="lst">Loading your deals...</div>
    </div>
  );

  return (
    <>
      <style>{CSS}</style>
      <div id="root">
        <div className="sb">
          <div className="sbl"><div className="lm">Flow<span>Cap</span></div><div className="ls">MCA Platform</div></div>
          <div className="ns">Operations</div>
          {nav.map(n=><div key={n.id} className={'ni'+(pg===n.id?' ac':'')} onClick={()=>setPg(n.id)}>{n.l}{n.b>0&&<span className={'nb'+(n.bc?' '+n.bc:'')}>{n.b}</span>}</div>)}
          <div className="ns">Portals</div>
          {nav2.map(n=><div key={n.id} className={'ni'+(pg===n.id?' ac':'')} onClick={()=>setPg(n.id)}>{n.l}</div>)}
          <div className="ns">Marketing</div>
          {nav3.map(n=><div key={n.id} className={'ni'+(pg===n.id?' ac':'')} onClick={()=>setPg(n.id)}>{n.l}</div>)}
          <div className="ns">System</div>
          <div className={'ni'+(pg==='settings'?' ac':'')} onClick={()=>setPg('settings')}>Settings</div>
          <div className="sbb"><div className="uc"><div className="av">JD</div><div><div style={{fontSize:12,fontWeight:500,color:'var(--text)'}}>Jamie Donahue</div><div style={{fontSize:10,color:'var(--text3)',fontFamily:'var(--mono)'}}>Admin · Underwriter</div></div></div></div>
        </div>
        <div className="mn">
          <div className="tb">
            <div className="pt">{pts[pg]||pg}</div>
            <div className="tr">
              <button className="btn bg bs" onClick={refreshDeals} title="Refresh deals">↻ Refresh</button>
              <button className="btn bp" onClick={()=>setShowNew(true)}>+ New deal</button>
            </div>
          </div>
          <div className="ct">
            {pg==='dashboard'&&<Dashboard deals={deals} setPg={setPg} setSel={setSel} tf={tf} active={active}/>}
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
        {sel&&<DealModal deal={sel} onClose={()=>setSel(null)} onUpd={d=>{upd(d);setSel(d)}}/>}
        {showNew&&<NewDeal onClose={()=>setShowNew(false)} onSave={d=>{add(d);setShowNew(false)}}/>}
      </div>
    </>
  );
}

function Dashboard({deals,setPg,setSel,tf,active}){
  const feed=[
    {t:'2 min ago',x:'D-0044 Harbor Fish Market submitted',d:''},
    {t:'18 min ago',x:'D-0047 Urban Eats bank verification completed',d:'green'},
    {t:'1 hr ago',x:'D-0046 Crestview Hotel contracts sent via DocuSign',d:''},
    {t:'3 hrs ago',x:'D-0043 Greenleaf Wellness offer sent to broker',d:'green'},
    {t:'5 hrs ago',x:'D-0045 Apex Print declined — multiple defaults',d:'red'},
    {t:'Yesterday',x:'D-0048 Steel City Gym funded — $22,000',d:'green'},
  ];
  return(
    <div className="fa">
      <div className="sg">
        <div className="sc2"><div className="sl2">Funded (MTD)</div><div className="sv">{f$(tf)}</div><div className="sd up">↑ 18% vs last month</div></div>
        <div className="sc2"><div className="sl2">Active Pipeline</div><div className="sv">{active.length}</div><div className="sd up">deals in progress</div></div>
        <div className="sc2"><div className="sl2">Approval Rate</div><div className="sv">71%</div><div className="sd up">↑ 4pts this week</div></div>
        <div className="sc2"><div className="sl2">Avg Deal Size</div><div className="sv">$64K</div><div className="sd up">↑ $8K vs prior</div></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
        <div className="cd">
          <div className="ch"><div className="ct2">Recent deals</div><button className="btn bg bs" onClick={()=>setPg('deals')}>View all</button></div>
          <div className="tw">
            <table className="pt2">
              <thead><tr><th>Business</th><th>Broker</th><th>Requested</th><th>Status</th><th>Risk</th></tr></thead>
              <tbody>{deals.slice(0,6).map(d=>(
                <tr key={d.id} onClick={()=>{setSel(d);setPg('deals')}}>
                  <td><div style={{fontWeight:500,color:'var(--text)'}}>{d.business}</div><div style={{fontSize:11,color:'var(--text3)',fontFamily:'var(--mono)'}}>{d.id}</div></td>
                  <td style={{color:'var(--text2)'}}>{d.broker}</td>
                  <td style={{fontFamily:'var(--mono)'}}>{f$(d.requested)}</td>
                  <td><span className={'badge '+sc(d.status)}>{SL[d.status]}</span></td>
                  <td>{d.risk!=null?<span style={{fontSize:12,fontFamily:'var(--mono)',color:rc(d.risk)}}>{d.risk}</span>:'—'}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
        <div className="cd">
          <div className="ch"><div className="ct2">Activity feed</div></div>
          <div className="tl">{feed.map((a,i)=>(
            <div key={i} className="tli">
              <div className={'tld '+a.d}/>
              <div><div className="tltx">{a.x}</div><div className="tlt">{a.t}</div></div>
            </div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}

function Pipeline({deals,setSel,setShowNew}){
  const stages=['scrubbing','underwriting','offered','docs','contracts','bankverify'];
  return(
    <div className="fa">
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
        <div style={{fontSize:13,color:'var(--text3)'}}>Active deals in pipeline</div>
        <button className="btn bp" onClick={()=>setShowNew(true)}>+ New deal</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:10,overflowX:'auto',minWidth:800}}>
        {stages.map(s=>{
          const sd=deals.filter(d=>d.status===s);
          return(
            <div key={s}>
              <div style={{marginBottom:10,padding:'6px 10px',background:'var(--bg3)',borderRadius:'var(--radius)',display:'flex',justifyContent:'space-between'}}>
                <span style={{fontSize:11,fontFamily:'var(--mono)',color:'var(--text2)',textTransform:'uppercase'}}>{SL[s]}</span>
                <span style={{fontSize:11,fontFamily:'var(--mono)',color:'var(--text3)'}}>{sd.length}</span>
              </div>
              {sd.map(d=>(
                <div key={d.id} className="cd cds" style={{cursor:'pointer',marginBottom:8}} onClick={()=>setSel(d)}>
                  <div style={{fontSize:12,fontWeight:500,color:'var(--text)',marginBottom:3}}>{d.business}</div>
                  <div style={{fontSize:11,color:'var(--text3)',fontFamily:'var(--mono)',marginBottom:6}}>{d.id}</div>
                  <div style={{fontSize:12,fontFamily:'var(--mono)',color:'var(--text2)'}}>{f$(d.requested)}</div>
                  {d.risk!=null&&<div style={{marginTop:6}}><div className="sb2"><div className="sf" style={{width:d.risk+'%',background:rc(d.risk)}}/></div></div>}
                </div>
              ))}
              {sd.length===0&&<div style={{padding:16,textAlign:'center',fontSize:11,color:'var(--text3)'}}>empty</div>}
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
  const tabs=[{id:'all',l:'All'},{id:'active',l:'Active'},{id:'approved',l:'Approved'},{id:'funded',l:'Funded'},{id:'declined',l:'Declined'}];
  const filt=d=>{
    const s=srch.toLowerCase();
    if(s&&!d.business.toLowerCase().includes(s)&&!d.id.toLowerCase().includes(s)&&!d.broker.toLowerCase().includes(s))return false;
    if(tab==='active')return!['funded','declined','offered'].includes(d.status);
    if(tab==='approved')return['offered','docs','contracts','bankverify'].includes(d.status);
    if(tab==='funded')return d.status==='funded';
    if(tab==='declined')return d.status==='declined';
    return true;
  };
  const filtered=deals.filter(filt);
  return(
    <div className="fa">
      <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:0}}>
        <input className="fi" style={{flex:1}} placeholder="Search deals, businesses, brokers..." value={srch} onChange={e=>setSrch(e.target.value)}/>
        <button className="btn bp" onClick={()=>setShowNew(true)}>+ New deal</button>
      </div>
      <div className="tabs" style={{marginTop:14}}>
        {tabs.map(t=><div key={t.id} className={'tab'+(tab===t.id?' ac':'')} onClick={()=>setTab(t.id)}>{t.l}</div>)}
      </div>
      <div className="cd" style={{padding:0}}>
        <div className="tw">
          <table className="pt2">
            <thead><tr><th>Deal</th><th>Business</th><th>Broker</th><th>Requested</th><th>Offer</th><th>Status</th><th>Risk</th><th>Notes</th></tr></thead>
            <tbody>{filtered.map(d=>(
              <tr key={d.id} onClick={()=>setSel(d)}>
                <td style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--text3)'}}>{d.id}</td>
                <td><div style={{fontWeight:500,color:'var(--text)'}}>{d.business}</div><div style={{fontSize:11,color:'var(--text3)'}}>{d.contact}</div></td>
                <td style={{color:'var(--text2)'}}>{d.broker}</td>
                <td style={{fontFamily:'var(--mono)'}}>{f$(d.requested)}</td>
                <td style={{fontFamily:'var(--mono)',color:d.amount?'var(--teal)':'var(--text3)'}}>{d.amount?f$(d.amount):'—'}</td>
                <td><span className={'badge '+sc(d.status)}>{SL[d.status]}</span></td>
                <td>{d.risk!=null?<span style={{fontSize:12,fontFamily:'var(--mono)',color:rc(d.risk)}}>{d.risk}</span>:'—'}</td>
                <td style={{fontSize:11,color:'var(--text2)',maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.uwNotes?.length>0?d.uwNotes[d.uwNotes.length-1].text:'—'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {filtered.length===0&&<div className="em"><div className="emi">🔍</div><div className="emt">No deals match</div></div>}
      </div>
    </div>
  );
}

function DealModal({deal,onClose,onUpd}){
  const [tab,setTab]=useState('overview');
  const [note,setNote]=useState('');
  const [cat,setCat]=useState('general');
  const steps=['new','scrubbing','underwriting','offered','contracts','bankverify','funded'];
  const idx=steps.indexOf(deal.status);
  const flags=[];
  if(deal.nyCourt&&deal.nyCourt!=='clean')flags.push({t:'red',x:'NY Courts: '+deal.nyCourt});
  if(deal.dataMerch&&deal.dataMerch!=='clean')flags.push({t:'amber',x:'DataMerch: '+deal.dataMerch});
  if(deal.positions>=3)flags.push({t:'red',x:deal.positions+' stacked positions — high risk'});
  else if(deal.positions>=2)flags.push({t:'amber',x:deal.positions+' positions — review required'});
  if(deal.avgDailyBal&&deal.avgDailyBal<2000)flags.push({t:'red',x:'Avg daily balance below $2,000'});
  if(!flags.length&&deal.risk>=70)flags.push({t:'green',x:'All checks passed — strong profile'});
  const nm={new:'scrubbing',scrubbing:'underwriting',underwriting:'offered',offered:'docs',docs:'contracts',contracts:'bankverify',bankverify:'funded'};
  const cc={general:'var(--text3)',risk:'var(--red)',approval:'var(--green)',condition:'var(--amber)',followup:'var(--purple)'};

  const addNote=()=>{
    if(!note.trim())return;
    const n={id:Date.now(),text:note.trim(),category:cat,author:'Jamie D.',time:new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})};
    onUpd({...deal,uwNotes:[...(deal.uwNotes||[]),n]});
    setNote('');
  };

  return(
    <div className="mo" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="md fa">
        <button className="mc" onClick={onClose}>×</button>
        <div className="mt">{deal.business}</div>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
          <span style={{fontSize:12,color:'var(--text3)',fontFamily:'var(--mono)'}}>{deal.id}</span>
          <span className={'badge '+sc(deal.status)}>{SL[deal.status]}</span>
          <span style={{fontSize:12,color:'var(--text3)'}}>via {deal.broker}</span>
          {deal.uwNotes?.length>0&&<span style={{fontSize:11,fontFamily:'var(--mono)',color:'var(--purple)',background:'#a78bfa15',border:'1px solid #a78bfa30',padding:'2px 8px',borderRadius:10}}>{deal.uwNotes.length} note{deal.uwNotes.length!==1?'s':''}</span>}
        </div>
        {deal.status!=='declined'&&(
          <div className="ps">
            {steps.map((s,i)=>(
              <div key={s} className={'pst'+(i<idx?' dn':i===idx?' av':'')}>
                <div className="psd">{i<idx?'✓':i+1}</div>
                <div className="psl">{SL[s]}</div>
              </div>
            ))}
          </div>
        )}
        <div className="tabs">
          {['overview','underwriting','documents','notes','timeline'].map(t=>(
            <div key={t} className={'tab'+(tab===t?' ac':'')} onClick={()=>setTab(t)} style={{textTransform:'capitalize',position:'relative'}}>
              {t}{t==='notes'&&deal.uwNotes?.length>0&&<span style={{position:'absolute',top:6,right:2,width:6,height:6,borderRadius:'50%',background:'var(--purple)'}}/>}
            </div>
          ))}
        </div>
        {tab==='overview'&&(
          <div>
            {deal.amount&&(
              <div className="oc" style={{marginBottom:20}}>
                <div className="ol">Approved offer</div>
                <div className="oa">{f$(deal.amount)}</div>
                <div className="om">
                  <div><div className="omv">{deal.factor}x</div><div className="oml">Factor rate</div></div>
                  <div><div className="omv">{deal.term} mo</div><div className="oml">Term</div></div>
                  <div><div className="omv">{deal.risk}</div><div className="oml">Risk score</div></div>
                  {deal.balance&&<div><div className="omv" style={{color:'var(--amber)'}}>{f$(deal.balance)}</div><div className="oml">Balance</div></div>}
                </div>
              </div>
            )}
            <div className="df">
              <div className="dff"><div className="dl">Contact</div><div className="dv">{deal.contact}</div></div>
              <div className="dff"><div className="dl">Requested</div><div className="dv">{f$(deal.requested)}</div></div>
              <div className="dff"><div className="dl">Submitted</div><div className="dv">{deal.submitted}</div></div>
              <div className="dff"><div className="dl">Broker</div><div className="dv">{deal.broker}</div></div>
              <div className="dff"><div className="dl">Monthly revenue</div><div className="dv">{f$(deal.monthlyRev)}</div></div>
              <div className="dff"><div className="dl">Avg daily balance</div><div className="dv">{f$(deal.avgDailyBal)}</div></div>
            </div>
          </div>
        )}
        {tab==='underwriting'&&(
          <div>
            <div style={{marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{fontSize:13,color:'var(--text)'}}>Risk score</span><span style={{fontSize:14,fontFamily:'var(--mono)',color:rc(deal.risk||0)}}>{deal.risk??'—'}/100</span></div>
              {deal.risk!=null&&<div className="sb2" style={{height:8}}><div className="sf" style={{width:deal.risk+'%',background:rc(deal.risk)}}/></div>}
            </div>
            <div className="df" style={{marginBottom:16}}>
              <div className="dff"><div className="dl">Positions</div><div className="dv" style={{color:deal.positions>=3?'var(--red)':deal.positions>=2?'var(--amber)':'var(--green)'}}>{deal.positions}</div></div>
              <div className="dff"><div className="dl">NY Courts</div><div className="dv" style={{color:deal.nyCourt==='clean'?'var(--green)':'var(--red)'}}>{deal.nyCourt??'Pending'}</div></div>
              <div className="dff"><div className="dl">DataMerch</div><div className="dv" style={{color:deal.dataMerch==='clean'?'var(--green)':'var(--amber)'}}>{deal.dataMerch??'Pending'}</div></div>
              <div className="dff"><div className="dl">Avg daily bal</div><div className="dv">{f$(deal.avgDailyBal)}</div></div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {flags.map((fl,i)=><div key={i} className={'rf '+fl.t}><span style={{fontSize:12,color:'var(--text2)'}}>{fl.x}</span></div>)}
            </div>
          </div>
        )}
        {tab==='documents'&&(
          <div>
            {[{n:'Bank statements (3 mo)',ok:deal.status!=='new'},{n:'Voided check',ok:['contracts','bankverify','funded'].includes(deal.status)},{n:'Photo ID',ok:['contracts','bankverify','funded'].includes(deal.status)},{n:'Signed contract',ok:['bankverify','funded'].includes(deal.status)},{n:'Business license',ok:false}].map((d,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',background:'var(--bg3)',borderRadius:'var(--radius)',marginBottom:8}}>
                <span style={{fontSize:13,color:'var(--text)'}}>{d.n}</span>
                <span className={'badge '+(d.ok?'badge-funded':'badge-underwriting')}>{d.ok?'received':'pending'}</span>
              </div>
            ))}
            <div className="uz"><div style={{fontSize:12,color:'var(--text3)'}}>📎 Drop files here or click to upload</div></div>
          </div>
        )}
        {tab==='notes'&&(
          <div>
            <div style={{marginBottom:16,padding:16,background:'var(--bg3)',borderRadius:'var(--radius-lg)',border:'1px solid var(--border2)'}}>
              <div style={{fontSize:12,fontWeight:500,color:'var(--text)',marginBottom:10}}>Add underwriter note</div>
              <div style={{display:'flex',gap:6,marginBottom:10,flexWrap:'wrap'}}>
                {['general','risk','approval','condition','followup'].map(c=>(
                  <button key={c} onClick={()=>setCat(c)} style={{padding:'3px 10px',borderRadius:20,fontSize:11,cursor:'pointer',border:'1px solid '+(cat===c?cc[c]:'var(--border)'),background:cat===c?cc[c]+'22':'transparent',color:cat===c?cc[c]:'var(--text3)',transition:'all .15s'}}>{c}</button>
                ))}
              </div>
              <textarea className="fi" style={{width:'100%',minHeight:72,marginBottom:10}} placeholder="Add a note..." value={note} onChange={e=>setNote(e.target.value)}/>
              <button className="btn bp bs" onClick={addNote} disabled={!note.trim()}>Save note</button>
            </div>
            {!(deal.uwNotes||[]).length&&<div className="em"><div className="emi">📝</div><div className="emt">No notes yet</div></div>}
            {(deal.uwNotes||[]).slice().reverse().map(n=>(
              <div key={n.id} style={{padding:'12px 14px',background:'var(--bg3)',borderRadius:'var(--radius)',borderLeft:'3px solid '+(cc[n.category]||'var(--border3)'),marginBottom:8}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                  <span style={{fontSize:10,fontFamily:'var(--mono)',textTransform:'uppercase',color:cc[n.category]||'var(--text3)'}}>{n.category}</span>
                  <span style={{fontSize:11,color:'var(--text3)',fontFamily:'var(--mono)'}}>{n.author} · {n.time}</span>
                </div>
                <div style={{fontSize:13,color:'var(--text)'}}>{n.text}</div>
              </div>
            ))}
          </div>
        )}
        {tab==='timeline'&&(
          <div className="tl">
            {[
              {t:deal.submitted+' 09:14',x:'Deal submitted via email',d:''},
              deal.status!=='new'&&{t:deal.submitted+' 09:15',x:'AI scrubber started automatically',d:''},
              deal.risk&&{t:deal.submitted+' 09:18',x:'Scrub complete — risk '+deal.risk+', NY courts '+deal.nyCourt+', DataMerch '+deal.dataMerch,d:deal.risk>=70?'green':''},
              deal.amount&&{t:deal.submitted+' 09:19',x:'Offer priced: '+f$(deal.amount)+' at '+deal.factor+'x',d:'green'},
              deal.status==='funded'&&{t:deal.funded,x:'Funded — ACH disbursement sent',d:'green'},
            ].filter(Boolean).map((e,i)=>(
              <div key={i} className="tli">
                <div className={'tld '+e.d}/>
                <div><div className="tltx">{e.x}</div><div className="tlt">{e.t}</div></div>
              </div>
            ))}
          </div>
        )}
        <div className="dv2"/>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          {deal.status==='offered'&&<button className="btn bp bs" onClick={()=>{onUpd({...deal,status:'contracts'});onClose()}}>Generate contracts</button>}
          {deal.status==='contracts'&&<button className="btn bp bs">Send via DocuSign</button>}
          {deal.status==='bankverify'&&<button className="btn bsu bs" onClick={()=>{onUpd({...deal,status:'funded'});onClose()}}>Mark funded</button>}
          {!['funded','declined'].includes(deal.status)&&nm[deal.status]&&<button className="btn bg bs" onClick={()=>{onUpd({...deal,status:nm[deal.status]});onClose()}}>Advance → {SL[nm[deal.status]]}</button>}
          {!['funded','declined'].includes(deal.status)&&<button className="btn bd bs" onClick={()=>{onUpd({...deal,status:'declined'});onClose()}}>Decline</button>}
          <button className="btn bg bs" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function NewDeal({onClose,onSave}){
  const [f,setF]=useState({business:'',contact:'',broker:'',requested:'',notes:''});
  const [step,setStep]=useState(0);
  const [res,setRes]=useState(null);
  const set=(k,v)=>setF(x=>({...x,[k]:v}));

  const run=()=>{
    setStep(1);
    setTimeout(()=>{
      const risk=Math.floor(Math.random()*50+40);
      setRes({risk,avgDailyBal:Math.floor(Math.random()*15000+2000),monthlyRev:Math.floor(Math.random()*80000+15000),nyCourt:Math.random()>.8?'1 default':'clean',dataMerch:Math.random()>.9?'flagged':'clean'});
      setStep(2);
    },2200);
  };

  const save=()=>{
    const r=res||{};const risk=r.risk||null;
    const amount=risk>=60?Math.round(parseInt(f.requested||0)*0.85/1000)*1000:null;
    onSave({id:'D-00'+Math.floor(Math.random()*90+50),business:f.business,contact:f.contact,broker:f.broker,requested:parseInt(f.requested)||0,status:risk>=60?'offered':'declined',risk,factor:risk>=70?1.29:1.38,term:risk>=70?8:6,positions:0,avgDailyBal:r.avgDailyBal||null,monthlyRev:r.monthlyRev||null,nyCourt:r.nyCourt||null,dataMerch:r.dataMerch||null,amount,submitted:new Date().toISOString().slice(0,10),funded:null,balance:null,notes:f.notes,uwNotes:[]});
    onClose();
  };

  return(
    <div className="mo" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="md fa">
        <button className="mc" onClick={onClose}>×</button>
        <div className="mt">New deal intake</div>
        <div style={{fontSize:13,color:'var(--text3)',marginBottom:20}}>Submit a deal for automated scrubbing and underwriting</div>
        <div className="ps" style={{marginBottom:24}}>
          {['Application','Scrubbing','Decision'].map((s,i)=>(
            <div key={i} className={'pst'+(i<step?' dn':i===step?' av':'')}>
              <div className="psd">{i<step?'✓':i+1}</div>
              <div className="psl">{s}</div>
            </div>
          ))}
        </div>
        {step===0&&(
          <>
            <div className="fg">
              <div className="fgg"><label className="fl">Business name</label><input className="fi" placeholder="Acme Corp LLC" value={f.business} onChange={e=>set('business',e.target.value)}/></div>
              <div className="fgg"><label className="fl">Contact name</label><input className="fi" placeholder="John Smith" value={f.contact} onChange={e=>set('contact',e.target.value)}/></div>
              <div className="fgg"><label className="fl">Broker</label>
                <select className="fi" value={f.broker} onChange={e=>set('broker',e.target.value)}>
                  <option value="">Select broker</option>
                  {BROKERS.map(b=><option key={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="fgg"><label className="fl">Amount requested</label><input className="fi" type="number" placeholder="50000" value={f.requested} onChange={e=>set('requested',e.target.value)}/></div>
              <div className="fgg full"><label className="fl">Notes</label><textarea className="fi" placeholder="Any context for underwriting..." value={f.notes} onChange={e=>set('notes',e.target.value)}/></div>
            </div>
            <div style={{marginTop:20,display:'flex',gap:10}}>
              <button className="btn bp" onClick={run} disabled={!f.business||!f.broker}>Run AI scrubber</button>
              <button className="btn bg bs" onClick={onClose}>Cancel</button>
            </div>
          </>
        )}
        {step===1&&<div style={{textAlign:'center',padding:'40px 0'}}><div className="sp" style={{marginBottom:20}}/><div style={{fontSize:14,color:'var(--text)',marginBottom:8}}>Running automated scrub...</div><div style={{fontSize:12,color:'var(--text3)'}}>Checking NY Courts · DataMerch · Underwriting guidelines</div></div>}
        {step===2&&res&&(
          <div className="fa">
            <div className="df" style={{marginBottom:16}}>
              <div className="dff"><div className="dl">Risk score</div><div className="dv" style={{color:rc(res.risk)}}>{res.risk}/100</div></div>
              <div className="dff"><div className="dl">Avg daily balance</div><div className="dv">{f$(res.avgDailyBal)}</div></div>
              <div className="dff"><div className="dl">Monthly revenue</div><div className="dv">{f$(res.monthlyRev)}</div></div>
              <div className="dff"><div className="dl">NY Courts</div><div className="dv" style={{color:res.nyCourt==='clean'?'var(--green)':'var(--red)'}}>{res.nyCourt}</div></div>
              <div className="dff"><div className="dl">DataMerch</div><div className="dv" style={{color:res.dataMerch==='clean'?'var(--green)':'var(--amber)'}}>{res.dataMerch}</div></div>
              <div className="dff"><div className="dl">Decision</div><div className="dv" style={{color:res.risk>=60?'var(--green)':'var(--red)'}}>{res.risk>=60?'Approve':'Decline'}</div></div>
            </div>
            {res.risk>=60&&(
              <div className="oc" style={{marginBottom:16}}>
                <div className="ol">Suggested offer</div>
                <div className="oa">{f$(Math.round(parseInt(f.requested||0)*0.85/1000)*1000)}</div>
                <div className="om">
                  <div><div className="omv">{res.risk>=70?'1.29x':'1.38x'}</div><div className="oml">Factor</div></div>
                  <div><div className="omv">{res.risk>=70?8:6} mo</div><div className="oml">Term</div></div>
                </div>
              </div>
            )}
            <div style={{display:'flex',gap:10}}>
              <button className="btn bp" onClick={save}>{res.risk>=60?'Send offer to broker':'Save as declined'}</button>
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
  return(
    <div className="fa">
      <div style={{display:'grid',gridTemplateColumns:'260px 1fr',gap:16}}>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {BROKERS.map(b=>(
            <div key={b.id} className="cd cds" style={{cursor:'pointer',borderColor:sel?.id===b.id?'var(--accent)':'var(--border)'}} onClick={()=>setSel(b)}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                <div className="av">{b.name.slice(0,2)}</div>
                <div><div style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>{b.name}</div><div style={{fontSize:11,color:'var(--text3)'}}>{b.contact}</div></div>
              </div>
              <div style={{display:'flex',gap:16,fontSize:11,fontFamily:'var(--mono)'}}>
                <span style={{color:'var(--text3)'}}>Deals: <span style={{color:'var(--text)'}}>{b.deals}</span></span>
                <span style={{color:'var(--text3)'}}>Funded: <span style={{color:'var(--green)'}}>{b.funded}</span></span>
              </div>
            </div>
          ))}
        </div>
        {sel?(
          <div className="fa">
            <div className="cd" style={{marginBottom:14}}>
              <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:16}}>
                <div className="av" style={{width:44,height:44,fontSize:16}}>{sel.name.slice(0,2)}</div>
                <div><div style={{fontSize:18,fontWeight:600,color:'var(--text)',fontFamily:'var(--serif)'}}>{sel.name}</div><div style={{fontSize:12,color:'var(--text3)'}}>{sel.email}</div></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
                <div className="sc2" style={{padding:'14px 16px'}}><div className="sl2">Volume</div><div className="sv" style={{fontSize:18}}>{f$(sel.volume)}</div></div>
                <div className="sc2" style={{padding:'14px 16px'}}><div className="sl2">Commission</div><div className="sv" style={{fontSize:18,color:'var(--green)'}}>{f$(sel.commission)}</div></div>
                <div className="sc2" style={{padding:'14px 16px'}}><div className="sl2">Conversion</div><div className="sv" style={{fontSize:18}}>{Math.round(sel.funded/sel.deals*100)}%</div></div>
              </div>
            </div>
            <div className="cd" style={{padding:0}}>
              <div style={{padding:'14px 16px',borderBottom:'1px solid var(--border)',fontSize:13,fontWeight:500,color:'var(--text)'}}>Deals from {sel.name}</div>
              <table className="pt2">
                <thead><tr><th>ID</th><th>Business</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>{deals.filter(d=>d.broker===sel.name).map(d=>(
                  <tr key={d.id}>
                    <td style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--text3)'}}>{d.id}</td>
                    <td style={{color:'var(--text)'}}>{d.business}</td>
                    <td style={{fontFamily:'var(--mono)'}}>{f$(d.amount||d.requested)}</td>
                    <td><span className={'badge '+sc(d.status)}>{SL[d.status]}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        ):(
          <div className="em" style={{marginTop:80}}><div className="emi">👈</div><div className="emt">Select a broker to view details</div></div>
        )}
      </div>
    </div>
  );
}

function ContractsPage({deals}){
  const cd=deals.filter(d=>['contracts','bankverify','funded'].includes(d.status));
  return(
    <div className="fa">
      <div style={{marginBottom:20,fontSize:13,color:'var(--text3)'}}>DocuSign integration · auto-generated on offer acceptance</div>
      {cd.map(d=>(
        <div key={d.id} className="cd cds" style={{display:'flex',alignItems:'center',gap:16,marginBottom:10}}>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>{d.business}</div><div style={{fontSize:11,color:'var(--text3)',fontFamily:'var(--mono)'}}>{d.id} · {d.broker}</div></div>
          <div style={{fontSize:13,fontFamily:'var(--mono)',color:'var(--teal)'}}>{f$(d.amount)}</div>
          <span className={'badge '+sc(d.status)}>{SL[d.status]}</span>
          {d.status==='contracts'?<button className="btn bp bs">Send DocuSign</button>:<button className="btn bg bs">View</button>}
        </div>
      ))}
      {!cd.length&&<div className="em"><div className="emi">📄</div><div className="emt">No contracts yet</div></div>}
    </div>
  );
}

function BrokerPortal({deals}){
  const [br,setBr]=useState(BROKERS[0]);
  const md=deals.filter(d=>d.broker===br.name);
  return(
    <div className="fa">
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20,padding:'14px 18px',background:'var(--bg3)',borderRadius:'var(--radius-lg)',border:'1px solid var(--border)'}}>
        <div className="av">{br.name.slice(0,2)}</div>
        <div><div style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>{br.name}</div><div style={{fontSize:11,color:'var(--text3)'}}>Broker portal</div></div>
        <div style={{marginLeft:'auto'}}>
          <select className="fi" style={{width:180}} value={br.id} onChange={e=>setBr(BROKERS.find(b=>b.id===e.target.value))}>
            {BROKERS.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      </div>
      <div className="sg">
        <div className="sc2"><div className="sl2">Active</div><div className="sv">{md.filter(d=>!['funded','declined'].includes(d.status)).length}</div></div>
        <div className="sc2"><div className="sl2">Funded</div><div className="sv">{md.filter(d=>d.status==='funded').length}</div></div>
        <div className="sc2"><div className="sl2">Volume</div><div className="sv" style={{fontSize:18}}>{f$(br.volume)}</div></div>
        <div className="sc2"><div className="sl2">Commission</div><div className="sv" style={{fontSize:18,color:'var(--green)'}}>{f$(br.commission)}</div></div>
      </div>
      <div className="cd" style={{padding:0}}>
        <table className="pt2">
          <thead><tr><th>Business</th><th>Requested</th><th>Offer</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{md.map(d=>(
            <tr key={d.id}>
              <td><div style={{fontWeight:500,color:'var(--text)'}}>{d.business}</div><div style={{fontSize:11,color:'var(--text3)',fontFamily:'var(--mono)'}}>{d.id}</div></td>
              <td style={{fontFamily:'var(--mono)'}}>{f$(d.requested)}</td>
              <td style={{fontFamily:'var(--mono)',color:d.amount?'var(--teal)':'var(--text3)'}}>{d.amount?f$(d.amount):'Pending'}</td>
              <td><span className={'badge '+sc(d.status)}>{SL[d.status]}</span></td>
              <td>{d.status==='offered'?<button className="btn bp bs">Present offer</button>:d.status==='funded'?<button className="btn bg bs">Statement</button>:'—'}</td>
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
  const po=sel?Math.round(sel.balance*1.02):0;
  return(
    <div className="fa">
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20,padding:'14px 18px',background:'var(--bg3)',borderRadius:'var(--radius-lg)',border:'1px solid var(--border)'}}>
        <div className="av" style={{background:'linear-gradient(135deg,var(--teal),var(--accent2))'}}>M</div>
        <div><div style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>Merchant Portal</div><div style={{fontSize:11,color:'var(--text3)'}}>Balances · letters · performance</div></div>
        <div style={{marginLeft:'auto'}}>
          <select className="fi" style={{width:220}} value={sel?.id} onChange={e=>setSel(fd.find(d=>d.id===e.target.value))}>
            {fd.map(d=><option key={d.id} value={d.id}>{d.business} — {d.id}</option>)}
          </select>
        </div>
      </div>
      {sel&&(
        <div className="fa">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14,marginBottom:20}}>
            <div className="oc">
              <div className="ol">Outstanding balance</div>
              <div className="oa" style={{color:'var(--amber)'}}>{f$(sel.balance)}</div>
              <div style={{marginTop:8,fontSize:11,color:'var(--text3)'}}>of {f$(sel.amount)} funded</div>
              <div style={{marginTop:10,height:4,background:'#ffffff20',borderRadius:2}}><div style={{height:'100%',borderRadius:2,background:'var(--teal)',width:Math.round((1-sel.balance/sel.amount)*100)+'%'}}/></div>
              <div style={{marginTop:4,fontSize:11,color:'var(--text3)',fontFamily:'var(--mono)'}}>{Math.round((1-sel.balance/sel.amount)*100)}% paid</div>
            </div>
            <div className="cd">
              <div className="dl">Payoff amount</div>
              <div style={{fontSize:26,fontWeight:600,fontFamily:'var(--mono)',color:'var(--text)',margin:'8px 0'}}>{f$(po)}</div>
              <div style={{fontSize:11,color:'var(--text3)',marginBottom:12}}>includes 2% early payoff fee</div>
              <button className="btn bg bs" style={{width:'100%'}}>Request payoff letter</button>
            </div>
            <div className="cd">
              <div className="dl">Documents</div>
              <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:10}}>
                <button className="btn bg bs">Balance letter</button>
                <button className="btn bg bs">Payment history</button>
                <button className="btn bg bs">Contract copy</button>
              </div>
            </div>
          </div>
          {sel.notes?.includes('Renewal')&&(
            <div style={{padding:'14px 18px',background:'#1a2a1a',border:'1px solid #10b98140',borderRadius:'var(--radius-lg)',display:'flex',alignItems:'center',gap:14}}>
              <div style={{fontSize:24}}>🎉</div>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:'var(--green)',marginBottom:2}}>Eligible for renewal</div><div style={{fontSize:12,color:'var(--text3)'}}>You've paid over 50% — contact your broker to discuss renewal options</div></div>
              <button className="btn bsu bs">Request renewal</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MktPage({type}){
  const camps=type==='broker'?[
    {id:'C-01',name:'Q3 Broker Reactivation',audience:'Inactive brokers 90d+',status:'active',sent:48,opens:31,clicks:18},
    {id:'C-02',name:'New Product: 18-month term',audience:'All active brokers',status:'draft',sent:0,opens:0,clicks:0},
    {id:'C-03',name:'April funded deals recap',audience:'Funded deal brokers',status:'sent',sent:22,opens:19,clicks:12},
  ]:[
    {id:'C-10',name:'Renewal eligible outreach',audience:'50%+ paid merchants',status:'active',sent:12,opens:9,clicks:7},
    {id:'C-11',name:'Referral program launch',audience:'All funded merchants',status:'draft',sent:0,opens:0,clicks:0},
  ];
  return(
    <div className="fa">
      <div style={{marginBottom:20,fontSize:13,color:'var(--text3)'}}>{type==='broker'?'Email & SMS campaigns for your broker network':'Automated communications for funded merchants'}</div>
      <div className="cd" style={{padding:0}}>
        <table className="pt2">
          <thead><tr><th>Campaign</th><th>Audience</th><th>Sent</th><th>Open rate</th><th>Click rate</th><th>Status</th></tr></thead>
          <tbody>{camps.map(c=>(
            <tr key={c.id}>
              <td style={{fontWeight:500,color:'var(--text)'}}>{c.name}</td>
              <td style={{fontSize:12,color:'var(--text2)'}}>{c.audience}</td>
              <td style={{fontFamily:'var(--mono)',fontSize:12}}>{c.sent||'—'}</td>
              <td style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--teal)'}}>{c.sent>0?Math.round(c.opens/c.sent*100)+'%':'—'}</td>
              <td style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--accent)'}}>{c.sent>0?Math.round(c.clicks/c.sent*100)+'%':'—'}</td>
              <td><span className={'badge '+(c.status==='active'?'badge-funded':c.status==='draft'?'badge-underwriting':'badge-offered')}>{c.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsPage(){
  return(
    <div className="fa">
      <div style={{maxWidth:600,display:'flex',flexDirection:'column',gap:14}}>
        {['Underwriting guidelines','DocuSign integration','Email intake (Gmail)','NY Courts API','DataMerch API','Notification rules','Bank verification','Google Sheets sync'].map((s,i)=>(
          <div key={i} className="cd cds" style={{display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer'}}>
            <div style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>{s}</div>
            <span style={{color:'var(--text3)',fontSize:18}}>›</span>
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
