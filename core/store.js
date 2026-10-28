/**
 * 研究记录存储（阶段 1 骨架）
 *
 * 书签、笔记、研究线跨板块共享。
 * 存储策略：localStorage 为主，不可用时退回内存，保证页面不报错。
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'jiangshan_research_v1';
  const SCHEMA_VERSION = 1;

  let memory = null;
  let storageAvailable = null;

  function canUseStorage() {
    if (storageAvailable !== null) return storageAvailable;
    try {
      const probe = '__js_probe__';
      localStorage.setItem(probe, '1');
      localStorage.removeItem(probe);
      storageAvailable = true;
    } catch (_) {
      storageAvailable = false;
    }
    return storageAvailable;
  }

  function empty() {
    return { version: SCHEMA_VERSION, bookmarks: [], notes: [], threads: [] };
  }

  function normalize(raw) {
    const base = empty();
    if (!raw || typeof raw !== 'object') return base;
    return {
      version: SCHEMA_VERSION,
      bookmarks: Array.isArray(raw.bookmarks) ? raw.bookmarks.filter(Boolean) : [],
      notes: Array.isArray(raw.notes) ? raw.notes.filter(Boolean) : [],
      threads: Array.isArray(raw.threads) ? raw.threads.filter(Boolean) : [],
    };
  }

  function read() {
    if (memory) return memory;
    if (!canUseStorage()) {
      memory = empty();
      return memory;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      memory = raw ? normalize(JSON.parse(raw)) : empty();
    } catch (_) {
      memory = empty();
    }
    return memory;
  }

  function write(next) {
    memory = normalize(next);
    if (canUseStorage()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
      } catch (_) {}
    }
    return memory;
  }

  function uid(prefix) {
    const rand = Math.random().toString(36).slice(2, 8);
    return prefix + '_' + Date.now().toString(36) + rand;
  }

  function now() {
    return new Date().toISOString();
  }

  function addBookmark(input) {
    const db = read();
    const entry = Object.assign(
      {
        id: uid('bm'),
        board: 'territory',
        type: 'place',
        target: '',
        year: null,
        label: '',
        url: '',
        createdAt: now(),
      },
      input || {}
    );
    db.bookmarks.push(entry);
    write(db);
    return entry;
  }

  function listBookmarks(filter) {
    const list = read().bookmarks.slice();
    if (filter && filter.board) return list.filter((b) => b.board === filter.board);
    return list;
  }

  function removeBookmark(id) {
    const db = read();
    db.bookmarks = db.bookmarks.filter((b) => b.id !== id);
    write(db);
    return db.bookmarks.length;
  }

  function addNote(input) {
    const db = read();
    const entry = Object.assign(
      {
        id: uid('nt'),
        board: 'territory',
        target: '',
        year: null,
        text: '',
        tags: [],
        createdAt: now(),
        updatedAt: now(),
      },
      input || {}
    );
    if (!Array.isArray(entry.tags)) entry.tags = [];
    db.notes.push(entry);
    write(db);
    return entry;
  }

  function listNotes(filter) {
    const list = read().notes.slice();
    if (filter && filter.board) return list.filter((n) => n.board === filter.board);
    if (filter && filter.target) return list.filter((n) => n.target === filter.target);
    return list;
  }

  function updateNote(id, patch) {
    const db = read();
    const note = db.notes.find((n) => n.id === id);
    if (!note) return null;
    Object.assign(note, patch || {}, { updatedAt: now() });
    write(db);
    return note;
  }

  function removeNote(id) {
    const db = read();
    db.notes = db.notes.filter((n) => n.id !== id);
    write(db);
    return db.notes.length;
  }

  function addThread(input) {
    const db = read();
    const entry = Object.assign(
      { id: uid('th'), title: '', items: [], createdAt: now() },
      input || {}
    );
    if (!Array.isArray(entry.items)) entry.items = [];
    db.threads.push(entry);
    write(db);
    return entry;
  }

  function listThreads() {
    return read().threads.slice();
  }

  function exportJson() {
    return JSON.stringify(read(), null, 2);
  }

  function importJson(text) {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (_) {
      throw new Error('invalid JSON');
    }
    const incoming = normalize(parsed);
    const db = read();
    const merge = (target, source) => {
      const byId = new Map(target.map((item) => [item.id, item]));
      source.forEach((item) => {
        if (!item || !item.id) return;
        const existing = byId.get(item.id);
        if (!existing) {
          target.push(item);
          byId.set(item.id, item);
          return;
        }
        const a = existing.updatedAt || existing.createdAt || '';
        const b = item.updatedAt || item.createdAt || '';
        if (b > a) Object.assign(existing, item);
      });
    };
    merge(db.bookmarks, incoming.bookmarks);
    merge(db.notes, incoming.notes);
    merge(db.threads, incoming.threads);
    write(db);
    return {
      bookmarks: db.bookmarks.length,
      notes: db.notes.length,
      threads: db.threads.length,
    };
  }

  function clearAll() {
    write(empty());
    return read();
  }

  window.JiangshanStore = {
    keys: { storage: STORAGE_KEY, version: SCHEMA_VERSION },
    addBookmark,
    listBookmarks,
    removeBookmark,
    addNote,
    listNotes,
    updateNote,
    removeNote,
    addThread,
    listThreads,
    exportJson,
    importJson,
    clearAll,
    snapshot: () => JSON.parse(JSON.stringify(read())),
  };
})();
