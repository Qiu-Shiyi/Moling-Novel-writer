# 墨灵 UI 重设计规格

## Why
当前墨灵 AI 小说创作助手的界面存在以下问题：
1. 视觉风格单调 — 大量使用 slate 灰色调，缺乏层次感和品牌个性
2. 交互反馈薄弱 — 按钮悬停、状态切换等微交互几乎没有动画
3. 排版缺乏节奏 — 字体大小对比不足，信息层级不清晰
4. 空间利用呆板 — 全是直角矩形卡片，缺乏视觉变化
5. 色彩运用保守 — 仅有 amber 强调色，没有形成完整的色彩系统

## What Changes
- **全新视觉主题**：采用"墨水与宣纸"东方美学，深色模式下的水墨意境
- **完整色彩系统**：主色（墨黑）、强调色（朱砂红）、辅助色（竹青、藤黄）
- **精致排版系统**：使用 Noto Serif SC（标题）+ Noto Sans SC（正文）字体组合
- **丰富微交互**：悬停缩放、点击涟漪、页面切换过渡、加载动画
- **卡片重设计**：圆角变化、阴影层次、边框发光效果
- **布局优化**：更合理的留白、非对称构图、视觉引导线
- **动效系统**：页面进入动画、列表 stagger 效果、模态框弹出动画

## Impact
- Affected files:
  - `src/index.css` — 全局样式和 CSS 变量
  - `src/components/Layout/Sidebar.tsx` — 侧边栏重设计
  - `src/components/Layout/Header.tsx` — 顶部栏重设计
  - `src/components/Layout/Layout.tsx` — 布局结构调整
  - `src/components/Dashboard/NovelCard.tsx` — 小说卡片重设计
  - `src/components/Dashboard/CreateNovelModal.tsx` — 创建弹窗重设计
  - `src/pages/Dashboard.tsx` — 书架页面重设计
  - `src/pages/Editor.tsx` — 编辑器页面重设计
  - `src/pages/IdeaLab.tsx` — 灵感孵化室重设计
  - `src/pages/CharacterWorkshop.tsx` — 人物工坊重设计
  - `src/pages/WorldBuilder.tsx` — 世界观页面重设计
  - `src/pages/Settings.tsx` — 设置页面（如有）

## ADDED Requirements

### Requirement: 水墨东方美学视觉系统
The system SHALL provide a cohesive visual design system inspired by traditional Chinese ink painting aesthetics.

#### Scenario: 色彩系统
- **WHEN** 界面渲染时
- **THEN** 使用以下色彩变量：
  - `--ink-900`: #0a0a0f（墨黑背景）
  - `--ink-800`: #12121a（卡片背景）
  - `--ink-700`: #1a1a24（ elevated 表面）
  - `--ink-600`: #252532（边框、分隔线）
  - `--cinnabar`: #c45c48（朱砂红，主强调色）
  - `--cinnabar-light`: #d47360（朱砂浅，悬停状态）
  - `--bamboo`: #5a8a6e（竹青，次强调色）
  - `--rattan`: #c9a84c（藤黄，信息/警告）
  - `--paper`: #e8e0d0（宣纸色，文字）
  - `--paper-dim`: #a09888（淡墨，次要文字）

#### Scenario: 排版系统
- **WHEN** 文字渲染时
- **THEN** 使用：
  - 标题：Noto Serif SC，font-weight 600-700
  - 正文：Noto Sans SC，font-weight 400-500
  - 标签/辅助文字：Noto Sans SC，font-weight 400，letter-spacing 0.05em

#### Scenario: 阴影与深度系统
- **WHEN** 卡片或浮层渲染时
- **THEN** 使用分层阴影：
  - 层级1：`0 1px 2px rgba(0,0,0,0.3)`
  - 层级2：`0 4px 12px rgba(0,0,0,0.4)`
  - 层级3：`0 8px 24px rgba(0,0,0,0.5)`
  - 发光效果：`0 0 20px rgba(196,92,72,0.15)`（朱砂红微光）

### Requirement: 精致微交互系统
The system SHALL provide polished micro-interactions for all interactive elements.

