import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PricingComponent from '../components/Pricing';
import { Button } from '../components/ui/button';
import { Check, Shield, HelpCircle } from 'lucide-react';

const PricingPage = () => {
    const faqs = [
        {
            q: "Can I cancel my subscription anytime?",
            a: "Yes, you can cancel your subscription at any time. There are no long-term contracts or hidden fees."
        },
        {
            q: "Does LearnFlow take a transaction fee?",
            a: "No, LearnFlow does not take any transaction fees on the sales of your courses. You keep 100% of your revenue (standard payment processor fees apply)."
        },
        {
            q: "Do I need a separate hosting provider?",
            a: "No, LearnFlow is an all-in-one platform. We host your videos, content, and website so you don't need anything else."
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-20">
            <Header />

            <div className="py-20 lg:py-32">
                <PricingComponent />
            </div>

            {/* Comparison Table Section could go here */}

            {/* FAQ Section */}
            <section className="py-24 px-6 bg-gray-50 border-t border-gray-100">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-600">Everything you need to know about our plans and pricing.</p>
                    </div>
                    <div className="space-y-8">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                <h4 className="text-lg font-bold mb-3 flex items-center">
                                    <HelpCircle className="w-5 h-5 text-blue-600 mr-3" />
                                    {faq.q}
                                </h4>
                                <p className="text-gray-600 leading-relaxed pl-8">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security Callout */}
            <section className="py-24 px-6 max-w-7xl mx-auto text-center">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <Shield className="w-8 h-8" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold mb-6">Safe and Secure Payments</h2>
                <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
                    We use industry-standard encryption and security protocols to ensure your data and your students' payments are always protected. FlowCommerce integrates seamlessly with Stripe and PayPal.
                </p>
                <div className="flex justify-center gap-8 grayscale opacity-50">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-8" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-8" />
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PricingPage;
