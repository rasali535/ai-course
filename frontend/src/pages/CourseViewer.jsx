import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  PlayCircle, 
  FileText, 
  HelpCircle, 
  ArrowLeft,
  Loader2,
  Trophy,
  RotateCcw,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../supabase';
import confetti from 'canvas-confetti';

const CourseViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizState, setQuizState] = useState({
    currentQuestion: 0,
    selectedOption: null,
    isCorrect: null,
    score: 0,
    isFinished: false,
    results: []
  });

  // Botswana Time Helper (Africa/Gaborone is UTC+2)
  const getBotswanaTime = () => {
    return new Date().toLocaleString('en-GB', { 
      timeZone: 'Africa/Gaborone',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profile?.role === 'creator' && profile?.plan === 'basic' && profile?.trial_ends_at) {
            const expired = new Date() > new Date(profile.trial_ends_at);
            setIsTrialExpired(expired);
          }
        }

        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        // Handle potential different content structures
        const content = data.content || {};
        setCourse({
          ...data,
          modules: content.modules || []
        });
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const activeModule = course?.modules[activeModuleIdx];
  const activeLesson = activeModule?.lessons[activeLessonIdx];

  const handleNext = () => {
    if (activeLessonIdx < activeModule.lessons.length - 1) {
      setActiveLessonIdx(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      setIsQuizMode(true);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (isQuizMode) {
      setIsQuizMode(false);
    } else if (activeLessonIdx > 0) {
      setActiveLessonIdx(prev => prev - 1);
    } else if (activeModuleIdx > 0) {
      const prevModule = course.modules[activeModuleIdx - 1];
      setActiveModuleIdx(prev => prev - 1);
      setActiveLessonIdx(prevModule.lessons.length - 1);
    }
    window.scrollTo(0, 0);
  };

  const handleOptionSelect = (optionIdx) => {
    if (quizState.isCorrect !== null) return;

    const question = activeModule.quiz[quizState.currentQuestion];
    const isCorrect = optionIdx === question.answer;

    setQuizState(prev => ({
      ...prev,
      selectedOption: optionIdx,
      isCorrect: isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score
    }));

    // Reset for next question after delay
    setTimeout(() => {
      if (quizState.currentQuestion < activeModule.quiz.length - 1) {
        setQuizState(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          selectedOption: null,
          isCorrect: null
        }));
      } else {
        const finalScore = isCorrect ? quizState.score + 1 : quizState.score;
        const percentage = Math.round((finalScore / activeModule.quiz.length) * 100);
        
        setQuizState(prev => ({
          ...prev,
          isFinished: true
        }));

        // Persist Score in Botswana Time
        const bTime = getBotswanaTime();
        const quizResult = {
          courseId: id,
          moduleTitle: activeModule.moduleTitle,
          score: percentage,
          timestamp: bTime
        };

        const existingStats = JSON.parse(localStorage.getItem('learnflow_stats') || '[]');
        localStorage.setItem('learnflow_stats', JSON.stringify([...existingStats, quizResult]));
        
        if (percentage >= 80) {
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
          <BookOpen className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
        <p className="text-gray-500 mb-8 max-w-sm">We couldn't find the course you're looking for. It might have been removed or the link is incorrect.</p>
        <Link to="/dashboard" className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-inter">
      <Header />
      
      {isTrialExpired && (
        <div className="fixed inset-0 z-[60] bg-gray-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Sparkles className="text-orange-600" size={40} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic">Trial Expired</h2>
            <p className="text-gray-500 font-medium mb-10 leading-relaxed italic uppercase text-[10px] tracking-widest px-4">
              Your 7-day trial of LearnFlow has ended. Access to lessons, downloadable files, and courses is limited. Please upgrade to continue.
            </p>
            <div className="space-y-4">
              <Link to="/pricing" className="block w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                Upgrade Plan Now <ArrowRight size={20} />
              </Link>
              <Link to="/dashboard" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-950 mt-4">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex pt-16 h-[calc(100vh-0px)]">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:flex w-80 border-r border-gray-100 flex-col bg-gray-50/50">
          <div className="p-6 border-b border-gray-100 bg-white">
            <Link to="/dashboard" className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors mb-6">
              <ArrowLeft className="w-3 h-3 mr-2" /> Back to Portal
            </Link>
            <h1 className="text-sm font-black text-gray-900 line-clamp-2 leading-relaxed">{course.title}</h1>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                  style={{ width: `${((activeModuleIdx + 1) / course.modules.length) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-gray-400">{Math.round(((activeModuleIdx) / course.modules.length) * 100)}%</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {course.modules.map((module, mIdx) => (
              <div key={mIdx} className="space-y-2">
                <h3 className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                  Module {mIdx + 1}
                </h3>
                <div className="space-y-1">
                  {module.lessons.map((lesson, lIdx) => {
                    const isActive = activeModuleIdx === mIdx && activeLessonIdx === lIdx && !isQuizMode;
                    const isPassed = mIdx < activeModuleIdx || (mIdx === activeModuleIdx && lIdx < activeLessonIdx);
                    
                    return (
                      <button
                        key={lIdx}
                        onClick={() => {
                          setActiveModuleIdx(mIdx);
                          setActiveLessonIdx(lIdx);
                          setIsQuizMode(false);
                        }}
                        className={`w-full text-left p-3 rounded-2xl text-sm font-bold flex items-center gap-3 transition-all ${
                          isActive 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                            : 'text-gray-600 hover:bg-white hover:shadow-sm'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isActive ? 'bg-white/20' : 'bg-gray-100'
                        }`}>
                          {isPassed ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <FileText className="w-3.5 h-3.5" />}
                        </div>
                        <span className="line-clamp-1">{typeof lesson === 'string' ? lesson : lesson.title}</span>
                      </button>
                    );
                  })}
                  <button
                    onClick={() => {
                      setActiveModuleIdx(mIdx);
                      setIsQuizMode(true);
                      setActiveLessonIdx(module.lessons.length - 1);
                    }}
                    className={`w-full text-left p-3 rounded-2xl text-sm font-bold flex items-center gap-3 transition-all ${
                      isQuizMode && activeModuleIdx === mIdx 
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                        : 'text-gray-600 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isQuizMode && activeModuleIdx === mIdx ? 'bg-white/20' : 'bg-gray-100'
                    }`}>
                      <HelpCircle className="w-3.5 h-3.5" />
                    </div>
                    <span>Module Assessment</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-white flex flex-col">
          <div className="max-w-4xl mx-auto w-full px-6 py-12 md:py-20 flex-1">
            <AnimatePresence mode="wait">
              {!isQuizMode ? (
                <motion.div
                  key={`lesson-${activeModuleIdx}-${activeLessonIdx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div className="mb-12">
                    <div className="flex items-center gap-3 text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">
                      <span className="px-2 py-1 bg-blue-50 rounded-md">Module {activeModuleIdx + 1}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>Lesson {activeLessonIdx + 1}</span>
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter sm:text-5xl">
                      {typeof activeLesson === 'string' ? activeLesson : activeLesson.title}
                    </h2>
                  </div>

                  <div className="prose prose-lg max-w-none prose-slate">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg bg-gray-50/50 p-8 md:p-12 rounded-[2rem] border border-gray-100/50 font-medium whitespace-pre-line">
                      {typeof activeLesson === 'string' ? "Loading lesson content..." : activeLesson.content}
                    </div>
                  </div>

                  <div className="mt-16 flex items-center justify-between pt-12 border-t border-gray-100">
                    <button
                      onClick={handlePrev}
                      disabled={activeModuleIdx === 0 && activeLessonIdx === 0}
                      className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-0"
                    >
                      <ChevronLeft className="w-5 h-5" /> Previous
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-3 px-8 h-14 bg-gray-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 active:scale-95"
                    >
                      Next Step <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`quiz-${activeModuleIdx}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-2xl mx-auto w-full"
                >
                  {!quizState.isFinished ? (
                    <div className="bg-white rounded-[2.5rem] border-2 border-gray-100 p-8 md:p-14 shadow-2xl shadow-gray-100 relative overflow-hidden">
                      {/* Progress Dot */}
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-50">
                        <div 
                          className="h-full bg-purple-600 transition-all duration-500"
                          style={{ width: `${((quizState.currentQuestion + 1) / activeModule.quiz.length) * 100}%` }}
                        />
                      </div>

                      <div className="mb-12">
                        <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-6">
                          Module {activeModuleIdx + 1} Assessment
                        </span>
                        <h3 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight tracking-tight">
                          {activeModule.quiz[quizState.currentQuestion].question}
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {activeModule.quiz[quizState.currentQuestion].options.map((option, idx) => {
                          const isSelected = quizState.selectedOption === idx;
                          const isCorrect = quizState.isCorrect;
                          
                          let borderClass = "border-gray-100 hover:border-gray-300";
                          let bgClass = "bg-white";
                          let textClass = "text-gray-700";

                          if (isSelected) {
                            if (isCorrect) {
                              borderClass = "border-green-500 ring-4 ring-green-50 shadow-lg";
                              bgClass = "bg-green-50";
                              textClass = "text-green-900";
                            } else if (isCorrect === false) {
                              borderClass = "border-red-500 ring-4 ring-red-50";
                              bgClass = "bg-red-50";
                              textClass = "text-red-900";
                            } else {
                              borderClass = "border-blue-600 shadow-xl shadow-blue-100";
                              bgClass = "bg-blue-50";
                              textClass = "text-blue-900";
                            }
                          }

                          return (
                            <motion.button
                              key={idx}
                              onClick={() => handleOptionSelect(idx)}
                              whileTap={{ scale: 0.98 }}
                              animate={isSelected && isCorrect === false ? { x: [-10, 10, -10, 10, 0] } : {}}
                              className={`w-full p-6 text-left rounded-2xl border-2 font-bold text-lg transition-all flex items-center justify-between group ${borderClass} ${bgClass} ${textClass}`}
                            >
                              {option}
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected ? 'border-transparent bg-white/50' : 'border-gray-100 group-hover:border-blue-200'
                              }`}>
                                {isSelected && isCorrect && <CheckCircle className="w-4 h-4 text-green-600" />}
                                {isSelected && isCorrect === false && <RotateCcw className="w-4 h-4 text-red-600" />}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>

                      <AnimatePresence>
                        {quizState.isCorrect !== null && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-10 p-6 rounded-2xl border-2 flex items-start gap-4 ${
                              quizState.isCorrect ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'
                            }`}
                          >
                            <div className={`p-2 rounded-lg ${quizState.isCorrect ? 'bg-green-100' : 'bg-gray-200'}`}>
                              <HelpCircle className={`w-5 h-5 ${quizState.isCorrect ? 'text-green-600' : 'text-gray-500'}`} />
                            </div>
                            <div>
                              <p className={`text-xs font-black uppercase tracking-widest mb-1 ${quizState.isCorrect ? 'text-green-800' : 'text-gray-400'}`}>
                                {quizState.isCorrect ? 'Correct!' : 'Correction'}
                              </p>
                              <p className="text-sm font-bold text-gray-700 leading-relaxed">
                                {activeModule.quiz[quizState.currentQuestion].explanation}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="text-center bg-white rounded-[3rem] p-12 md:p-20 border-2 border-gray-100 shadow-2xl">
                      <div className="w-32 h-32 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10">
                        <Trophy className="w-16 h-16 text-blue-600" />
                      </div>
                      <h3 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">Module {activeModuleIdx + 1} Complete!</h3>
                      <p className="text-gray-500 mb-10 text-lg font-medium leading-relaxed">
                        You scored <span className="text-blue-600 font-black">{Math.round((quizState.score / activeModule.quiz.length) * 100)}%</span> in this assessment.
                      </p>
                      
                      <div className="flex items-center justify-center gap-3 text-xs font-bold text-gray-400 mb-12 bg-gray-50 py-3 px-6 rounded-full inline-flex">
                        <Clock className="w-4 h-4" />
                        <span>Saved at {getBotswanaTime()} (CAT)</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setQuizState({
                            currentQuestion: 0,
                            selectedOption: null,
                            isCorrect: null,
                            score: 0,
                            isFinished: false,
                            results: []
                          })}
                          className="h-16 rounded-2xl border-2 border-gray-100 font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" /> Retake
                        </button>
                        <button
                          onClick={() => {
                            if (activeModuleIdx < course.modules.length - 1) {
                              setActiveModuleIdx(prev => prev + 1);
                              setActiveLessonIdx(0);
                              setIsQuizMode(false);
                              setQuizState({
                                currentQuestion: 0,
                                selectedOption: null,
                                isCorrect: null,
                                score: 0,
                                isFinished: false,
                                results: []
                              });
                            } else {
                              navigate('/dashboard');
                            }
                          }}
                          className="h-16 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
                        >
                          Next Module <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseViewer;
