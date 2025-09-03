import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Star, Quote, User } from 'lucide-react';

interface Testimonial {
  id: string;
  client_name: string;
  review: string;
  image_url?: string;
  created_at: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('testimonials-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'testimonials' }, 
        () => fetchTestimonials()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4); // Limit to 4 testimonials for the homepage

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden bg-muted/30">
      {/* Background Elements */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary-glow/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              What Our <span className="text-gradient">Clients Say</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it. Here's what our satisfied clients 
              have to say about working with DevX4.
            </p>
          </div>

          {/* Testimonials Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.length > 0 ? testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="card-glow rounded-2xl p-8 group hover:scale-105 transform transition-all duration-500 relative overflow-hidden"
                >
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 text-primary/20 group-hover:text-primary/40 transition-colors duration-500">
                    <Quote className="h-8 w-8" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-foreground text-lg leading-relaxed mb-8 relative z-10">
                    "{testimonial.review}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center space-x-4">
                    {testimonial.image_url ? (
                      <img 
                        src={testimonial.image_url} 
                        alt={testimonial.client_name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary/50 transition-colors duration-500"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 group-hover:border-primary/50 transition-colors duration-500">
                        <User className="h-7 w-7 text-primary/60" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-foreground font-semibold text-lg">{testimonial.client_name}</h4>
                      <p className="text-muted-foreground text-sm">Verified Client</p>
                    </div>
                  </div>

                  {/* Background Accent */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-glow opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              )) : (
                <div className="col-span-full text-center py-16">
                  <p className="text-muted-foreground text-lg">No testimonials available yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Trust Indicators */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-8 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="font-semibold">4.9/5 Rating</span>
              </div>
              <div className="w-px h-6 bg-border"></div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">50+ Happy Clients</span>
              </div>
              <div className="w-px h-6 bg-border"></div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">100+ Projects</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;