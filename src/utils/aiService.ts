import type { AIConfig, ContinuationOption, Character, GenreInfo } from '@/types';

const API_BASE_URL = 'https://api.openai.com/v1/chat/completions';

export const aiService = {
  async callAPI(messages: { role: string; content: string }[], config: AIConfig): Promise<string> {
    if (!config.apiKey) {
      throw new Error('请先设置OpenAI API密钥');
    }

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        top_p: config.topP,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API调用失败');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },

  async brainstorm(idea: string, config: AIConfig): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: '你是一位富有创意的写作伙伴，擅长帮助作家拓展想法。请用提问的方式深入挖掘创意，并提供3个意想不到的角度。用中文回复。',
      },
      {
        role: 'user',
        content: `帮我拓展这个想法：${idea}`,
      },
    ];

    return this.callAPI(messages, config);
  },

  async generateWhatIf(work1: string, work2: string, config: AIConfig): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: '你是一位擅长混搭经典作品的创意顾问。请分析两个作品的核心魅力点，并生成5种融合可能性。用中文回复。',
      },
      {
        role: 'user',
        content: `如果 ${work1} 遇到 ${work2}？生成颠覆性的故事开局。`,
      },
    ];

    return this.callAPI(messages, config);
  },

  async extractCoreIdea(text: string, config: AIConfig): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: '你是一位故事分析师。从文本中提取可发展成小说的核心冲突、独特设定和人物原型。用中文回复。',
      },
      {
        role: 'user',
        content: `分析这段文本并提取创意元素：\n\n${text}`,
      },
    ];

    return this.callAPI(messages, config);
  },

  async generateCharacter(tags: string[], config: AIConfig): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: '你是一位人物塑造专家。根据标签生成详细的人物档案，包括童年经历、核心动机、秘密缺陷、独特癖好和内心冲突。用中文回复，格式清晰易读。',
      },
      {
        role: 'user',
        content: `根据这些标签生成人物档案：${tags.join(', ')}`,
      },
    ];

    return this.callAPI(messages, config);
  },

  async generateContinuation(
    context: string,
    style: string,
    perspective: string,
    pace: string,
    count: number,
    config: AIConfig
  ): Promise<ContinuationOption[]> {
    const messages = [
      {
        role: 'system',
        content: `你是一位专业的小说续写助手。根据提供的上下文、风格要求和视角，生成${count}个不同方向的续写。每个续写用简洁的标题开头，然后是正文。`,
      },
      {
        role: 'user',
        content: `继续这段故事：\n\n${context}\n\n风格：${style}\n视角：${perspective}\n节奏：${pace}\n\n提供${count}个不同方向的续写。`,
      },
    ];

    const result = await this.callAPI(messages, config);
    const options = result.split(/\n\n/).filter(o => o.trim());
    
    return options.map((option, index) => ({
      id: `option-${index}`,
      content: option.trim(),
      style: index === 0 ? 'conservative' : index === 1 ? 'expected' : 'surprising',
    }));
  },

  async polishDialogue(dialogue: string, character: Character, config: AIConfig): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: '你是一位对话写作专家。根据人物设定优化对话，使其更符合人物性格、增加潜台词、强化张力。用中文回复。',
      },
      {
        role: 'user',
        content: `人物设定：\n姓名：${character.name}\n描述：${character.description}\n特质：${character.traits.map(t => t.value).join(', ')}\n\n优化这段对话：\n${dialogue}`,
      },
    ];

    return this.callAPI(messages, config);
  },

  async adjustRhythm(text: string, rhythm: 'fast' | 'medium' | 'slow', config: AIConfig): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: '你是一位节奏大师。根据要求调整文本的叙事节奏。快速节奏使用短句、省略描述；慢速节奏增加细节描写和内心活动。用中文回复。',
      },
      {
        role: 'user',
        content: `将这段文字调整为${rhythm}节奏：\n\n${text}`,
      },
    ];

    return this.callAPI(messages, config);
  },

  async checkConsistency(text: string, facts: string[], config: AIConfig): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: '你是一位严谨的编辑。检查文本与已知事实之间的一致性，列出所有潜在冲突。用中文回复。',
      },
      {
        role: 'user',
        content: `已知事实：\n${facts.join('\n')}\n\n检查这段文本的一致性：\n${text}`,
      },
    ];

    return this.callAPI(messages, config);
  },

  async simulateCharacterDialogue(characters: Character[], scenario: string, config: AIConfig): Promise<string> {
    const charactersInfo = characters.map(c => 
      `${c.name}: ${c.description}\n特质: ${c.traits.map(t => t.value).join(', ')}\n目标: ${c.goals.join(', ')}`
    ).join('\n\n');

    const messages = [
      {
        role: 'system',
        content: '你是一位角色内心独白专家。根据人物设定和场景，模拟真实的对话和心理活动。用中文回复，格式为角色名：对话内容。',
      },
      {
        role: 'user',
        content: `人物设定：\n${charactersInfo}\n\n场景：${scenario}\n\n模拟人物对话和心理活动。`,
      },
    ];

    return this.callAPI(messages, config);
  },
};

