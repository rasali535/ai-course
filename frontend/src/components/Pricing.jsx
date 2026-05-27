import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Check, Zap } from 'lucide-react';

const pricingPlans = [
  {
    id: 'basic',
    name: 'Starter Trial',
    price: '$0',
    period: '/7 days',
    description: 'Perfect for exploring the platform before launching',
    features: [
      'Unlimited course drafts',
      'AI-powered builder demo',
      'Basic analytics',
      'Community access',
      '7-day creator tools activation'
    ],
    cta: 'Start Free Trial',
    popular: false
  },
  {
    id: 'standard',
    name: 'Pro Creator',
    price: '$49',
    period: '/month',
    description: 'Launch your academy with full power',
    features: [
      'Everything in Trial',
      'Unlimited students',
      'Advanced AI course generation',
      'Custom branding',
      'PayPal Payment integration',
      'Priority email support'
    ],
    cta: 'Get Started Pro',
    popular: true
  },
  {
    id: 'premium',
    name: 'Elite Scaling',
    price: '$99',
    period: '/month',
    description: 'For high-volume creators and teams',
    features: [
      'Everything in Pro',
      'Dedicated success manager',
      'Advanced API access',
      'White-label options',
      'Premium AI generation limits',
      'Strategy consulting'
    ],
    cta: 'Scale Now',
    popular: false
  }
];

const Pricing = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userId = localStorage.getItem('userId');

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tighter">
            Choose Your Growth Path
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Join 35,000+ creators scaling their knowledge with LearnFlow AI.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 rounded-[2.5rem] ${plan.popular
                ? 'border-2 border-blue-600 shadow-2xl scale-105 md:scale-110'
                : 'border border-gray-200 hover:shadow-xl hover:scale-105'
                }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-bl-xl flex items-center gap-1 uppercase tracking-widest italic">
                  <Zap size={14} fill="currentColor" />
                  Most Popular
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-10">
                <CardTitle className="text-2xl font-black text-gray-900 mb-2 italic uppercase tracking-tighter">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 font-bold uppercase text-xs tracking-widest ml-1">{plan.period}</span>
                </div>
                <CardDescription className="text-xs font-medium italic">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-8 px-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center mt-0.5 border border-blue-100">
                        <Check className="text-blue-600" size={12} />
                      </div>
                      <span className="text-gray-600 text-[11px] font-medium leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="px-8 pb-10">
                <Link 
                  to={plan.id === 'basic' ? (!isLoggedIn ? '/signup?role=creator&plan=basic' : '/dashboard') : (isLoggedIn ? `/checkout?plan=${plan.id}&user_id=${userId}` : `/signup?role=creator&plan=${plan.id}`)} 
                  className="w-full"
                >
                  <Button
                    className={`w-full h-14 rounded-2xl font-black text-sm tracking-widest uppercase transition-all ${plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 font-medium">
            All plans include a <span className="text-blue-600 font-bold underline">7-day free trial</span> • 0% Transaction Fees • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;