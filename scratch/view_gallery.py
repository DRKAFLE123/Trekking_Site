with open("components/TrekDetailClient.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

print("galleryList searches in TrekDetailClient.tsx:")
for idx, line in enumerate(lines):
    if "gallerylist" in line.lower():
        print(f"L{idx+1}: {line.strip()}")
