import os

search_term = "Ama Dablam"
exclude_dirs = { "node_modules", ".next", ".git" }

for root, dirs, files in os.walk("e:\\Projects\\TrekkingWebsite"):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        if file.endswith(('.txt', '.md', '.js', '.ts', '.tsx', '.json', '.html')):
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if search_term in content:
                        print(f"Found search term in: {file_path}")
            except Exception as e:
                pass
