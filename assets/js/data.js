/* data.js — 데이터 로더
   data/terms.json을 fetch해 window.DICT에 노출합니다.
   ---------------------------------------------------------- */
(function () {
  'use strict';

  const DICT_URL = 'data/terms.json';

  async function load() {
    try {
      const res = await fetch(DICT_URL, { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      window.DICT = {
        meta: json.meta || {},
        terms: Array.isArray(json.terms) ? json.terms : [],
        loaded: true,
      };
      document.dispatchEvent(new CustomEvent('dict:loaded'));
    } catch (err) {
      console.error('[data.js] 사전 데이터 로드 실패:', err);
      window.DICT = { meta: {}, terms: [], loaded: false, error: err };
      document.dispatchEvent(new CustomEvent('dict:error', { detail: err }));
    }
  }

  load();
})();
