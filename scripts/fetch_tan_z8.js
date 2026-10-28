#!/usr/bin/env node
/**
 * 由已有 z7 谭图瓦片派生 z8 高清瓦片。
 * 只对 z7 中“有实际内容”的瓦片（文件 > 2 KB）下载四个子瓦片，
 * 避免把海面/空白区域也放大四份。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = path.join(ROOT, 'assets', 'tan');
const CONCURRENCY = 12;

function walkTiles(dir, out) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkTiles(full, out);
    else if (entry.name.endsWith('.png')) out.push(full);
  }
}

async function download(url, file, attempts = 3) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'jiangshan-map-local-cache/1.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 100) throw new Error(`too small ${buf.length}`);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, buf);
      return buf.length;
    } catch (error) {
      if (i === attempts - 1) throw error;
      await new Promise((r) => setTimeout(r, 300 * (i + 1)));
    }
  }
}

async function main() {
  if (!fs.existsSync(BASE)) {
    console.error('缺少 assets/tan；请先运行 node scripts/fetch_tan_tiles.js 5 6 7');
    process.exit(1);
  }
  const jobs = [];
  for (const layer of fs.readdirSync(BASE, { withFileTypes: true })) {
    if (!layer.isDirectory()) continue;
    const z7 = path.join(BASE, layer.name, '7');
    const files = [];
    walkTiles(z7, files);
    for (const file of files) {
      if (fs.statSync(file).size <= 2000) continue;
      const parts = file.split(path.sep);
      const y = Number(parts.pop().replace('.png', ''));
      const x = Number(parts.pop());
      for (const dx of [0, 1]) {
        for (const dy of [0, 1]) {
          jobs.push({ layer: layer.name, x: x * 2 + dx, y: y * 2 + dy });
        }
      }
    }
  }

  console.log(`待处理 ${jobs.length} 张 z8 瓦片`);
  let done = 0;
  let failed = 0;
  let bytes = 0;
  const started = Date.now();
  async function worker() {
    for (;;) {
      const job = jobs.shift();
      if (!job) return;
      const file = path.join(BASE, job.layer, '8', String(job.x), `${job.y}.png`);
      if (fs.existsSync(file) && fs.statSync(file).size > 100) { done += 1; continue; }
      const url = `https://gis.sinica.edu.tw/ccts/file-exists.php?img=${job.layer}-png-8-${job.x}-${job.y}`;
      try {
        bytes += await download(url, file);
      } catch (error) {
        failed += 1;
        console.error(`FAIL ${job.layer}/8/${job.x}/${job.y}: ${error.message}`);
      }
      done += 1;
      if (done % 100 === 0) {
        const sec = ((Date.now() - started) / 1000).toFixed(0);
        console.log(`${done}/${done + jobs.length} · ${(bytes / 1048576).toFixed(1)} MB · ${sec}s`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // 生成运行时清单：只请求确实存在的 z8 瓦片，避免 404。
  const manifest = [];
  for (const layer of fs.readdirSync(BASE, { withFileTypes: true })) {
    if (!layer.isDirectory()) continue;
    const z8 = path.join(BASE, layer.name, '8');
    const files = [];
    walkTiles(z8, files);
    for (const file of files) {
      const parts = file.split(path.sep);
      const y = parts.pop().replace('.png', '');
      const x = parts.pop();
      manifest.push(`${layer.name}/${x}/${y}`);
    }
  }
  fs.writeFileSync(path.join(BASE, 'z8-manifest.json'), JSON.stringify(manifest));
  console.log(`清单：${manifest.length} 张 z8 瓦片`);
  console.log(`完成：${done} 张，失败 ${failed}，新增 ${(bytes / 1048576).toFixed(1)} MB`);
}

main().catch((error) => { console.error(error); process.exit(1); });
