import { Target, Eye, Award, Users } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Mission',
      description: 'To empower businesses with cutting-edge digital solutions that drive growth and success.'
    },
    {
      icon: Eye,
      title: 'Vision',
      description: 'To be the leading digital agency that transforms ideas into powerful digital realities.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We deliver exceptional quality in every project, exceeding client expectations consistently.'
    },
    {
      icon: Users,
      title: 'Partnership',
      description: 'We build lasting relationships with our clients, becoming their trusted digital partners.'
    }
  ];

  return (
    <section id="about" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-primary-glow/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="text-gradient">DevX4</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We are a passionate team of digital innovators, designers, and developers 
              dedicated to transforming your ideas into powerful digital experiences that 
              drive real business results.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Text Content */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-foreground">
                Crafting Digital Excellence Since 2024
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At DevX4, we believe that every business deserves a strong digital presence. 
                Our team combines creativity, technical expertise, and strategic thinking to 
                deliver solutions that not only look amazing but also drive meaningful results.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From stunning websites and compelling visual designs to engaging video content 
                and effective social media strategies, we provide comprehensive digital services 
                that help businesses thrive in the digital landscape.
              </p>
              
              {/* Key Points */}
              <div className="space-y-4 mt-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">Full-service digital agency</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">Results-driven approach</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">Cutting-edge technology</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">24/7 client support</span>
                </div>
              </div>
            </div>

            {/* Image/Visual Element */}
            <div className="relative">
              <div className="card-glow rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary to-primary-glow rounded-full mx-auto flex items-center justify-center animate-pulse-glow">
                    <span className="text-3xl font-bold text-white">DX</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gradient">Innovation Hub</h4>
                  <p className="text-muted-foreground">Where creativity meets technology</p>
                </div>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card-glow rounded-xl p-6 text-center group hover:scale-105 transform transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-full mx-auto mb-4 flex items-center justify-center group-hover:animate-pulse-glow">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-foreground">{value.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;