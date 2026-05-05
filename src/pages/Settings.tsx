import { useState, useEffect } from 'react';
import { Save, CheckCircle, AlertCircle, Loader2, Zap } from 'lucide-react';
import { Layout } from '@/components/Layout/Layout';
import { useAIStore } from '@/hooks/useAIStore';

export function Settings() {
  const [localApiKey, setLocalApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  
  const { config, saveConfig, validateAPIKey, apiKeyValid, isLoading: aiLoading, loadConfig } = useAIStore();

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    if (config.apiKey) {
      setLocalApiKey(config.apiKey);
    }
  }, [config.apiKey]);

  const handleSave = async () => {
    await saveConfig({ apiKey: localApiKey });
    await validateAPIKey();
  };

  const models = [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: '高效且经济的选择' },
    { id: 'gpt-4o', name: 'GPT-4o', description: '最强大的模型' },
  ];

  return (
    <Layout title="设置" subtitle="配置你的创作助手" showActions={false}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Zap size={20} className="text-amber-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white">AI 设置</h2>
                <p className="text-sm text-slate-400">配置 OpenAI API 以启用 AI 辅助功能</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                OpenAI API Key
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={localApiKey}
                  onChange={(e) => setLocalApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50 pr-32"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showApiKey ? '隐藏' : '显示'}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {apiKeyValid === null && (
                  <span className="text-xs text-slate-500">未验证</span>
                )}
                {apiKeyValid === true && (
                  <span className="flex items-center gap-1 text-xs text-green-400">
                    <CheckCircle size={12} /> 验证通过
                  </span>
                )}
                {apiKeyValid === false && (
                  <span className="flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle size={12} /> API Key 无效
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                你可以在 <a href="https://platform.openai.com/api-keys" className="text-amber-400 hover:underline" target="_blank" rel="noopener noreferrer">OpenAI 平台</a> 获取 API Key
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">模型选择</label>
              <div className="space-y-2">
                {models.map((model) => (
                  <label
                    key={model.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      config.model === model.id
                        ? 'bg-amber-500/10 border-amber-500/50'
                        : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="model"
                      value={model.id}
                      checked={config.model === model.id}
                      onChange={(e) => saveConfig({ model: e.target.value })}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      config.model === model.id ? 'border-amber-500' : 'border-slate-500'
                    }`}>
                      {config.model === model.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">{model.name}</div>
                      <div className="text-xs text-slate-400">{model.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">温度 (Temperature)</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature}
                onChange={(e) => saveConfig({ temperature: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>精确</span>
                <span>{config.temperature.toFixed(1)}</span>
                <span>创意</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">最大令牌数 (Max Tokens)</label>
              <input
                type="number"
                value={config.maxTokens}
                onChange={(e) => saveConfig({ maxTokens: parseInt(e.target.value) || 1024 })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
              />
              <p className="text-xs text-slate-500 mt-2">
                限制单次 API 调用返回的最大令牌数。建议保持在 2048-4096 之间。
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={aiLoading}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 text-slate-900 font-medium rounded-lg transition-colors"
            >
              {aiLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {aiLoading ? '保存中...' : '保存设置'}
            </button>
          </div>
        </div>

        <div className="mt-6 bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="font-semibold text-white mb-4">关于墨灵</h3>
          <div className="text-sm text-slate-400 space-y-2">
            <p>墨灵是一款会随着创作者一同成长的 AI 小说创作辅助工具。</p>
            <p>版本: 1.0.0</p>
            <p>所有数据均存储在本地，保护您的隐私。</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}