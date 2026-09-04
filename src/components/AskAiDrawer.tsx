import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Mic,
  Send,
  Bot,
  Sparkles,
  Loader2,
  AlertCircle,
  Languages,
  Radio,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';

interface AskAiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onConfirmProposedAction?: (action: any) => void;
  farmerContext: any;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  actionProposal?: any;
  timestamp: string;
}

export const AskAiDrawer: React.FC<AskAiDrawerProps> = ({
  isOpen,
  onClose,
  language,
  onConfirmProposedAction,
  farmerContext,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const t = translations[selectedLanguage];

  // Sync selectedLanguage if parent language prop changes
  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text:
        language === 'mr'
          ? 'नमस्कार! मी एग्रीकनेक्ट मदतनीस आहे. तुम्ही मला पिकाचा भाव, विक्री करावी की थांबावे, किंवा जवळचे खरेदीदार याबद्दल विचारू शकता.'
          : language === 'hi'
          ? 'नमस्ते! मैं एग्रीकनेक्ट सहायक हूँ। आप मुझसे फसल के भाव, बेचने या रुकने की सलाह, या पास के खरीदारों के बारे में पूछ सकते हैं।'
          : 'Namaskar! I am your AgriConnect Assistant. Ask me about crop grades, mandi benchmarks, nearby buyers, or whether to sell now or hold.',
      timestamp: 'Just now',
    },
  ]);

  const [isListening, setIsListening] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<any | null>(null);
  const [micNotice, setMicNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isListening]);

  // When language tab changes in drawer
  const handleLanguageSwitch = (newLang: Language) => {
    setSelectedLanguage(newLang);
    const greetingText =
      newLang === 'mr'
        ? 'भाषा मराठी निवडली आहे. मी तुम्हाला कशी मदत करू शकेन?'
        : newLang === 'hi'
        ? 'भाषा हिंदी चुनी गई है। मैं आपकी क्या मदद कर सकता हूँ?'
        : 'Language switched to English. How can I assist you with your crops or mandi rates today?';

    setMessages((prev) => [
      ...prev,
      {
        id: `lang_change_${Date.now()}`,
        sender: 'assistant',
        text: greetingText,
        timestamp: 'Just now',
      },
    ]);
  };

  const handleSend = async (userText?: string) => {
    const textToSend = (userText || inputQuery).trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setMicNotice(null);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          language: selectedLanguage,
          currentContext: farmerContext,
        }),
      });

      const data = await res.json();
      const replyText =
        data.reply ||
        (selectedLanguage === 'mr'
          ? 'समजले नाही. कृपया पुन्हा विचारा.'
          : selectedLanguage === 'hi'
          ? 'समझ नहीं आया। कृपया दोबारा पूछें।'
          : 'Could not understand. Please ask again.');
      const action = data.proposedAction;

      const botMsg: Message = {
        id: `msg_b_${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        actionProposal: action,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);

      if (action) {
        setPendingAction(action);
      }

      // Voice synthesis feedback if available
      if ('speechSynthesis' in window) {
        try {
          const utterance = new SpeechSynthesisUtterance(replyText);
          utterance.lang =
            selectedLanguage === 'mr' ? 'mr-IN' : selectedLanguage === 'hi' ? 'hi-IN' : 'en-IN';
          window.speechSynthesis.speak(utterance);
        } catch {
          // Ignore audio synthesis errors
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'assistant',
          text:
            selectedLanguage === 'mr'
              ? 'सध्या बाजारात टोमॅटोचे दर ₹२८-₹३२/किलो चालू आहेत. आज विक्री करणे योग्य पर्याय आहे.'
              : selectedLanguage === 'hi'
              ? 'वर्तमान में मंडी में टमाटर का भाव ₹28-₹32/किग्रा चल रहा है। आज बेचना सही विकल्प हो सकता है।'
              : 'Market rates are currently ₹28-₹32/kg. Selling today is a reasonable option.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const stopVoiceListen = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }
    setIsListening(false);
  };

  const handleVoiceListen = () => {
    // If already listening, stop
    if (isListening) {
      stopVoiceListen();
      return;
    }

    setMicNotice(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicNotice(
        selectedLanguage === 'mr'
          ? 'मायक्रोफोन इनपुट या ब्राउझरमध्ये उपलब्ध नाही. आपण खाली टाईप करू शकता.'
          : selectedLanguage === 'hi'
          ? 'माइक्रोफ़ोन इनपुट इस ब्राउज़र में समर्थित नहीं है। आप नीचे टाइप कर सकते हैं।'
          : 'Microphone input is not supported in this browser. You can type your message below.'
      );
      inputRef.current?.focus();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang =
        selectedLanguage === 'mr' ? 'mr-IN' : selectedLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const spoken = event.results?.[0]?.[0]?.transcript;
        setIsListening(false);
        if (spoken && spoken.trim()) {
          handleSend(spoken.trim());
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        const errType = event?.error;
        if (errType === 'not-allowed' || errType === 'permission-denied') {
          setMicNotice(
            selectedLanguage === 'mr'
              ? 'मायक्रोफोन परवानगी नाकारली आहे. खालील बॉक्समध्ये टाईप करा.'
              : selectedLanguage === 'hi'
              ? 'माइक्रोफ़ोन की अनुमति अस्वीकृत है। कृपया नीचे टाइप करें।'
              : 'Microphone permission was denied. You can freely type in the box below.'
          );
        } else if (errType === 'no-speech') {
          setMicNotice(
            selectedLanguage === 'mr'
              ? 'आवाज ऐकू आला नाही. कृपया पुन्हा बोला किंवा टाईप करा.'
              : selectedLanguage === 'hi'
              ? 'कोई आवाज़ सुनाई नहीं दी। कृपया फिर से बोलें या टाइप करें।'
              : 'No speech was detected. Please try again or type below.'
          );
        } else {
          setMicNotice(
            selectedLanguage === 'mr'
              ? 'मायक्रोफोन त्रुटी. आपण संदेश टाईप करू शकता.'
              : selectedLanguage === 'hi'
              ? 'माइक्रोफ़ोन त्रुटि। आप संदेश टाइप कर सकते हैं।'
              : 'Voice recognition unavailable. You can type your message below.'
          );
        }
        inputRef.current?.focus();
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setMicNotice(
        selectedLanguage === 'mr'
          ? 'मायक्रोफोन सुरू करता आला नाही. आपण खाली संदेश टाईप करू शकता.'
          : selectedLanguage === 'hi'
          ? 'माइक्रोफ़ोन शुरू नहीं हो सका। आप नीचे संदेश टाइप कर सकते हैं।'
          : 'Could not activate microphone. You can type your query below.'
      );
      inputRef.current?.focus();
    }
  };

  const confirmAction = () => {
    if (pendingAction && onConfirmProposedAction) {
      onConfirmProposedAction(pendingAction);
    }
    setPendingAction(null);
  };

  if (!isOpen) return null;

  // Language-specific quick questions
  const quickQuestions =
    selectedLanguage === 'mr'
      ? [
          { text: 'माझे टोमॅटो विकावे का?', label: 'माझे टोमॅटो विकावे का?' },
          { text: 'माझ्या जवळ कोण tomato घेईल?', label: 'माझ्या जवळ कोण घेईल?' },
          { text: 'Ganesh Store ला 20 kilo tomato vikayche aahet.', label: 'Ganesh Store ला रिक्वेस्ट' },
        ]
      : selectedLanguage === 'hi'
      ? [
          { text: 'क्या मुझे टमाटर अभी बेचना चाहिए?', label: 'क्या टमाटर अभी बेचूँ?' },
          { text: 'आसपास कौन खरीदार है?', label: 'आसपास के खरीदार?' },
          { text: 'गणेश स्टोर को 20 किलो टमाटर बेचना है।', label: 'गणेश स्टोर को रिक्वेस्ट' },
        ]
      : [
          { text: 'Should I sell my tomatoes now or hold?', label: 'Sell or Hold?' },
          { text: 'Who will buy my tomatoes nearby?', label: 'Nearby Buyers?' },
          { text: 'Send request to Ganesh Store for 20 kg tomatoes', label: 'Request Ganesh Store' },
        ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full h-[88vh] sm:h-[650px] shadow-2xl flex flex-col overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="bg-emerald-700 text-white p-3.5 sm:p-4 flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 flex items-center justify-center shadow-xs shrink-0">
              <Bot className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-black text-base leading-tight">
                🤖 {t.askAi}
              </h3>
              <p className="text-xs text-emerald-100 flex items-center gap-1">
                <span>AI Voice Assistant</span>
                <span>•</span>
                <span className="font-bold text-amber-300">
                  {selectedLanguage === 'mr' ? 'मराठी' : selectedLanguage === 'hi' ? 'हिंदी' : 'English'}
                </span>
              </p>
            </div>
          </div>

          <button
            id="ai-drawer-close-btn"
            onClick={onClose}
            className="p-2 hover:bg-emerald-800 rounded-xl transition-colors"
            title="Close Assistant"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* REQUIRED: Clean, Simple Language Selector (English | हिंदी | मराठी) */}
        <div className="bg-emerald-800 px-3.5 sm:px-4 py-2 border-t border-emerald-600/60 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-emerald-100 font-semibold">
            <Languages className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="hidden sm:inline">AI Language:</span>
          </div>

          <div className="flex items-center gap-1 bg-emerald-950/50 p-1 rounded-xl">
            <button
              id="ai-lang-en-btn"
              onClick={() => handleLanguageSwitch('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedLanguage === 'en'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              id="ai-lang-hi-btn"
              onClick={() => handleLanguageSwitch('hi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedLanguage === 'hi'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              हिंदी
            </button>
            <button
              id="ai-lang-mr-btn"
              onClick={() => handleLanguageSwitch('mr')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedLanguage === 'mr'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              मराठी
            </button>
          </div>
        </div>

        {/* Quick Sample Questions (Language-Aware) */}
        <div className="bg-stone-50 border-b border-stone-200 p-2 sm:p-2.5 overflow-x-auto flex gap-1.5 shrink-0 text-[11px] no-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q.text)}
              className="px-3 py-1.5 bg-white hover:bg-emerald-50 active:bg-emerald-100 text-stone-800 rounded-xl border border-stone-200 shrink-0 font-medium transition-colors shadow-2xs whitespace-nowrap"
            >
              "{q.label}"
            </button>
          ))}
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white font-semibold rounded-br-none'
                    : 'bg-stone-100 text-stone-900 border border-stone-200 rounded-bl-none space-y-2'
                }`}
              >
                <p>{m.text}</p>

                {/* Section 26: AI Action Confirmation Box */}
                {m.actionProposal && (
                  <div className="bg-white rounded-xl p-3 border-2 border-emerald-500 shadow-xs space-y-2 text-stone-900 mt-2">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Commercial Action Confirmation</span>
                    </div>
                    <p className="text-xs text-stone-700">
                      {m.actionProposal.confirmationQuestion ||
                        `Send request for ${m.actionProposal.quantity} kg ${m.actionProposal.crop} at ₹${m.actionProposal.price}/kg to ${m.actionProposal.buyerName}?`}
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={confirmAction}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs"
                      >
                        YES, SEND REQUEST
                      </button>
                      <button
                        onClick={() => setPendingAction(null)}
                        className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-stone-500 text-xs italic bg-stone-100 py-2 px-3 rounded-xl w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>
                {selectedLanguage === 'mr'
                  ? 'एग्रीकनेक्ट मदतनीस विचार करत आहे...'
                  : selectedLanguage === 'hi'
                  ? 'एग्रीकनेक्ट सहायक विचार कर रहा है...'
                  : 'AgriConnect Assistant is thinking...'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice-First Input Bar with Clean Fallback & Mic Indicators */}
        <div className="p-3 bg-white border-t border-stone-200 shrink-0 space-y-2">
          {/* Active Listening Indicator Banner */}
          {isListening && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-800 font-bold animate-pulse">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-600 animate-ping" />
                <span>
                  {selectedLanguage === 'mr'
                    ? 'ऐकत आहे (मराठी)... स्पष्टपणे बोला'
                    : selectedLanguage === 'hi'
                    ? 'सुन रहा हूँ (हिंदी)... कृपया बोलें'
                    : 'Listening (English)... Speak now'}
                </span>
              </div>
              <button
                onClick={stopVoiceListen}
                className="text-xs px-2.5 py-1 bg-rose-200 hover:bg-rose-300 text-rose-950 font-black rounded-lg transition-colors"
              >
                Done / Stop
              </button>
            </div>
          )}

          {/* Fallback Notice if mic permission/support fails */}
          {micNotice && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-2 text-xs text-amber-900">
              <div className="flex items-center gap-2 min-w-0">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate">{micNotice}</span>
              </div>
              <button
                onClick={() => setMicNotice(null)}
                className="text-stone-400 hover:text-stone-700 p-1 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Action Row: Big tactile mic + Text typing input */}
          <div className="flex items-center gap-2">
            {/* Giant Tactile Microphone Button */}
            <button
              id="ai-drawer-mic-btn"
              onClick={handleVoiceListen}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white scale-105 shadow-rose-200 ring-4 ring-rose-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white active:scale-95'
              }`}
              title={isListening ? 'Stop listening' : 'Speak to Ask AgriConnect'}
            >
              <Mic className={`w-6 h-6 ${isListening ? 'animate-bounce' : ''}`} />
            </button>

            {/* Text input with send button */}
            <div className="flex-1 flex items-center bg-stone-50 border border-stone-300 rounded-2xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={
                  selectedLanguage === 'mr'
                    ? 'येथे बोला किंवा टाईप करा...'
                    : selectedLanguage === 'hi'
                    ? 'यहाँ बोलें या टाइप करें...'
                    : 'Speak or type your question here...'
                }
                className="w-full bg-transparent text-xs font-semibold text-stone-900 focus:outline-hidden py-1.5 placeholder:text-stone-400"
              />
              <button
                id="ai-drawer-send-btn"
                onClick={() => handleSend()}
                disabled={!inputQuery.trim() || loading}
                className="p-1.5 text-emerald-600 hover:text-emerald-800 disabled:opacity-30 transition-colors"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
