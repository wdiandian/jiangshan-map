/**
 * 板块导航（阶段 1 骨架）
 *
 * 行为约定：
 * - 只有 2 个及以上 active 板块时才显示，避免单板块时出现多余入口；
 * - 导航由注册表驱动，新增板块无需改这里；
 * - 不拦截点击，使用普通链接，浏览器前进后退天然可用。
 */
(function () {
  'use strict';

  function mount() {
    // 板块页可以自带挂载点，避免被迫套用主地图的顶栏结构。
    const explicit = document.querySelector('[data-board-nav]');
    if (explicit) {
      explicit.classList.add('js-board-switcher');
      explicit.hidden = true;
      return explicit;
    }

    const bar = document.getElementById('nav-bar');
    if (!bar) return null;
    const existing = document.getElementById('board-switcher');
    if (existing) return existing;

    const nav = document.createElement('nav');
    nav.id = 'board-switcher';
    nav.className = 'js-board-switcher';
    nav.setAttribute('aria-label', '研究台板块');
    nav.hidden = true;

    const brand = bar.querySelector('.brand-group');
    if (brand) brand.insertAdjacentElement('afterend', nav);
    else bar.insertBefore(nav, bar.firstChild);
    return nav;
  }

  function label(board, useEn) {
    return useEn ? board.titleEn || board.title : board.title;
  }

  function render(nav) {
    const registry = window.JiangshanRegistry;
    if (!nav || !registry) return;
    const boards = registry.active();
    const groups = typeof registry.groups === 'function' ? registry.groups() : [];

    // 新版注册表按“地图 / 史料 / 子板块”三大板块导航；
    // 旧注册表没有 groups 时退回逐板块导航。
    const useGroups = groups.length >= 2;
    const entries = useGroups ? groups : boards;
    if (entries.length < 2) {
      nav.hidden = true;
      nav.innerHTML = '';
      return;
    }

    const useEn =
      /(?:^|[?&])lang=en(?:&|$)/.test(location.search) ||
      document.documentElement.lang === 'en';
    const current = registry.current();
    const currentGroup =
      useGroups && typeof registry.groupOf === 'function' ? registry.groupOf(current) : null;

    nav.innerHTML = '';
    entries.forEach((entry) => {
      const link = document.createElement('a');
      link.className = 'js-board-link';
      if (useGroups) {
        link.href = new URL(entry.entry || './', registry.root()).href;
        link.dataset.group = entry.id;
      } else {
        link.href = new URL(entry.path || './', registry.root()).href;
        link.dataset.board = entry.id;
      }
      link.textContent = label(entry, useEn);
      link.title = entry.description || '';
      const isCurrent = useGroups
        ? Boolean(currentGroup && currentGroup.id === entry.id)
        : Boolean(current && current.id === entry.id);
      if (isCurrent) link.setAttribute('aria-current', 'page');
      nav.appendChild(link);
    });
    nav.hidden = false;
  }

  function boot() {
    const nav = mount();
    if (!nav) return;
    const registry = window.JiangshanRegistry;
    if (!registry) return;
    registry.ready().then(() => render(nav));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  window.JiangshanNav = { refresh: boot };
})();
