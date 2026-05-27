import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <Header />
            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>
                <div className="prose prose-blue max-w-none text-gray-600 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <p className="mb-4">Last Updated: January 28, 2026</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">1. Introduction</h2>
                    <p>Welcome to Pameltech Labs ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">2. Information We Collect</h2>
                    <p>We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us.</p>

                    <h3 className="text-lg font-bold text-gray-800 mt-4 mb-2">Personal Information Provided by You</h3>
                    <p>The personal information that we collect depends on the context of your interactions with us and the website, the choices you make and the products and features you use. The personal information we collect may include the following:</p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Names</li>
                        <li>Email Addresses</li>
                        <li>Payment Data (Processed securely by DPO/Stripe)</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">3. How We Use Your Information</h2>
                    <p>We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">4. Sharing Your Information</h2>
                    <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">5. Contact Us</h2>
                    <p>If you have questions or comments about this policy, you may email us at support@pohei.de.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
