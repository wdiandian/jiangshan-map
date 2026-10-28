/**
 * 研究上下文（阶段 1 骨架）
 *
 * 统一描述“我正在看什么”：板块、年份、地点、人物、视口。
 * 阶段 1 只负责读取和广播，不接管主地图现有的 URL 写入逻辑。
 */
(function () {
  'use strict';

  const KEYS = [
    'board',
    'year',
    'place',
    'person',
    'trace',
    'zoom',
    'center',
    'lng',
    'lat',
    'quiz',
    'hover',
    'layers',
  ];

  const listeners = new Set();
  let state = readFromUrl();

  function readFromUrl() {
    const out = {};
    let params;
    try {
      params = new URLSearchParams(location.search);
    } catch (_) {
      return out;
    }
    for (const key of KEYS) {
      if (params.has(key)) out[key] = params.get(key);
    }
    return out;
  }

  function get() {
    return Object.assign({}, state);
  }

  function set(patch, options) {
    if (!patch || typeof patch !== 'object') return get();
    state = Object.assign({}, state, patch);
    if (!options || options.silent !== true) {
      listeners.forEach((fn) => {
        try {
          fn(get());
        } catch (_) {}
      });
    }
    return get();
  }

  function clear(keys) {
    const next = Object.assign({}, state);
    const list = Array.isArray(keys) ? keys : Object.keys(next);
    list.forEach((key) => delete next[key]);
    state = next;
    listeners.forEach((fn) => {
      try {
        fn(get());
      } catch (_) {}
    });
    return get();
  }

  /**
   * 生成一个可分享、可收藏的 URL。
   * 基础路径默认为当前页面，可通过 options.base 覆盖。
   */
  function toUrl(extra, options) {
    const merged = Object.assign({}, state, extra || {});
    const base = (options && options.base) || location.pathname;
    const params = new URLSearchParams();
    for (const key of KEYS) {
      const value = merged[key];
      if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
    }
    const query = params.toString();
    return query ? base + '?' + query : base;
  }

  function subscribe(fn) {
    if (typeof fn !== 'function') return function () {};
    listeners.add(fn);
    return function unsubscribe() {
      listeners.delete(fn);
    };
  }

  window.JiangshanContext = {
    keys: KEYS.slice(),
    get,
    set,
    clear,
    toUrl,
    subscribe,
    reloadFromUrl: () => set(readFromUrl(), { silent: true }),
  };
})();
