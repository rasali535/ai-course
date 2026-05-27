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
                    <p className="mb-4">Last Updated: May 27, 2026</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">1. Agreement to Terms</h2>
                    <p>These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Pameltech Labs ("Company", “we”, “us”, or “our”), concerning your access to and use of the website and platform (collectively, the “Site”). In accordance with the Electronic Communications and Transactions Act, 2014 of Botswana, your electronic assent or continued use of the platform represents a valid, binding electronic agreement.</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">2. Regulatory Alignment (BOCRA)</h2>
                    <p>This platform and its communication services are operated in alignment with the guidelines of the <strong>Botswana Communications Regulatory Authority (BOCRA)</strong> under the Communications Regulatory Authority (CRA) Act of 2012. We commit to upholding consumer protection rights, data privacy standards, and quality-of-service guidelines outlined by BOCRA.</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">3. Data Protection and Privacy</h2>
                    <p>We respect your privacy and process all personal information in strict compliance with the <strong>Data Protection Act, 2018 (Act No. 32 of 2018) of Botswana</strong>. 
                    Your information is collected only for specified, explicit, and legitimate purposes (such as account generation, course progress tracking, and payment validation) and will not be transferred or shared without your consent or legal authorization under Botswana law.</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">4. Intellectual Property & User Content</h2>
                    <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) are owned or controlled by us. However, all materials, curriculum content, and student data you create or upload on the platform remain 100% your proprietary property.</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">5. Content Moderation & Take-down Notices</h2>
                    <p>In accordance with the Electronic Communications and Transactions Act, 2014, we maintain a robust mechanism to handle copyright infringement and illegal content. Any party requesting the removal of infringing content may submit a formal Take-down Notice to <strong>support@pohei.de</strong>. Upon receipt of a valid notice, we will act expeditiously to remove or disable access to the offending material.</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">6. Acceptable Use and Cybersecurity</h2>
                    <p>You agree not to use this Site for any unlawful purpose. You are prohibited from violating or attempting to violate the security of the Site, including actions that breach the Cybercrime and Computer Related Crimes Act of Botswana. Any unauthorized system access, data harvesting, or denial of service attacks will be reported immediately to the relevant law enforcement agencies and the Botswana Computer Security Incident Response Team (bwCIRT).</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">7. AI-Generated Content Disclaimer</h2>
                    <p>Our platform utilities Artificial Intelligence (AI) to generate course outlines and content. While we strive to offer high-quality outputs, AI can make mistakes. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the AI-generated content. Users are advised to review and verify all generated materials.</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">8. Dispute Resolution and Governing Law</h2>
                    <p>These Terms of Service shall be governed by and construed in accordance with the laws of the <strong>Republic of Botswana</strong>. In the event of a complaint or dispute, users are encouraged to contact our support team. If a dispute cannot be resolved directly, consumers have the right to lodge a formal complaint with BOCRA or proceed to the competent courts of Botswana.</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">9. Contact Us</h2>
                    <p>In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at <strong>support@pohei.de</strong>.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Terms;
