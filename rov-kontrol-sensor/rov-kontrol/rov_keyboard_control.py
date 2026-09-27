"""
ROV Keyboard Control - PC -> ESP32 -> Arduino Mega
----------------------------------------------------
Kontrol ROV pakai keyboard, kirim perintah via UDP ke ESP32
dengan rate tetap (20Hz).

Tombol:
    W / S     : maju / mundur
    A / D     : yaw kiri / kanan
    SPASI     : naik
    C         : turun
    R         : toggle ARM / DISARM (default: DISARMED demi keamanan)
    1 / 2 / 3 / 4 : toggle relay CH1 / CH2 / CH3 / CH4
    Q / ESC   : keluar (otomatis kirim disarm + relay off sebelum menutup)

Install dulu:
    pip install pynput

Pastikan:
    - ESP32 sudah menjalankan sketch rov_bridge_esp32.ino
    - Arduino Mega sudah menjalankan sketch rov_control_mega.ino
    - PC sudah di-set IP statis 192.168.4.1 (subnet 255.255.255.0)
    - Kabel RJ45 sudah terpasang PC <-> W5500
"""

import socket
import time
import threading
from pynput import keyboard

ESP32_IP   = "192.168.4.2"
ESP32_PORT = 3333

SEND_RATE_HZ = 20
SEND_INTERVAL = 1.0 / SEND_RATE_HZ

THROTTLE = 100  # kekuatan maksimum, rentang -100..100

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.setblocking(False)

pressed_keys = set()
armed = False
relay = [False, False, False, False]   # CH1..CH4
running = True
lock = threading.Lock()


def on_press(key):
    global armed, running

    if key == keyboard.Key.esc:
        running = False
        return False

    try:
        k = key.char.lower()
    except AttributeError:
        k = key

    if k == 'q':
        running = False
        return False

    if k == 'r':
        with lock:
            armed = not armed
        print(f"\n[STATUS] {'ARMED' if armed else 'DISARMED'}")
        return

    # Toggle relay CH1..CH4 dengan tombol 1..4
    if k in ('1', '2', '3', '4'):
        idx = int(k) - 1
        with lock:
            relay[idx] = not relay[idx]
        with lock:
            status = relay[:]
        print(f"\n[RELAY] CH{idx+1} -> {'ON' if status[idx] else 'OFF'}  "
              f"(R1={int(status[0])} R2={int(status[1])} R3={int(status[2])} R4={int(status[3])})")
        return

    with lock:
        pressed_keys.add(k)


def on_release(key):
    try:
        k = key.char.lower()
    except AttributeError:
        k = key
    with lock:
        pressed_keys.discard(k)


def compute_command():
    with lock:
        keys = set(pressed_keys)
        is_armed = armed
        relay_state = relay[:]

    fwd = yaw = vert = 0

    if 'w' in keys:
        fwd += THROTTLE
    if 's' in keys:
        fwd -= THROTTLE
    if 'a' in keys:
        yaw -= THROTTLE
    if 'd' in keys:
        yaw += THROTTLE
    if keyboard.Key.space in keys:
        vert += THROTTLE
    if 'c' in keys:
        vert -= THROTTLE

    return fwd, yaw, vert, (1 if is_armed else 0), relay_state


def main():
    global running

    print("=== ROV Keyboard Control ===")
    print("W/S = maju/mundur | A/D = yaw kiri/kanan | SPASI = naik | C = turun")
    print("R = toggle ARM/DISARM | 1/2/3/4 = toggle relay CH1-CH4")
    print("Q / ESC = keluar")
    print("Status awal: DISARMED | Semua relay OFF\n")

    listener = keyboard.Listener(on_press=on_press, on_release=on_release)
    listener.start()

    last_send = 0
    try:
        while running:
            now = time.time()

            if now - last_send >= SEND_INTERVAL:
                last_send = now
                fwd, yaw, vert, armed_flag, relay_state = compute_command()
                r = relay_state
                msg = f"{fwd},{yaw},{vert},{armed_flag},{int(r[0])},{int(r[1])},{int(r[2])},{int(r[3])}"
                sock.sendto(msg.encode(), (ESP32_IP, ESP32_PORT))

                status = "ARMED" if armed_flag else "disarmed"
                relay_str = "".join(str(int(x)) for x in relay_state)
                print(f"\r[KIRIM] fwd={fwd:4d} yaw={yaw:4d} vert={vert:4d} [{status}] relay={relay_str}   ", end="")

            # Baca telemetry dari Mega (lewat ESP32), non-blocking
            try:
                data, _ = sock.recvfrom(1024)
                print(f"\n[TELEMETRY] {data.decode().strip()}")
            except BlockingIOError:
                pass

            time.sleep(0.005)
    except KeyboardInterrupt:
        pass
    finally:
        # Kirim disarm + relay off 2x sebelum keluar
        safe = b"0,0,0,0,0,0,0,0"
        sock.sendto(safe, (ESP32_IP, ESP32_PORT))
        time.sleep(0.1)
        sock.sendto(safe, (ESP32_IP, ESP32_PORT))
        listener.stop()
        sock.close()
        print("\n\nDihentikan. Semua motor di-disarm, semua relay OFF.")


if __name__ == "__main__":
    main()
