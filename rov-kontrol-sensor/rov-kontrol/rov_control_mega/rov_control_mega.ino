/*
 * ROV Motor Control + Relay 4CH + Multi-Sensor - Arduino Mega
 * ============================================================
 * Perintah masuk via UART1 (Serial1, dari ESP32) berupa CSV:
 *   fwd,yaw,vert,armed,r1,r2,r3,r4
 *
 * Motor mixing ke 4 ESC:
 *   motA (pin 2) = Horizontal KIRI    -> maju/mundur + yaw
 *   motB (pin 3) = Horizontal KANAN   -> maju/mundur + yaw
 *   motC (pin 4) = Vertikal DEPAN     -> naik/turun
 *   motD (pin 5) = Vertikal BELAKANG  -> naik/turun
 *
 * Relay 4CH (active LOW, ubah RELAY_ACTIVE_LOW jika perlu):
 *   CH1->D10  CH2->D11  CH3->D12  CH4->D13
 *
 * Sensor (NON-I2C):
 *   DS18B20 Suhu  -> pin 22 (OneWire)
 *   pH            -> A1
 *   TDS           -> A2
 *   Turbidity     -> A3
 *   ACS712 #1     -> A4
 *   ACS712 #2     -> A5
 *   ACS712 #3     -> A6
 *   ACS712 #4     -> A7
 *
 * Library yang dibutuhkan:
 *   - Servo (built-in)
 *   - OneWire
 *   - DallasTemperature
 *
 * Telemetry ke ESP32 (via Serial1, 5x/detik) format JSON:
 *   {"armed":1,"fwd":0,"yaw":0,"vert":0,
 *    "relay":[0,0,0,0],
 *    "suhu":28.5,"pH":7.02,"tds":320,"turb":12.3,
 *    "acs":[0.12,-0.01,0.05,0.00]}
 *
 * Failsafe: tidak ada perintah >500ms -> disarm + relay OFF otomatis.
 * PASTIKAN ESC sudah dikalibrasi (min 1000us, max 2000us).
 */

#include <Servo.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// ===== PIN & KONSTANTA =====

// -- ESC --
#define MIN_PULSE_LENGTH  1000
#define MAX_PULSE_LENGTH  2000
#define NEUTRAL_PULSE     1500
#define CMD_TIMEOUT_MS     500

// -- Relay --
#define RELAY_ACTIVE_LOW true
const uint8_t JUMLAH_RELAY = 4;
const uint8_t PIN_RELAY[JUMLAH_RELAY] = {10, 11, 12, 13};

// -- Sensor --
#define PIN_SUHU        22
#define PIN_PH          A1
#define PIN_TDS         A2
#define PIN_TURBIDITY   A3
#define PIN_ACS1        A4
#define PIN_ACS2        A5
#define PIN_ACS3        A6
#define PIN_ACS4        A7

// -- Kalibrasi ADC --
#define VREF            5.0
#define ADC_RES         1023.0

// -- Kalibrasi pH (sesuaikan dengan larutan buffer pH4/pH7) --
#define PH_OFFSET       0.00
#define PH_SLOPE       -5.70

// -- Kalibrasi ACS712 (ganti sesuai model: 5A=0.185, 20A=0.100, 30A=0.066) --
#define ACS_SENSITIVITY 0.100
#define ACS_VCC_MID     2.500

// -- Interval baca sensor (ms) --
#define SENSOR_INTERVAL  500   // baca sensor tiap 500ms (2x/detik)
#define TELEMETRY_INTERVAL 200 // kirim telemetry tiap 200ms (5x/detik)

// ===== OBJEK =====
Servo motA, motB, motC, motD;

OneWire oneWire(PIN_SUHU);
DallasTemperature suhuSensor(&oneWire);

// ===== STATE =====
unsigned long lastCmdTime      = 0;
unsigned long lastSensorRead   = 0;
unsigned long lastTelemetry    = 0;

float fwd = 0, yaw = 0, vert = 0;
int   armed = 0;
int   relayCmd[JUMLAH_RELAY]   = {0, 0, 0, 0};
bool  statusRelay[JUMLAH_RELAY]= {false, false, false, false};

// Nilai sensor terakhir (di-cache, agar telemetry tidak blocking)
float s_suhu  = 0;
float s_ph    = 0;
float s_tds   = 0;
float s_turb  = 0;
float s_acs[4]= {0, 0, 0, 0};

