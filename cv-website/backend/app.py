"""Backend sederhana (Python + Flask) untuk menerima pesan dari form kontak CV.

Jalankan:
    pip install -r requirements.txt
    python app.py
Pesan tersimpan di backend/messages.json.
"""
import json
import re
from datetime import datetime
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # izinkan website (GitHub Pages) memanggil API ini

DATA_FILE = Path(__file__).parent / "messages.json"
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def load_messages():
    if DATA_FILE.exists():
        return json.loads(DATA_FILE.read_text(encoding="utf-8"))
    return []


@app.get("/api/health")
def health():
    return jsonify(status="ok")


@app.post("/api/contact")
def contact():
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    message = str(data.get("message", "")).strip()

    errors = {}
    if len(name) < 3:
        errors["name"] = "Nama minimal 3 karakter."
    if not EMAIL_RE.match(email):
        errors["email"] = "Format email tidak valid."
    if len(message) < 10:
        errors["message"] = "Pesan minimal 10 karakter."
    if errors:
        return jsonify(ok=False, errors=errors), 400

    messages = load_messages()
    messages.append({
        "name": name,
        "email": email,
        "message": message,
        "time": datetime.now().isoformat(timespec="seconds"),
    })
    DATA_FILE.write_text(json.dumps(messages, ensure_ascii=False, indent=2), encoding="utf-8")
    return jsonify(ok=True), 201


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
