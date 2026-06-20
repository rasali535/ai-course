import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Users, MessageSquare, Globe, Share2, Award, Heart } from 'lucide-react';

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
                    <div className="text-center mb-20 relative p-16 md:p-24 rounded-2xl bg-gray-50 border border-gray-200">
                        <div className="relative z-10">
                            <Badge variant="outline" className="mb-6 border-blue-200 text-blue-600 px-6 py-2 rounded-full font-medium">Our Community</Badge>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 tracking-tight">Join the <span className="text-blue-600">Global</span> Scale.</h1>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                                We are more than a platform. We are a collective of knowledge-shakers and industry-makers from around the world.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="p-8 text-center bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group shadow-sm">
                                <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{stat.value}</div>
                                <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 mb-20">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Why Community Matters</h2>
                            <div className="flex gap-6 p-8 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow shadow-sm">
                                <div className="w-14 h-14 bg-gray-50 text-gray-700 rounded-lg flex items-center justify-center shrink-0 border border-gray-100">
                                    <Share2 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Collaborative Learning</h3>
                                    <p className="text-gray-600 leading-relaxed">Share templates, prompts, and case studies with fellow creators globally.</p>
                                </div>
                            </div>
                            <div className="flex gap-6 p-8 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow shadow-sm">
                                <div className="w-14 h-14 bg-gray-50 text-gray-700 rounded-lg flex items-center justify-center shrink-0 border border-gray-100">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Recognition</h3>
                                    <p className="text-gray-600 leading-relaxed">Industry-wide accreditation and badges for top-performing academies.</p>
                                </div>
                            </div>
                            <div className="flex gap-6 p-8 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow shadow-sm">
                                <div className="w-14 h-14 bg-gray-50 text-gray-700 rounded-lg flex items-center justify-center shrink-0 border border-gray-100">
                                    <Heart size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Global Support</h3>
                                    <p className="text-gray-600 leading-relaxed">Mentorship programs linking veteran creators with scale-up academies.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Upcoming Events</h2>
                            {events.map((event, idx) => (
                                <Card key={idx} className="bg-white border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 overflow-hidden shadow-sm rounded-xl">
                                    <CardHeader className="p-8">
                                        <div className="flex justify-between items-start mb-4">
                                            <Badge variant="secondary" className="font-medium text-xs bg-gray-100 text-gray-700 border border-gray-200">{event.type}</Badge>
                                            <span className="text-sm font-medium text-gray-600">{event.date}</span>
                                        </div>
                                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 tracking-tight">{event.title}</CardTitle>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                                            <Globe size={16} />
                                            {event.location}
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">{event.description}</p>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 md:p-16 text-center shadow-sm">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-gray-900">Ready to join the network?</h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
                            Access our Discord community, exclusive masterclasses, and global networking events today.
                        </p>
                        <a 
                            href="https://discord.gg/learnflow"
                            className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Join Discord
                            <MessageSquare className="ml-2" size={20} />
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Community;
