import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

const Hero = () => {
  return (
    <section id="home" role="main" aria-labelledby="hero-heading" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-animated"></div>
      
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      ></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary-glow/20 rounded-full blur-xl float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary/30 rounded-full blur-lg float" style={{ animationDelay: '4s' }}></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-8 animate-pulse-glow">
            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
            Digital Agency Excellence
          </div>

          {/* Main Heading */}
          <h1 id="hero-heading" className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="text-gradient">Transforming</span>
            <br />
            <span className="text-foreground">Ideas into</span>
            <br />
            <span className="text-gradient">Digital Reality</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            We craft exceptional digital experiences through innovative web development, 
            stunning design, and strategic digital marketing.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button
            asChild
            className="btn-hero group"
            size="lg"
          >
            <a
              href="https://wa.me/917999671829?text=Hi%2C%20I%20want%20to%20know%20more%20about%20your%20services"
              target="_blank"
              rel="noopener noreferrer"
            >
              Let's Work Together
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>

            
          <Button
            asChild
            variant="outline"
            size="lg"
            className="bg-transparent border-border hover:bg-primary/10 hover:border-primary"
          >
            <a href="#portfolio">
              <Play className="mr-2 h-5 w-5" />
              Watch Our Work
            </a>
          </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">100+</div>
              <div className="text-muted-foreground">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">50+</div>
              <div className="text-muted-foreground">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">2+</div>
              <div className="text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">24/7</div>
              <div className="text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;