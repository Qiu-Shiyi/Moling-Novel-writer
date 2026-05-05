import { useState } from 'react';
import { X, Sparkles, GitBranch, Wind } from 'lucide-react';
import type { CreativeMode } from '@/types';
import { coverGradients } from '@/utils/aiService';
import { genreGuides } from '@/utils/aiService';

interface CreateNovelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { title: string; description: string; genre: string; mode: CreativeMode; coverGradient: string }) => void;
}

export function CreateNovelModal({ isOpen, onClose, onCreate }: CreateNovelModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [mode, setMode] = useState<CreativeMode>('idea');
  const [coverGradient, setCoverGradient] = useState(coverGradients[0]);

  const modes: { id: CreativeMode; label: string; icon: typeof Sparkles; description: string }[] = [
    { id: 'idea', label: '灵感漫游', icon: Sparkles, description: '聊着天碰撞脑洞' },
    { id: 'structured', label: '结构化创作', icon: GitBranch, description: '从大纲到章节逐步推进' },
    { id: 'sandbox', label: '自由沙盒', icon: Wind, description: '完全手动控制，AI按需召唤' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate({ title, description, genre, mode, coverGradient });
      onClose();
      setTitle('');
      setDescription('');
      setGenre('');
      setMode('idea');
      setCoverGradient(coverGradients[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-2xl w-full max-w-lg border border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">创建新小说</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">小说标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入小说标题..."
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">简介</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简单描述你的故事..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">类型</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50 transition-colors"
            >
              <option value="">选择类型...</option>
              {genreGuides.map((g) => (
                <option key={g.name} value={g.name}>{g.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">创作模式</label>
            <div className="grid grid-cols-3 gap-3">
              {modes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={`p-4 rounded-lg border transition-all text-left ${
                    mode === m.id
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                      : 'bg-slate-700/30 border-slate-600 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <m.icon size={24} className="mb-2" />
                  <div className="font-medium text-sm">{m.label}</div>
                  <div className="text-xs mt-1 opacity-70">{m.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">封面配色</label>
            <div className="flex flex-wrap gap-3">
              {coverGradients.map((gradient, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCoverGradient(gradient)}
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} transition-transform ${
                    coverGradient === gradient ? 'ring-2 ring-amber-500 scale-110' : 'hover:scale-105'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium rounded-lg transition-colors"
            >
              创建
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}