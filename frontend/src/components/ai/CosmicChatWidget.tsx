import React, { useEffect, useRef, useState } from 'react';
import { Paperclip, Send, X, Trash2, Sparkles, FileText, Loader2, Bot } from 'lucide-react';
import { aiApi } from '../../services/api';

type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string; files?: string[] };

const welcome = `Hi! I’m Cosmos AI, the InfoNest learning assistant. Ask a question, explain a topic, or attach a file for your study session.`;

export const CosmicChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 'welcome', role: 'assistant', content: welcome }]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, busy]);

  const addFiles = (selected: FileList | null) => {
    if (!selected) return;
    setFiles(prev => [...prev, ...Array.from(selected)]);
  };

  const send = async () => {
    const text = input.trim();
    if (!text && files.length === 0) return;
    const selectedFiles = [...files];
    const names = selectedFiles.map(f => f.name);
    setMessages(prev => [...prev, { id: `u-${Date.now()}`, role: 'user', content: text || 'Please analyze these files.', files: names }]);
    setInput('');
    setFiles([]);
    setBusy(true);
    try {
      const result = await aiApi.chat(text, selectedFiles);
      const answer = result?.data?.message || 'I could not generate a response.';
      setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: 'assistant', content: answer, files: result?.data?.files || [] }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: 'assistant', content: `I couldn't reach the AI service. ${error?.response?.data?.message || error?.message || 'Please check the backend and Grok configuration.'}` }]);
    } finally {
      setBusy(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(); }
  };

  return (
    <>
      {open && (
        <div className="fixed right-4 bottom-24 sm:right-6 sm:bottom-24 z-[70] w-[min(420px,calc(100vw-2rem))] h-[min(680px,calc(100vh-7rem))] glass-panel rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-purple-950/80 to-cyan-950/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-400 p-[1px]">
                <div className="w-full h-full rounded-[15px] bg-[#0b0d14] flex items-center justify-center"><img src="/infonest-logo.png" alt="InfoNest" className="w-full h-full rounded-[15px] object-cover" /></div>
                <span className="absolute -right-1 -bottom-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0b0d14]" />
              </div>
              <div><div className="text-sm font-bold text-white">Cosmos AI</div><div className="text-[10px] font-mono text-cyan-300">InfoNest Learning Assistant</div></div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setMessages([{ id: 'welcome', role: 'assistant', content: welcome }])} className="p-2 rounded-xl hover:bg-white/10 text-slate-400" title="Clear chat"><Trash2 className="w-4 h-4" /></button>
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-white/10 text-slate-400" title="Close"><X className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-3 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-cyan-300 font-semibold"><Sparkles className="w-3.5 h-3.5" /> Ask, learn, plan</div>
              <p className="mt-1 text-slate-400">Powered by Grok. Ask questions, build roadmaps, track learning, or attach study files for AI analysis.</p>
            </div>
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] rounded-2xl px-3.5 py-3 text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-purple-600/80 text-white' : 'bg-white/5 border border-white/10 text-slate-200'}`}>
                  {m.role === 'assistant' && <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-300 mb-1"><img src="/infonest-logo.png" alt="" className="w-4 h-4 rounded-full object-cover" /> COSMOS AI</div>}
                  {m.content}
                  {m.files?.length ? <div className="mt-2 pt-2 border-t border-white/10 space-y-1">{m.files.map(name => <div key={name} className="flex items-center gap-2 text-[11px] text-cyan-200"><FileText className="w-3 h-3" />{name}</div>)}</div> : null}
                </div>
              </div>
            ))}
            {busy && <div className="flex items-center gap-2 text-xs text-cyan-300"><Loader2 className="w-4 h-4 animate-spin" /> Cosmos AI is thinking…</div>}
            <div ref={endRef} />
          </div>

          <div className="border-t border-white/10 p-3 bg-black/20">
            {files.length > 0 && <div className="mb-2 flex gap-2 overflow-x-auto">{files.map((file, i) => <div key={`${file.name}-${i}`} className="shrink-0 flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[10px] text-purple-200"><FileText className="w-3 h-3" />{file.name}<button onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}><X className="w-3 h-3" /></button></div>)}</div>}
            <div className="flex items-end gap-2 rounded-2xl bg-white/5 border border-white/10 p-2">
              <input ref={fileRef} type="file" multiple className="hidden" onChange={e => { addFiles(e.target.files); e.currentTarget.value = ''; }} />
              <button onClick={() => fileRef.current?.click()} className="shrink-0 p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10" title="Attach any file"><Paperclip className="w-5 h-5" /></button>
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey} rows={2} placeholder="Ask Cosmos AI…" className="flex-1 resize-none bg-transparent outline-none text-sm text-white placeholder-slate-500 px-1 py-1" />
              <button onClick={() => void send()} disabled={busy || (!input.trim() && files.length === 0)} className="shrink-0 p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white disabled:opacity-40"><Send className="w-4 h-4" /></button>
            </div>
            <div className="mt-1.5 text-[9px] text-slate-500 text-center">Files are sent securely through the InfoNest backend to the configured Grok service for analysis.</div>
          </div>
        </div>
      )}

      <button onClick={() => setOpen(v => !v)} aria-label="Open Cosmos AI" className="fixed right-5 bottom-5 sm:right-7 sm:bottom-7 z-[65] group">
        <span className="absolute -inset-2 rounded-full bg-purple-500/20 blur-md group-hover:bg-cyan-500/25 transition-colors" />
        <span className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-[0_0_30px_rgba(139,92,246,.35)] group-hover:scale-105 transition-transform">
          <span className="w-full h-full rounded-full bg-[#090b12] flex items-center justify-center"><img src="/infonest-logo.png" alt="Cosmos AI" className="w-full h-full rounded-full object-cover" /></span>
          <span className="absolute -right-0.5 -bottom-0.5 w-4 h-4 rounded-full bg-emerald-400 border-[3px] border-[#090b12]" />
        </span>
        <span className="absolute right-0 -top-7 whitespace-nowrap px-2 py-1 rounded-lg bg-[#111522] border border-purple-500/20 text-[10px] font-mono text-purple-200 opacity-0 group-hover:opacity-100 transition-opacity">Ask Cosmos AI</span>
      </button>
    </>
  );
};
