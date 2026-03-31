import React from "react";
import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import AIResources from "./pages/AIResources";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Dashboard from "./pages/Dashboard";
import CourseBuilder from "./pages/CourseBuilder";
import CourseViewer from "./pages/CourseViewer";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import VerifyEmail from "./pages/VerifyEmail";
import Courses from "./pages/Courses";
import LearnerDashboard from "./pages/LearnerDashboard";
import CaseStudies from "./pages/CaseStudies";
import Updates from "./pages/Updates";
import Careers from "./pages/Careers";
import HelpCenter from "./pages/HelpCenter";
import Community from "./pages/Community";
import CookieSettings from "./pages/CookieSettings";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/ai-resources" element={<AIResources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/course-builder" element={<CourseBuilder />} />
          <Route path="/course-builder/:id" element={<CourseBuilder />} />
          <Route path="/course/:id" element={<CourseViewer />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/learner-dashboard" element={<LearnerDashboard />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/community" element={<Community />} />
          <Route path="/cookie-settings" element={<CookieSettings />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;