// ===== RELAY =====
void tulisRelay(uint8_t i, bool nyala) {
  if (i >= JUMLAH_RELAY) return;
  statusRelay[i] = nyala;
  digitalWrite(PIN_RELAY[i], (RELAY_ACTIVE_LOW ? !nyala : nyala) ? HIGH : LOW);
}

void matikanSemuaRelay() {
  for (uint8_t i = 0; i < JUMLAH_RELAY; i++) tulisRelay(i, false);
}

void applyRelay() {
  for (uint8_t i = 0; i < JUMLAH_RELAY; i++) tulisRelay(i, relayCmd[i] == 1);
}

// ===== MOTOR =====
void writeAllNeutral() {
  motA.writeMicroseconds(NEUTRAL_PULSE);
  motB.writeMicroseconds(NEUTRAL_PULSE);
  motC.writeMicroseconds(NEUTRAL_PULSE);
  motD.writeMicroseconds(NEUTRAL_PULSE);
}

void applyMix() {
  if (!armed) { writeAllNeutral(); return; }

  int pwmA = constrain(NEUTRAL_PULSE + (int)(fwd*5) - (int)(yaw*5), MIN_PULSE_LENGTH, MAX_PULSE_LENGTH);
  int pwmB = constrain(NEUTRAL_PULSE + (int)(fwd*5) + (int)(yaw*5), MIN_PULSE_LENGTH, MAX_PULSE_LENGTH);
  int pwmC = constrain(NEUTRAL_PULSE + (int)(vert*5),               MIN_PULSE_LENGTH, MAX_PULSE_LENGTH);
  int pwmD = constrain(NEUTRAL_PULSE + (int)(vert*5),               MIN_PULSE_LENGTH, MAX_PULSE_LENGTH);

  motA.writeMicroseconds(pwmA);
  motB.writeMicroseconds(pwmB);
  motC.writeMicroseconds(pwmC);
  motD.writeMicroseconds(pwmD);
}

// ===== PARSER PERINTAH =====
// Format: fwd,yaw,vert,armed[,r1,r2,r3,r4]
bool parseCommand(String line) {
  int c0 = line.indexOf(',');              if (c0 < 0) return false;
  int c1 = line.indexOf(',', c0 + 1);     if (c1 < 0) return false;
  int c2 = line.indexOf(',', c1 + 1);     if (c2 < 0) return false;

  fwd  = line.substring(0, c0).toFloat();
  yaw  = line.substring(c0 + 1, c1).toFloat();
  vert = line.substring(c1 + 1, c2).toFloat();

  int c3 = line.indexOf(',', c2 + 1);
  if (c3 < 0) {
    armed = line.substring(c2 + 1).toInt();
    return true;
  }
  armed = line.substring(c2 + 1, c3).toInt();

  // Parse r1..r4
  int prev = c3;
  for (uint8_t i = 0; i < JUMLAH_RELAY; i++) {
    int next = line.indexOf(',', prev + 1);
    String val = (next < 0) ? line.substring(prev + 1) : line.substring(prev + 1, next);
    relayCmd[i] = val.toInt();
    prev = next;
    if (next < 0) break;
  }
  return true;
}

// ===== FUNGSI BACA SENSOR =====
float bacaPH() {
  float v = analogRead(PIN_PH) * (VREF / ADC_RES);
  return PH_SLOPE * v + 21.34 + PH_OFFSET;
}

float bacaTDS(float suhuC) {
  float v = analogRead(PIN_TDS) * (VREF / ADC_RES);
  if (isnan(suhuC) || suhuC < -50) suhuC = 25.0;
  float compV = v / (1.0 + 0.02 * (suhuC - 25.0));
  float tds = (133.42 * pow(compV, 3) - 255.86 * pow(compV, 2) + 857.39 * compV) * 0.5;
  return max(tds, 0.0f);
}

float bacaTurbidity() {
  float v = analogRead(PIN_TURBIDITY) * (VREF / ADC_RES);
  float ntu = -1120.4 * sq(v) + 5742.3 * v - 4352.9;
  return max(ntu, 0.0f);
}

float bacaArusACS(int pin) {
  const int N = 20;
  long total = 0;
  for (int i = 0; i < N; i++) { total += analogRead(pin); delayMicroseconds(200); }
  float v = (total / (float)N) * (VREF / ADC_RES);
  return (v - ACS_VCC_MID) / ACS_SENSITIVITY;
}

