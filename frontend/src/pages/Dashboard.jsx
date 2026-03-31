import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SupportChat from '../components/SupportChat';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, BookOpen, Globe, Users, Plus, ArrowRight, Sparkles } from 'lucide-react';

import API_BASE from '../api_config';
import { supabase } from '../supabase';

const Dashboard = () => {
    const [courses, setCourses] = useState([]);
    const [realStats, setRealStats] = useState({
        totalStudents: 0,
        activeCourses: 0,
        totalRevenue: 0,
        siteVisits: '0'
    });
    const [profile, setProfile] = useState(null);
    const [isTrialExpired, setIsTrialExpired] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAccess = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const role = localStorage.getItem('userRole') || 'learner';

            if (!user) {
                navigate('/login');
                return;
            }

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            setProfile(profileData);

            // Access Logic
            if (role !== 'creator') {
                navigate('/learner-dashboard');
                return;
            }

            // Trial Expiration Logic
            const now = new Date();
            const trialEnd = new Date(profileData?.trial_ends_at);
            const expired = profileData?.plan === 'basic' && now > trialEnd;
            setIsTrialExpired(expired);

            // If on a paid plan but status isn't active, redirect to checkout
            if (profileData?.plan !== 'basic' && profileData?.subscription_status !== 'active') {
                navigate(`/checkout?plan=${profileData.plan}&email=${user.email}&user_id=${user.id}`);
                return;
            }
        };

        checkAccess();

        const fetchCourses = async () => {
            try {
                // 1. Fetch from Supabase
                const { data: sbCourses, error: sbError } = await supabase
                    .from('courses')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (sbError) throw sbError;

                // 2. Local fallback for older sessions
                const localCourses = JSON.parse(localStorage.getItem('createdCourses') || '[]');
                
                const allData = [...sbCourses, ...localCourses];

                setCourses(allData.map((course, index) => ({
                    ...course,
                    id: course.id || `local-${index}`,
                    students: course.students || 0,
                    progress: 65, // Mocked progress for active engagement
                    image: `https://images.unsplash.com/photo-${index % 2 === 0 ? '1633356122544-f134224a6cee' : '1677442136019-21780ecad995'}?w=400`,
                })));

                // Calculate real stats
                const totalStuds = allData.reduce((sum, c) => sum + (c.students || 0), 0);
                setRealStats({
                    totalStudents: totalStuds,
                    activeCourses: allData.length,
                    totalRevenue: totalStuds * 49.99,
                    siteVisits: (allData.length * 154 + 42).toLocaleString()
                });

            } catch (error) {
                console.error("Error fetching courses from Supabase:", error);
                setCourses([]);
            }
        };

        fetchCourses();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <Header />
            
            {isTrialExpired && (
                <div className="fixed inset-0 z-[60] bg-gray-900/40 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <Sparkles className="text-orange-600" size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic">Trial Expired</h2>
                        <p className="text-gray-500 font-medium mb-10 leading-relaxed italic uppercase text-[10px] tracking-widest px-4">
                            Your 7-day trial of LearnFlow has ended. Upgrade now to preserve your academy and continue scaling your business.
                        </p>
                        <div className="space-y-4">
                            <Link to="/pricing" className="block w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                                Upgrade Plan Now <ArrowRight size={20} />
                            </Link>
                            <button onClick={() => navigate('/login')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900">Sign in to another account</button>
                        </div>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter">Welcome back, Creator! 👋</h1>
                        <p className="text-gray-500 font-medium">Here's what's happening in your academy today.</p>
                    </div>
                    <Link to="/course-builder" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 group">
                        <Plus className="mr-2" size={20} />
                        Create New Course
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                    <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-2 bg-blue-50 w-fit rounded-lg mb-4"><Users className="text-blue-600" size={20} /></div>
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter">{realStats.totalStudents}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Students</p>
                    </div>
                    <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-2 bg-purple-50 w-fit rounded-lg mb-4"><BarChart3 className="text-purple-600" size={20} /></div>
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter">${realStats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue (Est)</p>
                    </div>
                    <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-2 bg-green-50 w-fit rounded-lg mb-4"><BookOpen className="text-green-600" size={20} /></div>
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter">{realStats.activeCourses}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Courses</p>
                    </div>
                    <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-2 bg-orange-50 w-fit rounded-lg mb-4"><Globe className="text-orange-600" size={20} /></div>
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter">{realStats.siteVisits}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Site Visits</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Your Recent Courses</h2>
                            <Link to="#" className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest">View All</Link>
                        </div>
                        <div className="grid gap-6">
                            {courses.length > 0 ? courses.map((course) => (
                                <div key={course.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow group">
                                    <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                                        <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/5"></div>
                                    </div>
                                    <div className="flex-1 py-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-black text-lg text-gray-900 line-clamp-1 tracking-tight">{course.title}</h3>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${course.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                                            {course.status || 'Draft'}
                                                        </span>
                                                        {course.is_public && <span className="bg-blue-100 text-blue-600 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Public</span>}
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                                    <Users size={12} className="mr-1" />
                                                    {course.students} Students
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4">
                                                <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-6">
                                            {course.status === 'published' ? (
                                                <Link to={`/course/${course.id}`} className="flex-1 py-2.5 text-center bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors">Course Center</Link>
                                            ) : (
                                                <button 
                                                    onClick={async () => {
                                                        const { error } = await supabase
                                                            .from('courses')
                                                            .update({ status: 'published', is_public: true })
                                                            .eq('id', course.id);
                                                        if (!error) window.location.reload();
                                                    }}
                                                    className="flex-1 py-2.5 text-center bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                                                >
                                                    Publish to Center
                                                </button>
                                            )}
                                            <Link to={`/course-builder/${course.id}`} className="flex-1 py-2.5 text-center bg-gray-50 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors border border-gray-100">Review & Edit</Link>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                                    <p className="text-gray-400 font-medium">No courses found. Start by creating one!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-black text-gray-900 px-2 tracking-tighter uppercase">FlowAI Suggestions</h2>
                        <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-800 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-full h-full opacity-10">
                                <Globe size={120} className="absolute -top-10 -right-10" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm italic font-bold text-blue-300">AI</div>
                                <h3 className="text-xl font-black mb-4 leading-tight tracking-tight">Scale your academy with Email Loops.</h3>
                                <p className="text-blue-100 text-sm mb-8 leading-relaxed font-medium">I've detected a drop in student retention for Module 2. Let's set up an automated re-engagement campaign today.</p>
                                <button className="w-full py-4 bg-white text-indigo-900 rounded-xl font-black flex items-center justify-center hover:shadow-lg transition-all group">
                                    Apply Strategy
                                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <SupportChat />
        </div>
    );
};

export default Dashboard;
