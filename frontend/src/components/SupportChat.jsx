import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';

const SupportChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            fetchMessages();
            subscribeToMessages();
        }
    }, [isOpen]);

    const fetchMessages = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data, error } = await supabase
            .from('support_messages')
            .select('*')
            .eq('sender_id', user.id)
            .order('created_at', { ascending: true });

        if (!error) setMessages(data);
    };

    const subscribeToMessages = () => {
        const subscription = supabase
            .channel('support_messages_realtime')
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'support_messages' 
            }, (payload) => {
                setMessages(prev => [...prev, payload.new]);
            })
            .subscribe();

        return () => supabase.removeChannel(subscription);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        setIsSending(true);

        const { data: { user } } = await supabase.auth.getUser();
        
        const { error } = await supabase
            .from('support_messages')
            .insert([{ 
                message: newMessage, 
                sender_id: user.id 
            }]);

        if (!error) {
            setNewMessage('');
        }
        setIsSending(false);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    return (
        <div className="fixed bottom-10 right-10 z-[70]">
            {!isOpen ? (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group"
                >
                    <MessageSquare size={30} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full border-2 border-white animate-pulse"></span>
                </button>
            ) : (
                <div className="w-96 h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-gray-900 p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center italic font-bold text-white tracking-widest text-xs">LF</div>
                            <div>
                                <h3 className="text-white font-black text-sm uppercase tracking-widest italic">LearnFlow Support</h3>
                                <p className="text-blue-400 text-[10px] uppercase font-black tracking-widest">We respond instantly</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
                        {messages.length === 0 ? (
                            <div className="text-center py-10 opacity-50 italic">
                                <MessageSquare className="mx-auto mb-3" size={40} />
                                <p className="text-xs font-black uppercase tracking-widest">How can we scale your academy today?</p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-medium leading-relaxed ${
                                        msg.is_admin ? 'bg-white text-gray-900 border border-gray-100 shadow-sm' : 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                    }`}>
                                        {msg.message}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white flex gap-2">
                        <input 
                            type="text" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Message support..."
                            className="flex-1 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-100 rounded-xl px-4 py-3 text-sm outline-none transition-all font-medium"
                        />
                        <button 
                            disabled={isSending || !newMessage.trim()}
                            className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-colors disabled:opacity-50"
                        >
                            {isSending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default SupportChat;
