import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Trash2, User, Sparkles, Loader2, Heart, Target, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/Layout/Layout';
import { useNovelStore } from '@/hooks/useNovelStore';
import { useAIStore } from '@/hooks/useAIStore';
import type { Character } from '@/types';

export function CharacterWorkshop() {
  const { novelId } = useParams<{ novelId: string }>();
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    description: '',
    tags: ''
  });
  const [aiResult, setAiResult] = useState('');
  
  const { currentNovel, characters, loading, loadNovel, createCharacter, deleteCharacter } = useNovelStore();
  const { generateCharacter, isLoading: aiLoading } = useAIStore();

  useEffect(() => {
    if (novelId) {
      loadNovel(novelId);
    }
  }, [novelId, loadNovel]);

  const selectedCharacter = characters.find(c => c.id === selectedCharacterId) || null;

  const handleCreateCharacter = async () => {
    if (!newCharacter.name.trim()) return;
    
    const tags = newCharacter.tags.split(',').map(t => t.trim()).filter(Boolean);
    
    if (novelId) {
      const character: Character = {
        id: '',
        novelId,
        name: newCharacter.name,
        description: newCharacter.description || '暂无描述',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + newCharacter.name,
        traits: [],
        backstory: '',
        goals: [],
        flaws: [],
        relationships: [],
        arc: { act1: '', act2: '', act3: '', growth: 0 }
      };
      
      if (tags.length > 0 && aiResult) {
        character.description = aiResult;
      }
      
      await createCharacter(novelId, character);
      setShowCreateModal(false);
      setNewCharacter({ name: '', description: '', tags: '' });
      setAiResult('');
    }
  };

  const handleGenerateCharacter = async () => {
    if (!newCharacter.tags.trim()) return;
    const tags = newCharacter.tags.split(',').map(t => t.trim()).filter(Boolean);
    try {
      const result = await generateCharacter(tags);
      setAiResult(result);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCharacter = async (id: string) => {
    if (confirm('确定删除这个角色吗？')) {
      await deleteCharacter(id);
      if (selectedCharacterId === id) {
        setSelectedCharacterId(characters.find(c => c.id !== id)?.id || null);
      }
    }
  };

  if (loading) {
    return (
      <Layout title="加载中..." showActions={false}>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="人物工坊" 
      subtitle={currentNovel?.title}
      currentNovelId={novelId || undefined}
    >
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4 bg-slate-800 rounded-xl border border-slate-700 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">角色列表</h3>
              <button
                onClick={() => setShowCreateModal(true)}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {characters.map((character) => (
              <div
                key={character.id}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all ${
                  selectedCharacterId === character.id
                    ? 'bg-amber-500/10 border border-amber-500/20'
                    : 'hover:bg-slate-700'
                }`}
                onClick={() => setSelectedCharacterId(character.id)}
              >
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">{character.name}</div>
                  <div className="text-xs text-slate-400 truncate">{character.description}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteCharacter(character.id); }}
                    className="p-1.5 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}

            {characters.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <User size={32} className="mx-auto mb-2 opacity-50" />
                <p>还没有角色</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-8">
          {selectedCharacter ? (
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                    <User size={32} className="text-slate-900" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-white mb-1">{selectedCharacter.name}</h2>
                    <p className="text-slate-400">{selectedCharacter.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 p-6">
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Target size={16} className="text-amber-400" />
                    人物档案
                  </h4>
                  <div className="space-y-3">
                    {selectedCharacter.traits.length > 0 ? (
                      selectedCharacter.traits.map((trait, index) => (
                        <div key={index} className="flex justify-between bg-slate-700/50 rounded-lg px-4 py-2">
                          <span className="text-slate-300">{trait.name}</span>
                          <span className="text-amber-400">{trait.value}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm">暂无特质信息</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Heart size={16} className="text-amber-400" />
                    人物关系
                  </h4>
                  <div className="space-y-3">
                    {selectedCharacter.relationships.length > 0 ? (
                      selectedCharacter.relationships.map((rel, index) => {
                        const targetChar = characters.find(c => c.id === rel.targetId);
                        return (
                          <div key={index} className="flex items-center gap-3 bg-slate-700/50 rounded-lg px-4 py-2">
                            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                              <User size={14} className="text-slate-400" />
                            </div>
                            <div className="flex-1">
                              <div className="text-white text-sm">{targetChar?.name || '未知'}</div>
                              <div className="text-xs text-slate-400 capitalize">{rel.type}</div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-slate-500 text-sm">暂无关系信息</p>
                    )}
                  </div>
                </div>

                <div className="col-span-2">
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <AlertCircle size={16} className="text-amber-400" />
                    人物弧光
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <div className="text-xs text-slate-400 mb-1">第一幕</div>
                      <div className="text-sm text-white">{selectedCharacter.arc.act1 || '未设定'}</div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <div className="text-xs text-slate-400 mb-1">第二幕</div>
                      <div className="text-sm text-white">{selectedCharacter.arc.act2 || '未设定'}</div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <div className="text-xs text-slate-400 mb-1">第三幕</div>
                      <div className="text-sm text-white">{selectedCharacter.arc.act3 || '未设定'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800 rounded-xl border border-slate-700 h-[calc(100vh-20rem)] flex items-center justify-center">
              <div className="text-center">
                <User size={48} className="mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">选择一个角色查看详情</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl w-full max-w-lg border border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">创建新角色</h2>
              <button onClick={() => { setShowCreateModal(false); setAiResult(''); }} className="text-slate-400 hover:text-white">
                关闭
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">角色名称</label>
                <input
                  type="text"
                  value={newCharacter.name}
                  onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                  placeholder="输入角色名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">描述标签（用逗号分隔）</label>
                <input
                  type="text"
                  value={newCharacter.tags}
                  onChange={(e) => setNewCharacter({ ...newCharacter, tags: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                  placeholder="例如：嘴硬心软, 黑客少女, 神秘身世"
                />
              </div>
              <button
                onClick={handleGenerateCharacter}
                disabled={!newCharacter.tags.trim() || aiLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 text-white font-medium rounded-lg transition-colors"
              >
                {aiLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {aiLoading ? '生成中...' : 'AI生成人物档案'}
              </button>
              {aiResult && (
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="font-medium text-white mb-2">AI生成的人物档案</h4>
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">{aiResult}</pre>
                </div>
              )}
              <button
                onClick={handleCreateCharacter}
                disabled={!newCharacter.name.trim()}
                className="w-full px-4 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 text-slate-900 font-medium rounded-lg transition-colors"
              >
                创建角色
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}