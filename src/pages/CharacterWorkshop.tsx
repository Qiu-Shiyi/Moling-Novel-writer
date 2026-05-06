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
          <div className="w-8 h-8 border-4 border-[cinnabar] border-t-transparent rounded-full animate-spin" />
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
        <div className="col-span-4 bg-[ink-800] rounded-xl border border-[ink-600] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[ink-600]">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-[paper]">角色列表</h3>
              <button
                onClick={() => setShowCreateModal(true)}
                className="p-2 text-[paper-dim] hover:text-[paper] hover:bg-[ink-700] rounded-lg transition-colors"
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
                    ? 'border-l-2 border-[cinnabar] bg-[cinnabar]/10'
                    : 'hover:bg-[ink-700]'
                }`}
                onClick={() => setSelectedCharacterId(character.id)}
              >
                <div className="w-10 h-10 rounded-full bg-[ink-700] flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-[paper-dim]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[paper] truncate">{character.name}</div>
                  <div className="text-xs text-[paper-dim] truncate">{character.description}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteCharacter(character.id); }}
                    className="p-1.5 hover:bg-[cinnabar]/20 rounded text-[paper-dim] hover:text-[cinnabar]"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}

            {characters.length === 0 && (
              <div className="text-center py-8 text-[paper-dim]">
                <User size={32} className="mx-auto mb-2 opacity-50" />
                <p>还没有角色</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-8">
          {selectedCharacter ? (
            <div className="bg-[ink-800] rounded-xl border border-[ink-600] overflow-hidden">
              <div className="p-6 border-b border-[ink-600]">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[cinnabar] to-[cinnabar-light] flex items-center justify-center flex-shrink-0">
                    <User size={32} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-serif text-2xl text-[paper] mb-1">{selectedCharacter.name}</h2>
                    <p className="text-[paper-dim]">{selectedCharacter.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 p-6">
                <div>
                  <h4 className="font-semibold text-[paper] mb-3 flex items-center gap-2">
                    <Target size={16} className="text-[cinnabar]" />
                    人物档案
                  </h4>
                  <div className="space-y-3">
                    {selectedCharacter.traits.length > 0 ? (
                      selectedCharacter.traits.map((trait, index) => (
                        <div key={index} className="flex justify-between bg-[ink-700]/50 rounded-lg px-4 py-2">
                          <span className="text-[paper-dim]">{trait.name}</span>
                          <span className="text-[cinnabar]">{trait.value}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[paper-dim] text-sm">暂无特质信息</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[paper] mb-3 flex items-center gap-2">
                    <Heart size={16} className="text-[cinnabar]" />
                    人物关系
                  </h4>
                  <div className="space-y-3">
                    {selectedCharacter.relationships.length > 0 ? (
                      selectedCharacter.relationships.map((rel, index) => {
                        const targetChar = characters.find(c => c.id === rel.targetId);
                        return (
                          <div key={index} className="flex items-center gap-3 bg-[ink-700]/50 rounded-lg px-4 py-2">
                            <div className="w-8 h-8 rounded-full bg-[ink-600] flex items-center justify-center">
                              <User size={14} className="text-[paper-dim]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-[paper] text-sm">{targetChar?.name || '未知'}</div>
                              <div className="text-xs text-[paper-dim] capitalize">{rel.type}</div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-[paper-dim] text-sm">暂无关系信息</p>
                    )}
                  </div>
                </div>

                <div className="col-span-2">
                  <h4 className="font-semibold text-[paper] mb-3 flex items-center gap-2">
                    <AlertCircle size={16} className="text-[cinnabar]" />
                    人物弧光
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[ink-700]/50 rounded-lg p-4">
                      <div className="text-xs text-[paper-dim] mb-1">第一幕</div>
                      <div className="text-sm text-[paper]">{selectedCharacter.arc.act1 || '未设定'}</div>
                    </div>
                    <div className="bg-[ink-700]/50 rounded-lg p-4">
                      <div className="text-xs text-[paper-dim] mb-1">第二幕</div>
                      <div className="text-sm text-[paper]">{selectedCharacter.arc.act2 || '未设定'}</div>
                    </div>
                    <div className="bg-[ink-700]/50 rounded-lg p-4">
                      <div className="text-xs text-[paper-dim] mb-1">第三幕</div>
                      <div className="text-sm text-[paper]">{selectedCharacter.arc.act3 || '未设定'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[ink-800] rounded-xl border border-[ink-600] h-[calc(100vh-20rem)] flex items-center justify-center">
              <div className="text-center">
                <User size={48} className="mx-auto text-[ink-600] mb-4" />
                <p className="text-[paper-dim]">选择一个角色查看详情</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[ink-800] rounded-xl w-full max-w-lg border border-[ink-600] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[ink-600]">
              <h2 className="font-serif text-xl text-[paper]">创建新角色</h2>
              <button onClick={() => { setShowCreateModal(false); setAiResult(''); }} className="text-[paper-dim] hover:text-[paper]">
                关闭
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[paper-dim] mb-2">角色名称</label>
                <input
                  type="text"
                  value={newCharacter.name}
                  onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[ink-700]/50 border border-[ink-600] rounded-lg text-[paper] focus:outline-none focus:border-[cinnabar]/50"
                  placeholder="输入角色名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[paper-dim] mb-2">描述标签（用逗号分隔）</label>
                <input
                  type="text"
                  value={newCharacter.tags}
                  onChange={(e) => setNewCharacter({ ...newCharacter, tags: e.target.value })}
                  className="w-full px-4 py-3 bg-[ink-700]/50 border border-[ink-600] rounded-lg text-[paper] focus:outline-none focus:border-[cinnabar]/50"
                  placeholder="例如：嘴硬心软, 黑客少女, 神秘身世"
                />
              </div>
              <button
                onClick={handleGenerateCharacter}
                disabled={!newCharacter.tags.trim() || aiLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[bamboo] hover:bg-[bamboo]/80 disabled:bg-[ink-600] text-white font-medium rounded-lg transition-colors"
              >
                {aiLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {aiLoading ? '生成中...' : 'AI生成人物档案'}
              </button>
              {aiResult && (
                <div className="p-4 bg-[ink-700]/50 rounded-lg">
                  <h4 className="font-medium text-[paper] mb-2">AI生成的人物档案</h4>
                  <pre className="text-sm text-[paper-dim] whitespace-pre-wrap font-sans">{aiResult}</pre>
                </div>
              )}
              <button
                onClick={handleCreateCharacter}
                disabled={!newCharacter.name.trim()}
                className="w-full px-4 py-3 bg-[cinnabar] hover:bg-[cinnabar-light] disabled:bg-[ink-600] text-white font-medium rounded-lg transition-colors"
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
