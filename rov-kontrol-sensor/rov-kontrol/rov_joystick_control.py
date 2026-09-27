"""
ROV Joystick Control - PC -> ESP32 -> Arduino Mega
----------------------------------------------------
Kontrol ROV pakai joystick/gamepad (Xbox/PS/generic), kirim perintah
via UDP ke ESP32 dengan rate tetap (20Hz). Protokol UDP sama persis
dengan versi keyboard, jadi ESP32 & Arduino Mega TIDAK perlu diubah
selain update format pesan dengan field relay.

Mapping default (gaya Xbox controller):
    Stick kiri  atas/bawah  : maju / mundur      (fwd)
    Stick kiri  kiri/kanan  : yaw kiri / kanan   (yaw)
    Stick kanan atas/bawah  : naik / turun       (vert)
    Tombol A (index 0)      : toggle ARM / DISARM
    Tombol X (index 2)      : toggle relay CH1
    Tombol Y (index 3)      : toggle relay CH2
    LB (index 4)            : toggle relay CH3
    RB (index 5)            : toggle relay CH4
    Tombol B (index 1) /
    tombol Back/Start /
    ESC di keyboard         : keluar (otomatis disarm + relay off)

Kalau mapping stick/tombol kontrolermu beda, ubah konstanta
AXIS_FWD, AXIS_YAW, AXIS_VERT, BUTTON_ARM_TOGGLE, BUTTON_RELAY_*,
BUTTON_QUIT di bawah.

Install dulu:
    pip install pygame

Pastikan:
    - ESP32 sudah menjalankan sketch rov_bridge_esp32.ino
    - Arduino Mega sudah menjalankan sketch rov_control_mega.ino
    - PC sudah di-set IP statis 192.168.4.1 (subnet 255.255.255.0)
    - Kabel RJ45 sudah terpasang PC <-> W5500
    - Joystick/gamepad sudah tersambung ke PC sebelum skrip dijalankan
"""

import socket
import time
import pygame

ESP32_IP   = "192.168.4.2"
ESP32_PORT = 3333

SEND_RATE_HZ   = 20
SEND_INTERVAL  = 1.0 / SEND_RATE_HZ

THROTTLE  = 100    # kekuatan maksimum, rentang -100..100
DEADZONE  = 0.15   # abaikan gerakan stick kecil (drift/noise)

# ---- Mapping axis & tombol (ubah sesuai kontrolermu kalau perlu) ----
AXIS_FWD         = 1   # stick kiri, atas/bawah
AXIS_YAW         = 0   # stick kiri, kiri/kanan
AXIS_VERT        = 3   # stick kanan, atas/bawah
BUTTON_ARM_TOGGLE  = 0  # tombol A (Xbox) / Cross (PS)
BUTTON_RELAY      = [2, 3, 4, 5]  # X, Y, LB, RB -> relay CH1..CH4
BUTTON_QUIT        = 1  # tombol B (Xbox) / Circle (PS)


def apply_deadzone(value, deadzone=DEADZONE):
    return 0.0 if abs(value) < deadzone else value


def main():
    pygame.init()
    pygame.joystick.init()

    if pygame.joystick.get_count() == 0:
        print("ERROR: Tidak ada joystick/gamepad terdeteksi.")
        print("Sambungkan kontroler dulu, lalu jalankan ulang skrip ini.")
        return

    joy = pygame.joystick.Joystick(0)
    joy.init()
    print(f"Joystick terdeteksi: {joy.get_name()}")
    print(f"  Jumlah axis   : {joy.get_numaxes()}")
    print(f"  Jumlah tombol : {joy.get_numbuttons()}")

    print("\n=== ROV Joystick Control ===")
    print("Stick kiri  : maju/mundur (atas/bawah) + yaw (kiri/kanan)")
    print("Stick kanan : naik/turun (atas/bawah)")
    print(f"Tombol {BUTTON_ARM_TOGGLE}    : toggle ARM/DISARM")
    print(f"Tombol {BUTTON_RELAY[0]}/{BUTTON_RELAY[1]}/{BUTTON_RELAY[2]}/{BUTTON_RELAY[3]} : toggle relay CH1/CH2/CH3/CH4")
    print(f"Tombol {BUTTON_QUIT} / ESC : keluar")
    print("Status awal: DISARMED | Semua relay OFF\n")

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setblocking(False)

    armed = False
    relay = [False, False, False, False]   # CH1..CH4

    prev_arm_button  = False
    prev_relay_button = [False] * 4
    running = True
    last_send = 0

    try:
        while running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                elif event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
                    running = False

            if pygame.joystick.get_count() == 0:
                print("\n[ERROR] Joystick terputus.")
                running = False
                break

            # Toggle arm (edge detection)
            arm_button = joy.get_button(BUTTON_ARM_TOGGLE)
            if arm_button and not prev_arm_button:
                armed = not armed
                print(f"\n[STATUS] {'ARMED' if armed else 'DISARMED'}")
            prev_arm_button = arm_button

            # Toggle relay CH1..CH4 (edge detection per tombol)
            for i, btn_idx in enumerate(BUTTON_RELAY):
                if btn_idx < joy.get_numbuttons():
                    btn = joy.get_button(btn_idx)
                    if btn and not prev_relay_button[i]:
                        relay[i] = not relay[i]
                        relay_str = "".join(str(int(x)) for x in relay)
                        print(f"\n[RELAY] CH{i+1} -> {'ON' if relay[i] else 'OFF'}  (R={relay_str})")
                    prev_relay_button[i] = btn

            if joy.get_button(BUTTON_QUIT):
                running = False
                break

            now = time.time()
            if now - last_send >= SEND_INTERVAL:
                last_send = now

                raw_fwd  = apply_deadzone(-joy.get_axis(AXIS_FWD))   # atas = maju
                raw_yaw  = apply_deadzone(joy.get_axis(AXIS_YAW))
                raw_vert = apply_deadzone(-joy.get_axis(AXIS_VERT))  # atas = naik

                fwd_val  = int(raw_fwd  * THROTTLE)
                yaw_val  = int(raw_yaw  * THROTTLE)
                vert_val = int(raw_vert * THROTTLE)
                armed_flag = 1 if armed else 0

                r = relay
                msg = (f"{fwd_val},{yaw_val},{vert_val},{armed_flag},"
                       f"{int(r[0])},{int(r[1])},{int(r[2])},{int(r[3])}")
                sock.sendto(msg.encode(), (ESP32_IP, ESP32_PORT))

                status = "ARMED" if armed_flag else "disarmed"
                relay_str = "".join(str(int(x)) for x in relay)
                print(f"\r[KIRIM] fwd={fwd_val:4d} yaw={yaw_val:4d} vert={vert_val:4d} [{status}] relay={relay_str}   ", end="")

            # Baca telemetry dari Mega (lewat ESP32), non-blocking
            try:
                data, _ = sock.recvfrom(1024)
                print(f"\n[TELEMETRY] {data.decode().strip()}")
            except BlockingIOError:
                pass

            pygame.time.wait(5)
    except KeyboardInterrupt:
        pass
    finally:
        # Kirim disarm + relay off 2x sebelum keluar
        safe = b"0,0,0,0,0,0,0,0"
        sock.sendto(safe, (ESP32_IP, ESP32_PORT))
        time.sleep(0.1)
        sock.sendto(safe, (ESP32_IP, ESP32_PORT))
        sock.close()
        pygame.joystick.quit()
        pygame.quit()
        print("\n\nDihentikan. Semua motor di-disarm, semua relay OFF.")


if __name__ == "__main__":
    main()
