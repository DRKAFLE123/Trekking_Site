import json

log_path = r"C:\Users\Dr.Kafle\.gemini\antigravity\brain\6a70f71a-e32b-4dc7-bdca-ead1c7cbfbda\.system_generated\logs\transcript.jsonl"

with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
    for i, line in enumerate(f):
        if "officiallogo.jpeg" in line or "logo.png" in line or "Nature Heaven" in line:
            if "Navbar.tsx" in line:
                print(f"Match found at line {i}: {line[:300]}")
