#!/usr/bin/env node
/**
 * 史料板块数据生成器
 *
 * 输入（本地缓存，不进入版本库）：
 *   .tmp_sources/kanripo_repos.json   GitHub kanripo 组织全部仓库元数据
 *   .tmp_sources/canons.json          CBETA 藏经目录
 *   .tmp_sources/books/<KR-ID>/       Kanripo 单书仓库解压后的正文
 *
 * 输出（板块自包含）：
 *   boards/sources/data/catalog.js          9,349 部书目索引
 *   boards/sources/data/cbeta_canons.js     CBETA 藏经总目
 *   boards/sources/data/text_manifest.js    核心史籍全文清单
 *   boards/sources/data/texts/<ID>.json     核心史籍全文（按卷/篇切分）
 *   boards/sources/data/meta.js             生成时间与统计
 *
 * 刷新方式见 docs/ARCHITECTURE.md 的“史料数据”一节。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CACHE = path.join(ROOT, '.tmp_sources');
const OUT = path.join(ROOT, 'boards', 'sources', 'data');
const TEXTS = path.join(OUT, 'texts');

const GROUPS = {
  1: '經',
  2: '史',
  3: '子',
  4: '集',
  5: '道',
  6: '佛',
};

const CORE_BOOKS = [
  'KR2a0001', // 史記
  'KR2a0007', // 前漢書
  'KR2a0009', // 後漢書
  'KR2a0012', // 三國志
  'KR2a0020', // 魏書
  'KR2a0022', // 周書
  'KR2a0023', // 隋書
  'KR2a0025', // 北史
  'KR2a0026', // 舊唐書
  'KR2a0027', // 新唐書
  'KR2a0029', // 舊五代史
  'KR2a0030', // 新五代史
  'KR2a0033', // 遼史
  'KR2a0035', // 金史
  'KR2a0036', // 元史
  'KR2a0038', // 明史
  'KR2d0014', // 元朝祕史
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function parseDescription(description, id) {
  const raw = String(description || '').trim();
  if (!raw) return { title: id, dynasty: '', author: '' };
  const parts = raw.split('-');
  if (parts.length >= 3) {
    const dynasty = parts[parts.length - 2].trim();
    const author = parts[parts.length - 1].trim();
    const title = parts.slice(0, -2).join('-').trim();
    if (title && dynasty.length <= 6 && !/[()（）]/.test(dynasty)) {
      return { title, dynasty, author };
    }
  }
  return { title: raw, dynasty: '', author: '' };
}

function buildCatalog() {
  const file = path.join(CACHE, 'kanripo_repos.json');
  if (!fs.existsSync(file)) {
    throw new Error(`缺少 ${path.relative(ROOT, file)}；请先按文档拉取 Kanripo 仓库元数据。`);
  }
  const pages = JSON.parse(fs.readFileSync(file, 'utf8'));
  const repos = Array.isArray(pages[0]) ? pages.flat() : pages;
  const books = [];
  const seen = new Set();

  for (const repo of repos) {
    const id = repo.name;
    if (!/^KR\d/.test(id) || seen.has(id)) continue;
    seen.add(id);
    const { title, dynasty, author } = parseDescription(repo.description, id);
    const group = GROUPS[id[2]] || '其他';
    books.push([id, title, dynasty, author, group, repo.size || 0]);
  }

  books.sort((a, b) => a[0].localeCompare(b[0], 'en'));

  const payload = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: 'GitHub · kanripo（漢籍リポジトリ）',
    sourceUrl: 'https://github.com/kanripo',
    readerUrl: 'https://www.kanripo.org/text/',
    count: books.length,
    groups: GROUPS,
    books,
  };

  fs.writeFileSync(
    path.join(OUT, 'catalog.js'),
    `/* 由 scripts/build_sources_data.js 生成，请勿手改 */\n` +
      `window.JIANGSHAN_SOURCES = window.JIANGSHAN_SOURCES || {};\n` +
      `window.JIANGSHAN_SOURCES.kanripo = ${JSON.stringify(payload)};\n`
  );
  return { books, payload };
}

function buildCbeta() {
  const file = path.join(CACHE, 'canons.json');
  if (!fs.existsSync(file)) return null;
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  const canons = Object.entries(raw).map(([key, value]) => [
    key,
    value['title-zh'] || value.title || key,
    value.abbreviation || '',
    value.volumes || 0,
    value.title || '',
  ]);
  const payload = {
    source: 'CBETA 中華電子佛典協會 · canons.json',
    sourceUrl: 'https://www.cbeta.org/',
    readerUrl: 'https://cbetaonline.dila.edu.tw/',
    license: 'CC BY-NC-SA 4.0（非商業使用）',
    version: '2026.R1',
    count: canons.length,
    canons,
  };
  fs.writeFileSync(
    path.join(OUT, 'cbeta_canons.js'),
    `/* 由 scripts/build_sources_data.js 生成，请勿手改 */\n` +
      `window.JIANGSHAN_SOURCES = window.JIANGSHAN_SOURCES || {};\n` +
      `window.JIANGSHAN_SOURCES.cbeta = ${JSON.stringify(payload)};\n`
  );
  return payload;
}

function readMeta(text, key) {
  // 兼容 `#+TITLE: …` 与 `#+PROPERTY: JUAN …` 两种写法。
  const direct = new RegExp(`^#\\+${key}:\\s*(.+)$`, 'm').exec(text);
  if (direct) return direct[1].trim();
  const property = new RegExp(`^#\\+PROPERTY:\\s*${key}\\s+(.+)$`, 'm').exec(text);
  return property ? property[1].trim() : '';
}

