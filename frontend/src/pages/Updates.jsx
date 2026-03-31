import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Bell, Sparkles, Rocket, Zap, Globe } from 'lucide-react';

const Updates = () => {
    const news = [
        {
            date: 'March 31, 2026',
            title: 'Real-time Support Hub Launched',
            category: 'Feature',
            description: 'We have introduced a dynamic support chat system available directly in the creator dashboard for instant assistance.',
            icon: <Zap className="text-blue-600" />
        },
        {
            date: 'March 15, 2026',
            title: 'Gemini 2.0 Flash Integration',
            category: 'AI Engine',
            description: 'Enhanced our AI course generation engine with Gemini 2.0 Flash for 2x faster content creation.',
            icon: <Sparkles className="text-purple-600" />
        },
        {
            date: 'March 01, 2026',
            title: 'Global Payments with DPO',
            category: 'Infrastructure',
            description: 'Integrated DPO payment gateway to support creators across Africa and beyond with seamless transactions.',
            icon: <Globe className="text-green-600" />
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <Badge variant="outline" className="mb-4 border-blue-600 text-blue-600 uppercase tracking-widest px-4 py-1">What's New</Badge>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Product Updates</h1>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                            The latest features, improvements, and news from the LearnFlow team.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {news.map((item, idx) => (
                            <Card key={idx} className="border-0 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                                <CardHeader className="flex flex-row items-center gap-6 p-8 pb-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center group-hover:bg-white group-hover:shadow-lg transition-all">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <Badge className="bg-gray-900 text-[10px] uppercase font-black">{item.category}</Badge>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.date}</span>
                                        </div>
                                        <CardTitle className="text-2xl font-black text-gray-900 tracking-tight">{item.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 pt-0">
                                    <p className="text-gray-600 leading-relaxed font-medium">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Updates;
