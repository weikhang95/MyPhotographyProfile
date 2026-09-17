import { Injectable, signal, computed } from '@angular/core';

export type SupportedLocale = 'en' | 'zh';

export interface TranslationDictionary {
  readonly nav: {
    readonly portfolio: string;
    readonly writings: string;
    readonly about: string;
    readonly contact: string;
    readonly backToPortfolio: string;
  };
  readonly theme: {
    readonly toDark: string;
    readonly toLight: string;
  };
  readonly lang: {
    readonly current: string;
    readonly toggleLabel: string;
    readonly switchButtonText: string;
  };
  readonly post: {
    readonly category: string;
    readonly title: string;
    readonly lead: string;
    readonly author: string;
    readonly authorName: string;
    readonly publishDate: string;
    readonly readTime: string;
    readonly tag: string;
    readonly cattleTitle: string;
    readonly cattleBody: string;
    readonly p1: string;
    readonly h2_1: string;
    readonly p2: string;
    readonly fig1Caption: string;
    readonly p3: string;
    readonly h2_2: string;
    readonly p4: string;
    readonly fig2Caption: string;
    readonly p5: string;
    readonly h2_3: string;
    readonly p6: string;
    readonly fig3Caption: string;
    readonly h2_conclusion: string;
    readonly conclusionP: string;
    readonly authorBio: string;
  };
  readonly home: {
    readonly introStatement: string;
    readonly introMeta: string;
    readonly filterAll: string;
    readonly filterStreet: string;
    readonly filterTravel: string;
    readonly filterQuiet: string;
    readonly latestWritingTag: string;
    readonly latestWritingTitle: string;
    readonly latestWritingMeta: string;
    readonly readEssay: string;
  };
  readonly about: {
    readonly title: string;
    readonly subtitle: string;
    readonly builderTitle: string;
    readonly builderText: string;
    readonly observerTitle: string;
    readonly observerText: string;
    readonly gearTitle: string;
    readonly cameraGearLabel: string;
    readonly cameraGear: string;
    readonly techStackLabel: string;
    readonly techStack: string;
    readonly milestonesTitle: string;
    readonly milestone1Year: string;
    readonly milestone1Title: string;
    readonly milestone1Desc: string;
    readonly milestone2Year: string;
    readonly milestone2Title: string;
    readonly milestone2Desc: string;
    readonly colophonTitle: string;
    readonly colophonText: string;
  };
}

