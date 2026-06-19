import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../supabase';
import API_BASE from '../api_config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
    Calendar, Clock, Video, User, Loader2, 
    BookOpen, DollarSign, X, Check, AlertCircle, ArrowRight 
} from 'lucide-react';

const ClientMentorship = () => {
    const [programs, setPrograms] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingProg, setBookingProg] = useState(null); // Selected program to book
    const [bookingData, setBookingData] = useState({
        scheduled_time: '',
        notes: ''
    });
    const [bookingSubmit, setBookingSubmit] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPortal = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    window.location.hash = '/login';
                    return;
                }

                const { data: authSession } = await supabase.auth.getSession();
                const token = authSession?.session?.access_token;
                const headers = { Authorization: `Bearer ${token}` };

                // Get all mentorship program offerings
                const progResp = await axios.get(`${API_BASE}/api/mentorship/programs`, { headers });
                setPrograms(progResp.data);

                // Get student's booked sessions
                const sessResp = await axios.get(`${API_BASE}/api/mentorship/sessions/my-sessions`, { headers });
                // Filter to show sessions where this user is the student
                const myStudentSessions = sessResp.data.filter(s => s.student_id === user.id);
                setSessions(myStudentSessions);
            } catch (err) {
                console.error("Error loading client mentorship portal:", err);
                setError("Failed to load mentorship directory details.");
            } finally {
                setLoading(false);
            }
        };

        loadPortal();
    }, []);

    const handleBookSessionSubmit = async (e) => {
        e.preventDefault();
        if (!bookingProg || !bookingData.scheduled_time) return;

        setBookingSubmit(true);
        setError(null);
        try {
            const { data: authSession } = await supabase.auth.getSession();
            const token = authSession?.session?.access_token;
            const headers = { Authorization: `Bearer ${token}` };

            const bookingPayload = {
                program_id: bookingProg.id,
                scheduled_time: new Date(bookingData.scheduled_time).toISOString(),
                notes: bookingData.notes
            };

            const resp = await axios.post(`${API_BASE}/api/mentorship/sessions/book`, bookingPayload, { headers });
            setSessions(prev => [resp.data, ...prev]);
            setBookingProg(null);
            setBookingData({ scheduled_time: '', notes: '' });
            alert("Mentorship Session booked successfully! A video meeting link has been generated.");
        } catch (err) {
            console.error("Error booking session:", err);
            setError(err.response?.data?.detail || "Failed to complete session booking.");
        } finally {
            setBookingSubmit(false);
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
                {/* Header Welcome */}
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter italic">Mentorship & Coaching Center</h1>
                    <p className="text-gray-500 font-medium">Book private, 1-on-1 calls with certified coaches to accelerate your training outcomes.</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-150 rounded-2xl p-5 mb-8 flex items-center gap-4 text-red-700">
                        <AlertCircle size={24} className="flex-shrink-0" />
                        <span className="font-semibold text-sm">{error}</span>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Available Packages */}
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tighter italic leading-none">Available Programs</h2>
                        
                        {programs.length === 0 ? (
                            <div className="bg-white p-16 text-center rounded-3xl border border-gray-100 shadow-sm text-gray-400 font-medium italic">
                                No mentorship programs are currently available for booking. Check back later!
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6">
                                {programs.map((prog) => (
                                    <div key={prog.id} className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 tracking-tight italic mb-1 leading-tight">{prog.title}</h3>
                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider mb-4">
                                                Coach: {prog.instructor?.full_name || 'Instructor'}
                                            </p>
                                            <p className="text-xs text-gray-500 mb-6 leading-relaxed font-medium italic">{prog.description || "No description provided."}</p>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center py-4 border-t border-gray-100 mb-4">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase tracking-wide">
                                                    <Clock size={14} />
                                                    <span>{prog.duration_minutes} Mins</span>
                                                </div>
                                                <span className="text-lg font-black text-gray-900 italic">BWP {prog.price}</span>
                                            </div>
                                            <button 
                                                onClick={() => setBookingProg(prog)}
                                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 uppercase tracking-wider shadow-md"
                                            >
                                                Book This Call
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Booked Sessions */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tighter italic leading-none">My Bookings</h2>

                        {sessions.length === 0 ? (
                            <div className="bg-white p-8 text-center rounded-3xl border border-gray-100 shadow-sm text-gray-400 font-medium italic">
                                You haven't booked any private sessions yet.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {sessions.map((sess) => (
                                    <div key={sess.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-black uppercase tracking-wider border border-blue-150">
                                                {sess.status}
                                            </span>
                                            <span className="text-xs text-gray-400 font-bold">{sess.program?.duration_minutes} Mins</span>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 line-clamp-1 italic tracking-tight">{sess.program?.title}</h4>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 flex items-center gap-1">
                                                <User size={10} />
                                                Coach: {sess.program?.instructor?.full_name}
                                            </p>
                                        </div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-1.5">
                                            <Calendar size={12} />
                                            {new Date(sess.scheduled_time).toLocaleString()}
                                        </div>
                                        
                                        {sess.notes && (
                                            <p className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded border border-gray-100 italic">
                                                Notes: "{sess.notes}"
                                            </p>
                                        )}

                                        {sess.meeting_link && (
                                            <a 
                                                href={sess.meeting_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full py-3 bg-gray-900 hover:bg-blue-600 text-white rounded-xl text-[10px] font-black text-center transition-colors uppercase tracking-widest italic flex items-center justify-center gap-1.5"
                                            >
                                                <Video size={12} />
                                                Join Jitsi Call
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Booking Modal */}
            {bookingProg && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200 relative">
                        <button 
                            onClick={() => setBookingProg(null)}
                            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-150 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tighter italic pr-6 leading-tight">
                            Book {bookingProg.title}
                        </h3>
                        <p className="text-xs text-blue-600 font-black uppercase tracking-wider mb-6">
                            Coach: {bookingProg.instructor?.full_name} ({bookingProg.duration_minutes} Minutes Call)
                        </p>

                        <form onSubmit={handleBookSessionSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Select Date & Time</label>
                                <input 
                                    type="datetime-local" 
                                    required
                                    value={bookingData.scheduled_time}
                                    onChange={(e) => setBookingData(prev => ({ ...prev, scheduled_time: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Booking Notes / Goals</label>
                                <textarea 
                                    value={bookingData.notes}
                                    onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                                    rows={3}
                                    placeholder="Add any specific questions or goals you have for this session..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm font-medium resize-none"
                                />
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setBookingProg(null)}
                                    className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={bookingSubmit}
                                    className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5"
                                >
                                    {bookingSubmit ? (
                                        <Loader2 className="animate-spin" size={16} />
                                    ) : (
                                        <>
                                            <Check size={16} />
                                            Confirm Booking
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default ClientMentorship;
