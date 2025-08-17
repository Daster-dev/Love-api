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
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  const deviceData = { ip, userAgent };
  fs.writeFileSync(dbPath, JSON.stringify({ device: deviceData }, null, 2));

  res.json({ message: '✅ تم تسجيل الجهاز بنجاح، توجه إلى /data' });
});


// ✅ راوت البيانات
app.get('/data', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  const db = JSON.parse(fs.readFileSync(dbPath));
  const saved = db.device;

  if (
    saved &&
    saved.ip === ip &&
    saved.userAgent === userAgent
  ) {
    return res.json({
      message: '🎉 مرحباً! هذه البيانات خاصة بجهازك فقط.',
      timestamp: new Date(),
      data: {
        name: "Authorized User",
        accessLevel: "Full"
      }
    });
  } else {
    return res.status(403).json({ message: '❌ جهاز غير مصرح له بالدخول' });
  }
});


app.listen(port, () => {
  console.log(`✅ API شغّال على http://localhost:${port}`);
});
