import { create } from 'zustand';
import type { Novel, Chapter, Character, WorldSetting, TimelineEvent } from '@/types';
import { storageService, generateId } from '@/utils/storage';

interface NovelStore {
  novels: Novel[];
  currentNovel: Novel | null;
  chapters: Chapter[];
  characters: Character[];
  worldSettings: WorldSetting[];
  timelineEvents: TimelineEvent[];
  loading: boolean;
  error: string | null;

  loadNovels: () => Promise<void>;
  loadNovel: (id: string) => Promise<void>;
  createNovel: (data: Omit<Novel, 'id' | 'createdAt' | 'updatedAt' | 'wordCount' | 'chapterCount'>) => Promise<Novel>;
  updateNovel: (id: string, data: Partial<Novel>) => Promise<void>;
  deleteNovel: (id: string) => Promise<void>;

  loadChapters: (novelId: string) => Promise<void>;
  createChapter: (novelId: string, title: string) => Promise<Chapter>;
  updateChapter: (id: string, data: Partial<Chapter>) => Promise<void>;
  deleteChapter: (id: string) => Promise<void>;

  loadCharacters: (novelId: string) => Promise<void>;
  createCharacter: (novelId: string, data: Omit<Character, 'id'>) => Promise<Character>;
  updateCharacter: (id: string, data: Partial<Character>) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;

  loadWorldSettings: (novelId: string) => Promise<void>;
  createWorldSetting: (novelId: string, category: string, key: string, value: string) => Promise<WorldSetting>;
  updateWorldSetting: (id: string, value: string) => Promise<void>;
  deleteWorldSetting: (id: string) => Promise<void>;

  loadTimelineEvents: (novelId: string) => Promise<void>;
  createTimelineEvent: (novelId: string, year: number, title: string, description: string) => Promise<TimelineEvent>;
  updateTimelineEvent: (id: string, data: Partial<TimelineEvent>) => Promise<void>;
  deleteTimelineEvent: (id: string) => Promise<void>;

  clearError: () => void;
}