const EN_DICTIONARY: TranslationDictionary = {
  nav: {
    portfolio: 'PORTFOLIO',
    writings: 'WRITINGS',
    about: 'ABOUT ME',
    contact: 'CONTACT',
    backToPortfolio: 'Back to Portfolio',
  },
  theme: {
    toDark: 'Switch to dark mode',
    toLight: 'Switch to light mode',
  },
  lang: {
    current: 'English',
    toggleLabel: '切换为简体中文',
    switchButtonText: '中文',
  },
  post: {
    category: 'ENGINEERING // AGENT ARCHITECTURE',
    title: 'Decoupling the Brain from the Hands: Architectural Patterns for Reliable AI Agents',
    lead: 'Harnesses encode assumptions that go stale as models improve. Building reliable, long-horizon agents requires treating execution sandboxes as disposable cattle and decoupling the reasoning loop from ephemeral runtime state.',
    author: 'By Chong Wei Khang',
    authorName: 'Chong Wei Khang',
    publishDate: 'Published Sep 17, 2026',
    readTime: '6 min read',
    tag: 'Angular 22 · WebMCP',
    cattleTitle: 'The Cattle Principle',
    cattleBody: 'If an agent’s sandbox dies or hits an unrecoverable timeout, the orchestrator should never crash with it. Treat execution environments as interchangeable cattle: catch the tool-call error, teardown the container, and re-provision from a standard recipe.',
    p1: 'A common architectural trap when building AI agents is placing all components—the model harness, the session history, and the execution environment—inside a single container. While tempting for rapid prototyping, this introduces what infrastructure engineers describe as the “pet problem”: the server becomes a delicate, irreplaceable pet that must be continually nursed when an execution loop stalls.',
    h2_1: '1. The Decoupled Tools Boundary',
    p2: 'The structural solution is to decouple what we consider the “Brain” (the LLM reasoning loop and harness) from the “Hands” (the execution sandbox, file system, and API proxies). The harness communicates across an isolated interface bus using a strict, schema-driven contract:',
    fig1Caption: 'Figure 1: Decoupling the decision loop (Brain) from ephemeral execution sandboxes (Hands). Zero credentials leak into the sandbox.',
    p3: 'Under this architecture, the agent harness does not care whether the sandbox is a local Docker container, a Cloudflare Worker, or a WebMCP browser endpoint. The interface remains uniform: execute(name, input) → string.',
    h2_2: '2. The Session is Not the Context Window',
    p4: 'Another critical mistake is conflating the model’s ephemeral context window with the durable session state. Models have token limits; sessions have infinite horizons. Instead of irreversible in-place context trimming, we maintain an append-only event stream that lives completely outside the model’s active window:',
    fig2Caption: 'Figure 2: The append-only event stream. The model interrogates positional slices without destroying raw historical context.',
    p5: 'When an agent reboots after a crash or resumes on a subsequent day, it calls wake(sessionId), fetches the event stream from the append head, and resumes without state loss.',
    h2_3: '3. Multi-Agent Specialization',
    p6: 'As intelligence scales, single monolithic agents struggle with cognitive overload. The multi-agent pattern delegates distinct responsibilities to specialized nodes under a central orchestrator:',
    fig3Caption: 'Figure 3: Multi-agent coordination matrix. The central orchestrator decomposes tasks into specialized planner, executor, and evaluator steps.',
    h2_conclusion: 'Conclusion & Key Takeaways',
    conclusionP: 'By designing systems around small, stable interfaces—decoupling the brain from the hands and the session log from the context window—we build architectures that outlast any single model generation. As models improve, the harness doesn\'t need to be rewritten; it simply orchestrates smarter tools.',
    authorBio: 'Senior Full Stack Developer at ViTrox & Photographer in Penang, Malaysia. Exploring agentic patterns, WebMCP, and modern frontend architecture.',
  },
  home: {
    introStatement: 'Chong Wei Khang (张炜康) is a senior software engineer and photographer based in Penang, Malaysia. Capturing quiet street light, travel atmospheres, and building reliable agentic software.',
    introMeta: 'Penang, MY  ·  Nikon Z5  ·  Full Stack & AI  ·  Bilingual Notes',
    filterAll: 'All Works',
    filterStreet: 'Street & Heritage',
    filterTravel: 'Travel & Scenery',
    filterQuiet: 'Quiet & Coffee',
    latestWritingTag: 'LATEST ESSAY // ARCHITECTURE',
    latestWritingTitle: 'Decoupling the Brain from the Hands: Architectural Patterns for Reliable AI Agents',
    latestWritingMeta: '6 min read · WebMCP · Event Streams',
    readEssay: 'Read Essay →',
  },
  about: {
    title: 'About Me',
    subtitle: 'Building software with engineering rigor, observing the world through quiet photographic frames.',
    builderTitle: 'The Builder — Code & Systems',
    builderText: 'With a background in Mechatronics Engineering, I evolved into a Senior Full Stack Developer at ViTrox Corporation in Penang since 2019. I design distributed systems, robust web interfaces, and agentic workflows using Angular 22, TypeScript, Python, and the emerging WebMCP protocol.',
    observerTitle: 'The Observer — Light & Moments',
    observerText: 'Photography is my way of slowing down. With a Nikon Z5, a 40mm prime, and a 24-120mm zoom, I look for quiet geometry in Penang\'s heritage streets, the calm stillness of specialty coffee bars, and the shifting atmospheres of travels across Southeast Asia and Europe.',
    gearTitle: 'Tools & Equipment',
    cameraGearLabel: 'Camera & Optics',
    cameraGear: 'Nikon Z5 · NIKKOR Z 24-120mm f/4 S · NIKKOR Z 40mm f/2',
    techStackLabel: 'Engineering Stack',
    techStack: 'Angular 22 · TypeScript · Python · WebMCP · Tailwind CSS · Cloudflare Workers',
    milestonesTitle: 'Journey & Timeline',
    milestone1Year: '2019 — Present',
    milestone1Title: 'Senior Full Stack Developer · ViTrox',
    milestone1Desc: 'Leading full-stack web and platform architecture, engineering data services, and prototyping modern agentic workflows.',
    milestone2Year: '2015 — 2019',
    milestone2Title: 'B.Eng. in Mechatronics Engineering',
    milestone2Desc: 'Graduated with first-class engineering foundations in embedded control, automation, and software integration.',
    colophonTitle: 'Colophon & Architecture',
    colophonText: 'This personal digital garden is designed and hand-crafted with Angular 22 standalone components, Tailwind CSS 4, and custom WebMCP tooling. Fully bilingual with responsive CJK typography and zero tracking scripts. Hosted on Cloudflare Workers edge network.',
  },
};

