# WINCOME Hair Accessories — B2B 独立站设计合约

## Design Direction
**"Refined Manufacturer"** — 平衡制造业的专业效率与高端生活方式品牌的温度。采用 **Architectural-Warm-Minimalism** 设计体系：暖中性色调、高对比度排版、扁平化 UI，避免传统工厂网站的冰冷感，营造"温暖的专业感"以赢得全球品牌客户信任。

## Reference Sources
- `vendor/open-design/adapter/STATIC_POLICY.md` — 静态使用边界
- `vendor/open-design/upstream/design-systems/Architectural-Warm-Minimalism/DESIGN.md` — 核心视觉语言
- `vendor/open-design/upstream/design-systems/Architectural-Warm-Minimalism/tokens.css` — 颜色与排版令牌
- `vendor/open-design/upstream/design-systems/Architectural-Warm-Minimalism/components.html` — 组件间距与层级参考
- `vendor/open-design/upstream/craft/anti-ai-slop.md` — 反模板化质量检查
- **用户参考链接 luxopack.com**: 吸取出价章格式（Hero + 信任条 + 产品卡片带 MOQ/交期徽章 + 阶梯定价 + 工厂对比表 + 询盘表单）

## Design Tokens
### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#fdfbf7` | 主背景（暖奶油白） |
| `--bg-secondary` | `#e8e0d2` | 次要区块背景（沙色/浅米色） |
| `--fg-primary` | `#433c35` | 主文字色（深青铜） |
| `--fg-muted` | `#c3af9f` | 辅助文字/标签（淡玫瑰金） |
| `--accent-navy` | `#1a2b3c` | 主 CTA、信任徽章（深海军蓝） |
| `--accent-gold` | `#c5a059` | 高亮、装饰图标、价格（柔金） |
| `--border-subtle` | `rgba(67, 60, 53, 0.1)` | 细分割线 |

### Typography
- **Display**: Georgia, 'Times New Roman', serif — H1/H2 标题，优雅权威
- **Body**: system-ui, -apple-system, 'Segoe UI', sans-serif — 正文、标签、UI
- **Scale**: H1 80px → 移动端 45px, H2 60px, Body 16px, Caption 14px (0.05em tracking)

### Layout
- **圆角**: 0px（直角，建筑感）
- **阴影**: 无（纯扁平设计，深度由色块对比实现）
- **区块间距**: 80px 垂直留白
- **最大宽度**: 1440px 居中

## Page Structure
1. **Homepage** — 英雄区 → 信任条 → 产品分类网格 → 制造能力 → 客户评价 → 博客预览 → 全球覆盖/询盘尾
2. **Products** — 侧边栏筛选（材质/类型）→ 产品网格（图片优先 + Quote CTA）
3. **Product Detail** — 图集 → 规格表 → MOQ/交期层级 → 询盘 CTA
4. **Customization / OEM** — 定制能力展示 → 材质库 → Logo/包装方案
5. **About / Factory** — 品牌故事 → 认证墙 → 工厂照片
6. **Contact / Quote** — 多步询盘表单（产品选择 → 定制规格 → 上传设计）
7. **FAQ** — 折叠式 SEO 问答区

## Component Plan
- `HeroSection` — 大标题 + 四个信任徽章（MOQ/交期/运费/设计服务）
- `StatsBar` — 指标条：15+ 年 / 500+ 品牌 / 3000㎡ 工厂
- `ProductCard` — 直角卡片，图片填充，悬浮显示 MOQ 徽章
- `CategoryCard` — 大图 + 品类名叠加
- `ProcessFlow` — 1-2-3-4 编号步骤，金色编号
- `ComparisonTable` — WINCOME vs 通用平台对比
- `TestimonialCard` — 全幅衬线引用 + 署名
- `QuoteForm` — 底部边框输入框风格，多步表单
- `WhatsAppButton` — 固定悬浮联系按钮
- `FAQAccordion` — 折叠问答
- `Navbar` — 顶部导航，品牌名 + 菜单 + Quote CTA
- `Footer` — 多列链接 + 联系信息 + 版权

## Copy Tone
- **语调**: 温暖专业 "The partner behind the world's most elegant hair accessories."
- **关键词**: Manufacturer, OEM/ODM, Wholesale, Custom, Supplier, Global Shipping
- **禁用**: "Get Started"（用 "Request a Quote"）、"Our Features"（用 "Manufacturing Capabilities"）
- **数据真实**: 统计数字标注 `[Verified]` 标签

## Responsive Rules
- **Mobile**: 单列堆叠，H1 缩至 45px，padding 16px
- **Desktop**: 1440px 最大宽度，4 列产品网格，80px 水平间距
- **交互**: 文字链接悬浮 `translateX(4px)`，按钮 `scale(1.02)`

## Implementation Notes
- 框架: React + Vite + Tailwind CSS
- 样式: 通过 `tailwind.config.js` 扩展主题，映射设计令牌
- 图标: Lucide React (monoline, 1.5pt stroke)
- 表单: 产品 ID 传递到询盘表单状态
- 静态资源: `/public/assets/images/`

## Image Manifest
| Filename | Source | Usage |
|----------|--------|-------|
| `hero-clips.jpg` | `imageGenerate:Premium closeup of custom acetate hair claw clips, warm soft lighting, cream background, luxury feel` | 首页 Hero 主视觉 |
| `product-claw-colorful.jpg` | `imageGenerate:Collection of colorful cellulose acetate hair claw clips, professional studio product shot, flat layout on white` | 产品展示 |
| `product-bow-satin.jpg` | `imageGenerate:Elegant satin hair bows in multiple pastel colors, professional product photography, soft lighting` | 产品展示 |
| `product-headband-pearl.jpg` | `imageGenerate:Luxury pearl embellished headbands on velvet display, high-end product shot, warm tones` | 产品展示 |
| `product-scrunchie-silk.jpg` | `imageGenerate:Premium silk scrunchies in neutral and blush tones, flat lay product photography` | 产品展示 |
| `factory-production.jpg` | `unsplash` | 工厂/关于页 |
| `factory-line.jpg` | `unsplash` | 制造能力页 |
| `shipping-logistics.jpg` | `unsplash` | 全球运输 |
| `material-acetate.jpg` | `unsplash` | 材质展示 |
| `placeholder.svg` | `generated` | 通用占位图 |

## Risks / Open Questions
- **产品实拍**: 设计依赖高质量产品摄影，AI 生成图可作占位但真实产品图效果更好
- **认证文件**: BSCI/ISO 认证需用户提供真实文件
- **对比数据**: 工厂直供 vs 平台对比需具体数据支撑
- **品牌 Logo**: WINCOME 主品牌 Logo 文件需用户提供
