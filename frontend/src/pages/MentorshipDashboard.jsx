import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../supabase';
import API_BASE from '../api_config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
    Calendar, Clock, Video, Plus, Loader2, 
    BookOpen, DollarSign, User, AlertCircle 
} from 'lucide-react';

const MentorshipDashboard = () => {
    const [programs, setPrograms] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration_minutes: 60,
        price: 0
    });

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                // Get Auth User
                const { data: { user: authUser } } = await supabase.auth.getUser();
                if (!authUser) {
                    window.location.hash = '/login';
                    return;
                }
                setUser(authUser);

                // Fetch Programs and Sessions
                const { data: session } = await supabase.auth.getSession();
                const token = session?.session?.access_token;
                const headers = { Authorization: `Bearer ${token}` };

                // Get creator's programs
                const progResp = await axios.get(`${API_BASE}/api/mentorship/programs`, { headers });
                // Filter programs by this instructor to show only their programs
                const myPrograms = progResp.data.filter(p => p.instructor_id === authUser.id);
                setPrograms(myPrograms);

                // Get sessions
                const sessResp = await axios.get(`${API_BASE}/api/mentorship/sessions/my-sessions`, { headers });
                setSessions(sessResp.data);
            } catch (err) {
                console.error("Error loading mentorship dashboard:", err);
                setError("Failed to load mentorship dashboard details.");
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'duration_minutes' || name === 'price' ? parseInt(value) || 0 : value
        }));
    };

    const handleCreateProgram = async (e) => {
        e.preventDefault();
        if (!formData.title) return;

        setSubmitting(true);
        setError(null);
        try {
            const { data: session } = await supabase.auth.getSession();
            const token = session?.session?.access_token;
            const headers = { Authorization: `Bearer ${token}` };

            const resp = await axios.post(`${API_BASE}/api/mentorship/programs`, formData, { headers });
            setPrograms(prev => [resp.data, ...prev]);
            setFormData({
                title: '',
                description: '',
                duration_minutes: 60,
                price: 0
            });
            alert("Mentorship Program offering defined successfully!");
        } catch (err) {
            console.error("Error creating program:", err);
            setError(err.response?.data?.detail || "Failed to create program offering.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Dashboard Welcome Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentorship Manager</h1>
                        <p className="text-gray-600 font-medium">Define your coaching packages and manage your booked clients.</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8 flex items-center gap-4 text-red-700">
                        <AlertCircle size={24} className="flex-shrink-0" />
                        <span className="font-semibold text-sm">{error}</span>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5">
                        <div className="p-3.5 bg-gray-50 text-gray-600 rounded-lg border border-gray-100">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{programs.length}</h3>
                            <p className="text-sm font-medium text-gray-600">Active Programs</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5">
                        <div className="p-3.5 bg-gray-50 text-gray-600 rounded-lg border border-gray-100">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {sessions.filter(s => s.status === 'confirmed').length}
                            </h3>
                            <p className="text-sm font-medium text-gray-600">Upcoming Calls</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5">
                        <div className="p-3.5 bg-gray-50 text-gray-600 rounded-lg border border-gray-100">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                BWP {(sessions.filter(s => s.status === 'confirmed').reduce((acc, curr) => acc + (curr.program?.price || 0), 0)).toLocaleString()}
                            </h3>
                            <p className="text-sm font-medium text-gray-600">Projected Revenue</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Program Definition Form */}
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm h-fit">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Define Offering</h2>
                        
                        <form onSubmit={handleCreateProgram} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Program Title</label>
                                <input 
                                    type="text" 
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. 1-on-1 AI Architecture Strategy"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea 
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    placeholder="Outline what outcomes the client will achieve..."
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Mins)</label>
                                    <input 
                                        type="number" 
                                        name="duration_minutes"
                                        value={formData.duration_minutes}
                                        onChange={handleInputChange}
                                        min={15}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (BWP)</label>
                                    <input 
                                        type="number" 
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        min={0}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                            >
                                {submitting ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        Launch Offering
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Sessions & Offerings Listings */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Booked Sessions */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Client Bookings</h2>
                            
                            {sessions.length === 0 ? (
                                <div className="bg-white p-12 text-center rounded-xl border border-gray-200 shadow-sm text-gray-500 font-medium">
                                    No booked mentorship calls found.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {sessions.map((sess) => (
                                        <div key={sess.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium border border-gray-200 capitalize">
                                                        {sess.status}
                                                    </span>
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {sess.program?.title}
                                                    </span>
                                                </div>
                                                <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                                    <User size={16} className="text-gray-500" />
                                                    {sess.student?.full_name || 'Client'} <span className="text-gray-500 font-normal">({sess.student?.email})</span>
                                                </h4>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1.5"><Calendar size={16} /> {new Date(sess.scheduled_time).toLocaleString()}</span>
                                                    <span className="flex items-center gap-1.5"><Clock size={16} /> {sess.program?.duration_minutes} Mins</span>
                                                </div>
                                                {sess.notes && (
                                                    <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100 mt-2">
                                                        {sess.notes}
                                                    </p>
                                                )}
                                            </div>

                                            {sess.meeting_link && (
                                                <a 
                                                    href={sess.meeting_link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                                                >
                                                    <Video size={16} />
                                                    Launch Jitsi Call
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Active Packages */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Defined Packages</h2>
                            
                            {programs.length === 0 ? (
                                <div className="bg-white p-12 text-center rounded-xl border border-gray-200 shadow-sm text-gray-500 font-medium">
                                    No coaching offerings defined. Use the form to define one.
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {programs.map((prog) => (
                                        <div key={prog.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{prog.title}</h3>
                                                <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed">{prog.description || "No description provided."}</p>
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                                                    <Clock size={16} />
                                                    <span>{prog.duration_minutes} Mins</span>
                                                </div>
                                                <span className="text-base font-semibold text-gray-900">BWP {prog.price}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MentorshipDashboard;