void bacaSemuaSensor() {
  suhuSensor.requestTemperatures();
  float suhuRaw = suhuSensor.getTempCByIndex(0);
  s_suhu = (suhuRaw == DEVICE_DISCONNECTED_C) ? -999 : suhuRaw;

  s_ph   = bacaPH();
  s_tds  = bacaTDS(s_suhu);
  s_turb = bacaTurbidity();

  s_acs[0] = bacaArusACS(PIN_ACS1);
  s_acs[1] = bacaArusACS(PIN_ACS2);
  s_acs[2] = bacaArusACS(PIN_ACS3);
  s_acs[3] = bacaArusACS(PIN_ACS4);
}

// ===== KIRIM TELEMETRY (JSON) =====
void kirimTelemetry() {
  // Format JSON agar mudah di-parse di ESP32 / PC
  Serial1.print(F("{\"armed\":"));  Serial1.print(armed);
  Serial1.print(F(",\"fwd\":"));    Serial1.print(fwd, 1);
  Serial1.print(F(",\"yaw\":"));    Serial1.print(yaw, 1);
  Serial1.print(F(",\"vert\":"));   Serial1.print(vert, 1);

  // Relay
  Serial1.print(F(",\"relay\":["));
  for (uint8_t i = 0; i < JUMLAH_RELAY; i++) {
    Serial1.print(statusRelay[i] ? 1 : 0);
    if (i < JUMLAH_RELAY - 1) Serial1.print(',');
  }
  Serial1.print(F("]"));

  // Sensor
  Serial1.print(F(",\"suhu\":")); Serial1.print(s_suhu, 1);
  Serial1.print(F(",\"pH\":"));   Serial1.print(s_ph, 2);
  Serial1.print(F(",\"tds\":"));  Serial1.print(s_tds, 1);
  Serial1.print(F(",\"turb\":")); Serial1.print(s_turb, 1);

  // ACS
  Serial1.print(F(",\"acs\":["));
  for (uint8_t i = 0; i < 4; i++) {
    Serial1.print(s_acs[i], 2);
    if (i < 3) Serial1.print(',');
  }
  Serial1.print(F("]}"));
  Serial1.println();
}

// ===== SETUP =====
void setup() {
  Serial.begin(115200);
  Serial1.begin(115200);

  // Motor ESC
  motA.attach(2, MIN_PULSE_LENGTH, MAX_PULSE_LENGTH);
  motB.attach(3, MIN_PULSE_LENGTH, MAX_PULSE_LENGTH);
  motC.attach(4, MIN_PULSE_LENGTH, MAX_PULSE_LENGTH);
  motD.attach(5, MIN_PULSE_LENGTH, MAX_PULSE_LENGTH);
  writeAllNeutral();

  // Relay
  for (uint8_t i = 0; i < JUMLAH_RELAY; i++) {
    pinMode(PIN_RELAY[i], OUTPUT);
    tulisRelay(i, false);
  }

  // Sensor suhu
  suhuSensor.begin();
  Serial.print(F("Sensor DS18B20 terdeteksi: "));
  Serial.println(suhuSensor.getDeviceCount());

  lastCmdTime = millis();
  Serial.println(F("=== ROV Motor + Relay 4CH + Multi-Sensor Siap ==="));
}

// ===== LOOP =====
void loop() {
  // 1. Baca perintah dari ESP32
  if (Serial1.available()) {
    String line = Serial1.readStringUntil('\n');
    line.trim();
    if (line.length() > 0 && parseCommand(line)) {
      lastCmdTime = millis();
    }
  }

  // 2. Failsafe
  if (millis() - lastCmdTime > CMD_TIMEOUT_MS) {
    armed = 0;
    matikanSemuaRelay();
  } else {
    applyRelay();
  }

  // 3. Jalankan motor
  applyMix();

  // 4. Baca sensor secara berkala (non-blocking terhadap kontrol motor)
  if (millis() - lastSensorRead >= SENSOR_INTERVAL) {
    lastSensorRead = millis();
    bacaSemuaSensor();
  }

  // 5. Kirim telemetry ke ESP32
  if (millis() - lastTelemetry >= TELEMETRY_INTERVAL) {
    lastTelemetry = millis();
    kirimTelemetry();
  }
}
