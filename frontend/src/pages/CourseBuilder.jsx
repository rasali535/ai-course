import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import axios from 'axios';
import { API_BASE } from '../api_config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    useDraggable
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
    Trash2, GripVertical, Plus, X, Loader2, 
    Eye, EyeOff, Film, ArrowLeft, ArrowRight, 
    CheckCircle, FileText, HelpCircle, Trophy, 
    Clock, Sparkles, BookOpen, RotateCcw,
    ChevronLeft, ChevronRight, Edit
} from 'lucide-react';
import AIVideoPlayer from '../components/AIVideoPlayer';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Sidebar Item Component (Draggable)
const SidebarItem = ({ type, icon, label }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `sidebar-${type}`,
        data: {
            type,
            label,
            icon,
            isSidebar: true
        }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center cursor-move hover:bg-white hover:shadow-sm transition-all group mb-3"
        >
            <span className="mr-3">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
        </div>
    );
};

// Sortable Module Item Component
const SortableModule = ({ id, module, onDelete, onRemoveContent, onUpdateModule, onUpdateContent, onEditContent, onEditQuiz }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: module.id,
        data: {
            type: 'module',
            module
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`p-5 bg-white rounded-2xl shadow-sm border ${isDragging ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100 hover:border-blue-500'} transition-all group mb-4`}
        >
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center flex-1">
                    <button {...attributes} {...listeners} className="mr-3 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                        <GripVertical size={20} />
                    </button>
                    <input
                        type="text"
                        value={module.title}
                        onChange={(e) => onUpdateModule(module.id, e.target.value)}
                        className="font-bold text-lg bg-transparent border-b border-transparent hover:border-gray-200 focus:border-blue-500 outline-none w-full mr-4"
                        placeholder="Module Title"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onEditQuiz(module.id)}
                        className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-600 font-bold px-3 py-1.5 rounded-xl border border-purple-100 transition-colors flex items-center gap-1.5"
                    >
                        <HelpCircle size={14} />
                        {module.quiz && module.quiz.length > 0 ? `Edit Quiz (${module.quiz.length})` : "Add Quiz"}
                    </button>
                    <button onClick={() => onDelete(id)} className="text-gray-300 hover:text-red-500 transition-colors ml-2">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Content List */}
            <div className="space-y-2 pl-10">
                {module.content.length === 0 && (
                    <div className="p-4 border-2 border-dashed border-gray-100 rounded-lg text-center text-gray-400 text-sm">
                        Drop components here to add content
                    </div>
                )}
                {module.content.map((item, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm flex items-center justify-between group/item">
                        <div className="flex items-center flex-1">
                            <span className="mr-3 text-lg">{item.icon}</span>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={item.title || item.text}
                                    onChange={(e) => onUpdateContent(module.id, idx, e.target.value, "title")}
                                    className="bg-transparent border-b border-transparent hover:border-gray-200 focus:border-blue-500 outline-none w-full font-medium"
                                    placeholder={item.type === 'video' ? "Video Title" : "Topic Title"}
                                />
                                {(item.type === 'video' || item.type === 'file') && (
                                    <div className="mt-2">
                                        {item.url ? (
                                            <div className="text-xs text-green-600 flex items-center bg-green-50 w-fit px-2 py-1 rounded">
                                                <span className="mr-1">✓</span> File Uploaded
                                                <button
                                                    className="ml-2 text-gray-400 hover:text-red-500"
                                                    onClick={() => onUpdateContent(module.id, idx, "", "remove_url")}
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer inline-flex items-center text-xs text-blue-500 hover:bg-blue-50 px-2 py-1 rounded transition-colors border border-dashed border-blue-200">
                                                <span>Upload {item.type === 'video' ? 'Video' : 'File'}</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept={item.type === 'video' ? "video/*" : ".pdf,.doc,.docx"}
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            try {
                                                                const fileExt = file.name.split('.').pop();
                                                                const fileName = `${Math.random()}.${fileExt}`;
                                                                const filePath = `${localStorage.getItem('userId') || 'guest'}/${fileName}`;

                                                                const { error: uploadError, data } = await supabase.storage
                                                                    .from('media')
                                                                    .upload(filePath, file);

                                                                if (uploadError) throw uploadError;

                                                                const { data: { publicUrl } } = supabase.storage
                                                                    .from('media')
                                                                    .getPublicUrl(filePath);

                                                                onUpdateContent(module.id, idx, publicUrl, "url");
                                                            } catch (err) {
                                                                console.error("Upload failed", err);
                                                                alert("Upload failed: " + err.message);
                                                            }
                                                        }
                                                    }}
                                                />
                                            </label>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => onEditContent(module.id, idx)}
                                className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                                title="Edit Details"
                            >
                                <Edit size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => onRemoveContent(module.id, idx)}
                                className="text-gray-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all p-1"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CourseBuilder = () => {
    const [activeId, setActiveId] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
    const [courseTitle, setCourseTitle] = useState("New Course Topic");
    const [courseDescription, setCourseDescription] = useState("Enter course description here...");
    const [coursePrice, setCoursePrice] = useState(1200);
    const [courseImage, setCourseImage] = useState("https://images.unsplash.com/photo-1516321318423-f06f85e504b3");
    const [courseDuration, setCourseDuration] = useState("12h");
    const [modules, setModules] = useState([]);
    const [finalExam, setFinalExam] = useState([]); // Added state for final exam
    const [isGenerating, setIsGenerating] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    // Modal state for manually editing content items (lessons)
    const [editingItem, setEditingItem] = useState(null); // { moduleId, contentIndex }
    
    // Modal state for editing module assessment (quiz)
    const [editingQuizModuleId, setEditingQuizModuleId] = useState(null); // moduleId string
    
    // Modal state for cover image customization
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    
    // Preview Mode states
    const [previewMode, setPreviewMode] = useState(false);
    const [previewModuleIdx, setPreviewModuleIdx] = useState(0);
    const [previewLessonIdx, setPreviewLessonIdx] = useState(0);
    const [previewQuizMode, setPreviewQuizMode] = useState(false);
    const [showPreviewVideo, setShowPreviewVideo] = useState(false);
    const [previewQuizState, setPreviewQuizState] = useState({
        currentQuestion: 0,
        selectedOption: null,
        isCorrect: null,
        score: 0,
        isFinished: false,
        results: []
    });

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const initializeBuilder = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    navigate('/login');
                    return;
                }

                // Fetch database profile for the correct role and trial status
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                const userRole = profile?.role || user.user_metadata?.role || 'learner';

                if (userRole !== 'creator') {
                    navigate('/learner-dashboard');
                    return;
                }

                // Check trial status
                let expired = profile?.plan === 'basic' && profile.trial_ends_at && new Date() > new Date(profile.trial_ends_at);

                if (!expired && profile?.plan === 'basic') {
                    const nameToMatch = profile?.full_name || user.user_metadata?.full_name;
                    if (nameToMatch && nameToMatch.toLowerCase() !== 'creator' && nameToMatch.toLowerCase() !== 'user' && nameToMatch.toLowerCase() !== 'learner') {
                        const { data: matchedProfiles } = await supabase
                            .from('profiles')
                            .select('*')
                            .ilike('full_name', nameToMatch);
                        
                        if (matchedProfiles && matchedProfiles.length > 0) {
                            const hasExpiredMatch = matchedProfiles.some(p => {
                                const tEnd = p.trial_ends_at ? new Date(p.trial_ends_at) : null;
                                return p.plan === 'basic' && tEnd && new Date() > tEnd;
                            });
                            if (hasExpiredMatch) {
                                expired = true;
                            }
                        }
                    }
                }

                if (expired) {
                    navigate('/dashboard');
                    return;
                }

                // If editing an existing course, fetch it
                if (id) {
                    const { data, error } = await supabase
                        .from('courses')
                        .select('*')
                        .eq('id', id)
                        .single();
                    
                    if (data) {
                        setCourseTitle(data.title);
                        setCourseDescription(data.description);
                        setCoursePrice(data.price || 1200);
                        setCourseImage(data.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3");
                        setCourseDuration(data.duration || "12h");
                        setModules(data.content?.modules || []);
                        setFinalExam(data.content?.finalExam || []);
                    } else {
                        // Fallback to localStorage for migration period
                        const localCourses = JSON.parse(localStorage.getItem('createdCourses') || '[]');
                        const courseToEdit = localCourses.find(c => c.id === id);
                        if (courseToEdit) {
                            setCourseTitle(courseToEdit.title);
                            setCourseDescription(courseToEdit.description);
                            setCoursePrice(courseToEdit.price || 1200);
                            setCourseImage(courseToEdit.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3");
                            setCourseDuration(courseToEdit.duration || "12h");
                            setModules(courseToEdit.modules);
                            setFinalExam(courseToEdit.finalExam || []);
                        }
                    }
                }

                setAuthLoading(false);
            } catch (error) {
                console.error("Error initializing course builder:", error);
                navigate('/dashboard');
            }
        };

        initializeBuilder();
    }, [id, navigate]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);

        if (active.data.current?.isSidebar) {
            setActiveItem(active.data.current);
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);
        setActiveItem(null);

        if (!over) return;

        // Handle dragging sidebar item to a module
        if (active.id.toString().startsWith('sidebar-')) {
            const moduleId = over.id;
            const moduleExists = modules.find(m => m.id === moduleId);

            if (moduleExists) {
                const itemData = active.data.current;

                setModules(prev => prev.map(m => {
                    if (m.id === moduleId) {
                        return {
                            ...m,
                            content: [...m.content, {
                                type: itemData.type,
                                text: `New ${itemData.label}`,
                                icon: itemData.icon
                            }]
                        };
                    }
                    return m;
                }));
            }
            return;
        }

        // Handle reordering modules
        if (active.id !== over.id) {
            setModules((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleDeleteModule = (id) => {
        setModules(modules.filter(m => m.id !== id));
    };

    const handleRemoveContent = (moduleId, contentIndex) => {
        setModules(prev => prev.map(m => {
            if (m.id === moduleId) {
                const newContent = [...m.content];
                newContent.splice(contentIndex, 1);
                return { ...m, content: newContent };
            }
            return m;
        }));
    };

    const handleAddModule = () => {
        const newId = `module-${Date.now()}`;
        setModules([...modules, {
            id: newId,
            title: "",
            content: []
        }]);
    };

    const handleUpdateModule = (moduleId, newTitle) => {
        setModules(prev => prev.map(m => m.id === moduleId ? { ...m, title: newTitle } : m));
    };

    const handleUpdateContent = (moduleId, contentIndex, newValue, field = "text") => {
        setModules(prev => prev.map(m => {
            if (m.id === moduleId) {
                const newContent = [...m.content];
                if (field === "text") {
                    newContent[contentIndex] = { ...newContent[contentIndex], text: newValue };
                } else if (field === "title") {
                    newContent[contentIndex] = { ...newContent[contentIndex], title: newValue };
                } else if (field === "url") {
                    newContent[contentIndex] = { ...newContent[contentIndex], url: newValue };
                } else if (field === "remove_url") {
                    const item = newContent[contentIndex];
                    delete item.url;
                    newContent[contentIndex] = { ...item };
                }
                return { ...m, content: newContent };
            }
            return m;
        }));
    };

    const handleSaveCourse = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Authentication required");

            const courseData = {
                user_id: user.id,
                title: courseTitle,
                description: courseDescription,
                price: coursePrice,
                image: courseImage,
                duration: courseDuration,
                content: {
                    modules: modules,
                    finalExam: finalExam
                },
                updated_at: new Date().toISOString()
            };

            if (id && !id.startsWith('course-')) {
                courseData.id = id;
            }

            // 1. Save to Supabase
            const { data, error } = await supabase
                .from('courses')
                .upsert(courseData)
                .select();

            if (error) throw error;

            const savedCourse = data[0];

            // If this is a draft and there is a corresponding published version, prompt to update it
            if (id && !id.startsWith('course-')) {
                const { data: pubData, error: pubCheckError } = await supabase
                    .from('courses')
                    .select('id')
                    .eq('parent_id', id)
                    .eq('status', 'published')
                    .maybeSingle();

                if (pubData && !pubCheckError) {
                    const shouldUpdatePub = window.confirm("You have a live published version of this course. Would you like to update the live published version with these changes as well?");
                    if (shouldUpdatePub) {
                        const publishedData = {
                            id: pubData.id,
                            user_id: user.id,
                            title: courseTitle,
                            description: courseDescription,
                            price: coursePrice,
                            image: courseImage,
                            duration: courseDuration,
                            content: {
                                modules: modules,
                                finalExam: finalExam
                            },
                            status: 'published',
                            is_public: true,
                            parent_id: id,
                            updated_at: new Date().toISOString()
                        };

                        const { error: updatePubError } = await supabase
                            .from('courses')
                            .upsert(publishedData);
                        
                        if (updatePubError) {
                            console.error("Error updating published version:", updatePubError);
                            alert("Draft saved, but failed to update published version: " + updatePubError.message);
                        }
                    }
                }
            }

            // 2. Save to LocalStorage (as backup/sync)
            let localCourses = JSON.parse(localStorage.getItem('createdCourses') || '[]');

            if (id) {
                localCourses = localCourses.map(c => c.id === id ? savedCourse : c);
            } else {
                localCourses.unshift(savedCourse);
            }

            localStorage.setItem('createdCourses', JSON.stringify(localCourses));

            alert("Course Saved Successfully!");
            navigate('/dashboard');
        } catch (error) {
            console.error("Error saving course:", error);
            alert("Failed to save course: " + error.message);
        }
    };

    const generateAIContent = async () => {
        if (!courseTitle || courseTitle === "New Course Title") {
            alert("Please enter a course topic first!");
            return;
        }

        setIsGenerating(true);
        try {
            const response = await axios.post(`${API_BASE}/api/ai/generate-course`, {
                topic: courseTitle,
                target_audience: "Beginners"
            });

            const generatedData = response.data;

            if (!generatedData || !generatedData.modules || !Array.isArray(generatedData.modules)) {
                throw new Error("AI response was missing modules.");
            }

            const newModules = generatedData.modules.map((m, index) => ({
                id: `gen-${Date.now()}-${index}`,
                title: m.title || "Untitled Module",
                content: m.content || [],
                quiz: m.quiz || []
            }));

            setModules(prev => [...prev, ...newModules]);
            if (generatedData.description) {
                setCourseDescription(generatedData.description);
            }
            if (generatedData.image) {
                setCourseImage(generatedData.image);
            }
            if (generatedData.duration) {
                setCourseDuration(generatedData.duration);
            }
            if (generatedData.final_exam) {
                setFinalExam(generatedData.final_exam);
            }
        } catch (error) {
            console.error("AI Generation Failed:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    // Preview Mode Helpers & Handlers
    const previewModules = (modules || []).map(m => {
        const lessons = m.lessons || (m.content || []).map(item => ({
            title: item.title || item.text || "Untitled Lesson",
            content: item.text || ""
        }));
        
        const quiz = (m.quiz || []).map(q => {
            let answerIdx = q.answer;
            if (answerIdx === undefined && q.correct_answer !== undefined) {
                const idx = q.options.indexOf(q.correct_answer);
                if (idx !== -1) {
                    answerIdx = idx;
                } else {
                    answerIdx = 0;
                }
            }
            return {
                ...q,
                answer: answerIdx
            };
        });

        return {
            ...m,
            lessons,
            quiz
        };
    });

    const activePreviewModule = previewModules[previewModuleIdx] || null;
    const activePreviewLesson = activePreviewModule?.lessons?.[previewLessonIdx] || null;

    const handlePreviewOptionSelect = (optionIdx) => {
        if (previewQuizState.isCorrect !== null) return;

        const currentModule = previewModules[previewModuleIdx];
        if (!currentModule || !currentModule.quiz) return;

        const question = currentModule.quiz[previewQuizState.currentQuestion];
        if (!question) return;

        const isCorrect = optionIdx === question.answer;

        setPreviewQuizState(prev => ({
            ...prev,
            selectedOption: optionIdx,
            isCorrect: isCorrect,
            score: isCorrect ? prev.score + 1 : prev.score,
            results: [...prev.results, { question: question.question, isCorrect }]
        }));

        setTimeout(() => {
            if (previewQuizState.currentQuestion < currentModule.quiz.length - 1) {
                setPreviewQuizState(prev => ({
                    ...prev,
                    currentQuestion: prev.currentQuestion + 1,
                    selectedOption: null,
                    isCorrect: null
                }));
            } else {
                setPreviewQuizState(prev => ({
                    ...prev,
                    isFinished: true
                }));
                const finalScore = isCorrect ? previewQuizState.score + 1 : previewQuizState.score;
                if (Math.round((finalScore / currentModule.quiz.length) * 100) >= 80) {
                    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                }
            }
        }, 2000);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <Header />
            <div className="max-w-7xl mx-auto px-6">

                {/* Header & Controls */}
                <div className="mb-8 bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                    {/* Cover Image Preview & Action */}
                    <div className="relative group w-full lg:w-48 h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                        {courseImage.startsWith('linear-gradient') ? (
                            <div style={{ background: courseImage }} className="w-full h-full flex items-center justify-center text-white font-bold text-sm p-4 text-center">
                                {courseTitle}
                            </div>
                        ) : (
                            <img src={courseImage} alt="Cover" className="w-full h-full object-cover" />
                        )}
                        <button
                            type="button"
                            onClick={() => setIsImageModalOpen(true)}
                            className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-2 cursor-pointer"
                        >
                            <span>✨ Customize Cover</span>
                        </button>
                    </div>

                    <div className="flex-1 space-y-4 w-full">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Course Title</label>
                            <input
                                type="text"
                                value={courseTitle}
                                onChange={(e) => setCourseTitle(e.target.value)}
                                className="text-2xl font-black bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-blue-600 outline-none w-full transition-all text-gray-900 tracking-tight"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Course Description</label>
                            <input
                                type="text"
                                value={courseDescription}
                                onChange={(e) => setCourseDescription(e.target.value)}
                                className="text-gray-600 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-blue-600 outline-none w-full text-sm font-medium"
                                placeholder="Enter course description..."
                            />
                        </div>
                        <div className="flex items-center gap-6">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Course Price (BWP)</label>
                                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all w-36">
                                    <span className="text-gray-400 font-bold text-sm mr-1">BWP</span>
                                    <input
                                        type="number"
                                        value={coursePrice}
                                        onChange={(e) => setCoursePrice(Number(e.target.value))}
                                        className="bg-transparent border-none outline-none w-full font-bold text-gray-800 text-sm focus:ring-0 p-0"
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Course Duration</label>
                                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all w-40">
                                    <input
                                        type="text"
                                        value={courseDuration}
                                        onChange={(e) => setCourseDuration(e.target.value)}
                                        className="bg-transparent border-none outline-none w-full font-bold text-gray-800 text-sm focus:ring-0 p-0"
                                        placeholder="e.g. 12h or 6 weeks"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-auto">
                        <button
                            type="button"
                            onClick={() => {
                                setPreviewQuizState({
                                    currentQuestion: 0,
                                    selectedOption: null,
                                    isCorrect: null,
                                    score: 0,
                                    isFinished: false,
                                    results: []
                                });
                                setPreviewModuleIdx(0);
                                setPreviewLessonIdx(0);
                                setPreviewQuizMode(false);
                                setPreviewMode(!previewMode);
                            }}
                            className={`px-6 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-2 text-sm flex-1 lg:flex-initial ${
                                previewMode 
                                    ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 shadow-lg shadow-blue-100' 
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {previewMode ? <EyeOff size={18} /> : <Eye size={18} />}
                            {previewMode ? "Exit Preview" : "Learner Preview"}
                        </button>
                        <button
                            onClick={handleSaveCourse}
                            className="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 flex items-center justify-center text-sm flex-1 lg:flex-initial"
                        >
                            Save Course
                        </button>
                    </div>
                </div>

                {previewMode ? (
                    <div className="bg-white rounded-[2rem] shadow-2xl flex h-[750px] border border-gray-100 overflow-hidden font-inter">
                        {/* Sidebar Navigation */}
                        <aside className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
                            <div className="p-6 border-b border-gray-100 bg-white">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] block mb-2">LEARNER MODE PREVIEW</span>
                                <h1 className="text-sm font-black text-gray-900 line-clamp-2 leading-relaxed">{courseTitle}</h1>
                                <div className="mt-4 flex items-center gap-2">
                                    <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                                            style={{ width: `${previewModules.length > 0 ? ((previewModuleIdx + 1) / previewModules.length) * 100 : 0}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400">
                                        {previewModules.length > 0 ? Math.round((previewModuleIdx / previewModules.length) * 100) : 0}%
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                {previewModules.length === 0 ? (
                                    <p className="text-center text-xs font-bold text-gray-400 py-10">No modules added yet. Add modules to preview.</p>
                                ) : (
                                    previewModules.map((module, mIdx) => (
                                        <div key={mIdx} className="space-y-2">
                                            <h3 className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                                                Module {mIdx + 1}
                                            </h3>
                                            <div className="space-y-1">
                                                {(module.lessons || []).map((lesson, lIdx) => {
                                                    const isActive = previewModuleIdx === mIdx && previewLessonIdx === lIdx && !previewQuizMode;
                                                    const isPassed = mIdx < previewModuleIdx || (mIdx === previewModuleIdx && lIdx < previewLessonIdx);
                                                    
                                                    return (
                                                        <button
                                                            key={lIdx}
                                                            type="button"
                                                            onClick={() => {
                                                                setPreviewModuleIdx(mIdx);
                                                                setPreviewLessonIdx(lIdx);
                                                                setPreviewQuizMode(false);
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
                                                            <span className="line-clamp-1">{lesson.title}</span>
                                                        </button>
                                                    );
                                                })}
                                                
                                                {module.quiz && module.quiz.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setPreviewModuleIdx(mIdx);
                                                            setPreviewQuizMode(true);
                                                            setPreviewLessonIdx((module.lessons || []).length - 1);
                                                            setPreviewQuizState({
                                                                currentQuestion: 0,
                                                                selectedOption: null,
                                                                isCorrect: null,
                                                                score: 0,
                                                                isFinished: false,
                                                                results: []
                                                            });
                                                        }}
                                                        className={`w-full text-left p-3 rounded-2xl text-sm font-bold flex items-center gap-3 transition-all ${
                                                            previewQuizMode && previewModuleIdx === mIdx 
                                                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                                                                : 'text-gray-600 hover:bg-white hover:shadow-sm'
                                                        }`}
                                                    >
                                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                            previewQuizMode && previewModuleIdx === mIdx ? 'bg-white/20' : 'bg-gray-100'
                                                        }`}>
                                                            <HelpCircle className="w-3.5 h-3.5" />
                                                        </div>
                                                        <span>Module Assessment</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <main className="flex-1 overflow-y-auto bg-white flex flex-col">
                            <div className="max-w-3xl mx-auto w-full px-6 py-10 flex-1 flex flex-col justify-between">
                                <AnimatePresence mode="wait">
                                    {!previewQuizMode ? (
                                        activePreviewLesson ? (
                                            <motion.div
                                                key={`preview-lesson-${previewModuleIdx}-${previewLessonIdx}`}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -15 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex-1 flex flex-col"
                                            >
                                                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                    <div>
                                                        <div className="flex items-center gap-3 text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">
                                                            <span className="px-2 py-1 bg-blue-50 rounded-md">Module {previewModuleIdx + 1}</span>
                                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                            <span>Lesson {previewLessonIdx + 1}</span>
                                                        </div>
                                                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">
                                                            {activePreviewLesson.title}
                                                        </h2>
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        onClick={() => setShowPreviewVideo(true)}
                                                        className="flex items-center gap-2.5 px-6 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0"
                                                    >
                                                        <Film className="w-4 h-4" /> Play AI Video Lecture
                                                    </button>
                                                </div>

                                                <div className="prose prose-lg max-w-none prose-slate flex-1">
                                                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-base bg-gray-50/50 p-8 rounded-2xl border border-gray-100 font-medium">
                                                        {activePreviewLesson.content}
                                                    </div>
                                                </div>

                                                <div className="mt-12 flex items-center justify-between pt-8 border-t border-gray-100">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (previewLessonIdx > 0) {
                                                                setPreviewLessonIdx(prev => prev - 1);
                                                            } else if (previewModuleIdx > 0) {
                                                                const prevMod = previewModules[previewModuleIdx - 1];
                                                                setPreviewModuleIdx(prev => prev - 1);
                                                                setPreviewLessonIdx((prevMod?.lessons || []).length - 1);
                                                            }
                                                        }}
                                                        disabled={previewModuleIdx === 0 && previewLessonIdx === 0}
                                                        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-0"
                                                    >
                                                        <ChevronLeft className="w-5 h-5" /> Previous
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const mod = previewModules[previewModuleIdx];
                                                            if (previewLessonIdx < (mod?.lessons || []).length - 1) {
                                                                setPreviewLessonIdx(prev => prev + 1);
                                                            } else {
                                                                setPreviewQuizMode(true);
                                                            }
                                                        }}
                                                        className="flex items-center gap-3 px-8 h-14 bg-gray-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 active:scale-95"
                                                    >
                                                        Next Step <ChevronRight className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <div className="text-center py-20 text-gray-400">Select a lesson to preview.</div>
                                        )
                                    ) : (
                                        activePreviewModule && activePreviewModule.quiz && activePreviewModule.quiz.length > 0 && (
                                            <motion.div
                                                key={`preview-quiz-${previewModuleIdx}`}
                                                initial={{ opacity: 0, scale: 0.97 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 1.03 }}
                                                transition={{ duration: 0.3 }}
                                                className="max-w-2xl mx-auto w-full"
                                            >
                                                {!previewQuizState.isFinished ? (
                                                    <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-xl relative overflow-hidden">
                                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-50">
                                                            <div 
                                                                className="h-full bg-purple-600 transition-all duration-500"
                                                                style={{ width: `${((previewQuizState.currentQuestion + 1) / activePreviewModule.quiz.length) * 100}%` }}
                                                            />
                                                        </div>

                                                        <div className="mb-8">
                                                            <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">
                                                                Module {previewModuleIdx + 1} Assessment Preview
                                                            </span>
                                                            <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight tracking-tight">
                                                                {activePreviewModule.quiz[previewQuizState.currentQuestion]?.question}
                                                            </h3>
                                                        </div>

                                                        <div className="space-y-3">
                                                            {(activePreviewModule.quiz[previewQuizState.currentQuestion]?.options || []).map((option, idx) => {
                                                                const isSelected = previewQuizState.selectedOption === idx;
                                                                const isCorrect = previewQuizState.isCorrect;
                                                                
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
                                                                        type="button"
                                                                        onClick={() => handlePreviewOptionSelect(idx)}
                                                                        whileTap={{ scale: 0.98 }}
                                                                        className={`w-full p-4 text-left rounded-2xl border-2 font-bold text-base transition-all flex items-center justify-between group ${borderClass} ${bgClass} ${textClass}`}
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

                                                        {previewQuizState.isCorrect !== null && activePreviewModule.quiz[previewQuizState.currentQuestion]?.explanation && (
                                                            <div className="mt-8 p-4 rounded-xl border bg-gray-50 border-gray-100 flex items-start gap-3">
                                                                <HelpCircle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Explanation</p>
                                                                    <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                                                                        {activePreviewModule.quiz[previewQuizState.currentQuestion]?.explanation}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (                                                    <div className="text-center bg-white rounded-[2.5rem] p-10 border-2 border-gray-100 shadow-xl">
                                                        <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                                            <Trophy className="w-12 h-12 text-blue-600" />
                                                        </div>
                                                        {(() => {
                                                            const scorePercentage = Math.round((previewQuizState.score / activePreviewModule.quiz.length) * 100);
                                                            const passedModule = scorePercentage >= 60;
                                                            return (
                                                                <>
                                                                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">
                                                                        {passedModule ? `Module ${previewModuleIdx + 1} Complete!` : "Assessment Failed"}
                                                                    </h3>
                                                                    <p className="text-gray-500 mb-6 text-base font-medium">
                                                                        You scored <span className={passedModule ? "text-blue-600 font-black" : "text-red-500 font-black"}>{scorePercentage}%</span> in this preview assessment.
                                                                    </p>
                                                                    
                                                                    {!passedModule && (
                                                                        <div className="mb-8 px-6 py-3 bg-red-50 rounded-2xl border border-red-100 inline-block">
                                                                            <p className="text-red-800 text-sm font-bold">
                                                                                ⚠️ Learner requires 60% or above to unlock next steps.
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setPreviewQuizState({
                                                                                currentQuestion: 0,
                                                                                selectedOption: null,
                                                                                isCorrect: null,
                                                                                score: 0,
                                                                                isFinished: false,
                                                                                results: []
                                                                            })}
                                                                            className={`h-14 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 ${
                                                                                !passedModule ? 'col-span-2 border-red-500 text-red-600 bg-red-50 hover:bg-red-100' : 'border-gray-100 hover:bg-gray-50'
                                                                            }`}
                                                                        >
                                                                            <RotateCcw className="w-4 h-4" /> Retake
                                                                        </button>
                                                                        {passedModule && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    if (previewModuleIdx < previewModules.length - 1) {
                                                                                        setPreviewModuleIdx(prev => prev + 1);
                                                                                        setPreviewLessonIdx(0);
                                                                                        setPreviewQuizMode(false);
                                                                                        setPreviewQuizState({
                                                                                            currentQuestion: 0,
                                                                                            selectedOption: null,
                                                                                            isCorrect: null,
                                                                                            score: 0,
                                                                                            isFinished: false,
                                                                                            results: []
                                                                                        });
                                                                                    } else {
                                                                                        setPreviewMode(false);
                                                                                    }
                                                                                }}
                                                                                className="h-14 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
                                                                            >
                                                                                {previewModuleIdx < previewModules.length - 1 ? "Next Module" : "Exit Preview"} <ChevronRight className="w-4 h-4" />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                )}
                                            </motion.div>
                                        )
                                    )}
                                </AnimatePresence>
                            </div>
                        </main>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="bg-white rounded-3xl shadow-2xl flex h-[700px] border border-gray-100 overflow-hidden">
                            {/* Sidebar Tools */}
                            <aside className="w-[260px] bg-white border-r border-gray-100 p-6 hidden md:block overflow-y-auto">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Components</h3>
                                <div className="space-y-3">
                                    <SidebarItem type="text" label="Text Lesson" icon="📄" />
                                    <SidebarItem type="video" label="Video Player" icon="📽️" />
                                    <SidebarItem type="quiz" label="Interactive Quiz" icon="❓" />
                                    <SidebarItem type="file" label="Downloadable File" icon="📁" />
                                    <button
                                        onClick={generateAIContent}
                                        disabled={isGenerating}
                                        className="w-full p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center cursor-pointer hover:bg-white hover:shadow-sm transition-all text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin mr-3" />
                                                <span className="text-sm font-bold tracking-tight">Generating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="mr-3">✨</span>
                                                <span className="text-sm font-bold tracking-tight">AI Multi-Generator</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="mt-12 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                    <p className="text-[10px] font-bold text-indigo-600 uppercase mb-2">Pro Tip</p>
                                    <p className="text-[11px] text-gray-600 leading-relaxed">Drag components directly into modules to build your course.</p>
                                </div>
                            </aside>

                            {/* Editor Canvas */}
                            <section className="flex-1 p-8 bg-gray-50/50 flex flex-col">
                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    <SortableContext
                                        items={modules.map(m => m.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {modules.map((module) => (
                                            <SortableModule
                                                key={module.id}
                                                id={module.id}
                                                module={module}
                                                onDelete={handleDeleteModule}
                                                onRemoveContent={handleRemoveContent}
                                                onUpdateModule={handleUpdateModule}
                                                onUpdateContent={handleUpdateContent}
                                                onEditContent={(modId, idx) => setEditingItem({ moduleId: modId, contentIndex: idx })}
                                                onEditQuiz={(modId) => setEditingQuizModuleId(modId)}
                                            />
                                        ))}
                                    </SortableContext>

                                    {/* Add Module Button */}
                                    <button
                                        onClick={handleAddModule}
                                        className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus size={20} />
                                        Add New Module
                                    </button>

                                    {/* AI Insertion Point */}
                                    <div
                                        onClick={generateAIContent}
                                        className="mt-6 py-8 text-center border-2 border-dashed border-blue-100 rounded-3xl bg-blue-50/30 cursor-pointer hover:bg-blue-50 transition-colors"
                                    >
                                        <div className="inline-flex items-center text-blue-600 font-bold">
                                            <span className="mr-2">✨</span> Generate next 3 modules for "{courseTitle}"
                                        </div>
                                        <p className="text-xs text-blue-400 mt-2">Personalized based on your course topic</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <DragOverlay>
                            {activeId && activeId.toString().startsWith('sidebar-') ? (
                                <div className="p-3 bg-white rounded-xl border border-blue-500 shadow-xl w-[200px] flex items-center opacity-90 cursor-grabbing">
                                    <span className="mr-3">{activeItem?.icon}</span>
                                    <span className="text-sm font-medium">{activeItem?.label}</span>
                                </div>
                            ) : null}
                        </DragOverlay>

                    </DndContext>
                )}
            </div>

            {showPreviewVideo && activePreviewLesson && (
                <AIVideoPlayer 
                    lessonTitle={activePreviewLesson.title}
                    lessonContent={activePreviewLesson.content}
                    onClose={() => setShowPreviewVideo(false)}
                />
            )}

            {/* Lesson Editor Modal */}
            {editingItem && (() => {
                const module = modules.find(m => m.id === editingItem.moduleId);
                const item = module?.content?.[editingItem.contentIndex];
                if (!item) return null;
                return (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-2xl w-full p-8 md:p-10 animate-in zoom-in duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                    <span>✏️</span> Edit Lesson Details ({item.type.toUpperCase()})
                                </h3>
                                <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Lesson Title</label>
                                    <input
                                        type="text"
                                        value={item.title || item.text || ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setModules(prev => prev.map(m => m.id === editingItem.moduleId ? {
                                                ...m,
                                                content: m.content.map((c, i) => i === editingItem.contentIndex ? { ...c, title: val } : c)
                                            } : m));
                                        }}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-bold text-gray-800 text-sm"
                                        placeholder="Lesson Title"
                                    />
                                </div>
                                
                                {item.type === 'text' && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Detailed Lesson Text</label>
                                        <textarea
                                            value={item.text || ""}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setModules(prev => prev.map(m => m.id === editingItem.moduleId ? {
                                                    ...m,
                                                    content: m.content.map((c, i) => i === editingItem.contentIndex ? { ...c, text: val } : c)
                                                } : m));
                                            }}
                                            className="w-full h-64 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-700 text-sm resize-none custom-scrollbar"
                                            placeholder="Write your comprehensive lesson contents here..."
                                        />
                                    </div>
                                )}

                                {(item.type === 'video' || item.type === 'file') && (
                                    <>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Description / Transcript</label>
                                            <textarea
                                                value={item.text || ""}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setModules(prev => prev.map(m => m.id === editingItem.moduleId ? {
                                                        ...m,
                                                        content: m.content.map((c, i) => i === editingItem.contentIndex ? { ...c, text: val } : c)
                                                    } : m));
                                                }}
                                                className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-700 text-sm resize-none"
                                                placeholder="Provide a brief description or transcript for this media..."
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">URL Path</label>
                                            <input
                                                type="text"
                                                value={item.url || ""}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setModules(prev => prev.map(m => m.id === editingItem.moduleId ? {
                                                        ...m,
                                                        content: m.content.map((c, i) => i === editingItem.contentIndex ? { ...c, url: val } : c)
                                                    } : m));
                                                }}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-700 text-sm"
                                                placeholder="Paste media URL or use the upload button on the builder page"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => setEditingItem(null)}
                                    className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg"
                                >
                                    Save & Close
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Quiz Editor Modal */}
            {editingQuizModuleId && (() => {
                const module = modules.find(m => m.id === editingQuizModuleId);
                if (!module) return null;
                const quiz = module.quiz || [];
                
                const addQuizQuestion = () => {
                    const newQuestion = {
                        question: "New Question Topic?",
                        options: ["Option A", "Option B", "Option C", "Option D"],
                        correct_answer: "Option A"
                    };
                    setModules(prev => prev.map(m => m.id === editingQuizModuleId ? {
                        ...m,
                        quiz: [...(m.quiz || []), newQuestion]
                    } : m));
                };

                const deleteQuizQuestion = (qIdx) => {
                    setModules(prev => prev.map(m => m.id === editingQuizModuleId ? {
                        ...m,
                        quiz: (m.quiz || []).filter((_, i) => i !== qIdx)
                    } : m));
                };

                const updateQuestion = (qIdx, field, val, optIdx = null) => {
                    setModules(prev => prev.map(m => {
                        if (m.id === editingQuizModuleId) {
                            const updatedQuiz = [...(m.quiz || [])];
                            if (field === "question") {
                                updatedQuiz[qIdx] = { ...updatedQuiz[qIdx], question: val };
                            } else if (field === "correct_answer") {
                                updatedQuiz[qIdx] = { ...updatedQuiz[qIdx], correct_answer: val };
                            } else if (field === "option") {
                                const updatedOptions = [...updatedQuiz[qIdx].options];
                                updatedOptions[optIdx] = val;
                                updatedQuiz[qIdx] = { ...updatedQuiz[qIdx], options: updatedOptions };
                            }
                            return { ...m, quiz: updatedQuiz };
                        }
                        return m;
                    }));
                };

                return (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-3xl w-full p-8 md:p-10 max-h-[85vh] flex flex-col animate-in zoom-in duration-300">
                            <div className="flex justify-between items-center mb-6 flex-shrink-0">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                    <span>❓</span> Edit Module Assessment Quiz
                                </h3>
                                <button onClick={() => setEditingQuizModuleId(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8 mb-6">
                                {quiz.length === 0 ? (
                                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                        <p className="text-gray-400 font-bold text-sm">No quiz questions added yet.</p>
                                        <p className="text-xs text-gray-400 mt-1">Click the button below to add your first question.</p>
                                    </div>
                                ) : (
                                    quiz.map((q, qIdx) => (
                                        <div key={qIdx} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative group/question">
                                            <button
                                                onClick={() => deleteQuizQuestion(qIdx)}
                                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                                title="Remove Question"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-1 block">Question {qIdx + 1}</label>
                                                    <input
                                                        type="text"
                                                        value={q.question}
                                                        onChange={(e) => updateQuestion(qIdx, "question", e.target.value)}
                                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-bold text-gray-800 text-sm"
                                                        placeholder="Question Text"
                                                    />
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {q.options.map((opt, oIdx) => (
                                                        <div key={oIdx} className="flex items-center gap-2">
                                                            <span className="text-xs font-black text-gray-400 w-4">{String.fromCharCode(65 + oIdx)}</span>
                                                            <input
                                                                type="text"
                                                                value={opt}
                                                                onChange={(e) => updateQuestion(qIdx, "option", e.target.value, oIdx)}
                                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all text-xs font-bold text-gray-700"
                                                                placeholder={`Option ${oIdx + 1}`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                <div className="pt-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Correct Answer</label>
                                                    <select
                                                        value={q.correct_answer}
                                                        onChange={(e) => updateQuestion(qIdx, "correct_answer", e.target.value)}
                                                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                                    >
                                                        {q.options.map((opt, oIdx) => (
                                                            <option key={oIdx} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            
                            <div className="flex justify-between items-center flex-shrink-0 pt-4 border-t border-gray-100">
                                <button
                                    onClick={addQuizQuestion}
                                    className="bg-purple-50 hover:bg-purple-100 text-purple-600 font-bold px-5 py-3 rounded-xl border border-purple-100 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <Plus size={16} /> Add Question
                                </button>
                                <button
                                    onClick={() => setEditingQuizModuleId(null)}
                                    className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg text-sm"
                                >
                                    Save & Close
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Cover Image Customizer Modal */}
            {isImageModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-3xl w-full p-8 md:p-10 max-h-[85vh] flex flex-col animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6 flex-shrink-0">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                <span>🖼️</span> Customize Cover Image
                            </h3>
                            <button onClick={() => setIsImageModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 mb-6">
                            {/* Custom URL Input */}
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Or paste any image URL directly</label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={courseImage.startsWith('linear-gradient') ? "" : courseImage}
                                        onChange={(e) => setCourseImage(e.target.value)}
                                        className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-semibold text-gray-700"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {courseImage && !courseImage.startsWith('linear-gradient') && (
                                        <button 
                                            onClick={() => setCourseImage("")}
                                            className="px-4 py-2 border border-gray-200 rounded-xl text-gray-400 hover:text-red-500 transition-colors text-xs font-bold"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Dynamic Gradients */}
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Dynamic CSS Gradients</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { name: "Ocean Breeze", css: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)" },
                                        { name: "Sunset Glow", css: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)" },
                                        { name: "Royal Purple", css: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)" },
                                        { name: "Cyber Punk", css: "linear-gradient(135deg, #f72585 0%, #7209b7 50%, #4cc9f0 100%)" },
                                        { name: "Forest Mist", css: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" },
                                        { name: "Midnight City", css: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)" },
                                        { name: "Rose Water", css: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)" },
                                        { name: "Auto Gradient", css: "auto" }
                                    ].map((grad, gIdx) => {
                                        const actualCss = grad.css === "auto" 
                                            ? (() => {
                                                let hash = 0;
                                                for (let i = 0; i < courseTitle.length; i++) {
                                                    hash = courseTitle.charCodeAt(i) + ((hash << 5) - hash);
                                                }
                                                const c1 = Math.abs(hash % 360);
                                                const c2 = (c1 + 60) % 360;
                                                return `linear-gradient(135deg, hsl(${c1}, 80%, 60%) 0%, hsl(${c2}, 70%, 40%) 100%)`;
                                              })()
                                            : grad.css;

                                        const isSelected = courseImage === actualCss;
                                        return (
                                            <button
                                                key={gIdx}
                                                type="button"
                                                onClick={() => setCourseImage(actualCss)}
                                                style={{ background: actualCss }}
                                                className={`h-16 rounded-xl relative transition-all border-2 ${
                                                    isSelected ? 'border-blue-600 scale-95 shadow-lg shadow-blue-200' : 'border-transparent hover:scale-105'
                                                } flex items-center justify-center p-2 text-center text-white font-black text-[10px] uppercase tracking-wider drop-shadow-md`}
                                            >
                                                {grad.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Handpicked Premium Stock Covers */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Curated Stock Cover Images</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {[
                                        { title: "Programming (Code screen)", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c" },
                                        { title: "Web Development", url: "https://images.unsplash.com/photo-1547082299-de196ea013d6" },
                                        { title: "Python Workspace", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" },
                                        { title: "Artificial Intelligence", url: "https://images.unsplash.com/photo-1677442136019-21780ecad995" },
                                        { title: "Cybersecurity", url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b" },
                                        { title: "Database / Analytics", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71" },
                                        { title: "Design / UX / UI", url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8" },
                                        { title: "Business Strategy", url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40" },
                                        { title: "Finance / Charts", url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44" },
                                        { title: "Photography & Video", url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32" },
                                        { title: "Science & Research", url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb" },
                                        { title: "Creative Workspace", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3" }
                                    ].map((item, idx) => {
                                        const isSelected = courseImage === item.url;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setCourseImage(item.url)}
                                                className={`aspect-[4/3] rounded-2xl relative overflow-hidden transition-all border-4 ${
                                                    isSelected ? 'border-blue-600 scale-95 shadow-lg shadow-blue-200' : 'border-transparent hover:scale-105'
                                                }`}
                                            >
                                                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                                <div className="absolute bottom-0 left-0 w-full bg-black/60 px-3 py-1.5 text-left text-white text-[9px] font-black uppercase tracking-wider">
                                                    {item.title}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end flex-shrink-0 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setIsImageModalOpen(false)}
                                className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg text-sm"
                            >
                                Apply & Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default CourseBuilder;
