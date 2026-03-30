import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { BookOpen, Clock, Users, ArrowRight, Star, Search, Filter, PlayCircle, ShieldCheck, Loader2 } from 'lucide-react';
const API_BASE = 'http://localhost:8082';
// import API_BASE from '../api_config';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [enrollingId, setEnrollingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/courses/`);
                setCourses(response.data);

                // Fetch enrollments if logged in
                const token = localStorage.getItem('token');
                if (token) {
                    const enrRes = await axios.get(`${API_BASE}/api/enrollments/`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setEnrollments(enrRes.data.map(e => e.course_id));
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
                // Fallback for demo
                const fallback = [
                    { id: 1, title: "AI Art Mastery", description: "Generation of high-quality AI art.", price: 1500, rating: 4.9, students: 1200, duration: "10h", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995" },
                    { id: 2, title: "Advanced Python", description: "Learn deep python patterns.", price: 2500, rating: 4.8, students: 850, duration: "8h", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" }
                ];
                setCourses(fallback);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleFreeEnroll = async (courseId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signup');
            return;
        }

        setEnrollingId(courseId);
        try {
            await axios.post(`${API_BASE}/api/enrollments/`, {
                course_id: courseId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/learner-dashboard');
        } catch (error) {
            console.error('Enrollment error:', error);
            alert('Failed to start course. Please try again.');
        } finally {
            setEnrollingId(null);
        }
    };

    const filteredCourses = courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <Header />

            {/* Hero Section */}
            <div className="bg-gray-900 text-white py-24 px-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
                </div>
                
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 mb-8">
                        <ShieldCheck className="text-blue-400 w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-widest text-blue-200">Start Free • Pay for Certificate</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight italic">
                        Master Your Craft.<br />
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent underline decoration-blue-500/30 underline-offset-8">Pay When You Win.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                        Access all lessons for free. Execute payment only when you're 100% finished and ready to collect your official certificate.
                    </p>
                    
                    <div className="max-w-xl mx-auto relative group">
                        <div className="absolute inset-0 bg-blue-600/20 blur-xl group-hover:bg-blue-600/30 transition-all rounded-full"></div>
                        <div className="relative flex bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-sm shadow-2xl">
                            <div className="flex items-center pl-4 pr-3">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="What do you want to learn today?" 
                                className="bg-transparent border-none focus:ring-0 text-white flex-grow py-3 text-lg outline-none font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-20 font-sans">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-2 italic">Premium Course Ads</h2>
                        <p className="text-gray-500 font-bold tracking-tight uppercase text-xs">Curated by top-tier creators</p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-[2rem] border border-gray-100 h-[450px] animate-pulse shadow-sm"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredCourses.map((course) => (
                            <div 
                                key={course.id} 
                                className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 overflow-hidden flex flex-col h-full"
                            >
                                <div className="aspect-[4/3] relative overflow-hidden">
                                    <img 
                                        src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"} 
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/30">
                                            <PlayCircle size={32} />
                                        </div>
                                    </div>
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <div className="bg-blue-600 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
                                            CERTIFIED
                                        </div>
                                        <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-900 shadow-sm border border-gray-100">
                                            BWP {course.price || "1,200"}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-10 flex-grow flex flex-col">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex items-center text-yellow-500 gap-1.5 px-3 py-1 bg-yellow-50 rounded-full">
                                            <Star size={14} fill="currentColor" />
                                            <span className="text-xs font-black">{course.rating || '4.9'}</span>
                                        </div>
                                        <div className="flex items-center text-gray-400 gap-2 font-bold tracking-tight text-xs uppercase">
                                            <Clock size={14} />
                                            <span>{course.duration || '12h'} Content</span>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 tracking-tighter italic leading-tight">
                                        {course.title}
                                    </h3>
                                    
                                    <p className="text-gray-500 text-sm leading-relaxed mb-10 line-clamp-3 font-medium opacity-80 italic">
                                        {course.description || "Unlocking world-class AI engineering concepts through expert-led guidance and real-world certification labs."}
                                    </p>

                                    <div className="mt-auto pt-8 border-t border-gray-100 flex items-center justify-between">
                                        {enrollments.includes(course.id) ? (
                                            <Link to="/learner-dashboard" className="w-full">
                                                <Button className="w-full h-14 rounded-2xl font-black bg-green-600 hover:bg-green-700 shadow-xl shadow-green-100 flex items-center justify-center gap-3 italic">
                                                    Open In My Portal
                                                    <ArrowRight size={20} />
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button 
                                                onClick={() => handleFreeEnroll(course.id)}
                                                disabled={enrollingId === course.id}
                                                className="w-full h-14 rounded-2xl font-black bg-gray-900 hover:bg-blue-600 shadow-xl shadow-gray-200 transition-all flex items-center justify-center gap-3 italic relative overflow-hidden"
                                            >
                                                {enrollingId === course.id ? (
                                                    <Loader2 className="animate-spin" size={24} />
                                                ) : (
                                                    <>
                                                        Start For Free
                                                        <ArrowRight size={20} />
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                    
                                    <p className="text-center mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                                        Total Certification Fee: BWP {course.price || "1,200"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Courses;
