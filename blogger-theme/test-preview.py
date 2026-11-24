import sys
from playwright.sync_api import sync_playwright

BASE = 'http://127.0.0.1:4301/preview/'
fail = []

def check(cond, msg):
    print(('ok   ' if cond else 'FAIL ') + msg)
    if not cond:
        fail.append(msg)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])

    for page_name in ['index.html', 'home.html']:
        for width, height in [(390, 844), (768, 1024), (1280, 900)]:
            page = b.new_page(viewport={'width': width, 'height': height})
            errors = []
            page.on('pageerror', lambda e: errors.append(str(e)))
            page.on('console', lambda m: errors.append(m.text) if (m.type == 'error' and 'favicon' not in m.text and '404' not in m.text) else None)
            page.goto(BASE + page_name, wait_until='networkidle')
            page.wait_for_timeout(800)
            overflow = page.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')
            check(overflow <= 1, f'{page_name} {width}px no horizontal overflow (got {overflow})')
            check(not errors, f'{page_name} {width}px no console errors {errors[:2]}')
            page.close()

    page = b.new_page(viewport={'width': 1280, 'height': 900})
    page.goto(BASE + 'index.html', wait_until='networkidle')
    page.wait_for_timeout(600)
    toc = page.eval_on_selector('.aToc', 'el => el.querySelectorAll("a").length')
    check(toc >= 8, f'TOC populated ({toc} links)')
    ld = page.evaluate('[...document.querySelectorAll("script[type=\'application/ld+json\']")].map(s=>{try{return JSON.parse(s.textContent)["@type"]}catch(e){return "bad"}})')
    check('FAQPage' in ld, f'FAQ JSON-LD injected ({ld})')
    rt = page.inner_text('[data-reading-time]')
    check('دقيقة' in rt, f'reading time rendered ({rt})')
    copies = page.locator('.copy-code').count()
    check(copies >= 1, f'copy buttons added ({copies})')

    # dark mode toggle
    page.click('[data-toggle="theme"]')
    page.click('[data-mode-option="dark"]')
    mode = page.get_attribute('html', 'data-mode')
    bg = page.evaluate('getComputedStyle(document.body).backgroundColor')
    check(mode == 'dark' and bg in ('rgb(26, 26, 26)',), f'dark mode applies ({mode}, {bg})')

    # accent
    page.click('[data-accent-option="violet"]')
    accent = page.evaluate('getComputedStyle(document.documentElement).getPropertyValue("--mw-accent").trim()')
    check(accent == '#c084fc', f'accent switches in dark mode ({accent})')

    # language
    page.click('[data-toggle="lang"]')
    page.click('[data-lang-option="en"]')
    lang = page.get_attribute('html', 'lang')
    direction = page.get_attribute('html', 'dir')
    home_text = page.inner_text('.breadcrumb a span')
    check(lang == 'en' and direction == 'ltr' and home_text == 'Home', f'language switch ({lang}/{direction}/{home_text})')
    page.close()

    b.close()

print('\n%d failure(s)' % len(fail))
sys.exit(1 if fail else 0)
