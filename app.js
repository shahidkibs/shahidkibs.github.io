'use strict';

const caseStudies = {
  erp: {
    title: 'An ERP built around the operation.',
    subtitle: 'Tensorbot Innovations · Head of Operations · Oct 2024 – Sep 2026',
    stats: [['80%', 'staff adoption'], ['20 / 25', 'staff using the ERP'], ['₹4.8L', 'estimated annual admin savings']],
    context: 'A 25-person technology company needed connected tools for project tracking, inventory, procurement and accounts. The opportunity was to build a system around the team’s operational needs.',
    ownership: 'I designed, built and deployed an in-house ERP using AI tools, Supabase and Vercel, combining operational ownership with hands-on systems implementation.',
    actions: ['Connected projects, inventory, procurement and accounts in the internal ERP.', 'Used the ERP and Google Apps Script to automate project tracking and finance workflows.', 'Supported adoption across the business and replaced a paid ERP subscription.'],
    outcome: 'The ERP reached 80% staff adoption (20 of 25). The automation work avoided two additional admin hires, with estimated savings of about INR 4.8 lakh per year, as recorded in my CV.',
    relevance: 'Business systems implementation, process improvement, workflow automation and user adoption.',
    source: 'Source: Operations CV. The module graphic on this site is an explanatory illustration, not a screenshot of the production ERP.'
  },
  technical: {
    title: 'Technical understanding. Delivery ownership.',
    subtitle: 'Tensorbot Innovations · Head of Operations · Oct 2024 – Sep 2026',
    stats: [['10', 'technical projects'], ['₹20L+', 'combined client project value, INR'], ['40%', 'shorter project completion time']],
    context: 'Tensorbot delivered IoT, embedded, AI and automation projects for business clients, requiring coordination between client expectations, technical teams, suppliers and budgets.',
    ownership: 'I owned operations, client communication, budgets, revenue tracking and accounts, reporting directly to the founder. I led rotating teams of two to three from a pool of five.',
    actions: ['Coordinated delivery of 10 projects for 10 clients across IoT, embedded, AI and automation.', 'Evaluated and selected 10–15 vendors and suppliers for client projects.', 'Streamlined project tracking through internal systems and authored 15 SOPs covering operations, finance, accounts and inventory.', 'Delivered seven paid five-day Embedded Systems workshops for 260 students across two colleges; co-built and administered an internal LMS module.'],
    outcome: 'Delivered technical projects with a combined value above INR 20 lakh. Streamlined project tracking reduced project completion time by 40%, as recorded in my CV.',
    relevance: 'Technology operations, technical project coordination, client delivery and cross-functional team management.',
    source: 'Source: Operations CV. Project-specific technical designs and client materials are not published here.'
  },
  atomic: {
    title: 'A workplace built to run well.',
    subtitle: 'The Atomic · Noster Associates · Head of Operations · Sep 2022 – Sep 2024',
    stats: [['40,000', 'sq ft workplace'], ['500', 'seat capacity'], ['90%', 'occupancy within 12 months']],
    context: 'The Atomic was a 40,000 sq ft, 500-seat coworking facility serving multiple businesses, with interconnected needs across member experience, facilities, safety, vendors and IT.',
    ownership: 'I launched and ran the facility with the owners, reporting to the Directors as the sole facility manager. I supervised a facility supervisor and front desk manager and coordinated more than 10 on-site staff.',
    actions: ['Managed eight operational vendors and more than 10 maintenance contractors across agreements, SLAs and preventive maintenance.', 'Managed lease, insurance, licence and permit renewals and liaised with the landlord and building management.', 'Maintained fire safety inspections, digital records and two drills a year; passed the external fire and safety department inspection.', 'Selected, configured and deployed Zoho CRM, trained the team, and handled IT and networking.', 'Authored 20 SOPs and organised monthly member meetups and celebrations.'],
    outcome: 'Reached 90% occupancy within 12 months, serving 450+ members across 20+ companies. The CV records INR 6 crore in facility revenue over two years.',
    relevance: 'Operational scale, service delivery, vendor management, stakeholder coordination and technology adoption.',
    source: 'Source: Workplace Operations CV. The occupancy visual illustrates the reported percentage; it is not a live occupancy feed.'
  },
  fitout: {
    title: 'From scope to a working workplace.',
    subtitle: 'Noster Associates · Operations Manager · Mar 2020 – Aug 2022',
    stats: [['7', 'office interior projects'], ['₹5.6Cr', 'combined project value, INR'], ['₹3Cr', 'The Atomic fit-out value, INR']],
    context: 'Office fit-out delivery required coordination across clients, budgets and specialist contractors, with each trade contributing to a functioning workplace at handover.',
    ownership: 'I directed seven office interior projects end to end across client coordination, budget and vendors, including The Atomic fit-out.',
    actions: ['Coordinated eight or more contractors and vendors per project across civil, MEP, finishes and IT trades.', 'Supervised civil works, flooring, partitions, plumbing, electrical and network routing, HVAC ducts, furniture and device configuration.', 'Coordinated testing and handover and maintained drawings, approvals, test reports and handover documents.'],
    outcome: 'Delivered seven office interior projects with a combined value of INR 5.6 crore, including The Atomic’s INR 3 crore fit-out.',
    relevance: 'Multi-vendor coordination, project planning, scope ownership, technical interfaces and handover discipline.',
    source: 'Source: Operations and Project Management CVs. The plan shown on the site is a conceptual illustration, not an actual project drawing.'
  }
};

