import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { ShieldCheck, Cookie, Info, Check } from 'lucide-react';
import { toast } from 'sonner';

const CookieSettings = () => {
    const [settings, setSettings] = useState({
        essential: true, // Always on
        analytics: true,
        marketing: false,
        preference: true
    });

    const handleSave = () => {
        localStorage.setItem('cookieSettings', JSON.stringify(settings));
        toast.success('Cookie preferences updated successfully!', {
            icon: <Check className="text-green-600" />,
            style: {
                borderRadius: '1.5rem',
                padding: '1.5rem',
                fontWeight: 'bold'
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-32">
            <Header />
            <main className="flex-1 pb-20">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-[3rem] p-12 md:p-16 shadow-2xl shadow-gray-200/50 mb-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="relative z-10 text-center md:text-left">
                            <Badge variant="outline" className="mb-6 border-blue-600 text-blue-600 uppercase tracking-widest px-6 py-2">Privacy Control</Badge>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tighter uppercase italic">Cookie <span className="text-blue-600">Preferences</span></h1>
                            <p className="text-xl text-gray-500 font-medium leading-relaxed italic max-w-2xl">
                                We use cookies to enhance your experience and improve our platform. Choose which cookies you're comfortable with.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6 mb-12">
                        <Card className="border-0 shadow-lg shadow-gray-100 hover:shadow-2xl transition-all p-8 bg-white rounded-[2rem]">
                            <div className="flex items-start justify-between gap-6">
                                <div className="p-4 bg-gray-100 rounded-2xl">
                                    <Cookie size={32} className="text-gray-900" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-black uppercase italic tracking-tight">Essential Cookies</h3>
                                        <Badge className="bg-green-600 uppercase text-[10px] font-black">Always On</Badge>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium italic pr-12">
                                        These are required for the website to function correctly (e.g., authentication, security, and loading). They cannot be disabled.
                                    </p>
                                </div>
                                <Switch checked={true} disabled />
                            </div>
                        </Card>

                        <Card className="border-0 shadow-lg shadow-gray-100 hover:shadow-2xl transition-all p-8 bg-white rounded-[2rem]">
                            <div className="flex items-start justify-between gap-6">
                                <div className="p-4 bg-blue-50 rounded-2xl">
                                    <Info size={32} className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-black uppercase italic tracking-tight mb-2">Analytics Cookies</h3>
                                    <p className="text-sm text-gray-500 font-medium italic pr-12">
                                        Help us understand how visitors interact with the site, helping us find and fix bugs to improve the LearnFlow experience.
                                    </p>
                                </div>
                                <Switch 
                                    checked={settings.analytics} 
                                    onCheckedChange={(val) => setSettings({...settings, analytics: val})}
                                />
                            </div>
                        </Card>

                        <Card className="border-0 shadow-lg shadow-gray-100 hover:shadow-2xl transition-all p-8 bg-white rounded-[2rem]">
                            <div className="flex items-start justify-between gap-6">
                                <div className="p-4 bg-purple-50 rounded-2xl">
                                    <ShieldCheck size={32} className="text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-black uppercase italic tracking-tight mb-2">Marketing Cookies</h3>
                                    <p className="text-sm text-gray-500 font-medium italic pr-12">
                                        Used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.
                                    </p>
                                </div>
                                <Switch 
                                    checked={settings.marketing} 
                                    onCheckedChange={(val) => setSettings({...settings, marketing: val})}
                                />
                            </div>
                        </Card>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-8 p-12 bg-gray-900 rounded-[3rem] text-white shadow-2xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-transparent to-transparent"></div>
                        <div className="relative z-10 flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-black mb-2 uppercase italic tracking-tight italic-4">Ready to save?</h2>
                            <p className="text-gray-400 font-medium italic">Changes will take effect immediately across all sessions.</p>
                        </div>
                        <div className="relative z-10 flex gap-4 w-full sm:w-auto">
                            <Button 
                                onClick={handleSave}
                                className="w-full sm:w-auto px-12 py-7 bg-white text-gray-900 font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 shadow-xl shadow-blue-900/20"
                            >
                                Save Preferences
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CookieSettings;
