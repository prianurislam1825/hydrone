-- ============================================================
-- HYDRONE — MySQL Database Schema
-- Run this once to set up the database:
--   mysql -u root -p hydrone < hydrone_schema.sql
-- Or import via phpMyAdmin.
-- ============================================================

CREATE DATABASE IF NOT EXISTS hydrone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hydrone;

-- ── Sensor readings (sent by ESP32 every ~2.5s) ──────────────
CREATE TABLE IF NOT EXISTS sensor_readings (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  device_id     VARCHAR(50)    NOT NULL DEFAULT 'hydrone-rov-01',
  ph            DECIMAL(5,3)   NULL,          -- pH value (6.5 – 8.5 safe)
  tds           DECIMAL(8,2)   NULL,          -- Total Dissolved Solids (ppm)
  turbidity     DECIMAL(8,2)   NULL,          -- Turbidity (NTU)
  temperature   DECIMAL(6,2)   NULL,          -- Water temp (°C)
  depth         DECIMAL(6,3)   NULL,          -- Depth (m)
  heading       DECIMAL(6,2)   NULL,          -- Compass heading (°)
  battery_a     TINYINT UNSIGNED NULL,        -- Pack A battery (%)
  battery_b     TINYINT UNSIGNED NULL,        -- Pack B battery (%)
  created_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_device_time (device_id, created_at DESC)
) ENGINE=InnoDB;

-- ── Device / system status ───────────────────────────────────
CREATE TABLE IF NOT EXISTS device_status (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  device_id     VARCHAR(50)    NOT NULL DEFAULT 'hydrone-rov-01',
  net_open      TINYINT(1)     NOT NULL DEFAULT 0,
  filter_active TINYINT(1)     NOT NULL DEFAULT 1,
  mode          VARCHAR(20)    NOT NULL DEFAULT 'MANUAL',
  connected     TINYINT(1)     NOT NULL DEFAULT 0,
  updated_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_device (device_id)
) ENGINE=InnoDB;

-- Insert default device status row
INSERT IGNORE INTO device_status (device_id) VALUES ('hydrone-rov-01');

-- ── Example ESP32 insert (for testing) ───────────────────────
-- INSERT INTO sensor_readings (ph, tds, turbidity, temperature, depth, heading, battery_a, battery_b)
-- VALUES (7.24, 186, 34.0, 26.4, 1.2, 47, 78, 91);
