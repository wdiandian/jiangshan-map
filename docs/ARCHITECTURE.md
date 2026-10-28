# 江山时序 · 历史研究台架构

## 一、目标与定位

把「江山时序」从“可浏览的历史地图”升级为“以地图为基础的历史研究台”。

- **地图是底座**，不是全部。
- **板块可插拔**：疆域、谱系、人物、史料、专题等各成单元。
- **研究可积累**：书签、笔记、研究线跨板块保存。
- **扩展成本低**：新增板块只加目录与一条注册记录，不改主程序。

## 二、现状评估

### 已有优势


| 能力                    | 位置                                 | 可复用性        |
| --------------------- | ---------------------------------- | ----------- |
| 18 朝代、183 幅疆域快照       | `js/map_data.js`                   | 高，板块可直接引用   |
| 1753 古城、471 大事、571 地标 | `js/map_data.js`、`js/lore_data.js` | 高           |
| 点地溯源、点人溯事             | `js/app.js`                        | 高，但耦合在单类中   |
| 完整 URL 深链             | `js/app.js` `_restoreFromQuery`    | 高，可作为研究记录格式 |
| 专题页生成                 | `scripts/build_seo_topics.js`      | 中，需扩展为板块生成  |
| 39 个端到端校验             | `scripts/validate_atlas.js`        | 高，需增加板块契约校验 |


### 主要限制

1. **单类巨石**：`js/app.js` 约 12,350 行、约 150 个方法，所有功能集中在一个 `HistoricalAtlasController` 里。
2. **无模块边界**：数据、渲染、交互、双语、深链混在一起，新增功能只能继续往同一个类里加。
3. **无持久化**：全项目仅 3 处 `localStorage`，只用于“是否看过引导”。
4. **专题与主应用割裂**：`topics/` 是独立静态页，不复用主应用的数据与交互。
5. **生成器会重写主页面**：`build_seo_topics.js` 直接改写 `index.html`，任何首页结构调整都要与生成器协调。

## 三、目标架构

### 3.1 分层

```
┌──────────────────────────────────────────────────────────┐
│ Shell 外壳：顶栏、三层板块导航、全局搜索、研究入口          │
├──────────────────────────────────────────────────────────┤
│ Core 内核：注册表、上下文、存储、导航、格式                │
├──────────────────────────────────────────────────────────┤
│ Data 数据：历史数据、板块专属数据                          │
├──────────────────────────────────────────────────────────┤
│ Boards 三大板块                                           │
│   地图        → 疆域时序（territory）                     │
│   可检索史料  → 史料库（sources）                         │
│   子板块      → 总览（modules）→ 谱系 / 精英政治 / 专题 / 新增单元 │
└──────────────────────────────────────────────────────────┘
```

### 3.2 目录结构

```
jiangshan-map/
├─ index.html                  # 默认板块：疆域时序
├─ core/
│  ├─ registry.js              # 板块注册表加载与查询
│  ├─ nav.js                   # 顶栏板块导航渲染
│  ├─ context.js               # 研究上下文（年份/地点/人物/相机）
│  ├─ store.js                 # 研究记录存储与导入导出
│  └─ tokens.css               # 共享设计令牌
├─ data/
│  ├─ map_data.js              # 现有疆域数据（逐步迁入）
│  ├─ lore_data.js             # 现有典故数据
│  └─ boards/                  # 板块专属数据
├─ boards/
│  ├─ registry.json            # 三层板块的单一事实来源（groups + boards）
│  ├─ territory/               # 地图（现主地图在根目录）
│  ├─ sources/                 # 可检索的史料
│  │  └─ data/                 # 板块自有数据，不依赖主程序
│  ├─ modules/                 # 子板块总览与扩展说明
│  ├─ genealogy/               # 子板块：族群谱系（北族长卷）
│  ├─ emperors/                # 子板块：帝王谱系（秦—清世系图）
│  │  └─ data/emperors.js      # 帝王节点、parent 与继位关系
│  ├─ elites/                  # 子板块：历代精英政治（制度、家族与争论）
│  ├─ person/                  # 子板块（预留）：人物行迹
│  └─ topics/                  # 子板块入口：专题图志（由生成器产出）
├─ js/app.js                   # territory 板块控制器
├─ css/style.css               # territory 板块样式
├─ scripts/
│  ├─ build_seo_topics.js      # 现有专题生成
│  ├─ build_board_index.js     # 新增：按注册表生成板块索引
│  └─ validate_atlas.js        # 现有校验 + 板块契约校验
└─ docs/
   └─ ARCHITECTURE.md          # 本文档
```

