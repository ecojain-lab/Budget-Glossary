/* filter.js — 대분류/중분류/가나다 인덱스 필터 + view 상태
   - state: { view, initial, activeSubcats, expandedCat }
   - view: 'home' (6대분류) | 'list' (가나다 평면 목록)
   ---------------------------------------------------------- */
(function () {
  'use strict';

  const STATE = {
    view: 'home',
    initial: 'ALL',
    activeSubcats: new Set(),
    expandedCat: null,
  };
  const listeners = new Set();

  function emit() {
    listeners.forEach(fn => { try { fn(getState()); } catch (e) { console.error(e); } });
  }

  function getState() {
    return {
      view: STATE.view,
      initial: STATE.initial,
      activeSubcats: new Set(STATE.activeSubcats),
      expandedCat: STATE.expandedCat,
    };
  }

  function setView(v) {
    STATE.view = v === 'list' ? 'list' : 'home';
    emit();
  }

  function setInitial(v) {
    STATE.initial = v;
    document.querySelectorAll('.alpha-chip').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.initial === v));
    });
    emit();
  }

  function toggleSubcat(catId, subId) {
    const key = catId + ':' + subId;
    if (STATE.activeSubcats.has(key)) STATE.activeSubcats.delete(key);
    else STATE.activeSubcats.add(key);
    emit();
  }

  function clearSubcats() {
    STATE.activeSubcats.clear();
    emit();
  }

  function setExpanded(catId) {
    STATE.expandedCat = catId;
  }

  function bindAlpha() {
    document.querySelectorAll('.alpha-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const init = btn.dataset.initial || 'ALL';
        if (window.Search) window.Search.clear();
        setView('list');
        if (STATE.activeSubcats.size > 0) clearSubcats();
        setInitial(init);
        const first = document.querySelector('.cat-card[open] .term-card, .term-list__body .term-card');
        if (first) {
          first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          const empty = document.getElementById('emptyState');
          const list = document.getElementById('termList');
          const target = (empty && !empty.hidden) ? empty : (list && !list.hidden ? list : null);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          else window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  function isInitialMatch(t, init) {
    if (init === 'ALL' || !init) return true;
    if (init === 'EN') return /^[A-Za-z]/.test(t.term || '');
    return (t.initial || '').startsWith(init);
  }

  function isSubcatMatch(t) {
    if (STATE.activeSubcats.size === 0) return true;
    for (const key of STATE.activeSubcats) {
      const [cat, sub] = key.split(':');
      if (t.category === cat && t.subcategory === sub) return true;
    }
    return false;
  }

  window.Filter = {
    getState,
    setView,
    setInitial,
    toggleSubcat,
    clearSubcats,
    setExpanded,
    bindAlpha,
    isInitialMatch,
    isSubcatMatch,
    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  };
})();
