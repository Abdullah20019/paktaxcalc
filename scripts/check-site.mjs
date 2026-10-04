import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import vm from 'node:vm';

const root = resolve(import.meta.dirname, '..');
const pages = [root, join(root, 'blog')].flatMap((dir) =>
  readdirSync(dir).filter((name) => name.endsWith('.html')).map((name) => join(dir, name))
);
assert.equal(pages.length, 75);

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  assert(!html.includes('cdn.tailwindcss.com'), `Development CDN remains: ${page}`);
  const css = html.match(/<link rel="stylesheet" href="([^"]*tailwind\.generated\.css)">/);
  assert(css, `Missing generated CSS: ${page}`);
  assert(existsSync(resolve(page, '..', css[1])), `Broken CSS path: ${page}`);
  assert(html.includes('G-SQ6C7S157Q'), `Missing GA4 tag: ${page}`);
  const head = html.split('</head>')[0];
  const adsenseSnippet = 'adsbygoogle.js?client=ca-pub-2426410046563968';
  assert.equal(head.split(adsenseSnippet).length - 1, 1, `AdSense snippet must appear once in <head>: ${page}`);
  for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (script[1].includes('json')) JSON.parse(script[2]);
    else if (!script[1].includes('src=')) new vm.Script(script[2], { filename: page });
  }
  for (const link of html.matchAll(/\bhref=["']([^"']+)["']/g)) {
    const href = link[1];
    if (/^(https?:|mailto:|tel:|#|javascript:|data:)/.test(href)) continue;
    const path = href.split(/[?#]/)[0];
    if (!path) continue;
    let target = path.startsWith('/') ? join(root, path) : resolve(page, '..', path);
    if (path.endsWith('/')) target = join(target, 'index.html');
    assert(existsSync(target), `Broken internal link: ${page} -> ${href}`);
  }
}

const home = readFileSync(join(root, 'index.html'), 'utf8');
assert(home.indexOf('<!-- Calculators Section -->') < home.indexOf('<!-- How It Works Section - SEO Content -->'));
assert(home.indexOf('<!-- How It Works Section - SEO Content -->') < home.indexOf('Other Calculators'));
const start = home.indexOf('const CURRENT_EOBI_MINIMUM_PENSION =');
const end = home.indexOf('// PTA Tax Calculator', start);
assert(start > 0 && end > start);

function salaryEstimate(salary, year, period, provident = 0, eobi = 0) {
  const elements = new Map();
  for (const [id, value] of Object.entries({
    monthlySalary: salary, annualBonus: 0, providentFund: provident,
    salaryTaxYear: year, salaryInputPeriod: period, eobi
  })) elements.set(id, { value });
  for (const id of ['salary-grossAnnual', 'salary-annualTax', 'salary-monthlyTax', 'salary-monthlyDeductions', 'salary-netMonthly', 'salary-effectiveRate']) {
    elements.set(id, { textContent: '' });
  }
  elements.set('salary-slabBreakdown', {
    children: [], replaceChildren() { this.children = []; },
    append(child) { this.children.push(child); },
    get childElementCount() { return this.children.length; }
  });
  const context = {
    document: {
      getElementById: (id) => elements.get(id),
      createElement: () => ({ append() {} })
    },
    formatNumber: (number) => number.toLocaleString('en-PK')
  };
  vm.createContext(context);
  vm.runInContext(home.slice(start, end) + '\ncalculateSalaryTax();', context);
  return Object.fromEntries([...elements].map(([key, element]) => [key, element.textContent]));
}

assert.equal(salaryEstimate(100000, '2027', 'monthly')['salary-annualTax'], 'Rs. 6,000');
assert.equal(salaryEstimate(150000, '2027', 'monthly')['salary-annualTax'], 'Rs. 72,000');
assert.equal(salaryEstimate(1800000, '2027', 'annual')['salary-monthlyTax'], 'Rs. 6,000');
assert.equal(salaryEstimate(200000, '2027', 'monthly')['salary-annualTax'], 'Rs. 156,000');
assert.equal(salaryEstimate(200000, '2026', 'monthly')['salary-annualTax'], 'Rs. 162,000');
assert.equal(salaryEstimate(150000, '2027', 'monthly', 10, 407)['salary-annualTax'], 'Rs. 72,000');

console.log(`Checked ${pages.length} pages, inline scripts, JSON-LD, CSS paths, section order and salary examples.`);
