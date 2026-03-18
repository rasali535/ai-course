import React from 'react';
import { platformFeaturesData } from '../mockData';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Check } from 'lucide-react';

const PlatformFeatures = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Everything you need to turn your knowledge into income.
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools built specifically for Coaches, Therapists, Trainers, and Consultants.
          </p>
        </div>

        {/* Features Tabs */}
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 mb-12">
            <TabsTrigger value="courses" className="text-sm md:text-base">Courses</TabsTrigger>
            <TabsTrigger value="selling" className="text-sm md:text-base">Selling Tools</TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm md:text-base">Analytics</TabsTrigger>
          </TabsList>

          {platformFeaturesData.map((feature) => (
            <TabsContent key={feature.id} value={feature.id} className="mt-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Image/Visual */}
                <div className="order-2 lg:order-1">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📊</div>
                      <div className="text-sm text-gray-600">Platform Interface Preview</div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="order-1 lg:order-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-lg text-gray-600 mb-6">
                    {feature.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {feature.features.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <Check className="text-blue-600" size={16} />
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="outline"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    {feature.cta}
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default PlatformFeatures;