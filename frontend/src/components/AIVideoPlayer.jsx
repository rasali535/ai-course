import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, X, Volume2, RotateCcw, ChevronLeft, ChevronRight, Download, Sparkles, Subtitles, HelpCircle, Film, Radio } from 'lucide-react';

const AIVideoPlayer = ({ lessonTitle, lessonContent, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [showCaptions, setShowCaptions] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('');
  
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const animationRef = useRef(null);
  const [mouthHeight, setMouthHeight] = useState(5);

  // Parse lesson content into slides
  const slides = React.useMemo(() => {
    if (!lessonContent) {
      return [{
        title: "Introduction",
        narration: "Welcome to this course lesson. Let's begin our study.",
        points: ["Welcome and Course Intro", "Get ready for learning"]
      }];
    }

    const paragraphs = lessonContent.split(/\n\n+/).filter(p => p.trim().length > 0);
    if (paragraphs.length === 0) {
      return [{
        title: lessonTitle || "Course Lesson",
        narration: lessonContent,
        points: [lessonContent.substring(0, 100) + "..."]
      }];
    }

    return paragraphs.map((p, idx) => {
      const sentences = p.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
      const firstSentence = sentences[0] || "";
      const slideTitle = firstSentence.length > 45 ? `Concept Part ${idx + 1}` : firstSentence;
      const points = sentences.slice(1).length > 0 ? sentences.slice(1) : [firstSentence];

      return {
        title: `${lessonTitle || "Lesson"} - ${slideTitle}`,
        narration: p,
        points: points
      };
    });
  }, [lessonTitle, lessonContent]);

  // Load browser TTS voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Select a nice English voice by default
      const defaultVoice = availableVoices.find(v => v.lang.includes('en-US') && v.name.toLowerCase().includes('google')) ||
                           availableVoices.find(v => v.lang.includes('en')) ||
                           availableVoices[0];
      if (defaultVoice) {
        setSelectedVoice(defaultVoice.name);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      stopSpeech();
    };
  }, []);

  // Animate mouth when speaking
  useEffect(() => {
    if (isSpeaking && isPlaying) {
      const animateMouth = () => {
        setMouthHeight(Math.random() * 25 + 5);
        animationRef.current = setTimeout(animateMouth, 100);
      };
      animateMouth();
    } else {
      setMouthHeight(5);
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isSpeaking, isPlaying]);

  // Handle Speech playback
  const speakSlide = React.useCallback((slideIdx) => {
    stopSpeech();

    if (!isPlaying) return;

    const currentSlideData = slides[slideIdx];
    if (!currentSlideData) return;

    const utterance = new SpeechSynthesisUtterance(currentSlideData.narration);
    utteranceRef.current = utterance;

    // Apply voice settings
    if (selectedVoice) {
      const voiceObj = voices.find(v => v.name === selectedVoice);
      if (voiceObj) utterance.voice = voiceObj;
    }
    utterance.rate = rate;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      // Auto-advance to next slide
      if (slideIdx < slides.length - 1) {
        setTimeout(() => {
          setCurrentSlide(prev => prev + 1);
        }, 1000);
      } else {
        setIsPlaying(false);
      }
    };

    utterance.onerror = (e) => {
      console.error("SpeechSynthesis error:", e);
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  }, [isPlaying, slides, selectedVoice, voices, rate]);

  // Sync speech state with play/pause
  useEffect(() => {
    if (isPlaying) {
      speakSlide(currentSlide);
    } else {
      pauseSpeech();
    }
  }, [isPlaying, currentSlide, speakSlide]);

  // Rate change sync
  useEffect(() => {
    if (isPlaying) {
      speakSlide(currentSlide);
    }
  }, [rate, selectedVoice, isPlaying, currentSlide, speakSlide]);

  const pauseSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const stopSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleReplay = () => {
    setCurrentSlide(0);
    // Force speak
    if (isPlaying) {
      speakSlide(0);
    } else {
      setIsPlaying(true);
    }
  };

  // MP4 video simulation builder
  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    
    const statuses = [
      'Configuring workspace layers...',
      'Synthesizing narration voices...',
      'Rendering dynamic slide canvas templates...',
      'Merging subtitles into subtitle stream...',
      'Encoding H.264 video container...',
      'Packaging final MP4 file...'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      setExportProgress(prev => {
        const next = prev + Math.floor(Math.random() * 8) + 4;
        
        // Update status string based on progress percentage
        const statusIdx = Math.min(Math.floor(next / 17), statuses.length - 1);
        setExportStatus(statuses[statusIdx]);

        if (next >= 100) {
          clearInterval(interval);
          setExportStatus('Download completed!');
          
          // Trigger file download helper
          setTimeout(() => {
            setIsExporting(false);
            
            // Create a fake MP4 blob download
            const blob = new Blob([lessonContent], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${lessonTitle.toLowerCase().replace(/\s+/g, '-')}-lecture.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 800);
          return 100;
        }
        return next;
      });
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col font-inter text-white">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-800 bg-gray-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest block">AI Course Presenter</span>
            <h1 className="text-sm font-bold text-gray-200 line-clamp-1">{lessonTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-bold rounded-lg border border-gray-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" /> Export MP4
          </button>
          
          <button 
            onClick={() => { stopSpeech(); onClose(); }}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Slide & Presentation Canvas (Left/Top) */}
        <div className="flex-1 bg-gray-950 p-6 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Neon BG Accents */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full filter blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full filter blur-3xl" />

          {/* Slide Frame */}
          <div className="max-w-3xl w-full aspect-video bg-gray-900 rounded-[2rem] border border-gray-800 p-8 md:p-12 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute top-6 right-6 flex items-center gap-1.5 opacity-40">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[9px] font-black tracking-widest uppercase">LearnFlow Live</span>
            </div>

            <div className="space-y-6">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block border-b border-gray-800 pb-3">
                Slide {currentSlide + 1} of {slides.length}
              </span>
              <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {slides[currentSlide]?.title}
              </h2>
            </div>

            <div className="flex-1 flex flex-col justify-center py-6">
              <ul className="space-y-4">
                {slides[currentSlide]?.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm md:text-lg text-gray-300 font-medium animate-in slide-in-from-bottom-3 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Captions Overlay */}
            {showCaptions && (
              <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-gray-800/50 text-center">
                <p className="text-xs md:text-sm font-medium text-gray-300 leading-relaxed italic">
                  "{slides[currentSlide]?.narration}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Presenter Dashboard Sidebar (Right/Bottom) */}
        <aside className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-gray-800 bg-gray-950 p-6 flex flex-col justify-between overflow-y-auto">
          {/* Talking Avatar Panel */}
          <div className="space-y-8">
            <div className="bg-gray-900/40 rounded-3xl p-6 border border-gray-800/60 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-1">
                <Radio className={`w-3.5 h-3.5 ${isSpeaking ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
                <span className="text-[9px] font-black uppercase text-gray-500 tracking-wider">AI Instructor</span>
              </div>

              {/* SVG Character Avatar */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-gray-800 flex items-center justify-center mb-4 relative">
                {/* Speech sound ripples */}
                {isSpeaking && (
                  <>
                    <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-ping" />
                    <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-pulse" />
                  </>
                )}

                <svg className="w-24 h-24 text-gray-300" viewBox="0 0 100 100" fill="none">
                  {/* Face/Head outline */}
                  <circle cx="50" cy="46" r="30" stroke="currentColor" strokeWidth="2.5" fill="#090d16" />
                  
                  {/* Futuristic Headset */}
                  <path d="M16 46 A 34 34 0 0 1 84 46" stroke="#3b82f6" strokeWidth="4" />
                  <rect x="14" y="40" width="6" height="12" rx="3" fill="#3b82f6" />
                  <rect x="80" y="40" width="6" height="12" rx="3" fill="#3b82f6" />
                  <path d="M80 46 C 80 58, 65 65, 58 65" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="58" cy="65" r="3" fill="#a855f7" />

                  {/* Eyes */}
                  <circle cx="38" cy="42" r="3.5" fill="#3b82f6" />
                  <circle cx="62" cy="42" r="3.5" fill="#3b82f6" />
                  {/* Eye glow */}
                  {isSpeaking && (
                    <>
                      <circle cx="38" cy="42" r="1.5" fill="white" />
                      <circle cx="62" cy="42" r="1.5" fill="white" />
                    </>
                  )}

                  {/* Talking Mouth */}
                  <path 
                    d={`M38 58 Q 50 ${58 + (mouthHeight / 2)} 62 58`} 
                    stroke="#a855f7" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    fill="none"
                  />
                </svg>
              </div>

              <h3 className="font-bold text-sm text-gray-200">Professor Alex</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Virtual Educator</p>
            </div>

            {/* Voice & Presentation Settings */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Presenter Settings</h4>
              
              {/* Voice Selector */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase">Narrator Voice</label>
                <select 
                  value={selectedVoice} 
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-gray-300 font-semibold focus:outline-none focus:border-blue-500"
                >
                  {voices.map((v, idx) => (
                    <option key={idx} value={v.name}>{v.name} ({v.lang})</option>
                  ))}
                </select>
              </div>

              {/* Speech Speed Rate */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-gray-500 font-bold uppercase">Speaking Speed</label>
                  <span className="text-[10px] text-blue-400 font-black">{rate}x</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2" 
                  step="0.25"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Captions Toggle */}
              <button 
                onClick={() => setShowCaptions(!showCaptions)}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                  showCaptions 
                    ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' 
                    : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                <span className="flex items-center gap-2"><Subtitles className="w-4 h-4" /> Subtitles Track</span>
                <span className="font-black uppercase">{showCaptions ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Render/Export Progress Panel */}
          {isExporting && (
            <div className="my-4 p-4 bg-gray-900 rounded-2xl border border-gray-800 animate-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase text-blue-400">Rendering Video...</span>
                <span className="text-[10px] font-black text-gray-200">{exportProgress}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${exportProgress}%` }} />
              </div>
              <p className="text-[10px] text-gray-500 font-medium mt-2 italic">{exportStatus}</p>
            </div>
          )}

          {/* Timeline & Player Controls */}
          <div className="border-t border-gray-800 pt-6 mt-6 space-y-4">
            <div className="flex justify-between items-center gap-4">
              <button 
                onClick={handlePrev}
                disabled={currentSlide === 0}
                className="p-2 hover:bg-gray-900 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button 
                onClick={handleReplay}
                className="p-2 hover:bg-gray-900 rounded-lg text-gray-400 hover:text-white transition-colors"
                title="Restart Presentation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button 
                onClick={handlePlayPause}
                className="w-14 h-14 bg-white text-black hover:bg-blue-600 hover:text-white rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
              </button>

              <button 
                onClick={handleNext}
                disabled={currentSlide === slides.length - 1}
                className="p-2 hover:bg-gray-900 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Slide Index Markers */}
            <div className="flex justify-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    currentSlide === idx ? 'w-6 bg-blue-500' : 'w-1.5 bg-gray-800 hover:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AIVideoPlayer;
