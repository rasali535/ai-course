import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Check, Mail, Phone, MapPin, Globe, ArrowRight } from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
                        We're here to help you <span className="text-blue-600">grow</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Whether you're just starting out or scaling a global education business, our team is ready to support you.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Contact Information */}
                    <div>
                        <h2 className="text-3xl font-bold mb-8">Get in touch</h2>
                        <div className="space-y-10">
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mr-6 flex-shrink-0">
                                    <Mail className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Email us</h4>
                                    <p className="text-gray-600 mb-2">Our friendly team is here to help.</p>
                                    <a href="mailto:support@learnflow.ai" className="text-blue-600 font-bold hover:underline">support@learnflow.ai</a>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mr-6 flex-shrink-0">
                                    <Globe className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Global Support</h4>
                                    <p className="text-gray-600 mb-2">24/7 support for all enterprise customers.</p>
                                    <p className="text-gray-900 font-medium">Available in over 40 languages.</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mr-6 flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Visit our HQ</h4>
                                    <p className="text-gray-600 mb-2">Come say hello at our main office.</p>
                                    <p className="text-gray-900 font-medium">123 Learning Lane, EdTech Valley, CA 94043</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 p-8 bg-blue-600 rounded-3xl text-white">
                            <h3 className="text-2xl font-bold mb-4">Want a demo?</h3>
                            <p className="text-blue-100 mb-8 leading-relaxed">
                                See how LearnFlow can transform your expertise into a thriving education business. Let one of our learning experts show you the way.
                            </p>
                            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 h-14 rounded-2xl w-full sm:w-auto">
                                Schedule a Demo <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
                        <h3 className="text-2xl font-bold mb-8">Send us a message</h3>
                        <form className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">First Name</label>
                                    <input type="text" className="w-full h-14 bg-gray-50 border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Jane" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Last Name</label>
                                    <input type="text" className="w-full h-14 bg-gray-50 border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Email Address</label>
                                <input type="email" className="w-full h-14 bg-gray-50 border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="jane@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Topic</label>
                                <select className="w-full h-14 bg-gray-50 border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                    <option>General Inquiry</option>
                                    <option>Sales & Pricing</option>
                                    <option>Technical Support</option>
                                    <option>Partnerships</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Message</label>
                                <textarea className="w-full h-40 bg-gray-50 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" placeholder="Tell us about your project..."></textarea>
                            </div>
                            <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/20">
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
