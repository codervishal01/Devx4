import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background" role="document">
      <Header />
      <main role="main">
        <Hero />
        <Services />
        <Portfolio />
        <Testimonials />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
