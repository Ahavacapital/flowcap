import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>FlowCap — MCA Deal Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet"/>
      </Head>
      <div id="root"></div>
      <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
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
        html,body,#root{height:100%;background:var(--bg);color:var(--text);font-family:var(--font);font-size:14px;line-height:1.6;-webkit-font-smoothing:antialiased}
        #root{display:flex}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:var(--border3);border-radius:2px}
        .sidebar{width:220px;min-width:220px;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;padding:0}
        .main{flex:1;overflow:hidden;display:flex;flex-direction:column}
        .topbar{height:56px;min-height:56px;border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 24px;gap:16px;background:var(--bg2)}
        .content{flex:1;overflow-y:auto;padding:28px}
        .sidebar-logo{padding:20px 20px 16px;border-bottom:1px solid var(--border)}
        .logo-mark{font-family:var(--serif);font-size:20px;color:var(--text);letter-spacing:-0.5px}
        .logo-mark span{color:var(--accent)}
        .logo-sub{font-size:10px;color:var(--text3);letter-spacing:1.5px;text-transform:uppercase;margin-top:2px;font-family:var(--mono)}
        .nav-section{padding:16px 12px 8px;font-size:10px;color:var(--text3);letter-spacing:1.5px;text-transform:uppercase;font-family:var(--mono)}
        .nav-item{display:flex;align-items:center;gap:10px;padding:8px 12px;margin:1px 8px;border-radius:var(--radius);cursor:pointer;color:var(--text2);font-size:13px;font-weight:400;transition:all .15s;position:relative}
        .nav-item:hover{background:var(--bg3);color:var(--text)}
        .nav-item.active{background:var(--bg4);color:var(--text);font-weight:500}
        .nav-item.active::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:16px;background:var(--accent);border-radius:0 2px 2px 0}
        .nav-badge{margin-left:auto;background:var(--accent);color:#fff;font-size:10px;font-family:var(--mono);padding:1px 6px;border-radius:10px;font-weight:500}
        .nav-badge.amber{background:var(--amber);color:#000}
        .nav-badge.green{background:var(--green)}
        .sidebar-bottom{margin-top:auto;padding:16px;border-top:1px solid var(--border)}
        .user-chip{display:flex;align-items:center;gap:10px;padding:8px;border-radius:var(--radius);background:var(--bg3);cursor:pointer}
        .avatar{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#fff;flex-shrink:0}
        .user-info{flex:1;min-width:0}
        .user-name{font-size:12px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .user-role{font-size:10px;color:var(--text3);font-family:var(--mono)}
        .page-title{font-size:15px;font-weight:500;color:var(--text)}
        .topbar-right{margin-left:auto;display:flex;align-items:center;gap:10px}
        .btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:var(--radius);font-size:13px;font-weight:500;cursor:pointer;border:none;transition:all .15s;font-family:var(--font);white-space:nowrap}
        .btn-primary{background:var(--accent);color:#fff}
        .btn-primary:hover{background:#2563eb}
        .btn-ghost{background:transparent;color:var(--text2);border:1px solid var(--border2)}
        .btn-ghost:hover{background:var(--bg3);color:var(--text);border-color:var(--border3)}
        .btn-sm{padding:5px 10px;font-size:12px}
        .btn-danger{background:#ef444415;color:var(--red);border:1px solid #ef444430}
        .btn-danger:hover{background:#ef444425}
        .btn-success{background:#10b98115;color:var(--green);border:1px solid #10b98130}
        .btn-success:hover{background:#10b98125}
        .card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px}
        .card-sm{padding:14px 16px}
        .card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
        .card-title{font-size:13px;font-weight:500;color:var(--text)}
        .card-subtitle{font-size:12px;color:var(--text3);margin-top:2px}
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
        .stat-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px 20px}
        .stat-label{font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono)}
        .stat-value{font-size:26px;font-weight:600;color:var(--text);margin:6px 0 4px;font-family:var(--mono);letter-spacing:-1px}
        .stat-delta{font-size:11px;font-family:var(--mono)}
        .stat-delta.up{color:var(--green)}
        .stat-delta.down{color:var(--red)}
        .pipeline-table{width:100%;border-collapse:collapse}
        .pipeline-table th{text-align:left;padding:8px 14px;font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono);border-bottom:1px solid var(--border);font-weight:400}
        .pipeline-table td{padding:12px 14px;border-bottom:1px solid var(--border);font-size:13px;vertical-align:middle}
        .pipeline-table tr:last-child td{border-bottom:none}
        .pipeline-table tr:hover td{background:var(--bg3)}
        .pipeline-table tr{cursor:pointer;transition:background .1s}
        .badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:500;font-family:var(--mono);white-space:nowrap}
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
        .detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .detail-field{background:var(--bg3);border-radius:var(--radius);padding:12px 14px}
        .detail-label{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono);margin-bottom:4px}
        .detail-value{font-size:13px;color:var(--text);font-weight:500}
        .timeline{display:flex;flex-direction:column;gap:0}
        .timeline-item{display:flex;gap:12px;padding:10px 0}
        .timeline-dot{width:8px;height:8px;border-radius:50%;background:var(--accent);margin-top:5px;flex-shrink:0;position:relative}
        .timeline-dot::after{content:'';position:absolute;left:3px;top:8px;width:2px;height:calc(100% + 12px);background:var(--border2)}
        .timeline-item:last-child .timeline-dot::after{display:none}
        .timeline-dot.green{background:var(--green)}
        .timeline-dot.amber{background:var(--amber)}
        .timeline-dot.red{background:var(--red)}
        .timeline-time{font-size:11px;color:var(--text3);font-family:var(--mono);white-space:nowrap;min-width:80px}
        .timeline-text{font-size:12px;color:var(--text2)}
        .modal-overlay{position:fixed;inset:0;background:#00000088;display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(4px)}
        .modal{background:var(--bg2);border:1px solid var(--border2);border-radius:var(--radius-xl);width:680px;max-width:95vw;max-height:85vh;overflow-y:auto;padding:28px}
        .modal-title{font-size:18px;font-weight:600;color:var(--text);margin-bottom:4px;font-family:var(--serif)}
        .modal-sub{font-size:13px;color:var(--text3);margin-bottom:24px}
        .modal-close{position:absolute;top:20px;right:20px;background:var(--bg3);border:none;color:var(--text2);width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center}
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .form-group{display:flex;flex-direction:column;gap:5px}
        .form-group.full{grid-column:1/-1}
        .form-label{font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono)}
        .form-input{background:var(--bg3);border:1px solid var(--border2);border-radius:var(--radius);padding:9px 12px;color:var(--text);font-size:13px;font-family:var(--font);outline:none;transition:border .15s}
        .form-input:focus{border-color:var(--accent)}
        .form-input::placeholder{color:var(--text3)}
        select.form-input option{background:var(--bg3)}
        textarea.form-input{resize:vertical;min-height:80px}
        .pipe-steps{display:flex;gap:0;margin-bottom:24px;overflow-x:auto;padding-bottom:4px}
        .pipe-step{flex:1;min-width:90px;text-align:center;padding:10px 6px;position:relative}
        .pipe-step::after{content:'';position:absolute;right:0;top:50%;transform:translateY(-50%);width:1px;height:60%;background:var(--border)}
        .pipe-step:last-child::after{display:none}
        .pipe-step-dot{width:28px;height:28px;border-radius:50%;border:2px solid var(--border3);margin:0 auto 6px;display:flex;align-items:center;justify-content:center;font-size:11px;font-family:var(--mono);color:var(--text3);transition:all .3s}
        .pipe-step.done .pipe-step-dot{background:var(--green);border-color:var(--green);color:#fff}
        .pipe-step.active .pipe-step-dot{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 0 12px #3b82f640}
        .pipe-step-label{font-size:10px;color:var(--text3);font-family:var(--mono)}
        .pipe-step.active .pipe-step-label{color:var(--accent)}
        .pipe-step.done .pipe-step-label{color:var(--green)}
        .upload-zone{border:2px dashed var(--border3);border-radius:var(--radius-lg);padding:28px;text-align:center;cursor:pointer;transition:all .2s}
        .upload-zone:hover{border-color:var(--accent);background:var(--accent)08}
        .tabs{display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:20px}
        .tab{padding:10px 16px;font-size:13px;color:var(--text3);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;margin-bottom:-1px;font-weight:400}
        .tab:hover{color:var(--text2)}
        .tab.active{color:var(--text);border-bottom-color:var(--accent);font-weight:500}
        .offer-card{background:linear-gradient(135deg,#1a2035,#1a2a35);border:1px solid var(--accent)40;border-radius:var(--radius-xl);padding:24px;position:relative;overflow:hidden}
        .offer-amount{font-size:36px;font-weight:600;color:var(--text);font-family:var(--mono);letter-spacing:-2px}
        .offer-label{font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono)}
        .offer-meta{display:flex;gap:24px;margin-top:16px}
        .offer-meta-item{display:flex;flex-direction:column;gap:3px}
        .offer-meta-val{font-size:16px;font-weight:500;color:var(--text);font-family:var(--mono)}
        .offer-meta-lbl{font-size:10px;color:var(--text3);font-family:var(--mono);text-transform:uppercase;letter-spacing:1px}
        .score-bar{height:6px;background:var(--bg4);border-radius:3px;overflow:hidden;margin-top:6px}
        .score-fill{height:100%;border-radius:3px;transition:width .8s cubic-bezier(.4,0,.2,1)}
        .empty{text-align:center;padding:48px 24px}
        .empty-icon{font-size:36px;margin-bottom:12px;opacity:0.4}
        .empty-text{font-size:14px;color:var(--text3)}
        .divider{height:1px;background:var(--border);margin:20px 0}
        .risk-flag{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:var(--radius);background:var(--bg3);border-left:3px solid}
        .risk-flag.red{border-color:var(--red)}
        .risk-flag.amber{border-color:var(--amber)}
        .risk-flag.green{border-color:var(--green)}
        .table-wrap{overflow-x:auto}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fade-in{animation:fadeIn .25s ease forwards}
        .spinner{width:14px;height:14px;border:2px solid var(--border3);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite}
        @media(max-width:900px){.stats-grid{grid-template-columns:1fr 1fr}.form-grid{grid-template-columns:1fr}}
        @media(max-width:600px){.sidebar{display:none}.stats-grid{grid-template-columns:1fr}}
      `}</style>
      <script type="text/babel" dangerouslySetInnerHTML={{__html: `
        const {useState,useEffect}=React;
        const INITIAL_DEALS=[
          {id:'D-0041',business:'Sunrise Diner LLC',contact:'Marco Reyes',broker:'TCA Capital',amount:85000,requested:100000,status:'funded',risk:72,factor:1.38,term:8,positions:1,avgDailyBal:9420,monthlyRev:62000,nyCourt:'clean',dataMerch:'clean',submitted:'2025-06-01',funded:'2025-06-05',balance:48200,notes:'Renewal eligible at 50% paydown',uwNotes:[]},
          {id:'D-0042',business:'Metro Auto Repair',contact:'Linda Park',broker:'Apex Brokers',amount:null,requested:45000,status:'underwriting',risk:58,factor:null,term:null,positions:2,avgDailyBal:4100,monthlyRev:28000,nyCourt:'1 default',dataMerch:'clean',submitted:'2025-06-08',funded:null,balance:null,notes:'',uwNotes:[]},
          {id:'D-0043',business:'Greenleaf Wellness',contact:'Sam Torres',broker:'TCA Capital',amount:62000,requested:60000,status:'offered',risk:81,factor:1.29,term:6,positions:1,avgDailyBal:7800,monthlyRev:51000,nyCourt:'clean',dataMerch:'clean',submitted:'2025-06-09',funded:null,balance:null,notes:'',uwNotes:[]},
          {id:'D-0044',business:'Harbor Fish Market',contact:'Tony Wu',broker:'Blue Ocean Fin',amount:null,requested:30000,status:'scrubbing',risk:null,factor:null,term:null,positions:0,avgDailyBal:null,monthlyRev:null,nyCourt:null,dataMerch:null,submitted:'2025-06-10',funded:null,balance:null,notes:'',uwNotes:[]},
          {id:'D-0045',business:'Apex Print & Design',contact:'Rachel Kim',broker:'Apex Brokers',amount:null,requested:25000,status:'declined',risk:32,factor:null,term:null,positions:4,avgDailyBal:1200,monthlyRev:8000,nyCourt:'3 defaults',dataMerch:'flagged',submitted:'2025-06-07',funded:null,balance:null,notes:'Too many positions',uwNotes:[]},
          {id:'D-0046',business:'Crestview Hotel',contact:'James Ollie',broker:'Landmark Cap',amount:150000,requested:150000,status:'contracts',risk:88,factor:1.22,term:10,positions:0,avgDailyBal:18000,monthlyRev:120000,nyCourt:'clean',dataMerch:'clean',submitted:'2025-06-06',funded:null,balance:null,notes:'',uwNotes:[]},
          {id:'D-0047',business:'Urban Eats Catering',contact:'Maya Patel',broker:'TCA Capital',amount:38000,requested:40000,status:'bankverify',risk:76,factor:1.35,term:6,positions:1,avgDailyBal:5200,monthlyRev:34000,nyCourt:'clean',dataMerch:'clean',submitted:'2025-06-05',funded:null,balance:null,notes:'',uwNotes:[]},
          {id:'D-0048',business:'Steel City Gym',contact:'Derek Stone',broker:'Blue Ocean Fin',amount:22000,requested:20000,status:'funded',risk:79,factor:1.41,term:5,positions:1,avgDailyBal:3800,monthlyRev:22000,nyCourt:'clean',dataMerch:'clean',submitted:'2025-05-20',funded:'2025-05-24',balance:6600,notes:'Renewal eligible at 50% paydown',uwNotes:[]},
        ];
        const STATUS_LABEL={new:'New',scrubbing:'Scrubbing',underwriting:'Underwriting',offered:'Offered',docs:'Docs Pending',contracts:'Contracts',bankverify:'Bank Verify',funded:'Funded',declined:'Declined',renewal:'Renewal'};
        const fmt$=(n)=>n!=null?'$'+n.toLocaleString():'—';
        const statusClass=(s)=>({new:'badge-new',scrubbing:'badge-scrubbing',underwriting:'badge-underwriting',offered:'badge-offered',docs:'badge-docs',contracts:'badge-contracts',bankverify:'badge-bankverify',funded:'badge-funded',declined:'badge-declined',renewal:'badge-renewal'}[s]||'');

        function App(){
          const [page,setPage]=useState('dashboard');
          const [deals,setDeals]=useState(INITIAL_DEALS);
          const [selectedDeal,setSelectedDeal]=useState(null);
          const updateDeal=d=>setDeals(ds=>ds.map(x=>x.id===d.id?d:x));
          const addDeal=d=>setDeals(ds=>[d,...ds]);
          const funded=deals.filter(d=>d.status==='funded');
          const active=deals.filter(d=>!['funded','declined'].includes(d.status));
          const totalFunded=funded.reduce((s,d)=>s+(d.amount||0),0);

          return React.createElement(React.Fragment,null,
            React.createElement('div',{className:'sidebar'},
              React.createElement('div',{className:'sidebar-logo'},
                React.createElement('div',{className:'logo-mark'},'Flow',React.createElement('span',null,'Cap')),
                React.createElement('div',{className:'logo-sub'},'MCA Platform')
              ),
              React.createElement('div',{className:'nav-section'},'Operations'),
              ['dashboard','pipeline','deals','brokers','contracts'].map(n=>
                React.createElement('div',{key:n,className:'nav-item'+(page===n?' active':''),onClick:()=>setPage(n)},n.charAt(0).toUpperCase()+n.slice(1))
              ),
              React.createElement('div',{className:'nav-section'},'Portals'),
              ['broker-portal','merchant-portal'].map(n=>
                React.createElement('div',{key:n,className:'nav-item'+(page===n?' active':''),onClick:()=>setPage(n)},n==='broker-portal'?'Broker Portal':'Merchant Portal')
              ),
              React.createElement('div',{className:'nav-section'},'Marketing'),
              ['mkt-broker','mkt-merchant'].map(n=>
                React.createElement('div',{key:n,className:'nav-item'+(page===n?' active':''),onClick:()=>setPage(n)},n==='mkt-broker'?'Broker Campaigns':'Merchant Campaigns')
              ),
              React.createElement('div',{className:'sidebar-bottom'},
                React.createElement('div',{className:'user-chip'},
                  React.createElement('div',{className:'avatar'},'JD'),
                  React.createElement('div',{className:'user-info'},
                    React.createElement('div',{className:'user-name'},'Jamie Donahue'),
                    React.createElement('div',{className:'user-role'},'Admin · Underwriter')
                  )
                )
              )
            ),
            React.createElement('div',{className:'main'},
              React.createElement('div',{className:'topbar'},
                React.createElement('div',{className:'page-title'},page.charAt(0).toUpperCase()+page.slice(1).replace('-',' ')),
                React.createElement('div',{className:'topbar-right'},
                  React.createElement('button',{className:'btn btn-primary',onClick:()=>{}},'+  New deal')
                )
              ),
              React.createElement('div',{className:'content'},
                page==='dashboard'&&React.createElement('div',{className:'fade-in'},
                  React.createElement('div',{className:'stats-grid'},
                    React.createElement('div',{className:'stat-card'},React.createElement('div',{className:'stat-label'},'Total Funded (MTD)'),React.createElement('div',{className:'stat-value'},fmt$(totalFunded)),React.createElement('div',{className:'stat-delta up'},'↑ 18% vs last month')),
                    React.createElement('div',{className:'stat-card'},React.createElement('div',{className:'stat-label'},'Active Pipeline'),React.createElement('div',{className:'stat-value'},active.length),React.createElement('div',{className:'stat-delta up'},'deals in progress')),
                    React.createElement('div',{className:'stat-card'},React.createElement('div',{className:'stat-label'},'Approval Rate'),React.createElement('div',{className:'stat-value'},'71%'),React.createElement('div',{className:'stat-delta up'},'↑ 4pts this week')),
                    React.createElement('div',{className:'stat-card'},React.createElement('div',{className:'stat-label'},'Avg Deal Size'),React.createElement('div',{className:'stat-value'},'$64K'),React.createElement('div',{className:'stat-delta up'},'↑ $8K vs prior'))
                  ),
                  React.createElement('div',{className:'card'},
                    React.createElement('div',{className:'card-header'},React.createElement('div',{className:'card-title'},'Recent deals')),
                    React.createElement('div',{className:'table-wrap'},
                      React.createElement('table',{className:'pipeline-table'},
                        React.createElement('thead',null,React.createElement('tr',null,React.createElement('th',null,'Business'),React.createElement('th',null,'Broker'),React.createElement('th',null,'Requested'),React.createElement('th',null,'Status'),React.createElement('th',null,'Risk'))),
                        React.createElement('tbody',null,deals.slice(0,6).map(d=>
                          React.createElement('tr',{key:d.id,onClick:()=>setSelectedDeal(d)},
                            React.createElement('td',null,React.createElement('div',{style:{fontWeight:500,color:'var(--text)'}},d.business),React.createElement('div',{style:{fontSize:11,color:'var(--text3)',fontFamily:'var(--mono)'}},d.id)),
                            React.createElement('td',{style:{color:'var(--text2)'}},d.broker),
                            React.createElement('td',{style:{fontFamily:'var(--mono)'}},fmt$(d.requested)),
                            React.createElement('td',null,React.createElement('span',{className:'badge '+statusClass(d.status)},STATUS_LABEL[d.status])),
                            React.createElement('td',null,d.risk!=null?React.createElement('span',{style:{fontSize:12,fontFamily:'var(--mono)',color:d.risk>=70?'var(--green)':d.risk>=50?'var(--amber)':'var(--red)'}},d.risk):'—')
                          )
                        ))
                      )
                    )
                  )
                ),
                page==='deals'&&React.createElement('div',{className:'fade-in'},
                  React.createElement('div',{className:'tabs'},
                    ['All','Approved','Funded','Declined'].map(t=>
                      React.createElement('div',{key:t,className:'tab active'},t)
                    )
                  ),
                  React.createElement('div',{className:'card',style:{padding:0}},
                    React.createElement('div',{className:'table-wrap'},
                      React.createElement('table',{className:'pipeline-table'},
                        React.createElement('thead',null,React.createElement('tr',null,React.createElement('th',null,'Deal'),React.createElement('th',null,'Business'),React.createElement('th',null,'Broker'),React.createElement('th',null,'Requested'),React.createElement('th',null,'Offer'),React.createElement('th',null,'Status'),React.createElement('th',null,'Risk'))),
                        React.createElement('tbody',null,deals.map(d=>
                          React.createElement('tr',{key:d.id,onClick:()=>setSelectedDeal(d)},
                            React.createElement('td',{style:{fontFamily:'var(--mono)',fontSize:12,color:'var(--text3)'}},d.id),
                            React.createElement('td',null,React.createElement('div',{style:{fontWeight:500,color:'var(--text)'}},d.business)),
                            React.createElement('td',{style:{color:'var(--text2)'}},d.broker),
                            React.createElement('td',{style:{fontFamily:'var(--mono)'}},fmt$(d.requested)),
                            React.createElement('td',{style:{fontFamily:'var(--mono)',color:d.amount?'var(--teal)':'var(--text3)'}},d.amount?fmt$(d.amount):'—'),
                            React.createElement('td',null,React.createElement('span',{className:'badge '+statusClass(d.status)},STATUS_LABEL[d.status])),
                            React.createElement('td',null,d.risk!=null?React.createElement('span',{style:{fontSize:12,fontFamily:'var(--mono)',color:d.risk>=70?'var(--green)':d.risk>=50?'var(--amber)':'var(--red)'}},d.risk):'—')
                          )
                        ))
                      )
                    )
                  )
                ),
                !['dashboard','deals'].includes(page)&&React.createElement('div',{className:'empty'},
                  React.createElement('div',{className:'empty-icon'},'🚧'),
                  React.createElement('div',{className:'empty-text'},'This section is ready — connect your backend to activate it')
                )
              )
            ),
            selectedDeal&&React.createElement('div',{className:'modal-overlay',onClick:e=>{if(e.target===e.currentTarget)setSelectedDeal(null)}},
              React.createElement('div',{className:'modal fade-in',style:{position:'relative'}},
                React.createElement('button',{className:'modal-close',onClick:()=>setSelectedDeal(null)},'×'),
                React.createElement('div',{className:'modal-title'},selectedDeal.business),
                React.createElement('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:20}},
                  React.createElement('span',{style:{fontSize:12,color:'var(--text3)',fontFamily:'var(--mono)'}},selectedDeal.id),
                  React.createElement('span',{className:'badge '+statusClass(selectedDeal.status)},STATUS_LABEL[selectedDeal.status])
                ),
                selectedDeal.amount&&React.createElement('div',{className:'offer-card',style:{marginBottom:20}},
                  React.createElement('div',{className:'offer-label'},'Approved offer'),
                  React.createElement('div',{className:'offer-amount'},fmt$(selectedDeal.amount)),
                  React.createElement('div',{className:'offer-meta'},
                    React.createElement('div',{className:'offer-meta-item'},React.createElement('div',{className:'offer-meta-val'},selectedDeal.factor+'x'),React.createElement('div',{className:'offer-meta-lbl'},'Factor rate')),
                    React.createElement('div',{className:'offer-meta-item'},React.createElement('div',{className:'offer-meta-val'},selectedDeal.term+' mo'),React.createElement('div',{className:'offer-meta-lbl'},'Term')),
                    React.createElement('div',{className:'offer-meta-item'},React.createElement('div',{className:'offer-meta-val'},selectedDeal.risk),React.createElement('div',{className:'offer-meta-lbl'},'Risk score'))
                  )
                ),
                React.createElement('div',{className:'detail-grid'},
                  React.createElement('div',{className:'detail-field'},React.createElement('div',{className:'detail-label'},'Contact'),React.createElement('div',{className:'detail-value'},selectedDeal.contact)),
                  React.createElement('div',{className:'detail-field'},React.createElement('div',{className:'detail-label'},'Requested'),React.createElement('div',{className:'detail-value'},fmt$(selectedDeal.requested))),
                  React.createElement('div',{className:'detail-field'},React.createElement('div',{className:'detail-label'},'Broker'),React.createElement('div',{className:'detail-value'},selectedDeal.broker)),
                  React.createElement('div',{className:'detail-field'},React.createElement('div',{className:'detail-label'},'Submitted'),React.createElement('div',{className:'detail-value'},selectedDeal.submitted))
                ),
                React.createElement('div',{className:'divider'}),
                React.createElement('div',{style:{display:'flex',gap:10}},
                  React.createElement('button',{className:'btn btn-ghost btn-sm',onClick:()=>setSelectedDeal(null)},'Close')
                )
              )
            )
          );
        }

        ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
      `}}/>
    </>
  )
}
