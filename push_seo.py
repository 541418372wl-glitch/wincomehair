import json, base64, subprocess, os

files = {
    'src/App.jsx': 'add Breadcrumb component to app layout',
    'src/components/SEO.jsx': 'add Open Graph and Twitter Card meta tags',
    'src/components/Breadcrumb.jsx': 'add breadcrumb navigation with schema',
    'src/pages/FAQ.jsx': 'add FAQPage JSON-LD structured data',
    'public/robots.txt': 'allow AI crawler bots (GPTBot, CCBot, Perplexity)',
    'public/llms.txt': 'create llms.txt for AI model discovery',
}
base = r'E:\accio work\wincomehair'
owner = '541418372wl-glitch'
repo = 'wincomehair'

for path, msg in files.items():
    local = os.path.join(base, path)
    with open(local, 'r', encoding='utf-8') as f:
        new_content = f.read()
    b64 = base64.b64encode(new_content.encode('utf-8')).decode('ascii')

    r = subprocess.run(['gh', 'api', f'repos/{owner}/{repo}/contents/{path}'],
                       capture_output=True, text=True)
    sha = json.loads(r.stdout).get('sha') if r.returncode == 0 else None

    body = {'message': msg, 'content': b64, 'branch': 'main'}
    if sha:
        body['sha'] = sha

    tmp = os.path.join(os.environ['TEMP'], f'gh-seo-{path.replace("/","-")}.json')
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(body, f)

    r2 = subprocess.run(['gh', 'api', f'repos/{owner}/{repo}/contents/{path}',
                         '--method', 'PUT', '--input', tmp],
                        capture_output=True, text=True)
    print(f'{path}: ok' if r2.returncode == 0 else f'{path}: FAIL {r2.stderr[:200]}')
    os.remove(tmp)

print('All done - Vercel deploying')
