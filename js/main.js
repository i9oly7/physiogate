/* =========================================================
   Physio Gate — main.js
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1) شاشة البداية (Preloader) ---------- */
  const preloader = document.getElementById('preloader');

  // نقفل التمرير فقط لو في شاشة بداية فعلًا.
  // الصفحات الداخلية (join.html) ما فيها preloader — لازم تنزل عادي.
  if (preloader) document.body.classList.add('is-locked');

  function hidePreloader() {
    // فك قفل التمرير دائمًا، حتى لو ما في preloader
    document.body.classList.remove('is-locked');
    if (!preloader) return;

    preloader.classList.add('is-done');
    // تشغيل حركات الهيرو بعد اختفاء الشعار
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('is-visible'));
    setTimeout(() => preloader.remove(), 800);
  }

  // أقل مدة للعرض 1.9 ثانية، أو بعد تحميل الصفحة — أيهما أطول
  const MIN_TIME = 1900;
  const started = Date.now();
  window.addEventListener('load', () => {
    const wait = Math.max(0, MIN_TIME - (Date.now() - started));
    setTimeout(hidePreloader, wait);
  });
  // أمان: لا تتجاوز 5 ثوانٍ مهما حصل
  setTimeout(hidePreloader, 5000);


  /* ---------- 2) الهيدر: خلفية عند النزول ---------- */
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');

  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('is-stuck', y > 40);

    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ---------- 3) قائمة الجوال ---------- */
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');

  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      document.body.classList.toggle('is-locked', open);
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('is-open');
        burger.classList.remove('is-open');
        document.body.classList.remove('is-locked');
      });
    });
  }


  /* ---------- 4) ظهور العناصر عند التمرير ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }


  /* ---------- 5) عدّاد الأرقام في الهيرو ---------- */
  const counters = document.querySelectorAll('[data-count]');

  function runCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const loc = document.documentElement.lang === 'en' ? 'en' : 'ar-EG';
      el.textContent = Math.round(target * eased).toLocaleString(loc);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => cio.observe(c));
  }


  /* ---------- 6) تبويبات اللجان (الأعضاء) ---------- */
  const tabsWrap = document.getElementById('memberTabs');

  if (tabsWrap) {
    const tabs = tabsWrap.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.members');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        const key = tab.dataset.tab;
        panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === key));
      });
    });
  }


  /* ---------- 7) سحب معرض صور الفعاليات بالماوس ---------- */
  document.querySelectorAll('.gallery').forEach(gal => {
    const track = gal.querySelector('.gallery__track');
    if (!track) return;

    let down = false, startX = 0, startScroll = 0;

    track.addEventListener('pointerdown', (e) => {
      down = true;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      gal.classList.add('is-dragging');
      track.setPointerCapture(e.pointerId);
    });

    track.addEventListener('pointermove', (e) => {
      if (!down) return;
      track.scrollLeft = startScroll - (e.clientX - startX) * 1.2;
    });

    const end = (e) => {
      down = false;
      gal.classList.remove('is-dragging');
      if (e.pointerId !== undefined && track.hasPointerCapture?.(e.pointerId)) {
        track.releasePointerCapture(e.pointerId);
      }
    };
    track.addEventListener('pointerup', end);
    track.addEventListener('pointercancel', end);
    track.addEventListener('pointerleave', end);

    // تمرير أفقي بعجلة الماوس
    track.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        track.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  });


  /* ---------- 8) تمرير ناعم مع مراعاة ارتفاع الهيدر ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const offset = (nav ? nav.offsetHeight : 0) + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ---------- 9) تمييز القسم الحالي في القائمة (Scroll Spy) ---------- */
  const spyLinks = Array.from(
    document.querySelectorAll('.nav__links a[href^="#"]:not(.nav__cta)')
  );
  const spyMap = new Map();

  spyLinks.forEach(a => {
    const sec = document.querySelector(a.getAttribute('href'));
    if (sec) spyMap.set(sec, a);
  });

  if ('IntersectionObserver' in window && spyMap.size) {
    const visible = new Set();

    const spy = new IntersectionObserver((entries) => {
      entries.forEach(e => e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));

      // اختر أعلى قسم ظاهر حاليًا
      let top = null;
      visible.forEach(sec => {
        if (!top || sec.offsetTop < top.offsetTop) top = sec;
      });

      spyLinks.forEach(a => a.classList.remove('is-current'));
      if (top && spyMap.has(top)) spyMap.get(top).classList.add('is-current');
    }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });

    spyMap.forEach((_, sec) => spy.observe(sec));
  }


  /* ---------- 10) العدّاد التنازلي للفعالية القادمة ---------- */
  const cd = document.getElementById('countdown');

  if (cd) {
    const clock   = cd.querySelector('[data-cd-clock]');
    const msgEl   = cd.querySelector('[data-cd-msg]');
    const btn     = cd.querySelector('.countdown__btn');
    const titleEl = cd.querySelector('[data-cd-title]');
    const placeEl = cd.querySelector('[data-cd-place]');
    const chip    = cd.querySelector('.chip--live');

    const units = {
      days:    cd.querySelector('[data-cd="days"]'),
      hours:   cd.querySelector('[data-cd="hours"]'),
      minutes: cd.querySelector('[data-cd="minutes"]'),
      seconds: cd.querySelector('[data-cd="seconds"]')
    };

    // نصوص العربي والإنجليزي
    const isEN = (cd.dataset.locale || document.documentElement.lang) === 'en';
    const T = isEN ? {
      fallbackTitle: 'Upcoming event',
      tbaTitle:      'Stay tuned',
      tbaMsg:        'The next Physio Gate event will be announced soon.',
      tbaChip:       'Coming soon',
      liveMsg:       'The event has started! Follow our channels for details.',
      liveChip:      'Live now',
      locale:        'en-GB'
    } : {
      fallbackTitle: 'فعالية قادمة',
      tbaTitle:      'ترقّبوا الإعلان',
      tbaMsg:        'سيتم الإعلان عن الفعالية القادمة في مجتمع Physio Gate قريبًا.',
      tbaChip:       'قريبًا',
      liveMsg:       'انطلقت الفعالية! تابع حساباتنا لمعرفة التفاصيل.',
      liveChip:      'جارية الآن',
      locale:        'ar-SA'
    };

    const raw    = (cd.dataset.date || '').trim();
    const target = raw ? new Date(raw) : null;
    const valid  = target && !isNaN(target.getTime());

    titleEl.textContent = cd.dataset.title || T.fallbackTitle;
    placeEl.textContent = cd.dataset.place || '';

    function idle(text, chipText) {
      clock.hidden = true;
      msgEl.hidden = false;
      msgEl.textContent = text;
      if (chipText) chip.textContent = chipText;
      if (btn) btn.hidden = true;
    }

    if (!valid) {
      // ما فيه تاريخ محدد بعد
      titleEl.textContent = T.tbaTitle;
      placeEl.textContent = '';
      idle(T.tbaMsg, T.tbaChip);

    } else {
      const pad = n => String(n).padStart(2, '0');

      const tick = () => {
        const diff = target.getTime() - Date.now();

        if (diff <= 0) {
          clearInterval(timer);
          idle(T.liveMsg, T.liveChip);
          return;
        }

        const s = Math.floor(diff / 1000);
        units.days.textContent    = pad(Math.floor(s / 86400));
        units.hours.textContent   = pad(Math.floor(s % 86400 / 3600));
        units.minutes.textContent = pad(Math.floor(s % 3600 / 60));
        units.seconds.textContent = pad(s % 60);
      };

      tick();
      const timer = setInterval(tick, 1000);

      // تاريخ مقروء تحت العنوان
      try {
        const fmt = new Intl.DateTimeFormat(T.locale, {
          dateStyle: 'full', timeStyle: 'short'
        }).format(target);
        placeEl.textContent = (cd.dataset.place ? cd.dataset.place + ' · ' : '') + fmt;
      } catch (e) { /* المتصفح ما يدعم — نخلي النص الأصلي */ }
    }
  }


  /* ---------- 11) سنة الفوتر ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

})();
