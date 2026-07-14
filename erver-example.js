// ============================================================
// server-example.js
// سيرفر بسيط (Node.js + Express) يوصل شات الموقع بـ Claude فعليًا.
// المفتاح السري (API Key) بيفضل هنا بس على السيرفر، وميتبعتش أبدًا
// لكود الموقع اللي بيشتغل في متصفح الزائر.
// ============================================================

// 1) نزّل المكتبات المطلوبة:
//    npm init -y
//    npm install express cors @anthropic-ai/sdk dotenv

const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
app.use(cors());               // في الإنتاج، حدد دومين موقعك بس بدل السماح للكل
app.use(express.json());

// 2) اعمل ملف اسمه .env جنب الملف ده وحط فيه:
//    ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
//    (خد المفتاح من https://console.anthropic.com/settings/keys)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt بيعرّف شخصية المساعد وسياق فريق Team LEGO
const SYSTEM_PROMPT = `
أنت المساعد الذكي الرسمي لفريق "Team LEGO"، فريق متخصص في الأمن السيبراني
(اختبار اختراق، حماية شبكات، برمجة بوتات تيليجرام، تطبيقات ويب، تدريب تقني).
جاوب بالعربية المصرية البسيطة والواضحة، بأسلوب احترافي وودود.
لو حد سأل عن حاجة برة تخصص الفريق، رجّعه بلطف لمجالات عمل الفريق.
لو حد عايز تفاصيل سعر دقيقة أو طلب فعلي، وجهه للتواصل المباشر عبر
تيليجرام @Oap219 أو البريد legoteam02@gmail.com.
`.trim();

app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = (req.body.message || '').toString().slice(0, 2000);
    if (!userMessage.trim()) {
      return res.status(400).json({ error: 'الرسالة فارغة' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6', // استخدم أحدث موديل متاح عندك في الحساب
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: userMessage }
      ]
    });

    const reply = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    res.json({ reply });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'حصل خطأ في السيرفر' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AI chat backend running on http://localhost:${PORT}`);
});

// ============================================================
// 3) شغّل السيرفر محليًا للتجربة:
//    node server-example.js
//
// 4) لما تتأكد إنه شغال، ارفعه على استضافة بتدعم Node.js زي:
//    Render.com / Railway.app / Vercel (Serverless Functions)
//    وحط فيها متغير البيئة ANTHROPIC_API_KEY من إعدادات الاستضافة
//    (متكتبش المفتاح جوه الكود نفسه أبدًا).
//
// 5) في script.js بتاع الموقع، غيّر:
//    const AI_BACKEND_URL = 'https://YOUR-BACKEND-URL.example.com/api/chat';
//    لعنوان السيرفر اللي هيرجعلك بعد الرفع، وغيّر:
//    const USE_DEMO_MODE = false;
// ============================================================