### 3.3 板块契约

注册表分两层：`groups` 是三大顶层板块，`boards` 是可挂载页面。每个 `board` 用 `group` 归属到某个顶层板块。

```json
{
  "version": 2,
  "defaultBoard": "territory",
  "groups": [
    { "id": "map", "title": "地图", "entry": "index.html", "order": 10 },
    { "id": "sources", "title": "可检索的史料", "entry": "boards/sources/index.html", "order": 20 },
    { "id": "modules", "title": "子板块", "entry": "boards/modules/index.html", "order": 30 }
  ],
  "boards": [
    {
      "id": "your-unit",
      "title": "你的子板块",
      "description": "一句话说明",
      "group": "modules",
      "entry": "index.html",
      "order": 50,
      "data": ["../../data/boards/your-unit.js"],
      "context": ["year", "place"],
      "status": "active"
    }
  ]
}
```

约束：

- `groups` 至少两项；每项有唯一 `id`、`title` 与可访问的 `entry`。
- `boards[].group` 必须指向已存在的 group。
- `id` 全局唯一，小写连字符。
- `entry` 必须是板块目录内存在的 HTML。
- `order` 决定导航顺序。
- `status` 为 `active` 或 `draft`，`draft` 不出现在导航。
- 板块页面必须引入 `core/nav.js` 与 `core/tokens.css`，保证外壳一致。

#### 独立性原则（硬约束）

板块必须能独立修改，不能被主程序或生成器锁死：

1. **目录自包含**：板块的 HTML、样式、脚本、数据都放在 `boards/<id>/` 内，删除该目录不影响其他板块。
2. **内核可选**：板块不加载 `core/` 也必须能正常打开；内核只提供导航、上下文、存储三项增强。
3. **导航可挂载**：板块自带 `[data-board-nav]` 容器时，内核只填充内容，不替换板块头部结构。
4. **生成器不写板块页**：`build_seo_topics.js` 只生成专题页与索引，永不改写 `boards/<id>/index.html`。
5. **校验只查契约**：校验器只检查 `board.json` 必填字段、入口存在、注册一致，不规定板块内部的 HTML 结构或视觉。
6. **自描述优先**：每个子目录板块拥有自己的 `board.json`；根 `boards/registry.json` 只是导航索引，可随时由脚本从各板块汇总重建。

#### 三层导航与子板块扩展

顶栏只呈现三个入口，不随子单元数量膨胀：


| 顶层板块   | 入口                          | 内容           |
| ------ | --------------------------- | ------------ |
| 地图     | `index.html`                | 疆域时序主地图      |
| 可检索的史料 | `boards/sources/index.html` | 书目、全文、人物检索   |
| 子板块    | `boards/modules/index.html` | 谱系、帝王世系、精英政治、专题与后续新增单元 |


新增一个子单元不需要改 `core/`、导航或生成器：

1. 新建 `boards/<id>/`，放入自包含的 `index.html` 与 `board.json`。
2. 在 `boards/registry.json` 的 `boards` 中增加一条记录，`group` 设为 `"modules"`。
3. 刷新页面，顶栏的“子板块”入口不变，总览页会自动多出一张卡片。

删除时反向操作即可；子板块之间、子板块与地图/史料库之间不共享代码依赖。

### 3.4 史料板块的数据

`boards/sources/` 把外部数据固化在板块自己的 `data/` 下，不依赖主程序或其他板块：

```
boards/sources/
├─ index.html                 # 数据源 / 摘录 / 书目 / 全文 / 人物五个视图
├─ board.json
└─ data/
   ├─ catalog.js              # Kanripo 9,349 部书目（id/书名/朝代/作者/部类/体积）
   ├─ cbeta_canons.js         # CBETA 29 种藏经总目
   ├─ quotes.js               # 人工校读的史料摘录与按语
   ├─ text_manifest.js        # 核心史籍全文清单
   ├─ meta.js                 # 统计与生成日期
   └─ texts/<KR-ID>.json      # 16 部核心史籍，按卷/篇切分
```

