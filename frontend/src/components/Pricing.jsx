import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Check, Zap } from 'lucide-react';

const pricingPlans = [
  {
    id: 1,
    name: 'Basic',
    price: '$49',
    period: '/month',
    description: 'Perfect for getting started with your first course',
    features: [
      'Unlimited courses',
      'Up to 100 students',
      'Basic analytics',
      'Email support',
      'Custom domain',
      'Basic course builder'
    ],
    cta: 'Start free trial',
    popular: false
  },
  {
    id: 2,
    name: 'Pro',
    price: '$99',
    period: '/month',
    description: 'Best for growing your learning business',
    features: [
      'Everything in Basic',
      'Unlimited students',
      'Advanced analytics',
      'Priority support',
      'Custom branding',
      'AI-powered tools',
      'Memberships & communities',
      'Advanced selling features'
    ],
    cta: 'Start free trial',
    popular: true
  },
  {
    id: 3,
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations and teams',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom integrations',
      'API access',
      'Advanced security',
      'SLA guarantee',
      'Onboarding support'
    ],
    cta: 'Contact sales',
    popular: false
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your learning business. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 ${
                plan.popular
                  ? 'border-2 border-blue-600 shadow-2xl scale-105 md:scale-110'
                  : 'border border-gray-200 hover:shadow-xl hover:scale-105'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-bl-lg flex items-center gap-1">
                  <Zap size={14} fill="currentColor" />
                  MOST POPULAR
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl md:text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-8">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <Check className="text-green-600" size={14} />
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            All plans include 14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;