import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Terms = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <Header />
            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Terms of Service</h1>
                <div className="prose prose-blue max-w-none text-gray-600 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <p className="mb-4">Last Updated: January 28, 2026</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">1. Agreement to Terms</h2>
                    <p>These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Pameltech Labs ("Company", “we”, “us”, or “our”), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">2. Intellectual Property Rights</h2>
                    <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">3. User Representations</h2>
                    <p>By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary.</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">4. AI-Generated Content Disclaimer</h2>
                    <p>Our platform utilities Artificial Intelligence (AI) to generate course content. Please be aware that AI can make mistakes. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the AI-generated content.</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">5. Contact Us</h2>
                    <p>In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at support@pohei.de.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Terms;
