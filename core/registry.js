/**
 * 板块注册表（阶段 1 骨架）
 *
 * 设计原则：
 * 1. boards/registry.json 是单一事实来源；
 * 2. 页面加载时优先 fetch JSON，失败则退回内置副本，保证离线可用；
 * 3. 只暴露读取接口，不在这里做任何界面渲染。
 */
(function () {
  'use strict';

  const FALLBACK = {
    version: 2,
    defaultBoard: 'territory',
    groups: [
      {
        id: 'map',
        title: '地图',
        titleEn: 'Map',
        description: '疆域、政区与古城的时间切片',
        entry: 'index.html',
        order: 10,
      },
      {
        id: 'sources',
        title: '可检索的史料',
        titleEn: 'Sources',
        description: '书目、全文与人物资料的可检索库',
        entry: 'boards/sources/index.html',
        order: 20,
      },
      {
        id: 'modules',
        title: '子板块',
        titleEn: 'Modules',
        description: '可独立增删的研究单元',
        entry: 'boards/modules/index.html',
        order: 30,
      },
    ],
    boards: [
      {
        id: 'territory',
        title: '疆域时序',
        titleEn: 'Territories',
        description: '18 个历史时期的疆域、政区与古城变迁',
        group: 'map',
        path: '',
        entry: 'index.html',
        order: 10,
        context: ['year', 'place', 'person', 'trace', 'zoom', 'center'],
        status: 'active',
      },
      {
        id: 'sources',
        title: '史料库',
        titleEn: 'Sources',
        description: '古籍书目、核心史籍全文、CBETA 总目与 CBDB 人物检索',
        group: 'sources',
        path: 'boards/sources/',
        entry: 'boards/sources/index.html',
        order: 20,
        context: [],
        status: 'active',
      },
      {
        id: 'modules',
        title: '子板块',
        titleEn: 'Modules',
        description: '可独立增删的研究单元总览',
        group: 'modules',
        path: 'boards/modules/',
        entry: 'boards/modules/index.html',
        order: 30,
        context: [],
        status: 'active',
      },
      {
        id: 'genealogy',
        title: '族群谱系',
        titleEn: 'Genealogy',
        description: '北族源流、承继与史学争议',
        group: 'modules',
        path: 'boards/genealogy/',
        entry: 'boards/genealogy/index.html',
        order: 40,
        context: ['year'],
        status: 'active',
      },
    ],
  };

  const self = document.currentScript;
  const ROOT = self ? new URL('../', self.src).href : new URL('./', location.href).href;

  let data = FALLBACK;
  let loading = null;

  function inferGroup(board) {
    if (board && board.group) return String(board.group);
    if (board && board.id === 'territory') return 'map';
    if (board && board.id === 'sources') return 'sources';
    return 'modules';
  }

  function deriveGroups(boards) {
    const titles = { map: '地图', sources: '可检索的史料', modules: '子板块' };
    const known = new Map();
    boards.forEach((board) => {
      const id = board.group || 'modules';
      if (!known.has(id)) {
        known.set(id, {
          id,
          title: titles[id] || id,
          titleEn: id,
          description: '',
          entry: board.entry,
          order: known.size * 10 + 10,
        });
      }
    });
    return Array.from(known.values());
  }

  function normalize(json) {
    const boards = (Array.isArray(json && json.boards) ? json.boards : [])
      .filter((b) => b && b.id && b.entry)
      .map((b) => ({
        id: String(b.id),
        title: String(b.title || b.id),
        titleEn: String(b.titleEn || b.title || b.id),
        description: String(b.description || ''),
        group: inferGroup(b),
        path: String(b.path || ''),
        entry: String(b.entry),
        order: Number(b.order) || 100,
        context: Array.isArray(b.context) ? b.context.slice() : [],
        status: b.status === 'draft' ? 'draft' : 'active',
      }));

    const rawGroups =
      Array.isArray(json && json.groups) && json.groups.length
        ? json.groups
        : deriveGroups(boards);

    const groups = rawGroups
      .filter((g) => g && g.id)
      .map((g, index) => {
        const id = String(g.id);
        const fallbackEntry = (boards.find((b) => b.group === id) || {}).entry || '';
        return {
          id,
          title: String(g.title || id),
          titleEn: String(g.titleEn || g.title || id),
          description: String(g.description || ''),
          entry: String(g.entry || fallbackEntry),
          order: Number(g.order) || 100 + index,
        };
      })
      .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

    return {
      version: Number(json && json.version) || 1,
      defaultBoard: (json && json.defaultBoard) || 'territory',
      groups,
      boards,
    };
  }

  function load() {
    if (loading) return loading;
    const url = new URL('boards/registry.json', ROOT).href;
    loading = fetch(url, { cache: 'no-cache' })
      .then((res) => {
        if (!res.ok) throw new Error('registry HTTP ' + res.status);
        return res.json();
      })
      .then((json) => {
        data = normalize(json);
        return data;
      })
      .catch(() => {
        data = normalize(FALLBACK);
        return data;
      });
    return loading;
  }

  function all() {
    return data.boards.slice().sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  }

  function active() {
    return all().filter((b) => b.status === 'active');
  }

  function get(id) {
    return data.boards.find((b) => b.id === id) || null;
  }

  function defaultBoard() {
    return get(data.defaultBoard) || active()[0] || all()[0] || null;
  }

  /**
   * 根据当前页面路径推断所在板块。
   * 规则：匹配 path 最长者；根路径归默认板块。
   */
  function current() {
    const here = location.pathname.replace(/index\.html$/, '');
    let best = defaultBoard();
    let bestLen = -1;
    for (const board of active()) {
      const base = new URL(board.path || '.', ROOT).pathname.replace(/index\.html$/, '');
      if (here.startsWith(base) && base.length > bestLen) {
        best = board;
        bestLen = base.length;
      }
    }
    return best;
  }

  function groups() {
    return (data.groups || []).slice().sort(
      (a, b) => a.order - b.order || a.id.localeCompare(b.id)
    );
  }

  function getGroup(id) {
    return (data.groups || []).find((group) => group.id === id) || null;
  }

  function groupOf(boardOrId) {
    const board = typeof boardOrId === 'string' ? get(boardOrId) : boardOrId;
    return board ? getGroup(board.group) : null;
  }

  function boardsInGroup(groupId) {
    return active().filter((board) => board.group === groupId);
  }

  function currentGroup() {
    return groupOf(current());
  }

  window.JiangshanRegistry = {
    ready: load,
    root: () => ROOT,
    all,
    active,
    get,
    groups,
    getGroup,
    groupOf,
    boardsInGroup,
    currentGroup,
    defaultBoard,
    current,
    version: () => data.version,
  };

  // 尽早开始加载，导航脚本只需等待同一个 promise。
  load();
})();
