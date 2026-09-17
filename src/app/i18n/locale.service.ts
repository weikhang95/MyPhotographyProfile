import { Injectable, signal, computed } from '@angular/core';

export type SupportedLocale = 'en' | 'zh';

export interface TranslationDictionary {
  readonly nav: {
    readonly portfolio: string;
    readonly writings: string;
    readonly about: string;
    readonly contact: string;
    readonly backToPortfolio: string;
    readonly backToWritings: string;
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
    readonly seriesTag: string;
    readonly seriesRoadmapTitle: string;
    readonly seriesLabel: string;
    readonly readingNowBadge: string;
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
    readonly pMode3Explain: string;
    readonly termName: string;
    readonly termNameDesc: string;
    readonly termDesc: string;
    readonly termDescDesc: string;
    readonly termSchema: string;
    readonly termSchemaDesc: string;
    readonly calloutTitle: string;
    readonly calloutBody: string;
    readonly h2Loop: string;
    readonly pLoop: string;
    readonly loopStep1: string;
    readonly loopStep2: string;
    readonly loopStep3: string;
    readonly loopStep4: string;
    readonly h2Closing: string;
    readonly pClosing: string;
    readonly pNextPost: string;
    readonly authorBio: string;
    readonly codeCaptionReply: string;
    readonly codeCaptionSchema: string;
    readonly codeCaptionFilled: string;
    readonly codeCaptionTool: string;
    readonly codeCaptionRequest: string;
    readonly tableColTalk: string;
    readonly tableColForm: string;
    readonly tableColAsk: string;
    readonly tableRowSee: string;
    readonly tableSeeTalk: string;
    readonly tableSeeForm: string;
    readonly tableSeeAsk: string;
    readonly tableRowApi: string;
    readonly tableApiTalk: string;
    readonly tableApiForm: string;
    readonly tableApiAsk: string;
    readonly tableRowStop: string;
    readonly tableStopTalk: string;
    readonly tableStopForm: string;
    readonly tableStopAsk: string;
    readonly tableRowWho: string;
    readonly tableWhoTalk: string;
    readonly tableWhoForm: string;
    readonly tableWhoAsk: string;
  };
  readonly blogList: {
    readonly pageCategory: string;
    readonly pageTitle: string;
    readonly pageLead: string;
    readonly filterAll: string;
    readonly filterBasics: string;
    readonly filterArchitecture: string;
    readonly filterCaseStudies: string;
    readonly statusPublished: string;
    readonly statusUpcoming: string;
    readonly readArticle: string;
    readonly timelineYear: string;
    readonly roadmapTitle: string;
    readonly seriesTitle: string;
    readonly seriesSubtitle: string;
    readonly readingNowBadge: string;
    readonly chartTitle: string;
    readonly chartSubtitle: string;
    readonly chartFootnote: string;
    readonly chartSource: string;
    readonly posts: readonly {
      readonly id: string;
      readonly slug: string;
      readonly episode: string;
      readonly title: string;
      readonly excerpt: string;
      readonly date: string;
      readonly readTime: string;
      readonly category: 'basics' | 'architecture' | 'case-studies';
      readonly tag: string;
      readonly status: 'published' | 'upcoming';
    }[];
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
    backToWritings: 'Back to Writings',
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
    category: 'Note',
    title: 'The Three Ways an LLM Responds',
    lead: 'You ask a chatbot a question. Sometimes it writes a paragraph. Sometimes it fills in a form. Sometimes it pauses and asks the computer to look something up. Those three replies are how agents work.',
    author: 'Chong Wei Khang (张炜康)',
    authorName: 'Chong Wei Khang (张炜康)',
    publishDate: '17 Sep 2026',
    readTime: '5 min',
    tags: 'How agents work',
    seriesTag: 'Part 1 of 5',
    seriesRoadmapTitle: 'How agents work',
    seriesLabel: 'This series',
    readingNowBadge: 'You are here',
    pIntro: 'Ask ChatGPT what the weather is in Penang right now. It will guess, or apologize. It is not bad at thinking; it just cannot look outside the conversation. A tool is that look outside. Before tools, it helps to see what the model is actually sending back when it appears to type.',
    h2Mode1: 'Plain text: it just talks',
    pMode1Intro: 'In a browser chat, you see a paragraph appear. It feels like typing. Behind the page, the service is not returning a loose string. It returns a small object with labeled parts. Here is the same reply as the API sees it.',
    pMode1Explain: 'Two details matter. First, the words live inside a list of blocks, each with a type. Here the type is text. Other types exist, and that is the whole story. Second, stop_reason says why the model stopped. end_turn means it is finished talking. There is another stop reason, and that one is how agents begin.',
    h2Mode2: 'A filled-in form: it follows a shape',
    pMode2Intro: 'Sometimes you do not want a paragraph. You want fields, the way a photo caption card has a place, a time of day, and a mood. You send a shape with the question, and you ask the service to fill only those blanks.',
    pMode2Constrained: 'Now the model cannot wander. It has to produce JSON that matches the shape.',
    pMode2Explain: 'The block type is still text, and the stop reason is still end_turn. The difference is the words inside are guaranteed to parse as data. The model is not being polite. The service refuses tokens that break the shape. Engineers call this constrained decoding. Anthropic, OpenAI, and Google all do it.',
    h2Mode3: 'A request: it asks your code to act',
    pMode3Intro: 'This is the third reply. The model stops talking to you and writes a request instead: I cannot answer this, please run this function. You list the functions when you call the API. Each one has three parts.',
    pMode3Explain: 'When someone asks for the weather in Penang, the model does not write a forecast. It writes a tool_use block: call get_weather with city Penang. The stop reason is tool_use, which means I am not done. Run this, give me the result, I will finish. The model did not fetch the weather. Your program did.',
    termName: 'name',
    termNameDesc: 'The label the model uses when it wants this function.',
    termDesc: 'description',
    termDescDesc: 'A short note for the model, not for people. It says when to ask for this function.',
    termSchema: 'input_schema',
    termSchemaDesc: 'The blanks the function needs, written as JSON Schema. Here, a city name.',
    calloutTitle: 'The model writes a request. Your program does the work.',
    calloutBody: 'A language model cannot call a weather API, send email, or query a database. It can only produce text that says please do this. The doing happens in your code, outside the model.',
    h2Loop: 'Then it repeats until it is done',
    pLoop: 'LangChain, CrewAI, Anthropic\'s Agent SDK, and Google\'s ADK all repeat this same exchange until the model returns end_turn. That loop is the whole mechanism. The rest is packaging.',
    loopStep1: 'You ask: What is the weather in Penang?',
    loopStep2: 'The model stops and asks for get_weather. Stop reason: tool_use.',
    loopStep3: 'Your code runs get_weather("Penang") and gets 31 C, partly cloudy.',
    loopStep4: 'The model finishes: It is 31 C and partly cloudy in Penang. Stop reason: end_turn.',
    h2Closing: 'Three replies, one idea',
    pClosing: 'Talk to a person. Fill a form for a program. Ask your code to act. That is the whole vocabulary. Multi-step agents are these three replies, repeated.',
    pNextPost: 'Next: what happens when the model has ten tools and has to pick.',
    authorBio: 'Software engineer at ViTrox, and a photographer. I write about agents and the web tools they use, as plainly as I can, lah.',
    codeCaptionReply: 'A normal reply',
    codeCaptionSchema: 'The blanks we asked it to fill',
    codeCaptionFilled: 'The filled-in form',
    codeCaptionTool: 'A function the model may request',
    codeCaptionRequest: 'The model asking for that function',
    tableColTalk: 'Talk',
    tableColForm: 'Fill a form',
    tableColAsk: 'Ask for help',
    tableRowSee: 'What you see',
    tableSeeTalk: 'A paragraph',
    tableSeeForm: 'Neat fields',
    tableSeeAsk: 'A pause, then an answer',
    tableRowApi: 'What the API sends',
    tableApiTalk: 'text',
    tableApiForm: 'text that is JSON',
    tableApiAsk: 'text + tool_use',
    tableRowStop: 'Why it stopped',
    tableStopTalk: 'end_turn',
    tableStopForm: 'end_turn',
    tableStopAsk: 'tool_use',
    tableRowWho: 'Who does extra work',
    tableWhoTalk: 'Nobody',
    tableWhoForm: 'Your parser',
    tableWhoAsk: 'Your program',
  },
  blogList: {
    pageCategory: 'Notes',
    pageTitle: 'Writings',
    pageLead: 'Notes on building AI agents. For a friend who does not write code, and for an engineer who needs the details.',
    filterAll: 'All',
    filterBasics: 'Basics',
    filterArchitecture: 'Systems',
    filterCaseStudies: 'Build logs',
    statusPublished: 'Published',
    statusUpcoming: 'Coming',
    readArticle: 'Read',
    timelineYear: '2026',
    roadmapTitle: 'This series',
    seriesTitle: 'How agents work',
    seriesSubtitle: 'Five short notes, from a single reply to a system that can act on its own.',
    readingNowBadge: 'You are here',
    chartTitle: '{total} minutes end to end, {live} already live',
    chartSubtitle: 'Taller means a longer read. Clay is published. Dashed is still coming.',
    chartFootnote: 'Each line is 30 seconds. A dot marks every 5 minutes.',
    chartSource: 'Reading time by episode. Coming parts are estimates.',
    posts: [
      {
        id: '01',
        slug: 'three-ways-an-llm-responds',
        episode: '01',
        title: 'The Three Ways an LLM Responds',
        excerpt: 'A chatbot either talks, fills in a form, or asks your program for help. Those three replies are how agents work.',
        date: '17 Sep 2026',
        readTime: '5 min',
        category: 'basics',
        tag: 'How agents work',
        status: 'published',
      },
      {
        id: '02',
        slug: 'description-engineering',
        episode: '02',
        title: 'When the model has ten tools to choose from',
        excerpt: 'The short note you write on each tool is what the model reads. Write it badly, and it picks the wrong one.',
        date: 'Oct 2026',
        readTime: '6 min',
        category: 'basics',
        tag: 'Choosing tools',
        status: 'upcoming',
      },
      {
        id: '03',
        slug: 'the-autonomous-loop',
        episode: '03',
        title: 'Letting the model keep going on its own',
        excerpt: 'Once tools run without you in the room, you need a stop rule. Otherwise the loop does not know when to quit.',
        date: '2026',
        readTime: '8 min',
        category: 'architecture',
        tag: 'The loop',
        status: 'upcoming',
      },
      {
        id: '04',
        slug: 'github-issue-fixer-case-study',
        episode: '04',
        title: 'I tried to make an agent fix GitHub issues',
        excerpt: 'A local webhook, a cloud sandbox, and the bill. What actually broke, and what I would do again.',
        date: '2026',
        readTime: '7 min',
        category: 'case-studies',
        tag: 'A build log',
        status: 'upcoming',
      },
      {
        id: '05',
        slug: 'decoupling-brain-from-hands',
        episode: '05',
        title: 'Keep the brain and the hands in different rooms',
        excerpt: 'The model decides. A separate program acts. If the acting side dies, the notes should still be there when it comes back.',
        date: '2026',
        readTime: '9 min',
        category: 'architecture',
        tag: 'WebMCP',
        status: 'upcoming',
      },
    ],
  },
  home: {
    introStatement: 'Chong Wei Khang (张炜康). Software engineer and photographer in Penang.',
    introMeta: 'Nikon Z5, full-stack work, bilingual notes',
    filterAll: 'All Works',
    filterStreet: 'Street & Heritage',
    filterTravel: 'Travel & Scenery',
    filterQuiet: 'Quiet & Coffee',
    latestWritingTag: 'Latest note',
    latestWritingTitle: 'The Three Ways an LLM Responds',
    latestWritingMeta: '5 min',
    readEssay: 'Read',
  },
  about: {
    title: 'About',
    subtitle: 'Software engineer and photographer',
    builderTitle: 'Work',
    builderText: 'I have been a full-stack engineer at ViTrox in Penang since 2019. I started in mechatronics. These days I build web systems, and the small page tools that let an AI agent act without leaving the browser.',
    observerTitle: 'Photographs',
    observerText: 'I also take photographs. A Nikon Z5, a 40mm, and a 24-120mm. Street and travel, mostly available light, mostly Penang, sometimes further.',
    gearTitle: 'Tools',
    cameraGearLabel: 'Camera',
    cameraGear: 'Nikon Z5, NIKKOR Z 24-120mm f/4 S, NIKKOR Z 40mm f/2',
    techStackLabel: 'Software',
    techStack: 'Angular 22, TypeScript, Python, WebMCP, Tailwind CSS, Cloudflare',
    milestonesTitle: 'Work',
    milestone1Year: '2019-present',
    milestone1Title: 'Senior full-stack engineer, ViTrox',
    milestone1Desc: 'Web platforms, data services, and the first agent tools we ship internally.',
    milestone2Year: '2015-2019',
    milestone2Title: 'B.Eng. Mechatronics',
    milestone2Desc: 'Embedded systems and the software that sits on top of them.',
    colophonTitle: 'This site',
    colophonText: 'Angular 22 and Tailwind. Hosted on Cloudflare. English and Chinese. No tracking.',
  },
};

