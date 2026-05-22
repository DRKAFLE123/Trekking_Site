with open("components/TrekDetailClient.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

print("Section references and header comments in TrekDetailClient.tsx:")
for idx, line in enumerate(lines):
    if "ref={secRefs" in line or "/* Section" in line or "h2 className=" in line:
        if idx > 600:
            print(f"L{idx+1}: {line.strip()}")
