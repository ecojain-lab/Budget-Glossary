/* app.js — 메인 컨트롤러
   - 데이터 로드 후 6대분류 아코디언 렌더
   - 검색·필터·초성 변경 시 결과 재렌더
   - 용어 클릭 시 모달 오픈
   ---------------------------------------------------------- */
(function () {
  'use strict';

  let activeTermId = null;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function renderCategories() {
    const D = window.DICT;
    if (!D || !D.loaded) return;
    const root = document.getElementById('categories');
    if (!root) return;
    const cats = D.meta.categories;
    const subs = D.meta.subcategories;
    const termsByCat = groupTerms(D.terms, 'category');

    const frag = document.createDocumentFragment();
    Object.values(cats).forEach(cat => {
      const catTerms = termsByCat[cat.id] || [];
      const subsInCat = Object.values(subs).filter(s => s.cat === cat.id);

      const details = document.createElement('details');
      details.className = 'cat-card';
      details.dataset.cat = cat.id;
      details.open = false;

      details.style.setProperty('--cat-color', cat.color + '22');
      details.style.setProperty('--cat-text', cat.color);

      const subsHtml = subsInCat.map(s => {
        return `
          <button class="subcat-chip" type="button"
            data-cat="${esc(cat.id)}" data-sub="${esc(s.id)}"
            aria-pressed="false">
            ${esc(s.name)}
          </button>`;
      }).join('');

      details.innerHTML = `
        <summary class="cat-card__head">
          <span class="cat-card__icon" style="--cat-color:${cat.color}22;--cat-text:${cat.color};">${cat.icon || '📁'}</span>
          <div class="cat-card__title">
            <span class="t-ko">${esc(cat.name)}</span>
            <span class="t-meta">
              <span class="t-hanja">${esc(cat.hanja || '')}</span>
              <span class="t-en">${esc(cat.en || '')}</span>
            </span>
          </div>
          <span class="cat-card__count">${catTerms.length}</span>
          <svg class="cat-card__chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </summary>
        <div class="cat-card__body">
          <div class="subcat-chips">${subsHtml}</div>
          <div class="term-grid" data-cat-grid="${esc(cat.id)}"></div>
        </div>
      `;

      frag.appendChild(details);
    });

    root.innerHTML = '';
    root.appendChild(frag);

    root.querySelectorAll('.subcat-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        window.Filter.setView('list');
        window.Filter.toggleSubcat(btn.dataset.cat, btn.dataset.sub);
      });
    });

    root.querySelectorAll('details.cat-card').forEach(d => {
      d.addEventListener('toggle', () => {
        if (d.open) {
          window.Filter.setExpanded(d.dataset.cat);
          renderTermsInCategories();
        }
      });
    });
  }

  function groupTerms(arr, key) {
    return arr.reduce((acc, t) => {
      (acc[t[key]] = acc[t[key]] || []).push(t);
      return acc;
    }, {});
  }

  function renderTermsInCategories() {
    const D = window.DICT;
    if (!D) return;
    const state = window.Filter.getState();
    const q = window.Search.getQuery();

    document.querySelectorAll('details.cat-card').forEach(d => {
      const catId = d.dataset.cat;
      const grid = d.querySelector('[data-cat-grid]');
      if (!grid) return;
      if (!d.open) {
        grid.innerHTML = '';
        return;
      }
      const terms = D.terms.filter(t => t.category === catId && filterFn(t, q, state));
      const sorted = window.Search.search(terms);
      grid.innerHTML = sorted.map(termCardHtml).join('');
    });

    gridListeners();
  }

  function renderFlatList() {
    const D = window.DICT;
    if (!D) return;
    const state = window.Filter.getState();
    const q = window.Search.getQuery();

    const list = document.getElementById('termList');
    const body = document.getElementById('termListBody');
    const title = document.getElementById('termListTitle');
    if (!list || !body) return;

    const filtered = D.terms.filter(t => filterFn(t, q, state));
    const sorted = window.Search.search(filtered);

    let titleText = '용어 전체';
    if (q) {
      titleText = `'${q}' 검색 결과`;
    } else if (state.activeSubcats.size > 0) {
      const subNames = [];
      for (const key of state.activeSubcats) {
        const [, subId] = key.split(':');
        const subData = D.meta.subcategories[subId];
        if (subData) subNames.push(subData.name);
      }
      titleText = subNames.length > 0 ? subNames.join(', ') : '필터 결과';
      if (state.initial !== 'ALL') titleText += ` · ${state.initial}`;
    } else if (state.initial !== 'ALL') {
      titleText = `${state.initial} 로 시작하는 용어`;
    }
    if (title) title.textContent = titleText;
    body.innerHTML = sorted.map(termCardHtml).join('');
    list.hidden = sorted.length === 0;
    gridListeners();
  }

  function filterFn(t, q, state) {
    if (q) {
      return window.Search.score(t) > 0;
    }
    if (!window.Filter.isInitialMatch(t, state.initial)) return false;
    if (!window.Filter.isSubcatMatch(t)) return false;
    return true;
  }

  function termCardHtml(t) {
    const alt = [];
    if (t.hanja) alt.push(`<span>${esc(t.hanja)}</span>`);
    if (t.termEn) alt.push(`<span>${esc(t.termEn)}</span>`);
    const altHtml = alt.length ? `<div class="term-card__alt">${alt.join(' <span class="sep">·</span> ')}</div>` : '';
    return `
      <button class="term-card" type="button" data-term="${esc(t.id)}">
        <div class="term-card__row1">
          <span class="term-card__term">${esc(t.term)}</span>
        </div>
        ${altHtml}
        <span class="term-card__summary">${esc(t.summary || '')}</span>
      </button>
    `;
  }

  function gridListeners() {
    document.querySelectorAll('.term-card').forEach(card => {
      if (card.dataset.bound) return;
      card.dataset.bound = '1';
      card.addEventListener('click', () => {
        const id = card.dataset.term;
        activeTermId = id;
        window.Modal.open(id);
      });
    });
  }

  function updateResultCount() {
    const D = window.DICT;
    if (!D) return;
    const state = window.Filter.getState();
    const q = window.Search.getQuery();
    const filtered = D.terms.filter(t => filterFn(t, q, state));
    const el = document.getElementById('resultCount');
    if (!el) return;
    if (q) {
      el.textContent = `총 ${D.terms.length}개 중 검색 결과 ${filtered.length}개`;
    } else if (state.initial !== 'ALL' || state.activeSubcats.size > 0) {
      el.textContent = `총 ${D.terms.length}개 중 필터 결과 ${filtered.length}개`;
    } else {
      el.textContent = `총 ${D.terms.length}개 용어`;
    }
  }

  function refreshAll() {
    renderTermsInCategories();
    updateResultCount();
  }

  function showEmptyIfNoResults() {
    const D = window.DICT;
    if (!D) return;
    const state = window.Filter.getState();
    const q = window.Search.getQuery();
    const filtered = D.terms.filter(t => filterFn(t, q, state));
    const empty = document.getElementById('emptyState');
    const list = document.getElementById('termList');
    const cats = document.getElementById('categories');
    const resultCount = document.getElementById('resultCount');
    if (!empty) return;

    if (state.view === 'list') {
      if (cats) cats.style.display = 'none';
      if (filtered.length === 0) {
        empty.hidden = false;
        if (list) list.hidden = true;
        if (resultCount) resultCount.textContent = '';
      } else {
        empty.hidden = true;
        if (list) list.hidden = false;
        renderFlatList();
      }
    } else {
      empty.hidden = true;
      if (list) list.hidden = true;
      if (cats) cats.style.display = '';
    }
  }

  function onDictLoaded() {
    renderCategories();
    refreshAll();
    showEmptyIfNoResults();
    window.Modal.bind();
    window.Filter.bindAlpha();
    if (location.hash.startsWith('#term/')) {
      window.Modal.open(location.hash.replace('#term/', ''));
    }
  }

  function init() {
    document.addEventListener('dict:loaded', onDictLoaded);
    document.addEventListener('dict:error', () => {
      const el = document.getElementById('resultCount');
      if (el) el.textContent = '데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';
    });

    window.Search.bind();
    window.Search.onChange(() => {
      if (window.Search.isActive()) window.Filter.setView('list');
      refreshAll();
      showEmptyIfNoResults();
    });
    window.Filter.onChange(state => {
      document.querySelectorAll('.subcat-chip[data-cat][data-sub]').forEach(b => {
        const key = b.dataset.cat + ':' + b.dataset.sub;
        b.setAttribute('aria-pressed', String(state.activeSubcats.has(key)));
      });
      refreshAll();
      showEmptyIfNoResults();
    });

    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => goHome());
    }

    const closeListBtn = document.getElementById('closeListBtn');
    if (closeListBtn) {
      closeListBtn.addEventListener('click', () => goHome());
    }

    const allChip = document.querySelector('.alpha-chip[data-initial="ALL"]');
    if (allChip) {
      allChip.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
        goAll();
      }, true);
    }
  }

  function goHome() {
    window.Modal.close();

    const input = document.getElementById('searchInput');
    if (input) input.value = '';
    const clearBtn = document.getElementById('clearSearch');
    if (clearBtn) clearBtn.hidden = true;
    window.Search.run();

    window.Filter.clearSubcats();
    window.Filter.setInitial('ALL');
    window.Filter.setView('home');

    const list = document.getElementById('termList');
    if (list) list.hidden = true;
    const empty = document.getElementById('emptyState');
    if (empty) empty.hidden = true;
    const catsEl = document.getElementById('categories');
    if (catsEl) catsEl.style.display = '';

    document.querySelectorAll('details.cat-card').forEach((d) => {
      d.open = false;
      const grid = d.querySelector('[data-cat-grid]');
      if (grid) grid.innerHTML = '';
    });

    refreshAll();
    showEmptyIfNoResults();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goAll() {
    const input = document.getElementById('searchInput');
    if (input) input.value = '';
    const clearBtn = document.getElementById('clearSearch');
    if (clearBtn) clearBtn.hidden = true;
    window.Search.run();

    window.Filter.clearSubcats();
    window.Filter.setInitial('ALL');
    window.Filter.setView('list');

    refreshAll();
    showEmptyIfNoResults();

    const title = document.getElementById('termListTitle');
    if (title) title.textContent = '용어 전체';
    const list = document.getElementById('termList');
    if (list) {
      list.hidden = false;
      list.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
