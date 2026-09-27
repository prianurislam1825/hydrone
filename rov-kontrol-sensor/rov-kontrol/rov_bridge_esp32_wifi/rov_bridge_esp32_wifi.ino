/*
 * ROV Bridge - ESP32 + W5500 (PC) + WiFi AP (HP/Tablet)
 * --------------------------------------------------------
 * ESP32 menerima perintah kontrol dari DUA sumber:
 *   1. PC via Ethernet (W5500) -> UDP port 3333
 *   2. HP/Tablet via WiFi -> halaman web virtual joystick
 *
 * Format pesan (diperluas dari 4 menjadi 8 field):
 *   fwd,yaw,vert,armed,r1,r2,r3,r4
 *   r1..r4 = status relay CH1..CH4 (0=OFF, 1=ON)
 *
 * Format lama (4 field) tetap kompatibel: relay tidak berubah.
 *
 * Keduanya diteruskan ke Arduino Mega lewat UART dengan format yang
 * sama, jadi hanya rov_control_mega.ino yang perlu diupdate.
 *
 * PENTING: hanya boleh SATU kontroler aktif dalam satu waktu.
 * Last command wins. Matikan yang tidak dipakai sebelum pindah.
 *
 * Cara pakai dari HP/Tablet:
 *   1. Sambungkan WiFi HP/Tablet ke SSID "ROV_Control"
 *   2. Buka browser, akses http://192.168.5.1
 *   3. Tekan ARM, geser joystick, dan toggle relay CH1-CH4
 *
 * Serial monitor via browser:
 *   http://192.168.5.1/serial (WiFi) atau http://192.168.4.2/serial (Ethernet)
 *
 * Wiring W5500   : MISO=39, MOSI=38, SCLK=21, CS=14, RST -> 3V3
 * Wiring ke Mega : ESP32 pin42/41 <-> Arduino Mega Serial1 (TX1=18, RX1=19)
 */

#include <SPI.h>
#include <Ethernet.h>
#include <EthernetUdp.h>
#include <HardwareSerial.h>
#include <WiFi.h>
#include <WebServer.h>

// ---- W5500 Ethernet ----
#define PIN_MISO  39
#define PIN_MOSI  38
#define PIN_SCLK  21
#define PIN_CS    14

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress esp32_ip(192, 168, 4, 2);
IPAddress gateway_ip(192, 168, 4, 1);
IPAddress subnet_mask(255, 255, 255, 0);

#define UDP_PORT 3333
EthernetUDP Udp;
bool ethernetAvailable = false;

// ---- WiFi Access Point ----
const char* AP_SSID     = "ROV_Control";
const char* AP_PASSWORD = "rovkontrol123";
IPAddress ap_ip(192, 168, 5, 1);
IPAddress ap_gateway(192, 168, 5, 1);
IPAddress ap_subnet(255, 255, 255, 0);

WebServer server(80);

// ---- UART ke Arduino Mega ----
HardwareSerial SerialMega(1);
const int RX_PIN = 41;
const int TX_PIN = 42;

#define FAILSAFE_TIMEOUT_MS  500
#define FAILSAFE_RESEND_MS   200

char incomingBuffer[256];
char lineBuffer[256];
String lastTelemetry = "belum ada data";

unsigned long lastPacketTime = 0;
unsigned long lastFailsafeSend = 0;

IPAddress lastRemoteIp;
uint16_t  lastRemotePort = 0;
bool      havePcAddress  = false;

// ---- Relay state (ditrack di ESP32 untuk UI web) ----
bool relayState[4] = {false, false, false, false};

// ---- Log buffer untuk serial monitor via web ----
#define LOG_BUFFER_SIZE 60
String logBuffer[LOG_BUFFER_SIZE];
int logWriteIndex = 0;
int logCount      = 0;

void addLog(const String &line) {
  String stamped = "[" + String(millis() / 1000.0, 1) + "s] " + line;
  logBuffer[logWriteIndex] = stamped;
  logWriteIndex = (logWriteIndex + 1) % LOG_BUFFER_SIZE;
  if (logCount < LOG_BUFFER_SIZE) logCount++;
  Serial.println(stamped);
}

String getLogText() {
  String out = "";
  int start = (logCount < LOG_BUFFER_SIZE) ? 0 : logWriteIndex;
  for (int i = 0; i < logCount; i++) {
    int idx = (start + i) % LOG_BUFFER_SIZE;
    out += logBuffer[idx] + "\n";
  }
  return out;
}

