import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CaseStudiesComponent from '../components/CaseStudies';

const CaseStudies = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <div className="pt-20">
                <CaseStudiesComponent />
            </div>
            <Footer />
        </div>
    );
};

export default CaseStudies;
