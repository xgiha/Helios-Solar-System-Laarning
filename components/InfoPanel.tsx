import React, { useState, useEffect, useRef } from 'react';
import { PlanetData, ChatMessage, QuizQuestion } from '../types';
import { generatePlanetFact, chatWithAiGuide, generatePlanetQuiz } from '../services/geminiService';
import { X, Send, Bot, Loader2, Sparkles, Navigation, GraduationCap, CheckCircle2, XCircle, BrainCircuit, Activity } from 'lucide-react';

interface InfoPanelProps {
  planet: PlanetData | null;
  onClose: () => void;
}

type Tab = 'overview' | 'chat' | 'quiz';

export const InfoPanel: React.FC<InfoPanelProps> = ({ planet, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // Data State
  const [fact, setFact] = useState<string>("");
  const [loadingFact, setLoadingFact] = useState(false);
  
  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Quiz State
  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    if (planet) {
      // Reset all states when planet changes
      setFact("");
      setChatHistory([]);
      setQuiz(null);
      setSelectedOption(null);
      setQuizResult(null);
      setActiveTab('overview');
      
      // Load Fact
      setLoadingFact(true);
      generatePlanetFact(planet.name)
        .then(text => setFact(text))
        .catch(() => setFact("Communication error."))
        .finally(() => setLoadingFact(false));
    }
  }, [planet]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !planet) return;
    const userMsg = inputMessage;
    setInputMessage("");
    setIsChatting(true);

    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);

    const response = await chatWithAiGuide(chatHistory, userMsg, planet.name);
    
    setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    setIsChatting(false);
  };

  const loadQuiz = async () => {
    if (!planet) return;
    setLoadingQuiz(true);
    setQuiz(null);
    setSelectedOption(null);
    setQuizResult(null);
    
    const q = await generatePlanetQuiz(planet.name);
    setQuiz(q);
    setLoadingQuiz(false);
  };

  const handleQuizAnswer = (index: number) => {
    if (!quiz || quizResult) return;
    setSelectedOption(index);
    if (index === quiz.correctIndex) {
        setQuizResult('correct');
    } else {
        setQuizResult('incorrect');
    }
  };

  if (!planet) return null;

  return (
    <div className="absolute top-4 right-4 w-80 md:w-[28rem] bg-black/85 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[calc(100vh-2rem)] transition-all duration-300 animate-in slide-in-from-right z-50">
      
      {/* Header */}
      <div className="relative h-28 bg-gradient-to-r from-indigo-950 to-slate-900 p-5 flex flex-col justify-end border-b border-white/10">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
        >
          <X size={20} />
        </button>
        <div className="flex justify-between items-end">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{planet.name}</h2>
                <div className="flex items-center space-x-2 text-indigo-300 text-xs mt-1 font-mono">
                    <Navigation size={12} />
                    <span>{planet.distance > 0 ? `${planet.distance} AU` : 'SYSTEM CORE'}</span>
                </div>
            </div>
            <div className="text-right">
                <span className="text-4xl font-thin text-white/10">{planet.id.substring(0,2).toUpperCase()}</span>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-white/5">
        <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors ${activeTab === 'overview' ? 'text-indigo-400 bg-white/5 border-b-2 border-indigo-400' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
        >
            <Activity size={14} />
            <span>Telemetry</span>
        </button>
        <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors ${activeTab === 'chat' ? 'text-indigo-400 bg-white/5 border-b-2 border-indigo-400' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
        >
            <Bot size={14} />
            <span>Comms</span>
        </button>
        <button 
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors ${activeTab === 'quiz' ? 'text-indigo-400 bg-white/5 border-b-2 border-indigo-400' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
        >
            <GraduationCap size={14} />
            <span>Mission</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-hidden bg-gradient-to-b from-transparent to-black/40">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
             <div className="p-5 overflow-y-auto h-full space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                {/* Key Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5 group hover:border-indigo-500/30 transition-colors">
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Orbital Period</p>
                        <p className="text-sm font-mono text-white">{planet.orbitalPeriod}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5 group hover:border-indigo-500/30 transition-colors">
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Rotation Period</p>
                        <p className="text-sm font-mono text-white">{planet.rotationPeriod}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5 group hover:border-indigo-500/30 transition-colors">
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Avg Temp</p>
                        <p className="text-sm font-mono text-white">{planet.avgTemp}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5 group hover:border-indigo-500/30 transition-colors">
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Type</p>
                        <p className="text-sm font-mono text-white capitalize">{planet.textureType}</p>
                    </div>
                </div>

                {/* AI Field Report */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-indigo-400">
                        <Sparkles size={16} />
                        <h3 className="text-xs font-bold uppercase tracking-wider">AI Analysis</h3>
                    </div>
                    <div className="bg-indigo-500/5 p-4 rounded-lg border border-indigo-500/20 min-h-[100px] relative overflow-hidden">
                        {loadingFact ? (
                            <div className="flex flex-col items-center justify-center h-20 text-indigo-300 space-y-2">
                                <Loader2 size={20} className="animate-spin" />
                                <span className="text-xs animate-pulse">Decrypting data stream...</span>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-indigo-100/90 leading-relaxed italic relative z-10">
                                    "{fact}"
                                </p>
                                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
                            </>
                        )}
                    </div>
                </div>
             </div>
        )}

        {/* CHAT TAB */}
        {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
                <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                    {chatHistory.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-3">
                            <Bot size={48} strokeWidth={1} />
                            <p className="text-sm text-center max-w-[200px]">
                                Communication link established.<br/>Ask me anything about {planet.name}.
                            </p>
                        </div>
                    )}
                    {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-br-none' 
                                : 'bg-white/10 text-indigo-100 rounded-bl-none border border-white/5'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isChatting && (
                        <div className="flex justify-start animate-pulse">
                            <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-none border border-white/5">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-black/20 border-t border-white/10">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={`Message Helios AI...`}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-5 pr-12 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isChatting}
                            className="absolute right-1.5 top-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-900/20"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* QUIZ TAB */}
        {activeTab === 'quiz' && (
            <div className="p-5 h-full overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-white/10">
                {!quiz && !loadingQuiz && (
                    <div className="flex flex-col items-center justify-center flex-grow text-center space-y-6">
                        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/20">
                            <BrainCircuit size={40} className="text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Training Mission</h3>
                            <p className="text-white/50 text-sm max-w-[240px] mx-auto">
                                Test your knowledge about {planet.name} with an AI-generated challenge.
                            </p>
                        </div>
                        <button 
                            onClick={loadQuiz}
                            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
                        >
                            <span>Start Mission</span>
                            <GraduationCap size={18} />
                        </button>
                    </div>
                )}

                {loadingQuiz && (
                    <div className="flex flex-col items-center justify-center flex-grow space-y-4">
                        <Loader2 size={32} className="text-indigo-400 animate-spin" />
                        <p className="text-sm text-white/50 animate-pulse">Generating mission parameters...</p>
                    </div>
                )}

                {quiz && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 border border-indigo-400/30 px-2 py-0.5 rounded">Question</span>
                             </div>
                             <h3 className="text-lg font-medium text-white leading-snug">
                                {quiz.question}
                             </h3>
                        </div>

                        <div className="space-y-3">
                            {quiz.options.map((option, idx) => {
                                let stateStyle = "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white/80";
                                if (quizResult) {
                                    if (idx === quiz.correctIndex) {
                                        stateStyle = "bg-emerald-500/20 border-emerald-500/50 text-emerald-200";
                                    } else if (idx === selectedOption && idx !== quiz.correctIndex) {
                                        stateStyle = "bg-red-500/20 border-red-500/50 text-red-200";
                                    } else {
                                        stateStyle = "bg-white/5 border-white/5 text-white/30 opacity-50";
                                    }
                                }

                                return (
                                    <button
                                        key={idx}
                                        disabled={!!quizResult}
                                        onClick={() => handleQuizAnswer(idx)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 relative group ${stateStyle}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">{option}</span>
                                            {quizResult && idx === quiz.correctIndex && <CheckCircle2 size={18} className="text-emerald-400" />}
                                            {quizResult && idx === selectedOption && idx !== quiz.correctIndex && <XCircle size={18} className="text-red-400" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {quizResult && (
                            <div className={`p-4 rounded-xl border ${
                                quizResult === 'correct' ? 'bg-emerald-900/20 border-emerald-500/20' : 'bg-red-900/20 border-red-500/20'
                            } animate-in fade-in slide-in-from-bottom-2`}>
                                <div className="flex items-start space-x-3">
                                    <div className={`mt-0.5 ${quizResult === 'correct' ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {quizResult === 'correct' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-bold mb-1 ${quizResult === 'correct' ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {quizResult === 'correct' ? 'Mission Success!' : 'Mission Failed'}
                                        </p>
                                        <p className="text-xs text-white/70 leading-relaxed">
                                            {quiz.explanation}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={loadQuiz}
                                    className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-colors"
                                >
                                    Next Challenge
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};