- **书目**：来自 GitHub `kanripo` 组织的仓库元数据，描述字段按「书名-朝代-作者」解析。
- **全文**：16 部核心史籍共 1,258 万字，正文来自 Kanripo 公版整理本，已去除页码与校记标记。
- **人物**：浏览器直接调用 CBDB 的 `https://cbdb.fas.harvard.edu/cbdbapi/person` JSON 接口，不落库。
- **佛典**：只收 CBETA 藏经总目与外链，正文遵循其 CC BY-NC-SA 4.0 非商业条款。
- **刷新**：用 `gh api` 拉取 `.tmp_sources/kanripo_repos.json`、`.tmp_sources/canons.json` 和各书 tarball，解压到 `.tmp_sources/books/<ID>/`，再运行 `node scripts/build_sources_data.js`。`.tmp_sources/` 已在 `.gitignore` 中排除。

### 3.4 内核接口

**上下文**：跨板块共享“我正在看什么”。

```js
JiangshanContext.get()
// -> { board, year, place, person, camera }

JiangshanContext.set({ year: 741, place: "长安" })
JiangshanContext.toUrl()      // 生成可分享、可收藏的 URL
JiangshanContext.fromUrl()    // 从 URL 恢复
JiangshanContext.subscribe(fn)
```

**研究记录**：跨板块共享“我记了什么”。

```js
JiangshanStore.addBookmark({ board, type, target, year, label, url })
JiangshanStore.listBookmarks()
JiangshanStore.addNote({ board, target, year, text, tags })
JiangshanStore.listNotes()
JiangshanStore.addThread({ title, items })
JiangshanStore.export()       // 返回 JSON 字符串
JiangshanStore.import(json)   // 合并导入
```

**注册表**：

```js
JiangshanRegistry.all()        // 全部板块
JiangshanRegistry.active()     // 导航可见板块
JiangshanRegistry.get(id)
```

### 3.5 研究记录数据模型

```js
{
  "version": 1,
  "bookmarks": [
    {
      "id": "bm_xxx",
      "board": "territory",
      "type": "place",
      "target": "长安",
      "year": 741,
      "label": "盛唐长安",
      "url": "?year=741&place=长安",
      "createdAt": "2026-10-28T10:00:00Z"
    }
  ],
  "notes": [
    {
      "id": "nt_xxx",
      "board": "territory",
      "target": "长安",
      "year": 741,
      "text": "此处补入个人札记",
      "tags": ["唐", "都城"],
      "createdAt": "2026-10-28T10:00:00Z",
      "updatedAt": "2026-10-28T10:00:00Z"
    }
  ],
  "threads": [
    {
      "id": "th_xxx",
      "title": "安史之乱前后的长安",
      "items": ["bm_xxx"],
      "createdAt": "2026-10-28T10:00:00Z"
    }
  ]
}
```

存储位置：`localStorage` 键 `jiangshan_research_v1`。
导出：`jiangshan-research-YYYYMMDD.json`。
导入：按 `id` 合并，冲突时保留更新时间较新者。

### 3.6 路由与深链

保持现有参数不变，新增板块参数：


| 参数                | 含义    | 兼容  |
| ----------------- | ----- | --- |
| `board`           | 板块 id | 新增  |
| `year`            | 年份    | 已有  |
| `place`           | 地点    | 已有  |
| `person`          | 人物    | 已有  |
| `trace`           | 经纬度   | 已有  |
| `zoom` / `center` | 视口    | 已有  |
| `quiz`            | 挑战模式  | 已有  |


板块页之间的跳转统一写成：

```
/boards/genealogy/?year=1125&board=genealogy
```

主地图继续使用 `/?year=...`，不破坏既有外链与 SEO。

## 四、关键决策与理由

### 决策一：MPA 外壳，而不是继续单页扩张

- 现有 `topics/` 已是 MPA，浏览器前进后退天然可用。
- 板块可以独立开发、独立校验，单个板块出错不影响全部。
- 不需要引入打包工具，保持纯静态。

### 决策二：新增 `core/`，不重写 `app.js`

- `app.js` 体量大且有 39 项回归校验保护，重写风险高。
- 通过少量挂载点接入内核，逐步瘦身。
- 新板块直接基于内核开发，不继承历史包袱。

