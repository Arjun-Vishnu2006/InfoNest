import React, { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Send, Trash2 } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { chatApi, usersApi } from '../services/api';
import { useApp } from '../context/AppContext';

type ChatUser = { _id: string; name: string; profilePicture?: string };
type Message = { _id: string; senderId: ChatUser | string; receiverId: ChatUser | string; message: string; status: 'sent' | 'delivered' | 'read' | 'deleted'; createdAt: string };
type InboxItem = { user: ChatUser; latestMessage: Message; unreadCount: number };
const idOf = (value: ChatUser | string) => typeof value === 'string' ? value : value?._id;
const demoPeople: ChatUser[] = [
  { _id:'demo_friend_rahul', name:'Rahul Sharma', profilePicture:'/infonest-logo.png' },
  { _id:'demo_friend_ananya', name:'Ananya Nair', profilePicture:'/infonest-logo.png' },
  { _id:'demo_friend_kiran', name:'Kiran Raj', profilePicture:'/infonest-logo.png' },
];
const demoThreads: Record<string, Message[]> = {
  demo_friend_rahul:[{_id:'rahul_1',senderId:'demo_friend_rahul',receiverId:'demo_user',message:'I put together a short checklist for the web security session.',status:'read',createdAt:new Date(Date.now()-86400000).toISOString()},{_id:'rahul_2',senderId:'demo_user',receiverId:'demo_friend_rahul',message:'Thanks! I’ll review it before Orbit tonight.',status:'read',createdAt:new Date(Date.now()-82800000).toISOString()},{_id:'rahul_3',senderId:'demo_friend_rahul',receiverId:'demo_user',message:'Perfect. We’ll cover session handling and common auth mistakes.',status:'delivered',createdAt:new Date(Date.now()-3600000).toISOString()}],
  demo_friend_ananya:[{_id:'ananya_1',senderId:'demo_user',receiverId:'demo_friend_ananya',message:'How did you structure the React workshop?',status:'read',createdAt:new Date(Date.now()-7200000).toISOString()},{_id:'ananya_2',senderId:'demo_friend_ananya',receiverId:'demo_user',message:'Small components, clear state boundaries, and one end-to-end exercise. I sent the notes too.',status:'delivered',createdAt:new Date(Date.now()-3000000).toISOString()}],
  demo_friend_kiran:[{_id:'kiran_1',senderId:'demo_friend_kiran',receiverId:'demo_user',message:'For the cloud workshop, bring a test account or just follow along with the diagrams.',status:'delivered',createdAt:new Date(Date.now()-172800000).toISOString()},{_id:'kiran_2',senderId:'demo_user',receiverId:'demo_friend_kiran',message:'I’ll follow along. Looking forward to the IAM examples.',status:'read',createdAt:new Date(Date.now()-169200000).toISOString()}],
};
const getDemoThread = (userId: string): Message[] => {
  try { const saved=localStorage.getItem(`infonest_demo_chat_${userId}`); if(saved) return JSON.parse(saved) as Message[]; } catch { /* use seed */ }
  return demoThreads[userId] || [];
};
const demoInbox = (): InboxItem[] => demoPeople.map(user => {
  const thread=getDemoThread(user._id);
  return { user, latestMessage:thread[thread.length-1], unreadCount:thread.filter(message=>idOf(message.receiverId)==='demo_user' && message.status!=='read').length };
});
const notifyUnreadState = (inbox: InboxItem[]) => window.dispatchEvent(new CustomEvent('infonest:message-unread-state', { detail: inbox.map(item=>({ id:item.user._id, name:item.user.name, count:item.unreadCount })) }));

