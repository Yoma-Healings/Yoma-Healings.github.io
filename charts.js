/* =============================================
   Yoma'z Data — Charts + Interactions
   Harrison Onigba · Data Analyst
   ============================================= */

/* ── Loader ── */
window.addEventListener('DOMContentLoaded', () => {
  const fill = document.getElementById('loaderFill');
  const text = document.getElementById('loaderText');
  const loader = document.getElementById('loader');
  const msgs = ['Parsing dataset...', 'Generating charts...', 'Almost ready...', 'Welcome!'];
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 18 + 8;
    if (p >= 100) { p = 100; clearInterval(iv); }
    fill.style.width = p + '%';
    text.textContent = msgs[Math.min(Math.floor(p / 26), 3)];
    if (p === 100) setTimeout(() => { loader.classList.add('hidden'); initAll(); }, 400);
  }, 120);
});

function initAll() {
  initCursor();
  initNav();
  initTypewriter();
  initCounters();
  initAOS();
  initCharts();
  initSkillBars();
  initMobileMenu();
}

/* ── Custom Cursor ── */
function initCursor() {
  const cur = document.getElementById('cursor');
  const fol = document.getElementById('cursorFollower');
  if (!cur) return;
  let mx = 0, my = 0, fx = 0, fy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = mx + 'px'; cur.style.top = my + 'px'; });
  function animFol() { fx += (mx - fx) * 0.12; fy += (my - fy) * 0.12; fol.style.left = fx + 'px'; fol.style.top = fy + 'px'; requestAnimationFrame(animFol); }
  animFol();
  document.querySelectorAll('a,button,.kpi-card,.stat-card,.bento-card,.finding-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cur.style.transform = 'translate(-50%,-50%) scale(2)'; fol.style.transform = 'translate(-50%,-50%) scale(0.6)'; });
    el.addEventListener('mouseleave', () => { cur.style.transform = 'translate(-50%,-50%) scale(1)'; fol.style.transform = 'translate(-50%,-50%) scale(1)'; });
  });
}

/* ── Navbar Scroll ── */
function initNav() {
  const nav = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
    links.forEach(l => { l.classList.toggle('active', l.dataset.section === cur); });
  }, { passive: true });
}

/* ── Mobile Menu ── */
function initMobileMenu() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  btn.addEventListener('click', () => { btn.classList.toggle('open'); menu.classList.toggle('open'); });
  document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', () => { btn.classList.remove('open'); menu.classList.remove('open'); }));
}

/* ── Typewriter ── */
function initTypewriter() {
  const el = document.getElementById('roleText');
  if (!el) return;
  const words = ['Data Analyst', 'Python Developer', 'EDA Specialist', 'Data Storyteller'];
  let wi = 0, ci = 0, del = false;
  function tick() {
    const word = words[wi];
    el.textContent = del ? word.slice(0, ci--) : word.slice(0, ci++);
    if (!del && ci > word.length) { del = true; setTimeout(tick, 1800); return; }
    if (del && ci < 0) { del = false; wi = (wi + 1) % words.length; ci = 0; }
    setTimeout(tick, del ? 60 : 95);
  }
  tick();
}

/* ── Counter Anim ── */
function initCounters() {
  const cards = document.querySelectorAll('.stat-card');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const card = e.target;
      const target = +card.dataset.count;
      const numEl = card.querySelector('.count-num');
      if (!numEl) return;
      let start = 0;
      const dur = 1600;
      const step = timestamp => {
        if (!start) start = timestamp;
        const p = Math.min((timestamp - start) / dur, 1);
        numEl.textContent = Math.floor(p * target).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
        else numEl.textContent = target.toLocaleString();
      };
      requestAnimationFrame(step);
      io.unobserve(card);
    });
  }, { threshold: 0.5 });
  cards.forEach(c => io.observe(c));
}

/* ── AOS ── */
function initAOS() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('aos-animate'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-aos]').forEach((el, i) => {
    const delay = el.dataset.aosDelay || 0;
    el.style.transitionDelay = delay + 'ms';
    io.observe(el);
  });
}

/* ── Skill Bars ── */
function initSkillBars() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.skill-fill').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
      io.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  const block = document.querySelector('.skills-block');
  if (block) io.observe(block);
}

