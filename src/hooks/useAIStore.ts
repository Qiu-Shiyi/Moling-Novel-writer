import { create } from 'zustand';
import type { AIConfig, ChatMessage } from '@/types';
import { storageService, defaultAIConfig } from '@/utils/storage';
import { aiService } from '@/utils/aiService';

interface AIStore {
  config: AIConfig;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  apiKeyValid: boolean | null;

  loadConfig: () => Promise<void>;
  saveConfig: (config: Partial<AIConfig>) => Promise<void>;
  validateAPIKey: () => Promise<boolean>;
  
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  clearMessages: () => void;
  
  brainstorm: (idea: string) => Promise<string>;
  generateWhatIf: (work1: string, work2: string) => Promise<string>;
  extractCoreIdea: (text: string) => Promise<string>;
  generateCharacter: (tags: string[]) => Promise<string>;
  generateContinuation: (context: string, style: string, perspective: string, pace: string, count: number) => Promise<string[]>;
  polishDialogue: (dialogue: string, characterInfo: string) => Promise<string>;
  adjustRhythm: (text: string, rhythm: 'fast' | 'medium' | 'slow') => Promise<string>;
  checkConsistency: (text: string, facts: string[]) => Promise<string>;
}

export const useAIStore = create<AIStore>((set, get) => ({
  config: defaultAIConfig,
  messages: [],
  isLoading: false,
  error: null,
  apiKeyValid: null,

  loadConfig: async () => {
    try {
      const saved = await storageService.getAIConfig();
      if (saved) {
        set({ config: saved });
      }
    } catch (err) {
      console.error('Failed to load AI config:', err);
    }
  },

  saveConfig: async (config) => {
    const newConfig = { ...get().config, ...config };
    await storageService.saveAIConfig(newConfig);
    set({ config: newConfig });
    if (config.apiKey !== undefined) {
      set({ apiKeyValid: null });
    }
  },

  validateAPIKey: async () => {
    const { config } = get();
    if (!config.apiKey) {
      set({ apiKeyValid: false });
      return false;
    }

    set({ isLoading: true });
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${config.apiKey}` },
      });
      const valid = response.ok;
      set({ apiKeyValid: valid, isLoading: false });
      return valid;
    } catch {
      set({ apiKeyValid: false, isLoading: false });
      return false;
    }
  },

  addMessage: (role, content) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ messages: [...state.messages, message] }));
  },

  clearMessages: () => set({ messages: [] }),

  brainstorm: async (idea) => {
    const { config } = get();
    set({ isLoading: true, error: null });
    try {
      const result = await aiService.brainstorm(idea, config);
      set({ isLoading: false });
      return result;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '操作失败', isLoading: false });
      throw err;
    }
  },

  generateWhatIf: async (work1, work2) => {
    const { config } = get();
    set({ isLoading: true, error: null });
    try {
      const result = await aiService.generateWhatIf(work1, work2, config);
      set({ isLoading: false });
      return result;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '操作失败', isLoading: false });
      throw err;
    }
  },

  extractCoreIdea: async (text) => {
    const { config } = get();
    set({ isLoading: true, error: null });
    try {
      const result = await aiService.extractCoreIdea(text, config);
      set({ isLoading: false });
      return result;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '操作失败', isLoading: false });
      throw err;
    }
  },

  generateCharacter: async (tags) => {
    const { config } = get();
    set({ isLoading: true, error: null });
    try {
      const result = await aiService.generateCharacter(tags, config);
      set({ isLoading: false });
      return result;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '操作失败', isLoading: false });
      throw err;
    }
  },

  generateContinuation: async (context, style, perspective, pace, count) => {
    const { config } = get();
    set({ isLoading: true, error: null });
    try {
      const result = await aiService.generateContinuation(context, style, perspective, pace, count, config);
      set({ isLoading: false });
      return result.map(r => r.content);
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '操作失败', isLoading: false });
      throw err;
    }
  },

  polishDialogue: async (dialogue, characterInfo) => {
    const { config } = get();
    set({ isLoading: true, error: null });
    try {
      const result = await aiService.callAPI([
        {
          role: 'system',
          content: '你是一位对话写作专家。根据人物设定优化对话，使其更符合人物性格、增加潜台词、强化张力。用中文回复。',
        },
        {
          role: 'user',
          content: `人物设定：\n${characterInfo}\n\n优化这段对话：\n${dialogue}`,
        },
      ], config);
      set({ isLoading: false });
      return result;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '操作失败', isLoading: false });
      throw err;
    }
  },

  adjustRhythm: async (text, rhythm) => {
    const { config } = get();
    set({ isLoading: true, error: null });
    try {
      const result = await aiService.adjustRhythm(text, rhythm, config);
      set({ isLoading: false });
      return result;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '操作失败', isLoading: false });
      throw err;
    }
  },

  checkConsistency: async (text, facts) => {
    const { config } = get();
    set({ isLoading: true, error: null });
    try {
      const result = await aiService.checkConsistency(text, facts, config);
      set({ isLoading: false });
      return result;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '操作失败', isLoading: false });
      throw err;
    }
  },
}));
