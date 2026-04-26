import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Trash2, GraduationCap, Sparkles, ArrowRight, Lightbulb, MessageSquare, Plus, Paperclip, X } from 'lucide-react';
import { Message } from '../types';
import { createTutorSession, sendMessageStream } from '../services/geminiService';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Spinner } from './Spinner';
import { Chat } from '@google/genai';
import { SUBJECTS } from '../services/mockData';

export const TutorInterface: React.FC = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startNewSession = (subjectId: string) => {
    const subject = SUBJECTS.find(s => s.id === subjectId);
    const subjectName = subject ? `${subject.name} (${subject.level})` : 'O and A Levels';
    
    chatSessionRef.current = createTutorSession(subjectName);
    
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      content: `Hello! I'm your CAIE AI Tutor${subjectId !== 'all' ? ` for ${subjectName}` : ''}. I can help you with Past Papers, Marking Schemes, and difficult concepts. You can even show me a question!`,
      timestamp: Date.now(),
    }]);
  };

  useEffect(() => {
    startNewSession('all');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newId = e.target.value;
      setSelectedSubjectId(newId);
      startNewSession(newId);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, selectedImage]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setSelectedImage(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSendMessage = async (text: string = inputValue) => {
    if ((!text.trim() && !selectedImage) || !chatSessionRef.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      image: selectedImage || undefined,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    const imageToSend = selectedImage; // Capture current state before clearing
    setSelectedImage(null);
    setIsTyping(true);

    const modelMessageId = (Date.now() + 1).toString();
    setMessages(prev => [
      ...prev,
      { id: modelMessageId, role: 'model', content: '', timestamp: Date.now(), isLoading: true }
    ]);

    try {
      let accumulatedText = "";
      
      await sendMessageStream(chatSessionRef.current, userMessage.content, imageToSend, (chunk) => {
        accumulatedText += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === modelMessageId 
            ? { ...msg, content: accumulatedText, isLoading: false } 
            : msg
        ));
      });
      
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), role: 'model', content: "Sorry, I encountered an error connecting to the AI Tutor. Please check your internet or API key.", timestamp: Date.now() }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    startNewSession(selectedSubjectId);
    setSelectedImage(null);
  };

  const getSuggestions = (subjectId: string) => {
    const subject = SUBJECTS.find(s => s.id === subjectId);
    
    if (!subject) return [
        { icon: Lightbulb, text: "How do I calculate grade thresholds?", label: "Grading" },
        { icon: GraduationCap, text: "Tips for managing exam time?", label: "Strategy" },
        { icon: MessageSquare, text: "Explain the difference between A Level and AS Level.", label: "General" },
        { icon: Sparkles, text: "How do I prepare for O Levels?", label: "Preparation" }
    ];

    if (subject.slug === 'physics') return [
        { icon: Lightbulb, text: "Explain Projectile Motion with examples.", label: "Mechanics" },
        { icon: GraduationCap, text: "Tips for Physics practical exams (Paper 3).", label: "Practical" },
        { icon: MessageSquare, text: "What is the difference between potential and kinetic energy?", label: "Energy" },
        { icon: Sparkles, text: "Solve a tricky circuit problem.", label: "Electricity" }
    ];

    if (subject.slug === 'chemistry') return [
        { icon: Lightbulb, text: "Explain Hybridization in organic chemistry.", label: "Organic" },
        { icon: GraduationCap, text: "How to balance redox equations?", label: "Physical" },
        { icon: MessageSquare, text: "Trends in the Periodic Table.", label: "Inorganic" },
        { icon: Sparkles, text: "Explain the Haber Process.", label: "Industrial" }
    ];

    if (subject.slug.includes('math')) return [
        { icon: Lightbulb, text: "Explain Integration by Parts.", label: "Calculus" },
        { icon: GraduationCap, text: "How to solve differential equations?", label: "Pure Math" },
        { icon: MessageSquare, text: "Explain Normal Distribution statistics.", label: "Stats" },
        { icon: Sparkles, text: "Trigonometric identities cheat sheet.", label: "Trig" }
    ];

     if (subject.slug === 'computer-science') return [
        { icon: Lightbulb, text: "Explain the Fetch-Decode-Execute cycle.", label: "Architecture" },
        { icon: GraduationCap, text: "Difference between TCP and UDP?", label: "Networking" },
        { icon: MessageSquare, text: "How to convert Binary to Hexadecimal?", label: "Data Rep" },
        { icon: Sparkles, text: "Explain Object Oriented Programming concepts.", label: "OOP" }
    ];

    return [
        { icon: Lightbulb, text: `What are the hardest topics in ${subject.name}?`, label: "Overview" },
        { icon: GraduationCap, text: `Explain a complex concept in ${subject.name}.`, label: "Concepts" },
        { icon: MessageSquare, text: `Give me a practice question for ${subject.code}.`, label: "Practice" },
        { icon: Sparkles, text: `How to score an A* in ${subject.name}?`, label: "Tips" }
    ];
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-xl dark:shadow-2xl relative">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20">
                <Bot size={24} className="text-white" />
            </div>
            <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                    AI Tutor
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                        Beta
                    </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Powered by Gemini 3 Flash</p>
            </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
             <div className="relative flex-1 sm:flex-none group">
                 <select 
                    value={selectedSubjectId}
                    onChange={handleSubjectChange}
                    className="w-full sm:w-48 appearance-none bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl pl-3 pr-8 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all hover:bg-white dark:hover:bg-slate-700 cursor-pointer"
                 >
                    <option value="all">General Tutor</option>
                    {SUBJECTS.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.level})</option>
                    ))}
                 </select>
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                     <ArrowRight size={14} className="rotate-90" />
                 </div>
             </div>

            <button 
                onClick={clearChat}
                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                title="Clear Chat"
            >
                <Trash2 size={18} />
            </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar scroll-smooth">
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300 gap-3`}
          >
            {/* Bot Avatar */}
            {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center flex-shrink-0 mt-2">
                    <Bot size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
            )}

            <div
              className={`max-w-[85%] md:max-w-[75%] px-5 py-4 shadow-sm relative group ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl rounded-tr-none'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-2xl rounded-tl-none shadow-md dark:shadow-none'
              }`}
            >
              {msg.image && (
                  <div className="mb-3 rounded-lg overflow-hidden max-w-full">
                      <img src={msg.image} alt="User upload" className="max-w-full h-auto max-h-60 object-contain rounded-lg border border-white/20" />
                  </div>
              )}
              {msg.isLoading && !msg.content ? (
                 <div className="py-1">
                    <Spinner />
                 </div>
              ) : (
                <MarkdownRenderer content={msg.content} />
              )}
            </div>

            {/* User Avatar */}
            {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 mt-2">
                    <User size={16} className="text-slate-600 dark:text-slate-400" />
                </div>
            )}
          </div>
        ))}
        
        {/* Suggestion Chips */}
        {messages.length <= 1 && !isTyping && (
            <div className="mt-8 px-4 animate-in fade-in slide-in-from-bottom-4 delay-200">
                <div className="flex items-center gap-2 mb-4 text-slate-400 dark:text-slate-500">
                    <Sparkles size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider">Suggested Questions</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getSuggestions(selectedSubjectId).map((suggestion, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSendMessage(suggestion.text)}
                            className="flex items-start p-3 text-left bg-white dark:bg-slate-800/40 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-900/50 rounded-xl transition-all duration-200 group shadow-sm hover:shadow-md"
                        >
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                                <suggestion.icon size={16} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-0.5 uppercase tracking-wide">
                                        {suggestion.label}
                                    </span>
                                    <Plus size={12} className="text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors" />
                                </div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors line-clamp-2">
                                    {suggestion.text}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {isTyping && messages[messages.length - 1]?.role === 'user' && (
             <div className="flex justify-start animate-in fade-in gap-3 px-1">
                 <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center flex-shrink-0 mt-2">
                    <Bot size={16} className="text-emerald-600 dark:text-emerald-400" />
                 </div>
                 <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-none border border-gray-200 dark:border-slate-700 shadow-sm flex items-center">
                     <Spinner />
                 </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-20 p-4 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto">
            {/* Image Preview */}
            {selectedImage && (
                <div className="mb-3 relative inline-block animate-in fade-in slide-in-from-bottom-2">
                    <img src={selectedImage} alt="Preview" className="h-20 w-auto rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm" />
                    <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute -top-2 -right-2 p-1 bg-white dark:bg-slate-800 rounded-full shadow-md border border-gray-200 dark:border-slate-700 text-slate-500 hover:text-red-500 transition-colors"
                    >
                        <X size={12} />
                    </button>
                </div>
            )}

            <div className="relative flex items-end gap-2">
            <div className="relative flex-1 bg-gray-100 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:border-emerald-500 transition-all shadow-inner">
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about a past paper, marking scheme, or concept..."
                    className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 rounded-2xl py-3.5 pl-4 pr-24 resize-none h-[54px] max-h-[150px] focus:outline-none custom-scrollbar"
                    style={{ minHeight: '54px' }}
                />
                
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageSelect} 
                        accept="image/*" 
                        className="hidden" 
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-2 rounded-xl transition-all ${selectedImage ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                        title="Upload Image"
                    >
                        <Paperclip size={18} />
                    </button>
                    <button
                        onClick={() => handleSendMessage()}
                        disabled={(!inputValue.trim() && !selectedImage) || isTyping}
                        className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 flex items-center justify-center"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
            </div>
        </div>
        <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-2">
            AI can make mistakes. Double check important information with official CAIE resources.
        </p>
      </div>
    </div>
  );
};