import { BookOpen, Clock, FileText, Trash2, Edit3 } from 'lucide-react';
import type { Novel } from '@/types';

interface NovelCardProps {
  novel: Novel;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function NovelCard({ novel, onClick, onEdit, onDelete }: NovelCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  const getModeLabel = (mode: Novel['creativeMode']) => {
    switch (mode) {
      case 'idea': return '灵感漫游';
      case 'structured': return '结构化';
      case 'sandbox': return '自由沙盒';
    }
  };

  const getModeColor = (mode: Novel['creativeMode']) => {
    switch (mode) {
      case 'idea': return 'bg-cinnabar/20 text-cinnabar';
      case 'structured': return 'bg-bamboo/20 text-bamboo';
      case 'sandbox': return 'bg-rattan/20 text-rattan';
    }
  };

  return (
    <div
      className="group relative bg-ink-800 rounded-xl overflow-hidden border border-ink-600 hover:border-cinnabar/40 transition-all duration-300 hover:shadow-lg hover:shadow-[cinnabar]/5 hover:-translate-y-1"
      onClick={onClick}
    >
      <div className={`h-32 bg-gradient-to-br ${novel.coverGradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-t from-[ink-800] to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen size={48} className="text-paper/20" />
        </div>
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs rounded-full ${getModeColor(novel.creativeMode)}`}>
            {getModeLabel(novel.creativeMode)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-serif font-semibold text-paper mb-1 truncate">{novel.title}</h3>
        <p className="text-sm text-paper-dim mb-3 line-clamp-2">{novel.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-paper-dim">
            <span className="flex items-center gap-1">
              <FileText size={12} />
              {novel.chapterCount} 章节
            </span>
            <span className="flex items-center gap-1">
              <Edit3 size={12} />
              {novel.wordCount.toLocaleString()} 字
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatDate(novel.updatedAt)}
            </span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-1.5 hover:bg-ink-700 rounded-lg text-paper-dim hover:text-paper transition-colors"
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-1.5 hover:bg-cinnabar/20 rounded-lg text-paper-dim hover:text-cinnabar transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}