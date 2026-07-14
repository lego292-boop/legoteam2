// ============================================================
// Team LEGO — site scripts (clean, readable, no obfuscation)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Theme (dark/light) ----------
  // الوضع الافتراضي داكن. التفضيل بيتحفظ محليًا في متصفح الزائر بس
  // (localStorage)، مفيش أي بيانات بترسل لأي سيرفر.
  const savedTheme = localStorage.getItem('lego_theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  }
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('lego_theme', isLight ? 'light' : 'dark');
    });
  }

  // ---------- Cookie consent ----------
  const cookieBanner = document.getElementById('cookie-banner');
  if (cookieBanner) {
    const consent = localStorage.getItem('lego_cookie_consent');
    if (!consent) {
      setTimeout(() => cookieBanner.classList.add('show'), 1200);
    }
    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('lego_cookie_consent', 'accepted');
        cookieBanner.classList.remove('show');
      });
    }
    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => {
        localStorage.setItem('lego_cookie_consent', 'rejected');
        cookieBanner.classList.remove('show');
      });
    }
  }

  // ---------- Init AOS (scroll animations) ----------
  if (window.AOS) {
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
  }

  // ---------- Header scroll effect ----------
  const header = document.querySelector('header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
  }

  // ---------- Active nav link on scroll ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const setActiveLink = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  // ---------- Mobile menu toggle ----------
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinksList = document.querySelector('.nav-links');
  if (menuBtn && navLinksList) {
    menuBtn.addEventListener('click', () => {
      navLinksList.classList.toggle('active');
      const icon = menuBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
    navLinksList.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinksList.classList.remove('active');
        const icon = menuBtn.querySelector('i');
        if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-times'); }
      });
    });
  }

  // ---------- Animated stat counters ----------
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1500;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toLocaleString('en-US') + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));
  }

  // ---------- FAQ accordion ----------
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ---------- Telegram popup ----------
  const popup = document.getElementById('telegram-popup');
  if (popup) {
    const alreadyShown = sessionStorage.getItem('tg_popup_shown');
    if (!alreadyShown) {
      setTimeout(() => {
        popup.classList.add('show');
        sessionStorage.setItem('tg_popup_shown', '1');
      }, 8000);
    }
  }

  // ---------- Particle background on hero canvas ----------
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const heroSection = canvas.closest('.hero') || canvas.parentElement;

    function resize() {
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function createParticles() {
      const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.5
      }));
    }
    createParticles();
    window.addEventListener('resize', createParticles);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 0, 0, 0.55)';
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      // connecting lines for nearby particles
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.12)';
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw();
    }
  }

  // ---------- Typed.js hero tagline (optional, safe no-op if lib missing) ----------
  const typedTarget = document.getElementById('typed-tagline');
  if (typedTarget && window.Typed) {
    new Typed('#typed-tagline', {
      strings: ['نخترق لنحمي.', 'نكشف الثغرات قبل غيرنا.', 'نؤمّن مستقبلك الرقمي.'],
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 1500,
      loop: true
    });
  }

  // ---------- Contact form (if present) — demo submit ----------
  const contactForm = document.getElementById('quote-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = document.getElementById('quote-msg');
      if (msg) {
        msg.textContent = 'تم استلام طلبك، هيتم التواصل معاك قريبًا عبر تيليجرام أو البريد الرسمي ✔';
        msg.classList.add('show');
      }
      contactForm.reset();
    });
  }

  // ============================================================
  // AI CHAT WIDGET
  // ============================================================
  //
  // دلوقتي بيرد بردود تجريبية بسيطة (Demo) عشان الشكل يشتغل فورًا
  // من غير أي سيرفر. عشان يتحول لمساعد ذكاء اصطناعي حقيقي (Claude):
  //
  // 1) لازم تعمل سيرفر بسيط (Node.js/Express مثلاً) يستقبل رسالة
  //    المستخدم، ويبعتها لـ Anthropic API بمفتاحك السري (الموجود
  //    عندك فقط على السيرفر، ومش موجود أبدًا في كود الموقع ده).
  //    مثال جاهز لملف السيرفر: server-example.js (اتبعتلك منفصل).
  //
  // 2) بعد ما السيرفر يبقى شغال ومرفوع على استضافة (Render, Railway,
  //    Vercel Functions...)، غيّر السطر ده تحت لعنوان السيرفر بتاعك:
  const AI_BACKEND_URL = 'https://YOUR-BACKEND-URL.example.com/api/chat';
  // 3) وغيّر USE_DEMO_MODE لـ false عشان يبطل يستخدم الردود التجريبية.
  const USE_DEMO_MODE = true;

  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatBody = document.getElementById('chat-body');
  const chatTyping = document.getElementById('chat-typing');

  function addChatMessage(text, sender) {
    const row = document.createElement('div');
    row.className = 'chat-msg ' + sender;
    const avatar = document.createElement('div');
    avatar.className = 'chat-avatar ' + (sender === 'bot' ? 'bot-avatar' : 'user-avatar');
    avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-shield-halved"></i>' : '<i class="fas fa-user"></i>';
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    row.appendChild(avatar);
    row.appendChild(bubble);
    chatBody.appendChild(row);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // ردود تجريبية بسيطة تعتمد على كلمات مفتاحية — مؤقتة لحد ما تربط AI حقيقي
  function getDemoReply(message) {
    const m = message.toLowerCase();
    if (m.includes('سعر') || m.includes('باقة') || m.includes('باقات') || m.includes('تكلفة')) {
      return 'عندنا 3 باقات: أساسية، احترافية، وباقة شركات. تقدر تشوف التفاصيل في قسم "باقاتنا" فوق، أو أبعتلك عرض سعر مخصص لو قولتلي طبيعة مشروعك.';
    }
    if (m.includes('اختراق') || m.includes('pentest') || m.includes('فحص')) {
      return 'خدمة اختبار الاختراق (Pentest) بتشمل محاكاة هجوم حقيقي على أنظمتك عشان نكتشف الثغرات قبل أي مهاجم فعلي، وبتاخد تقرير مفصل بالنتائج وخطوات الإصلاح.';
    }
    if (m.includes('تواصل') || m.includes('كلم') || m.includes('رقم') || m.includes('ايميل') || m.includes('بريد')) {
      return 'تقدر تتواصل معانا مباشرة عبر تيليجرام @Oap219، أو على البريد legoteam02@gmail.com، وهنرد عليك في أقرب وقت.';
    }
    if (m.includes('بوت') || m.includes('تلجرام')) {
      return 'بنبرمج بوتات تيليجرام احترافية بأنظمة حماية وتحكم كاملة، تقدر تشوف أمثلة في قسم "المشاريع" فوق.';
    }
    return 'شكرًا لسؤالك! ده رد تجريبي حاليًا. اسألني عن الباقات، الخدمات، أو طريقة التواصل، أو كلّم فريقنا مباشرة من قسم "تواصل معنا".';
  }

  async function sendToBackend(message) {
    const response = await fetch(AI_BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (!response.ok) throw new Error('Backend error');
    const data = await response.json();
    return data.reply;
  }

  if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (!message) return;

      addChatMessage(message, 'user');
      chatInput.value = '';
      chatTyping.style.display = 'flex';
      chatBody.scrollTop = chatBody.scrollHeight;

      let reply;
      try {
        if (USE_DEMO_MODE) {
          await new Promise(r => setTimeout(r, 700 + Math.random() * 500));
          reply = getDemoReply(message);
        } else {
          reply = await sendToBackend(message);
        }
      } catch (err) {
        reply = 'حصل خطأ في الاتصال بالمساعد، جرب تاني أو كلّم فريقنا مباشرة من قسم "تواصل معنا".';
      }

      chatTyping.style.display = 'none';
      addChatMessage(reply, 'bot');
    });
  }
});

// ---------- Popup close (global, used by inline onclick) ----------
function closePopup() {
  const popup = document.getElementById('telegram-popup');
  if (popup) popup.classList.remove('show');
}
