import os
import re

dirs = [
    r"C:\Users\Dr.Kafle\.gemini\antigravity\brain\6a70f71a-e32b-4dc7-bdca-ead1c7cbfbda\scratch",
    r"e:\Projects\TrekkingWebsite\summit-trail-trekking\scratch"
]

print("Scanning scratch directories...")
for d in dirs:
    if not os.path.exists(d):
        continue
    for f in os.listdir(d):
        if f.endswith('.txt') or f.endswith('.md') or f.endswith('.js') or f.endswith('.py'):
            path = os.path.join(d, f)
            try:
                with open(path, 'r', encoding='utf-8') as file:
                    content = file.read()
                    if 'section 11' in content.lower():
                        print(f"Found in: {path}")
                        for match in re.finditer(r'section\s*11', content, re.IGNORECASE):
                            start = max(0, match.start() - 200)
                            end = min(len(content), match.end() + 1000)
                            print(content[start:end])
                            print("="*60)
            except Exception as e:
                pass
