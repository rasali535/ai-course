import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Brain, Sparkles, Wand2, MessageSquare, Layout, Globe, Zap, Shield } from 'lucide-react';

const AIResources = () => {
    const aiTools = [
        {
            title: "AI Course Outline Generator",
            description: "Generate a comprehensive course structure from just a topic title. Our AI analyzes market demand and educational best practices.",
            icon: <Layout className="w-8 h-8 text-blue-600" />,
            tag: "Course Creation"
        },
        {
            title: "AI Content & Quiz Engine",
            description: "Convert your raw notes or videos into polished lesson content, interactive quizzes, and downloadable summaries automatically.",
            icon: <Wand2 className="w-8 h-8 text-purple-600" />,
            tag: "Automation"
        },
        {
            title: "Smart Student Support AI",
            description: "A 24/7 AI assistant that answers student questions based on your course content, reducing support tickets by up to 80%.",
            icon: <MessageSquare className="w-8 h-8 text-indigo-600" />,
            tag: "Engagement"
        },
        {
            title: "FlowAI Marketing Copy",
            description: "Write high-converting sales pages, email sequences, and social media posts tailored to your specific audience in seconds.",
            icon: <Sparkles className="w-8 h-8 text-pink-600" />,
            tag: "Sales"
        },
        {
            title: "AI Video-to-Course",
            description: "Upload a video or provide a link, and our AI will extract chapters, write transcripts, and create study guides automatically.",
            icon: <Zap className="w-8 h-8 text-yellow-500" />,
            tag: "Creation"
        },
        {
            title: "1-Click AI Localization",
            description: "Instantly translate your course videos and text into 40+ languages while maintaining your original brand voice.",
            icon: <Globe className="w-8 h-8 text-green-600" />,
            tag: "Global"
        },
        {
            title: "AI Student Coach",
            description: "Personalized learning paths that adapt in real-time based on student Performance and learning style.",
            icon: <Cpu className="w-8 h-8 text-indigo-500" />,
            tag: "Experience"
        },
        {
            title: "AI Sales Agent",
            description: "A virtual assistant for your landing pages that answers questions and closes deals while you sleep.",
            icon: <Users className="w-8 h-8 text-blue-500" />,
            tag: "Growth"
        }
    ];

    const resources = [
        {
            title: "The Creator's Guide to AI",
            type: "Ebook",
            description: "Learn how top educators are using AI to double their output and revenue.",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"
        },
        {
            title: "AI Prompt Library",
            type: "Template",
            description: "A collection of proven prompts for course creation, marketing, and student engagement.",
            image: "https://images.unsplash.com/photo-1620712943543-bcc4628c71d0?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"
        },
        {
            title: "Webinar: AI for Educators",
            type: "Video",
            description: "Watch a live demonstration of LearnFlow's AI tools in action.",
            image: "https://images.unsplash.com/photo-1591115765373-520b7a217282?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"
        }
    ];

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
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-xl">
                            Try AI Tools Free
                        </Button>
                        <Button size="lg" variant="outline" className="border-gray-200 px-8 h-12 rounded-xl">
                            View AI Roadmap
                        </Button>
                    </div>
                </div>
            </section>

            {/* AI Tools Grid */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {aiTools.map((tool, index) => (
                        <Card key={index} className="border-none shadow-xl shadow-gray-200/50 hover:translate-y-[-4px] transition-transform duration-300 rounded-3xl overflow-hidden">
                            <CardHeader className="p-6 pb-0">
                                <div className="mb-4">{tool.icon}</div>
                                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{tool.tag}</div>
                                <CardTitle className="text-lg font-bold mb-1">{tool.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-2">
                                <CardDescription className="text-gray-600 text-sm leading-relaxed">
                                    {tool.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* AI Builder Mockup Section */}
            <section className="py-24 px-6 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-6">Build a whole course in <span className="text-blue-600">60 seconds</span>.</h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Why spend weeks planning when you can launch today? Our AI Assistant handles the heavy lifting so you can focus on what you teach best.
                            </p>
                            <ul className="space-y-4 mb-10">
                                <li className="flex items-center text-gray-700">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                        <Zap className="w-4 h-4 text-blue-600" />
                                    </div>
                                    Topic to Outline Generation
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                        <Zap className="w-4 h-4 text-blue-600" />
                                    </div>
                                    Automatic Script Writing
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                        <Zap className="w-4 h-4 text-blue-600" />
                                    </div>
                                    Smart Quiz Creation
                                </li>
                            </ul>
                            <Button className="h-14 px-10 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800">
                                Launch Your First AI Course
                            </Button>
                        </div>
                        <div className="relative">
                            <div className="bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl border-8 border-gray-800 h-[500px] flex flex-col">
                                <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="text-gray-500 text-xs font-mono tracking-tighter">LEARNFLOW_OS_V1.0</div>
                                </div>
                                <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-xl">
                                        <div className="text-blue-400 text-[10px] font-bold mb-1">AI AGENT</div>
                                        <div className="text-white text-sm">"I've analyzed your topic 'Modern Architecture'. Generating 8-chapter outline..."</div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-4 bg-gray-800 rounded-full w-3/4 animate-pulse"></div>
                                        <div className="h-4 bg-gray-800 rounded-full w-full animate-pulse delay-75"></div>
                                        <div className="h-4 bg-gray-800 rounded-full w-1/2 animate-pulse delay-150"></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="aspect-square bg-gray-800 rounded-2xl flex items-center justify-center">
                                            <div className="text-2xl">📽️</div>
                                        </div>
                                        <div className="aspect-square bg-gray-800 rounded-2xl flex items-center justify-center">
                                            <div className="text-2xl">📝</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <div className="bg-gray-800 rounded-full h-12 flex-1 flex items-center px-4">
                                        <span className="text-gray-500 text-sm">Ask AI anything...</span>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Roadmap Section */}
            <section className="py-24 px-6 bg-gradient-to-br from-gray-900 to-blue-900 text-white rounded-3xl mx-6 my-12 overflow-hidden relative">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
                </div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h2 className="text-4xl font-bold mb-6">The Future of Learning is Here</h2>
                    <p className="text-xl text-blue-100/80 mb-16 max-w-2xl mx-auto">
                        We're building the most advanced AI ecosystem for creators. Here's what's coming next to LearnFlow.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        <div className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                            <div className="text-blue-400 font-bold mb-2 tracking-widest text-sm uppercase">Q1 2026</div>
                            <h4 className="text-xl font-bold mb-3">AI Sentiment Analysis</h4>
                            <p className="text-gray-400 text-sm">Real-time alerts when students are struggling or losing engagement.</p>
                        </div>
                        <div className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                            <div className="text-purple-400 font-bold mb-2 tracking-widest text-sm uppercase">Q2 2026</div>
                            <h4 className="text-xl font-bold mb-3">Auto-Generated VR Labs</h4>
                            <p className="text-gray-400 text-sm">Convert text instructions into immersive VR simulations automatically.</p>
                        </div>
                        <div className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                            <div className="text-pink-400 font-bold mb-2 tracking-widest text-sm uppercase">Q3 2026</div>
                            <h4 className="text-xl font-bold mb-3">LearnFlow Neural Link</h4>
                            <p className="text-gray-400 text-sm">Our most advanced API for deep integration with third-party AI models.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Resources */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Latest AI Resources</h2>
                            <p className="text-gray-600">Free educational content to help you master AI-driven teaching.</p>
                        </div>
                        <Button variant="ghost" className="text-blue-600 font-bold hidden md:flex items-center">
                            See all resources <Zap className="ml-2 w-4 h-4" />
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {resources.map((res, index) => (
                            <div key={index} className="group cursor-pointer">
                                <div className="rounded-2xl overflow-hidden mb-6 aspect-video relative shadow-lg">
                                    <img src={res.image} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900">
                                        {res.type}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{res.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{res.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust & Ethics */}
            <section className="py-20 px-6 border-t border-gray-100">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-blue-50/50 p-10 rounded-[3rem] border border-blue-100/50">
                        <Shield className="w-12 h-12 text-blue-600 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold mb-4">Transparent & Ethical AI</h2>
                        <p className="text-gray-600 leading-relaxed mb-0">
                            Your content is yours. We never use your intellectual property to train our general AI models. All AI-generated content is clearly marked, and you always maintain full editorial control.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AIResources;
