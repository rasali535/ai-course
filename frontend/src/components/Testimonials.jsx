import React, { useState } from 'react';
import { testimonialsData } from '../mockData';
import { Card, CardContent } from './ui/card';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from './ui/button';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  const currentTestimonial = testimonialsData[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Join the ranks of leading Coaches, Therapists, Trainers, and Consultants
          </h2>
        </div>

        {/* Testimonial Card */}
        <Card className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Image */}
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.author}
                    className="w-48 h-48 rounded-full object-cover shadow-xl border-4 border-white/20"
                  />
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Quote className="text-blue-600" size={32} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="md:col-span-2">
                <blockquote className="text-xl md:text-2xl text-white mb-6 leading-relaxed">
                  "{currentTestimonial.quote}"
                </blockquote>
                
                <div className="border-t border-white/20 pt-6">
                  <div className="font-bold text-lg text-white">
                    {currentTestimonial.author}
                  </div>
                  <div className="text-white/80">
                    {currentTestimonial.role}
                  </div>
                  <div className="text-white/60 text-sm mt-1">
                    {currentTestimonial.company}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevTestimonial}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <ChevronLeft size={24} />
              </Button>
              
              <div className="flex gap-2">
                {testimonialsData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-white w-8'
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={nextTestimonial}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <ChevronRight size={24} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Testimonials;