function cleanLine(line) {
  return line
    .replace(/<pb:[^>]*>/g, '')
    .replace(/¶/g, '')
    .replace(/[\s　]+/g, '')
    .trim();
}

function chineseNumber(value) {
  const n = Number(value);
  const digits = '零一二三四五六七八九';
  if (!Number.isInteger(n) || n < 0 || n > 999) return String(value);
  if (n < 10) return digits[n];
  if (n < 20) return `十${n % 10 ? digits[n % 10] : ''}`;
  if (n < 100) return `${digits[Math.floor(n / 10)]}十${n % 10 ? digits[n % 10] : ''}`;
  const rest = n % 100;
  return `${digits[Math.floor(n / 100)]}百${rest ? (rest < 10 ? `零${digits[rest]}` : chineseNumber(rest)) : ''}`;
}

/**
 * 解析一部 Kanripo 书籍目录。
 * 以文件为卷单位；文件内出现 《篇名》 独占行时，再切成篇。
 */
function parseBook(id, dir) {
  const files = fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.txt'))
    .sort((a, b) => a.localeCompare(b, 'en'));

  const chapters = [];
  let bookTitle = '';

  for (const name of files) {
    const text = fs.readFileSync(path.join(dir, name), 'utf8');
    bookTitle = bookTitle || readMeta(text, 'TITLE');
    const juan = readMeta(text, 'JUAN');
    // 部分仓库只写数字卷次（如 `#+PROPERTY: JUAN 1`），补成“卷一”便于阅读。
    const juanLabel = juan === '0' ? '卷首' : /^\d+$/.test(juan) ? `卷${chineseNumber(juan)}` : juan;
    const lines = text.split(/\r?\n/).filter((line) => !/^#/.test(line)).map(cleanLine).filter(Boolean);
    // 四库本常在正文首行另写实际卷次（如“明史卷二百二十四考證”），优先采用。
    const volumeTitle = bookTitle
      ? lines.slice(0, 3).find((line) => line.startsWith(`${bookTitle}卷`) && line.length <= bookTitle.length + 24)
      : '';
    const chapterTitle = (volumeTitle ? volumeTitle.slice(bookTitle.length) : '') || juanLabel || '正文';

    let current = null;
    const pushChapter = () => {
      if (!current) return;
      const body = current.parts.join('');
      if (body.length >= 40) chapters.push({ t: current.title, x: body });
    };

    for (const cleaned of lines) {
      const heading = /^(\d+(?:\.\d+)*)?\s*《([^》]{1,40})》$/.exec(cleaned);
      if (heading) {
        pushChapter();
        current = { title: heading[2], parts: [] };
        continue;
      }

      if (!current) {
        current = { title: chapterTitle, parts: [] };
      }
      current.parts.push(cleaned);
    }
    pushChapter();
  }

  // 同一篇名可能跨文件重复（例如目录与正文），保留内容更长的一份。
  const merged = new Map();
  for (const chapter of chapters) {
    const prev = merged.get(chapter.t);
    if (!prev || chapter.x.length > prev.x.length) merged.set(chapter.t, chapter);
  }

  return { title: bookTitle, chapters: Array.from(merged.values()) };
}

function buildTexts(bookIndex) {
  ensureDir(TEXTS);
  const manifest = [];
  const byId = new Map(bookIndex.map((book) => [book[0], book]));

  for (const id of CORE_BOOKS) {
    const dir = path.join(CACHE, 'books', id);
    if (!fs.existsSync(dir)) {
      console.warn(`跳过 ${id}：缺少 ${path.relative(ROOT, dir)}`);
      continue;
    }
    const meta = byId.get(id);
    const parsed = parseBook(id, dir);
    const chars = parsed.chapters.reduce((sum, chapter) => sum + chapter.x.length, 0);
    if (!chars) {
      console.warn(`跳过 ${id}：未解析到正文`);
      continue;
    }

    const payload = {
      id,
      title: (meta && meta[1]) || parsed.title || id,
      dynasty: (meta && meta[2]) || '',
      author: (meta && meta[3]) || '',
      chapters: parsed.chapters,
    };
    fs.writeFileSync(path.join(TEXTS, `${id}.json`), JSON.stringify(payload));

    manifest.push({
      id,
      title: payload.title,
      dynasty: payload.dynasty,
      author: payload.author,
      chapters: payload.chapters.length,
      chars,
      file: `texts/${id}.json`,
    });
    console.log(`${id}\t${payload.title}\t${payload.chapters.length} 卷/篇\t${chars} 字`);
  }

  manifest.sort((a, b) => a.id.localeCompare(b.id, 'en'));
  const totalChars = manifest.reduce((sum, item) => sum + item.chars, 0);
  const payload = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: 'Kanripo 漢籍リポジトリ（GitHub）',
    count: manifest.length,
    totalChars,
    books: manifest,
  };
  fs.writeFileSync(
    path.join(OUT, 'text_manifest.js'),
    `/* 由 scripts/build_sources_data.js 生成，请勿手改 */\n` +
      `window.JIANGSHAN_SOURCES = window.JIANGSHAN_SOURCES || {};\n` +
      `window.JIANGSHAN_SOURCES.texts = ${JSON.stringify(payload)};\n`
  );
  return payload;
}

function buildMeta(catalog, cbeta, texts) {
  const meta = {
    generatedAt: new Date().toISOString().slice(0, 10),
    books: catalog ? catalog.count : 0,
    canons: cbeta ? cbeta.count : 0,
    texts: texts ? texts.count : 0,
    textChars: texts ? texts.totalChars : 0,
  };
  fs.writeFileSync(
    path.join(OUT, 'meta.js'),
    `/* 由 scripts/build_sources_data.js 生成，请勿手改 */\n` +
      `window.JIANGSHAN_SOURCES = window.JIANGSHAN_SOURCES || {};\n` +
      `window.JIANGSHAN_SOURCES.meta = ${JSON.stringify(meta)};\n`
  );
  return meta;
}

function main() {
  ensureDir(OUT);
  ensureDir(TEXTS);
  const catalog = buildCatalog();
  const cbeta = buildCbeta();
  const texts = buildTexts(catalog.books);
  const meta = buildMeta(catalog.payload, cbeta, texts);
  console.log(
    `\n完成：${meta.books} 部书目 / ${meta.canons} 藏 / ${meta.texts} 部全文（${meta.textChars} 字）`
  );
}

main();