const ZH_DICTIONARY: TranslationDictionary = {
  nav: {
    portfolio: '作品集',
    writings: '专栏文章',
    about: '关于我',
    contact: '联系方式',
    backToPortfolio: '返回作品集',
    backToWritings: '返回专栏',
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
    category: '笔记',
    title: '大模型回答你的三种方式',
    lead: '你问聊天机器人一个问题。它有时写一段话，有时填一张表，有时停下来让电脑去查。这三种回答，就是 Agent 在做的事。',
    author: '张炜康 (Chong Wei Khang)',
    authorName: '张炜康 (Chong Wei Khang)',
    publishDate: '2026年9月17日',
    readTime: '5 分钟',
    tags: 'Agent 是怎么工作的',
    seriesTag: '共 5 篇，这是第 1 篇',
    seriesRoadmapTitle: '智能体是怎么工作的',
    seriesLabel: '这一组',
    readingNowBadge: '正在读',
    pIntro: '问 ChatGPT 槟城现在天气如何。它会猜，或者道歉。它会想，只是看不见对话外面的世界。工具，就是那一次往外看。在讲工具之前，先看清楚模型所谓的「打字」，底层到底回了什么。',
    h2Mode1: '普通文字：它只是在说话',
    pMode1Intro: '在网页里聊天，你看到一段字慢慢出现，好像它在打字。页面后面，服务回的是一个标好部分的小对象，不是一串散字。下面是 API 眼里的同一句回答。',
    pMode1Explain: '两处值得看。第一，字住在一组带类型的块里。这里的类型是 text。还有别的类型，整件事就在这里。第二，stop_reason 说明它为什么停。end_turn 表示说完了。还有另一种停止原因，Agent 就是从那里开始的。',
    h2Mode2: '填表：它必须按格式来',
    pMode2Intro: '有时你不要一段话。你要字段，像照片说明卡上的地点、时段、气氛。你把格子和问题一起送出去，请服务只填这些空。',
    pMode2Constrained: '现在它不能跑题。产出的 JSON 必须对上你给的格子。',
    pMode2Explain: '块类型还是 text，停止原因还是 end_turn。差别在于里面的字保证能当数据来读。模型不是在讲究礼貌，是服务不让它吐出破坏格式的内容。工程师叫它受约束解码。Anthropic、OpenAI、Google 都这么做。',
    h2Mode3: '请求：它请你的程序去办事',
    pMode3Intro: '第三种回答。模型不再对你说话，而是写下一张请求：我答不了，请跑这个函数。你在调用 API 时列出可用的函数。每一个有三部分。',
    pMode3Explain: '有人问槟城天气时，模型不写预报。它写一个 tool_use 块：用 city Penang 调用 get_weather。停止原因是 tool_use，意思是我还没说完。你先跑，把结果给我，我再收尾。模型没有去查天气。是你的程序查的。',
    termName: 'name',
    termNameDesc: '模型想用这个函数时，叫它的名字。',
    termDesc: 'description',
    termDescDesc: '写给模型看的短说明，不是写给人看的。告诉它什么时候该开口要这个函数。',
    termSchema: 'input_schema',
    termSchemaDesc: '这个函数需要填的空，用 JSON Schema 写。这里是城市名。',
    calloutTitle: '模型写请求。你的程序办事。',
    calloutBody: '语言模型不能自己调天气接口、发邮件、查数据库。它只能写出「请做这件事」这样的字。真正去做的，是模型外面的代码。',
    h2Loop: '然后重复，直到说完',
    pLoop: 'LangChain、CrewAI、Anthropic 的 Agent SDK、Google 的 ADK，都是把这一来一回重复到模型吐出 end_turn。循环本身就是机制。其余是包装。',
    loopStep1: '你问：槟城天气怎么样？',
    loopStep2: '模型停下，要 get_weather。停止原因：tool_use。',
    loopStep3: '你的代码跑 get_weather("Penang")，得到 31°C，多云。',
    loopStep4: '模型收尾：槟城现在 31°C，多云。停止原因：end_turn。',
    h2Closing: '同一个想法，三种样子',
    pClosing: '对人说话。给程序填表。请你的代码去做事。词汇就这些。多步骤的 Agent，不过是这三种回答在重复。',
    pNextPost: '下一篇：模型面前有十个工具时，它怎么选。',
    authorBio: '在 ViTrox 做软件，也拍照。写 Agent，以及它们在网页上用的小工具，尽量写得白话一点啦。',
    codeCaptionReply: '一句普通回答',
    codeCaptionSchema: '我们请它填的格子',
    codeCaptionFilled: '填好的表',
    codeCaptionTool: '模型可以开口要的函数',
    codeCaptionRequest: '模型在要那个函数',
    tableColTalk: '说话',
    tableColForm: '填表',
    tableColAsk: '求助',
    tableRowSee: '你看到的',
    tableSeeTalk: '一段话',
    tableSeeForm: '整齐的字段',
    tableSeeAsk: '先停一下，再给答案',
    tableRowApi: 'API 送来的',
    tableApiTalk: 'text',
    tableApiForm: '其实是 JSON 的 text',
    tableApiAsk: 'text + tool_use',
    tableRowStop: '为什么停',
    tableStopTalk: 'end_turn',
    tableStopForm: 'end_turn',
    tableStopAsk: 'tool_use',
    tableRowWho: '谁多做一步',
    tableWhoTalk: '没有人',
    tableWhoForm: '你的解析器',
    tableWhoAsk: '你的程序',
  },
  blogList: {
    pageCategory: '笔记',
    pageTitle: '专栏文章',
    pageLead: '写 AI Agent 的笔记。不写代码的朋友能看懂意思，写代码的朋友能用上细节。',
    filterAll: '全部',
    filterBasics: '入门',
    filterArchitecture: '系统',
    filterCaseStudies: '实录',
    statusPublished: '已写',
    statusUpcoming: '待写',
    readArticle: '阅读',
    timelineYear: '2026',
    roadmapTitle: '这一组',
    seriesTitle: '智能体是怎么工作的',
    seriesSubtitle: '五篇短笔记。从一句回答，到能自己做事的系统。',
    readingNowBadge: '正在读',
    chartTitle: '全系列约 {total} 分钟，已上线 {live} 分钟',
    chartSubtitle: '柱子越高，读得越久。实线陶土色是已写的。虚线是还没写的。点击可重播。',
    chartFootnote: '一条线是 30 秒。圆点每 5 分钟一个。',
    chartSource: '按篇目的阅读时间。待写篇目是估计。',
    posts: [
      {
        id: '01',
        slug: 'three-ways-an-llm-responds',
        episode: '01',
        title: '大模型回答你的三种方式',
        excerpt: '聊天机器人要么说话，要么填表，要么请你的程序帮忙。这三种回答，就是 Agent 在做的事。',
        date: '2026年9月17日',
        readTime: '5 分钟',
        category: 'basics',
        tag: 'Agent 是怎么工作的',
        status: 'published',
      },
      {
        id: '02',
        slug: 'description-engineering',
        episode: '02',
        title: '模型面前有十个工具时，它怎么选',
        excerpt: '你写在每个工具上的那句短说明，是模型在读的。写不好，它就会拿错。',
        date: '2026年10月',
        readTime: '6 分钟',
        category: 'basics',
        tag: '怎么选工具',
        status: 'upcoming',
      },
      {
        id: '03',
        slug: 'the-autonomous-loop',
        episode: '03',
        title: '让模型自己接着做下去',
        excerpt: '工具开始在你不在场时运行，你就需要一条停止规则。不然循环不知道何时该停。',
        date: '2026',
        readTime: '8 分钟',
        category: 'architecture',
        tag: '循环',
        status: 'upcoming',
      },
      {
        id: '04',
        slug: 'github-issue-fixer-case-study',
        episode: '04',
        title: '我试过让 Agent 修 GitHub Issue',
        excerpt: '本地 webhook、云端沙箱，还有账单。哪里坏了，哪些我会再做一次。',
        date: '2026',
        readTime: '7 分钟',
        category: 'case-studies',
        tag: '一篇记录',
        status: 'upcoming',
      },
      {
        id: '05',
        slug: 'decoupling-brain-from-hands',
        episode: '05',
        title: '脑子和手，放在不同的房间',
        excerpt: '模型做决定。另一段程序去动手。动手的那边挂了，记录还应该在。',
        date: '2026',
        readTime: '9 分钟',
        category: 'architecture',
        tag: 'WebMCP',
        status: 'upcoming',
      },
    ],
  },
  home: {
    introStatement: '张炜康 (Chong Wei Khang)。在槟城写软件，也拍照。',
    introMeta: 'Nikon Z5，全栈工作，中英笔记',
    filterAll: '全部作品',
    filterStreet: '街头纪实',
    filterTravel: '旅途光影',
    filterQuiet: '静物咖啡',
    latestWritingTag: '最近一篇',
    latestWritingTitle: '大模型回答你的三种方式',
    latestWritingMeta: '5 分钟',
    readEssay: '阅读',
  },
  about: {
    title: '关于',
    subtitle: '软件工程师，也拍照',
    builderTitle: '工作',
    builderText: '2019 年起在槟城 ViTrox 做全栈工程师。本科学机电一体化。现在做网页系统，也做一些让 AI Agent 不用离开浏览器就能动手的小工具。',
    observerTitle: '照片',
    observerText: '我也拍照。一台 Nikon Z5，一支 40mm，一支 24-120mm。街头和旅途，多用现成的光。多数在槟城，偶尔走远一点。',
    gearTitle: '工具',
    cameraGearLabel: '相机',
    cameraGear: 'Nikon Z5, NIKKOR Z 24-120mm f/4 S, NIKKOR Z 40mm f/2',
    techStackLabel: '软件',
    techStack: 'Angular 22, TypeScript, Python, WebMCP, Tailwind CSS, Cloudflare',
    milestonesTitle: '工作',
    milestone1Year: '2019 至今',
    milestone1Title: '资深全栈工程师，ViTrox',
    milestone1Desc: '网页平台、数据服务，以及我们内部开始用的第一批 Agent 工具。',
    milestone2Year: '2015-2019',
    milestone2Title: '机电一体化工程学士',
    milestone2Desc: '嵌入式系统，以及叠在上面的软件。',
    colophonTitle: '这个网站',
    colophonText: 'Angular 22 和 Tailwind。放在 Cloudflare。中英双语。没有跟踪脚本。',
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
