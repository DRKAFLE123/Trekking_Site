with open("components/TrekDetailClient.tsx", "r", encoding="utf-8", errors="ignore") as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    line_lower = line.lower()
    if "discoveryworldtrekking" in line_lower or "paul" in line_lower or "gurung" in line_lower or "977984" in line_lower:
        print(f"Line {idx+1}: {line.strip()}")
