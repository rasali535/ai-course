import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

const faqs = [
  {
    question: 'How does the free trial work?',
    answer: 'You can start a 14-day free trial of any plan without entering a credit card. During the trial, you\'ll have full access to all features of your chosen plan. If you decide to continue after the trial, you can easily upgrade to a paid plan.'
  },
  {
    question: 'Can I change my plan later?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. If you upgrade, you\'ll have immediate access to new features. If you downgrade, changes will take effect at the start of your next billing cycle.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) and PayPal. For Enterprise plans, we also offer invoicing and wire transfer options.'
  },
  {
    question: 'Is there a limit on the number of courses I can create?',
    answer: 'No! All plans include unlimited course creation. You can create as many courses, lessons, and learning paths as you need to grow your business.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with our platform within the first 30 days of your paid subscription, contact our support team for a full refund.'
  },
  {
    question: 'Can I use my own domain name?',
    answer: 'Absolutely! All plans allow you to connect your own custom domain. We provide step-by-step instructions to help you set this up, and our support team is always available to assist.'
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'All plans include email support with response times within 24 hours. Pro plans get priority support with faster response times. Enterprise customers receive 24/7 phone support and a dedicated account manager.'
  },
  {
    question: 'Can I migrate my existing courses from another platform?',
    answer: 'Yes! We offer migration assistance to help you transfer your courses, students, and data from other platforms. Our team will work with you to ensure a smooth transition with minimal disruption to your students.'
  }
];

const FAQ = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 uppercase tracking-tight">
            Frequently asked questions
          </h2>
          <p className="text-lg text-gray-600">
            Have questions? We've got answers. If you can't find what you're looking for, contact our support team.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-blue-600 py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-4">
            Our support team is here to help you get started.
          </p>
          <Link
            to="/contact"
            className="text-blue-600 hover:text-purple-600 font-semibold"
          >
            Contact support →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQ;