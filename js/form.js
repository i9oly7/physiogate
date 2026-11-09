/* =========================================================
   Physio Gate — form.js
   منطق استمارة الانضمام: تحقق + إرسال
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     ⚙️  الإعداد الوحيد المطلوب منك
     ---------------------------------------------------------
     الموقع مستضاف على GitHub Pages (بدون سيرفر)، فنستخدم خدمة
     مجانية تستقبل النموذج وترسله لبريدك.

     الخطوات:
       1) ادخل https://formspree.io وسجّل بالمجاني
       2) اضغط New Form وحط بريدك
       3) بينعطيك رابط شكله: https://formspree.io/f/abcdwxyz
       4) الصق الرابط بين علامتي التنصيص تحت

     لين تحطه، النموذج يشتغل في وضع تجريبي:
     يتحقق من البيانات ويعرض رسالة النجاح بدون ما يرسل شي.
     --------------------------------------------------------- */
  const ENDPOINT = 'https://formspree.io/f/xvkknbrw';   // ← الصق رابط Formspree هنا

  const form = document.getElementById('joinForm');
  if (!form) return;

  const done      = document.getElementById('formDone');
  const submitBtn = document.getElementById('submitBtn');
  const roleSel   = document.getElementById('role');
  const levelWrap = document.getElementById('levelField');
  const levelSel  = document.getElementById('level');
  const majorWrap = document.getElementById('majorField');
  const majorInp  = document.getElementById('major');

  /* ---------- 1) الحقول الشرطية ----------
     نقرأ data-kind من الخيار المختار — يشتغل في النسختين
     العربية والإنجليزية بنفس الكود:
       student        → طالب علاج طبيعي       → يظهر: المستوى الدراسي
       student-other  → طالب في مجال صحي آخر  → يظهر: المستوى + التخصص
       non-pt         → ممارس صحي (غير ع.ط)   → يظهر: التخصص فقط
       (بدون kind)    → أخصائي / استشاري / أكاديمي / باحث → ما يظهر شي
  ------------------------------------------------------------- */
  function syncConditional() {
    const opt  = roleSel.selectedOptions[0];
    const kind = opt ? (opt.dataset.kind || '') : '';

    const isStudent = kind === 'student' || kind === 'student-other';
    // التخصص لكل من تخصصه غير العلاج الطبيعي
    const showMajor = kind === 'student-other' || kind === 'non-pt';

    // المستوى الدراسي — للطلاب فقط
    levelWrap.hidden  = !isStudent;
    levelSel.required = isStudent;
    if (!isStudent) { levelSel.value = ''; clearError(levelSel); }

    // التخصص — اختياري، يظهر لغير تخصص العلاج الطبيعي
    majorWrap.hidden = !showMajor;
    if (!showMajor) { majorInp.value = ''; clearError(majorInp); }
  }
  roleSel.addEventListener('change', syncConditional);
  syncConditional();


  /* ---------- 2) رسائل التحقق (عربي / إنجليزي) ---------- */
  const EN = document.documentElement.lang === 'en';
  const MSG = EN ? {
    required: 'This field is required',
    fullname: 'Please enter your full name (at least three parts)',
    chars:    'The name contains invalid characters',
    email:    'Please enter a valid email address',
    phone:    'Mobile number must start with 05 and be 10 digits',
    consent:  'You need to agree before submitting',
    failed:   'Something went wrong. Please try again or contact us directly.'
  } : {
    required: 'هذا الحقل مطلوب',
    fullname: 'اكتب الاسم الثلاثي كاملًا',
    chars:    'الاسم يحتوي على رموز غير صالحة',
    email:    'البريد الإلكتروني غير صحيح',
    phone:    'رقم الجوال لازم يبدأ بـ 05 ويكون 10 أرقام',
    consent:  'لازم توافق قبل الإرسال',
    failed:   'صار خطأ أثناء الإرسال. جرّب مرة ثانية أو راسلنا مباشرة.'
  };

  function messageFor(el) {
    const v = el.value.trim();

    if (el.hasAttribute('required') && !v && el.type !== 'checkbox') {
      return MSG.required;
    }

    if (el.id === 'fullname' && v) {
      const parts = v.split(/\s+/).filter(Boolean);
      if (parts.length < 3) return MSG.fullname;
      if (!/^[؀-ۿ\s'-]+$/.test(v) && !/^[A-Za-z\s'-]+$/.test(v)) {
        return MSG.chars;
      }
    }

    if (el.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      return MSG.email;
    }

    if (el.id === 'phone' && v && !/^05\d{8}$/.test(v)) {
      return MSG.phone;
    }

    return '';
  }

  function showError(el, msg) {
    el.classList.add('is-invalid');
    el.setAttribute('aria-invalid', 'true');
    const slot = el.closest('.field')?.querySelector('[data-err]');
    if (slot) slot.textContent = msg;
  }

  function clearError(el) {
    el.classList.remove('is-invalid');
    el.removeAttribute('aria-invalid');
    const slot = el.closest('.field')?.querySelector('[data-err]');
    if (slot) slot.textContent = '';
  }

  function validate(el) {
    const msg = messageFor(el);
    msg ? showError(el, msg) : clearError(el);
    return !msg;
  }

  /* التحقق أثناء الكتابة — بعد أول خطأ فقط */
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('blur', () => { if (el.type !== 'checkbox') validate(el); });
    el.addEventListener('input', () => { if (el.classList.contains('is-invalid')) validate(el); });
  });

  /* أرقام فقط في حقل الجوال */
  const phone = document.getElementById('phone');
  phone.addEventListener('input', () => {
    phone.value = phone.value.replace(/\D/g, '').slice(0, 10);
  });


  /* ---------- 3) الإرسال ---------- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // تحقق من كل الحقول الظاهرة
    let firstBad = null;
    form.querySelectorAll('input, select, textarea').forEach(el => {
      if (el.type === 'checkbox' || el.offsetParent === null) return;
      if (!validate(el) && !firstBad) firstBad = el;
    });

    // الموافقة
    const consent    = document.getElementById('consent');
    const consentErr = document.getElementById('consentErr');
    if (!consent.checked) {
      consentErr.textContent = MSG.consent;
      if (!firstBad) firstBad = consent;
    } else {
      consentErr.textContent = '';
    }

    if (firstBad) {
      firstBad.focus({ preventScroll: true });
      firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // حالة الإرسال
    submitBtn.disabled = true;
    submitBtn.classList.add('is-loading');

    const data = new FormData(form);
    data.append('_subject', EN ? 'New membership application — Physio Gate'
                               : 'طلب عضوية جديد — Physio Gate');

    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' }
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
      } else {
        // وضع تجريبي — لين تضيف رابط Formspree
        console.warn('[Physio Gate] ENDPOINT فاضي — النموذج في وضع تجريبي.');
        console.table(Object.fromEntries(data.entries()));
        await new Promise(r => setTimeout(r, 700));
      }

      form.hidden = true;
      done.hidden = false;
      done.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('is-loading');
      consentErr.textContent = MSG.failed;
      console.error(err);
    }
  });

})();
