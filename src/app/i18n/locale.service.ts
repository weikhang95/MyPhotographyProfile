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
    readonly tags: string;
    readonly pIntro: string;
    readonly h2Mode1: string;
    readonly pMode1Intro: string;
    readonly pMode1Explain: string;
    readonly h2Mode2: string;
    readonly pMode2Intro: string;
    readonly pMode2Constrained: string;
    readonly pMode2Explain: string;
    readonly h2Mode3: string;
    readonly pMode3Intro: string;
    readonly pMode3ThreePieces: string;
    readonly pMode3Explain: string;
    readonly calloutTitle: string;
    readonly calloutBody: string;
    readonly h2Loop: string;
    readonly pLoop: string;
    readonly h2Closing: string;
    readonly pClosing: string;
    readonly pNextPost: string;
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
    category: 'ENGINEERING // AGENT BASICS',
    title: 'The Three Ways an LLM Responds (And Why It Matters for Agents)',
    lead: 'Most people think an LLM "types text." But under the API surface, there are three distinct output modes \u2014 and understanding them is the single fastest way to demystify how agents work.',
    author: 'By Chong Wei Khang (张炜康)',
    authorName: 'Chong Wei Khang (张炜康)',
    publishDate: 'Published Sep 17, 2026',
    readTime: '5 min read',
    tags: 'Agent Basics \u00B7 Tool Calling \u00B7 Structured Output',
    pIntro: 'Ask any LLM what the weather is right now. It\'ll apologize \u2014 it doesn\'t know. Not because it can\'t reason, but because it has no hands. It can think, but it can\'t reach outside its own text and touch the real world. A tool gives it hands. But before we talk about tools, we need to understand something most tutorials skip: what an LLM\'s output actually looks like under the hood.',
    h2Mode1: '1. Free Text \u2014 The Default',
    pMode1Intro: 'When you chat with Claude or ChatGPT in a browser, you see flowing text. It feels like the model is \u201Ctyping.\u201D But underneath, the API response is a structured object \u2014 not a string. Here\'s what Claude\'s API actually returns:',
    pMode1Explain: 'Two things to notice. First, content is an array of typed blocks, not a raw string. Each block has a type \u2014 here it\'s \u201Ctext\u201D. But there are other types, and that\'s the key. Second, stop_reason tells you why the model stopped generating. \u201Cend_turn\u201D means it\'s done talking. But there\'s another stop reason that changes everything.',
    h2Mode2: '2. Structured JSON \u2014 Schema-Constrained Output',
    pMode2Intro: 'Sometimes you don\'t want free prose \u2014 you want data in a specific shape. Imagine you\'re building a photo metadata extractor. You want the model to look at a description and return structured fields, not a paragraph. You send a response schema alongside your prompt \u2014 telling the API \u201Crespond in this exact shape\u201D:',
    pMode2Constrained: 'Now the model\'s output is constrained. It must produce valid JSON matching your schema:',
    pMode2Explain: 'The type is still \u201Ctext\u201D, the stop_reason is still \u201Cend_turn\u201D \u2014 but the content is guaranteed to be parseable JSON. The model isn\'t \u201Cchoosing\u201D to format nicely; the API enforces this at the token generation level. It literally will not produce a token that violates your schema. This is called constrained decoding, and every major provider (Anthropic, OpenAI, Google) supports it.',
    h2Mode3: '3. Tool Use \u2014 The Model Requests Action',
    pMode3Intro: 'This is where things get interesting. The model stops answering you directly and instead says: \u201CI don\'t know the answer, but I\'d like to call a function to find out.\u201D You define tools when calling the API. Each tool has three parts:',
    pMode3ThreePieces: 'name \u2014 what the model uses to identify the tool. description \u2014 when and why to call it (this is for the model to read, not humans \u2014 this is where the real engineering happens). input_schema \u2014 what arguments to pass (using JSON Schema).',
    pMode3Explain: 'Now, when a user asks \u201CWhat\'s the weather in Penang?\u201D the model does not return text. It returns something entirely different: a tool_use block. It says: \u201CI want to call get_weather with { city: \"Penang\" }.\u201D Notice the stop_reason: \u201Ctool_use\u201D. The model is saying: \u201CI\'m not done. Go run this, give me the result, and I\'ll finish.\u201D The model didn\'t execute anything. It just asked. Your code does the executing.',
    calloutTitle: 'The Model Requests, the System Acts',
    calloutBody: 'This is the most critical mental model in agent engineering: LLMs cannot take actions. They can only output structured text that says "please take this action for me." The execution \u2014 making the API call, querying the database, sending the email \u2014 happens entirely in your code, outside the model.',
    h2Loop: '4. The Complete Loop',
    pLoop: 'Every agent framework \u2014 LangChain, CrewAI, Anthropic\'s Agent SDK, Google\'s ADK \u2014 is built on repeating this exact loop until the model returns stop_reason: "end_turn". That is the atom of agent engineering. Everything else is molecules.',
    h2Closing: 'Three Modes, One Mental Model',
    pClosing: 'These three modes are the entire vocabulary of how an LLM communicates with the world: free text for humans, structured JSON for machines, and tool use to request actions. Once you see this clearly, the magic disappears \u2014 and engineering begins.',
    pNextPost: 'Next in this series: What happens when the model has 10 tools to choose from. That\'s where description engineering gets interesting.',
    authorBio: 'Senior Full Stack Developer at ViTrox & Photographer in Penang, Malaysia. Exploring agentic patterns, WebMCP, and modern frontend architecture.',
  },
  home: {
    introStatement: 'Chong Wei Khang (张炜康) is a senior software engineer and photographer based in Penang, Malaysia. Capturing quiet street light, travel atmospheres, and building reliable agentic software.',
    introMeta: 'Penang, MY  ·  Nikon Z5  ·  Full Stack & AI  ·  Bilingual Notes',
    filterAll: 'All Works',
    filterStreet: 'Street & Heritage',
    filterTravel: 'Travel & Scenery',
    filterQuiet: 'Quiet & Coffee',
    latestWritingTag: 'Latest Technical Essay // Agent Architecture',
    latestWritingTitle: 'The Three Ways an LLM Responds (And Why It Matters for Agents)',
    latestWritingMeta: '5 min read · WebMCP · Tool Calling',
    readEssay: 'Read Full Essay →',
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
    category: '工程架构 // AGENT 基础核心',
    title: '大模型输出的三种形态（以及为什么它对 Agent 至关重要）',
    lead: '大多数人以为大模型只是在“打字吐字”。但在 API 底层，输出其实只有三种截然不同的模式——理解这三种模式，是彻底看懂所有 Agent 运行机制的最快途径。',
    author: '作者：张炜康 (Chong Wei Khang)',
    authorName: '张炜康 (Chong Wei Khang)',
    publishDate: '发布于 2026年9月17日',
    readTime: '5 分钟阅读',
    tags: 'Agent 基础 · Tool Calling · 结构化输出',
    pIntro: '问任何一个大模型现在天气怎么样，它会道歉——它不知道。不是因为它推理不行，而是因为它没有手。它能思考，但无法伸出文字之外去触碰真实世界。Tool（工具）就是给它的手。但在聊 tool 之前，我们得先理解一件大多数教程跳过的事：LLM 的输出在底层到底长什么样。',
    h2Mode1: '1. 纯文本 — 默认模式',
    pMode1Intro: '在浏览器里和 Claude 或 ChatGPT 聊天时，你看到的是流动的文字，好像模型在"打字"。但在底层，API 返回的是一个结构化对象——不是字符串。以下是 Claude API 实际返回的内容：',
    pMode1Explain: '两件事值得注意。第一，content 是一个带类型标签的数组，不是原始字符串。每个 block 有一个 type——这里是 "text"。但还有其他类型，这才是关键。第二，stop_reason 告诉你模型为什么停了下来。"end_turn" 意思是"我说完了"。但还有另一种 stop reason，它改变了一切。',
    h2Mode2: '2. 结构化 JSON — Schema 约束输出',
    pMode2Intro: '有时你不需要自由文本——你需要特定结构的数据。比如你在做一个照片元数据提取器，希望模型看了描述后返回结构化字段，而不是一段话。你在请求里附上一个 response schema——告诉 API"请按这个结构回答"：',
    pMode2Constrained: '现在模型的输出被约束了，必须产出符合你 schema 的合法 JSON：',
    pMode2Explain: 'type 还是 "text"，stop_reason 还是 "end_turn"——但内容保证是可解析的 JSON。模型不是在"选择"好好格式化；是 API 在 token 生成层面约束了输出，只允许产生符合你 schema 的内容。这叫受约束解码（constrained decoding）——三大主流厂商（Anthropic、OpenAI、Google）都在用它。',
    h2Mode3: '3. Tool Use — 模型请求行动',
    pMode3Intro: '第三种模式是最有意思的。模型不再直接回答，而是说："我自己答不了——让我调一个函数。"你在调用 API 时提供一组可用工具。每个 tool 有三个组成部分：',
    pMode3ThreePieces: 'name — 模型调用它时用的名字。description — 什么时候调用（写给模型看的，不是给人看的——真正的工程细节在这里）。input_schema — 接收什么参数（JSON Schema 格式）。',
    pMode3Explain: '当用户问"槟城天气怎么样？"时，返回结果彻底变了。出现了新的 block 类型："tool_use"——模型发出了一个结构化的函数调用请求。stop_reason 变成了 "tool_use"——模型在说"我没说完，请执行这个，然后告诉我结果。"模型没有执行任何东西。它只是请求。你的代码负责行动。',
    calloutTitle: '模型发出请求，系统执行动作',
    calloutBody: '这是 Agent 工程中最重要的心智模型：LLM 唯一的超能力是决定调用哪个工具、传什么参数。真正的执行——发 API 请求、读文件、查数据库——完全发生在你的代码里，在模型之外。',
    h2Loop: '4. 完整的循环',
    pLoop: '所有 agent 框架——LangChain、CrewAI、Anthropic 的 Agent SDK、Google 的 ADK——都只是这个循环的反复执行。模型不断调用 tool，直到 stop_reason 变回 "end_turn" 为止。这就是 agent 工程的原子。其他一切都是分子。',
    h2Closing: '三种模式，一个心智模型',
    pClosing: '这三种模式就是 LLM 与外部世界交互的完整词汇表。所有建立在上面的东西——多步骤 agent、chain、orchestration——都是这些原子的组合。',
    pNextPost: '下一篇：当模型面前有 10 个 tool 时会发生什么。那就是 description 工程开始变有趣的地方。',
    authorBio: 'ViTrox 资深全栈开发工程师，现居马来西亚槟城，独立摄影师。专注探索 Agent 架构与现代前端工程演进。',
  },
  home: {
    introStatement: '张炜康 (Chong Wei Khang) — 现居马来西亚槟城的全栈开发工程师与独立摄影师。记录街道上的沉静光影与旅途氛围，同时构建高可靠性的智能体软件。',
    introMeta: '马来西亚·槟城  ·  Nikon Z5  ·  全栈架构与 AI  ·  双语手记',
    filterAll: '全部作品',
    filterStreet: '街头纪实',
    filterTravel: '旅途光影',
    filterQuiet: '静物咖啡',
    latestWritingTag: '最新技术专栏 // 智能体架构',
    latestWritingTitle: '大模型输出的三种形态（以及为什么它对 Agent 至关重要）',
    latestWritingMeta: '5 分钟深度阅读 · WebMCP · Tool Calling',
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