#### Scenario: 按钮交互
- **WHEN** 用户悬停在按钮上
- **THEN** 按钮在 200ms 内平滑过渡：背景色变化、轻微上移 translateY(-1px)、阴影增强
- **WHEN** 用户点击按钮
- **THEN** 按钮在 100ms 内轻微下压 translateY(0)，产生按压感

#### Scenario: 卡片交互
- **WHEN** 用户悬停在卡片上
- **THEN** 卡片在 300ms 内：边框颜色变为朱砂红半透明、阴影增强、内部元素轻微放大
- **WHEN** 用户点击卡片
- **THEN** 卡片产生涟漪扩散效果（CSS animation）

#### Scenario: 导航交互
- **WHEN** 用户切换导航项
- **THEN** 激活指示器（朱砂色竖线或底边）在 250ms 内滑动到目标位置
- **WHEN** 侧边栏展开/收起
- **THEN** 使用 300ms ease-in-out 过渡动画

#### Scenario: 页面过渡
- **WHEN** 用户切换页面
- **THEN** 新页面以 fade-in + translateY(8px) 动画进入，持续 300ms

#### Scenario: 列表加载
- **WHEN** 列表数据加载完成
- **THEN** 列表项以 stagger 动画依次出现，每项延迟 50ms

### Requirement: 组件级重设计
The system SHALL redesign all major UI components with the new aesthetic.

#### Scenario: Sidebar 侧边栏
- **WHEN** 侧边栏渲染时
- **THEN** 显示：
  - 品牌区域：朱砂红圆形 Logo + "墨灵" 书法风格标题
  - 导航项：图标 + 文字，激活时有朱砂色左边界 + 背景高亮
  - 底部设置入口
  - 当前小说子导航：以缩进方式展示，带有连接竖线

#### Scenario: Header 顶部栏
- **WHEN** 顶部栏渲染时
- **THEN** 显示：
  - 左侧：页面标题（大号衬线字体）+ 副标题（小号无衬线）
  - 中间：搜索框（圆角、透明背景、聚焦时朱砂色边框）
  - 右侧：操作按钮组（保存、预览、导出），导出按钮使用朱砂红

#### Scenario: NovelCard 小说卡片
- **WHEN** 小说卡片渲染时
- **THEN** 显示：
  - 顶部：渐变封面区域（使用用户选择的渐变），底部有墨迹晕染效果
  - 中部：小说标题（衬线字体、白色）+ 简介（淡墨、2行截断）
  - 底部：元信息（章节数、字数、更新时间）+ 操作按钮
  - 悬停时：卡片上浮、封面区域轻微放大、操作按钮从透明淡入

#### Scenario: Editor 写作区
- **WHEN** 编辑器渲染时
- **THEN** 显示：
  - 左侧章节列表：紧凑设计，激活章节有朱砂色左边框
  - 中间编辑区：宣纸色背景（#1c1c14）、淡墨文字、舒适行高
  - 工具栏：悬浮式设计，半透明背景 + 毛玻璃效果
  - AI 续写面板：从底部滑入，带有朱砂色顶部边框

#### Scenario: IdeaLab 灵感孵化室
- **WHEN** 灵感孵化室渲染时
- **THEN** 显示：
  - 标签页：胶囊式设计，激活标签有朱砂色背景
  - 输入区域：大圆角、聚焦时发光效果
  - 结果展示：打字机效果逐字出现
  - 右侧提示卡片：竹青色边框装饰

#### Scenario: Modal 弹窗
- **WHEN** 弹窗打开时
- **THEN** 背景以 fade-in 变暗，弹窗从 scale(0.95) + opacity(0) 动画到正常状态，持续 250ms
- **WHEN** 弹窗关闭时
- **THEN** 反向动画，持续 200ms

## MODIFIED Requirements
### Requirement: 现有功能保持
所有现有功能（小说创建、编辑、AI 续写、人物管理、世界观设定、灵感孵化）保持完整，仅改变视觉呈现和交互方式。

## REMOVED Requirements
### Requirement: 旧视觉风格
**Reason**: 被新的水墨东方美学系统替代
**Migration**: 所有 slate 色系、amber 强调色、直角卡片设计将被新系统覆盖