/* ── Charts ── */
function initCharts() {
  const TEAL      = '#14a8ad';
  const TEAL_DARK = '#0d7377';
  const TEAL_DIM  = 'rgba(20,168,173,0.35)';
  const GOLD      = '#f0a500';
  const RUST      = '#e8533a';
  const TEXT2     = '#8fa3b8';
  const GRID      = 'rgba(255,255,255,0.05)';

  Chart.defaults.color = TEXT2;
  Chart.defaults.font.family = "'Space Grotesk', sans-serif";

  const base = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    animation: { duration: 1200, easing: 'easeOutQuart' }
  };

  const scaleBase = {
    grid: { color: GRID, lineWidth: 0.5 },
    border: { display: false },
    ticks: { font: { size: 10 }, color: TEXT2 }
  };

  /* Monthly timeline */
  new Chart(document.getElementById('monthlyChart'), {
    type: 'line',
    data: {
      labels: ['Mar 20','Apr 20','May 20','Jun 20','Jul 20','Aug 20','Sep 20','Oct 20','Nov 20','Dec 20','Jan 21','Feb 21','Mar 21','Apr 21','Jun 21','Jul 21','Aug 21','Sep 21','Oct 21','Nov 21','Dec 21','Jan 22','Feb 22','Mar 22','Apr 22','May 22','Jun 22','Jul 22','Aug 22','Sep 22','Oct 22','Nov 22','Dec 22','Jan 23','Feb 23','Mar 23'],
      datasets: [{
        data: [9628,26710,25804,7627,7112,1969,609,450,237,852,6813,868,47,261,2434,80,1867,161,22,2070,1200,510,3685,5714,4128,12885,17394,16223,13055,5881,17406,53451,10329,84714,36493,4470],
        borderColor: TEAL, backgroundColor: 'rgba(20,168,173,0.08)',
        fill: true, tension: 0.4, pointRadius: 3,
        pointBackgroundColor: TEAL, pointHoverRadius: 6,
        pointHoverBackgroundColor: '#fff', borderWidth: 2
      }]
    },
    options: {
      ...base,
      scales: {
        x: { ...scaleBase, grid: { display: false }, ticks: { ...scaleBase.ticks, maxRotation: 45, maxTicksLimit: 18 } },
        y: { ...scaleBase, ticks: { ...scaleBase.ticks, callback: v => v >= 1000 ? (v/1000).toFixed(0)+'K' : v } }
      },
      plugins: {
        ...base.plugins,
        tooltip: { callbacks: { label: ctx => ' ' + ctx.parsed.y.toLocaleString() + ' layoffs' } }
      }
    }
  });

  /* Annual */
  new Chart(document.getElementById('yearChart'), {
    type: 'bar',
    data: {
      labels: ['2020','2021','2022','2023'],
      datasets: [{ data: [80998,15823,160661,125677], backgroundColor: [TEAL_DIM, TEAL_DIM, TEAL, 'rgba(20,168,173,0.65)'], borderRadius: 6, borderSkipped: false }]
    },
    options: {
      ...base,
      scales: {
        x: { ...scaleBase, grid: { display: false } },
        y: { ...scaleBase, ticks: { ...scaleBase.ticks, callback: v => (v/1000).toFixed(0)+'K' } }
      }
    }
  });

  /* Industry */
  new Chart(document.getElementById('industryChart'), {
    type: 'bar',
    data: {
      labels: ['Consumer','Retail','Other','Transport','Finance','Healthcare','Food','Real Estate'],
      datasets: [{ data: [44782,43613,36289,31248,28344,25953,22855,17565], backgroundColor: TEAL, borderRadius: 4, barThickness: 14 }]
    },
    options: {
      ...base, indexAxis: 'y',
      scales: {
        x: { ...scaleBase, ticks: { ...scaleBase.ticks, callback: v => (v/1000).toFixed(0)+'K' } },
        y: { ...scaleBase, grid: { display: false } }
      }
    }
  });

  /* Country */
  new Chart(document.getElementById('countryChart'), {
    type: 'bar',
    data: {
      labels: ['United States','India','Netherlands','Sweden','Brazil','Germany','UK','Canada'],
      datasets: [{
        data: [256559,35993,17220,11264,10391,8701,6398,6319],
        backgroundColor: ['#14a8ad','rgba(20,168,173,0.8)','rgba(20,168,173,0.65)','rgba(20,168,173,0.55)','rgba(20,168,173,0.45)','rgba(20,168,173,0.38)','rgba(20,168,173,0.3)','rgba(20,168,173,0.22)'],
        borderRadius: 4, barThickness: 20
      }]
    },
    options: {
      ...base,
      scales: {
        x: { ...scaleBase, grid: { display: false }, ticks: { ...scaleBase.ticks, maxRotation: 35, font: { size: 9 } } },
        y: { ...scaleBase, ticks: { ...scaleBase.ticks, callback: v => v >= 1000 ? (v/1000).toFixed(0)+'K' : v } }
      }
    }
  });

  /* Companies */
  new Chart(document.getElementById('companyChart'), {
    type: 'bar',
    data: {
      labels: ['Amazon','Google','Meta','Salesforce','Philips','Microsoft','Ericsson','Uber','Dell','Booking.com'],
      datasets: [{ data: [18150,12000,11000,10090,10000,10000,8500,7585,6650,4601], backgroundColor: RUST, borderRadius: 4, barThickness: 14 }]
    },
    options: {
      ...base, indexAxis: 'y',
      scales: {
        x: { ...scaleBase, ticks: { ...scaleBase.ticks, callback: v => v >= 1000 ? (v/1000).toFixed(0)+'K' : v } },
        y: { ...scaleBase, grid: { display: false }, ticks: { ...scaleBase.ticks, font: { size: 10 } } }
      }
    }
  });

  /* Stage donut */
  const stageLegend = document.getElementById('stageLegend');
  const stageLabels = ['Post-IPO','Unknown','Acquired','Series C','Series D','Series B','Other'];
  const stageData   = [204132,40716,27576,20017,19225,15311,56682];
  const stageColors = ['#14a8ad','#f0a500','#e8533a','rgba(20,168,173,0.55)','rgba(240,165,0,0.55)','rgba(232,83,58,0.55)','#334155'];
  const total = stageData.reduce((a,b) => a+b, 0);
  if (stageLegend) {
    stageLegend.innerHTML = stageLabels.map((l,i) =>
      `<span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;color:#8fa3b8">
        <span style="width:8px;height:8px;border-radius:2px;background:${stageColors[i]};flex-shrink:0"></span>
        ${l} ${Math.round(stageData[i]/total*100)}%
      </span>`
    ).join('');
  }
  new Chart(document.getElementById('stageChart'), {
    type: 'doughnut',
    data: { labels: stageLabels, datasets: [{ data: stageData, backgroundColor: stageColors, borderWidth: 0, hoverOffset: 6 }] },
    options: {
      ...base, cutout: '60%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ' ' + ctx.label + ': ' + ctx.parsed.toLocaleString() } }
      }
    }
  });
}
