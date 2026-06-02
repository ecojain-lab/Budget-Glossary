/* modal.js — 용어 상세 모달
   - 해시 라우팅: #term/<id>
   - 포커스 트랩
   - ESC / 배경 클릭 / X 버튼 닫기
   ---------------------------------------------------------- */
(function () {
  'use strict';

  const modal = () => document.getElementById('modal');
  let lastFocus = null;

  function open(termId) {
    const D = window.DICT || { terms: [] };
    const t = D.terms.find(x => x.id === termId);
    if (!t) return;
    if (location.hash !== '#term/' + termId) {
      history.replaceState(null, '', '#term/' + termId);
    }
    render(t);
    const m = modal();
    m.hidden = false;
    lastFocus = document.activeElement;
    setTimeout(() => {
      const panel = m.querySelector('.modal__panel');
      if (panel) panel.focus();
    }, 50);
    document.body.style.overflow = 'hidden';
  }

  function close() {
    const m = modal();
    if (!m || m.hidden) return;
    m.hidden = true;
    document.body.style.overflow = '';
    if (location.hash.startsWith('#term/')) {
      history.replaceState(null, '', location.pathname + location.search);
    }
    if (lastFocus && lastFocus.focus) {
      try { lastFocus.focus(); } catch (_) {}
    }
  }

  function render(t) {
    const D = window.DICT || { meta: {} };
    const cat = D.meta.categories ? D.meta.categories[t.category] : null;
    const sub = D.meta.subcategories ? D.meta.subcategories[t.subcategory] : null;

    setText('modalTitle', t.term);
    setText('modalSummary', t.summary || '');
    setText('modalDetail', t.detail || '');

    const altParts = [];
    if (t.hanja) altParts.push(`<span class="hanja">${escapeHtml(t.hanja)}</span>`);
    if (t.termEn) altParts.push(`<span class="en">${escapeHtml(t.termEn)}</span>`);
    setHTML('modalAlt', altParts.join(' <span class="sep">·</span> '));

    const tag = document.getElementById('modalCatTag');
    if (tag) {
      if (cat) {
        tag.textContent = `${cat.icon || ''} ${cat.name}${sub ? '-' + sub.name : ''}`;
        tag.style.setProperty('--cat-color', cat.color + '22');
        tag.style.setProperty('--cat-text', cat.color);
        tag.hidden = false;
      } else {
        tag.hidden = true;
      }
    }

    const exWrap = document.getElementById('modalExamplesWrap');
    const exList = document.getElementById('modalExamples');
    if (t.examples && t.examples.length) {
      exList.innerHTML = t.examples.map(e => `<li>${escapeHtml(e)}</li>`).join('');
      exWrap.hidden = false;
    } else { exWrap.hidden = true; }

    const relWrap = document.getElementById('modalRelatedWrap');
    const relChips = document.getElementById('modalRelated');
    if (t.related && t.related.length) {
      const D2 = window.DICT || { terms: [] };
      relChips.innerHTML = t.related.map(id => {
        const r = D2.terms.find(x => x.id === id);
        const label = r ? r.term : id;
        return `<button class="modal__chip" data-term="${escapeHtml(id)}" type="button">${escapeHtml(label)}</button>`;
      }).join('');
      relWrap.hidden = false;
      relChips.querySelectorAll('.modal__chip').forEach(btn => {
        btn.addEventListener('click', () => open(btn.dataset.term));
      });
    } else { relWrap.hidden = true; }

    const srcWrap = document.getElementById('modalSourcesWrap');
    const src = document.getElementById('modalSources');
    if (t.sources && t.sources.length) {
      src.textContent = t.sources.join(' · ');
      srcWrap.hidden = false;
    } else { srcWrap.hidden = true; }
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
  function setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function bind() {
    const m = modal();
    if (!m) return;
    m.addEventListener('click', e => {
      if (e.target && e.target.dataset && e.target.dataset.close === 'true') close();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !m.hidden) close();
    });
    window.addEventListener('hashchange', () => {
      const m2 = modal();
      if (m2 && m2.hidden && location.hash.startsWith('#term/')) {
        open(location.hash.replace('#term/', ''));
      } else if (m2 && !m2.hidden && !location.hash.startsWith('#term/')) {
        close();
      }
    });
  }

  window.Modal = { open, close, bind };
})();
