from flask import Flask, request, jsonify, send_from_directory
import serial
import os

app = Flask(__name__)

# =====================
# CONFIG — ADJUST THESE
# =====================

PORT = 8000

# macOS example:
# run: ls /dev/tty.usb*
SERIAL_PORT = "/dev/cu.usbmodem22527826842"  # ⬅ CHANGE THIS
BAUD_RATE = 115200

# Vite build output folder
WEB_DIR = os.path.join(os.path.dirname(__file__), "build")

# =====================
# SERIAL SETUP
# =====================

ser = None
try:
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
    print(f"[OK] Serial open: {SERIAL_PORT} @ {BAUD_RATE}")
except Exception as e:
    print(f"[WARN] Serial not available: {e}")

# =====================
# STATIC FILES Test
# =====================

@app.route("/")
def index():
    return send_from_directory(WEB_DIR, "index.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(WEB_DIR, path)

# =====================
# API: WEB → ARDUINO
# =====================

@app.route("/state", methods=["POST"])
def receive_state():
    data = request.get_json(silent=True) or {}

    try:
        flower_state = int(str(data.get("value", "")).strip())
    except Exception:
        return jsonify({"error": "Invalid value"}), 400

    print("Flower state received:", flower_state)
    print("Serial connected:", bool(ser))

    if ser:
        try:
            ser.write(f"{flower_state}\n".encode("utf-8"))
        except Exception as e:
            return jsonify({"error": f"Serial write failed: {e}"}), 500

    return jsonify({"status": "ok"})

# =====================
# START SERVER
# =====================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT)
