import { Button } from '@/components/ui/button';
import { Mail, Phone, MessageCircle, MapPin, Instagram, Linkedin, Twitter, Clock } from 'lucide-react';

const Contact = () => {
  const handleCall = () => {
    window.location.href = 'tel:7999671829';
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/917999671829', '_blank');
  };

  const handleEmail = () => {
            window.location.href = 'mailto:devx4official@gmail.com';
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
              value: 'devx4official@gmail.com',
        link: 'mailto:devx4official@gmail.com'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 7999671829',
      link: 'tel:7999671829'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'India',
      link: '#'
    }
  ];

  const socialLinks = [
    {
      icon: Instagram,
      name: 'Instagram',
      url: 'https://www.instagram.com/devx4official/',
      color: 'hover:text-pink-500'
    },
    {
      icon: Linkedin,
      name: 'LinkedIn',
      url: '#',
      color: 'hover:text-blue-600'
    },
    {
      icon: Twitter,
      name: 'Twitter',
      url: '#',
      color: 'hover:text-blue-400'
    }
  ];

  return (
    <section id="contact" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Let's <span className="text-gradient">Connect</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Ready to transform your digital presence? Get in touch with us today 
              and let's discuss how we can bring your vision to life.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Direct Contact Options */}
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold mb-6 text-foreground">Get In Touch</h3>
                <p className="text-muted-foreground text-lg">
                  Choose your preferred way to contact us and let's discuss your requirements.
                </p>
              </div>

              {/* Direct Contact Buttons */}
              <div className="space-y-6">
                <Button 
                  onClick={handleCall}
                  className="w-full btn-hero h-16 text-lg"
                  size="lg"
                >
                  <Phone className="h-6 w-6 mr-3" />
                  Call Now: +91 7999671829
                </Button>

                <Button 
                  onClick={handleWhatsApp}
                  variant="outline"
                  className="w-full h-16 text-lg border-green-500/50 hover:bg-green-500/10 text-green-400 hover:text-green-300"
                  size="lg"
                >
                  <MessageCircle className="h-6 w-6 mr-3" />
                  WhatsApp Chat
                </Button>

                <Button 
                  onClick={handleEmail}
                  variant="outline"
                  className="w-full h-16 text-lg"
                  size="lg"
                >
                  <Mail className="h-6 w-6 mr-3" />
                  Email: devx4official@gmail.com
                </Button>
              </div>

              {/* Quick Response Promise */}
              <div className="card-glow rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <Clock className="h-8 w-8 text-primary" />
                  <div>
                    <h4 className="font-semibold text-primary">Quick Response Guaranteed</h4>
                    <p className="text-sm text-muted-foreground">We'll respond within 2 hours during business hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold mb-6 text-foreground">Contact Information</h3>
                <p className="text-muted-foreground text-lg">
                  We're here to help and answer any questions you might have.
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.link}
                    className="flex items-center space-x-4 p-4 card-glow rounded-xl hover:scale-105 transform transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-glow rounded-lg flex items-center justify-center group-hover:animate-pulse-glow">
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-foreground font-semibold text-lg">{info.title}</h4>
                      <p className="text-muted-foreground">{info.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-foreground">Follow us</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-card border border-border rounded-lg flex items-center justify-center text-muted-foreground ${social.color} transition-all duration-300 hover:scale-110 hover:border-current`}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Business Hours */}
              <div className="card-glow rounded-xl p-6">
                <h4 className="text-xl font-bold mb-4 text-foreground">Business Hours</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;