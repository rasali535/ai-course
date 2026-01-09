import { Link } from 'react-router-dom';
import { caseStudiesData } from '../mockData';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ArrowRight } from 'lucide-react';

const CaseStudies = () => {
  return (
    <section id="case-studies" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Platform-powered success stories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the features and tools used by top-earning businesses on our platform.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudiesData.map((study) => (
            <Card
              key={study.id}
              className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden bg-white"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={study.image}
                  alt={study.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {study.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <CardDescription className="text-gray-600 text-base">
                  {study.description}
                </CardDescription>
              </CardContent>

              <CardFooter>
                <Button
                  variant="link"
                  className="text-blue-600 hover:text-purple-600 p-0 h-auto font-semibold group/btn"
                >
                  {study.cta}
                  <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Our customers have earned $3.7 billion with LearnFlow
            </h3>
            <p className="text-lg text-gray-600">
              Talk to one of our team members to discover how our award-winning platform can help you drive revenue and retention.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg w-full sm:w-auto"
              >
                Talk to sales
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50"
            >
              Start free trial
            </Button>
          </div>

          {/* Awards */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 opacity-60">
            <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600">G2</div>
            <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600">Trust</div>
            <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600">Award</div>
            <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600">Top 50</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;