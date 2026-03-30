import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Brain, Sparkles, Wand2, MessageSquare, Layout, Globe, Zap, Shield, Cpu, Users, X, Send, Loader2 } from 'lucide-react';

import API_BASE from '../api_config';
import { supabase } from '../supabase';

const AIResources = () => {
    const [selectedTool, setSelectedTool] = useState(null);
    const [toolInput, setToolInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [toolResult, setToolResult] = useState(null);

    const aiTools = [
        {
            id: 'outline',
            title: "AI Course Outline Generator",
            description: "Generate a comprehensive course structure from just a topic title. Our AI analyzes market demand and educational best practices.",
            icon: <Layout className="w-8 h-8 text-blue-600" />,
            tag: "Course Creation",
            prompt: "What is the topic of your course?",
            placeholder: "e.g. Advanced Photography, Personal Finance 101..."
        },
        {
            id: 'copy',
            title: "Smart Marketing Copy",
            description: "Write high-converting sales pages, email sequences, and social media posts tailored to your specific audience in seconds.",
            icon: <Sparkles className="w-8 h-8 text-pink-600" />,
            tag: "Sales",
            prompt: "Describe your course and your target audience.",
            placeholder: "e.g. A course on React for beginners who want to get a job..."
        },
        {
            id: 'support',
            title: "Student Support AI",
            description: "A 24/7 AI assistant that answers student questions based on your course content, reducing support tickets by up to 80%.",
            icon: <MessageSquare className="w-8 h-8 text-indigo-600" />,
            tag: "Engagement",
            prompt: "Ask a question about your course (Simulated)",
            placeholder: "e.g. How do I access the course materials?"
        },
        {
            id: 'video',
            title: "AI Video-to-Course",
            description: "Upload a video or provide a link, and our AI will extract chapters, write transcripts, and create study guides automatically.",
            icon: <Zap className="w-8 h-8 text-yellow-500" />,
            tag: "Creation",
            prompt: "Paste a YouTube link or Video title",
            placeholder: "e.g. https://youtube.com/watch?v=..."
        },
        {
            id: 'quiz',
            title: "AI Quiz Engine",
            description: "Convert your raw notes or videos into polished lesson content, interactive quizzes, and downloadable summaries automatically.",
            icon: <Wand2 className="w-8 h-8 text-purple-600" />,
            tag: "Automation",
            prompt: "Paste your lesson text to generate a quiz.",
            placeholder: "e.g. In this lesson, we cover the basics of..."
        }
    ];

    const handleToolClick = (tool) => {
        setSelectedTool(tool);
        setToolResult(null);
        setToolInput('');
    };

    const runTool = async () => {
        if (!toolInput) return;
        setIsGenerating(true);
        setToolResult(null); // Clear previous result

        try {
            if (selectedTool.id === 'outline') {
                // Real API Call to Supabase Edge Function (Full Course with Quizzes)
                const { data: functionData, error: functionError } = await supabase.functions.invoke('generate-full-course', {
                    body: { 
                        topic: toolInput, 
                        user_id: localStorage.getItem('userId') || 'guest_user' 
                    }
                });

                if (functionError) throw functionError;
                
                const courseData = functionData.course.content;

                // Store full object for "Create Course" action
                // But specifically for display, we just want the module titles
                const moduleTitles = courseData.modules.map(m => m.title);
                setToolResult(moduleTitles);

                // Temporarily store full data in state or a ref if needed for "Edit in Builder"
                // For simplicity, we'll just attach it to the selectedTool object momentarily or use a separate state
                // Ideally use a dedicated state:
                window.tempDatGeneratedCourse = courseData;

            } else {
                // Fallback for other tools not yet implemented in backend
                await new Promise(resolve => setTimeout(resolve, 2000));
                setToolResult([
                    "Analysis Complete: Your content has been optimized.",
                    "Suggestion: Add more interactive elements to Module 2.",
                    "Insight: Students engage 40% more with video content."
                ]);
            }
        } catch (error) {
            console.error("Generation failed:", error);
            setToolResult(["Error: Failed to generate content. Please try again later."]);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCreateCourseFromAI = () => {
        // Use the real generated data if available
        if (selectedTool.id === 'outline' && window.tempDatGeneratedCourse) {
            const draftCourse = {
                ...window.tempDatGeneratedCourse,
                id: `draft-${Date.now()}`,
                createdAt: new Date().toISOString()
            };

            const existing = JSON.parse(localStorage.getItem('createdCourses') || '[]');
            localStorage.setItem('createdCourses', JSON.stringify([draftCourse, ...existing]));

            // Navigate to the builder for this new draft
            window.location.href = `#/course-builder/${draftCourse.id}`;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <Header />

            {/* Hero Section */}
            <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold mb-6">
                        <Brain className="w-4 h-4 mr-2" />
                        AI-POWERED EDUCATION
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
                        Design Your Future with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">LearnFlow AI</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Harness the power of artificial intelligence to create better content faster, engage your students deeper, and grow your revenue smarter.
                    </p>
                </div>
            </section>

            {/* AI Tools Grid */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold mb-10 text-center">Try our Live AI Toolkits</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {aiTools.map((tool, index) => (
                        <div key={index} onClick={() => handleToolClick(tool)} className="cursor-pointer">
                            <Card className="border-none shadow-xl shadow-gray-200/50 hover:translate-y-[-4px] transition-all duration-300 rounded-3xl overflow-hidden h-full group bg-white hover:bg-blue-600 hover:text-white">
                                <CardHeader className="p-6 pb-0">
                                    <div className="mb-4 bg-gray-50 group-hover:bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center transition-colors">{tool.icon}</div>
                                    <div className="text-[10px] font-bold text-blue-600 group-hover:text-blue-100 uppercase tracking-widest mb-1">{tool.tag}</div>
                                    <CardTitle className="text-lg font-bold mb-1">{tool.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-2">
                                    <CardDescription className="text-gray-600 group-hover:text-blue-50 text-sm leading-relaxed">
                                        {tool.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tool Modal Simulation */}
            {selectedTool && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedTool(null)}></div>
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 md:p-12">
                            <button onClick={() => setSelectedTool(null)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors">
                                <X size={24} />
                            </button>

                            <div className="flex items-center space-x-4 mb-8">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">{selectedTool.icon}</div>
                                <div>
                                    <h3 className="text-2xl font-bold">{selectedTool.title}</h3>
                                    <p className="text-gray-500 text-sm">{selectedTool.tag}</p>
                                </div>
                            </div>

                            {!toolResult ? (
                                <div className="space-y-6">
                                    <p className="text-gray-600">{selectedTool.prompt}</p>
                                    <textarea
                                        value={toolInput}
                                        onChange={(e) => setToolInput(e.target.value)}
                                        className="w-full h-32 bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                        placeholder={selectedTool.placeholder}
                                    ></textarea>
                                    <Button
                                        onClick={runTool}
                                        disabled={isGenerating || !toolInput}
                                        className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg flex items-center justify-center"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="mr-2 animate-spin" />
                                                Generating with LearnFlow AI...
                                            </>
                                        ) : (
                                            <>
                                                Run Generator <Send className="ml-2" size={18} />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                                        <h4 className="font-bold text-blue-900 mb-4 flex items-center">
                                            <Sparkles className="mr-2" size={18} /> AI Generated Suggestions
                                        </h4>
                                        <ul className="space-y-3">
                                            {toolResult.map((res, i) => (
                                                <li key={i} className="text-gray-700 font-medium flex items-start">
                                                    <span className="text-blue-500 mr-2 mt-1">●</span>
                                                    {res}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex gap-4">
                                        <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setToolResult(null)}>
                                            Try Another Topic
                                        </Button>
                                        <Link to="/course-builder" className="flex-1">
                                            <Button
                                                onClick={handleCreateCourseFromAI}
                                                className="w-full h-12 bg-gray-900 text-white rounded-xl font-bold"
                                            >
                                                {selectedTool.id === 'outline' ? 'Edit in Course Builder' : 'Go to Course Builder'}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* AI Roadmap Section */}
            <section id="ai-roadmap" className="py-24 px-6 bg-gradient-to-br from-gray-900 to-blue-900 text-white rounded-3xl mx-6 my-12 overflow-hidden relative">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
                </div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h2 className="text-4xl font-bold mb-6">The Future of Education</h2>
                    <p className="text-xl text-blue-100/80 mb-16 max-w-2xl mx-auto">
                        We're building the most advanced AI ecosystem for creators. Here's what's coming next to LearnFlow.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        <div className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                            <div className="text-blue-400 font-bold mb-2 tracking-widest text-sm uppercase">Phase 1</div>
                            <h4 className="text-xl font-bold mb-3">AI Sentiment Analysis</h4>
                            <p className="text-gray-400 text-sm">Real-time alerts when students are struggling or losing engagement.</p>
                        </div>
                        <div className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                            <div className="text-purple-400 font-bold mb-2 tracking-widest text-sm uppercase">Phase 2</div>
                            <h4 className="text-xl font-bold mb-3">Auto-Generated VR Labs</h4>
                            <p className="text-gray-400 text-sm">Convert text instructions into immersive VR simulations automatically.</p>
                        </div>
                        <div className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                            <div className="text-pink-400 font-bold mb-2 tracking-widest text-sm uppercase">Phase 3</div>
                            <h4 className="text-xl font-bold mb-3">Expert Brain Sync</h4>
                            <p className="text-gray-400 text-sm">Clone your knowledge into a custom-trained model for your students.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AIResources;
