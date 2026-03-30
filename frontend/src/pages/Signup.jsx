import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Mail, ArrowRight, Loader2, GraduationCap, PenTool } from 'lucide-react';

const API_BASE = 'http://localhost:8082';
// import API_BASE from '../api_config';

const Signup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Parse initial role from URL query (e.g., /signup?role=creator)
    const queryParams = new URLSearchParams(location.search);
    const initialRole = queryParams.get('role');
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(initialRole === 'creator' ? 'creator' : 'learner');
    const [plan, setPlan] = useState('basic');
    const [loading, setLoading] = useState(false);
    const [isSignedUp, setIsSignedUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    console.log('[DEBUG] API_BASE in Signup.jsx:', API_BASE);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await axios.post(`${API_BASE}/api/auth/signup`, {
                email,
                password,
                full_name: name,
                plan: role === 'creator' ? plan : 'basic',
                role
            });

            if (response.status === 200 || response.status === 201) {
                setIsSignedUp(true);
            }
        } catch (error) {
            console.error('Signup error:', error);
            setErrorMessage(error.response?.data?.detail || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 flex min-h-screen">
            {/* Left side: Value Prop */}
            <div className="hidden lg:flex w-1/2 bg-gray-900 text-white p-20 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
                    <div className="absolute top-1/2 -left-24 w-96 h-96 bg-purple-600 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10">
                    <Link to="/" className="flex items-center space-x-2 mb-20">
                        <div
                            className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/40">
                            L</div>
                        <span className="text-2xl font-bold">LearnFlow</span>
                    </Link>

                    <h1 className="text-5xl font-extrabold leading-tight mb-8">
                        {role === 'learner' ? 'Master your craft with' : 'Launch your academy in'} <br />
                        <span className="text-blue-400">{role === 'learner' ? 'world-class AI lessons.' : 'under 5 minutes.'}</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-12 max-w-md">
                        {role === 'learner' 
                            ? 'Gain access to the most advanced AI engineering curriculum developed by industry leaders.' 
                            : 'Join 35,000+ creators who have built their entire business on our AI learning infrastructure.'}
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-blue-400">✨</div>
                            <div>
                                <p className="font-bold">{role === 'learner' ? 'Lifetime Benefits' : 'No Credit Card Required'}</p>
                                <p className="text-sm text-gray-500">
                                    {role === 'learner' ? 'One-time access to ever-evolving lessons.' : 'Access full features for 7 days, on us.'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-blue-400">🚀</div>
                            <div>
                                <p className="font-bold">{role === 'learner' ? 'Hands-on Learning' : 'Instant Setup'}</p>
                                <p className="text-sm text-gray-500">
                                    {role === 'learner' ? 'Direct selection on any course opens in your portal.' : 'Your site is live the moment you hit "Join".'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 pt-20 border-t border-white/10">
                    <p className="text-gray-500 text-sm">
                        {role === 'learner' 
                            ? '"The curriculum is updated every week. I stayed ahead of the curve as an AI Engineer."' 
                            : '"LearnFlow cut my course creation time in half. The AI is a game-changer."'}
                    </p>
                    <div className="mt-4 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-700 mr-3 overflow-hidden">
                            <img src={role === 'learner' 
                                ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=srgb&fm=jpg&q=85&w=100"
                                : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=srgb&fm=jpg&q=85&w=100"}
                                alt="Avatar" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest">{role === 'learner' ? 'David Chen' : 'Sarah Jenkins'}</p>
                            <p className="text-[10px] text-gray-400">{role === 'learner' ? 'AI Student' : 'Founder, DesignAcademy'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side: Form */}
            <div className="w-full lg:w-1/2 p-6 md:p-20 flex flex-col justify-center bg-white lg:bg-transparent">
                <div className="max-w-md mx-auto w-full">
                    {isSignedUp ? (
                        <div className="text-center animate-in fade-in zoom-in duration-700">
                            <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                                <Mail size={48} className="text-blue-600" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Check Your Inbox!</h2>
                            <p className="text-gray-600 mb-10 leading-relaxed">
                                We've sent a verification link to <span className="font-bold text-gray-900">{email}</span>.
                                Please click the link in the email to activate your account {role === 'creator' ? 'and start your trial' : ''}.
                            </p>
                            <div className="space-y-4">
                                <Link to="/login" className="block w-full h-14 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all">
                                    Sign In After Verifying
                                </Link>
                                <button onClick={() => setIsSignedUp(false)} className="text-sm font-bold text-blue-600 uppercase tracking-widest hover:underline">
                                    Wrong email? Try again
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-3xl font-black mb-2 tracking-tighter">Create Your Account</h2>
                            <p className="text-gray-500 mb-10">Choose your role to customize your experience.</p>

                            {/* Role Selection */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <button 
                                    onClick={() => setRole('learner')}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 ${role === 'learner' ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-100 opacity-60 hover:opacity-100'}`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === 'learner' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        <GraduationCap size={20} />
                                    </div>
                                    <span className={`text-sm font-bold ${role === 'learner' ? 'text-blue-900' : 'text-gray-500'}`}>I'm a Learner</span>
                                </button>
                                <button 
                                    onClick={() => setRole('creator')}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 ${role === 'creator' ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-100 opacity-60 hover:opacity-100'}`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === 'creator' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        <PenTool size={20} />
                                    </div>
                                    <span className={`text-sm font-bold ${role === 'creator' ? 'text-blue-900' : 'text-gray-500'}`}>I'm a Creator</span>
                                </button>
                            </div>

                            <form className="space-y-5" onSubmit={handleSignup}>
                                {errorMessage && (
                                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl mb-6 italic">
                                        {errorMessage}
                                    </div>
                                )}
                                
                                {role === 'creator' && (
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <label className="relative cursor-pointer">
                                            <input type="radio" name="plan" className="peer hidden" checked={plan === 'basic'} onChange={() => setPlan('basic')} />
                                            <div className="p-4 border-2 border-gray-100 rounded-2xl peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Plan</p>
                                                <p className="font-bold text-gray-900 text-sm">Basic Trial</p>
                                            </div>
                                        </label>
                                        <label className="relative cursor-pointer">
                                            <input type="radio" name="plan" className="peer hidden" checked={plan === 'pro'} onChange={() => setPlan('pro')} />
                                            <div className="p-4 border-2 border-gray-100 rounded-2xl peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Plan</p>
                                                <p className="font-bold text-gray-900 text-sm">Pro Trial</p>
                                            </div>
                                        </label>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@company.com" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Password</label>
                                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Minimum 8 characters" />
                                </div>

                                <div className="flex items-center space-x-2 py-2">
                                    <input type="checkbox" required id="consent" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <label htmlFor="consent" className="text-[10px] text-gray-500">I agree to the <Link to="/terms" className="text-blue-600 underline">Terms</Link> and <Link to="/privacy" className="text-blue-600 underline">Privacy Policy</Link>.</label>
                                </div>

                                <button type="submit" disabled={loading} className="w-full h-14 bg-gray-900 text-white rounded-xl font-bold shadow-xl shadow-gray-500/10 hover:bg-gray-800 transition-all flex items-center justify-center group relative overflow-hidden">
                                    {loading && <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10"><Loader2 className="animate-spin" /></div>}
                                    <span className={loading ? 'opacity-0' : 'opacity-100'}>
                                        {role === 'creator' ? 'Start My 7-Day Free Trial' : 'Join the Academy'}
                                    </span>
                                    <ArrowRight size={18} className={`ml-3 group-hover:translate-x-1 transition-transform ${loading ? 'opacity-0' : 'opacity-100'}`} />
                                </button>
                            </form>

                            <p className="text-center mt-8 text-sm text-gray-500 font-medium">Already have an account? <Link to="/login" className="text-blue-600 font-black">Sign In</Link></p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Signup;
