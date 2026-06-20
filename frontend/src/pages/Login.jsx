import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;
            
            if (data?.session) {

                const user = data.user;
                localStorage.setItem('token', data.session.access_token);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', user.user_metadata?.full_name || 'User');
                localStorage.setItem('userEmail', user.email);
                localStorage.setItem('userId', user.id);
                
                const role = user.user_metadata?.role || 'learner';
                localStorage.setItem('userRole', role);

                if (role === 'creator') {
                    navigate('/dashboard');
                } else {
                    navigate('/learner-dashboard');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Invalid email or password.');
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
            console.error(`${provider} login error:`, error);
            setError(error.message);
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

                    <h1 className="text-5xl font-extrabold leading-tight mb-8">Welcome Back to <br /><span
                        className="text-blue-400">LearnFlow.</span></h1>
                    <p className="text-xl text-gray-400 mb-12 max-w-md">Continue building your academy and managing your student growth with AI.</p>
                </div>

                <div className="relative z-10 pt-20 border-t border-white/10">
                    <p className="text-gray-500 text-sm">"The AI features saved me 20 hours of work every week. I can't imagine running my business without it."
                    </p>
                    <div className="mt-4 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-700 mr-3 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=srgb&fm=jpg&q=85&w=100"
                                alt="Avatar" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest">Mark Thompson</p>
                            <p className="text-[10px] text-gray-400">Founder, FinanceAcademy</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side: Form */}
            <div className="w-full lg:w-1/2 p-6 md:p-20 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                    <h2 className="text-3xl font-bold mb-2">Sign In</h2>
                    <p className="text-gray-500 mb-8">Enter your credentials to access your dashboard.</p>

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
                        <span className="bg-gray-50 lg:bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest absolute">Or continue with email</span>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 italic">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email
                                Address</label>
                            <input type="email" required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="john@company.com" />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                                <Link to="#" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Forgot?</Link>
                            </div>
                            <input type="password" required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Enter your password" />
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full h-14 bg-gray-900 text-white rounded-xl font-bold shadow-xl shadow-gray-500/10 hover:bg-gray-800 transition-all flex items-center justify-center group relative overflow-hidden">
                            {loading && <div className="absolute inset-0 bg-black/20 flex items-center justify-center"><Loader2 className="animate-spin" /></div>}
                            <span className={loading ? 'opacity-0' : 'opacity-100'}>Sign In to Dashboard</span>
                            <ArrowRight className={`ml-3 group-hover:translate-x-1 transition-transform ${loading ? 'opacity-0' : 'opacity-100'}`} size={18} />
                        </button>
                    </form>

                    <p className="text-center mt-10 text-sm text-gray-500">New to LearnFlow? <Link to="/signup"
                        className="text-blue-600 font-bold">Start 7-Day Free Trial</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
