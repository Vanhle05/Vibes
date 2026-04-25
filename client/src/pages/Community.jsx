import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, Users, Star, Crown, Zap, ShieldCheck, Heart, X, Search, Check, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PremiumBackground from '../components/PremiumBackground';
import PremiumHubBadge from '../components/PremiumHubBadge';
import './Community.css';

import api from '../api';

const Community = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [stats, setStats] = useState({ totalMembers: 0, onlineCount: 0, topUsers: [] });
  const [showMembers, setShowMembers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allPremiumUsers, setAllPremiumUsers] = useState([]);
  const [activeChat, setActiveChat] = useState({ id: 'public', name: 'Kênh trò chuyện chung' });
  const [conversations, setConversations] = useState([]);
  const [isConversationsOpen, setIsConversationsOpen] = useState(true);
  
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const isPremium = user?.isPaid || user?.role === 'admin';

  const fetchMessages = async () => {
    try {
      if (activeChat.id === 'public') {
        const res = await api.get('/community/messages');
        setMessages(res.data.map(m => ({ ...m, status: 'sent' })));
      } else {
        const res = await api.get(`/community/private/messages/${activeChat.id}`);
        // Map data to match public chat structure for rendering
        setMessages(res.data.map(m => ({
          _id: m._id,
          text: m.text,
          userName: m.sender.name,
          userRole: m.sender.role,
          createdAt: m.createdAt,
          status: m.sender._id === user._id ? m.status : 'received'
        })));
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const fetchConversations = async () => {
    if (!isPremium) return;
    try {
      const res = await api.get('/community/private/conversations');
      setConversations(res.data);
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/community/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const fetchAllPremium = async () => {
    try {
      const res = await api.get('/admin/users'); // Use admin route or new community route
      setAllPremiumUsers(res.data.filter(u => u.isPaid || u.role === 'admin'));
    } catch (err) {
      console.error('Failed to fetch premium users', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchStats();
    fetchConversations();
    if (showMembers) fetchAllPremium();

    const interval = setInterval(() => {
      fetchMessages();
      fetchStats();
      fetchConversations();
    }, 3000);
    return () => clearInterval(interval);
  }, [showMembers, activeChat.id]);

  const scrollToBottom = (force = false) => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 200;
    
    if (force || isAtBottom) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    
    const tempId = Date.now().toString();
    const newMessage = {
      _id: tempId,
      text: input,
      userName: user.name,
      userRole: user.role,
      status: 'sending',
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsSending(true);

    try {
      let res;
      if (activeChat.id === 'public') {
        res = await api.post('/community/messages', { text: input });
        setMessages(prev => prev.map(m => m._id === tempId ? { ...res.data, status: 'sent' } : m));
      } else {
        res = await api.post(`/community/private/messages/${activeChat.id}`, { text: input });
        setMessages(prev => prev.map(m => m._id === tempId ? { 
          _id: res.data._id,
          text: res.data.text,
          userName: res.data.sender.name,
          userRole: res.data.sender.role,
          createdAt: res.data.createdAt,
          status: 'sent'
        } : m));
        fetchConversations();
      }
    } catch (err) {
      setMessages(prev => prev.map(m => m._id === tempId ? { ...m, status: 'error' } : m));
    } finally {
      setIsSending(false);
    }
  };

  const startPrivateChat = (member) => {
    if (member._id === user._id) return; // Cannot chat with self
    setActiveChat({ id: member._id, name: member.name });
    setShowMembers(false);
  };

  const filteredMembers = useMemo(() => {
    return allPremiumUsers.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allPremiumUsers, searchTerm]);

  return (
    <div className="community-page">
      <PremiumBackground id={11} />
      <Navbar />

      <div className="community-container container">
        <header className="community-header">
          <div className="header-info">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                <PremiumHubBadge />
              </motion.div>
             <h1>Không gian <span className="text-gradient">Đẳng cấp</span></h1>
             <p>Nơi kết nối các cá tính độc bản trong hệ sinh thái Vibes.</p>
          </div>
          
          <div className="online-stats" onClick={() => setShowMembers(true)} style={{ cursor: 'pointer' }}>
            <div className="stat-item">
               <Users size={18} />
               <span>{stats.totalMembers || '0'} Hội viên</span>
            </div>
            <div className="stat-item">
               <Zap size={18} color="#fbbf24" />
               <span>{stats.onlineCount || '0'} Trực tuyến</span>
            </div>
          </div>
        </header>

        <main className="community-layout">
          <section className="chat-section glass-card">
            <div className="chat-header">
               <MessageSquare size={20} />
               <span>{activeChat.name}</span>
               {activeChat.id === 'public' ? (
                 <div className="live-indicator"></div>
               ) : (
                 <button className="btn-close-private-chat" onClick={() => setActiveChat({ id: 'public', name: 'Kênh trò chuyện chung' })}>
                   <X size={16} />
                 </button>
               )}
            </div>

            <div className="chat-messages" ref={chatContainerRef}>
              {messages.map((msg, index) => (
                <motion.div 
                  key={msg._id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`message-item ${msg.userName === user.name ? 'own' : ''} ${msg.userRole === 'admin' ? 'admin-aura' : ''}`}
                >
                  <div className="msg-avatar">
                    {msg.userRole === 'admin' ? <Crown size={14} fill="#fbbf24" /> : (msg.userName || '?')[0]}
                  </div>
                  <div className="msg-content">
                    <div className="msg-info">
                      <span className="msg-user">
                        {msg.userName}
                        {msg.userRole === 'admin' && <span className="admin-tag">ADMIN</span>}
                      </span>
                      <span className="msg-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="msg-text">{msg.text}</div>
                    
                    {msg.userName === user.name && (
                      <div className={`msg-status status-${msg.status}`}>
                        {msg.status === 'sending' && <span className="animate-pulse">Đang gửi...</span>}
                        {msg.status === 'sent' && <Check size={12} />}
                        {msg.status === 'seen' && <CheckCheck size={12} />}
                        {msg.status === 'error' && <X size={12} color="#ef4444" />}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form className="chat-input" onSubmit={handleSend}>
              <input 
                type="text" 
                placeholder="Chia sẻ ý tưởng của bạn..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="btn-send" disabled={isSending}>
                <Send size={18} />
              </button>
            </form>
          </section>

          <aside className="community-sidebar">
              <div className="sidebar-card glass-card">
                <h3>Bảng xếp hạng</h3>
                <div className="top-users">
                  {stats.topUsers.map((u, i) => (
                    <div key={u._id} className="top-user-item">
                      <div className="user-rank">#{i + 1}</div>
                      <div className="user-name">{u.name}</div>
                      <ShieldCheck size={14} color="#38bdf8" />
                    </div>
                  ))}
                </div>
             </div>

             {/* Danh sách Đoạn Chat Riêng */}
             {isPremium && (
               <div className="sidebar-card glass-card private-chats-card">
                 <h3 onClick={() => setIsConversationsOpen(!isConversationsOpen)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                   <span>Đoạn chat riêng</span>
                   <span style={{ fontSize: '0.8rem', color: 'var(--vibe-accent)' }}>{conversations.length}</span>
                 </h3>
                 <AnimatePresence>
                   {isConversationsOpen && (
                     <motion.div 
                       initial={{ height: 0, opacity: 0 }} 
                       animate={{ height: 'auto', opacity: 1 }} 
                       exit={{ height: 0, opacity: 0 }}
                       className="conversations-list"
                     >
                       {conversations.length === 0 ? (
                         <div className="empty-conv">Chưa có tin nhắn riêng nào. Mở danh sách hội viên để bắt đầu!</div>
                       ) : (
                         conversations.map(conv => (
                           <div 
                             key={conv._id} 
                             className={`conv-item ${activeChat.id === conv._id ? 'active' : ''}`}
                             onClick={() => startPrivateChat(conv)}
                           >
                             <div className="conv-avatar">{conv.name[0]}</div>
                             <div className="conv-info">
                               <div className="conv-name">{conv.name}</div>
                               <div className="conv-last-msg">{conv.lastMessage}</div>
                             </div>
                           </div>
                         ))
                       )}
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             )}
          </aside>
        </main>
      </div>

      {/* Members Modal */}
      <AnimatePresence>
        {showMembers && (
          <div className="modal-overlay" onClick={() => setShowMembers(false)}>
            <motion.div 
              className="members-modal"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Hội viên Premium</h2>
                <button className="btn-close-modal" onClick={() => setShowMembers(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-search">
                <div className="search-input-wrapper">
                   <Search className="search-icon" size={18} />
                   <input 
                    type="text" 
                    placeholder="Tìm kiếm hội viên..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                   />
                </div>
              </div>
              <div className="members-list">
                {filteredMembers.map(m => (
                  <div key={m._id} className="member-item" onClick={() => startPrivateChat(m)}>
                    <div className="member-avatar">
                      {m.role === 'admin' ? <Crown size={18} fill="#fbbf24" /> : m.name[0]}
                    </div>
                    <div className="member-info">
                      <div className="member-name">
                        {m.name} {m.role === 'admin' && <span className="admin-tag">ADMIN</span>}
                      </div>
                      <div className="member-role">{m.role === 'admin' ? 'Quản trị viên' : 'Premium Member'}</div>
                    </div>
                    {m._id !== user._id && <MessageSquare size={18} className="icon-msg" />}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;
