import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import { CheckCircle, Mail, ArrowRight, Loader2, GraduationCap, PenTool } from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Parse initial role from URL query (e.g., /signup?role=creator)
    const queryParams = new URLSearchParams(location.search);
    const initialRole = queryParams.get('role');
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(initialRole === 'learner' ? 'learner' : 'creator');
    const [plan, setPlan] = useState('basic');
    const [loading, setLoading] = useState(false);
    const [isSignedUp, setIsSignedUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        role: role,
                        plan: role === 'creator' ? plan : 'basic',
                    }
                }
            });

            if (error) throw error;

            if (data?.user) {
                if (role === 'creator' && plan !== 'basic') {
                    // Redirect to checkout for paid plans
                    navigate(`/checkout?plan=${plan}&email=${email}&user_id=${data.user.id}`);
                } else {
                    setIsSignedUp(true);
                }
            }
        } catch (error) {
            console.error('Signup error:', error);
            setErrorMessage(error.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthLogin = async (provider) => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
            });
            if (error) throw error;
        } catch (error) {
            console.error(`${provider} signup error:`, error);
            setErrorMessage(error.message);
        }
    };

    // Auto-login listener for cross-device verification
    useEffect(() => {
        if (!isSignedUp || !email) return;

        const channel = supabase.channel(`signup-confirm:${email}`);
        channel.on('broadcast', { event: 'confirmed' }, async () => {
            console.log("PC: Received confirmation from other device!");
            // Automatically sign in
            const { data, error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (!loginError && data?.session) {
                const user = data.user;
                localStorage.setItem('token', data.session.access_token);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', user.user_metadata?.full_name || 'User');
                localStorage.setItem('userEmail', user.email);
                localStorage.setItem('userId', user.id);
                localStorage.setItem('userRole', user.user_metadata?.role || 'learner');

                const role = user.user_metadata?.role || 'learner';
                if (role === 'creator') {
                    navigate('/dashboard');
                } else {
                    navigate('/learner-dashboard');
                }
            }
        }).subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isSignedUp, email, password, navigate]);

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
                            <p className="text-gray-500 mb-8">Choose your role to customize your experience.</p>

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

                            </div>

                            <div className="flex flex-col gap-3 mb-6">
                                <button type="button" onClick={() => handleOAuthLogin('google')} className="w-full h-12 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </button>
                                <button type="button" onClick={() => handleOAuthLogin('github')} className="w-full h-12 bg-gray-900 text-white rounded-xl font-bold shadow-sm hover:bg-gray-800 transition-all flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                                    </svg>
                                    Continue with GitHub
                                </button>
                            </div>

                            <div className="relative flex items-center justify-center my-8">
                                <div className="border-t border-gray-200 w-full"></div>
                                <span className="bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest absolute">Or sign up with email</span>
                            </div>

                            <form className="space-y-5" onSubmit={handleSignup}>
                                {errorMessage && (
                                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl mb-6 italic">
                                        {errorMessage}
                                    </div>
                                )}
                                
                                {role === 'creator' && (
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        <label className="relative cursor-pointer">
                                            <input type="radio" name="plan" className="peer hidden" checked={plan === 'basic'} onChange={() => setPlan('basic')} />
                                            <div className="p-3 border-2 border-gray-100 rounded-xl peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all h-full">
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Trial</p>
                                                <p className="font-bold text-gray-900 text-[11px]">7-Day Free</p>
                                            </div>
                                        </label>
                                        <label className="relative cursor-pointer">
                                            <input type="radio" name="plan" className="peer hidden" checked={plan === 'standard'} onChange={() => setPlan('standard')} />
                                            <div className="p-3 border-2 border-gray-100 rounded-xl peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all h-full">
                                                <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Plan</p>
                                                <p className="font-bold text-gray-900 text-[11px]">Standard</p>
                                            </div>
                                        </label>
                                        <label className="relative cursor-pointer">
                                            <input type="radio" name="plan" className="peer hidden" checked={plan === 'premium'} onChange={() => setPlan('premium')} />
                                            <div className="p-3 border-2 border-gray-100 rounded-xl peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all h-full">
                                                <p className="text-[8px] font-black text-purple-400 uppercase tracking-widest mb-1">Plan</p>
                                                <p className="font-bold text-gray-900 text-[11px]">Premium</p>
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