// ---- Halaman web virtual joystick + relay ----
const char INDEX_HTML[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>ROV Control</title>
<style>
  * { box-sizing: border-box; -webkit-user-select: none; user-select: none; touch-action: none; }
  body { margin:0; font-family: sans-serif; background:#111; color:#eee;
         display:flex; flex-direction:column; align-items:center; padding:16px; }
  h1 { font-size:18px; margin:8px 0; }

  /* ARM button */
  #armBtn { font-size:18px; padding:10px 32px; border:none; border-radius:8px;
            background:#27ae60; color:#fff; margin-bottom:12px; cursor:pointer; }

  /* Relay panel */
  .relay-panel { display:flex; gap:8px; margin-bottom:14px; flex-wrap:wrap; justify-content:center; }
  .relay-btn { font-size:13px; padding:8px 14px; border:none; border-radius:6px;
               background:#333; color:#ccc; cursor:pointer; min-width:68px; }
  .relay-btn.on { background:#e67e22; color:#fff; }

  /* Joysticks */
  .joysticks { display:flex; justify-content:space-between; width:100%; max-width:420px; margin-top:4px; }
  .base { width:140px; height:140px; border-radius:50%; background:#222; border:2px solid #444; position:relative; }
  .knob { width:60px; height:60px; border-radius:50%; background:#3b8ad4; position:absolute; top:40px; left:40px; }
  #statusText { margin-top:14px; font-size:12px; color:#9c9a92; text-align:center; }
  .label { font-size:12px; color:#9c9a92; text-align:center; margin-top:6px; }
</style>
</head>
<body>
<h1>ROV Control</h1>
<button id="armBtn">ARM</button>

<!-- Relay 4CH -->
<div class="relay-panel">
  <button class="relay-btn" id="r1" onclick="toggleRelay(0)">CH1 OFF</button>
  <button class="relay-btn" id="r2" onclick="toggleRelay(1)">CH2 OFF</button>
  <button class="relay-btn" id="r3" onclick="toggleRelay(2)">CH3 OFF</button>
  <button class="relay-btn" id="r4" onclick="toggleRelay(3)">CH4 OFF</button>
</div>

<!-- Joystick -->
<div class="joysticks">
  <div>
    <div class="base" id="leftBase"><div class="knob" id="leftKnob"></div></div>
    <div class="label">Maju/mundur + yaw</div>
  </div>
  <div>
    <div class="base" id="rightBase"><div class="knob" id="rightKnob"></div></div>
    <div class="label">Naik/turun</div>
  </div>
</div>

<div id="statusText">Menghubungkan...</div>
<a href="/serial" style="color:#3b8ad4; font-size:12px; margin-top:12px;">Buka serial monitor &rarr;</a>

<script>
let fwd=0, yaw=0, vert=0, armed=0;
let relay=[0,0,0,0];
const relayIds=['r1','r2','r3','r4'];

function toggleRelay(i) {
  relay[i] = relay[i] ? 0 : 1;
  const btn = document.getElementById(relayIds[i]);
  btn.textContent = 'CH'+(i+1)+' '+(relay[i]?'ON':'OFF');
  btn.classList.toggle('on', relay[i]===1);
}

function setupJoystick(baseId, knobId, onMove, lockAxis) {
  const base = document.getElementById(baseId);
  const knob = document.getElementById(knobId);
  const radius = base.clientWidth / 2 - knob.clientWidth / 2;
  let active = false;
  function move(e) {
    if (!active) return;
    const rect = base.getBoundingClientRect();
    let dx = e.clientX - (rect.left + rect.width / 2);
    let dy = e.clientY - (rect.top + rect.height / 2);
    if (lockAxis === 'y') dx = 0;
    const angle = Math.atan2(dy, dx);
    const dist  = Math.min(Math.sqrt(dx*dx + dy*dy), radius);
    const kx = lockAxis === 'y' ? 0 : Math.cos(angle) * dist;
    const ky = Math.sin(angle) * dist;
    knob.style.transform = `translate(${kx}px, ${ky}px)`;
    onMove(kx / radius, -(ky / radius));
  }
  function up() {
    active = false;
    knob.style.transform = 'translate(0px, 0px)';
    onMove(0, 0);
  }
  base.addEventListener('pointerdown', (e)=>{ active=true; base.setPointerCapture(e.pointerId); move(e); });
  base.addEventListener('pointermove', move);
  base.addEventListener('pointerup', up);
  base.addEventListener('pointercancel', up);
}

setupJoystick('leftBase',  'leftKnob',  (x,y)=>{ fwd=Math.round(y*100); yaw=Math.round(x*100); });
setupJoystick('rightBase', 'rightKnob', (x,y)=>{ vert=Math.round(y*100); }, 'y');

document.getElementById('armBtn').addEventListener('click', ()=>{
  armed = armed ? 0 : 1;
  const btn = document.getElementById('armBtn');
  btn.textContent = armed ? 'DISARM' : 'ARM';
  btn.style.background = armed ? '#c0392b' : '#27ae60';
});

// Kirim perintah 10x/detik
setInterval(()=>{
  fetch(`/cmd?fwd=${fwd}&yaw=${yaw}&vert=${vert}&armed=${armed}&r1=${relay[0]}&r2=${relay[1]}&r3=${relay[2]}&r4=${relay[3]}`).catch(()=>{});
}, 100);

// Polling status telemetry
setInterval(()=>{
  fetch('/status').then(r=>r.text()).then(t=>{
    document.getElementById('statusText').textContent = t;
  }).catch(()=>{
    document.getElementById('statusText').textContent = 'Tidak terhubung ke ESP32';
  });
}, 500);
</script>
</body>
</html>
)rawliteral";

// ---- Halaman serial monitor ----
const char SERIAL_HTML[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ROV Serial Monitor</title>
<style>
  * { box-sizing: border-box; }
  body { margin:0; font-family: sans-serif; background:#111; color:#eee; padding:12px; }
  h1 { font-size:16px; margin:0 0 8px; }
  a { color:#3b8ad4; font-size:13px; }
  #log { background:#000; border:1px solid #333; border-radius:6px; padding:8px;
         height:60vh; overflow-y:auto; white-space:pre-wrap; word-break:break-all;
         font-family: monospace; font-size:12px; color:#7be36b; margin-top:10px; }
  .row { display:flex; gap:8px; margin-top:10px; }
  #cmdInput { flex:1; font-family: monospace; padding:8px; background:#000; color:#eee;
              border:1px solid #333; border-radius:4px; }
  #sendBtn { padding:8px 16px; background:#222; color:#eee; border:1px solid #444; border-radius:4px; }
  .warn { font-size:11px; color:#9c9a92; margin-top:6px; }
</style>
</head>
<body>
<h1>ROV Serial Monitor</h1>
<a href="/">&larr; Kembali ke kontrol joystick</a>
<div id="log">Memuat log...</div>
<div class="row">
  <input id="cmdInput" placeholder="Ketik perintah manual ke Mega lalu Enter">
  <button id="sendBtn">Kirim</button>
</div>
<div class="warn">Hati-hati: format fwd,yaw,vert,armed,r1,r2,r3,r4 yang valid bisa langsung gerakkan motor/relay.</div>
<script>
const logDiv = document.getElementById('log');
async function refreshLog() {
  try {
    const res = await fetch('/log');
    const text = await res.text();
    const atBottom = logDiv.scrollTop + logDiv.clientHeight >= logDiv.scrollHeight - 20;
    logDiv.textContent = text;
    if (atBottom) logDiv.scrollTop = logDiv.scrollHeight;
  } catch(e) {
    logDiv.textContent = 'Tidak terhubung ke ESP32';
  }
}
setInterval(refreshLog, 500);
refreshLog();
function sendCmd() {
  const input = document.getElementById('cmdInput');
  const cmd = input.value.trim();
  if (!cmd) return;
  fetch('/send?cmd=' + encodeURIComponent(cmd)).catch(()=>{});
  input.value = '';
}
document.getElementById('sendBtn').addEventListener('click', sendCmd);
document.getElementById('cmdInput').addEventListener('keydown', (e)=>{ if(e.key==='Enter') sendCmd(); });
</script>
</body>
</html>
)rawliteral";

// ---- Kirim ke Mega ----
void sendToMega(const char *msg) {
  SerialMega.println(msg);
}

// ---- Handler HTTP ----
void handleRoot() {
  server.send_P(200, "text/html", INDEX_HTML);
}

void handleCmd() {
  String fwd   = server.arg("fwd");
  String yaw   = server.arg("yaw");
  String vert  = server.arg("vert");
  String armed = server.arg("armed");
  String r1    = server.arg("r1");
  String r2    = server.arg("r2");
  String r3    = server.arg("r3");
  String r4    = server.arg("r4");

  if (fwd.length()==0 || yaw.length()==0 || vert.length()==0 || armed.length()==0) {
    server.send(400, "text/plain", "bad request");
    return;
  }

  // Update relay state di ESP32 untuk konsistensi UI
  if (r1.length()) relayState[0] = (r1 == "1");
  if (r2.length()) relayState[1] = (r2 == "1");
  if (r3.length()) relayState[2] = (r3 == "1");
  if (r4.length()) relayState[3] = (r4 == "1");

  String msg = fwd + "," + yaw + "," + vert + "," + armed;
  // Sertakan relay fields kalau ada
  if (r1.length() && r2.length() && r3.length() && r4.length()) {
    msg += "," + r1 + "," + r2 + "," + r3 + "," + r4;
  }

  sendToMega(msg.c_str());
  lastPacketTime = millis();
  server.send(200, "text/plain", "ok");
}

void handleStatus() {
  server.send(200, "text/plain", lastTelemetry);
}

void handleSerialPage() {
  server.send_P(200, "text/html", SERIAL_HTML);
}

void handleLog() {
  server.send(200, "text/plain", getLogText());
}

void handleSend() {
  String cmd = server.arg("cmd");
  if (cmd.length() == 0) {
    server.send(400, "text/plain", "bad request");
    return;
  }
  addLog("[WEB->MEGA] " + cmd);
  sendToMega(cmd.c_str());
  server.send(200, "text/plain", "ok");
}

void setup() {
  Serial.begin(115200);
  delay(500);

  SerialMega.begin(115200, SERIAL_8N1, RX_PIN, TX_PIN);

  // ---- Ethernet (PC) ----
  SPI.begin(PIN_SCLK, PIN_MISO, PIN_MOSI, PIN_CS);
  Ethernet.init(PIN_CS);
  Ethernet.begin(mac, esp32_ip, gateway_ip, gateway_ip, subnet_mask);

  if (Ethernet.hardwareStatus() == EthernetNoHardware) {
    addLog("PERINGATAN: W5500 tidak terdeteksi, kontrol dari PC tidak akan berfungsi");
    ethernetAvailable = false;
  } else {
    addLog("ESP32 Ethernet IP: " + Ethernet.localIP().toString());
    Udp.begin(UDP_PORT);
    ethernetAvailable = true;
  }

  // ---- WiFi AP ----
  WiFi.softAPConfig(ap_ip, ap_gateway, ap_subnet);
  WiFi.softAP(AP_SSID, AP_PASSWORD);
  addLog("WiFi AP aktif, SSID: " + String(AP_SSID));
  addLog("Buka browser ke: http://" + WiFi.softAPIP().toString());

  server.on("/",       handleRoot);
  server.on("/cmd",    handleCmd);
  server.on("/status", handleStatus);
  server.on("/serial", handleSerialPage);
  server.on("/log",    handleLog);
  server.on("/send",   handleSend);
  server.begin();

  // Kirim safe state awal
  sendToMega("0,0,0,0,0,0,0,0");
  lastPacketTime = millis();

  addLog("ROV bridge siap (PC via Ethernet + HP/Tablet via WiFi) + Relay 4CH");
}

void loop() {
  server.handleClient();

  // ---- PC -> ESP32 (UDP) -> Mega (UART) ----
  if (ethernetAvailable) {
    Ethernet.maintain();

    int packetSize = Udp.parsePacket();
    if (packetSize > 0) {
      int len = Udp.read(incomingBuffer, sizeof(incomingBuffer) - 1);
      incomingBuffer[len] = '\0';

      lastRemoteIp   = Udp.remoteIP();
      lastRemotePort = Udp.remotePort();
      havePcAddress  = true;
      lastPacketTime = millis();

      sendToMega(incomingBuffer);
    }
  }

  // ---- Failsafe: tidak ada perintah dari PC maupun HP ----
  if (millis() - lastPacketTime > FAILSAFE_TIMEOUT_MS) {
    if (millis() - lastFailsafeSend > FAILSAFE_RESEND_MS) {
      lastFailsafeSend = millis();
      sendToMega("0,0,0,0,0,0,0,0");
      addLog("[FAILSAFE] Tidak ada perintah masuk, disarm + relay off dikirim ke Mega");
    }
  }

  // ---- Mega -> simpan telemetry, teruskan ke PC ----
  if (SerialMega.available()) {
    int len = SerialMega.readBytesUntil('\n', lineBuffer, sizeof(lineBuffer) - 1);
    lineBuffer[len] = '\0';
    lastTelemetry = String(lineBuffer);
    addLog("[MEGA] " + lastTelemetry);

    if (ethernetAvailable && havePcAddress && len > 0) {
      Udp.beginPacket(lastRemoteIp, lastRemotePort);
      Udp.write(lineBuffer);
      Udp.endPacket();
    }
  }
}
