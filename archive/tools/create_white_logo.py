with open('images/logo.svg', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('.logo-black { fill: #000000;', '.logo-black { fill: #ffffff;')

with open('images/logo-white.svg', 'w', encoding='utf-8') as f:
    f.write(content)

print("Created images/logo-white.svg successfully.")
