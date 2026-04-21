export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        :root{
          --bg:#0f1117;--s1:#161b27;--s2:#1c2333;--s3:#232b3e;--s4:#2a3347;
          --b1:#ffffff0a;--b2:#ffffff14;--b3:#ffffff1e;--b4:#ffffff28;
          --t1:#f0f2f8;--t2:#9ba3b8;--t3:#5a6480;--t4:#3a4260;
          --acc:#6366f1;--acc2:#4f52d6;
          --grn:#10b981;--amb:#f59e0b;--red:#ef4444;--cyn:#06b6d4;--pur:#a78bfa;
          --font:'Inter',sans-serif;--mono:'JetBrains Mono',monospace;
          --r:8px;--rl:12px;--rx:16px;
        }
        html,body{height:100%;background:var(--bg);color:var(--t1);font-family:var(--font);font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased}
        #app-load{display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:12px;background:var(--bg)}
        #root{height:100vh;width:100vw;display:flex;overflow:hidden;position:fixed;top:0;left:0}
        /* SIDEBAR */
        .sb{width:220px;min-width:220px;height:100%;background:var(--s1);border-right:1px solid var(--b2);display:flex;flex-direction:column;flex-shrink:0}
        .sb-logo{padding:18px 18px 14px;border-bottom:1px solid var(--b1)}
        .logo-mark{display:inline-flex;align-items:center;gap:8px;font-size:15px;font-weight:700;color:var(--t1);letter-spacing:-.3px}
        .logo-dot{width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,var(--acc),var(--pur));display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0}
        .logo-sub{font-size:10px;color:var(--t3);letter-spacing:1.2px;text-transform:uppercase;margin-top:3px;font-family:var(--mono)}
        .sb-scroll{flex:1;overflow-y:auto;padding:10px 0}
        .sb-section{padding:4px 14px 2px;font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:1.2px;font-family:var(--mono);margin-top:6px}
        .ni{display:flex;align-items:center;gap:9px;padding:8px 12px;margin:1px 8px;border-radius:var(--r);cursor:pointer;color:var(--t2);font-size:13px;font-weight:500;transition:all .15s;position:relative;user-select:none;border:none;background:none;width:calc(100% - 16px);text-align:left}
        .ni:hover{background:var(--b1);color:var(--t1)}
        .ni.ac{background:linear-gradient(90deg,rgba(99,102,241,.15),rgba(99,102,241,.05));color:var(--t1);font-weight:600}
        .ni.ac::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:16px;background:var(--acc);border-radius:0 3px 3px 0}
        .nb{margin-left:auto;background:var(--acc);color:#fff;border-radius:10px;font-size:10px;padding:1px 7px;font-family:var(--mono);font-weight:600}
        .sb-footer{padding:12px;border-top:1px solid var(--b1)}
        .av{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--acc),var(--pur));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0}
        /* MAIN */
        .mn{flex:1;min-width:0;height:100%;display:flex;flex-direction:column;overflow:hidden}
        .tb{height:54px;min-height:54px;flex-shrink:0;border-bottom:1px solid var(--b1);display:flex;align-items:center;padding:0 20px;gap:10px;background:var(--s1)}
        .tb-title{font-size:15px;font-weight:600;flex:1;color:var(--t1)}
        .tb-actions{display:flex;gap:7px;align-items:center;flex-shrink:0}
        .pg{flex:1;min-height:0;overflow-y:auto;padding:20px}
        /* BUTTONS */
        .btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:var(--r);font-size:12px;font-weight:600;cursor:pointer;border:none;transition:all .15s;font-family:var(--font);white-space:nowrap;user-select:none}
        .btn:disabled{opacity:.45;cursor:not-allowed}
        .bp{background:var(--acc);color:#fff}.bp:hover:not(:disabled){background:var(--acc2)}
        .bg{background:var(--b2);color:var(--t2);border:1px solid var(--b3)}.bg:hover:not(:disabled){background:var(--b3);color:var(--t1)}
        .bs{padding:5px 10px;font-size:11px}
        .brd{background:rgba(239,68,68,.12);color:var(--red);border:1px solid rgba(239,68,68,.25)}.brd:hover:not(:disabled){background:rgba(239,68,68,.2)}
        .bgn{background:rgba(16,185,129,.12);color:var(--grn);border:1px solid rgba(16,185,129,.25)}.bgn:hover:not(:disabled){background:rgba(16,185,129,.2)}
        .bam{background:rgba(245,158,11,.12);color:var(--amb);border:1px solid rgba(245,158,11,.25)}.bam:hover:not(:disabled){background:rgba(245,158,11,.2)}
        /* CARDS */
        .cd{background:var(--s1);border:1px solid var(--b2);border-radius:var(--rl);padding:18px}
        .cd-sm{padding:12px 14px}
        /* STATS */
        .sg{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px}
        .sc{background:var(--s2);border:1px solid var(--b2);border-radius:var(--rl);padding:16px}
        .sl{font-size:11px;font-weight:500;color:var(--t3);letter-spacing:.3px}
        .sv{font-size:24px;font-weight:700;color:var(--t1);margin:5px 0 3px;font-family:var(--mono);letter-spacing:-1px;line-height:1}
        .ss{font-size:11px;color:var(--t3)}
        /* STATUS PILL */
        .pill{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600;font-family:var(--mono);white-space:nowrap;flex-shrink:0}
        .pill::before{content:'';width:5px;height:5px;border-radius:50%;flex-shrink:0}
        /* TABLE */
        .tbl{width:100%;border-collapse:collapse}
        .tbl th{text-align:left;padding:8px 12px;font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.8px;border-bottom:1px solid var(--b1);font-weight:600;white-space:nowrap;cursor:pointer;user-select:none;font-family:var(--mono)}
        .tbl th:hover{color:var(--t2)}
        .tbl td{padding:11px 12px;border-bottom:1px solid var(--b1);font-size:13px;vertical-align:middle}
        .tbl tr:last-child td{border-bottom:none}
        .tbl tr.cl:hover td{background:var(--b1);cursor:pointer}
        /* FORMS */
        .fg{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .ff{display:flex;flex-direction:column;gap:4px}
        .ff.full{grid-column:1/-1}
        .fl{font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.8px;font-weight:600;font-family:var(--mono)}
        .fi{background:var(--s3);border:1px solid var(--b3);border-radius:var(--r);padding:8px 11px;color:var(--t1);font-size:13px;font-family:var(--font);outline:none;transition:border .15s;width:100%}
        .fi:focus{border-color:var(--acc)}
        .fi::placeholder{color:var(--t3)}
        select.fi option{background:var(--s2)}
        textarea.fi{resize:vertical;min-height:68px}
        /* MODAL */
        .mo{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:100;padding:16px}
        .md{background:var(--s1);border:1px solid var(--b3);border-radius:var(--rx);width:680px;max-width:100%;max-height:92vh;overflow-y:auto}
        .md-lg{width:820px}
        .mh{padding:20px 22px 0;display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
        .mt{font-size:16px;font-weight:700;color:var(--t1)}
        .ms{font-size:12px;color:var(--t2);margin-top:3px}
        .mb{padding:18px 22px}
        .mf{padding:14px 22px 18px;display:flex;justify-content:flex-end;gap:7px;border-top:1px solid var(--b1)}
        /* STEPPER */
        .spr{display:flex;margin-bottom:22px;overflow-x:auto}
        .spi{flex:1;display:flex;flex-direction:column;align-items:center;position:relative;min-width:58px}
        .spi:not(:last-child)::after{content:'';position:absolute;top:13px;left:50%;width:100%;height:2px;background:var(--b3);z-index:0}
        .spi.dn:not(:last-child)::after{background:var(--grn)}
        .spd{width:26px;height:26px;border-radius:50%;background:var(--s3);border:2px solid var(--b3);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;z-index:1;color:var(--t3);position:relative}
        .spi.dn .spd{background:var(--grn);border-color:var(--grn);color:#fff}
        .spi.av .spd{background:var(--acc);border-color:var(--acc);color:#fff}
        .spl{font-size:9px;color:var(--t3);margin-top:4px;text-align:center;max-width:68px;line-height:1.3;font-family:var(--mono)}
        .spi.av .spl{color:var(--acc);font-weight:600}
        .spi.dn .spl{color:var(--grn)}
        /* OFFER CARD */
        .oc{background:var(--s2);border:2px solid var(--b2);border-radius:var(--rl);padding:16px;cursor:pointer;transition:all .2s;margin-bottom:10px}
        .oc:hover{border-color:var(--b3)}
        .oc.sel{border-color:var(--acc);background:rgba(99,102,241,.06)}
        .oa{font-size:28px;font-weight:700;color:var(--t1);font-family:var(--mono);letter-spacing:-1px}
        .om{display:flex;gap:18px;margin-top:10px;flex-wrap:wrap}
        .oml{font-size:10px;color:var(--t3);font-family:var(--mono);text-transform:uppercase;letter-spacing:.5px}
        .omv{font-size:13px;font-weight:600;color:var(--t2);margin-top:2px}
        /* MISC */
        .dvr{height:1px;background:var(--b1);margin:14px 0}
        .sh{display:flex;align-items:center;justify-content:space-between}
        .stitle{font-size:13px;font-weight:600;color:var(--t1)}
        .uf{background:var(--s2);border:1px solid var(--b2);border-radius:var(--r);padding:11px 13px}
        .ul{font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.8px;font-weight:600;font-family:var(--mono);margin-bottom:5px}
        .tag{display:inline-flex;align-items:center;padding:2px 7px;border-radius:5px;font-size:11px;font-weight:600}
        .sbar{height:5px;background:var(--s3);border-radius:3px;overflow:hidden}
        .sfill{height:100%;border-radius:3px}
        /* PIPELINE */
        .pb{display:flex;gap:9px;overflow-x:auto;padding-bottom:8px;align-items:flex-start;min-height:calc(100vh - 160px)}
        .pc{width:185px;min-width:185px;flex-shrink:0}
        .pch{padding:5px 8px;background:var(--s2);border:1px solid var(--b2);border-radius:var(--r);display:flex;justify-content:space-between;align-items:center;margin-bottom:7px}
        .dc{background:var(--s1);border:1px solid var(--b2);border-radius:var(--rl);padding:10px;cursor:pointer;transition:border-color .15s;margin-bottom:6px}
        .dc:hover{border-color:var(--b4)}
        /* NOTE CARDS */
        .nc{padding:9px 11px;background:var(--s2);border-radius:var(--r);border-left:3px solid var(--b3);margin-bottom:7px}
        .nc.risk{border-left-color:var(--red)}.nc.approval{border-left-color:var(--grn)}.nc.condition{border-left-color:var(--amb)}.nc.system{border-left-color:var(--acc)}.nc.followup{border-left-color:var(--pur)}
        /* SPINNER */
        .sp{width:14px;height:14px;border:2px solid var(--b3);border-top-color:var(--acc);border-radius:50%;animation:spin .7s linear infinite;display:inline-block;flex-shrink:0}
        /* TOAST */
        .toast{position:fixed;bottom:20px;right:20px;background:var(--s2);border:1px solid var(--b3);border-radius:var(--rl);padding:11px 16px;font-size:12px;color:var(--t1);z-index:200;box-shadow:0 8px 32px rgba(0,0,0,.4);animation:sui .2s ease;display:flex;align-items:center;gap:8px;max-width:300px}
        .toast.s{border-color:rgba(16,185,129,.35);color:var(--grn)}
        .toast.e{border-color:rgba(239,68,68,.35);color:var(--red)}
        /* OFFER BOX */
        .offerbox{background:linear-gradient(135deg,rgba(99,102,241,.1),rgba(167,139,250,.06));border:1px solid rgba(99,102,241,.25);border-radius:var(--rl);padding:16px;margin-bottom:14px}
        /* ANIMATIONS */
        @keyframes sui{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fi{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fa{animation:fi .2s ease}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:var(--b3);border-radius:2px}
        @media(max-width:768px){.sb{display:none}.sg{grid-template-columns:1fr 1fr}}
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <div id="app-load">
        <div style={{fontFamily:"'Inter',sans-serif",display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#6366f1,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#fff'}}>C</div>
          <span style={{fontSize:16,fontWeight:700,color:'#f0f2f8',letterSpacing:'-.3px'}}>CapFlow</span>
        </div>
        <div style={{fontSize:10,color:'#5a6480',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:"'JetBrains Mono',monospace"}}>Loading deals...</div>
      </div>
      <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js" defer></script>
      <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js" defer></script>
      <script src="https://unpkg.com/@babel/standalone@7.23.0/babel.min.js" defer></script>
      <script type="text/babel" data-type="module">{`
const {useState,useEffect,useCallback,useRef}=React;

const IC={
  dashboard:<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>,
  deals:<path d="M20 6h-2.18c.07-.44.18-.88.18-1.35C18 2.99 16.55 1.44 14.65 1.44c-1.05 0-1.96.54-2.56 1.36L12 3.45l-.09-.66C11.31 1.98 10.4 1.44 9.35 1.44 7.45 1.44 6 2.99 6 4.65c0 .47.11.91.18 1.35H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>,
  pipeline:<path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/>,
  uw:<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>,
  brokers:<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>,
  contracts:<path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM9 13v3h6v-3l2.5 2.5L15 18v-3H9v3l-2.5-2.5L9 13z"/>,
  alerts:<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>,
  plus:<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>,
  x:<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>,
  check:<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>,
  send:<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>,
  search:<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>,
  eye:<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>,
  bank:<path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zM11.5 1L2 6v2h19V6l-9.5-5z"/>,
  id:<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 2.75c1.24 0 2.25 1.01 2.25 2.25S13.24 11.25 12 11.25 9.75 10.24 9.75 9 10.76 6.75 12 6.75zM17 17H7v-1.5c0-1.67 3.33-2.5 5-2.5s5 .83 5 2.5V17z"/>,
  sign:<path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>,
  funded:<path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>,
  refresh:<path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>,
  chevron:<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>,
  filter:<path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>,
};
const Ic=({n,s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill={c}>{IC[n]}</svg>;

const SC={new:'#6366f1',scrubbing:'#a78bfa',underwriting:'#f59e0b',offered:'#10b981',docs:'#06b6d4',contracts:'#3b82f6',bankverify:'#f97316',funded:'#10b981',declined:'#ef4444',renewal:'#06b6d4'};
const SL={new:'New',scrubbing:'Scrubbing',underwriting:'Underwriting',offered:'Offered',docs:'Docs Out',contracts:'Contracts',bankverify:'Bank Verify',funded:'Funded',declined:'Declined',renewal:'Renewal'};
const NS={new:'scrubbing',scrubbing:'underwriting',underwriting:'offered',offered:'docs',docs:'contracts',contracts:'bankverify',bankverify:'funded'};
const STEPS=['new','scrubbing','underwriting','offered','docs','contracts','bankverify','funded'];
const NCC={general:'var(--t3)',risk:'var(--red)',approval:'var(--grn)',condition:'var(--amb)',followup:'var(--pur)',system:'var(--acc)'};

const f$=n=>n!=null?'$'+Number(n).toLocaleString():'--';
const fx=n=>n!=null?Number(n).toFixed(3)+'x':'--';
const rc=r=>r>=70?'var(--grn)':r>=50?'var(--amb)':'var(--red)';
const isToday=d=>{if(!d)return false;return new Date(d).toDateString()===new Date().toDateString()};

function Pill({status}){
  const c=SC[status]||'#6366f1';
  return <span className="pill" style={{background:c+'18',borderColor:c+'33',border:'1px solid',color:c}}><span style={{width:5,height:5,borderRadius:'50%',background:c,display:'block',flexShrink:0}}/>{SL[status]||status}</span>;
}

function Toast({msg,type='s',onClose}){
  useEffect(()=>{const t=setTimeout(onClose,3500);return()=>clearTimeout(t)},[]);
  return <div className={'toast '+type}><Ic n={type==='e'?'x':'check'} s={14}/>{msg}</div>;
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
  const [brokerDeal,setBrokerDeal]=useState(null);
  const [merchantDeal,setMerchantDeal]=useState(null);
  const [uwDeal,setUwDeal]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [syncing,setSyncing]=useState(false);
  const [toast,setToast]=useState(null);
  const timer=useRef(null);
  const notify=(msg,type='s')=>setToast({msg,type});
  const loadDeals=useCallback(async()=>{try{const r=await fetch('/api/deals/list');if(!r.ok)throw new Error();const d=await r.json();if(Array.isArray(d.deals))setDeals(d.deals.map(mapDeal));}catch(e){console.error(e);}setLoading(false)},[]);
  useEffect(()=>{loadDeals();timer.current=setInterval(loadDeals,60000);return()=>clearInterval(timer.current)},[loadDeals]);
  const syncSheets=async()=>{setSyncing(true);try{const r=await fetch('/api/sheets/sync',{method:'POST',headers:{Authorization:'Bearer flowcap2024secret'}});const d=await r.json();if(d.success)notify('Sheets synced');else notify('Sync error','e');}catch(e){notify('Sync failed','e');}setSyncing(false)};
  const updDeal=useCallback(u=>{setDeals(ds=>ds.map(d=>d.id===u.id?u:d));setSel(s=>s?.id===u.id?u:s)},[]);
  const delDeal=useCallback(id=>{setDeals(ds=>ds.filter(d=>d.id!==id));setSel(null);notify('Deal deleted')},[]);
  const active=deals.filter(d=>!['funded','declined'].includes(d.status));
  const funded=deals.filter(d=>d.status==='funded');
  const uwCount=deals.filter(d=>d.status==='underwriting').length;
  const todayCnt=deals.filter(d=>isToday(d.submittedAt)).length;
  const tf=funded.reduce((s,d)=>s+(d.amount||0),0);
  const tp=deals.reduce((s,d)=>s+(d.profit||0),0);

  if(loading)return(
    <div id="app-load">
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#6366f1,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#fff'}}>C</div>
        <span style={{fontSize:16,fontWeight:700,color:'#f0f2f8',letterSpacing:'-.3px',fontFamily:"'Inter',sans-serif"}}>CapFlow</span>
      </div>
      <div style={{fontSize:10,color:'#5a6480',letterSpacing:'1.5px',textTransform:'uppercase',fontFamily:"'JetBrains Mono',monospace"}}>Loading deals...</div>
    </div>
  );

  const NAV=[{id:'dashboard',l:'Dashboard',i:'dashboard'},{id:'deals',l:'All Deals',i:'deals',b:todayCnt||null},{id:'pipeline',l:'Pipeline',i:'pipeline',b:active.length||null},{id:'uwqueue',l:'UW Queue',i:'uw',b:uwCount||null},{id:'brokers',l:'Brokers / ISO',i:'brokers'},{id:'contracts',l:'Contracts',i:'contracts'},{id:'alerts',l:'Alerts',i:'alerts'}];
  const PT={dashboard:'Dashboard',deals:'All Deals',pipeline:'Pipeline',uwqueue:'UW Queue',brokers:'Brokers / ISO',contracts:'Contracts',alerts:'Alerts'};

  return(
    <>
      <div id="root">
        <div className="sb">
          <div className="sb-logo">
            <div className="logo-mark"><div className="logo-dot">C</div>CapFlow</div>
            <div className="logo-sub">MCA Platform</div>
          </div>
          <div className="sb-scroll">
            <div className="sb-section">Workspace</div>
            {NAV.map(n=>(
              <button key={n.id} className={'ni'+(pg===n.id?' ac':'')} onClick={()=>setPg(n.id)}>
                <Ic n={n.i} s={15}/>{n.l}{n.b>0&&<span className="nb">{n.b}</span>}
              </button>
            ))}
          </div>
          <div className="sb-footer">
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div className="av">JD</div>
              <div><div style={{fontSize:12,fontWeight:600,color:'var(--t1)'}}>Jamie Donahue</div><div style={{fontSize:10,color:'var(--t3)',fontFamily:'var(--mono)'}}>Admin</div></div>
            </div>
          </div>
        </div>
        <div className="mn">
          <div className="tb">
            <div className="tb-title">{PT[pg]||pg}</div>
            {todayCnt>0&&<span style={{fontSize:10,color:'var(--grn)',background:'rgba(16,185,129,.12)',border:'1px solid rgba(16,185,129,.2)',padding:'2px 8px',borderRadius:10,fontFamily:'var(--mono)',fontWeight:600}}>{todayCnt} new today</span>}
            <div className="tb-actions">
              <button className="btn bg bs" onClick={loadDeals}><Ic n="refresh" s={13}/>Refresh</button>
              <button className="btn bg bs" onClick={syncSheets} disabled={syncing}>{syncing?'Syncing...':'Sync Sheets'}</button>
              <button className="btn bp" onClick={()=>setShowNew(true)}><Ic n="plus" s={13}/>New Deal</button>
            </div>
          </div>
          <div className="pg">
            {pg==='dashboard'&&<Dashboard deals={deals} setPg={setPg} setSel={setSel} tf={tf} tp={tp} active={active} funded={funded} todayCnt={todayCnt} delDeal={delDeal}/>}
            {pg==='deals'&&<DealsList deals={deals} setSel={setSel} setShowNew={setShowNew} delDeal={delDeal}/>}
            {pg==='pipeline'&&<Pipeline deals={deals} setSel={setSel}/>}
            {pg==='uwqueue'&&<UWQueue deals={deals} onOpen={d=>{setSel(null);setUwDeal(d)}}/>}
            {pg==='brokers'&&<Brokers deals={deals}/>}
            {pg==='contracts'&&<Contracts deals={deals} setSel={setSel}/>}
            {pg==='alerts'&&<Alerts deals={deals}/>}
          </div>
        </div>
      </div>
      {sel&&<DealDetail deal={sel} onClose={()=>setSel(null)} onUpdate={updDeal} onDelete={delDeal} onRefresh={loadDeals} notify={notify} onOpenBroker={d=>{setSel(null);setBrokerDeal(d)}} onOpenMerchant={d=>{setSel(null);setMerchantDeal(d)}} onOpenUW={d=>{setSel(null);setUwDeal(d)}}/>}
      {showNew&&<NewDealModal onClose={()=>setShowNew(false)} onSave={d=>{setDeals(ds=>[d,...ds]);setShowNew(false);notify('Deal created')}}/>}
      {brokerDeal&&<BrokerView deal={brokerDeal} onClose={()=>setBrokerDeal(null)} onSelect={(id)=>{updDeal({...brokerDeal,status:'docs'});notify('Offer selected');setBrokerDeal(null)}}/>}
      {merchantDeal&&<MerchantView deal={merchantDeal} onClose={()=>setMerchantDeal(null)} onComplete={(id,step)=>{const m={bank:'bankverify',idv:'bankverify',sign:'contracts'};updDeal({...merchantDeal,status:m[step]||merchantDeal.status})}}/>}
      {uwDeal&&<UWModal deal={uwDeal} onClose={()=>setUwDeal(null)} onDecide={async(id,dec)=>{const d=deals.find(x=>x.id===id||x.dbId===id);if(d?.dbId){try{await fetch('/api/deals/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({dbId:d.dbId,status:dec==='approved'?'offered':'declined'})})}catch(e){}}updDeal({...uwDeal,status:dec==='approved'?'offered':'declined'});notify('Deal '+dec);setUwDeal(null)}}/>}
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );
}

function Dashboard({deals,setPg,setSel,tf,tp,active,funded,todayCnt,delDeal}){
  const declined=deals.filter(d=>d.status==='declined').length;
  const closed=deals.filter(d=>['funded','declined'].includes(d.status));
  const apr=closed.length>0?Math.round(funded.length/closed.length*100):0;
  const today=deals.filter(d=>isToday(d.submittedAt));
  return(
    <div className="fa">
      <div className="sg">
        <div className="sc"><div className="sl">Total Deals</div><div className="sv">{deals.length}</div><div className="ss">All time</div></div>
        <div className="sc"><div className="sl">UW Queue</div><div className="sv" style={{color:'var(--amb)'}}>{deals.filter(d=>d.status==='underwriting').length}</div><div className="ss">Awaiting review</div></div>
        <div className="sc"><div className="sl">Funded</div><div className="sv" style={{color:'var(--grn)'}}>{funded.length}</div><div className="ss">{f$(tf)} volume</div></div>
        <div className="sc"><div className="sl">Approval Rate</div><div className="sv" style={{fontSize:20}}>{apr}%</div><div className="ss">{declined} declined</div></div>
      </div>
      {today.length>0&&(
        <div className="cd" style={{marginBottom:14,padding:'10px 14px',background:'rgba(16,185,129,.06)',borderColor:'rgba(16,185,129,.2)'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{width:7,height:7,borderRadius:'50%',background:'var(--grn)',display:'block',flexShrink:0}}/><div style={{flex:1,fontSize:13}}><span style={{fontWeight:600,color:'var(--grn)'}}>{today.length} new today: </span><span style={{color:'var(--t3)'}}>{today.slice(0,3).map(d=>d.business).join(', ')}{today.length>3?' ...':''}</span></div><button className="btn bg bs" onClick={()=>setPg('deals')}>View All</button></div>
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'1fr 260px',gap:12}}>
        <div className="cd">
          <div className="sh" style={{marginBottom:14}}><div className="stitle">Recent Deals</div><button className="btn bg bs" onClick={()=>setPg('deals')}>View All</button></div>
          <div style={{overflowX:'auto'}}>
            <table className="tbl">
              <thead><tr><th>Deal ID</th><th>Merchant</th><th>Broker</th><th>Amount</th><th>Status</th><th>Risk</th><th>Profit</th><th></th></tr></thead>
              <tbody>{deals.slice(0,8).map(d=>(
                <tr key={d.id} className="cl" onClick={()=>setSel(d)}>
                  <td><span style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--acc)'}}>{d.id}</span>{isToday(d.submittedAt)&&<span style={{marginLeft:5,fontSize:9,background:'var(--grn)',color:'#fff',padding:'1px 4px',borderRadius:3,fontFamily:'var(--mono)'}}>NEW</span>}</td>
                  <td><div style={{fontWeight:600,maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.business}</div><div style={{fontSize:10,color:'var(--t3)',fontFamily:'var(--mono)'}}>{d.contact}</div></td>
                  <td style={{fontSize:12,color:'var(--t2)',maxWidth:110,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.broker}</td>
                  <td><span style={{fontFamily:'var(--mono)',fontWeight:600,color:d.amount?'var(--acc)':'var(--t3)'}}>{d.amount?f$(d.amount):f$(d.requested)}</span></td>
                  <td><Pill status={d.status}/></td>
                  <td>{d.risk!=null?<span style={{fontFamily:'var(--mono)',fontWeight:700,color:rc(d.risk)}}>{d.risk}</span>:'--'}</td>
                  <td style={{fontFamily:'var(--mono)',fontWeight:600,color:d.profit?'var(--grn)':'var(--t3)'}}>{d.profit?f$(d.profit):'--'}</td>
                  <td onClick={e=>e.stopPropagation()}><button className="btn brd bs" onClick={()=>delDeal(d.id)}><Ic n="x" s={12}/></button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <div className="cd">
            <div className="stitle" style={{marginBottom:12}}>Pipeline Status</div>
            {['new','scrubbing','underwriting','offered','contracts','bankverify'].map(s=>{const cnt=deals.filter(d=>d.status===s).length;if(!cnt)return null;return <div key={s} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}><Pill status={s}/><span style={{fontFamily:'var(--mono)',fontWeight:700,fontSize:13}}>{cnt}</span></div>})}
          </div>
          <div className="cd">
            <div className="stitle" style={{marginBottom:12}}>Automation</div>
            {[{l:'Gmail watcher',s:'Every 5 min',ok:true},{l:'AI scrubber',s:'Every 3 min',ok:true},{l:'Sheets sync',s:'Every 15 min',ok:true},{l:'Doc parser',s:'Auto on new deals',ok:true}].map((i,x)=>(
              <div key={x} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                <span style={{width:6,height:6,borderRadius:'50%',background:i.ok?'var(--grn)':'var(--red)',display:'block',flexShrink:0}}/>
                <div><div style={{fontSize:12,fontWeight:500,color:'var(--t1)'}}>{i.l}</div><div style={{fontSize:10,color:'var(--t3)'}}>{i.s}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DealsList({deals,setSel,setShowNew,delDeal}){
  const [search,setSearch]=useState('');
  const [fst,setFst]=useState('All');
  const [sc,setSc]=useState('submitted');
  const [sd,setSD]=useState('desc');
  const filtered=deals.filter(d=>{
    const s=search.toLowerCase();
    if(s&&!d.business.toLowerCase().includes(s)&&!d.id.toLowerCase().includes(s)&&!d.broker.toLowerCase().includes(s))return false;
    if(fst!=='All'&&d.status!==fst)return false;
    return true;
  }).sort((a,b)=>{
    let av,bv;
    if(sc==='risk'){av=a.risk||0;bv=b.risk||0;}else if(sc==='amount'){av=a.amount||a.requested||0;bv=b.amount||b.requested||0;}else if(sc==='profit'){av=a.profit||0;bv=b.profit||0;}else{av=a.submittedAt||'';bv=b.submittedAt||'';}
    return sd==='asc'?(av>bv?1:-1):(av<bv?1:-1);
  });
  const Th=({col,lbl})=><th onClick={()=>{if(sc===col)setSD(x=>x==='asc'?'desc':'asc');else{setSc(col);setSD('desc')}}}>{lbl}{sc===col?(sd==='asc'?' ↑':' ↓'):''}</th>;
  return(
    <div className="fa">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14,gap:10,flexWrap:'wrap'}}>
        <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
          <div style={{position:'relative'}}>
            <input className="fi" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search deals..." style={{paddingLeft:32,width:210}}/>
            <span style={{position:'absolute',left:9,top:'50%',transform:'translateY(-50%)'}}><Ic n="search" s={14} c="var(--t3)"/></span>
          </div>
          <select className="fi" value={fst} onChange={e=>setFst(e.target.value)} style={{width:170}}>
            <option value="All">All Statuses</option>
            {Object.entries(SL).map(([k,v])=><option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <button className="btn bp" onClick={()=>setShowNew(true)}><Ic n="plus" s={14}/>New Deal</button>
      </div>
      <div className="cd" style={{padding:0}}>
        <div style={{overflowX:'auto'}}>
          <table className="tbl">
            <thead><tr>
              <th>Deal ID</th><th>Merchant</th><th>Broker</th>
              <Th col="amount" lbl="Amount"/>
              <th>Status</th>
              <Th col="risk" lbl="Risk"/>
              <Th col="profit" lbl="Profit"/>
              <th>Rates</th>
              <Th col="submitted" lbl="Date"/>
              <th></th>
            </tr></thead>
            <tbody>{filtered.map(d=>(
              <tr key={d.id} className="cl" onClick={()=>setSel(d)}>
                <td><span style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--acc)'}}>{d.id}</span>{isToday(d.submittedAt)&&<span style={{marginLeft:5,fontSize:9,background:'var(--grn)',color:'#fff',padding:'1px 4px',borderRadius:3}}>NEW</span>}</td>
                <td><div style={{fontWeight:600,maxWidth:150,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.business}</div><div style={{fontSize:10,color:'var(--t3)',fontFamily:'var(--mono)'}}>{d.email}</div></td>
                <td style={{fontSize:12,color:'var(--t2)',maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.broker}</td>
                <td><span style={{fontFamily:'var(--mono)',fontWeight:600,color:d.amount?'var(--acc)':'var(--t3)'}}>{d.amount?f$(d.amount):f$(d.requested)}</span></td>
                <td><Pill status={d.status}/></td>
                <td>{d.risk!=null?<div><span style={{fontFamily:'var(--mono)',fontWeight:700,fontSize:12,color:rc(d.risk)}}>{d.risk}</span><div className="sbar" style={{width:44,marginTop:2}}><div className="sfill" style={{width:d.risk+'%',background:rc(d.risk)}}/></div></div>:'--'}</td>
                <td style={{fontFamily:'var(--mono)',fontWeight:600,color:d.profit?'var(--grn)':'var(--t3)'}}>{d.profit?f$(d.profit):'--'}</td>
                <td style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--t3)'}}>{d.factor?fx(d.factor)+' / 1.499x':'--'}</td>
                <td style={{fontSize:11,color:'var(--t3)',fontFamily:'var(--mono)'}}>{d.submitted}</td>
                <td onClick={e=>e.stopPropagation()}><button className="btn brd bs" onClick={()=>delDeal(d.id)}><Ic n="x" s={12}/></button></td>
              </tr>
            ))}
            {!filtered.length&&<tr><td colSpan={10} style={{textAlign:'center',padding:32,color:'var(--t3)'}}>No deals found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Pipeline({deals,setSel}){
  const stages=['new','scrubbing','underwriting','offered','docs','contracts','bankverify'];
  return(
    <div className="fa pb">
      {stages.map(s=>{
        const sd=deals.filter(d=>d.status===s);
        const c=SC[s]||'#6366f1';
        return(
          <div key={s} className="pc">
            <div className="pch">
              <span style={{fontSize:9,fontFamily:'var(--mono)',fontWeight:600,color:c,textTransform:'uppercase'}}>{SL[s]}</span>
              <span style={{fontSize:9,fontFamily:'var(--mono)',fontWeight:700,color:'var(--t3)'}}>{sd.length}</span>
            </div>
            {sd.map(d=>(
              <div key={d.id} className="dc" onClick={()=>setSel(d)}>
                <div style={{fontSize:11,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:3,display:'flex',alignItems:'center',gap:4}}>
                  {isToday(d.submittedAt)&&<span style={{width:5,height:5,borderRadius:'50%',background:'var(--grn)',flexShrink:0,display:'block'}}/>}
                  {d.business}
                </div>
                <div style={{fontSize:9,color:'var(--t3)',fontFamily:'var(--mono)',marginBottom:4}}>{d.id}</div>
                <div style={{fontSize:11,fontFamily:'var(--mono)',fontWeight:600,color:d.amount?'var(--acc)':'var(--t3)'}}>{d.amount?f$(d.amount):f$(d.requested)}</div>
                {d.risk!=null&&<div style={{marginTop:4}}><div className="sbar"><div className="sfill" style={{width:d.risk+'%',background:rc(d.risk)}}/></div></div>}
                {d.profit&&<div style={{fontSize:10,color:'var(--grn)',fontFamily:'var(--mono)',marginTop:3,fontWeight:600}}>+{f$(d.profit)}</div>}
              </div>
            ))}
            {!sd.length&&<div style={{padding:12,textAlign:'center',fontSize:10,color:'var(--t3)'}}>empty</div>}
          </div>
        );
      })}
    </div>
  );
}

function UWQueue({deals,onOpen}){
  const queue=deals.filter(d=>d.status==='underwriting');
  return(
    <div className="fa">
      <div className="cd">
        <div className="sh" style={{marginBottom:16}}>
          <div className="stitle">Underwriting Queue</div>
          <span className="tag" style={{background:'rgba(245,158,11,.12)',color:'var(--amb)',border:'1px solid rgba(245,158,11,.2)'}}>{queue.length} pending</span>
        </div>
        {!queue.length?(
          <div style={{textAlign:'center',padding:'40px 0',color:'var(--t3)'}}>
            <Ic n="check" s={32} c="var(--grn)"/>
            <div style={{marginTop:12}}>No files awaiting review</div>
          </div>
        ):queue.map(d=>(
          <div key={d.id} className="uf" style={{marginBottom:10,cursor:'pointer'}} onClick={()=>onOpen(d)}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div><div style={{fontWeight:700}}>{d.business}</div><div style={{fontSize:10,color:'var(--t3)',fontFamily:'var(--mono)',marginTop:3}}>{d.id} · {d.broker} · {d.submitted}</div></div>
              <div style={{textAlign:'right'}}><div style={{fontFamily:'var(--mono)',fontWeight:600,fontSize:14,color:d.monthlyRev>=35000?'var(--grn)':'var(--red)'}}>{f$(d.monthlyRev)}</div><div style={{fontSize:10,color:'var(--t3)'}}>monthly rev</div></div>
            </div>
            <div style={{display:'flex',gap:7,marginTop:9,flexWrap:'wrap'}}>
              {[{label:'Revenue',ok:d.monthlyRev>=35000},{label:'Balance',ok:d.dailyBal>=1000},{label:'Positions',ok:d.positions<3}].map(({label,ok})=>(
                <span key={label} className="tag" style={{background:ok?'rgba(16,185,129,.1)':'rgba(239,68,68,.08)',color:ok?'var(--grn)':'var(--red)',border:'1px solid '+(ok?'rgba(16,185,129,.2)':'rgba(239,68,68,.15)')}}>
                  {ok?'✓':'✗'} {label}
                </span>
              ))}
              <button className="btn bam bs" style={{marginLeft:'auto'}} onClick={e=>{e.stopPropagation();onOpen(d);}}>Review →</button>
            </div>
            {(d.uwNotes||[]).filter(n=>n.cat==='system').slice(-1).map(n=>(
              <div key={n.id} style={{marginTop:8,fontSize:11,color:'var(--t2)',background:'var(--s3)',borderRadius:6,padding:'6px 10px'}}>{n.text.slice(0,120)}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Brokers({deals}){
  const [sel,setSel]=useState(null);
  const bmap={};
  deals.forEach(d=>{const k=d.broker;if(!k||k==='Unknown')return;if(!bmap[k])bmap[k]={name:k,total:0,funded:0,declined:0,volume:0,active:0};bmap[k].total++;if(d.status==='funded'){bmap[k].funded++;bmap[k].volume+=d.amount||0;}if(d.status==='declined')bmap[k].declined++;if(!['funded','declined'].includes(d.status))bmap[k].active++;});
  const brokers=Object.values(bmap).sort((a,b)=>b.total-a.total);
  return(
    <div className="fa" style={{display:'grid',gridTemplateColumns:'230px 1fr',gap:12}}>
      <div>
        <div style={{fontSize:10,color:'var(--t3)',fontFamily:'var(--mono)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:10}}>{brokers.length} ISO shops</div>
        {brokers.map(b=>(
          <div key={b.name} className="cd cd-sm" style={{cursor:'pointer',borderColor:sel?.name===b.name?'var(--acc)':'var(--b2)',marginBottom:8,transition:'border-color .15s'}} onClick={()=>setSel(b)}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:7}}><div className="av" style={{fontSize:10,width:26,height:26}}>{b.name.slice(0,2).toUpperCase()}</div><div style={{fontSize:13,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.name}</div></div>
            <div style={{display:'flex',gap:10,fontSize:10,fontFamily:'var(--mono)'}}><span style={{color:'var(--t3)'}}>Deals: <span style={{color:'var(--t1)',fontWeight:700}}>{b.total}</span></span><span style={{color:'var(--t3)'}}>Funded: <span style={{color:'var(--grn)',fontWeight:700}}>{b.funded}</span></span></div>
          </div>
        ))}
        {!brokers.length&&<div style={{color:'var(--t3)',fontSize:13}}>No brokers yet</div>}
      </div>
      {sel?(
        <div className="fa">
          <div className="cd" style={{marginBottom:12}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}><div className="av" style={{width:38,height:38,fontSize:13}}>{sel.name.slice(0,2).toUpperCase()}</div><div style={{fontSize:16,fontWeight:700}}>{sel.name}</div></div>
            <div className="sg" style={{marginBottom:0}}>
              <div className="sc" style={{padding:'10px 12px'}}><div className="sl">Volume</div><div className="sv" style={{fontSize:15,color:'var(--acc)'}}>{f$(sel.volume)}</div></div>
              <div className="sc" style={{padding:'10px 12px'}}><div className="sl">Funded</div><div className="sv" style={{fontSize:15,color:'var(--grn)'}}>{sel.funded}</div></div>
              <div className="sc" style={{padding:'10px 12px'}}><div className="sl">Active</div><div className="sv" style={{fontSize:15,color:'var(--amb)'}}>{sel.active}</div></div>
              <div className="sc" style={{padding:'10px 12px'}}><div className="sl">Conversion</div><div className="sv" style={{fontSize:15}}>{sel.total>0?Math.round(sel.funded/sel.total*100):0}%</div></div>
            </div>
          </div>
          <div className="cd" style={{padding:0}}>
            <table className="tbl"><thead><tr><th>ID</th><th>Business</th><th>Amount</th><th>Status</th><th>Risk</th></tr></thead>
            <tbody>{deals.filter(d=>d.broker===sel.name).map(d=>(
              <tr key={d.id}><td style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--acc)'}}>{d.id}</td><td style={{fontWeight:600}}>{d.business}</td><td style={{fontFamily:'var(--mono)',fontWeight:600,color:d.amount?'var(--acc)':'var(--t3)'}}>{d.amount?f$(d.amount):f$(d.requested)}</td><td><Pill status={d.status}/></td><td>{d.risk!=null?<span style={{fontFamily:'var(--mono)',fontWeight:700,color:rc(d.risk)}}>{d.risk}</span>:'--'}</td></tr>
            ))}</tbody></table>
          </div>
        </div>
      ):<div style={{textAlign:'center',padding:48,color:'var(--t3)'}}>Select a broker to view their deals</div>}
    </div>
  );
}

function Contracts({deals,setSel}){
  const cd=deals.filter(d=>['offered','contracts','bankverify','funded'].includes(d.status));
  return(
    <div className="fa">
      <div style={{marginBottom:14,fontSize:13,color:'var(--t3)'}}>DocuSign integration — contracts auto-generated on offer acceptance</div>
      {cd.map(d=>(
        <div key={d.id} className="cd cd-sm" style={{display:'flex',alignItems:'center',gap:12,marginBottom:9,cursor:'pointer'}} onClick={()=>setSel(d)}>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{d.business}</div><div style={{fontSize:10,color:'var(--t3)',fontFamily:'var(--mono)',marginTop:3}}>{d.id} · {d.broker}</div></div>
          <div style={{textAlign:'right'}}><div style={{fontFamily:'var(--mono)',fontWeight:700,fontSize:14,color:'var(--acc)'}}>{f$(d.amount)}</div><div style={{fontSize:10,color:'var(--t3)',fontFamily:'var(--mono)'}}>{fx(d.factor)} buy · 1.499x sell</div></div>
          <Pill status={d.status}/>
          {d.status==='offered'&&<button className="btn bp bs"><Ic n="send" s={12}/>Send</button>}
        </div>
      ))}
      {!cd.length&&<div style={{textAlign:'center',padding:32,color:'var(--t3)'}}>No contracts yet</div>}
    </div>
  );
}

function Alerts({deals}){
  const alerts=[];
  deals.forEach(d=>{
    if(d.status==='underwriting')alerts.push({msg:d.business+' is ready for UW review',id:d.id,c:'var(--amb)'});
    if(d.status==='offered')alerts.push({msg:'Offer ready to send — '+d.business,id:d.id,c:'var(--acc)'});
    if(d.monthlyRev&&d.monthlyRev<35000&&!['declined','funded'].includes(d.status))alerts.push({msg:d.business+' — revenue below $35k minimum',id:d.id,c:'var(--red)'});
  });
  return(
    <div className="fa">
      <div className="cd">
        <div className="sh" style={{marginBottom:16}}><div className="stitle">System Alerts</div><span className="tag" style={{background:'rgba(163,139,250,.12)',color:'var(--pur)',border:'1px solid rgba(163,139,250,.2)'}}>{alerts.length} active</span></div>
        {!alerts.length?<div style={{textAlign:'center',padding:32,color:'var(--t3)'}}>No active alerts</div>:alerts.map((a,i)=>(
          <div key={i} className="uf" style={{marginBottom:8,borderColor:a.c+'33'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}><Ic n="alerts" s={14} c={a.c}/><span style={{fontSize:12}}>{a.msg}</span><span style={{marginLeft:'auto',fontSize:10,color:'var(--t3)',fontFamily:'var(--mono)'}}>{a.id}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DealDetail({deal,onClose,onUpdate,onDelete,onRefresh,notify,onOpenBroker,onOpenMerchant,onOpenUW}){
  const [tab,setTab]=useState('overview');
  const [note,setNote]=useState('');
  const [ncat,setNcat]=useState('general');
  const [busy,setBusy]=useState('');
  const [confirmDel,setConfirmDel]=useState(false);
  const si=STEPS.indexOf(deal.status);
  const api=async(path,body)=>{const r=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('HTTP '+r.status);return r.json()};
  const advance=async()=>{const next=NS[deal.status];if(!next||!deal.dbId)return;setBusy('advance');try{await api('/api/deals/update',{dbId:deal.dbId,status:next});onUpdate({...deal,status:next});notify('Advanced to '+SL[next]);}catch(e){notify('Failed','e');}setBusy('')};
  const decline=async()=>{if(!deal.dbId)return;setBusy('decline');try{await api('/api/deals/update',{dbId:deal.dbId,status:'declined'});onUpdate({...deal,status:'declined'});notify('Deal declined');onClose();}catch(e){notify('Failed','e');}setBusy('')};
  const fund=async()=>{if(!deal.dbId)return;setBusy('fund');try{await api('/api/deals/update',{dbId:deal.dbId,status:'funded'});onUpdate({...deal,status:'funded'});notify('Deal funded!');onClose();}catch(e){notify('Failed','e');}setBusy('')};
  const scrub=async()=>{if(!deal.dbId)return;setBusy('scrub');try{const d=await api('/api/scrubber/run',{dealId:deal.dbId});notify('Scrub done — '+(d.approved?'APPROVED':'DECLINED/REVIEW')+' Risk: '+(d.riskScore||'N/A')+'/100');onRefresh();onClose();}catch(e){notify('Failed: '+e.message,'e');}setBusy('')};
  const saveNote=()=>{if(!note.trim())return;onUpdate({...deal,uwNotes:[...(deal.uwNotes||[]),{id:'l-'+Date.now(),text:note.trim(),cat:ncat,author:'Underwriter',time:new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}]});setNote('');notify('Note saved')};
  const flags=[];
  if(deal.nyCourt&&deal.nyCourt!=='clean')flags.push({t:'red',x:'NY Courts: '+deal.nyCourt});
  if(deal.dataMerch&&deal.dataMerch!=='clean')flags.push({t:'amber',x:'DataMerch: '+deal.dataMerch});
  if(deal.positions>=3)flags.push({t:'red',x:deal.positions+' stacked positions'});
  else if(deal.positions===2)flags.push({t:'amber',x:'2 positions — review stack'});
  if(deal.dailyBal&&deal.dailyBal<1000)flags.push({t:'red',x:'Daily balance below $1,000 minimum'});
  if(deal.monthlyRev&&deal.monthlyRev<35000)flags.push({t:'red',x:'Monthly revenue below $35,000 minimum'});
  if(!flags.length&&(deal.risk||0)>=65)flags.push({t:'green',x:'All checks passed — strong profile'});
  const FC={red:'var(--red)',amber:'var(--amb)',green:'var(--grn)'};
  const FB={red:'rgba(239,68,68,.08)',amber:'rgba(245,158,11,.08)',green:'rgba(16,185,129,.08)'};
  const FBD={red:'rgba(239,68,68,.2)',amber:'rgba(245,158,11,.2)',green:'rgba(16,185,129,.2)'};
  return(
    <div className="mo" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="md md-lg fa">
        <div className="mh">
          <div>
            <div style={{fontSize:10,fontFamily:'var(--mono)',color:'var(--t3)',marginBottom:4}}>{deal.id}{isToday(deal.submittedAt)&&<span style={{marginLeft:7,fontSize:9,background:'var(--grn)',color:'#fff',padding:'1px 5px',borderRadius:3}}>TODAY</span>}</div>
            <div className="mt">{deal.business}</div>
            <div className="ms">Broker: {deal.broker} · {deal.submitted}</div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
            <Pill status={deal.status}/>
            {deal.status==='scrubbing'&&<div className="sp"/>}
            <button className="btn bg bs" onClick={onClose}><Ic n="x" s={14}/></button>
          </div>
        </div>
        <div className="mb">
          {deal.status!=='declined'&&(
            <div style={{overflowX:'auto',paddingBottom:4,marginBottom:18}}>
              <div className="spr" style={{minWidth:500}}>
                {STEPS.map((s,i)=><div key={s} className={'spi'+(i<si?' dn':i===si?' av':'')}><div className="spd">{i<si?<Ic n="check" s={11} c="#fff"/>:i+1}</div><div className="spl">{SL[s]}</div></div>)}
              </div>
            </div>
          )}
          {deal.status==='declined'&&<div style={{marginBottom:14,padding:'9px 13px',background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',borderRadius:8,fontSize:13,color:'var(--red)'}}>{(deal.uwNotes||[]).find(n=>n.cat==='risk')?.text?.slice(0,100)||'Deal declined — see notes for details'}</div>}
          {deal.amount&&(
            <div className="offerbox">
              <div style={{fontSize:10,fontFamily:'var(--mono)',color:'var(--t3)',textTransform:'uppercase',letterSpacing:1,marginBottom:5}}>Approved Offer</div>
              <div style={{fontSize:32,fontWeight:700,fontFamily:'var(--mono)',letterSpacing:-1,color:'var(--t1)'}}>{f$(deal.amount)}</div>
              <div className="om">
                {[{l:'Buy rate',v:fx(deal.factor)},{l:'Sell rate',v:'1.499x'},{l:'Term',v:(deal.termDays||'--')+' days'},{l:'Our profit',v:f$(deal.profit),g:true},{l:'Payback',v:f$(deal.payback)},{l:'Daily pmnt',v:f$(deal.payback&&deal.termDays?Math.round(deal.payback/deal.termDays):null)}].map((m,i)=>(
                  <div key={i}><div className="oml">{m.l}</div><div className="omv" style={{color:m.g?'var(--grn)':'var(--t2)'}}>{m.v}</div></div>
                ))}
              </div>
            </div>
          )}
          <div style={{display:'flex',borderBottom:'1px solid var(--b1)',marginBottom:14,overflowX:'auto'}}>
            {['overview','underwriting','notes','timeline'].map(t=>(
              <div key={t} onClick={()=>setTab(t)} style={{padding:'7px 12px',fontSize:12,cursor:'pointer',borderBottom:tab===t?'2px solid var(--acc)':'2px solid transparent',color:tab===t?'var(--acc)':'var(--t3)',fontWeight:tab===t?600:400,whiteSpace:'nowrap',marginBottom:-1,textTransform:'capitalize',position:'relative'}}>
                {t}{t==='notes'&&(deal.uwNotes||[]).length>0&&<span style={{position:'absolute',top:4,right:1,width:5,height:5,borderRadius:'50%',background:'var(--pur)',display:'block'}}/>}
              </div>
            ))}
          </div>
          {tab==='overview'&&(
            <div>
              {!deal.amount&&<div style={{marginBottom:12,padding:'10px 12px',background:'var(--s3)',borderRadius:8,fontSize:13,color:'var(--t3)'}}>No offer yet — run AI scrubber to price this deal</div>}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                {[{l:'Contact',v:deal.contact||'--'},{l:'Email',v:deal.email||'--',s:11},{l:'Requested',v:f$(deal.requested),m:true},{l:'Submitted',v:deal.submitted,m:true},{l:'Monthly Revenue',v:f$(deal.monthlyRev),m:true,c:deal.monthlyRev>=35000?'var(--grn)':deal.monthlyRev?'var(--red)':null},{l:'Avg Daily Balance',v:f$(deal.dailyBal),m:true,c:deal.dailyBal>=1000?'var(--grn)':deal.dailyBal?'var(--red)':null}].map((f,i)=>(
                  <div key={i} className="uf"><div className="ul">{f.l}</div><div style={{fontSize:f.s||13,fontWeight:600,fontFamily:f.m?'var(--mono)':'inherit',color:f.c||'var(--t1)',wordBreak:'break-all'}}>{f.v}</div></div>
                ))}
              </div>
              {deal.notes&&<div style={{marginTop:9,padding:'7px 10px',background:'var(--s3)',borderRadius:8,fontSize:12,color:'var(--t2)'}}>{deal.notes.slice(0,300)}</div>}
            </div>
          )}
          {tab==='underwriting'&&(
            <div>
              <div style={{marginBottom:12}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}><span style={{fontSize:13,fontWeight:600}}>Risk Score</span><span style={{fontFamily:'var(--mono)',fontWeight:700,fontSize:15,color:rc(deal.risk||0)}}>{deal.risk!=null?deal.risk+' / 100':'Not scrubbed'}</span></div>
                {deal.risk!=null&&<div className="sbar" style={{height:7}}><div className="sfill" style={{width:deal.risk+'%',background:rc(deal.risk)}}/></div>}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,marginBottom:12}}>
                <div className="uf"><div className="ul">Positions</div><div style={{fontSize:13,fontWeight:700,color:deal.positions>=3?'var(--red)':deal.positions>=2?'var(--amb)':'var(--grn)'}}>{deal.positions} position{deal.positions!==1?'s':''}</div></div>
                <div className="uf"><div className="ul">NY Courts</div><div style={{fontSize:13,fontWeight:700,color:deal.nyCourt==='clean'?'var(--grn)':'var(--red)'}}>{deal.nyCourt||'Pending'}</div></div>
                <div className="uf"><div className="ul">DataMerch</div><div style={{fontSize:13,fontWeight:700,color:deal.dataMerch==='clean'?'var(--grn)':'var(--amb)'}}>{deal.dataMerch||'Pending'}</div></div>
                <div className="uf"><div className="ul">Monthly Revenue</div><div style={{fontSize:13,fontWeight:700,fontFamily:'var(--mono)',color:deal.monthlyRev>=35000?'var(--grn)':deal.monthlyRev?'var(--red)':'inherit'}}>{f$(deal.monthlyRev)}</div></div>
              </div>
              {flags.map((fl,i)=><div key={i} style={{padding:'8px 12px',borderRadius:8,background:FB[fl.t],borderLeft:'3px solid '+FC[fl.t],marginBottom:7,border:'1px solid '+FBD[fl.t]}}><span style={{fontSize:12,color:'var(--t2)'}}>{fl.x}</span></div>)}
              {!flags.length&&deal.risk==null&&<div style={{textAlign:'center',padding:20,color:'var(--t3)',fontSize:13}}>Run AI scrubber to see underwriting analysis</div>}
            </div>
          )}
          {tab==='notes'&&(
            <div>
              <div style={{marginBottom:12,padding:12,background:'var(--s2)',borderRadius:10,border:'1px solid var(--b2)'}}>
                <div style={{fontSize:12,fontWeight:600,marginBottom:8,color:'var(--t1)'}}>Add underwriter note</div>
                <div style={{display:'flex',gap:5,marginBottom:8,flexWrap:'wrap'}}>
                  {['general','risk','approval','condition','followup'].map(c=><button key={c} onClick={()=>setNcat(c)} style={{padding:'2px 9px',borderRadius:20,fontSize:11,cursor:'pointer',border:'1px solid '+(ncat===c?NCC[c]:'var(--b3)'),background:ncat===c?NCC[c]+'22':'transparent',color:ncat===c?NCC[c]:'var(--t3)',transition:'all .15s',fontFamily:'var(--font)'}}>{c}</button>)}
                </div>
                <textarea className="fi" style={{minHeight:58,marginBottom:8}} placeholder="Add note..." value={note} onChange={e=>setNote(e.target.value)}/>
                <button className="btn bp bs" onClick={saveNote} disabled={!note.trim()}><Ic n="check" s={12}/>Save Note</button>
              </div>
              {!(deal.uwNotes||[]).length&&<div style={{textAlign:'center',padding:24,color:'var(--t3)'}}>No notes yet</div>}
              {(deal.uwNotes||[]).slice().reverse().map(n=>(
                <div key={n.id} className={'nc '+(n.cat||'general')}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span style={{fontSize:9,fontFamily:'var(--mono)',textTransform:'uppercase',fontWeight:700,color:NCC[n.cat]||'var(--t3)'}}>{n.cat}</span><span style={{fontSize:10,color:'var(--t3)',fontFamily:'var(--mono)'}}>{n.author} · {n.time}</span></div>
                  <div style={{fontSize:13,lineHeight:1.5,color:'var(--t2)'}}>{n.text}</div>
                </div>
              ))}
            </div>
          )}
          {tab==='timeline'&&(
            <div>
              {[deal.submitted&&{t:deal.submitted,x:'Deal submitted from '+deal.broker,c:'var(--acc)'},deal.status!=='new'&&{t:deal.submitted,x:'AI scrubber triggered automatically',c:'var(--acc)'},deal.risk&&{t:deal.submitted,x:'Scrub complete · Risk: '+deal.risk+'/100 · Positions: '+deal.positions,c:deal.risk>=65?'var(--grn)':'var(--amb)'},deal.amount&&{t:deal.submitted,x:'Offer: '+f$(deal.amount)+' @ '+fx(deal.factor)+' · Profit: '+f$(deal.profit),c:'var(--grn)'},deal.status==='funded'&&{t:deal.funded||'',x:'Funded — ACH sent',c:'var(--grn)'},deal.status==='declined'&&{t:deal.submitted,x:'Deal declined',c:'var(--red)'},...(deal.uwNotes||[]).map(n=>({t:n.time,x:n.author+' — '+n.text.slice(0,80),c:NCC[n.cat]||'var(--t3)'}))].filter(Boolean).map((e,i,arr)=>(
                <div key={i} style={{display:'flex',gap:11,paddingBottom:14,position:'relative'}}>
                  {i<arr.length-1&&<div style={{position:'absolute',left:9,top:20,width:2,height:'calc(100% - 8px)',background:'var(--b2)'}}/>}
                  <div style={{width:20,height:20,minWidth:20,borderRadius:'50%',background:e.c+'18',border:'1px solid '+e.c+'44',marginTop:1,zIndex:1,display:'flex',alignItems:'center',justifyContent:'center'}}><Ic n="check" s={10} c={e.c}/></div>
                  <div><div style={{fontSize:12,fontWeight:500,color:'var(--t2)'}}>{e.x}</div><div style={{fontSize:10,color:'var(--t3)',fontFamily:'var(--mono)',marginTop:2}}>{e.t}</div></div>
                </div>
              ))}
            </div>
          )}
          <div className="dvr"/>
          <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
            {['new','scrubbing','underwriting'].includes(deal.status)&&<button className="btn bam" onClick={scrub} disabled={busy==='scrub'}>{busy==='scrub'?<span style={{display:'flex',alignItems:'center',gap:6}}><div className="sp"/>Scrubbing...</span>:<span style={{display:'flex',alignItems:'center',gap:6}}><Ic n="uw" s={14}/>Run AI Scrub</span>}</button>}
            {deal.status==='offered'&&<button className="btn bp" onClick={()=>onOpenBroker(deal)}><Ic n="send" s={13}/>Send to Broker</button>}
            {deal.status==='underwriting'&&<button className="btn bam" onClick={()=>onOpenUW(deal)}><Ic n="uw" s={13}/>Open UW Review</button>}
            {deal.status==='bankverify'&&<button className="btn bgn" onClick={fund} disabled={busy==='fund'}><Ic n="check" s={13}/>{busy==='fund'?'...':'Mark Funded'}</button>}
            {!['funded','declined'].includes(deal.status)&&NS[deal.status]&&<button className="btn bg bs" onClick={advance} disabled={busy==='advance'}>{busy==='advance'?'...':'Advance → '+SL[NS[deal.status]]}</button>}
            {!['funded','declined'].includes(deal.status)&&<button className="btn brd bs" onClick={decline} disabled={busy==='decline'}><Ic n="x" s={12}/>{busy==='decline'?'...':'Decline'}</button>}
          </div>
          <div className="dvr"/>
          {!confirmDel?<button className="btn bg bs" style={{color:'var(--red)',borderColor:'rgba(239,68,68,.25)'}} onClick={()=>setConfirmDel(true)}>Delete Deal</button>:(
            <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(239,68,68,.06)',border:'1px solid rgba(239,68,68,.2)',borderRadius:8,padding:'9px 13px'}}>
              <span style={{fontSize:12,color:'var(--red)',flex:1}}>Delete <strong>{deal.id}</strong>? Cannot be undone.</span>
              <button className="btn bg bs" onClick={()=>setConfirmDel(false)}>Cancel</button>
              <button className="btn brd bs" onClick={()=>{onDelete(deal.id);onClose();}}><Ic n="check" s={12}/>Confirm</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BrokerView({deal,onClose,onSelect}){
  const [sel,setSel]=useState(null);
  const [confirmed,setConfirmed]=useState(false);
  const offers=deal.amount?[{id:'O-1',amount:deal.amount,payback:deal.payback,factor:deal.factor,termDays:deal.termDays,position:'2nd',fee:1,expiry:new Date(Date.now()+10*86400000).toISOString().slice(0,10),commissionPct:10}]:[];
  return(
    <div className="mo" onClick={onClose}>
      <div className="md md-lg fa" onClick={e=>e.stopPropagation()}>
        <div className="mh">
          <div><div style={{fontSize:10,fontFamily:'var(--mono)',color:'var(--t3)',marginBottom:4}}>SECURE BROKER LINK · {deal.id}</div><div className="mt">Select an Offer</div><div className="ms">Review options for {deal.business}</div></div>
          <button className="btn bg bs" onClick={onClose}><Ic n="x" s={14}/></button>
        </div>
        <div className="mb">
          {confirmed?(
            <div className="fa" style={{textAlign:'center',padding:'32px 0'}}>
              <div style={{width:60,height:60,borderRadius:'50%',background:'rgba(16,185,129,.12)',border:'1px solid rgba(16,185,129,.3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}><Ic n="check" s={28} c="var(--grn)"/></div>
              <div style={{fontWeight:700,fontSize:17,marginBottom:7}}>Offer Selected</div>
              <div style={{color:'var(--t2)',fontSize:13}}>Selection locked. Merchant will receive their onboarding link shortly.</div>
            </div>
          ):(
            <>
              <div className="uf" style={{marginBottom:14,background:'rgba(245,158,11,.06)',borderColor:'rgba(245,158,11,.2)'}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}><Ic n="alerts" s={14} c="var(--amb)"/><span style={{fontSize:12,color:'var(--amb)'}}>This link is unique and secure. Once you select an offer, it cannot be changed.</span></div>
              </div>
              {!offers.length&&<div style={{textAlign:'center',padding:24,color:'var(--t3)'}}>No offer priced yet. Run AI scrubber first.</div>}
              {offers.map(o=>(
                <div key={o.id} className={'oc'+(sel===o.id?' sel':'')} onClick={()=>setSel(o.id)}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                    <div className="oa">{f$(o.amount)}</div>
                    <div style={{width:20,height:20,borderRadius:'50%',border:'2px solid '+(sel===o.id?'var(--acc)':'var(--b3)'),background:sel===o.id?'var(--acc)':'transparent',display:'flex',alignItems:'center',justifyContent:'center'}}>{sel===o.id&&<Ic n="check" s={12} c="#fff"/>}</div>
                  </div>
                  <div className="om">
                    {[{l:'Total Payback',v:f$(o.payback)},{l:'Factor Rate',v:fx(o.factor)},{l:'Term',v:o.termDays+' days'},{l:'Position',v:o.position},{l:'Daily Payment',v:f$(o.payback&&o.termDays?Math.round(o.payback/o.termDays):null),g:true},{l:'Orig. Fee',v:o.fee+'%'},{l:'Expires',v:o.expiry}].map((m,i)=>(
                      <div key={i}><div className="oml">{m.l}</div><div className="omv" style={{color:m.g?'var(--grn)':'var(--t2)'}}>{m.v}</div></div>
                    ))}
                  </div>
                  {o.commissionPct&&(
                    <div style={{marginTop:12,padding:'10px 14px',background:'rgba(16,185,129,.08)',border:'1px solid rgba(16,185,129,.2)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div style={{display:'flex',alignItems:'center',gap:6}}><Ic n="funded" s={14} c="var(--grn)"/><span style={{fontSize:12,fontWeight:600,color:'var(--grn)'}}>Your Commission</span></div>
                      <div style={{textAlign:'right'}}><span style={{fontSize:18,fontWeight:700,color:'var(--grn)',fontFamily:'var(--mono)'}}>{f$(o.amount*o.commissionPct/100)}</span><span style={{fontSize:11,color:'var(--t2)',marginLeft:6}}>({o.commissionPct}%)</span></div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
        {!confirmed&&offers.length>0&&(
          <div className="mf">
            <button className="btn bg" onClick={onClose}>Cancel</button>
            <button className="btn bp" onClick={()=>{if(!sel)return;setConfirmed(true);onSelect(deal.id,sel)}} disabled={!sel} style={{opacity:sel?1:.4}}><Ic n="check" s={14}/>Confirm Selection</button>
          </div>
        )}
      </div>
    </div>
  );
}

function MerchantView({deal,onClose,onComplete}){
  const [ms,setMs]=useState(0);
  const steps=['Bank Connection','Identity Verification','Sign Agreement','Complete'];
  const content=[{title:'Connect Your Bank',sub:'Securely link your business bank account for transaction review.',action:'Connect via Plaid',icon:'bank'},{title:'Verify Your Identity',sub:'Verify the identity of all owners and guarantors. Have your ID ready.',action:'Start Identity Check',icon:'id'},{title:'Sign Your Agreement',sub:'Review and electronically sign your merchant cash advance agreement.',action:'Review & Sign',icon:'sign'},{title:'All Done!',sub:'Your application is complete and sent to our underwriting team.',action:null,icon:'check'}];
  const s=content[ms];
  const handleAction=()=>{if(ms===0)onComplete(deal.id,'bank');if(ms===1)onComplete(deal.id,'idv');if(ms===2)onComplete(deal.id,'sign');if(ms<3)setMs(x=>x+1)};
  return(
    <div className="mo" onClick={onClose}>
      <div className="md fa" onClick={e=>e.stopPropagation()}>
        <div className="mh"><div><div style={{fontSize:10,fontFamily:'var(--mono)',color:'var(--t3)',marginBottom:4}}>MERCHANT ONBOARDING · {deal.id}</div><div className="mt">{deal.business}</div><div className="ms">Complete all steps to finalize your advance</div></div><button className="btn bg bs" onClick={onClose}><Ic n="x" s={14}/></button></div>
        <div className="mb">
          <div className="spr">{steps.map((st,i)=><div key={st} className={'spi'+(i<ms?' dn':i===ms?' av':'')}><div className="spd">{i<ms?<Ic n="check" s={11} c="#fff"/>:i+1}</div><div className="spl">{st}</div></div>)}</div>
          <div style={{textAlign:'center',padding:'24px 0'}}>
            <div style={{width:60,height:60,borderRadius:'50%',background:'rgba(99,102,241,.1)',border:'1px solid rgba(99,102,241,.25)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}><Ic n={s.icon} s={26} c="var(--acc)"/></div>
            <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>{s.title}</div>
            <div style={{color:'var(--t2)',fontSize:13,maxWidth:320,margin:'0 auto'}}>{s.sub}</div>
          </div>
          {ms<3&&<div style={{textAlign:'center',paddingBottom:8}}><button className="btn bp" onClick={handleAction}><Ic n="chevron" s={14}/>{s.action}</button></div>}
        </div>
      </div>
    </div>
  );
}

function UWModal({deal,onClose,onDecide}){
  return(
    <div className="mo" onClick={onClose}>
      <div className="md md-lg fa" onClick={e=>e.stopPropagation()}>
        <div className="mh"><div><div style={{fontSize:10,fontFamily:'var(--mono)',color:'var(--t3)',marginBottom:4}}>FINAL UNDERWRITING · {deal.id}</div><div className="mt">{deal.business}</div><div className="ms">Review all data before making a decision</div></div><button className="btn bg bs" onClick={onClose}><Ic n="x" s={14}/></button></div>
        <div className="mb">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div>
              {deal.amount&&<div className="uf" style={{marginBottom:9}}><div className="ul">Offer Snapshot</div><div style={{fontSize:22,fontWeight:700,fontFamily:'var(--mono)',marginBottom:4}}>{f$(deal.amount)}</div><div style={{fontSize:12,color:'var(--t2)'}}>Payback: {f$(deal.payback)} · Factor: {fx(deal.factor)}</div><div style={{fontSize:12,color:'var(--t2)',marginTop:2}}>Term: {deal.termDays} days · {deal.positions===0?'Clean (0 positions)':deal.positions+' positions'}</div></div>}
              <div className="uf"><div className="ul">Risk Score</div><div style={{fontSize:22,fontWeight:700,fontFamily:'var(--mono)',color:rc(deal.risk||0)}}>{deal.risk!=null?deal.risk+' / 100':'Not scrubbed'}</div>{deal.risk!=null&&<div className="sbar" style={{marginTop:7}}><div className="sfill" style={{width:deal.risk+'%',background:rc(deal.risk)}}/></div>}</div>
            </div>
            <div>
              {[{l:'Monthly Revenue',v:f$(deal.monthlyRev),ok:deal.monthlyRev>=35000,i:'funded'},{l:'Avg Daily Balance',v:f$(deal.dailyBal),ok:deal.dailyBal>=1000,i:'bank'},{l:'Positions',v:deal.positions+' position'+(deal.positions!==1?'s':''),ok:deal.positions<3,i:'filter'},{l:'NY Courts',v:deal.nyCourt||'Pending',ok:deal.nyCourt==='clean',i:'id'}].map(({l,v,ok,i})=>(
                <div key={l} className="uf" style={{marginBottom:9}}><div className="ul">{l}</div><div style={{display:'flex',alignItems:'center',gap:8}}><Ic n={i} s={15} c={ok?'var(--grn)':'var(--t3)'}/><span style={{fontSize:13,fontWeight:600,color:ok?'var(--grn)':'var(--t2)'}}>{v}</span></div></div>
              ))}
            </div>
          </div>
          <div className="dvr"/>
          <div className="uf" style={{background:'rgba(245,158,11,.06)',borderColor:'rgba(245,158,11,.15)'}}>
            <div className="ul">Bank Statement Notes</div>
            {(deal.uwNotes||[]).filter(n=>n.author==='Document Parser'||n.cat==='system').slice(-1).map(n=><div key={n.id} style={{fontSize:12,color:'var(--t2)',lineHeight:1.5,marginBottom:8}}>{n.text.slice(0,300)}</div>)}
            <textarea className="fi" style={{marginTop:4}} rows={2} placeholder="Add final underwriting notes or conditions..."/>
          </div>
        </div>
        <div className="mf">
          <button className="btn bg" onClick={onClose}>Cancel</button>
          <button className="btn brd" onClick={()=>onDecide(deal.id,'declined')}><Ic n="x" s={14}/>Decline</button>
          <button className="btn bgn" onClick={()=>onDecide(deal.id,'approved')}><Ic n="check" s={14}/>Approve</button>
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
    <div className="mo" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="md md-lg fa">
        <div className="mh"><div><div className="mt">New Deal</div><div className="ms">Enter deal info manually</div></div><button className="btn bg bs" onClick={onClose}><Ic n="x" s={14}/></button></div>
        <div className="mb">
          <div className="spr">{['Merchant Info','Broker Info','Submit'].map((s,i)=><div key={s} className={'spi'+(i<step?' dn':i===step?' av':'')}><div className="spd">{i<step?<Ic n="check" s={11} c="#fff"/>:i+1}</div><div className="spl">{s}</div></div>)}</div>
          {step===0&&<div className="fa"><div className="fg"><div className="ff"><label className="fl">Business Name *</label><input className="fi" placeholder="Acme Corp LLC" value={f.business} onChange={e=>set('business',e.target.value)}/></div><div className="ff"><label className="fl">Contact Name</label><input className="fi" placeholder="John Smith" value={f.contact} onChange={e=>set('contact',e.target.value)}/></div><div className="ff"><label className="fl">Contact Email</label><input className="fi" placeholder="john@business.com" value={f.email} onChange={e=>set('email',e.target.value)}/></div><div className="ff"><label className="fl">Amount Requested</label><input className="fi" type="number" placeholder="50000" value={f.requested} onChange={e=>set('requested',e.target.value)}/></div></div><div className="ff" style={{marginTop:4}}><label className="fl">Notes / Context</label><textarea className="fi" placeholder="Industry, positions, context..." value={f.notes} onChange={e=>set('notes',e.target.value)}/></div></div>}
          {step===1&&<div className="fa"><div className="ff" style={{marginBottom:12}}><label className="fl">Broker / ISO Name *</label><input className="fi" placeholder="Capital Partners LLC" value={f.broker} onChange={e=>set('broker',e.target.value)}/></div></div>}
          {step===2&&<div className="fa"><div className="uf" style={{marginBottom:12}}><div className="ul">Summary</div><div style={{fontSize:15,fontWeight:700}}>{f.business}</div><div style={{fontSize:12,color:'var(--t2)',marginTop:3}}>Broker: {f.broker} · Requested: {f.requested?f$(parseInt(f.requested)):'TBD'}</div></div><p style={{fontSize:13,color:'var(--t3)'}}>Deal will be created in New status. Run AI Scrub after uploading bank statements.</p></div>}
        </div>
        <div className="mf">
          {step>0&&<button className="btn bg" onClick={()=>setStep(s=>s-1)}>Back</button>}
          <button className="btn bg" onClick={onClose}>Cancel</button>
          {step<2&&<button className="btn bp" onClick={()=>setStep(s=>s+1)} disabled={step===0&&!f.business||step===1&&!f.broker}>Next <Ic n="chevron" s={13}/></button>}
          {step===2&&<button className="btn bgn" onClick={save}><Ic n="check" s={13}/>Create Deal</button>}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app-load')).render(React.createElement(App));
      `}</script>
    </>
  );
}
