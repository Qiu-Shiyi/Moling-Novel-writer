export interface Novel {
  id: string;
  title: string;
  description: string;
  genre: string;
  coverGradient: string;
  creativeMode: 'idea' | 'structured' | 'sandbox';
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  chapterCount: number;
}

export interface Chapter {
  id: string;
  novelId: string;
  title: string;
  content: string;
  order: number;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  versionHistory: ChapterVersion[];
}

export interface ChapterVersion {
  timestamp: string;
  content: string;
}

export interface Character {
  id: string;
  novelId: string;
  name: string;
  description: string;
  avatar: string;
  traits: CharacterTrait[];
  backstory: string;
  goals: string[];
  flaws: string[];
  relationships: CharacterRelationship[];
  arc: CharacterArc;
}

export interface CharacterTrait {
  name: string;
  value: string;
}

export interface CharacterRelationship {
  targetId: string;
  type: 'friend' | 'enemy' | 'lover' | 'family' | 'mentor' | 'rival';
  description: string;
}

export interface CharacterArc {
  act1: string;
  act2: string;
  act3: string;
  growth: number;
}

export interface WorldSetting {
  id: string;
  novelId: string;
  category: string;
  key: string;
  value: string;
}

export interface TimelineEvent {
  id: string;
  novelId: string;
  year: number;
  title: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  level: number;
  experience: number;
  description: string;
  promptTemplate: string;
  parameters: SkillParameter[];
  evolutionPath: SkillEvolution[];
}

export interface SkillParameter {
  name: string;
  type: 'slider' | 'select' | 'text';
  default: string | number;
  options?: string[];
}

export interface SkillEvolution {
  level: number;
  description: string;
  unlockedFeatures: string[];
}

export interface SkillDNA {
  novelId: string;
  skills: Skill[];
  styleFingerprint: StylePreferences;
  usageHistory: SkillUsage[];
}

export interface StylePreferences {
  preferredSentenceLength: 'short' | 'medium' | 'long';
  sensoryDetailLevel: number;
  dialogueStyle: 'direct' | 'subtextual' | 'lyrical';
  favoriteAuthors: string[];
}

export interface SkillUsage {
  skillId: string;
  timestamp: string;
  rating: number;
  feedback: 'accept' | 'reject' | 'modify';
}

export interface AIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
}

export interface PlotPoint {
  id: string;
  novelId: string;
  chapterId?: string;
  type: 'exposition' | 'inciting' | 'rising' | 'climax' | 'falling' | 'resolution';
  description: string;
  characterIds: string[];
}

export interface Foreshadowing {
  id: string;
  novelId: string;
  chapterId: string;
  text: string;
  revealChapterId?: string;
  status: 'planted' | 'revealed' | 'forgotten';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ContinuationOption {
  id: string;
  content: string;
  style: 'conservative' | 'expected' | 'surprising';
}

export type CreativeMode = 'idea' | 'structured' | 'sandbox';

export interface GenreInfo {
  name: string;
  icon: string;
  description: string;
  beats: string[];
  tropes: string[];
  pitfalls: string[];
}