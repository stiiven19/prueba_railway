import json
from unidecode import unidecode

def clean_json_data(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
        data = json.load(f)
    
    def clean_string(obj):
        if isinstance(obj, str):
            return unidecode(obj)
        elif isinstance(obj, dict):
            return {k: clean_string(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [clean_string(item) for item in obj]
        return obj
    
    cleaned_data = clean_string(data)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(cleaned_data, f, indent=2, ensure_ascii=False)

clean_json_data('db_backup.json', 'db_backup_cleaned.json')