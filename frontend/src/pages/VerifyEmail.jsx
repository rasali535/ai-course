import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../supabase';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (session) {
                setStatus('success');
                setMessage('Your email has been successfully verified! You are now logged in.');
                
                const channel = supabase.channel(`signup-confirm:${session.user.email}`);
                channel.subscribe((st) => {
                    if (st === 'SUBSCRIBED') {
                        channel.send({
                            type: 'broadcast',
                            event: 'confirmed',
                            payload: { confirmed: true, email: session.user.email }
                        });
                        console.log("Broadcast sent for", session.user.email);
                    }
                });
            } else if (error) {
                setStatus('error');
                setMessage(error.message);
            } else if (token) {
                const { error: verifyError } = await supabase.auth.verifyOtp({
                    token_hash: token,
                    type: 'signup',
                });

                if (verifyError) {
                    setStatus('error');
                    setMessage(verifyError.message);
                } else {
                    const { data: { session: s } } = await supabase.auth.getSession();
                    if (s) {
                        setStatus('success');
                        setMessage('Your email has been successfully verified! You are now logged in.');
                        
                        // ⏱️ Set 7-day trial starting NOW
                        const now = new Date();
                        const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                        await supabase
                            .from('profiles')
                            .update({ 
                                trial_ends_at: trialEnd.toISOString(),
                                subscription_status: 'trial' 
                            })
                            .eq('id', s.user.id);

                        const channel = supabase.channel(`signup-confirm:${s.user.email}`);
                        channel.subscribe((st) => {
                            if (st === 'SUBSCRIBED') {
                                channel.send({ type: 'broadcast', event: 'confirmed' });
                                console.log("Confirmation broadcast sent for", s.user.email);
                            }
                        });
                    }
                }
            } else {
                setStatus('error');
                setMessage('Missing verification token or session.');
            }
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 md:p-14 shadow-xl shadow-gray-200 border border-gray-100 text-center animate-in fade-in zoom-in duration-700">
                {status === 'verifying' && (
                    <>
                        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <Loader2 className="animate-spin text-blue-600" size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Verifying Account</h2>
                        <p className="text-gray-500 font-medium leading-relaxed">Please wait while we secure your academy access...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <CheckCircle className="text-green-600" size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Verified!</h2>
                        <p className="text-gray-600 font-medium leading-relaxed mb-10">{message}</p>
                        <Link to="/login" className="block w-full py-4 bg-gray-900 text-white rounded-2xl font-black shadow-lg shadow-gray-200 hover:bg-black transition-all flex items-center justify-center group">
                            Sign In Now <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <XCircle className="text-red-600" size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Verification Failed</h2>
                        <p className="text-red-500 font-medium leading-relaxed mb-10">{message}</p>
                        <div className="space-y-4">
                            <Link to="/signup" className="block w-full py-4 bg-gray-900 text-white rounded-2xl font-black shadow-lg shadow-gray-200 hover:bg-black transition-all">
                                Try Signing Up again
                            </Link>
                            <Link to="/contact" className="text-sm font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900">
                                Need help? Contact Support
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