export const useNovelStore = create<NovelStore>((set, get) => ({
  novels: [],
  currentNovel: null,
  chapters: [],
  characters: [],
  worldSettings: [],
  timelineEvents: [],
  loading: false,
  error: null,

  loadNovels: async () => {
    set({ loading: true, error: null });
    try {
      const novels = await storageService.getNovels();
      set({ novels, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '加载小说列表失败', loading: false });
    }
  },

  loadNovel: async (id) => {
    set({ loading: true, error: null });
    try {
      const novel = await storageService.getNovel(id);
      if (novel) {
        set({ currentNovel: novel });
        await get().loadChapters(id);
        await get().loadCharacters(id);
        await get().loadWorldSettings(id);
        await get().loadTimelineEvents(id);
      }
      set({ loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '加载小说失败', loading: false });
    }
  },

  createNovel: async (data) => {
    const now = new Date().toISOString();
    const novel: Novel = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      wordCount: 0,
      chapterCount: 0,
    };
    await storageService.saveNovel(novel);
    set((state) => ({ novels: [novel, ...state.novels] }));
    return novel;
  },

  updateNovel: async (id, data) => {
    const novel = await storageService.getNovel(id);
    if (novel) {
      const updated = { ...novel, ...data, updatedAt: new Date().toISOString() };
      await storageService.saveNovel(updated);
      set((state) => ({
        novels: state.novels.map(n => n.id === id ? updated : n),
        currentNovel: state.currentNovel?.id === id ? updated : state.currentNovel,
      }));
    }
  },

  deleteNovel: async (id) => {
    await storageService.deleteNovel(id);
    set((state) => ({
      novels: state.novels.filter(n => n.id !== id),
      currentNovel: state.currentNovel?.id === id ? null : state.currentNovel,
      chapters: [],
      characters: [],
      worldSettings: [],
      timelineEvents: [],
    }));
  },

  loadChapters: async (novelId) => {
    try {
      const chapters = await storageService.getChapters(novelId);
      set({ chapters });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '加载章节失败' });
    }
  },

  createChapter: async (novelId, title) => {
    const chapters = await storageService.getChapters(novelId);
    const now = new Date().toISOString();
    const chapter: Chapter = {
      id: generateId(),
      novelId,
      title,
      content: '',
      order: chapters.length + 1,
      wordCount: 0,
      createdAt: now,
      updatedAt: now,
      versionHistory: [],
    };
    await storageService.saveChapter(chapter);
    set((state) => ({ chapters: [...state.chapters, chapter] }));
    
    const novel = await storageService.getNovel(novelId);
    if (novel) {
      await get().updateNovel(novelId, { 
        chapterCount: novel.chapterCount + 1,
        updatedAt: now 
      });
    }
    return chapter;
  },

  updateChapter: async (id, data) => {
    const chapter = await storageService.getChapter(id);
    if (chapter) {
      const hasContentChange = data.content !== undefined && data.content !== chapter.content;
      const versionHistory = hasContentChange 
        ? [...chapter.versionHistory, { timestamp: chapter.updatedAt, content: chapter.content }]
        : chapter.versionHistory;
      
      const updated = { 
        ...chapter, 
        ...data, 
        updatedAt: new Date().toISOString(),
        wordCount: data.content ? data.content.length : chapter.wordCount,
        versionHistory: versionHistory.slice(-10),
      };
      await storageService.saveChapter(updated);
      set((state) => ({ chapters: state.chapters.map(c => c.id === id ? updated : c) }));

      if (hasContentChange) {
        const novel = await storageService.getNovel(chapter.novelId);
        if (novel) {
          const wordDiff = (data.content?.length || 0) - chapter.content.length;
          await get().updateNovel(chapter.novelId, { wordCount: novel.wordCount + wordDiff });
        }
      }
    }
  },

  deleteChapter: async (id) => {
    const chapter = await storageService.getChapter(id);
    if (chapter) {
      await storageService.deleteChapter(id);
      set((state) => ({ 
        chapters: state.chapters.filter(c => c.id !== id).map((c, i) => ({ ...c, order: i + 1 })) 
      }));
      
      const novel = await storageService.getNovel(chapter.novelId);
      if (novel) {
        await get().updateNovel(chapter.novelId, { 
          chapterCount: novel.chapterCount - 1,
          wordCount: novel.wordCount - chapter.wordCount,
        });
      }
    }
  },

  loadCharacters: async (novelId) => {
    try {
      const characters = await storageService.getCharacters(novelId);
      set({ characters });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '加载角色失败' });
    }
  },

  createCharacter: async (_novelId, data) => {
    const character: Character = {
      ...data,
      id: generateId(),
    };
    await storageService.saveCharacter(character);
    set((state) => ({ characters: [...state.characters, character] }));
    return character;
  },

  updateCharacter: async (id, data) => {
    const character = await storageService.getCharacter(id);
    if (character) {
      const updated = { ...character, ...data };
      await storageService.saveCharacter(updated);
      set((state) => ({ characters: state.characters.map(c => c.id === id ? updated : c) }));
    }
  },

  deleteCharacter: async (id) => {
    await storageService.deleteCharacter(id);
    set((state) => ({ characters: state.characters.filter(c => c.id !== id) }));
  },

  loadWorldSettings: async (novelId) => {
    try {
      const settings = await storageService.getWorldSettings(novelId);
      set({ worldSettings: settings });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '加载设定失败' });
    }
  },

  createWorldSetting: async (novelId, category, key, value) => {
    const setting: WorldSetting = {
      id: generateId(),
      novelId,
      category,
      key,
      value,
    };
    await storageService.saveWorldSetting(setting);
    set((state) => ({ worldSettings: [...state.worldSettings, setting] }));
    return setting;
  },

  updateWorldSetting: async (id, value) => {
    const setting = await storageService.getWorldSettings('').then(settings => 
      settings.find(s => s.id === id)
    );
    if (setting) {
      const updated = { ...setting, value };
      await storageService.saveWorldSetting(updated);
      set((state) => ({ worldSettings: state.worldSettings.map(s => s.id === id ? updated : s) }));
    }
  },

  deleteWorldSetting: async (id) => {
    await storageService.deleteWorldSetting(id);
    set((state) => ({ worldSettings: state.worldSettings.filter(s => s.id !== id) }));
  },

  loadTimelineEvents: async (novelId) => {
    try {
      const events = await storageService.getTimelineEvents(novelId);
      set({ timelineEvents: events });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '加载时间线失败' });
    }
  },

  createTimelineEvent: async (novelId, year, title, description) => {
    const event: TimelineEvent = {
      id: generateId(),
      novelId,
      year,
      title,
      description,
    };
    await storageService.saveTimelineEvent(event);
    set((state) => ({ timelineEvents: [...state.timelineEvents, event].sort((a, b) => a.year - b.year) }));
    return event;
  },

  updateTimelineEvent: async (id, data) => {
    const events = await storageService.getTimelineEvents('');
    const event = events.find(e => e.id === id);
    if (event) {
      const updated = { ...event, ...data };
      await storageService.saveTimelineEvent(updated);
      set((state) => ({ 
        timelineEvents: state.timelineEvents.map(e => e.id === id ? updated : e).sort((a, b) => a.year - b.year) 
      }));
    }
  },

  deleteTimelineEvent: async (id) => {
    await storageService.deleteTimelineEvent(id);
    set((state) => ({ timelineEvents: state.timelineEvents.filter(e => e.id !== id) }));
  },

  clearError: () => set({ error: null }),
}));
