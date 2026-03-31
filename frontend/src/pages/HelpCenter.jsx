import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search, Book, User as UserIcon, CreditCard, Wrench, Rocket, MessageSquare, ArrowRight } from 'lucide-react';

const HelpCenter = () => {
    const categories = [
        {
            title: 'Getting Started',
            icon: <Rocket className="text-blue-600" />,
            count: 12,
            description: 'Learn how to launch your first course in 5 minutes with AI.'
        },
        {
            title: 'Creator Tools',
            icon: <Wrench className="text-purple-600" />,
            count: 24,
            description: 'Master our course builder, AI generator, and analytics.'
        },
        {
            title: 'Payments & Billings',
            icon: <CreditCard className="text-green-600" />,
            count: 8,
            description: 'Manage your subscription, payouts, and billing cycles.'
        },
        {
            title: 'Account Settings',
            icon: <UserIcon className="text-orange-600" />,
            count: 15,
            description: 'Updating your profile, roles, and connected apps.'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 pt-32 pb-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16 bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl shadow-gray-200/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="relative z-10">
                            <Badge variant="outline" className="mb-6 border-blue-600 text-blue-600 uppercase tracking-widest px-6 py-2">Help Center</Badge>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tighter uppercase italic">How can we help <span className="text-blue-600">you?</span></h1>
                            <div className="max-w-2xl mx-auto relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-600 transition-colors" size={24} />
                                <Input 
                                    className="h-16 pl-16 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-100 transition-all shadow-sm text-lg font-medium"
                                    placeholder="Search for articles, guides, or features..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                        {categories.map((cat, idx) => (
                            <Card key={idx} className="border-0 shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group bg-white cursor-pointer overflow-hidden p-4">
                                <CardHeader className="text-center pb-2">
                                    <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                                        {React.cloneElement(cat.icon, { size: 32, className: 'group-hover:text-white transition-colors' })}
                                    </div>
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Badge variant="secondary" className="text-[10px] uppercase font-black tracking-widest">{cat.count} Articles</Badge>
                                    </div>
                                    <CardTitle className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight uppercase italic">{cat.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed italic pr-2">{cat.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="bg-gray-900 rounded-[3rem] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 group overflow-hidden relative shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-transparent"></div>
                        <div className="relative z-10 flex-1">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
                                <MessageSquare className="text-white" size={24} />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic">Still need help?</h2>
                            <p className="text-gray-400 font-medium max-w-md italic">
                                Our support team is ready to scale with you. Reach out via the live chat in the dashboard or send us a message.
                            </p>
                        </div>
                        <div className="relative z-10 flex flex-col sm:flex-row gap-4">
                            <a 
                                href="mailto:support@learnflow.ai"
                                className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl flex items-center gap-3"
                            >
                                Contact Support
                                <ArrowRight size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HelpCenter;
