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
                    <p className="mb-4">Last Updated: May 27, 2026</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">1. Introduction</h2>
                    <p>Welcome to Pameltech Labs ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy details how we collect, store, and process your data in compliance with the <strong>Data Protection Act, 2018 (Act No. 32 of 2018) of Botswana</strong>. If you have any questions or concerns about our practices regarding your personal information, please contact us at support@pohei.de.</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">2. Information We Collect</h2>
                    <p>We collect personal information that you voluntarily provide to us when you register on the website, build courses, configure settings, or contact us. This includes:</p>
                    <ul className="list-disc pl-6 mb-4">
                        <li><strong>Account Data:</strong> Names, usernames, passwords, and email addresses.</li>
                        <li><strong>Payment Data:</strong> Transaction records and payment confirmation (processed securely by authorized billing processors like PayPal, DPO, or Stripe).</li>
                        <li><strong>Content Data:</strong> Text, resources, outlines, and material created using our course building tools.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">3. Data Subject Rights (Botswana Data Protection Act)</h2>
                    <p>Under the Data Protection Act of Botswana, you are a data subject and hold the following statutory rights:</p>
                    <ul className="list-disc pl-6 mb-4">
                        <li><strong>Right of Access:</strong> The right to request confirmation of whether we process your data and obtain a copy of such data.</li>
                        <li><strong>Right to Rectification:</strong> The right to request correction of inaccurate or incomplete personal data.</li>
                        <li><strong>Right to Erasure (Right to be Forgotten):</strong> The right to request the deletion of your personal data under certain conditions.</li>
                        <li><strong>Right to Object:</strong> The right to object to processing based on legitimate interests or direct marketing.</li>
                    </ul>
                    <p>To exercise any of these rights, please email us at <strong>support@pohei.de</strong>.</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">4. Sharing and Cross-Border Transfers</h2>
                    <p>We only share information with your consent, to comply with legal obligations, or to perform a contract with you. Any cross-border transfer of personal data outside Botswana is performed in strict adherence to section 48 of the Data Protection Act, ensuring the recipient country has an adequate level of data protection.</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">5. Security of Your Information</h2>
                    <p>We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. This includes HTTPS encryption, database access credentials, and secure transaction handling. However, please remember that no transmission over the internet is 100% secure.</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">6. Contact and Regulatory Authority</h2>
                    <p>If you have questions or comments about this policy, or if you believe your data protection rights have been infringed, you may contact us at <strong>support@pohei.de</strong>. You also have the right to lodge a complaint with the Information Commissioner/Data Protection Office or the Botswana Communications Regulatory Authority (BOCRA).</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
