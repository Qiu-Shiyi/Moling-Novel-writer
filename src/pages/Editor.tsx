import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Trash2, Edit3, ChevronRight, Sparkles, Loader2, Undo, Redo, Bold, Italic, List, ListOrdered } from 'lucide-react';
import { Layout } from '@/components/Layout/Layout';
import { useNovelStore } from '@/hooks/useNovelStore';
import { useAIStore } from '@/hooks/useAIStore';


export function Editor() {
  const { novelId } = useParams<{ novelId: string }>();
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiResults, setAiResults] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { currentNovel, chapters, loading, loadNovel, createChapter, updateChapter, deleteChapter } = useNovelStore();
  const { generateContinuation, isLoading: aiLoading, error: aiError } = useAIStore();

  useEffect(() => {
    if (novelId) {
      loadNovel(novelId);
    }
  }, [novelId, loadNovel]);

  useEffect(() => {
    if (chapters.length > 0 && !selectedChapterId) {
      setSelectedChapterId(chapters[0].id);
    }
  }, [chapters, selectedChapterId]);

  const selectedChapter = chapters.find(c => c.id === selectedChapterId) || null;

  const handleCreateChapter = async () => {
    if (novelId) {
      const newChapter = await createChapter(novelId, `第${chapters.length + 1}章`);
      setSelectedChapterId(newChapter.id);
    }
  };

  const handleDeleteChapter = async (id: string) => {
    if (confirm('确定删除这一章吗？')) {
      await deleteChapter(id);
      if (selectedChapterId === id) {
        setSelectedChapterId(chapters.find(c => c.id !== id)?.id || null);
      }
    }
  };

  const handleTextChange = (content: string) => {
    if (selectedChapterId) {
      updateChapter(selectedChapterId, { content });
    }
  };

  const handleGenerateContinuation = async () => {
    if (!selectedChapter?.content.trim()) return;
    
    try {
      const context = selectedChapter.content.slice(-1000);
      const results = await generateContinuation(context, 'default', 'third_person', 'medium', 3);
      setAiResults(results);
      setShowAIPanel(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInsertAIResult = (text: string) => {
    if (selectedChapterId) {
      const currentContent = selectedChapter?.content || '';
      updateChapter(selectedChapterId, { content: currentContent + '\n\n' + text });
    }
    setShowAIPanel(false);
    setAiResults([]);
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
      title={currentNovel?.title || '写作区'} 
      subtitle={currentNovel?.description}
      currentNovelId={novelId || undefined}
    >
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
        <div className="col-span-3 bg-slate-800 rounded-xl border border-slate-700 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">章节列表</h3>
              <button
                onClick={handleCreateChapter}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  selectedChapterId === chapter.id
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
                onClick={() => setSelectedChapterId(chapter.id)}
              >
                <ChevronRight size={16} className="flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm">{chapter.title}</span>
                    {chapter.content.length > 0 && (
                      <span className="text-xs text-slate-500">{chapter.wordCount}字</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="p-1.5 hover:bg-slate-600 rounded text-slate-400 hover:text-white"
                  >
                    <Edit3 size={12} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteChapter(chapter.id); }}
                    className="p-1.5 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-9 flex flex-col">
          <div className="bg-slate-800 rounded-xl border border-slate-700 flex flex-col overflow-hidden flex-1">
            {selectedChapter && (
              <>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
                  <input
                    type="text"
                    value={selectedChapter.title}
                    onChange={(e) => updateChapter(selectedChapter.id, { title: e.target.value })}
                    className="bg-transparent text-lg font-semibold text-white border-none outline-none"
                    placeholder="章节标题..."
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAIPanel(!showAIPanel)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        showAIPanel 
                          ? 'bg-amber-500 text-slate-900' 
                          : 'bg-slate-700 text-white hover:bg-slate-600'
                      }`}
                    >
                      <Sparkles size={16} />
                      AI续写
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-6 py-2 border-b border-slate-700 bg-slate-800/50">
                  <button className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                    <Bold size={16} />
                  </button>
                  <button className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                    <Italic size={16} />
                  </button>
                  <div className="w-px h-6 bg-slate-600 mx-1" />
                  <button className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                    <List size={16} />
                  </button>
                  <button className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                    <ListOrdered size={16} />
                  </button>
                  <div className="w-px h-6 bg-slate-600 mx-1" />
                  <button className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                    <Undo size={16} />
                  </button>
                  <button className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                    <Redo size={16} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <textarea
                    ref={textareaRef}
                    value={selectedChapter.content}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder="开始写作..."
                    className="w-full h-full bg-transparent text-white text-lg leading-relaxed resize-none outline-none placeholder-slate-500"
                    spellCheck={false}
                  />
                </div>
              </>
            )}

            {!selectedChapter && chapters.length > 0 && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Edit3 size={48} className="mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-400">选择一个章节开始编辑</p>
                </div>
              </div>
            )}

            {chapters.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Edit3 size={48} className="mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-400 mb-4">还没有章节，点击左侧按钮创建</p>
                  <button
                    onClick={handleCreateChapter}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium rounded-lg transition-colors"
                  >
                    创建第一章
                  </button>
                </div>
              </div>
            )}
          </div>

          {showAIPanel && selectedChapter && (
            <div className="mt-4 bg-slate-800 rounded-xl border border-slate-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-white">AI续写建议</h4>
                <button
                  onClick={() => setShowAIPanel(false)}
                  className="text-slate-400 hover:text-white"
                >
                  关闭
                </button>
              </div>

              {aiLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-amber-500" />
                </div>
              ) : aiError ? (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                  {aiError}
                </div>
              ) : aiResults.length > 0 ? (
                <div className="space-y-4">
                  {aiResults.map((result, index) => (
                    <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          index === 0 ? 'bg-blue-500/20 text-blue-400' :
                          index === 1 ? 'bg-amber-500/20 text-amber-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {index === 0 ? '保守' : index === 1 ? '适中' : '出人意料'}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm mb-3">{result}</p>
                      <button
                        onClick={() => handleInsertAIResult(result)}
                        className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-sm rounded-lg transition-colors"
                      >
                        插入这段
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <button
                    onClick={handleGenerateContinuation}
                    disabled={!selectedChapter.content.trim()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 text-slate-900 font-medium rounded-lg transition-colors"
                  >
                    <Sparkles size={20} />
                    生成续写建议
                  </button>
                  <p className="text-sm text-slate-500 mt-2">基于当前内容生成3种不同风格的续写</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}