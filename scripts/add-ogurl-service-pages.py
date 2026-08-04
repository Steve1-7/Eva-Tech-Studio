from pathlib import Path
import re

base = Path('app/services')
files = list(base.rglob('page.tsx'))

for path in files:
    text = path.read_text(encoding='utf-8')
    if 'ogUrl(' in text:
        continue

    changed = False
    if "import { canonicalUrl } from '@/lib/metadata'" in text and "import { ogUrl } from '@/lib/og'" not in text:
        text = text.replace("import { canonicalUrl } from '@/lib/metadata'\n", "import { canonicalUrl } from '@/lib/metadata'\nimport { ogUrl } from '@/lib/og'\n")
        changed = True

    title_match = re.search(r"title: '([^']+)'", text)
    desc_match = re.search(r"description: '([^']+)'", text)
    og_match = re.search(r"openGraph: \{([^}]*)\}", text, re.S)

    if not title_match or not desc_match or not og_match:
        print(f'SKIP {path} — missing metadata or openGraph')
        continue

    title = title_match.group(1)
    desc = desc_match.group(1)

    og_block = og_match.group(0)
    if 'image:' in og_block:
        continue

    replacement = og_block[:-2] + f", image: ogUrl('{title}','{desc}') }}"
    text = text.replace(og_block, replacement)
    path.write_text(text, encoding='utf-8')
    print(f'UPDATED {path}')
    changed = True

if not changed:
    print('No files changed.')
