import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShieldCheck, Lock, CreditCard, Loader2, ArrowRight, CheckCircle, Award, Sparkles } from 'lucide-react';
import axios from 'axios';

import API_BASE from '../api_config';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [currency, setCurrency] = useState('BWP');
    const [courseData, setCourseData] = useState(null);
    const [customerInfo, setCustomerInfo] = useState({
        firstName: localStorage.getItem('userName')?.split(' ')[0] || 'John',
        lastName: localStorage.getItem('userName')?.split(' ')[1] || 'Doe',
        email: localStorage.getItem('userEmail') || 'student@example.com'
    });

    const searchParams = new URLSearchParams(location.search);
    const courseId = searchParams.get('course_id');
    const type = searchParams.get('type') || 'subscription'; // 'subscription' or 'certificate'

    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) {
                setFetching(false);
                return;
            }
            try {
                const res = await axios.get(`${API_BASE}/api/courses/${courseId}`);
                setCourseData(res.data);
            } catch (err) {
                console.error("Fetch course error:", err);
                // Fallback demo
                setCourseData({ title: "AI Art Mastery", price: 1500 });
            } finally {
                setFetching(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    const exchangeRate = 13.5;
    const computePrice = () => {
        const basePrice = courseData?.price || 1500;
        return currency === 'USD' ? Math.round(basePrice / exchangeRate) : basePrice;
    };

    const handleDPOPayment = async () => {
        setLoading(true);
        const finalPrice = computePrice();
        
        try {
            // 1. Create DPO Token
            const response = await axios.post(`${API_BASE}/api/payments/dpo/create-token`, {
                amount: finalPrice,
                currency: currency,
                service_description: type === 'certificate' ? `Certificate Collection: ${courseData?.title}` : `Subscription: ${courseData?.title}`,
                customer_email: customerInfo.email,
                customer_first_name: customerInfo.firstName,
                customer_last_name: customerInfo.lastName,
                redirect_url: `${window.location.origin}/success`,
                back_url: `${window.location.origin}/checkout`
            });

            const { result, paymentUrl, transToken, resultExplanation } = response.data;

            if (result === "000") {
                // 2. Perform Post-Payment Backend Action
                const token = localStorage.getItem('token');
                if (token && courseId) {
                    if (type === 'certificate') {
                        // Mark Certificate as Paid
                        await axios.post(`${API_BASE}/api/enrollments/pay-certificate?course_id=${courseId}`, {}, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                    } else {
                        // Regular Enrollment
                        await axios.post(`${API_BASE}/api/enrollments/`, {
                            user_id: localStorage.getItem('userId') || 'current',
                            course_id: parseInt(courseId)
                        }, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                    }
                }

                // 3. User Notification & Redirect
                alert(`Payment Initialized: ${resultExplanation}\nCurrency: ${currency}\nAmount: ${finalPrice}`);
                navigate('/learner-dashboard');
            } else {
                alert(`Payment creation failed: ${resultExplanation}`);
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Failed to initiate payment. " + (error.response?.data?.detail || ""));
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="min-h-screen flex items-center justify-center animate-pulse text-gray-400 font-black italic uppercase tracking-widest">Staging Checkout...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 font-sans overflow-x-hidden">
            <Header />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16 relative">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-20">
                        <Sparkles size={100} className="text-blue-600" />
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic mb-4">
                        {type === 'certificate' ? 'Secure Certification' : 'Academy Growth Plan'}
                    </h1>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                        {type === 'certificate' ? 'Final step to collect your verified credentials' : 'Official payment partner for Botswana & International transactions'}
                    </p>
                </div>

                <div className="grid md:grid-cols-5 gap-12 items-start">
                    {/* Order Summary */}
                    <div className="md:col-span-2 bg-gray-900 rounded-[2.5rem] shadow-2xl p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-full opacity-10">
                            <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-600 rounded-full blur-[100px]"></div>
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-10 pb-10 border-b border-white/10">
                                {type === 'certificate' ? <Award className="text-blue-400" size={32} /> : <CreditCard className="text-blue-400" size={32} />}
                                <h2 className="text-2xl font-black italic tracking-tighter">Order Summary</h2>
                            </div>
                            
                            <div className="space-y-8 flex-grow">
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 italic">Product</p>
                                    <h3 className="text-xl font-bold tracking-tight">{courseData?.title}</h3>
                                    <p className="text-xs text-gray-400 mt-1 italic">{type === 'certificate' ? 'Lifetime Official Certificate' : 'Full Lifetime Access'}</p>
                                </div>

                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 italic">Payment Currency</label>
                                    <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
                                        <button 
                                            onClick={() => setCurrency('BWP')}
                                            className={`flex-1 py-3 px-4 rounded-lg text-xs font-black transition-all italic ${currency === 'BWP' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            🇧🇼 BWP
                                        </button>
                                        <button 
                                            onClick={() => setCurrency('USD')}
                                            className={`flex-1 py-3 px-4 rounded-lg text-xs font-black transition-all italic ${currency === 'USD' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            🇺🇸 USD
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-10 border-t border-white/10">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Total Due</span>
                                    <span className="text-4xl font-black text-blue-400 tracking-tighter italic">
                                        {currency === 'USD' ? '$' : 'P'}{computePrice()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DPO Interface */}
                    <div className="md:col-span-3 bg-white rounded-[3rem] p-12 border border-gray-100 shadow-xl shadow-gray-200/40">
                        <div className="flex items-center mb-10 gap-4">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tighter leading-none italic uppercase">Direct Pay Online</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Verified Gateway Merchant</p>
                            </div>
                        </div>

                        <div className="space-y-6 mb-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">Student First Name</label>
                                    <input 
                                        type="text" 
                                        value={customerInfo.firstName}
                                        onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                                        className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none font-bold text-gray-900 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">Last Name</label>
                                    <input 
                                        type="text" 
                                        value={customerInfo.lastName}
                                        onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                                        className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none font-bold text-gray-900 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">Billing Email</label>
                                <input 
                                    type="email" 
                                    value={customerInfo.email}
                                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                                    className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none font-bold text-gray-900 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                            <div className="p-5 bg-blue-50 border border-blue-100 rounded-[1.5rem] flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm font-bold text-[10px]">MD</div>
                                <p className="text-[10px] text-blue-800 font-bold leading-tight italic">Supports Mobile Money in Botswana (Orange/Mascom).</p>
                            </div>
                            <div className="p-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-600 shadow-sm font-bold text-[10px]">CC</div>
                                <p className="text-[10px] text-gray-600 font-bold leading-tight italic">Supports Visa, Mastercard & International Debit.</p>
                            </div>
                        </div>

                        <button
                            onClick={handleDPOPayment}
                            disabled={loading}
                            className="w-full h-20 bg-gray-900 hover:bg-blue-600 text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-gray-200 transition-all flex items-center justify-center gap-4 relative overflow-hidden italic group"
                        >
                            {loading && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                                    <Loader2 className="animate-spin" />
                                </div>
                            )}
                            Claim Official Certificate
                            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="mt-12 flex justify-center items-center gap-8 opacity-40">
                    <div className="flex items-center gap-2">
                        <Lock size={14} className="text-gray-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest italic">256-Bit SSL Secured</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest italic">Official Certification Merchant</span>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;
