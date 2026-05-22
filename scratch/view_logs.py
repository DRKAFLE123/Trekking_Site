import json

log_path = r"C:\Users\Dr.Kafle\.gemini\antigravity\brain\6a70f71a-e32b-4dc7-bdca-ead1c7cbfbda\.system_generated\logs\transcript.jsonl"

with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        data = json.loads(line)
        if data.get("step_index") == 1482:
            tool_calls = data.get("tool_calls")
            if tool_calls and len(tool_calls) > 0:
                args = tool_calls[0].get("args")
                rep_content = args.get("ReplacementContent")
                if rep_content:
                    clean_code = rep_content.replace('\\n', '\n').replace('\\"', '"').replace('\\\\', '\\')
                    print(clean_code)
