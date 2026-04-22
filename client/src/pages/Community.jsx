import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, Users, Star, Crown, Zap, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './Community.css';

import api from '../api';

const Community = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef(null);

  // Fetch messages from DB
  const fetchMessages = async () => {
    try {
      const res = await api.get('/community/messages');
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Real-time polling: Refresh messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    
    setIsSending(true);
    try {
      const res = await api.post('/community/messages', { text: input });
      setMessages(prev => [...prev, res.data]);
      setInput('');
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="community-page">
      <div className="premium-bg-animation">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      
      <Navbar />

      <div className="community-container container">
        <header className="community-header">
          <div className="header-info">
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               className="community-badge"
             >
               <Crown size={16} /> Vibes Premium Hub
             </motion.div>
             <h1>Không gian <span className="text-gradient">Đẳng cấp</span></h1>
             <p>Nơi kết nối các cá tính độc bản trong hệ sinh thái Vibes.</p>
          </div>
          
          <div className="online-stats">
            <div className="stat-item">
               <Users size={18} />
               <span>1.2k Hội viên</span>
            </div>
            <div className="stat-item">
               <Zap size={18} color="var(--vibe-accent)" />
               <span>42 Đang trực tuyến</span>
            </div>
          </div>
        </header>

        <main className="community-layout">
          {/* Chat Section */}
          <section className="chat-section glass-card">
            <div className="chat-header">
               <MessageSquare size={20} />
               <span>Kênh trò chuyện chung</span>
               <div className="live-indicator"></div>
            </div>
            
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <motion.div 
                  key={msg._id || index} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`message-item ${msg.userName === user.name ? 'own' : ''}`}
                >
                  <div className="msg-avatar">
                    {(msg.userName || '?')[0]}
                    {msg.isVibes && <div className="vibes-verify"><ShieldCheck size={10} /></div>}
                  </div>
                  <div className="msg-content">
                    <div className="msg-info">
                      <span className="msg-user">{msg.userName}</span>
                      <span className="msg-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="msg-text">{msg.text}</div>
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
              <button type="submit" className="btn-send">
                <Send size={18} />
              </button>
            </form>
          </section>

          {/* Sidebar / Leaderboard */}
          <aside className="community-sidebar">
             <div className="sidebar-card glass-card">
                <h3>Thành viên nổi bật</h3>
                <div className="top-users">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="top-user-item">
                      <div className="user-rank">#{i}</div>
                      <div className="user-name">Premium Member {i}</div>
                      <Heart size={14} color="#f43f5e" />
                    </div>
                  ))}
                </div>
             </div>

             <div className="sidebar-card glass-card highlight-card">
                <Crown size={24} className="icon-crown" />
                <h3>Quyền lợi Vibes</h3>
                <ul>
                  <li>Mở khóa 100+ Template</li>
                  <li>Tùy chỉnh DNA Logo</li>
                  <li>Cộng đồng cao cấp</li>
                  <li>Hỗ trợ ưu tiên</li>
                </ul>
             </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default Community;
