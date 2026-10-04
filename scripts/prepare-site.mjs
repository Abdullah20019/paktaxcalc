import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
if (!existsSync(join(root, 'css', 'tailwind.generated.css'))) {
  throw new Error('Run npm run build:css before preparing HTML.');
}

function htmlFiles(dir) {
  return readdirSync(dir).filter((name) => name.endsWith('.html')).map((name) => join(dir, name));
}

for (const file of [...htmlFiles(root), ...htmlFiles(join(root, 'blog'))]) {
  let html = readFileSync(file, 'utf8');
  const original = html;
  const cssPath = file.startsWith(join(root, 'blog')) ? '../css/tailwind.generated.css' : 'css/tailwind.generated.css';
  html = html.replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/g, `<link rel="stylesheet" href="${cssPath}">`);
  html = html.replaceAll("Pakistan's most trusted free tax calculator platform.", 'Free Pakistan tax calculators and guides.');
  html = html.replaceAll("Pakistan's most trusted tax calculator platform.", 'Free Pakistan tax calculators and guides.');
  if (!html.includes('G-SQ6C7S157Q')) {
    const analytics = `    <script async src="https://www.googletagmanager.com/gtag/js?id=G-SQ6C7S157Q"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-SQ6C7S157Q');
    </script>
`;
    html = html.replace('</head>', analytics + '</head>');
  }
  const adsenseClient = 'ca-pub-2426410046563968';
  if (!html.includes(`adsbygoogle.js?client=${adsenseClient}`)) {
    const adsense = `    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}" crossorigin="anonymous"></script>\n`;
    html = html.replace('</head>', adsense + '</head>');
  }
  if (file === join(root, 'index.html')) {
    const startMarker = '<!-- How It Works Section - SEO Content -->';
    const endMarker = '<!-- Calculators Section -->';
    const insertMarker = '        <div class="max-w-6xl mx-auto mt-12">\n            <div class="text-center mb-8">\n                <h2 class="text-3xl md:text-4xl font-bold text-white mb-3">Other Calculators</h2>';
    const start = html.indexOf(startMarker);
    const end = html.indexOf(endMarker, start);
    const insert = html.indexOf(insertMarker);
    if (start >= 0 && end > start && insert > end) {
      const howItWorks = html.slice(start, end);
      html = html.slice(0, start) + html.slice(end);
      const newInsert = html.indexOf(insertMarker);
      html = html.slice(0, newInsert) + howItWorks + html.slice(newInsert);
    }
    html = html.replace(/\s*<link rel="preconnect" href="https:\/\/cdn\.tailwindcss\.com">/, '');
    html = html.replace('<!-- Tailwind CSS CDN -->', '<!-- Precompiled Tailwind CSS -->');
  }
  if (html !== original) writeFileSync(file, html);
}
