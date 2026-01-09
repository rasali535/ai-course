import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
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

                    <h1 className="text-5xl font-extrabold leading-tight mb-8">Launch your academy <br /><span
                        className="text-blue-400">in under 5 minutes.</span></h1>
                    <p className="text-xl text-gray-400 mb-12 max-w-md">Join 35,000+ creators who have built their entire business
                        on our AI learning infrastructure.</p>

                    <div className="space-y-8">
                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-blue-400">✨</div>
                            <div>
                                <p className="font-bold">No Credit Card Required</p>
                                <p className="text-sm text-gray-500">Access full features for 30 days, on us.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-blue-400">🚀</div>
                            <div>
                                <p className="font-bold">Instant Setup</p>
                                <p className="text-sm text-gray-500">Your site is live the moment you hit "Join".</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 pt-20 border-t border-white/10">
                    <p className="text-gray-500 text-sm">"LearnFlow cut my course creation time in half. The AI is a game-changer."
                    </p>
                    <div className="mt-4 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-700 mr-3 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=srgb&fm=jpg&q=85&w=100"
                                alt="Avatar" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest">Sarah Jenkins</p>
                            <p className="text-[10px] text-gray-400">Founder, DesignAcademy</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side: Form */}
            <div className="w-full lg:w-1/2 p-6 md:p-20 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                    <h2 className="text-3xl font-bold mb-2">Create Your Account</h2>
                    <p className="text-gray-500 mb-10">Choose your path and start your zero-risk trial.</p>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <label className="relative cursor-pointer">
                                <input type="radio" name="plan" className="peer hidden" defaultChecked />
                                <div
                                    className="p-4 border-2 border-gray-100 rounded-2xl peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Plan</p>
                                    <p className="font-bold text-gray-900">Basic Trial</p>
                                </div>
                                <div
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center peer-checked:opacity-100 opacity-0 transition-opacity">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLink="round" strokeLinejoin="round" strokeWidth="3"
                                            d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                            </label>
                            <label className="relative cursor-pointer">
                                <input type="radio" name="plan" className="peer hidden" />
                                <div
                                    className="p-4 border-2 border-gray-100 rounded-2xl peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all text-center">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Plan</p>
                                    <p className="font-bold text-gray-900">Pro Trial</p>
                                </div>
                                <div
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center peer-checked:opacity-100 opacity-0 transition-opacity">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLink="round" strokeLinejoin="round" strokeWidth="3"
                                            d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                            </label>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full
                                Name</label>
                            <input type="text" required
                                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email
                                Address</label>
                            <input type="email" required
                                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="john@company.com" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
                            <input type="password" required
                                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Minimum 8 characters" />
                        </div>

                        <div className="flex items-center space-x-2 py-4">
                            <input type="checkbox" required id="consent"
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <label htmlFor="consent" className="text-xs text-gray-500">I agree to the <Link to="/terms"
                                className="text-blue-600 underline">Terms</Link> and <Link to="/privacy"
                                    className="text-blue-600 underline">Privacy Policy</Link>.</label>
                        </div>

                        <button type="submit"
                            className="w-full h-14 bg-gray-900 text-white rounded-xl font-bold shadow-xl shadow-gray-500/20 hover:bg-gray-800 transition-all flex items-center justify-center group">
                            Start My 30-Day Free Trial
                            <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </form>

                    <p className="text-center mt-10 text-sm text-gray-500">Already have an account? <Link to="#"
                        className="text-blue-600 font-bold">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
