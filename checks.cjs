const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Exercise the shipped interaction code without installing a browser or dependencies.
class Element {
  constructor(dataset = {}) { this.dataset = dataset; this.listeners = {}; this.children = []; this.attributes = {}; this.hidden = false; this.textContent = ''; this.style = {}; this.classes = new Set(); this.classList = { toggle: (name, active) => active ? this.classes.add(name) : this.classes.delete(name) }; }
  addEventListener(name, handler) { (this.listeners[name] ||= []).push(handler); }
  async emit(name, event = {}) { for (const handler of this.listeners[name] || []) await handler({ target: this, ...event }); }
  setAttribute(name, value) { this.attributes[name] = value; }
  getAttribute(name) { return this.attributes[name]; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  focus() { this.focused = true; }
  querySelectorAll() { return this.children; }
  showModal() { this.open = true; }
  close() { this.open = false; return this.emit('close'); }
}

(async () => {
  const root = __dirname;
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(x => x[1]);
  assert.equal(new Set(ids).size, ids.length, 'Unique element IDs');
  for (const [, link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (link.startsWith('#') && link.length > 1) assert(ids.includes(link.slice(1)), `Fragment exists: ${link}`);
    else if (!link.includes(':') && !link.startsWith('#')) assert(fs.existsSync(path.join(root, link)), `Asset exists: ${link}`);
  }
  const pdfs = fs.readdirSync(path.join(root, 'assets')).filter(x => x.endsWith('.pdf'));
  assert.equal(pdfs.length, 3);
  pdfs.forEach(file => assert.equal(fs.readFileSync(path.join(root, 'assets', file)).subarray(0, 5).toString(), '%PDF-'));

  const filters = ['all', 'technology', 'workplace', 'delivery'].map(filter => new Element({ filter }));
  const cards = ['technology', 'technology delivery', 'workplace', 'delivery'].map(category => new Element({ category }));
  const triggers = [...html.matchAll(/data-case="([^"]+)"/g)].map(x => new Element({ case: x[1] }));
  const elements = Object.fromEntries(ids.map(id => [id, new Element()]));
  const menu = new Element(); menu.setAttribute('aria-expanded', 'false');
  const mosaic = new Element();
  const document = {
    body: new Element(),
    querySelectorAll: selector => ({ '[data-filter]': filters, '.project-card': cards, '[data-case]': triggers })[selector],
    querySelector: selector => ({ '.seat-mosaic': mosaic, '.menu-toggle': menu })[selector],
    getElementById: id => elements[id],
    createElement: () => new Element(),
    addEventListener: () => {}
  };
  let copied = '';
  const navigator = { clipboard: { writeText: async value => { copied = value; } } };
  const context = { document, navigator, window: { matchMedia: () => ({ addEventListener: () => {} }) } };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'app.js'), 'utf8'), context);
  assert.equal(mosaic.children.length, 50, 'Occupancy illustration renders');
  for (const [index, expected] of [[1, 2], [2, 1], [3, 2], [0, 4]]) {
    await filters[index].emit('click');
    assert.equal(cards.filter(x => !x.hidden).length, expected, 'Correct filtered project count');
    assert.equal(filters.filter(x => x.getAttribute('aria-pressed') === 'true').length, 1);
  }
  for (const trigger of triggers) {
    await trigger.emit('click');
    assert.equal(elements['case-dialog'].open, true);
    assert(elements['case-content'].children.some(x => x.id === 'case-title' && x.textContent));
    assert.equal(document.body.style.overflow, 'hidden');
    await elements['close-dialog'].emit('click');
    assert.equal(elements['case-dialog'].open, false);
    assert.equal(document.body.style.overflow, '');
    assert(trigger.focused, 'Focus returns to case-study trigger');
  }
  await menu.emit('click');
  assert.equal(menu.getAttribute('aria-expanded'), 'true');
  assert.equal(elements['mobile-nav'].hidden, false);
  await menu.emit('click');
  assert.equal(elements['mobile-nav'].hidden, true);
  await elements['copy-email'].emit('click');
  assert.equal(copied, 'smuhammedkb@gmail.com');
  navigator.clipboard.writeText = async () => { throw Error('Clipboard unavailable'); };
  await elements['copy-email'].emit('click');
  assert(elements['copy-status'].textContent.includes('smuhammedkb@gmail.com'), 'Clipboard fallback remains useful');
  console.log('PASS: links, fragments, 3 CVs, all project filters, 4 case dialogs, focus return, mobile menu, clipboard and fallback.');
  console.log('Browser layout and rendering are not covered by this check.');
})().catch(error => { console.error(error); process.exitCode = 1; });
