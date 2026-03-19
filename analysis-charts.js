/* =============================================
   Yoma'z Data — analysis-charts.js
   Global Tech Layoffs 2020–2025
   Harrison Onigba · Data Analyst
   ============================================= */

window.addEventListener('DOMContentLoaded', () => {
  const fill = document.getElementById('loaderFill');
  const text = document.getElementById('loaderText');
  const loader = document.getElementById('loader');
  const msgs = ['Parsing 2,412 records...','Running ETL pipeline...','Rendering 12 charts...','Welcome!'];
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 18 + 8;
    if (p >= 100) { p = 100; clearInterval(iv); }
    fill.style.width = p + '%';
    text.textContent = msgs[Math.min(Math.floor(p/26),3)];
    if (p === 100) setTimeout(() => { loader.classList.add('hidden'); initAll(); }, 400);
  }, 120);
});

function initAll() {
  initCursor(); initNav(); initMobileMenu(); initAOS(); initCharts();
}

function initCursor() {
  const cur = document.getElementById('cursor');
  const fol = document.getElementById('cursorFollower');
  if (!cur) return;
  let mx=0,my=0,fx=0,fy=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
  function af(){fx+=(mx-fx)*.12;fy+=(my-fy)*.12;fol.style.left=fx+'px';fol.style.top=fy+'px';requestAnimationFrame(af);}
  af();
  document.querySelectorAll('a,button,.bento-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{cur.style.transform='translate(-50%,-50%) scale(2)';fol.style.transform='translate(-50%,-50%) scale(0.6)';});
    el.addEventListener('mouseleave',()=>{cur.style.transform='translate(-50%,-50%) scale(1)';fol.style.transform='translate(-50%,-50%) scale(1)';});
  });
}

function initNav() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 50); }, {passive:true});
}

function initMobileMenu() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  btn.addEventListener('click', () => { btn.classList.toggle('open'); menu.classList.toggle('open'); });
  document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', () => { btn.classList.remove('open'); menu.classList.remove('open'); }));
}

function initAOS() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('aos-animate'); io.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('[data-aos]').forEach(el => {
    el.style.transitionDelay = (el.dataset.aosDelay || 0) + 'ms';
    io.observe(el);
  });
}

