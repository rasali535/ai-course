import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShieldCheck, Lock, CreditCard, Loader2, ArrowRight, CheckCircle, Award, Sparkles, Globe, AlertTriangle } from 'lucide-react';
import { supabase } from '../supabase';
import axios from 'axios';
import { API_BASE } from '../api_config';

const BACKEND_URL = `${API_BASE}/api`;

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [currency, setCurrency] = useState('BWP');
    const [courseData, setCourseData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('paypal_account');
    const [sdkReady, setSdkReady] = useState(false);
    const [cardFieldsReady, setCardFieldsReady] = useState(false);
    const [sdkError, setSdkError] = useState(null);
    const cardFieldsRef = useRef(null);
    const paypalButtonsRendered = useRef(false);

    const [customerInfo, setCustomerInfo] = useState({
        firstName: localStorage.getItem('userName')?.split(' ')[0] || 'John',
        lastName: localStorage.getItem('userName')?.split(' ')[1] || 'Doe',
        email: localStorage.getItem('userEmail') || 'student@example.com'
    });

    const searchParams = new URLSearchParams(location.search);
    const courseId = searchParams.get('course_id');
    const planId = searchParams.get('plan');
    const userId = searchParams.get('user_id');
    const type = searchParams.get('type') || (planId ? 'subscription' : 'certificate');

    const planPrices = {
        standard: { title: "Standard Academy Plan", price: 499, description: "Full creator tools + 5 courses" },
        premium: { title: "Premium Academy Plan", price: 999, description: "Unlimited everything + AI scaling" }
    };

    const exchangeRate = 13.5;
    const computePrice = useCallback(() => {
        const basePrice = courseData?.price || 1500;
        return currency === 'USD' ? Math.round(basePrice / exchangeRate) : basePrice;
    }, [courseData, currency]);

    // Fetch course data
    useEffect(() => {
        const fetchOrderData = async () => {
            if (planId && planPrices[planId]) {
                setCourseData(planPrices[planId]);
                setFetching(false);
                return;
            }
            if (!courseId) { setFetching(false); return; }
            try {
                const { data, error } = await supabase.from('courses').select('*').eq('id', courseId).single();
                if (error) throw error;
                setCourseData(data);
            } catch (err) {
                console.error("Fetch course error:", err);
                setCourseData({ title: "AI Art Mastery", price: 1500 });
            } finally { setFetching(false); }
        };
        fetchOrderData();

        if (userId) {
            const channel = supabase.channel(`signup-confirm-checkout:${userId}`);
            channel.on('broadcast', { event: 'confirmed' }, () => { window.location.reload(); }).subscribe();
            return () => supabase.removeChannel(channel);
        }
    }, [courseId, planId, userId]);

    // Load PayPal JS SDK
    useEffect(() => {
        const loadSDK = async () => {
            try {
                const { data } = await axios.get(`${BACKEND_URL}/payments/paypal/client-id`);
                if (!data.clientId) { setSdkError('PayPal not configured'); return; }

                const existing = document.querySelector('script[data-paypal-sdk]');
                if (existing) { setSdkReady(true); return; }

                const script = document.createElement('script');
                script.src = `https://www.paypal.com/sdk/js?client-id=${data.clientId}&components=buttons,card-fields&currency=USD&intent=capture&enable-funding=venmo`;
                script.setAttribute('data-paypal-sdk', 'true');
                script.setAttribute('data-sdk-integration-source', 'developer-studio');
                script.async = true;
                script.onload = () => setSdkReady(true);
                script.onerror = () => setSdkError('Failed to load PayPal SDK');
                document.head.appendChild(script);
            } catch (err) {
                console.error('Failed to load PayPal SDK:', err);
                setSdkError('Could not initialize payment system');
            }
        };
        loadSDK();
    }, []);

    // Helper: get auth token
    const getAuthToken = async () => {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token || localStorage.getItem('token');
        if (sessionData?.session?.access_token) localStorage.setItem('token', sessionData.session.access_token);
        return token;
    };

    // Shared: create order via backend
    const createOrder = useCallback(async (isCard = false) => {
        let finalPrice = computePrice();
        let payCurrency = currency;
        if (currency === 'BWP') { finalPrice = Math.round(finalPrice / exchangeRate); payCurrency = 'USD'; }

        const token = await getAuthToken();
        const { data } = await axios.post(`${BACKEND_URL}/payments/paypal/create-order-sdk`, {
            amount: finalPrice,
            currency: payCurrency,
            description: planId || `certificate_${courseId}`,
            is_card: isCard
        }, { headers: { Authorization: `Bearer ${token}` } });

        return data.orderId;
    }, [computePrice, currency, courseId, planId]);

    // Shared: capture order via backend
    const onApprove = useCallback(async (data, actions) => {
        try {
            const token = await getAuthToken();
            const response = await axios.post(`${BACKEND_URL}/payments/paypal/capture-order/${data.orderID}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const captureData = response.data;

            // Handle INSTRUMENT_DECLINED - let payer choose another method
            const errorDetail = captureData?.details?.[0];
            if (errorDetail?.issue === 'INSTRUMENT_DECLINED' && actions) {
                return actions.restart();
            }

            if (errorDetail) {
                throw new Error(`${errorDetail.description} (${errorDetail.issue})`);
            }

            navigate('/success');
        } catch (err) {
            console.error('Capture error:', err);
            alert('Payment capture failed: ' + (err.response?.data?.detail || err.message));
        }
    }, [navigate]);

    // Render PayPal Buttons when PayPal tab is active
    useEffect(() => {
        if (!sdkReady || paymentMethod !== 'paypal_account' || !window.paypal) return;

        const container = document.getElementById('paypal-button-container');
        if (!container) return;
        container.innerHTML = '';
        paypalButtonsRendered.current = false;

        try {
            window.paypal.Buttons({
                style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'paypal', height: 55 },
                createOrder: async () => await createOrder(false),
                onApprove: async (data) => await onApprove(data),
                onError: (err) => { console.error('PayPal error:', err); alert('PayPal checkout error. Please try again.'); }
            }).render('#paypal-button-container').then(() => { paypalButtonsRendered.current = true; });
        } catch (err) { console.error('Failed to render PayPal buttons:', err); }
    }, [sdkReady, paymentMethod, createOrder, onApprove]);

    // Render Card Fields when Card tab is active
    useEffect(() => {
        if (!sdkReady || paymentMethod !== 'paypal_card' || !window.paypal) return;

        // Clean up previous fields
        ['card-number-field', 'card-expiry-field', 'card-cvv-field', 'card-name-field'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '';
        });
        cardFieldsRef.current = null;
        setCardFieldsReady(false);

        // Check if CardFields is available
        if (!window.paypal.CardFields) {
            console.warn('PayPal CardFields not available');
            setSdkError('Advanced card processing is not enabled on this PayPal account. Please use PayPal Account to pay.');
            return;
        }

        try {
            const cardFields = window.paypal.CardFields({
                createOrder: async () => await createOrder(true),
                onApprove: async (data) => await onApprove(data),
                onError: (err) => {
                    console.error('Card payment error:', err);
                    setLoading(false);
                    alert('Card payment failed. Please check your details and try again.');
                },
                style: {
                    input: { 'font-size': '16px', 'font-family': 'Inter, system-ui, sans-serif', color: '#111827' },
                    '.invalid': { color: '#ef4444' }
                }
            });

            if (cardFields.isEligible()) {
                cardFields.NameField().render('#card-name-field');
                cardFields.NumberField().render('#card-number-field');
                cardFields.ExpiryField().render('#card-expiry-field');
                cardFields.CVVField().render('#card-cvv-field');
                cardFieldsRef.current = cardFields;
                setCardFieldsReady(true);
            } else {
                setSdkError('Card payments are not available for this account. Please use PayPal Account.');
            }
        } catch (err) {
            console.error('Failed to render card fields:', err);
            setSdkError('Could not load card payment form. Please use PayPal Account.');
        }

        return () => { cardFieldsRef.current = null; setCardFieldsReady(false); };
    }, [sdkReady, paymentMethod, createOrder, onApprove]);

    // Handle card form submit - pass billing address per PayPal docs
    const handleCardSubmit = async () => {
        if (!cardFieldsRef.current) return;
        setLoading(true);
        try {
            await cardFieldsRef.current.submit({
                cardholderName: `${customerInfo.firstName} ${customerInfo.lastName}`,
                billingAddress: {
                    addressLine1: document.getElementById('card-billing-address-line-1')?.value || '',
                    addressLine2: document.getElementById('card-billing-address-line-2')?.value || '',
                    adminArea2: document.getElementById('card-billing-address-city')?.value || '',
                    countryCode: document.getElementById('card-billing-address-country-code')?.value || 'BW',
                    postalCode: document.getElementById('card-billing-address-postal-code')?.value || '',
                },
            });
        } catch (err) {
            console.error('Card submit error:', err);
            alert('Card payment failed: ' + (err.message || 'Please check your card details.'));
        } finally { setLoading(false); }
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

                    {/* Payment Interface */}
                    <div className="md:col-span-3 bg-white rounded-[3rem] p-12 border border-gray-100 shadow-xl shadow-gray-200/40">
                        {/* Payment Method Tabs */}
                        <div className="mb-10 p-2 bg-gray-50 border border-gray-100 rounded-3xl flex gap-1">
                            <button 
                                onClick={() => { setPaymentMethod('paypal_account'); setSdkError(null); }}
                                className={`flex-1 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'paypal_account' ? 'bg-white shadow-lg text-blue-600 border border-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                💠 PayPal Account
                            </button>
                            <button 
                                onClick={() => { setPaymentMethod('paypal_card'); setSdkError(null); }}
                                className={`flex-1 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'paypal_card' ? 'bg-white shadow-lg text-indigo-600 border border-indigo-50' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                💳 Visa / Debit Card
                            </button>
                        </div>

                        {/* Header */}
                        <div className="flex items-center mb-10 gap-4">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner bg-blue-50 text-blue-600">
                                {paymentMethod === 'paypal_account' ? <ShieldCheck size={32} /> : <CreditCard size={32} />}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tighter leading-none italic uppercase">
                                    {paymentMethod === 'paypal_account' ? 'PayPal Checkout' : 'Credit / Debit Card'}
                                </h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    {paymentMethod === 'paypal_account' ? 'Secure PayPal Merchant' : 'Secure Card Processing via PayPal'}
                                </p>
                            </div>
                        </div>

                        {/* Currency Note */}
                        {currency === 'BWP' && (
                            <div className="mb-8 p-5 bg-amber-50 border border-amber-100 rounded-[1.5rem] flex items-start gap-4 text-amber-800">
                                <span className="text-lg">💡</span>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-wider mb-1">Currency Note</h4>
                                    <p className="text-[10px] font-bold leading-relaxed italic">
                                        PayPal does not process BWP directly. Your payment of P{computePrice()} will be converted and processed in USD (approx. ${Math.round(computePrice() / exchangeRate)} USD) at checkout.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* SDK Error */}
                        {sdkError && (
                            <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-[1.5rem] flex items-start gap-4 text-red-700">
                                <AlertTriangle size={20} className="mt-0.5 flex-shrink-0" />
                                <p className="text-xs font-bold leading-relaxed">{sdkError}</p>
                            </div>
                        )}

                        {/* Customer Info - always visible */}
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

                        {/* ====== PAYPAL ACCOUNT TAB ====== */}
                        {paymentMethod === 'paypal_account' && (
                            <div>
                                {!sdkReady && !sdkError && (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="animate-spin text-blue-600 mr-3" size={24} />
                                        <span className="text-sm font-bold text-gray-400 italic">Loading PayPal...</span>
                                    </div>
                                )}
                                <div id="paypal-button-container" className="min-h-[60px]"></div>
                            </div>
                        )}

                        {/* ====== VISA / CARD TAB ====== */}
                        {paymentMethod === 'paypal_card' && (
                            <div>
                                {!sdkReady && !sdkError && (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="animate-spin text-indigo-600 mr-3" size={24} />
                                        <span className="text-sm font-bold text-gray-400 italic">Loading card form...</span>
                                    </div>
                                )}

                                {sdkReady && !sdkError && (
                                    <div className="space-y-5 mb-8">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">Cardholder Name</label>
                                            <div id="card-name-field" className="h-14 bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden transition-all focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-600"></div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">Card Number</label>
                                            <div id="card-number-field" className="h-14 bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden transition-all focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-600"></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">Expiry Date</label>
                                                <div id="card-expiry-field" className="h-14 bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden transition-all focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-600"></div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">CVV</label>
                                                <div id="card-cvv-field" className="h-14 bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden transition-all focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-600"></div>
                                            </div>
                                        </div>

                                        {/* Billing Address - passed to PayPal on submit */}
                                        <div className="pt-4 border-t border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 italic">Billing Address</p>
                                            <div className="space-y-3">
                                                <input 
                                                    type="text" id="card-billing-address-line-1" placeholder="Address line 1"
                                                    className="w-full h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none text-sm font-medium text-gray-900 transition-all"
                                                />
                                                <input 
                                                    type="text" id="card-billing-address-line-2" placeholder="Address line 2 (optional)"
                                                    className="w-full h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none text-sm font-medium text-gray-900 transition-all"
                                                />
                                                <div className="grid grid-cols-3 gap-3">
                                                    <input 
                                                        type="text" id="card-billing-address-city" placeholder="City"
                                                        className="w-full h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none text-sm font-medium text-gray-900 transition-all"
                                                    />
                                                    <input 
                                                        type="text" id="card-billing-address-country-code" placeholder="Country (BW)" defaultValue="BW"
                                                        className="w-full h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none text-sm font-medium text-gray-900 transition-all"
                                                    />
                                                    <input 
                                                        type="text" id="card-billing-address-postal-code" placeholder="Postal code"
                                                        className="w-full h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none text-sm font-medium text-gray-900 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleCardSubmit}
                                            disabled={loading || !cardFieldsReady}
                                            className="w-full h-20 text-white rounded-[1.5rem] font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4 relative overflow-hidden italic group bg-gray-900 hover:bg-blue-600 shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading && (
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                                                    <Loader2 className="animate-spin" />
                                                </div>
                                            )}
                                            <CreditCard size={24} />
                                            Pay {currency === 'USD' ? '$' : 'P'}{computePrice()} with Card
                                            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Security badges */}
                        <div className="mt-8 flex items-center justify-center gap-3 text-gray-300">
                            <Lock size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest italic">256-Bit SSL • PCI Compliant • PayPal Protected</span>
                        </div>
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
