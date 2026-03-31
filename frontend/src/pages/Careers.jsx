import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Briefcase, MapPin, Globe, ArrowRight } from 'lucide-react';

const Careers = () => {
    const roles = [
        {
            title: 'Founding Engineer',
            location: 'Remote / Gaborone, Botswana',
            type: 'Full-time',
            category: 'Engineering',
            salary: '$80k - $120k + Equity'
        },
        {
            title: 'Growth Marketing Manager',
            location: 'Remote / Africa',
            type: 'Full-time',
            category: 'Marketing',
            salary: '$40k - $70k + Bonus'
        },
        {
            title: 'Customer Success Specialist',
            location: 'Remote',
            type: 'Contract / Full-time',
            category: 'Support',
            salary: 'Competitive Hourly'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 pt-32 pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge variant="outline" className="mb-4 border-blue-600 text-blue-600 uppercase tracking-widest px-4 py-1">Join the Mission</Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-8 tracking-tight italic uppercase">
                            Build the <span className="text-blue-600">future</span> of <span className="underline decoration-blue-600 decoration-8 underline-offset-8 italic">education.</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-medium">
                            LearnFlow is on a mission to democratize premium education for everyone. We're looking for bold thinkers who want to make a global impact.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-20 text-center">
                        <div className="p-8 bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50">
                            <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                                <Globe size={32} />
                            </div>
                            <h3 className="text-xl font-black mb-2 uppercase italic tracking-widest">Global</h3>
                            <p className="text-sm text-gray-500 font-medium">Remote-first culture, work from anywhere on your schedule.</p>
                        </div>
                        <div className="p-8 bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50">
                            <div className="w-16 h-16 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-purple-600">
                                <Briefcase size={32} />
                            </div>
                            <h3 className="text-xl font-black mb-2 uppercase italic tracking-widest">Purpose</h3>
                            <p className="text-sm text-gray-500 font-medium">Every line of code you write impacts millions of students globally.</p>
                        </div>
                        <div className="p-8 bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50">
                            <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-green-600">
                                <ArrowRight size={32} className="rotate-45" />
                            </div>
                            <h3 className="text-xl font-black mb-2 uppercase italic tracking-widest">Growth</h3>
                            <p className="text-sm text-gray-500 font-medium">Personal learning credit and direct mentorship from founders.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase italic tracking-tighter">Open Positions</h2>
                        {roles.map((role, idx) => (
                            <Card key={idx} className="border-0 shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 group overflow-hidden bg-white">
                                <CardHeader className="flex flex-row items-center justify-between p-8">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <Badge className="bg-gray-900 uppercase italic font-black text-[10px] tracking-widest">{role.category}</Badge>
                                            <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest">{role.type}</Badge>
                                        </div>
                                        <CardTitle className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight italic underline-offset-4 decoration-blue-600 group-hover:underline">
                                            {role.title}
                                        </CardTitle>
                                    </div>
                                    <div className="hidden md:block text-right">
                                        <p className="text-sm text-gray-900 font-black italic uppercase flex items-center justify-end gap-2">
                                            <MapPin size={14} className="text-blue-600" />
                                            {role.location}
                                        </p>
                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">{role.salary}</p>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-20 p-12 bg-gray-900 rounded-[3rem] text-center text-white relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-purple-900/40 group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black mb-4 tracking-tighter uppercase italic">Don't see your role?</h2>
                            <p className="text-gray-400 mb-8 max-w-xl mx-auto font-medium">
                                We're always on the lookout for talented, mission-driven individuals who are obsessed with building great products.
                            </p>
                            <a 
                                href="mailto:careers@learnflow.ai"
                                className="inline-flex items-center px-10 py-5 bg-white text-gray-900 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-blue-500/20"
                            >
                                Drop us a line
                                <ArrowRight className="ml-3" size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Careers;
