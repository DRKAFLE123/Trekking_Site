with open("components/TrekDetailClient.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

print("Sidebar elements in TrekDetailClient.tsx:")
count = 0
for idx, line in enumerate(lines):
    if "sidebar" in line.lower() or "similar" in line.lower() or "price" in line.lower() or "enquiry" in line.lower():
        if idx > 1100:
            print(f"L{idx+1}: {line.strip()}")
            count += 1
            if count > 50:
                break
