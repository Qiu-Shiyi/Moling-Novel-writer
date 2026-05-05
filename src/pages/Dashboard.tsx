import { useState, useEffect } from 'react';
import { Plus, BookOpen, Sparkles, BookMarked } from 'lucide-react';
import { Layout } from '@/components/Layout/Layout';
import { NovelCard } from '@/components/Dashboard/NovelCard';
import { CreateNovelModal } from '@/components/Dashboard/CreateNovelModal';
import { useNovelStore } from '@/hooks/useNovelStore';
import { useNavigate } from 'react-router-dom';
import type { CreativeMode } from '@/types';

export function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  const { novels, loading, loadNovels, createNovel, deleteNovel } = useNovelStore();

  useEffect(() => {
    loadNovels();
  }, [loadNovels]);

  const handleCreateNovel = async (data: { title: string; description: string; genre: string; creativeMode: CreativeMode; coverGradient: string }) => {
    const novel = await createNovel(data);
    navigate(`/editor/${novel.id}`);
  };

  const handleDeleteNovel = async (id: string) => {
    if (confirm('确定要删除这部小说吗？此操作无法撤销。')) {
      await deleteNovel(id);
    }
  };

  const quickStartButtons = [
    { 
      id: 'idea', 
      label: '灵感漫游', 
      icon: Sparkles, 
      description: '从聊天开始，让AI帮你拓展创意',
      onClick: () => {
        setShowCreateModal(true);
      }
    },
    { 
      id: 'structured', 
      label: '结构化创作', 
      icon: BookMarked, 
      description: '从大纲开始，逐步构建故事',
      onClick: () => {
        setShowCreateModal(true);
      }
    },
    { 
      id: 'sandbox', 
      label: '自由沙盒', 
      icon: BookOpen, 
      description: '空白画布，随心所欲',
      onClick: () => {
        setShowCreateModal(true);
      }
    },
  ];

  return (
    <Layout title="书架" subtitle="你的小说创作空间" showActions={false}>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {novels.length === 0 ? (
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                  <BookOpen size={32} className="text-slate-900" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">开始你的创作之旅</h2>
                <p className="text-slate-400">选择一种模式开始写作，或从灵感孵化室获取创意</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {quickStartButtons.map((btn) => (
                  <button
                    key={btn.id}
                    onClick={btn.onClick}
                    className="p-6 bg-slate-800 border border-slate-700 rounded-xl hover:border-amber-500/50 hover:bg-slate-700/50 transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <btn.icon size={24} className="text-amber-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">{btn.label}</h3>
                    <p className="text-sm text-slate-400">{btn.description}</p>
                  </button>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => navigate('/idea-lab')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-lg transition-all"
                >
                  <Sparkles size={20} />
                  进入灵感孵化室
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">我的小说</h2>
                  <p className="text-sm text-slate-400">{novels.length} 部作品</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium rounded-lg transition-colors"
                >
                  <Plus size={20} />
                  创建新小说
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {novels.map((novel) => (
                  <NovelCard
                    key={novel.id}
                    novel={novel}
                    onClick={() => navigate(`/editor/${novel.id}`)}
                    onEdit={() => setShowCreateModal(true)}
                    onDelete={() => handleDeleteNovel(novel.id)}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      <CreateNovelModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={(data) => handleCreateNovel({ ...data, creativeMode: data.mode })}
      />
    </Layout>
  );
}