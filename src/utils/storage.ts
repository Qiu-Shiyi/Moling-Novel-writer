import localForage from 'localforage';
import type { Novel, Chapter, Character, WorldSetting, TimelineEvent, SkillDNA, AIConfig } from '@/types';

const DB_NAME = 'moling-novel-writer';

const stores = {
  novels: 'novels',
  chapters: 'chapters',
  characters: 'characters',
  worldSettings: 'worldSettings',
  timelineEvents: 'timelineEvents',
  skillDNA: 'skillDNA',
  aiConfig: 'aiConfig',
};

export const storage = {
  novels: localForage.createInstance({
    name: DB_NAME,
    storeName: stores.novels,
  }),
  chapters: localForage.createInstance({
    name: DB_NAME,
    storeName: stores.chapters,
  }),
  characters: localForage.createInstance({
    name: DB_NAME,
    storeName: stores.characters,
  }),
  worldSettings: localForage.createInstance({
    name: DB_NAME,
    storeName: stores.worldSettings,
  }),
  timelineEvents: localForage.createInstance({
    name: DB_NAME,
    storeName: stores.timelineEvents,
  }),
  skillDNA: localForage.createInstance({
    name: DB_NAME,
    storeName: stores.skillDNA,
  }),
  aiConfig: localForage.createInstance({
    name: DB_NAME,
    storeName: stores.aiConfig,
  }),
};

export const storageService = {
  async getNovels(): Promise<Novel[]> {
    const result: Novel[] = [];
    await storage.novels.iterate((value) => {
      result.push(value as Novel);
    });
    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  async getNovel(id: string): Promise<Novel | null> {
    const result = await storage.novels.getItem<Novel>(id);
    return result || null;
  },

  async saveNovel(novel: Novel): Promise<void> {
    await storage.novels.setItem(novel.id, novel);
  },

  async deleteNovel(id: string): Promise<void> {
    await storage.novels.removeItem(id);
    await storage.chapters.iterate((value, key) => {
      const chapter = value as Chapter;
      if (chapter.novelId === id) {
        storage.chapters.removeItem(key);
      }
    });
    await storage.characters.iterate((value, key) => {
      const character = value as Character;
      if (character.novelId === id) {
        storage.characters.removeItem(key);
      }
    });
    await storage.worldSettings.iterate((value, key) => {
      const setting = value as WorldSetting;
      if (setting.novelId === id) {
        storage.worldSettings.removeItem(key);
      }
    });
    await storage.timelineEvents.iterate((value, key) => {
      const event = value as TimelineEvent;
      if (event.novelId === id) {
        storage.timelineEvents.removeItem(key);
      }
    });
    await storage.skillDNA.removeItem(id);
  },

  async getChapters(novelId: string): Promise<Chapter[]> {
    const result: Chapter[] = [];
    await storage.chapters.iterate((value) => {
      const chapter = value as Chapter;
      if (chapter.novelId === novelId) {
        result.push(chapter);
      }
    });
    return result.sort((a, b) => a.order - b.order);
  },

  async getChapter(id: string): Promise<Chapter | null> {
    const result = await storage.chapters.getItem<Chapter>(id);
    return result || null;
  },

  async saveChapter(chapter: Chapter): Promise<void> {
    await storage.chapters.setItem(chapter.id, chapter);
  },

  async deleteChapter(id: string): Promise<void> {
    await storage.chapters.removeItem(id);
  },

  async getCharacters(novelId: string): Promise<Character[]> {
    const result: Character[] = [];
    await storage.characters.iterate((value) => {
      const character = value as Character;
      if (character.novelId === novelId) {
        result.push(character);
      }
    });
    return result;
  },

  async getCharacter(id: string): Promise<Character | null> {
    const result = await storage.characters.getItem<Character>(id);
    return result || null;
  },

  async saveCharacter(character: Character): Promise<void> {
    await storage.characters.setItem(character.id, character);
  },

  async deleteCharacter(id: string): Promise<void> {
    await storage.characters.removeItem(id);
  },

  async getWorldSettings(novelId: string): Promise<WorldSetting[]> {
    const result: WorldSetting[] = [];
    await storage.worldSettings.iterate((value) => {
      const setting = value as WorldSetting;
      if (setting.novelId === novelId) {
        result.push(setting);
      }
    });
    return result;
  },

  async saveWorldSetting(setting: WorldSetting): Promise<void> {
    await storage.worldSettings.setItem(setting.id, setting);
  },

  async deleteWorldSetting(id: string): Promise<void> {
    await storage.worldSettings.removeItem(id);
  },

  async getTimelineEvents(novelId: string): Promise<TimelineEvent[]> {
    const result: TimelineEvent[] = [];
    await storage.timelineEvents.iterate((value) => {
      const event = value as TimelineEvent;
      if (event.novelId === novelId) {
        result.push(event);
      }
    });
    return result.sort((a, b) => a.year - b.year);
  },

  async saveTimelineEvent(event: TimelineEvent): Promise<void> {
    await storage.timelineEvents.setItem(event.id, event);
  },

  async deleteTimelineEvent(id: string): Promise<void> {
    await storage.timelineEvents.removeItem(id);
  },

  async getSkillDNA(novelId: string): Promise<SkillDNA | null> {
    const result = await storage.skillDNA.getItem<SkillDNA>(novelId);
    return result || null;
  },

  async saveSkillDNA(dna: SkillDNA): Promise<void> {
    await storage.skillDNA.setItem(dna.novelId, dna);
  },

  async getAIConfig(): Promise<AIConfig | null> {
    const result = await storage.aiConfig.getItem<AIConfig>('default');
    return result || null;
  },

  async saveAIConfig(config: AIConfig): Promise<void> {
    await storage.aiConfig.setItem('default', config);
  },
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const defaultAIConfig: AIConfig = {
  apiKey: '',
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 2048,
  topP: 0.9,
};