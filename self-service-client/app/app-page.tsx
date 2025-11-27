"use client";
import { useState } from "react";
import HeroSection from "./pages/hero-section";
import Loader from "./pages/loader";
import HowItWorksSection from "./pages/how-it-works";
import MenuSection from "./pages/menu-section";
import ScanSection from "./pages/scan-section";
import Footer from "./pages/footer";

const AppPage = () => {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <Loader onFinish={() => setLoading(false)} />;
  }
  return (
    <main>
      <HeroSection />
      <HowItWorksSection />
      <MenuSection />
      <ScanSection/>
      <Footer/>
    </main>
  );
};

export default AppPage;
