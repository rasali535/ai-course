import React from 'react';
import { featuresData } from '../mockData';
import { Button } from './ui/button';
import { ArrowRight, Sparkles, TrendingUp, HeadphonesIcon } from 'lucide-react';

const iconMap = {
  1: Sparkles,
  2: TrendingUp,
  3: HeadphonesIcon
};

const Features = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            We help you launch your course in 48 hours — even if you've never done it before.
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get everything you need to succeed: professional templates, step-by-step guidance, and optional support every step of the way.
          </p>
        </div>

        {/* Features Grid */}
        <div className="space-y-24">
          {featuresData.map((feature, index) => {
            const Icon = iconMap[feature.id];
            const isEven = index % 2 === 0;
            
            return (
              <div
                key={feature.id}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  isEven ? '' : 'lg:grid-flow-dense'
                }`}
              >
                {/* Image */}
                <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'} group`}>
                  <div className="relative rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-500">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-purple-600/10 group-hover:from-blue-600/20 group-hover:to-purple-600/20 transition-all duration-300"></div>
                  </div>
                </div>

                {/* Content */}
                <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-6">
                    <Icon className="text-blue-600" size={28} />
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-lg text-gray-600 mb-6">
                    {feature.description}
                  </p>
                  
                  <Button
                    variant="link"
                    className="text-blue-600 hover:text-purple-600 p-0 h-auto font-semibold group"
                  >
                    {feature.cta}
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Early Access (Limited Spots)
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;