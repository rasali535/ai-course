import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Check, Users, Target, Rocket, Heart } from 'lucide-react';

const About = () => {
    const values = [
        {
            title: "Student Success First",
            description: "Our mission is built on the success of the students who learn on our platform. Every feature we build is designed to improve learning outcomes.",
            icon: <Heart className="w-6 h-6 text-red-500" />
        },
        {
            title: "Creator Empowerment",
            description: "We provide the tools so you can focus on your expertise. We handle the infrastructure, so you can build your legacy.",
            icon: <Target className="w-6 h-6 text-blue-500" />
        },
        {
            title: "Relentless Innovation",
            description: "From AI content generation to mobile learning, we are committed to providing the most advanced education technology in the world.",
            icon: <Rocket className="w-6 h-6 text-purple-500" />
        },
        {
            title: "One Community",
            description: "We believe in the power of social learning. We build bridges between creators and students through deep engagement tools.",
            icon: <Users className="w-6 h-6 text-green-500" />
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-20">
            <Header />

            {/* Hero Section */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
                        Democratizing <span className="text-blue-600">Education</span> <br className="hidden md:block" /> for Everyone.
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        LearnFlow was founded with a single mission: to provide the infrastructure for experts to transform their knowledge into impact, revenue, and lasting student success.
                    </p>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gray-50 border-y border-gray-100 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        <div>
                            <div className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">35,000+</div>
                            <div className="text-sm font-bold text-blue-600 uppercase tracking-widest">Active Creators</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">12M+</div>
                            <div className="text-sm font-bold text-blue-600 uppercase tracking-widest">Global Students</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">150+</div>
                            <div className="text-sm font-bold text-blue-600 uppercase tracking-widest">Countries</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">$3.7B</div>
                            <div className="text-sm font-bold text-blue-600 uppercase tracking-widest">Creator Earnings</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                <div>
                    <h2 className="text-4xl font-bold mb-8">Our Story</h2>
                    <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                        <p>
                            In 2012, we noticed a problem: experts had deep knowledge to share but lacked the technical tools to build a real business around it. They were forced to patch together different services that didn't talk to each other.
                        </p>
                        <p>
                            We built LearnFlow as the "all-in-one" solution that handles everything—from video hosting and course building to branding, sales, and mobile delivery.
                        </p>
                        <p>
                            Today, LearnFlow is the backbone of the world's most successful education businesses, powered by advanced AI and a community of millions.
                        </p>
                    </div>
                </div>
                <div className="rounded-[3rem] overflow-hidden shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200" alt="Team collaborating" className="w-full h-full object-cover" />
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 px-6 bg-gray-900 text-white rounded-t-[5rem]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold mb-4">The Values that Drive Us</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Our culture is defined by our commitment to these core principles.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {values.map((v, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-gray-800/50 border border-gray-700/50">
                                <div className="mb-6">{v.icon}</div>
                                <h3 className="text-xl font-bold mb-4">{v.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{v.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
