import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Check, Shield, Zap, Globe, Cpu, Users, BarChart3, AppWindow } from 'lucide-react';

const Features = () => {
    const mainFeatures = [
        {
            title: "Course Builder",
            description: "Drag-and-drop builder for videos, PDFs, and assessments.",
            icon: <Cpu className="w-6 h-6 text-blue-600" />,
            details: ["Multimedia support", "AI lesson generation", "Prerequisite lessons"]
        },
        {
            title: "FlowCommerce",
            description: "Direct payment processing and tax management.",
            icon: <Zap className="w-6 h-6 text-purple-600" />,
            details: ["Subscriptions", "Payment plans", "Coupon codes"]
        },
        {
            title: "Site Builder",
            description: "No-code templates for branded homepages and checkouts.",
            icon: <Globe className="w-6 h-6 text-indigo-600" />,
            details: ["Custom domains", "Mobile responsive", "SSL security"]
        },
        {
            title: "Mobile App",
            description: "Branded iOS and Android apps for learning on the go.",
            icon: <AppWindow className="w-6 h-6 text-pink-600" />,
            details: ["Offline access", "Push notifications", "App Store Presence"]
        },
        {
            title: "Engagement Tools",
            description: "Communities, drip content, and certifications.",
            icon: <Users className="w-6 h-6 text-green-600" />,
            details: ["Discussion boards", "Graded quizzes", "Automated certificates"]
        },
        {
            title: "Analytics",
            description: "Deep insights into student progress and revenue.",
            icon: <BarChart3 className="w-6 h-6 text-orange-600" />,
            details: ["Group reports", "Engagement tracking", "ROI Export"]
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-20">
            <Header />

            {/* Hero */}
            <section className="py-24 px-6 bg-gradient-to-br from-white to-blue-50/50">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6">
                        The standard in <span className="text-blue-600">EdTech</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        A comprehensive suite of tools designed to build world-class learning experiences and scale your educational impact.
                    </p>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mainFeatures.map((f, i) => (
                        <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:border-blue-200 transition-colors group">
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-50 transition-colors">
                                {f.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">{f.description}</p>
                            <ul className="space-y-3">
                                {f.details.map((detail, di) => (
                                    <li key={di} className="flex items-center text-sm font-medium text-gray-700">
                                        <Check className="w-4 h-4 text-blue-600 mr-3" /> {detail}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Comparison/Callout */}
            <section className="py-24 px-6 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-10 shadow-2xl shadow-blue-500/20">
                        <Zap className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold mb-8 italic">Ready to see the future of learning?</h2>
                    <p className="text-gray-400 max-w-2xl mb-12 text-lg">
                        Join the 35,000+ businesses who have already switched to LearnFlow. Our platform provides everything you need to grow—no plugins or extra developers required.
                    </p>
                    <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-12 h-16 rounded-2xl text-xl">
                        Start Free Now
                    </Button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Features;
