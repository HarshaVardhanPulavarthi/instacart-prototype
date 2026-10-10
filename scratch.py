import os
import re

classes = set()
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx'):
            with open(os.path.join(root, file), 'r') as f:
                content = f.read()
                matches = re.findall(r'className="([^"]+)"', content)
                for match in matches:
                    for cls in match.split():
                        classes.add(cls)

print(" ".join(sorted(classes)))
