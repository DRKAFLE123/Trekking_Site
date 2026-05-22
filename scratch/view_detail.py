with open("components/TrekDetailClient.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

print("Image and title searches in TrekDetailClient.tsx:")
count = 0
for idx, line in enumerate(lines):
    if "<Image" in line or "breadcrumb" in line.lower() or "h1" in line.lower() or "rating" in line.lower() or "tabs" in line.lower():
        if idx < 750:
            print(f"L{idx+1}: {line.strip()}")
            count += 1
            if count > 50:
                break
