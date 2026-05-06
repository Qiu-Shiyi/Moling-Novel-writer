import { useState } from 'react';
import { MessageCircle, Sparkles, GitMerge, FileSearch, BookOpen, Send, Loader2 } from 'lucide-react';
import { Layout } from '@/components/Layout/Layout';
import { useAIStore } from '@/hooks/useAIStore';
import { genreGuides } from '@/utils/aiService';

type TabType = 'brainstorm' | 'whatif' | 'fusion' | 'extract' | 'genre';

export function IdeaLab() {
  const [activeTab, setActiveTab] = useState<TabType>('brainstorm');
  const [inputValue, setInputValue] = useState('');
  const [work1, setWork1] = useState('');
  const [work2, setWork2] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [result, setResult] = useState('');

  const { brainstorm, generateWhatIf, extractCoreIdea, isLoading, error } = useAIStore();

  const handleBrainstorm = async () => {
    if (!inputValue.trim()) return;
    try {
      const res = await brainstorm(inputValue);
      setResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWhatIf = async () => {
    if (!work1.trim() || !work2.trim()) return;
    try {
      const res = await generateWhatIf(work1, work2);
      setResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExtract = async () => {
    if (!extractedText.trim()) return;
    try {
      const res = await extractCoreIdea(extractedText);
      setResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: 'brainstorm' as TabType, label: '脑洞聊天', icon: MessageCircle },
    { id: 'whatif' as TabType, label: '如果生成器', icon: Sparkles },
    { id: 'fusion' as TabType, label: '作品融合', icon: GitMerge },
    { id: 'extract' as TabType, label: '创意提取', icon: FileSearch },
    { id: 'genre' as TabType, label: '类型宝典', icon: BookOpen },
  ];

  return (
    <Layout title="灵感孵化室" subtitle="突破创作瓶颈，激发无限灵感" showActions={false}>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <div className="bg-[var(--ink-800)] rounded-xl border border-[var(--ink-600)] overflow-hidden">
            <div className="flex border-b border-[var(--ink-600)]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setResult('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[var(--cinnabar)] text-white rounded-full mx-2 my-1'
                      : 'text-[var(--paper-dim)] hover:text-[var(--paper)] hover:bg-[var(--ink-700)]/50'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'brainstorm' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--paper-dim)] mb-2">
                      输入你的想法
                    </label>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="例如：一个用音乐杀人的世界..."
                      className="w-full px-4 py-3 bg-[var(--ink-700)]/50 border border-[var(--ink-600)] rounded-lg text-[var(--paper)] placeholder-[var(--paper-dim)] focus:outline-none focus:border-[var(--cinnabar)]/50 focus:shadow-[0_0_15px_rgba(196,92,72,0.15)] transition-colors"
                      onKeyDown={(e) => e.key === 'Enter' && handleBrainstorm()}
                    />
                  </div>
                  <button
                    onClick={handleBrainstorm}
                    disabled={!inputValue.trim() || isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--cinnabar)] hover:bg-[var(--cinnabar-light)] disabled:bg-[var(--ink-600)] text-white font-medium rounded-lg transition-colors"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin text-[var(--cinnabar)]" /> : <Send size={18} />}
                    {isLoading ? '思考中...' : '开始头脑风暴'}
                  </button>
                </div>
              )}

              {activeTab === 'whatif' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--paper-dim)] mb-2">
                      第一个作品
                    </label>
                    <input
                      type="text"
                      value={work1}
                      onChange={(e) => setWork1(e.target.value)}
                      placeholder="例如：哈利波特"
                      className="w-full px-4 py-3 bg-[var(--ink-700)]/50 border border-[var(--ink-600)] rounded-lg text-[var(--paper)] placeholder-[var(--paper-dim)] focus:outline-none focus:border-[var(--cinnabar)]/50 focus:shadow-[0_0_15px_rgba(196,92,72,0.15)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--paper-dim)] mb-2">
                      第二个作品
                    </label>
                    <input
                      type="text"
                      value={work2}
                      onChange={(e) => setWork2(e.target.value)}
                      placeholder="例如：赛博朋克"
                      className="w-full px-4 py-3 bg-[var(--ink-700)]/50 border border-[var(--ink-600)] rounded-lg text-[var(--paper)] placeholder-[var(--paper-dim)] focus:outline-none focus:border-[var(--cinnabar)]/50 focus:shadow-[0_0_15px_rgba(196,92,72,0.15)] transition-colors"
                    />
                  </div>
                  <button
                    onClick={handleWhatIf}
                    disabled={!work1.trim() || !work2.trim() || isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--cinnabar)] hover:bg-[var(--cinnabar-light)] disabled:bg-[var(--ink-600)] text-white font-medium rounded-lg transition-colors"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin text-[var(--cinnabar)]" /> : <Sparkles size={18} />}
                    {isLoading ? '融合中...' : '生成"如果"场景'}
                  </button>
                </div>
              )}

              {activeTab === 'fusion' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--paper-dim)] mb-2">
                      输入两个喜欢的作品
                    </label>
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="例如：《三体》和《红楼梦》"
                      rows={3}
                      className="w-full px-4 py-3 bg-[var(--ink-700)]/50 border border-[var(--ink-600)] rounded-lg text-[var(--paper)] placeholder-[var(--paper-dim)] focus:outline-none focus:border-[var(--cinnabar)]/50 focus:shadow-[0_0_15px_rgba(196,92,72,0.15)] transition-colors resize-none"
                    />
                  </div>
                  <button
                    onClick={handleBrainstorm}
                    disabled={!inputValue.trim() || isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--cinnabar)] hover:bg-[var(--cinnabar-light)] disabled:bg-[var(--ink-600)] text-white font-medium rounded-lg transition-colors"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin text-[var(--cinnabar)]" /> : <GitMerge size={18} />}
                    {isLoading ? '分析中...' : '分析并融合'}
                  </button>
                </div>
              )}

              {activeTab === 'extract' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--paper-dim)] mb-2">
                      粘贴随笔、梦境记录或新闻
                    </label>
                    <textarea
                      value={extractedText}
                      onChange={(e) => setExtractedText(e.target.value)}
                      placeholder="粘贴你的文本..."
                      rows={6}
                      className="w-full px-4 py-3 bg-[var(--ink-700)]/50 border border-[var(--ink-600)] rounded-lg text-[var(--paper)] placeholder-[var(--paper-dim)] focus:outline-none focus:border-[var(--cinnabar)]/50 focus:shadow-[0_0_15px_rgba(196,92,72,0.15)] transition-colors resize-none"
                    />
                  </div>
                  <button
                    onClick={handleExtract}
                    disabled={!extractedText.trim() || isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--cinnabar)] hover:bg-[var(--cinnabar-light)] disabled:bg-[var(--ink-600)] text-white font-medium rounded-lg transition-colors"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin text-[var(--cinnabar)]" /> : <FileSearch size={18} />}
                    {isLoading ? '提取中...' : '提取核心创意'}
                  </button>
                </div>
              )}

              {activeTab === 'genre' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {genreGuides.map((genre) => (
                      <div
                        key={genre.name}
                        className="bg-[var(--ink-700)]/30 border border-[var(--ink-600)] rounded-xl p-4 hover:border-[var(--cinnabar)]/50 transition-colors cursor-pointer"
                      >
                        <h3 className="font-semibold text-[var(--paper)] mb-2">{genre.name}</h3>
                        <p className="text-sm text-[var(--paper-dim)] mb-3">{genre.description}</p>
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs text-[var(--cinnabar)]">必备桥段:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {genre.beats.map((beat) => (
                                <span key={beat} className="text-xs px-2 py-0.5 bg-[var(--cinnabar)]/20 text-[var(--cinnabar)] rounded-full">
                                  {beat}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-[var(--cinnabar)]/20 border border-[var(--cinnabar)]/50 rounded-lg text-[var(--cinnabar)] text-sm">
                  {error}
                </div>
              )}

              {result && (
                <div className="mt-6 p-4 bg-[var(--ink-700)]/30 border border-[var(--ink-600)] rounded-xl">
                  <h3 className="font-serif font-semibold text-[var(--paper)] mb-2">生成结果</h3>
                  <pre className="text-sm text-[var(--paper-dim)] whitespace-pre-wrap font-sans">{result}</pre>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-4">
          <div className="bg-[var(--ink-800)] rounded-xl border border-[var(--ink-600)] p-6">
            <h3 className="font-serif font-semibold text-[var(--paper)] mb-4">灵感小贴士</h3>
            <div className="space-y-4">
              <div className="bg-[var(--ink-700)]/30 rounded-lg p-4">
                <p className="text-sm text-[var(--paper-dim)]">
                  <span className="text-[var(--bamboo)] font-medium">✦</span> 尝试用"如果..."开头的问题来激发创意
                </p>
              </div>
              <div className="bg-[var(--ink-700)]/30 rounded-lg p-4">
                <p className="text-sm text-[var(--paper-dim)]">
                  <span className="text-[var(--bamboo)] font-medium">✦</span> 融合两种截然不同的作品往往能产生惊喜
                </p>
              </div>
              <div className="bg-[var(--ink-700)]/30 rounded-lg p-4">
                <p className="text-sm text-[var(--paper-dim)]">
                  <span className="text-[var(--bamboo)] font-medium">✦</span> 梦境和日常观察是最好的创意来源
                </p>
              </div>
              <div className="bg-[var(--ink-700)]/30 rounded-lg p-4">
                <p className="text-sm text-[var(--paper-dim)]">
                  <span className="text-[var(--bamboo)] font-medium">✦</span> 不要害怕荒诞的想法，伟大的故事往往始于疯狂
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
