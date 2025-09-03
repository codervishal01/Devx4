import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  sort_order: number;
}

// Type assertion to ensure the icon exists
const getIcon = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.Code; // fallback to Code icon
};

// Map service names to canonical category slugs
const getCategorySlug = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('website')) return 'website';
  if (n.includes('graphic')) return 'graphics';
  if (n.includes('video')) return 'video';
  if (n.includes('ads') || n.includes('social')) return 'ads';
  return n.replace(/\s+/g, '-');
};

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('services-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'services' }, 
        () => fetchServices()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="services" role="region" aria-labelledby="services-heading" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 id="services-heading" className="text-4xl md:text-6xl font-bold mb-6">
              Our <span className="text-gradient">Services</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From concept to completion, we provide comprehensive digital services 
              that help your business succeed in the digital world.
            </p>
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {services.map((service, index) => {
                const Icon = getIcon(service.icon);
                const colorOptions = [
                  'from-blue-500 to-cyan-500',
                  'from-purple-500 to-pink-500',
                  'from-orange-500 to-red-500',
                  'from-green-500 to-emerald-500'
                ];
                const color = colorOptions[index % colorOptions.length];
                
                return (
                  <div 
                    key={service.id} 
                    className="card-glow rounded-2xl p-8 group hover:scale-105 transform transition-all duration-500 relative overflow-hidden"
                  >
                    {/* Background Gradient */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500`}></div>
                    
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-xl mb-6 flex items-center justify-center group-hover:animate-pulse-glow`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-gradient transition-all duration-300">
                        {service.name}
                      </h3>
                      
                      <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                        {service.description}
                      </p>

                      {/* CTA */}
                      <Button 
                        variant="outline" 
                        className="bg-transparent border-border hover:bg-primary/10 hover:border-primary group-hover:shadow-lg transition-all duration-300"
                        onClick={() => navigate(`/projects/${getCategorySlug(service.name)}`)}
                      >
                        View Projects
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center">
            <div className="card-glow rounded-2xl p-8 lg:p-12 bg-gradient-to-r from-card to-muted">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your <span className="text-gradient">Digital Presence?</span>
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let's discuss your project and create something amazing together. 
                Our team is ready to bring your vision to life.
              </p>
              <Button className="btn-hero" size="lg">
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;