export const genreGuides: GenreInfo[] = [
  {
    name: '悬疑',
    icon: 'Ghost',
    description: '通过悬念和伏笔吸引读者，逐步揭示真相',
    beats: ['引子事件', '线索发现', '转折', '高潮反转', '真相大白'],
    tropes: ['密室杀人', '不可靠叙述者', '红鲱鱼', '暴风雨山庄'],
    pitfalls: ['逻辑漏洞', '动机不足', '结局草率'],
  },
  {
    name: '言情',
    icon: 'Heart',
    description: '探索人与人之间的情感关系和爱情故事',
    beats: ['相遇', '心动', '冲突', '误会', '和解', '圆满'],
    tropes: ['欢喜冤家', '命中注定', '破镜重圆', '日久生情'],
    pitfalls: ['人物扁平', '情节俗套', '三观不正'],
  },
  {
    name: '科幻',
    icon: 'Rocket',
    description: '基于科学原理构建未来世界和技术想象',
    beats: ['设定引入', '冲突显现', '技术危机', '人性考验', '新秩序'],
    tropes: ['时间旅行', '人工智能', '外星文明', '赛博朋克'],
    pitfalls: ['硬伤太多', '设定堆砌', '人物苍白'],
  },
  {
    name: '奇幻',
    icon: 'Sparkles',
    description: '在魔法和神话的世界中展开冒险',
    beats: ['平凡起点', '奇遇觉醒', '试炼成长', '最终决战'],
    tropes: ['英雄之旅', '魔法学院', '龙与地下城', '预言之子'],
    pitfalls: ['设定混乱', '战力崩坏', '套路重复'],
  },
  {
    name: '历史',
    icon: 'BookOpen',
    description: '在真实历史背景下讲述故事',
    beats: ['时代背景', '人物登场', '历史事件', '个人命运'],
    tropes: ['宫廷权谋', '乱世佳人', '英雄史诗', '小人物视角'],
    pitfalls: ['史实错误', '脸谱化', '说教感'],
  },
  {
    name: '都市',
    icon: 'Building2',
    description: '描绘现代城市生活和人际关系',
    beats: ['日常开场', '冲突出现', '成长蜕变', '新的开始'],
    tropes: ['职场奋斗', '都市漂流', '梦想追逐', '人情冷暖'],
    pitfalls: ['悬浮感', '套路化', '缺乏细节'],
  },
];

export const coverGradients = [
  'from-indigo-900 via-purple-900 to-pink-800',
  'from-slate-900 via-blue-900 to-cyan-800',
  'from-amber-900 via-orange-800 to-red-900',
  'from-emerald-900 via-teal-800 to-cyan-900',
  'from-violet-900 via-fuchsia-800 to-rose-900',
  'from-stone-900 via-amber-800 to-yellow-700',
  'from-sky-900 via-indigo-800 to-purple-900',
  'from-rose-900 via-pink-800 to-fuchsia-900',
];