function initCharts() {
  const T   = '#14a8ad';
  const T2  = '#0d7377';
  const T3  = 'rgba(20,168,173,0.35)';
  const T4  = 'rgba(20,168,173,0.15)';
  const R   = '#e8533a';
  const R2  = 'rgba(232,83,58,0.55)';
  const AMB = '#f0a500';
  const AMB2= 'rgba(240,165,0,0.45)';
  const GR  = 'rgba(255,255,255,0.05)';
  const TX  = '#8fa3b8';

  Chart.defaults.color = TX;
  Chart.defaults.font.family = "'Space Grotesk', sans-serif";

  const base = { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, animation:{duration:1000,easing:'easeOutQuart'} };
  const scX  = { grid:{display:false}, border:{display:false}, ticks:{font:{size:10},color:TX} };
  const scY  = { grid:{color:GR,lineWidth:0.5}, border:{display:false}, ticks:{font:{size:10},color:TX} };
  const scYK = { ...scY, ticks:{...scY.ticks, callback:v=>v>=1000?(v/1000).toFixed(0)+'K':v} };

  /* BQ1 — Annual */
  new Chart(document.getElementById('yearChart'), {
    type:'bar',
    data:{ labels:['2020','2021','2022','2023','2024','2025'],
      datasets:[{ data:[61529,6790,127577,176946,173522,200445],
        backgroundColor:['rgba(20,168,173,0.3)','rgba(20,168,173,0.2)',T3,T2,T,R],
        borderRadius:6, borderSkipped:false }] },
    options:{ ...base, scales:{x:scX, y:scYK},
      plugins:{...base.plugins, tooltip:{callbacks:{label:ctx=>' '+ctx.parsed.y.toLocaleString()+' layoffs'}}} }
  });

  /* BQ2 — Monthly */
  new Chart(document.getElementById('monthlyChart'), {
    type:'line',
    data:{ labels:['Mar-20','Apr-20','May-20','Jun-20','Jul-20','Aug-20','Sep-20','Oct-20','Nov-20','Dec-20','Jan-21','Feb-21','Apr-21','Jun-21','Aug-21','Sep-21','Nov-21','Dec-21','Jan-22','Feb-22','Mar-22','Apr-22','May-22','Jun-22','Jul-22','Aug-22','Sep-22','Oct-22','Nov-22','Dec-22','Jan-23','Feb-23','Mar-23','Apr-23','May-23','Jun-23','Jul-23','Aug-23','Sep-23','Oct-23','Nov-23','Dec-23','Jan-24','Feb-24','Mar-24','Apr-24','May-24','Jun-24','Jul-24','Aug-24','Sep-24','Oct-24','Nov-24','Dec-24','Jan-25','Feb-25','Mar-25','Apr-25','May-25','Jun-25','Jul-25','Aug-25','Sep-25','Oct-25','Nov-25','Dec-25'],
      datasets:[{ data:[7441,21864,21404,6092,2198,1853,339,110,189,120,516,332,160,2434,37,41,2070,1200,180,3385,4514,2506,11535,13444,10562,10769,4164,11114,49457,6182,66329,26000,29338,14681,9242,5771,4231,7298,2585,4026,2546,7081,34007,15512,7322,36844,11536,15987,9051,25724,3765,3569,5439,2268,2807,15830,9125,24545,10397,1306,29066,8956,21340,34124,40638,2311],
        borderColor:T, backgroundColor:'rgba(20,168,173,0.07)', fill:true, tension:0.4,
        pointRadius:2, pointHoverRadius:5, borderWidth:1.5 }] },
    options:{ ...base, scales:{x:{...scX,ticks:{...scX.ticks,maxRotation:45,maxTicksLimit:22}}, y:scYK} }
  });

  /* BQ3 — Industries 2024-2025 */
  new Chart(document.getElementById('industryChart'), {
    type:'bar',
    data:{ labels:['Hardware','Software Dev','E-commerce','Finance','Consumer','IT Services','Motor Vehicle','Retail','Infrastructure','Healthcare'],
      datasets:[{ data:[53372,33534,30874,19985,14497,13019,10020,9784,8738,7850], backgroundColor:T, borderRadius:4, barThickness:14 }] },
    options:{ ...base, indexAxis:'y', scales:{x:scYK, y:{...scY,grid:{display:false}}} }
  });

  /* BQ4 — Countries */
  new Chart(document.getElementById('countryChart'), {
    type:'bar',
    data:{ labels:['USA','India','Germany','Sweden','UK','Canada','Israel','Ireland','Japan','Brazil'],
      datasets:[{ data:[541854,55212,28933,17201,17078,14195,14000,12191,9298,7029],
        backgroundColor:[R,T,T2,T3,T3,T4,T4,T4,T4,T4], borderRadius:4 }] },
    options:{ ...base, scales:{x:{...scX,ticks:{...scX.ticks,maxRotation:35,font:{size:9}}}, y:scYK} }
  });

  /* BQ5 — 2020 industries */
  new Chart(document.getElementById('ind2020Chart'), {
    type:'bar',
    data:{ labels:['Transportation','Retail','Travel','Consumer','Food','Real Estate','Finance','Other'],
      datasets:[{ data:[13606,7615,5714,4847,4126,2900,2832,2721], backgroundColor:AMB2, borderRadius:4, barThickness:14 }] },
    options:{ ...base, indexAxis:'y', scales:{x:scYK, y:{...scY,grid:{display:false}}} }
  });

  /* BQ5 — 2025 industries */
  new Chart(document.getElementById('ind2025Chart'), {
    type:'bar',
    data:{ labels:['E-commerce','Software Dev','Hardware','Consumer','Finance','IT Services','Real Estate','Other'],
      datasets:[{ data:[30874,27024,26558,14232,12199,9876,6820,5632], backgroundColor:R2, borderRadius:4, barThickness:14 }] },
    options:{ ...base, indexAxis:'y', scales:{x:scYK, y:{...scY,grid:{display:false}}} }
  });

  /* BQ6 — Stage donut */
  const stL=['Post-IPO','Unknown','Acquired','Series B','Series D','Series C','Series E','Private Eq.'];
  const stD=[375854,206925,35535,25036,22329,18491,17830,8652];
  const stC=[T,AMB,R,T3,AMB2,R2,'rgba(20,168,173,0.2)','#334155'];
  const stTotal=stD.reduce((a,b)=>a+b,0);
  const sLeg=document.getElementById('stageLegend');
  if(sLeg) sLeg.innerHTML=stL.map((l,i)=>`<span style="display:inline-flex;align-items:center;gap:4px;font-size:10px;color:#8fa3b8;font-family:'JetBrains Mono',monospace"><span style="width:7px;height:7px;border-radius:2px;background:${stC[i]};flex-shrink:0"></span>${l} ${Math.round(stD[i]/stTotal*100)}%</span>`).join('');
  new Chart(document.getElementById('stageChart'), {
    type:'doughnut',
    data:{ labels:stL, datasets:[{ data:stD, backgroundColor:stC, borderWidth:0, hoverOffset:6 }] },
    options:{ ...base, cutout:'60%', plugins:{legend:{display:false}, tooltip:{callbacks:{label:ctx=>' '+ctx.label+': '+ctx.parsed.toLocaleString()}}} }
  });

  /* BQ7 — Avg % by stage */
  new Chart(document.getElementById('stagePctChart'), {
    type:'bar',
    data:{ labels:['Seed','Series A','Series B','Private Eq.','Acquired','Series C','Series D','Post-IPO'],
      datasets:[{ data:[48.2,38.9,34.1,31.9,31.9,28.4,24.8,16.3],
        backgroundColor:[R,R,AMB,AMB,T2,T2,T,T], borderRadius:4 }] },
    options:{ ...base, scales:{x:scX, y:{...scY,ticks:{...scY.ticks,callback:v=>v+'%'}}} }
  });

  /* BQ8 — Top companies */
  new Chart(document.getElementById('companyChart'), {
    type:'bar',
    data:{ labels:['Amazon','Intel','Microsoft','Meta','Tesla','Verizon','Google','Cisco','TCS','SAP'],
      datasets:[{ data:[72244,42953,31937,25350,20520,15000,13982,13950,12365,11000], backgroundColor:R, borderRadius:4, barThickness:14 }] },
    options:{ ...base, indexAxis:'y', scales:{x:scYK, y:{...scY,grid:{display:false}}} }
  });

  /* BQ9 — Repeat rounds */
  new Chart(document.getElementById('repeatChart'), {
    type:'bar',
    data:{ labels:['Google','Amazon','Microsoft','Intel','Meta','eBay','Chegg','Rivian','Redfin','Swiggy'],
      datasets:[{ data:[16,16,13,10,8,7,7,7,7,6],
        backgroundColor:[R,R,AMB,AMB,T,T,T2,T2,T3,T3], borderRadius:4, barThickness:14 }] },
    options:{ ...base, indexAxis:'y', scales:{x:{...scX,ticks:{...scX.ticks,stepSize:2}}, y:{...scY,grid:{display:false}}} }
  });

  /* BQ10 — Continents */
  new Chart(document.getElementById('continentChart'), {
    type:'doughnut',
    data:{ labels:['North America','Asia','Europe','South America','Oceania','Africa'],
      datasets:[{ data:[556319,92045,82623,8001,4189,3632], backgroundColor:[T,AMB,R,T2,AMB2,R2], borderWidth:0, hoverOffset:6 }] },
    options:{ ...base, cutout:'50%',
      plugins:{ legend:{display:true,position:'bottom',labels:{font:{size:9},color:TX,boxWidth:10,padding:6}},
      tooltip:{callbacks:{label:ctx=>' '+ctx.label+': '+ctx.parsed.toLocaleString()}} } }
  });

  /* BQ11 — 2024 vs 2025 */
  new Chart(document.getElementById('yvyChart'), {
    type:'bar',
    data:{ labels:['Hardware','Software Dev','E-commerce','Motor Vehicle','Finance','Consumer','IT Services','Retail','Infrastructure','Healthcare'],
      datasets:[
        {label:'2024',data:[26814,6610,0,20020,13331,13247,8190,10215,7621,5420],backgroundColor:T3,borderRadius:3,barThickness:10},
        {label:'2025',data:[26558,27024,30874,0,12199,14232,9876,9784,8738,7850],backgroundColor:R,borderRadius:3,barThickness:10}
      ] },
    options:{ ...base,
      plugins:{ legend:{display:true,labels:{font:{size:10},color:TX,boxWidth:10,padding:12}} },
      scales:{ x:{...scX,ticks:{...scX.ticks,maxRotation:35,font:{size:9}}}, y:scYK } }
  });

  /* BQ12 — Economic cost */
  new Chart(document.getElementById('costChart'), {
    type:'bar',
    data:{ labels:['Consumer','Retail','Hardware','Other','Software Dev','Transportation','Finance','Food','E-commerce','IT Services'],
      datasets:[{ data:[5251,4975,4867,4631,3491,3438,3429,3121,2470,1765],
        backgroundColor:(ctx)=>{ const v=ctx.parsed.x; return v>=4000?R:v>=2500?AMB:T; },
        borderRadius:4 }] },
    options:{ ...base, indexAxis:'y',
      scales:{ x:{...scY,ticks:{...scY.ticks,callback:v=>'$'+v+'M'}}, y:{...scY,grid:{display:false}} },
      plugins:{...base.plugins, tooltip:{callbacks:{label:ctx=>' $'+ctx.parsed.x.toLocaleString()+'M estimated cost'}}} }
  });
}
