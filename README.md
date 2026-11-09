# Physio Gate — الموقع الرسمي

موقع تعريفي لمجتمع **Physio Gate** للعلاج الطبيعي.
HTML + CSS + JavaScript فقط — بدون أي مكتبات، يشتغل مباشرة على GitHub Pages.

---

## 📁 هيكل المشروع

```
physiogate/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── logo.webp              ← الشعار (موجود)
│   ├── founders/              ← صور المؤسسين
│   │   ├── khaled-yaseen.jpg
│   │   ├── aseel-mohammed.jpg
│   │   ├── rafal-karmo.jpg
│   │   └── abdullah-alghamdi.jpg
│   ├── events/world-cup/      ← صور فعالية كأس العالم
│   │   ├── 1.jpg  2.jpg  3.jpg  4.jpg
│   ├── partners/              ← شعارات الشركاء (PNG شفاف)
│   │   └── partner-1.png ... partner-6.png
│   └── members/               ← (اختياري) صور الأعضاء
└── README.md
```

> الصور المفقودة ما راح تكسر الموقع، بس لازم تضيفها علشان يطلع بشكله النهائي.
> **مقاسات مقترحة:** المؤسسين 900×1200 (عمودي)، الفعاليات 1200×900، الشركاء 400×200 PNG شفاف.

---

## ⚡ ثلاث خطوات لازم تسويها قبل النشر

### 1) تفعيل استمارة الانضمام

الموقع على GitHub Pages بدون سيرفر، فنستخدم خدمة مجانية تستقبل النموذج وترسله لبريدك:

