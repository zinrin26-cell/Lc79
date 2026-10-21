const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3009;

// Kích hoạt CORS cho phép mọi thiết bị (Điện thoại/Safari) kết nối
app.use(cors());

// Hàm lấy thời gian UTC+7
function getCurrentTimeUTC7() {
  const now = new Date();
  const offset = 7;
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const localTime = new Date(utc + (3600000 * offset));
  const day = String(localTime.getDate()).padStart(2, '0');
  const month = String(localTime.getMonth() + 1).padStart(2, '0');
  const year = localTime.getFullYear();
  const hours = String(localTime.getHours()).padStart(2, '0');
  const minutes = String(localTime.getMinutes()).padStart(2, '0');
  const seconds = String(localTime.getSeconds()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} UTC+7`;
}

app.get('/api/lcmd5', async (req, res) => {
  try {
    const response = await axios.get('https://wtxmd52.tele68.com/v1/txmd5/sessions', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const data = response.data;
    let sessions = data.list || data;
    if (!Array.isArray(sessions) || sessions.length === 0) {
      return res.status(404).json({ success: false, message: 'Không có dữ liệu' });
    }
    sessions.sort((a, b) => b.id - a.id);
    const latest = sessions[0];
    const ketQua = latest.resultTruyenThong ? latest.resultTruyenThong.toLowerCase() : (latest.point > 10 ? 'tai' : 'xiu');
    const phien = latest.id || latest._id;
    const tong = latest.point || 0;
    const xucXac = latest.dices || [0, 0, 0];

    res.json({
      success: true,
      data: {
        ket_qua: ketQua,
        phien: phien,
        thoi_gian: getCurrentTimeUTC7(),
        tong: tong,
        xuc_xac_1: xucXac[0] || 0,
        xuc_xac_2: xucXac[1] || 0,
        xuc_xac_3: xucXac[2] || 0
      }
    });
  } catch (error) {
    console.error('Lỗi API Tele68:', error.message);
    res.status(500).json({ success: false, message: 'Lỗi server backend' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3009;

app.use(cors());

// Lấy thời gian UTC+7
function getCurrentTimeUTC7() {
  const now = new Date();
  const offset = 7;
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const localTime = new Date(utc + (3600000 * offset));
  const day = String(localTime.getDate()).padStart(2, '0');
  const month = String(localTime.getMonth() + 1).padStart(2, '0');
  const year = localTime.getFullYear();
  const hours = String(localTime.getHours()).padStart(2, '0');
  const minutes = String(localTime.getMinutes()).padStart(2, '0');
  const seconds = String(localTime.getSeconds()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} UTC+7`;
}

// 1. TRANG CHỦ: Hiển thị luôn giao diện HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. API LẤY DỮ LIỆU TÀI XỈU
app.get('/api/lcmd5', async (req, res) => {
  try {
    const response = await axios.get('https://wtxmd52.tele68.com/v1/txmd5/sessions', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const data = response.data;
    let sessions = data.list || data;
    if (!Array.isArray(sessions) || sessions.length === 0) {
      return res.status(404).json({ success: false, message: 'Không có dữ liệu' });
    }
    sessions.sort((a, b) => b.id - a.id);
    const latest = sessions[0];
    const ketQua = latest.resultTruyenThong ? latest.resultTruyenThong.toLowerCase() : (latest.point > 10 ? 'tai' : 'xiu');
    const phien = latest.id || latest._id;
    const tong = latest.point || 0;
    const xucXac = latest.dices || [0, 0, 0];

    res.json({
      success: true,
      data: {
        ket_qua: ketQua,
        phien: phien,
        thoi_gian: getCurrentTimeUTC7(),
        tong: tong,
        xuc_xac_1: xucXac[0] || 0,
        xuc_xac_2: xucXac[1] || 0,
        xuc_xac_3: xucXac[2] || 0
      }
    });
  } catch (error) {
    console.error('Lỗi API Tele68:', error.message);
    res.status(500).json({ success: false, message: 'Lỗi server backend' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

