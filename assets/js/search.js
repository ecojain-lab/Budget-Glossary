/* search.js — 실시간 검색 (점수 기반 + 유사어)
   - 한글, 한자, 영문, 요약, 상세, 출처, 예시, ID 대상
   - 디바운스 150ms, 대소문자 무시
   - 정확 매치(1000) > 접두(800) > 부분(600) > 요약/상세(400) > 출처(200) > 바이그램 유사(가변)
   - 0점만 제외하고 모두 표시 → "유사한 용어"가 함께 노출됨
   ---------------------------------------------------------- */
(function () {
  'use strict';

  const listeners = new Set();
  let timer = null;
  let lastQuery = '';

  function normalize(s) {
    return (s || '').toString().toLowerCase().trim();
  }

  function bigrams(s) {
    const out = new Set();
    if (!s) return out;
    for (let i = 0; i < s.length - 1; i++) out.add(s.substr(i, 2));
    return out;
  }

  function bigramSim(a, b) {
    if (!a || a.length < 2 || !b || b.length < 2) return 0;
    const A = bigrams(a);
    const B = bigrams(b);
    if (B.size === 0) return 0;
    let shared = 0;
    B.forEach(x => { if (A.has(x)) shared++; });
    return (2 * shared) / (A.size + B.size);
  }

  function fields(t) {
    return {
      term: (t.term || '').toLowerCase(),
      hanja: (t.hanja || '').toLowerCase(),
      termEn: (t.termEn || '').toLowerCase(),
      summary: (t.summary || '').toLowerCase(),
      detail: (t.detail || '').toLowerCase(),
      examples: (t.examples || []).join(' ').toLowerCase(),
      sources: (t.sources || []).join(' ').toLowerCase(),
      id: (t.id || '').toLowerCase(),
    };
  }

  function scoreTerm(t, q) {
    if (!q) return 0;
    const f = fields(t);

    if (f.term === q || f.hanja === q || f.termEn === q) return 1000;
    if (f.term.startsWith(q) || f.hanja.startsWith(q) || f.termEn.startsWith(q)) return 800;
    if (f.term.includes(q) || f.hanja.includes(q) || f.termEn.includes(q)) return 600;
    if (f.summary.includes(q) || f.detail.includes(q) || f.examples.includes(q)) return 400;
    if (f.sources.includes(q) || f.id.includes(q)) return 200;

    const sim = Math.max(
      bigramSim(f.term, q),
      bigramSim(f.hanja, q),
      bigramSim(f.termEn, q)
    );
    if (sim >= 0.4) return Math.floor(sim * 300);

    return 0;
  }

  function run() {
    const raw = document.getElementById('searchInput');
    if (!raw) return;
    const q = normalize(raw.value);
    lastQuery = q;
    listeners.forEach(fn => { try { fn(q); } catch (e) { console.error(e); } });
  }

  function debounceRun() {
    clearTimeout(timer);
    timer = setTimeout(run, 150);
  }

  function setActive(pressed) {
    const btn = document.getElementById('clearSearch');
    if (btn) btn.hidden = !pressed;
  }

  function bind() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    if (input.dataset.bound) return;
    input.dataset.bound = '1';

    input.addEventListener('input', () => {
      setActive(input.value.length > 0);
      debounceRun();
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') { input.value = ''; setActive(false); run(); }
    });

    const clearBtn = document.getElementById('clearSearch');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        setActive(false);
        run();
        input.focus();
      });
    }
  }

  function search(terms) {
    const q = lastQuery;
    if (!q) {
      return [...terms].sort((a, b) => (a.term || '').localeCompare(b.term || '', 'ko'));
    }
    const scored = [];
    for (const t of terms) {
      const s = scoreTerm(t, q);
      if (s > 0) scored.push([t, s]);
    }
    scored.sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return (a[0].term || '').localeCompare(b[0].term || '', 'ko');
    });
    return scored.map(([t]) => t);
  }

  window.Search = {
    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    run,
    clear() {
      const input = document.getElementById('searchInput');
      if (input) input.value = '';
      const clearBtn = document.getElementById('clearSearch');
      if (clearBtn) clearBtn.hidden = true;
      lastQuery = '';
    },
    getQuery() { return lastQuery; },
    isActive() { return lastQuery.length > 0; },
    score(t) { return scoreTerm(t, lastQuery); },
    matches(t) { return scoreTerm(t, lastQuery) > 0; },
    search,
    bind,
  };
})();
