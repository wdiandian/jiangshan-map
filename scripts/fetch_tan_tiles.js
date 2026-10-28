#!/usr/bin/env node
/**
 * 下载谭图瓦片到本地，供主地图离线使用。
 *
 * 用法：
 *   node scripts/fetch_tan_tiles.js            # 默认 z5-z7
 *   node scripts/fetch_tan_tiles.js 5 6        # 指定层级
 *
 * 输出：assets/tan/<layer>/<z>/<x>/<y>.png
 * 说明：仅用于本地研究；瓦片版权归中研院 CCTS 与《中国历史地图集》原图集所有。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'tan');
const LAYERS = [
  'warring_states',
  'bc0210',
  'bc0007',
  'ad0140',
  'ad0262',
  'ad0281',
  'ad0382',
  'ad0497',
  'ad0612',
  'ad0741',
  'ad1111',
  'ad1208',
  'ad1330',
  'ad1582',
  'ad1820',
];

const BOUNDS = { west: 66, east: 142, south: 14, north: 55 };
const CONCURRENCY = 12;

function latToY(lat, z) {
  const rad = (lat * Math.PI) / 180;
  return Math.floor(
    ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** z
  );
}

function tilesFor(z) {
  const n = 2 ** z;
  const x0 = Math.max(0, Math.floor(((BOUNDS.west + 180) / 360) * n) - 1);
  const x1 = Math.min(n - 1, Math.floor(((BOUNDS.east + 180) / 360) * n) + 1);
  const y0 = Math.max(0, latToY(BOUNDS.north, z) - 1);
  const y1 = Math.min(n - 1, latToY(BOUNDS.south, z) + 1);
  const out = [];
  for (let x = x0; x <= x1; x += 1) {
    for (let y = y0; y <= y1; y += 1) out.push({ x, y });
  }
  return out;
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
  const zooms = process.argv.slice(2).map(Number).filter((z) => Number.isInteger(z));
  const levels = zooms.length ? zooms : [5, 6, 7];
  const jobs = [];
  for (const z of levels) {
    for (const layer of LAYERS) {
      for (const tile of tilesFor(z)) {
        jobs.push({ z, layer, ...tile });
      }
    }
  }

  let done = 0;
  let skipped = 0;
  let bytes = 0;
  let failed = 0;
  const started = Date.now();

  async function worker() {
    for (;;) {
      const job = jobs.shift();
      if (!job) return;
      const file = path.join(OUT, job.layer, String(job.z), String(job.x), `${job.y}.png`);
      if (fs.existsSync(file) && fs.statSync(file).size > 100) {
        skipped += 1;
        done += 1;
        continue;
      }
      const url = `https://gis.sinica.edu.tw/ccts/file-exists.php?img=${job.layer}-png-${job.z}-${job.x}-${job.y}`;
      try {
        bytes += await download(url, file);
      } catch (error) {
        failed += 1;
        console.error(`FAIL ${job.layer}/${job.z}/${job.x}/${job.y}: ${error.message}`);
      }
      done += 1;
      if (done % 100 === 0 || done === jobs.length) {
        const sec = ((Date.now() - started) / 1000).toFixed(0);
        console.log(`${done}/${done + jobs.length} · ${(bytes / 1048576).toFixed(1)} MB · ${sec}s`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  const sec = ((Date.now() - started) / 1000).toFixed(0);
  console.log(`完成：${done} 张，跳过 ${skipped}，失败 ${failed}，新增 ${(bytes / 1048576).toFixed(1)} MB，用时 ${sec}s`);
  console.log(`目录：${path.relative(ROOT, OUT)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
