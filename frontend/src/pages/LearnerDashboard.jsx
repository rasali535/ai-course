import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { BookOpen, GraduationCap, Clock, CheckCircle, ChevronRight, Layout, Play, Lock, AlertCircle, Award, CreditCard, Sparkles } from 'lucide-react';
import API_BASE from '../api_config';

const LearnerDashboard = () => {
    const [user, setUser] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trialStatus, setTrialStatus] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                // Fetch User Profile
                const userRes = await axios.get(`${API_BASE}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(userRes.data);

                // Check Trial Status (Creators only)
                if (userRes.data.role === 'creator' && userRes.data.trial_ends_at) {
                    const expiry = new Date(userRes.data.trial_ends_at);
                    const now = new Date();
                    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
                    setTrialStatus({
                        isExpired: diffDays <= 0,
                        daysLeft: Math.max(0, diffDays),
                        expiryDate: expiry.toLocaleDateString()
                    });
                }

                // Fetch Enrollments
                const enrollRes = await axios.get(`${API_BASE}/api/enrollments/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEnrollments(enrollRes.data);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                // Mock data for demo
                setUser({ full_name: "Learner", email: "student@example.com", role: "learner" });
                setEnrollments([
                    { id: '1', course_id: 1, title: 'AI Engineering', is_completed: true, is_paid: false, price: 1500 },
                    { id: '2', course_id: 2, title: 'Python Patterns', is_completed: false, is_paid: false, progress: 45 }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const completedUnpaid = enrollments.filter(e => e.is_completed && !e.is_paid);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 font-sans">
            <Header />

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                    <div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2 italic">Dashboard</h1>
                        <p className="text-gray-500 font-bold tracking-tight uppercase text-xs">
                            Welcome back, <span className="text-blue-600 underline underline-offset-4 decoration-blue-600/20">{user?.full_name}</span>
                        </p>
                    </div>
                    
                    {user?.role === 'creator' && trialStatus && !trialStatus.isExpired && (
                        <div className="bg-blue-600 text-white rounded-[2rem] px-8 py-5 flex items-center gap-6 shadow-2xl shadow-blue-200">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest leading-none mb-1">Creator Trial</p>
                                <p className="text-lg font-black">{trialStatus.daysLeft} Days Remaining</p>
                            </div>
                            <Link to="/pricing">
                                <Button className="bg-white text-blue-600 hover:bg-blue-50 font-black rounded-xl px-6 h-12 shadow-lg">UPGRADE</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Trial Expiration Alert (Creators only) */}
                {user?.role === 'creator' && trialStatus?.isExpired && user?.subscription_status !== 'active' && (
                    <div className="bg-red-50 border-2 border-red-100 rounded-[2.5rem] p-10 mb-12 flex flex-col md:flex-row items-center gap-10 shadow-xl shadow-red-50">
                        <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center text-red-600 flex-shrink-0 animate-pulse">
                            <Lock size={40} />
                        </div>
                        <div className="text-center md:text-left flex-grow">
                            <h3 className="text-3xl font-black text-red-900 mb-3 tracking-tighter italic leading-none">Creator Access Suspended</h3>
                            <p className="text-red-700 leading-relaxed max-w-2xl font-bold opacity-80 italic">Your trial has ended. Your courses and learner analytics are locked. Upgrade now to restore full academy access.</p>
                        </div>
                        <Link to="/pricing">
                            <Button className="bg-red-600 hover:bg-red-700 text-white px-10 h-16 rounded-2xl font-black shadow-2xl shadow-red-200 text-lg italic">UNLOCK ACCESS</Button>
                        </Link>
                    </div>
                )}

                {/* Certificate Claim Section */}
                {completedUnpaid.length > 0 && (
                    <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 rounded-[3rem] p-12 mb-16 text-white relative overflow-hidden shadow-2xl border border-white/5">
                        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
                            <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600 rounded-full blur-[150px]"></div>
                        </div>
                        
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-3 bg-blue-500/20 px-5 py-2 rounded-full border border-blue-500/30 mb-8 border-dashed">
                                <Award className="text-blue-400 w-5 h-5" />
                                <span className="text-xs font-black uppercase tracking-widest text-blue-200 italic">Certificate Ready for Collection</span>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-4xl font-black mb-4 tracking-tighter leading-tight italic">
                                        Congratulations, <span className="text-blue-400">{user?.full_name?.split(' ')[0]}!</span>
                                    </h2>
                                    <p className="text-lg text-gray-400 font-medium leading-relaxed opacity-90 italic">
                                        You've mastered the curriculum for <span className="text-white font-black underline decoration-blue-500 decoration-2 underline-offset-4 tracking-tight">{completedUnpaid[0].title}</span>. Pay the final processing fee to issue your official certification to your profile and LinkedIn.
                                    </p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/10 flex flex-col md:flex-row items-center gap-8 shadow-inner">
                                    <div className="text-center md:text-left flex-grow">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 italic">Processing Fee</p>
                                        <p className="text-4xl font-black text-blue-400 tracking-tighter italic">BWP {completedUnpaid[0].price || "1,200"}</p>
                                    </div>
                                    <Link to={`/checkout?course_id=${completedUnpaid[0].course_id}&type=certificate`}>
                                        <Button className="bg-blue-600 hover:bg-blue-700 h-16 px-10 rounded-2xl font-black text-white shadow-2xl shadow-blue-900/40 flex items-center gap-4 italic group">
                                            PAY AND COLLECT
                                            <CreditCard className="group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Courses Column */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4 italic tracking-tighter leading-none">
                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                                        <BookOpen size={20} />
                                    </div>
                                    Active Academy
                                </h2>
                                <Link to="/courses" className="text-xs font-black text-blue-600 hover:underline uppercase tracking-widest italic">Enroll In More</Link>
                            </div>

                            {enrollments.length === 0 ? (
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-16 text-center shadow-sm">
                                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <GraduationCap size={40} className="text-blue-200" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-3 tracking-tighter leading-none">Your Academy is Quiet</h3>
                                    <p className="text-gray-400 font-medium max-w-xs mx-auto mb-10 italic">Start your first AI engineering course today to build your portfolio.</p>
                                    <Link to="/courses">
                                        <Button className="bg-gray-900 hover:bg-blue-600 px-10 h-14 rounded-2xl font-black text-white shadow-xl transition-all italic">BROWSE CATALOG</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {enrollments.map((enr) => (
                                        <div key={enr.id} className="group bg-white rounded-[2rem] border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-8 hover:shadow-2xl transition-all duration-500 border-l-8 border-l-blue-600 relative">
                                            <div className="w-24 h-24 bg-gray-900 rounded-2xl flex-shrink-0 flex items-center justify-center text-white overflow-hidden relative shadow-lg">
                                                <div className="absolute inset-0 bg-blue-600 opacity-20 group-hover:opacity-60 transition-opacity"></div>
                                                {enr.is_completed ? <Award size={36} className="relative z-10 text-blue-400" /> : <Play size={32} className="relative z-10" />}
                                            </div>
                                            
                                            <div className="flex-grow text-center md:text-left">
                                                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                                    <h4 className="text-2xl font-black text-gray-900 tracking-tighter italic leading-none">{enr.title || 'Untitled Lessons'}</h4>
                                                    {enr.is_completed && <CheckCircle size={20} className="text-green-500 fill-green-50" />}
                                                </div>
                                                <div className="flex items-center justify-center md:justify-start gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none">
                                                    <span className="flex items-center gap-1.5"><Clock size={12} /> {enr.is_completed ? 'Finished' : 'In Progress'}</span>
                                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                                    <span>{enr.is_paid ? 'Certified' : 'Draft Access'}</span>
                                                </div>
                                                
                                                <div className="mt-6 flex items-center gap-4">
                                                    <div className="flex-grow h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                                        <div className="bg-blue-600 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.4)]" style={{ width: `${enr.is_completed ? 100 : (enr.progress_data?.overall_percent || 0)}%` }}></div>
                                                    </div>
                                                    <span className="text-sm font-black text-blue-600 italic leading-none">{enr.is_completed ? 100 : (enr.progress_data?.overall_percent || 0)}%</span>
                                                </div>
                                            </div>
                                            
                                            <Link to={enr.is_completed && !enr.is_paid ? `/checkout?course_id=${enr.course_id}&type=certificate` : `/course/${enr.course_id}`} className="w-full md:w-auto">
                                                <Button className={`w-full h-14 rounded-2xl font-black px-10 shadow-xl transition-all italic flex items-center justify-center gap-3 ${enr.is_completed && !enr.is_paid ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100' : 'bg-gray-900 group-hover:bg-blue-600 text-white shadow-gray-100'}`}>
                                                    {enr.is_completed && !enr.is_paid ? 'GET CERTIFICATE' : 'CONTINUE'}
                                                    <ChevronRight size={20} />
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Stats Sidebar */}
                    <div className="space-y-10">
                        <section className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm">
                            <h3 className="text-xl font-black mb-8 tracking-tighter italic uppercase underline decoration-blue-600 decoration-4 underline-offset-8">Activity Stats</h3>
                            <div className="space-y-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-green-50 rounded-[1.25rem] flex items-center justify-center text-green-600 shadow-inner">
                                        <CheckCircle size={28} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black text-gray-900 tracking-tighter italic leading-none">{enrollments.filter(e => e.is_completed).length}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">Finished Courses</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-blue-50 rounded-[1.25rem] flex items-center justify-center text-blue-600 shadow-inner">
                                        <Layout size={28} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black text-gray-900 tracking-tighter italic leading-none">{enrollments.length}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">Total Enrollments</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-yellow-50 rounded-[1.25rem] flex items-center justify-center text-yellow-600 shadow-inner">
                                        <Sparkles size={28} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black text-gray-900 tracking-tighter italic leading-none">{enrollments.reduce((acc, curr) => acc + (curr.is_paid ? 100 : 20), 0)}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">Academy Rank Points</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                            <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                            <h3 className="text-2xl font-black mb-3 tracking-tighter italic leading-none leading-none">LearnFlow AI</h3>
                            <p className="text-gray-400 font-medium mb-10 leading-relaxed italic opacity-80">Sync your lesson progress with our local AI to generate personalized study guides.</p>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl h-16 shadow-xl shadow-blue-500/20 italic tracking-tight">SUMMARIZE PROGRESS</Button>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default LearnerDashboard;
