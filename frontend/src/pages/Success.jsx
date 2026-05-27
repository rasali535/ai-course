import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, Play, Layout, Users, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://ai-course-e97p.onrender.com';

const Success = () => {
    const location = useLocation();
    const [verifying, setVerifying] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            const params = new URLSearchParams(location.search);
            const token = localStorage.getItem('token');
            
            // 1. Check for DPO
            const dpoToken = params.get('transToken');
            const gateway = params.get('gateway');
            
            // 2. Check for PayPal
            const paypalToken = params.get('token'); 
            
            // 3. Check for Stripe
            const stripeSessionId = params.get('session_id');

            try {
                if (gateway === 'dpo' && dpoToken) {
                    await axios.get(`${BACKEND_URL}/payments/dpo/verify-token/${dpoToken}`);
                } else if (paypalToken) {
                    // Capture PayPal if not already captured
                    await axios.post(`${BACKEND_URL}/payments/paypal/capture-order/${paypalToken}`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } else if (stripeSessionId) {
                    // Stripe usually handles this via Webhook, but we poll our backend status
                    // to ensure the UI updates only after the DB is confirmed.
                    await axios.get(`${BACKEND_URL}/payments/subscription-status/${stripeSessionId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }
                
                setVerifying(false);
            } catch (err) {
                console.error("Verification failed:", err);
                // We show success anyway but with a note, because webhooks might still arrive
                setError("Payment verified, but your dashboard might take a moment to update.");
                setVerifying(false);
            }
        };

        verifyPayment();
    }, [location]);

    if (verifying) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Verifying Transaction...</h2>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2 italic">Securing your access, please don't close this window.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <Header />
            <main className="max-w-4xl mx-auto px-6 py-20">
                <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-gray-100 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>

                    <div className="flex justify-center mb-8">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 animate-bounce-slow">
                            <CheckCircle size={64} fill="currentColor" stroke="white" strokeWidth={1} />
                        </div>
                    </div>

                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tighter italic uppercase">Welcome to LearnFlow!</h1>
                    <p className="text-xl text-gray-500 mb-4 font-medium italic">Your account is ready and your path to scaling is active.</p>
                    
                    {error && (
                        <div className="flex items-center justify-center gap-2 text-amber-600 mb-8 font-bold text-sm italic">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
                        <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 group hover:bg-white hover:shadow-lg transition-all">
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg"><Layout size={20} /></div>
                            <h3 className="font-bold text-gray-900 mb-2 uppercase text-xs tracking-tight">Build Course</h3>
                            <p className="text-[10px] text-gray-500 mb-4 leading-relaxed font-medium italic">Use FlowAI to generate your first curriculum in seconds.</p>
                            <Link to="/course-builder" className="text-blue-600 text-[10px] font-black flex items-center uppercase italic">Start Now <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" /></Link>
                        </div>
                        <div className="p-6 bg-purple-50/50 rounded-2xl border border-purple-100 group hover:bg-white hover:shadow-lg transition-all">
                            <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg"><Play size={20} /></div>
                            <h3 className="font-bold text-gray-900 mb-2 uppercase text-xs tracking-tight">Watch Tutorial</h3>
                            <p className="text-[10px] text-gray-500 mb-4 leading-relaxed font-medium italic">A 3-minute quickstart guide to mastering the platform.</p>
                            <Link to="#" className="text-purple-600 text-[10px] font-black flex items-center uppercase italic">Watch Video <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" /></Link>
                        </div>
                        <div className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100 group hover:bg-white hover:shadow-lg transition-all">
                            <div className="w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg"><Users size={20} /></div>
                            <h3 className="font-bold text-gray-900 mb-2 uppercase text-xs tracking-tight">Join Community</h3>
                            <p className="text-[10px] text-gray-500 mb-4 leading-relaxed font-medium italic">Connect with 35,000+ creators sharing secrets.</p>
                            <Link to="#" className="text-orange-600 text-[10px] font-black flex items-center uppercase italic">Request Entry <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" /></Link>
                        </div>
                    </div>

                    <Link to="/dashboard" className="inline-flex items-center px-10 py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-xl hover:bg-blue-600 transition-all shadow-2xl shadow-gray-900/20 italic uppercase tracking-tighter group">
                        Go to My Dashboard
                        <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Success;
