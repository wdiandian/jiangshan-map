/**
 * 研究记录面板（阶段 4）
 *
 * 可选组件：任何板块引入本脚本即可获得“收藏当前 / 笔记 / 导出导入”。
 * 不引入时，板块完全不受影响。
 */
(function () {
  'use strict';

  const store = window.JiangshanStore;
  if (!store || document.querySelector('[data-research-panel]')) return;

  const context = window.JiangshanContext;
  const registry = window.JiangshanRegistry;

  let root = null;
  let drawer = null;
  let scrim = null;
  let countEl = null;
  let bodyEl = null;
  let toastEl = null;
  let externalTrigger = null;

  function currentBoard() {
    const board = registry ? registry.current() : null;
    return board ? board.id : 'unknown';
  }

  function readState() {
    const ctx = context ? context.get() : {};
    let params;
    try {
      params = new URLSearchParams(location.search);
    } catch (_) {
      params = new URLSearchParams();
    }
    let year = ctx.year || params.get('year') || '';
    // 主地图的年份可能只在内存里推进，优先读控制器实例。
    const app = window.atlasApp;
    if (app && Number.isFinite(app.year)) year = app.year;
    const place = ctx.place || params.get('place') || '';
    const person = ctx.person || params.get('person') || '';
    return {
      board: currentBoard(),
      year: year === '' ? null : year,
      place,
      person,
      url: location.pathname + location.search,
    };
  }

  function formatYear(year) {
    const value = Number(year);
    if (!Number.isFinite(value)) return String(year);
    return value < 0 ? `前${Math.abs(value)}` : `${value}`;
  }

  function labelOf(state) {
    const parts = [];
    if (state.year !== null && state.year !== '') parts.push(formatYear(state.year));
    if (state.place) parts.push(String(state.place).split(',').join(' → '));
    if (state.person) parts.push(state.person);
    if (!parts.length) parts.push(document.title.split('·')[0].trim());
    return parts.join(' · ');
  }

  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toastEl.classList.remove('is-visible'), 1600);
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function build() {
    root = el('div');
    root.setAttribute('data-research-panel', '');

    // 页面自带研究入口时，直接复用它，不再额外生成浮动按钮。
    externalTrigger = document.querySelector('[data-research-open]');
    if (externalTrigger) {
      externalTrigger.setAttribute('aria-haspopup', 'dialog');
      externalTrigger.setAttribute('aria-expanded', 'false');
      externalTrigger.addEventListener('click', () => setOpen(true));
    } else {
      const fab = el('button', 'js-research-fab');
      fab.type = 'button';
      fab.setAttribute('aria-haspopup', 'dialog');
      fab.setAttribute('aria-expanded', 'false');
      fab.setAttribute('aria-label', '打开我的研究');
      const fabLabel = el('span', '', '研究');
      countEl = el('span', 'js-research-count');
      countEl.hidden = true;
      fab.appendChild(fabLabel);
      fab.appendChild(countEl);
      fab.addEventListener('click', () => setOpen(true));
      root.appendChild(fab);
    }

    scrim = el('div', 'js-research-scrim');
    scrim.addEventListener('click', () => setOpen(false));

    drawer = el('aside', 'js-research-drawer');
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'false');
    drawer.setAttribute('aria-label', '我的研究');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.inert = true;

    const head = el('div', 'js-research-head');
    head.appendChild(el('h2', '', '我的研究'));
    const close = el('button', 'js-research-close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', '关闭我的研究');
    close.addEventListener('click', () => setOpen(false));
    head.appendChild(close);

    const actions = el('div', 'js-research-actions');
    const collectBtn = el('button', '', '收藏当前');
    collectBtn.type = 'button';
    collectBtn.addEventListener('click', collectCurrent);
    const exportBtn = el('button', '', '导出');
    exportBtn.type = 'button';
    exportBtn.addEventListener('click', exportData);
    const importBtn = el('button', '', '导入');
    importBtn.type = 'button';
    importBtn.addEventListener('click', () => importInput.click());
    actions.appendChild(collectBtn);
    actions.appendChild(exportBtn);
    actions.appendChild(importBtn);

    bodyEl = el('div', 'js-research-body');

    drawer.appendChild(head);
    drawer.appendChild(actions);
    drawer.appendChild(bodyEl);

    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = 'application/json,.json';
    importInput.hidden = true;
    importInput.addEventListener('change', importData);

    toastEl = el('div', 'js-research-toast');
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');

    root.appendChild(scrim);
    root.appendChild(drawer);
    root.appendChild(importInput);
    root.appendChild(toastEl);
    document.body.appendChild(root);

    render();
  }

  function setOpen(open) {
    drawer.inert = !open;
    drawer.setAttribute('aria-hidden', String(!open));
    drawer.setAttribute('aria-modal', String(open));
    drawer.classList.toggle('is-open', open);
    scrim.classList.toggle('is-open', open);
    const fab = root.querySelector('.js-research-fab');
    if (fab) fab.setAttribute('aria-expanded', String(open));
    if (externalTrigger) externalTrigger.setAttribute('aria-expanded', String(open));
    if (open) {
      render();
      const close = drawer.querySelector('.js-research-close');
      if (close) close.focus({ preventScroll: true });
    }
  }

  function collectCurrent() {
    const state = readState();
    store.addBookmark({
      board: state.board,
      type: state.place ? 'place' : state.person ? 'person' : 'year',
      target: state.place || state.person || state.year || '',
      year: state.year,
      label: labelOf(state),
      url: state.url,
    });
    render();
    toast('已收藏当前页面');
  }

  function exportData() {
    const blob = new Blob([store.exportJson()], { type: 'application/json' });
    const link = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    link.href = URL.createObjectURL(blob);
    link.download = `jiangshan-research-${stamp}.json`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
      link.remove();
    }, 0);
    toast('已导出研究记录');
  }

  function importData(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const summary = store.importJson(String(reader.result || ''));
        render();
        toast(`已导入：${summary.bookmarks} 书签 / ${summary.notes} 笔记`);
      } catch (_) {
        toast('导入失败：文件不是有效的研究记录');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  function saveNote() {
    const input = bodyEl.querySelector('.js-research-note-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) {
      toast('请先写点内容');
      input.focus();
      return;
    }
    const state = readState();
    store.addNote({
      board: state.board,
      target: state.place || state.person || state.year || '',
      year: state.year,
      text,
      tags: [],
    });
    render();
    toast('笔记已保存');
  }

  function render() {
    if (!bodyEl) return;
    const bookmarks = store.listBookmarks();
    const notes = store.listNotes();
    const total = bookmarks.length + notes.length;
    if (countEl) {
      countEl.textContent = String(total);
      countEl.hidden = total === 0;
    }
    if (externalTrigger) {
      externalTrigger.textContent = total ? `研究 ${total}` : '研究';
    }

    bodyEl.innerHTML = '';

    bodyEl.appendChild(el('div', 'js-research-section-title', `书签 · ${bookmarks.length}`));
    if (!bookmarks.length) {
      bodyEl.appendChild(el('p', 'js-research-empty', '还没有书签。在任意板块点“收藏当前”即可保存。'));
    } else {
      bookmarks
        .slice()
        .reverse()
        .forEach((item) => {
          const row = el('div', 'js-research-item');
          const link = el('a', '', item.label || item.url || '未命名书签');
          link.href = item.url || '#';
          row.appendChild(link);
          const meta = el('span', 'js-research-meta', item.board || '');
          row.appendChild(meta);
          const remove = el('button', 'js-research-remove', '×');
          remove.type = 'button';
          remove.setAttribute('aria-label', '删除书签');
          remove.addEventListener('click', () => {
            store.removeBookmark(item.id);
            render();
          });
          row.appendChild(remove);
          bodyEl.appendChild(row);
        });
    }

    bodyEl.appendChild(el('div', 'js-research-section-title', '当前页面笔记'));
    const textarea = el('textarea', 'js-research-note-input');
    textarea.placeholder = '记下这一刻的想法、疑问或待查线索…';
    textarea.setAttribute('aria-label', '当前页面笔记');
    bodyEl.appendChild(textarea);
    const saveBtn = el('button', '', '保存笔记');
    saveBtn.type = 'button';
    saveBtn.style.marginTop = '8px';
    saveBtn.style.minHeight = '34px';
    saveBtn.style.padding = '6px 12px';
    saveBtn.style.border = '1px solid rgba(43, 38, 34, 0.28)';
    saveBtn.style.borderRadius = '6px';
    saveBtn.style.background = '#fbf8f1';
    saveBtn.style.cursor = 'pointer';
    saveBtn.addEventListener('click', saveNote);
    bodyEl.appendChild(saveBtn);

    bodyEl.appendChild(el('div', 'js-research-section-title', `笔记 · ${notes.length}`));
    if (!notes.length) {
      bodyEl.appendChild(el('p', 'js-research-empty', '还没有笔记。'));
    } else {
      notes
        .slice()
        .reverse()
        .forEach((note) => {
          const row = el('div', 'js-research-note');
          row.appendChild(el('div', '', note.text));
          const time = el('time', '', new Date(note.createdAt).toLocaleString());
          row.appendChild(time);
          bodyEl.appendChild(row);
        });
    }
  }

  function boot() {
    build();
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
        setOpen(false);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  window.JiangshanResearch = {
    open: () => setOpen(true),
    close: () => setOpen(false),
    collectCurrent,
    refresh: render,
  };
})();