const filters = [...document.querySelectorAll('[data-filter]')];
const projectCards = [...document.querySelectorAll('.project-card')];
filters.forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  filters.forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  projectCards.forEach(card => {
    const visible = selected === 'all' || card.dataset.category.split(' ').includes(selected);
    card.hidden = !visible;
    if (visible) count++;
  });
  document.getElementById('filter-status').textContent = `Showing ${count} ${count === 1 ? 'project' : 'projects'}${selected === 'all' ? ' across all work' : ` in ${button.textContent.trim()}`}.`;
}));

const mosaic = document.querySelector('.seat-mosaic');
for (let i = 0; i < 50; i++) mosaic.append(document.createElement('span'));

const dialog = document.getElementById('case-dialog');
const content = document.getElementById('case-content');
let previousFocus = null;
function addText(tag, text, className) {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
}
function openCase(id, trigger) {
  const data = caseStudies[id];
  if (!data) return;
  previousFocus = trigger;
  content.replaceChildren();
  const title = addText('h2', data.title);
  title.id = 'case-title';
  content.append(title, addText('p', data.subtitle, 'case-subtitle'));
  const stats = document.createElement('div');
  stats.className = 'case-stats';
  data.stats.forEach(([value, label]) => {
    const item = document.createElement('div');
    item.append(addText('strong', value), addText('span', label));
    stats.append(item);
  });
  content.append(stats);
  [['The context', data.context], ['My responsibility', data.ownership]].forEach(([heading, body]) => content.append(addText('h3', heading), addText('p', body)));
  content.append(addText('h3', 'What I did'));
  const list = document.createElement('ul');
  data.actions.forEach(action => list.append(addText('li', action)));
  content.append(list);
  [['The outcome', data.outcome], ['What this demonstrates', data.relevance]].forEach(([heading, body]) => content.append(addText('h3', heading), addText('p', body)));
  content.append(addText('p', data.source, 'case-source'));
  dialog.showModal();
  document.body.style.overflow = 'hidden';
  dialog.scrollTop = 0;
}
document.querySelectorAll('[data-case]').forEach(button => button.addEventListener('click', () => openCase(button.dataset.case, button)));
document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  if (previousFocus) previousFocus.focus();
});

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  mobileNav.hidden = true;
}
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  mobileNav.hidden = expanded;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width:621px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

document.getElementById('copy-email').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText('smuhammedkb@gmail.com');
    status.textContent = 'Email copied. Let’s connect.';
  } catch {
    status.textContent = 'You can copy this address: smuhammedkb@gmail.com';
  }
});
