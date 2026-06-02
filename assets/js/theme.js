/* theme.js — 다크 모드 토글
   - 다크 모드가 기본(메인) — 저장된 값이 'light'일 때만 라이트 적용
   - 사용자가 선택한 값을 localStorage에 저장
   - 인라인 부트스트랩(head의 inline script)이 FOUC를 방지
   ---------------------------------------------------------- */
(function () {
  'use strict';

  const STORAGE_KEY = 'dicmoney:theme';
  const root = document.documentElement;

  function getStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (_) { return null; }
  }
  function setStored(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (_) {}
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
      btn.setAttribute('aria-label', theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
    }
  }

  function init() {
    const stored = getStored();
    applyTheme(stored === 'light' ? 'light' : 'dark');

    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', () => {
        const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        setStored(next);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
