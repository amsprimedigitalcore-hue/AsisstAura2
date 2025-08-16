import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AmazonServices from './pages/services/AmazonServices';
import ShopifyServices from './pages/services/ShopifyServices';
import MetaAds from './pages/services/MetaAds';
import WebDevelopment from './pages/services/WebDevelopment';
import CGIAds from './pages/services/CGIAds';
import GraphicDesign from './pages/services/GraphicDesign';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/amazon-services" element={<AmazonServices />} />
            <Route path="/shopify-services" element={<ShopifyServices />} />
            <Route path="/meta-ads" element={<MetaAds />} />
            <Route path="/web-development" element={<WebDevelopment />} />
            <Route path="/cgi-ads" element={<CGIAds />} />
            <Route path="/graphic-design" element={<GraphicDesign />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;