import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Users, MessageSquare, Zap, Globe, ArrowRight, Share2, Award, Heart } from 'lucide-react';

const Community = () => {
    const stats = [
        { label: 'Creators', value: '35K+' },
        { label: 'Students', value: '1.2M+' },
        { label: 'Countries', value: '120+' },
        { label: 'Live Courses', value: '85K+' }
    ];

    const events = [
        {
            title: 'AI Education Summit 2026',
            date: 'April 15, 2026',
            location: 'Virtual',
            type: 'Conference',
            description: 'The world\'s largest gathering of AI educators and instructional designers.'
        },
        {
            title: 'Botswana Creator Meetup',
            date: 'May 10, 2026',
            location: 'Gaborone',
            type: 'Local Event',
            description: 'Connect with local LearnFlow experts and local business leaders in Botswana.'
        }
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col pt-32">
            <Header />
            <main className="flex-1 pb-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-20 relative overflow-hidden p-20 rounded-[3rem] bg-gray-900 text-white">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                        <div className="relative z-10">
                            <Badge variant="outline" className="mb-6 border-blue-400 text-blue-400 uppercase tracking-widest px-6 py-2">Our Community</Badge>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tighter uppercase italic italic-8">Join the <span className="text-blue-500">Global</span> Scale.</h1>
                            <p className="text-xl text-gray-400 leading-relaxed font-medium max-w-2xl mx-auto">
                                We are more than a platform. We are a collective of knowledge-shakers and industry-makers from around the world.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="p-8 text-center bg-gray-50 rounded-[2rem] border border-transparent hover:border-blue-100 hover:shadow-xl transition-all group">
                                <div className="text-4xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors uppercase italic tracking-tighter">{stat.value}</div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 mb-20">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black text-gray-900 mb-8 uppercase italic tracking-tighter">Why Community Matters</h2>
                            <div className="flex gap-6 p-8 bg-blue-50 rounded-3xl group hover:shadow-2xl transition-all">
                                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                    <Share2 className="text-white" size={30} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black mb-2 uppercase italic tracking-widest">Collaborative Learning</h3>
                                    <p className="text-sm text-blue-900/60 font-medium italic">Share templates, prompts, and case studies with fellow creators globally.</p>
                                </div>
                            </div>
                            <div className="flex gap-6 p-8 bg-purple-50 rounded-3xl group hover:shadow-2xl transition-all">
                                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                                    <Award className="text-white" size={30} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black mb-2 uppercase italic tracking-widest">Recognition</h3>
                                    <p className="text-sm text-purple-900/60 font-medium italic">Industry-wide accreditation and badges for top-performing academies.</p>
                                </div>
                            </div>
                            <div className="flex gap-6 p-8 bg-red-50 rounded-3xl group hover:shadow-2xl transition-all">
                                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shrink-0">
                                    <Heart className="text-white" size={30} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black mb-2 uppercase italic tracking-widest">Global Support</h3>
                                    <p className="text-sm text-red-900/60 font-medium italic">Mentorship programs linking veteran creators with scale-up academies.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-3xl font-black text-gray-900 mb-8 uppercase italic tracking-tighter">Upcoming Events</h2>
                            {events.map((event, idx) => (
                                <Card key={idx} className="border-0 bg-gray-50 hover:bg-white hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                                    <CardHeader className="p-8">
                                        <div className="flex justify-between items-start mb-4">
                                            <Badge className="bg-gray-900 text-[10px] uppercase font-black">{event.type}</Badge>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{event.date}</span>
                                        </div>
                                        <CardTitle className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase italic tracking-tight mb-2">{event.title}</CardTitle>
                                        <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest mb-4">
                                            <Globe size={14} />
                                            {event.location}
                                        </div>
                                        <p className="text-gray-600 italic font-medium pr-8">{event.description}</p>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150"></div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter uppercase italic italic-12">Ready to join the network?</h2>
                        <p className="text-xl text-blue-100 font-medium mb-10 max-w-xl mx-auto italic">
                            Access our Discord community, exclusive masterclasses, and global networking events today.
                        </p>
                        <a 
                            href="https://discord.gg/learnflow"
                            className="bg-white text-gray-900 px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-100 transition-all shadow-xl shadow-blue-900/20"
                        >
                            Join Discord
                            <MessageSquare className="inline ml-3" size={24} />
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Community;
