from pathlib import Path
p=Path(r'c:/Users/bhavy/Downloads/backend venture/.gitignore')
for enc in ('utf-8','utf-16','utf-16-le','utf-16-be','latin-1'):
    try:
        text=p.read_text(encoding=enc)
        print('ENCODING_DETECTED:',enc)
        print(text)
        break
    except Exception as e:
        print('FAILED',enc,e)