### 决策三：研究记录用 localStorage + JSON 导出

- 纯静态环境没有后端，localStorage 是成本最低的方案。
- JSON 导出解决备份、迁移和跨设备问题。
- 数据带 `version`，为后续迁移留出空间。

### 决策四：注册表驱动，而不是手写导航

- 板块数量会持续增加，手写导航必然遗漏。
- `registry.json` 是唯一事实来源，导航、索引、sitemap 都从它生成。
- 校验器可以据此检查每个板块是否合规。

## 五、迁移路径

### 阶段 0：地基修复（已完成）

- 修复 `index.html` 中累积的重复 `</nav>`。
- 修复生成器重复插入 `</nav>` 的问题，确保幂等。
- 本文档落盘。

### 阶段 1：建立内核骨架（已完成）

- 新增 `core/registry.js`、`core/nav.js`、`core/context.js`、`core/store.js`、`core/tokens.css`。
- 新增 `boards/registry.json`，先只登记疆域时序。
- `index.html` 接入导航与上下文，不改变现有交互。
- 验证：`validate_atlas.js` 通过；首页加载正常；单板块时 `#board-switcher` 自动隐藏；`boards/registry.json` 返回 200。

### 阶段 2：北族长卷迁为正式板块（已完成）

- 将 `topics/custom/northern-peoples.html` 迁入 `boards/genealogy/index.html`。
- 补 `boards/genealogy/board.json`，接入共享导航与上下文。
- 保留原页面交互，只替换外壳部分。
- 验证：主地图顶栏出现“疆域时序 / 族群谱系”两个入口；点击可进入板块页；板块页当前项正确高亮；原研究台交互未受影响。
- 遗留：`topics/custom/northern-peoples.html` 与 `topics/northern-peoples.html` 仍作为专题发布形态存在，阶段 3 改为从板块页生成，避免双源维护。

### 阶段 3：验证扩展性（已完成）

- 新增最小板块 `boards/sources/`（史料原文），只加目录 + `board.json` + 一条注册记录即可上线。
- 专题生成器改为从 `boards/genealogy/index.html` 读取，生成 `topics/northern-peoples.html` 时自动去掉研究台外壳，并修正相对路径。
- 删除 `topics/custom/northern-peoples.html`，板块页成为唯一维护源，双源问题消除。
- 验证：三个板块导航正常切换；史料板块关键词筛选正常（“匈奴”命中 5/18 条）；生成的专题页可独立打开，返回链接正确；完整回归通过。

### 阶段 4：研究记录贯通（已完成）

- 新增 `core/research-panel.js` 与 `core/research-panel.css`，作为可选组件。
- 疆域、谱系、史料三个板块均接入“收藏当前 / 笔记 / 导出导入”。
- 验证：在史料板块收藏书签并保存笔记，切回主地图后书签仍在；导出导入按钮可用；其他板块未引入该组件时不受影响。
- 研究线（threads）的数据结构已在 `JiangshanStore` 中就绪，暂未开放界面，留待后续按需启用。

## 六、风险与约束


| 风险                  | 影响  | 应对                                   |
| ------------------- | --- | ------------------------------------ |
| `app.js` 体积大，改动易回归  | 高   | 只加挂载点，不改核心渲染；每次改完跑完整校验               |
| 生成器会重写 `index.html` | 中   | 生成器只改 SEO 区块，导航由 `core/nav.js` 运行时注入 |
| 双语与繁简是横切关注点         | 中   | 新板块统一从 `core` 取文案，不各自实现              |
| 数据文件体积大             | 中   | 板块按需加载，不一次引入全部历史数据                   |
| 用户直接编辑页面            | 低   | 研究记录与页面分离，刷新不丢失                      |


## 七、验收标准

1. 新增一个板块，只需要新增目录与一条 `registry.json` 记录。
2. 所有板块共用同一套顶栏、字体、配色与返回逻辑。
3. 在任一板块保存的书签，可在另一板块打开。
4. 研究记录可导出为 JSON，并能在另一浏览器导入恢复。
5. 现有 39 项端到端校验全部通过。
6. `node scripts/build_seo_topics.js` 连续运行两次，`index.html` 结构不发生变化。

