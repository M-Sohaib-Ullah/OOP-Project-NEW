import React, { useState } from 'react';
import { Brain, Plus, ChevronRight, ChevronLeft, RefreshCw, Loader2 } from 'lucide-react';
import { FlashcardDeck, Flashcard } from '../types';
import { generateFlashcards } from '../services/geminiService';

interface FlashcardsProps {
  decks: FlashcardDeck[];
  onAddDeck: (deck: FlashcardDeck) => void;
}

export const Flashcards: React.FC<FlashcardsProps> = ({ decks, onAddDeck }) => {
  const [activeDeck, setActiveDeck] = useState<FlashcardDeck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [topicInput, setTopicInput] = useState('');

  const handleGenerate = async () => {
    if (!topicInput.trim()) return;
    setIsGenerating(true);
    try {
      const cards = await generateFlashcards(topicInput);
      const newDeck: FlashcardDeck = {
        id: Date.now().toString(),
        title: `${topicInput} Revision`,
        subjectName: 'Generated',
        cards,
        createdAt: Date.now()
      };
      onAddDeck(newDeck);
      setTopicInput('');
    } catch (error) {
      console.error("Failed to generate flashcards", error);
      alert("Failed to generate flashcards. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const nextCard = () => {
    if (activeDeck && currentCardIndex < activeDeck.cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentCardIndex(prev => prev + 1), 150);
    }
  };

  const prevCard = () => {
    if (activeDeck && currentCardIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentCardIndex(prev => prev - 1), 150);
    }
  };

  if (activeDeck) {
    const card = activeDeck.cards[currentCardIndex];
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => { setActiveDeck(null); setCurrentCardIndex(0); setIsFlipped(false); }}
            className="text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center space-x-2"
          >
            <ChevronLeft size={20} />
            <span>Back to Decks</span>
          </button>
          <span className="text-sm font-medium text-slate-500">
            Card {currentCardIndex + 1} of {activeDeck.cards.length}
          </span>
        </div>

        <div className="relative h-96 w-full perspective-1000">
          <div 
            className={`w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-lg flex flex-col items-center justify-center p-8 text-center">
              <span className="absolute top-6 left-6 text-xs font-bold uppercase tracking-wider text-emerald-500">Question</span>
              <h3 className="text-2xl font-medium text-slate-900 dark:text-white">{card.front}</h3>
              <p className="absolute bottom-6 text-sm text-slate-400">Click to flip</p>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-3xl shadow-lg flex flex-col items-center justify-center p-8 text-center">
              <span className="absolute top-6 left-6 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Answer</span>
              <h3 className="text-xl font-medium text-slate-900 dark:text-white">{card.back}</h3>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-6">
          <button 
            onClick={prevCard}
            disabled={currentCardIndex === 0}
            className="p-4 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextCard}
            disabled={currentCardIndex === activeDeck.cards.length - 1}
            className="p-4 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Brain className="text-emerald-500" /> AI Flashcards
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Generate smart flashcards from any topic instantly.</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="text"
            placeholder="e.g. Photosynthesis, Kinematics..."
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none w-64"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !topicInput.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors flex items-center space-x-2 disabled:opacity-70"
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            <span>Generate</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map(deck => (
          <div 
            key={deck.id}
            onClick={() => setActiveDeck(deck)}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                <RefreshCw size={24} />
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                {deck.cards.length} Cards
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-500 transition-colors">{deck.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(deck.createdAt).toLocaleDateString()}</p>
          </div>
        ))}

        {decks.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-3xl">
            <Brain size={48} className="text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Flashcards Yet</h3>
            <p className="text-slate-500 max-w-sm">Enter a topic above and let the AI generate a smart revision deck for you.</p>
          </div>
        )}
      </div>
    </div>
  );
};
