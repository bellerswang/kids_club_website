import os
import re

def replace_logos_in_file(file_path):
    print(f"Processing {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Header logo regex (with or without id="header-logo")
    header_pattern = re.compile(
        r'<a\s+href="index\.html"\s+class="brand-logo"(\s+id="header-logo")?>\s*<div\s+class="logo-icon">F</div>\s*<div\s+class="logo-text">飞跃未来<span>少儿学院</span></div>\s*</a>',
        re.MULTILINE
    )
    
    def header_repl(match):
        id_part = match.group(1) if match.group(1) else ""
        return (
            f'<a href="index.html" class="brand-logo"{id_part}>\n'
            f'        <img src="images/logo.svg" alt="飞跃未来少儿学院 Sunbridge" class="light-logo">\n'
            f'        <img src="images/logo-white.svg" alt="飞跃未来少儿学院 Sunbridge" class="dark-logo">\n'
            f'      </a>'
        )
        
    content, count1 = header_pattern.subn(header_repl, content)
    
    # 2. Footer logo regex
    footer_pattern = re.compile(
        r'<a\s+href="index\.html"\s+class="brand-logo"\s+style="color:\s*#fff;">\s*<div\s+class="logo-icon">F</div>\s*<div\s+class="logo-text">飞跃未来<span>少儿学院</span></div>\s*</a>',
        re.MULTILINE
    )
    
    footer_repl = (
        '<a href="index.html" class="brand-logo" style="color: #fff;">\n'
        '          <img src="images/logo-white.svg" alt="飞跃未来少儿学院 Sunbridge">\n'
        '        </a>'
    )
    
    content, count2 = footer_pattern.subn(footer_repl, content)
    
    if count1 > 0 or count2 > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  Updated: {count1} header logo(s), {count2} footer logo(s).")
    else:
        print("  No changes made.")

if __name__ == "__main__":
    files = [
        "index.html",
        "badminton.html",
        "academics.html",
        "programming.html",
        "about.html",
        "contact.html",
        "auth.html",
        "dashboard.html"
    ]
    for fn in files:
        if os.path.exists(fn):
            replace_logos_in_file(fn)
        else:
            print(f"File {fn} does not exist!")
