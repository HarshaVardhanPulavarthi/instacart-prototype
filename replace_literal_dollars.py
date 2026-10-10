import os
import re

files_to_check = [
    'src/components/new/LiveBasket.tsx',
    'src/components/new/HeroScenario.tsx',
    'src/components/new/QuantityDemo.tsx',
    'src/components/new/IntentReceipt.tsx'
]

for filepath in files_to_check:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        # We want to replace '$' with '₹' ONLY when it's outside of `${`
        # A simple hack: replace all '$', then fix '${'
        new_content = content.replace('$', '₹')
        new_content = new_content.replace('₹{', '${')
        
        if new_content != content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Fixed {filepath}")