1. ادخل [formspree.io](https://formspree.io) وسجّل بالمجاني
2. اضغط **New Form** وحط بريدك
3. بينعطيك رابط شكله `https://formspree.io/f/abcdwxyz`
4. افتح `js/form.js` والصق الرابط في أول سطر إعداد:

```js
const ENDPOINT = 'https://formspree.io/f/abcdwxyz';
```

> قبل ما تحطه، النموذج يشتغل **وضع تجريبي**: يتحقق من البيانات ويعرض رسالة النجاح
> بدون ما يرسل شي (البيانات تطلع في Console).

### 2) ✅ روابط الموقع — تمّت

كل الروابط مضبوطة على:
`https://i9oly7.github.io/physiogate/`

> لو ربطت نطاقًا خاصًا لاحقًا، ابحث عن `i9oly7.github.io/physiogate`
> وبدّله في: `index.html` · `join.html` · `en/index.html` · `en/join.html` ·
> `sitemap.xml` · `robots.txt`

### 3) صورة المشاركة og-cover.png

سوّ صورة **1200×630** فيها الشعار واسم المجتمع، وسمّها `assets/og-cover.png`.
هذي اللي تظهر لما ينرسل رابط الموقع في واتساب أو تويتر أو لينكدإن.

---

## 🌍 النسخة الإنجليزية

| الصفحة | عربي | إنجليزي |
|---|---|---|
| الرئيسية | `index.html` | `en/index.html` |
| الانضمام | `join.html` | `en/join.html` |

زر `EN` / `العربية` في البار ينقل بينهم.

> **مهم:** أي تعديل على محتوى الصفحة العربية، سوّ نفسه في الإنجليزية
> عشان النسختين ما تتفرقان.

---

## ⏱ العدّاد التنازلي

في `index.html` و `en/index.html` ابحث عن `id="countdown"` وعدّل:

```html
data-date="2026-12-20T17:00"
data-title="ورشة التأهيل الرياضي"
data-place="جدة · يُعلن عن المقر قريبًا"
```

* الصيغة: `YYYY-MM-DDTHH:MM`
* **خلّ `data-date` فاضي** → يظهر "ترقّبوا الإعلان" تلقائيًا بدون عدّاد
* لما يخلص الوقت يتحول لـ "جارية الآن" لحاله
* حدّث التاريخ في **النسختين** عشان ما يختلفان

---

## ✏️ التعديلات اللي بتسويها

### 1) روابط لينكدإن للمؤسسين
✅ تمّت — حسابات المؤسسين الأربعة مربوطة في `index.html` و `en/index.html`.

### 🔵 الشعار (مهم)

ملف `assets/logo.webp` مقاسه **2000×1125** والرسمة صغيرة في نص الصورة،
فلو انعرض كما هو راح يطلع صغير جدًا أو كأنه مو ظاهر.
علشان كذا الشعار ينعرض عبر كلاس `.logo` في `styles.css` وهو يقصّه ويكبّره تلقائيًا.

لو طلع القص مو مضبوط، عدّل هالقيم فقط في أول تعريف `.logo`:

```css
--logo-zoom: 300%;  /* كبّره لو الرسمة طلعت صغيرة */
--logo-x:    50%;   /* حرّكه يمين / يسار */
--logo-y:    32%;   /* حرّكه فوق / تحت */
```

**الحل الأنظف:** صدّر الشعار مربّع ومقصوص على حدود الرسمة
(`512×512` PNG بخلفية شفافة)، سمّه `logo.png`، وبعدها في `styles.css`:

```css
.logo{
  --logo-src: url('../assets/logo.png');
  --logo-zoom: 100%;
  background-size: contain;
  background-position: center;
}
```

### 2) الأعضاء واللجان

حاليًا **41 عضوًا** موزعين كالتالي:

| اللجنة | `data-panel` | القائد/ة | العدد |
|---|---|---|---|
| المحتوى العلمي | `content` | مدى سعد القرني | 15 |
| الإعلام | `media` | رفال كرمو | 12 |
| العلاقات العامة | `pr` | أمين حاتم عبدالرحمن | 9 |
| التشغيل | `ops` | مزيد طارق الخطاف | 5 |

> لما تضيف أو تحذف عضو، لا تنسى تحدّث الرقم في زر اللجنة:
> `<button class="tab" data-tab="media">الإعلام <i>12</i></button>`
> والرقم في الهيرو: `<b data-count="41">`

#### الأيقونات

بدل صور الأعضاء نستخدم أيقونتين جاهزتين معرّفتين في أول `index.html`:

* `#av-m` → أيقونة شاب
* `#av-f` → أيقونة فتاة

#### بطاقة القائد/ة

القائد/ة يكون **أول بطاقة في لجنته**، ويأخذ كلاس `member--lead`
فيصير بعرض الصف كامل مع أيقونة أكبر وشارة ملونة:

```html
<article class="member member--lead">
  <span class="member__avatar"><svg><use href="#av-f"></use></svg></span>
  <div class="member__info">
    <span class="member__badge">قائدة اللجنة</span>
    <h3 class="member__name">الاسم</h3>
    <span class="member__role">اسم القسم</span>
  </div>
</article>
```

#### إضافة عضو جديد
داخل قسم الأعضاء، انسخ هذا القالب والصقه داخل اللجنة الصح
(`data-panel="pr"` العلاقات العامة · `media` الإعلام · `ops` التشغيل · `content` المحتوى العلمي):

```html
<article class="member">
  <span class="member__avatar"><svg><use href="#av-m"></use></svg></span>
  <h3 class="member__name">اسم العضو</h3>
  <span class="member__role">عضو</span>
</article>
```

بدّل `#av-m` بـ `#av-f` لو العضوة بنت، و`عضو` بـ `عضوة`.

### 3) الشركاء

الشركاء الحاليون (في `assets/partners/`):

| الملف | الشريك |
|---|---|
| `spta.png` | الجمعية السعودية للعلاج الطبيعي |
| `p-center.png` | عيادة نخبة الأخصائيين للرعاية الطبية — P. Center |
| `promising-start.png` | بداية واعد — Promising Start |

**لإضافة شريك جديد:** حط صورته في `assets/partners/`، ثم في `index.html`
داخل `#partners` أضف السطر التالي في **المجموعتين** (`logos__group`)
وفي **كل تكرار** داخلهما — علشان الحركة تضل سلسة بدون فراغات:

```html
<div class="logos__item"><img src="assets/partners/اسم-الملف.png" alt="اسم الشريك"></div>
```

> بطاقات الشركاء خلفيتها بيضاء لأن أغلب الشعارات خلفيتها بيضاء.
> لو عندك شعار PNG شفاف وتبيه على خلفية داكنة، غيّر `background:#fff`
> في `.logos__item` داخل `styles.css`.
>
> لتغيير سرعة الحركة: عدّل `45s` في `.logos__track`.

### 4) إضافة فعالية جديدة
انسخ بلوك `<article class="event">` كامل وبدّل العنوان والتاريخ والوصف والصور.

### 5) الألوان
كلها في أول `css/styles.css` تحت `:root` — غيّر `--green` و`--blue` و`--teal` وبيتغير الموقع كله.

---

## 💻 التشغيل محليًا (VS Code)

أسهل طريقة: ثبّت إضافة **Live Server** ثم اضغط يمين على `index.html` → *Open with Live Server*.

أو عبر الطرفية:

```bash
python -m http.server 5500
```

ثم افتح `http://localhost:5500`.

---

## 🚀 الرفع على GitHub + GitHub Pages

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Physio Gate website"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/i9oly7/physiogate.git
```

```bash
git push -u origin main
```

بعدها من صفحة المستودع: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
الموقع بيكون جاهز خلال دقيقة على:
`https://i9oly7.github.io/physiogate/`

---

## 🔎 ملفات الظهور في جوجل

| الملف | وش يسوي |
|---|---|
| `sitemap.xml` | خريطة الموقع — قدّمها في [Google Search Console](https://search.google.com/search-console) |
| `robots.txt` | يسمح لمحركات البحث بأرشفة الموقع ويدلّها على الخريطة |
| `404.html` | صفحة مخصصة بدل صفحة GitHub البيضاء |

وداخل `index.html` فيه **بيانات منظمة (JSON-LD)** تعرّف جوجل إن Physio Gate منظمة،
و**hreflang** يربط النسخة العربية بالإنجليزية عشان جوجل يعرض الصح لكل زائر.

بعد النشر: افتح Search Console، أضف الموقع، وقدّم رابط `sitemap.xml`.

---

## 🧩 الأقسام بالترتيب

1. شاشة البداية (الشعار)
2. الهيرو
3. 01 عن المجتمع
4. 02 الرؤية
5. 03 الرسالة
6. 04 المؤسسون (لينكدإن عند مرور الماوس)
7. 05 المجتمع / المسارات
8. 06 لماذا Physio Gate
9. 07 الفرص
10. 08 الأعضاء واللجان
11. 09 الفعاليات
12. 10 مركز المعرفة
13. 11 الشركاء (شريط متحرك)
14. 12 أثرنا في القطاع الصحي
15. 13 مكانك في المجتمع
16. الفوتر
