const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const dbPath = path.join(__dirname, 'db.json');

// ✅ راوت التسجيل


app.get('/register', (req, res) => {
  // نقرأ الداتا الحالية
  let db = {};
  try {
    db = JSON.parse(fs.readFileSync(dbPath));
  } catch (err) {
    db = {};
  }

  // إذا الجهاز مسجل مسبقاً، نمنع الدخول
  if (db.isRegistered) {
    return res.status(403).send('❌ هذا الرابط لم يعد متاحاً');
  }

  // تسجيل بيانات الجهاز
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  db.device = { ip, userAgent };
  db.isRegistered = true;

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  // تحويل مباشر إلى /data
  res.redirect('/data');
});



// ✅ راوت البيانات
app.get('/data', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  const db = JSON.parse(fs.readFileSync(dbPath));
  const saved = db.device;

  if (
    !db.isRegistered ||
    !saved ||
    saved.ip !== ip ||
    saved.userAgent !== userAgent
  ) {
    return res.status(403).json({ message: '❌ جهاز غير مصرح له بالدخول' });
  }

  // ✅ مصفوفة الجمل أو المعلومات
  const messages = [
    "1",
    "2"
  ];

  // ✅ اختيار عشوائي
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  res.json({
    message: randomMessage
  });
});



app.listen(port, () => {
  console.log(`✅ API شغّال على http://localhost:${port}`);
});
