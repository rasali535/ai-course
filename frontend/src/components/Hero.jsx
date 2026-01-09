import { Link } from 'react-router-dom';
import { heroData } from '../mockData';
import { Button } from './ui/button';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-6 animate-fade-in">
              <span className="text-sm font-medium text-blue-600">{heroData.trustBadge}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up">
              {heroData.title}
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-200">
              {heroData.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-400">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {heroData.primaryCTA}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300 w-full sm:w-auto"
                >
                  {heroData.secondaryCTA}
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 opacity-60">
              <div className="text-sm text-gray-600">Trusted by leading companies:</div>
              <div className="flex gap-4">
                <div className="h-8 px-4 bg-white/60 rounded flex items-center text-xs font-semibold text-gray-700">LEAVITT</div>
                <div className="h-8 px-4 bg-white/60 rounded flex items-center text-xs font-semibold text-gray-700">HOOTSUITE</div>
                <div className="h-8 px-4 bg-white/60 rounded flex items-center text-xs font-semibold text-gray-700">KEAP</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image/Visual */}
          <div className="relative animate-fade-in animation-delay-600">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <img
                src={heroData.backgroundImage}
                alt="Online learning platform"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20"></div>

              {/* Floating stats card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">35K+</div>
                    <div className="text-sm text-gray-600">Active businesses</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">$3.7B</div>
                    <div className="text-sm text-gray-600">Revenue generated</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative floating element */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
              <Play className="text-white" size={32} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;