const ZH_DICTIONARY: TranslationDictionary = {
  nav: {
    portfolio: '作品集',
    writings: '专栏文章',
    about: '关于我',
    contact: '联系方式',
    backToPortfolio: '返回作品集',
  },
  theme: {
    toDark: '切换为深色模式',
    toLight: '切换为浅色模式',
  },
  lang: {
    current: '简体中文',
    toggleLabel: 'Switch to English',
    switchButtonText: 'EN',
  },
  post: {
    category: '工程架构 // AGENT 架构设计',
    title: '解耦思考与行动：构建高可靠 AI Agent 系统的架构模式',
    lead: '当底层大模型能力快速迭代时，把推理决策与执行环境绑死会导致系统过早老化。构建长期可靠的智能体系统，核心在于将执行沙箱视为可替换的“消耗品”（Cattle），并将核心决策回路与瞬态运行状态彻底解耦。',
    author: '作者：张炜康 (Chong Wei Khang)',
    authorName: '张炜康 (Chong Wei Khang)',
    publishDate: '发布于 2026年9月17日',
    readTime: '6 分钟阅读',
    tag: 'Angular 22 · WebMCP',
    cattleTitle: '消耗品原则 (The Cattle Principle)',
    cattleBody: '如果智能体的沙箱环境发生崩溃或超时，中枢调度器绝不能一同受阻。必须把执行环境当成随时可以重置的消耗品：捕获工具执行异常，销毁容器，并从标准模板秒级重建。',
    p1: '在构建 AI Agent 时，一个普遍的架构陷阱是将模型决策回路、会话历史与沙箱执行环境放在同一个容器内。在原型阶段这种做法看似敏捷，但极易带来运维工程师常说的“宠物问题”（Pet Problem）：容器变成了娇贵、不可替代的宠物，一旦执行死循环或崩溃就需要人工小心翼翼地维护。',
    h2_1: '1. 工具接口的解耦边界 (Decoupled Boundary)',
    p2: '根本性的工程解法是将系统划分为“大脑”（LLM 推理循环与 Harness 调度层）与“双手”（隔离执行沙箱、文件系统与 API 代理）。大脑与双手之间仅通过一条严格遵循 JSON Schema 约定的隔离通信总线交互：',
    fig1Caption: '图 1：将决策核心（大脑）与瞬态执行沙箱（双手）解耦。沙箱内完全零凭证暴露。',
    p3: '在此架构下，Agent Harness 无需关心执行环境是本地 Docker 容器、Cloudflare Worker 边缘节点还是基于浏览器 WebMCP 的端点。外部接口始终保持统一的 execute(name, input) → string 契约。',
    h2_2: '2. 会话状态不等于模型上下文窗口',
    p4: '另一个常见设计误区是将大模型的瞬态上下文窗口（Context Window）与系统的持久化会话状态（Session）混为一谈。Token 窗口存在硬性上限，但现实任务的生命周期是无限的。我们不应直接在窗口内粗暴裁剪历史，而是维护一条只增不减的追加型事件日志（Append-Only Event Stream）：',
    fig2Caption: '图 2：只增不减的事件流架构。模型按需查询历史切片，不破坏底层上下文完整性。',
    p5: '当智能体因超时重启或跨天唤醒时，只需调用 wake(sessionId)，从事件流最新的追加位点拉取断点信息，即可无损恢复执行。',
    h2_3: '3. 多智能体专业化协作拓扑',
    p6: '随着业务复杂度提升，单一全能型智能体极易出现认知过载。成熟的工程实践采用中心化协调器拓扑，将工作流解构给各个高度专精的职能节点：',
    fig3Caption: '图 3：多智能体协作矩阵。中心调度器将复杂意图拆解并分派给规划、执行、代码与回归验证专员。',
    h2_conclusion: '总结与核心思考',
    conclusionP: '通过设计简洁且稳定的边界契约——将决策大脑与执行双手解耦，将持久会话与临时上下文解耦——我们能够构建出超越单代模型生命周期的健壮系统。未来模型变得更聪明时，架构基座无需重写，只需接入更精准的工具。',
    authorBio: 'ViTrox 资深全栈开发工程师，现居马来西亚槟城，独立摄影师。专注探索 Agent 架构、WebMCP 与现代前端工程演进。',
  },
  home: {
    introStatement: '张炜康 (Chong Wei Khang) — 现居马来西亚槟城的全栈开发工程师与独立摄影师。记录街道上的沉静光影与旅途氛围，同时构建高可靠性的智能体软件。',
    introMeta: '马来西亚·槟城  ·  Nikon Z5  ·  全栈架构与 AI  ·  双语手记',
    filterAll: '全部作品',
    filterStreet: '街头纪实',
    filterTravel: '旅途光影',
    filterQuiet: '静物咖啡',
    latestWritingTag: '最新技术专栏 // 智能体架构',
    latestWritingTitle: '解耦思考与行动：构建高可靠 AI Agent 系统的架构模式',
    latestWritingMeta: '6 分钟深度阅读 · WebMCP · 只增不减事件流',
    readEssay: '阅读全文 →',
  },
  about: {
    title: '关于我',
    subtitle: '以工程师的严谨构建系统，以观察者的从容捕捉光影。',
    builderTitle: '构建者 — 代码与系统架构',
    builderText: '机电一体化工程背景出身，自 2019 年起在马来西亚槟城 ViTrox 担任资深全栈开发工程师。专注设计分布式系统、现代化高响应 Web 架构以及基于 WebMCP 协议的可靠智能体工作流。',
    observerTitle: '观察者 — 光线与静止瞬间',
    observerText: '摄影是我让世界慢下来的方式。手持一台 Nikon Z5，挂载 40mm 定焦与 24-120mm 变焦，我在槟城老街寻找沉静的几何线条，在独立精品咖啡馆里记录光影散落，在跨越欧亚的旅途中捕捉没有修饰的真实温度。',
    gearTitle: '工具与装备箱',
    cameraGearLabel: '相机与镜头光学',
    cameraGear: 'Nikon Z5 · NIKKOR Z 24-120mm f/4 S · NIKKOR Z 40mm f/2',
    techStackLabel: '工程技术栈',
    techStack: 'Angular 22 · TypeScript · Python · WebMCP · Tailwind CSS · Cloudflare Workers',
    milestonesTitle: '经历与时间线',
    milestone1Year: '2019 — 至今',
    milestone1Title: '资深全栈开发工程师 · ViTrox',
    milestone1Desc: '主导全栈 Web 架构与企业级平台研发，设计高性能数据处理服务，落地前沿智能体自动化系统。',
    milestone2Year: '2015 — 2019',
    milestone2Title: '机电一体化工程学士学位 (B.Eng.)',
    milestone2Desc: '以一等工程学识背景毕业，系统掌握嵌入式控制、自动化工程与软件系统集成。',
    colophonTitle: '关于本站与设计理念',
    colophonText: '本站基于 Angular 22 独立组件、Tailwind CSS 4 与实验性 WebMCP 智能体工具链纯手工构建。全站原生双语驱动，针对中文排版进行 CJK 标点与行距优化，零外部追踪代码。部署于 Cloudflare Workers 全球边缘网络。',
  },
};

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  private readonly storageKey = 'user-locale';
  private readonly cookieName = 'lang';

  private readonly isBrowser =
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof localStorage !== 'undefined';

  readonly locale = signal<SupportedLocale>('en');

  readonly dict = computed<TranslationDictionary>(() => {
    return this.locale() === 'zh' ? ZH_DICTIONARY : EN_DICTIONARY;
  });

  readonly isChinese = computed<boolean>(() => this.locale() === 'zh');

  constructor() {
    if (!this.isBrowser) {
      return;
    }
    this.initLocale();
  }

  private initLocale(): void {
    const saved = localStorage.getItem(this.storageKey) as SupportedLocale | null;
    if (saved && (saved === 'en' || saved === 'zh')) {
      this.applyLocale(saved, false);
      return;
    }

    // Check cookie
    const cookieMatch = document.cookie.match(new RegExp(`(?:^|; )${this.cookieName}=([^;]*)`));
    if (cookieMatch && (cookieMatch[1] === 'en' || cookieMatch[1] === 'zh')) {
      this.applyLocale(cookieMatch[1] as SupportedLocale, false);
      return;
    }

    // Check browser navigator language
    const navLang = navigator.language?.toLowerCase() ?? '';
    if (navLang.startsWith('zh')) {
      this.applyLocale('zh', false);
      return;
    }

    this.applyLocale('en', false);
  }

  setLocale(newLocale: SupportedLocale): void {
    this.applyLocale(newLocale, true);
  }

  toggleLocale(): SupportedLocale {
    const next: SupportedLocale = this.locale() === 'en' ? 'zh' : 'en';
    this.setLocale(next);
    return next;
  }

  private applyLocale(loc: SupportedLocale, persist: boolean): void {
    this.locale.set(loc);

    if (this.isBrowser) {
      document.documentElement.lang = loc === 'zh' ? 'zh-Hans' : 'en';
      document.documentElement.classList.toggle('lang-zh', loc === 'zh');

      if (persist) {
        localStorage.setItem(this.storageKey, loc);
        document.cookie = `${this.cookieName}=${loc}; path=/; max-age=31536000; SameSite=Lax`;
      }
    }
  }
}