export const MessagesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { currentUser } = useApp();
  const [inbox, setInbox] = useState<InboxItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<ChatUser | null>(null);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [mobileConversation, setMobileConversation] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const loadInbox = useCallback(async () => {
    try {
      const response = await chatApi.inbox();
      const conversations: InboxItem[] = response.data?.data || [];
      setInbox(conversations.length ? conversations : demoInbox());
      if (!conversations.length) notifyUnreadState(demoInbox());
    } catch { const fallback=demoInbox(); setInbox(fallback); notifyUnreadState(fallback); setError(''); }
    finally { setLoading(false); }
  }, []);

  const openConversation = useCallback(async (user: ChatUser) => {
    setSelected(user); setMobileConversation(true); setError('');
    if (user._id.startsWith('demo_friend_')) {
      const thread=getDemoThread(user._id).map(message => idOf(message.receiverId)==='demo_user' && message.status!=='read' ? {...message,status:'read' as const} : message);
      localStorage.setItem(`infonest_demo_chat_${user._id}`,JSON.stringify(thread));
      setMessages(thread); const updated=demoInbox(); setInbox(updated); notifyUnreadState(updated); setError(''); return;
    }
    try {
      const response = await chatApi.getConversation(user._id);
      const thread: Message[] = response.data?.data || [];
      setMessages(thread);
      await Promise.all(thread.filter(message => idOf(message.receiverId) === currentUser.id && message.status !== 'read').map(message => chatApi.markMessageRead(message._id).catch(() => undefined)));
      setMessages(thread.map(message => idOf(message.receiverId) === currentUser.id ? { ...message, status: 'read' } : message));
      await loadInbox();
      const inboxResponse=await chatApi.inbox();
      const conversations: InboxItem[]=inboxResponse.data?.data || [];
      notifyUnreadState(conversations);
    } catch { if (user._id.startsWith('demo_friend_')) setMessages(demoThreads[user._id]); else { setMessages([]); setError('This conversation could not be loaded.'); } }
  }, [currentUser.id, loadInbox]);

  useEffect(() => { void loadInbox(); }, [loadInbox]);
  useEffect(() => { if (!searchParams.get('userId') && !selected && demoPeople.length) { setInbox(demoInbox()); setLoading(false); } }, [searchParams, selected]);
  useEffect(() => {
    const userId = searchParams.get('userId');
    if (!userId) return;
    const demoPerson=demoPeople.find(person=>person._id===userId);
    if (demoPerson) { void openConversation(demoPerson); return; }
    let active = true;
    usersApi.byId(userId).then(response => {
      const data = response.data?.data?.user;
      if (active && data) void openConversation({ _id: data._id || data.id, name: data.name, profilePicture: data.profilePicture });
      else if (active) setError('That user could not be found.');
    }).catch(() => { if (active) setError('That user could not be found.'); });
    return () => { active = false; };
  }, [searchParams, openConversation]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!selected || !text || sending) return;
    setSending(true); setError('');
    if (selected._id.startsWith('demo_friend_')) {
      const sent: Message = { _id:`demo_msg_${Date.now()}`, senderId:'demo_user', receiverId:selected._id, message:text, status:'sent', createdAt:new Date().toISOString() };
      const next=[...messages,sent]; setMessages(next); localStorage.setItem(`infonest_demo_chat_${selected._id}`,JSON.stringify(next)); setDraft(''); const updated=demoInbox(); setInbox(updated); notifyUnreadState(updated); setSending(false); return;
    }
    try {
      const response = await chatApi.sendMessage(selected._id, text);
      const sent: Message = response.data?.data;
      setMessages(previous => [...previous, sent]); setDraft(''); await loadInbox();
    } catch { setError('Message could not be sent. Please try again.'); }
    finally { setSending(false); }
  };

  const deleteMessage = async (message: Message) => {
    if (idOf(message.senderId) !== currentUser.id && !(idOf(message.senderId) === 'demo_user' && message._id.startsWith('demo_msg_'))) return;
    if (selected?._id.startsWith('demo_friend_')) {
      const next=messages.map(item => item._id === message._id ? { ...item, status:'deleted' as const, message:'This message was deleted.' } : item);
      setMessages(next); localStorage.setItem(`infonest_demo_chat_${selected._id}`,JSON.stringify(next)); return;
    }
    try {
      await chatApi.deleteMessage(message._id);
      setMessages(previous => previous.map(item => item._id === message._id ? { ...item, status: 'deleted', message: 'This message was deleted.' } : item));
      await loadInbox();
    } catch { setError('Message could not be deleted.'); }
  };

  return <MainLayout showRightRail={false}>
    <section className="max-w-6xl mx-auto h-[calc(100vh-9rem)] min-h-[480px] rounded-3xl border border-white/10 glass-panel overflow-hidden flex text-white">
      <aside className={`${mobileConversation ? 'hidden sm:flex' : 'flex'} w-full sm:w-80 shrink-0 flex-col border-r border-white/10`}>
        <div className="p-5 border-b border-white/10"><h1 className="text-xl font-bold flex items-center gap-2"><MessageCircle className="text-purple-300" /> Messages</h1><p className="text-xs text-slate-400 mt-1">Your conversations</p></div>
        <div className="overflow-y-auto flex-1">
          {loading ? <p className="p-5 text-sm text-slate-400">Loading conversations…</p> : inbox.length ? inbox.map(item => <button key={item.user._id} onClick={() => void openConversation(item.user)} className={`w-full flex gap-3 p-4 text-left border-b border-white/5 hover:bg-white/5 ${selected?._id === item.user._id ? 'bg-purple-500/10' : ''}`}>
            <img src={item.user.profilePicture || '/infonest-logo.png'} alt="" className="w-11 h-11 rounded-full object-cover bg-white/5" />
            <span className="min-w-0 flex-1"><span className="flex justify-between gap-2"><strong className="text-sm truncate">{item.user.name}</strong>{item.unreadCount > 0 && <span className="rounded-full bg-purple-500 px-2 text-[10px]">{item.unreadCount}</span>}</span><span className="block text-xs text-slate-400 truncate mt-1">{item.latestMessage.status === 'deleted' ? 'Message deleted' : item.latestMessage.message}</span><time className="block text-[10px] text-slate-500 mt-1">{new Date(item.latestMessage.createdAt).toLocaleString()}</time></span>
          </button>) : <p className="p-5 text-sm text-slate-400">No conversations yet. Visit a profile and choose Message to start one.</p>}
        </div>
      </aside>
      <div className={`${mobileConversation ? 'flex' : 'hidden sm:flex'} min-w-0 flex-1 flex-col`}>
        {selected ? <>
          <header className="p-4 border-b border-white/10 flex items-center gap-3"><button className="sm:hidden text-slate-300" aria-label="Back to conversations" onClick={() => setMobileConversation(false)}><ArrowLeft /></button><img src={selected.profilePicture || '/infonest-logo.png'} alt="" className="w-10 h-10 rounded-full object-cover"/><div><h2 className="font-semibold">{selected.name}</h2><p className="text-xs text-slate-400">InfoNest member</p></div></header>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {messages.map(message => { const mine = idOf(message.senderId) === currentUser.id || idOf(message.senderId) === 'demo_user'; return <div key={message._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}><div className={`group max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 ${mine ? 'bg-purple-600/80 rounded-br-sm' : 'bg-white/10 rounded-bl-sm'}`}><p className="text-sm whitespace-pre-wrap break-words">{message.status === 'deleted' ? 'This message was deleted.' : message.message}</p><div className="flex items-center justify-end gap-2 mt-1"><time className="text-[10px] text-white/60">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>{mine && message.status !== 'deleted' && <button onClick={() => void deleteMessage(message)} className="text-white/60 hover:text-rose-200" aria-label="Delete message"><Trash2 size={12}/></button>}{mine && <span className="text-[10px] text-white/60">{message.status === 'read' ? 'Read' : 'Sent'}</span>}</div></div></div>; })}
            {!messages.length && <p className="text-center text-sm text-slate-400 py-8">Start the conversation with {selected.name}.</p>}<div ref={endRef}/>
          </div>
          {error && <p role="alert" className="px-4 text-sm text-rose-300">{error}</p>}
          <form onSubmit={send} className="p-3 sm:p-4 border-t border-white/10 flex gap-2"><input value={draft} onChange={event => setDraft(event.target.value)} maxLength={2000} placeholder="Write a message…" aria-label="Message" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-purple-400/50"/><button disabled={!draft.trim() || sending} aria-label="Send message" className="rounded-xl px-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50"><Send size={18}/></button></form>
        </> : <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center"><MessageCircle size={40} className="text-purple-300 mb-3"/><p>Select a conversation</p><p className="text-sm mt-1">Messages with other InfoNest members appear here.</p>{error && <p role="alert" className="text-rose-300 mt-4">{error}</p>}</div>}
      </div>
    </section>
  </MainLayout>;
};
