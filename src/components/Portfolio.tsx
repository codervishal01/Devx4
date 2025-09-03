import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Github, X, ZoomIn, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import portfolioWeb from '@/assets/portfolio-web.jpg';

interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Website' | 'Graphics' | 'Video' | 'Ads';
  status: 'ongoing' | 'completed';
  image_url?: string;
  project_link?: string;
}

const categoryMap = {
  'Website': 'Web Development',
  'Graphics': 'Graphic Design', 
  'Video': 'Video Production',
  'Ads': 'Digital Marketing'
};

const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'ongoing'>('all');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout>();
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    fetchProjects();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('portfolio-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' }, 
        () => fetchProjects()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProjects = async () => {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && projects.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
      }, 3000); // 3 seconds per slide
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, projects.length]);

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Touch/swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide(); // Swipe left
      } else {
        prevSlide(); // Swipe right
      }
    }
  };

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
      }, 3000);
    }
  };

  return (
    <section id="portfolio" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Our <span className="text-gradient">Portfolio</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover our latest projects and see how we've helped businesses 
              transform their digital presence and achieve remarkable results.
            </p>
          </div>

          {/* Status Filter */}
          <div className="flex justify-center mb-12">
            <div className="flex gap-2 bg-card p-1 rounded-lg border">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                All Projects
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('completed')}
              >
                Completed
              </Button>
              <Button
                variant={statusFilter === 'ongoing' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('ongoing')}
              >
                Ongoing
              </Button>
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAutoPlay}
              className="flex items-center gap-2"
            >
              {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isAutoPlaying ? 'Pause' : 'Play'}
            </Button>
          </div>

          {/* Portfolio Carousel */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : projects.length > 0 ? (
            <div className="relative group">
              {/* Navigation Arrows */}
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm border-border hover:bg-background hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm border-border hover:bg-background hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
                onClick={nextSlide}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              {/* Carousel Container */}
              <div 
                ref={carouselRef}
                className="relative overflow-hidden rounded-2xl"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div 
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {projects.map((project, index) => (
                    <div 
                      key={project.id} 
                      className="w-full flex-shrink-0 px-4"
                      style={{ minWidth: '100%' }}
                    >
                      <div className="max-w-4xl mx-auto">
                        <div 
                          className="group relative overflow-hidden rounded-2xl card-glow hover:scale-105 transform transition-all duration-500 cursor-pointer bg-card border border-border"
                          onClick={() => handleCardClick(project)}
                        >
                          {/* Image */}
                          <div className="relative overflow-hidden">
                            <img 
                              src={project.image_url || portfolioWeb} 
                              alt={project.title}
                              className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-500"></div>
                            
                            {/* Zoom Icon Overlay */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-background/80 backdrop-blur-sm rounded-full p-2">
                                <ZoomIn className="h-5 w-5 text-primary" />
                              </div>
                            </div>
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                              <div className="flex space-x-3">
                                {project.project_link ? (
                                  <a 
                                    href={project.project_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Button size="sm" className="bg-primary/90 hover:bg-primary text-white">
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      View
                                    </Button>
                                  </a>
                                ) : (
                                  <Button size="sm" className="bg-primary/90 hover:bg-primary text-white">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View
                                  </Button>
                                )}
                                <Button size="sm" variant="outline" className="bg-background/90 hover:bg-muted">
                                  <Github className="h-4 w-4 mr-2" />
                                  Code
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm text-primary font-medium">
                                {categoryMap[project.category]}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                project.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {project.status}
                              </span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-gradient transition-all duration-300">
                              {project.title}
                            </h3>
                            
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                              {project.description}
                            </p>

                            {/* Category Tag */}
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">
                                {project.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-8 gap-2">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-primary scale-125' 
                        : 'bg-muted hover:bg-muted-foreground'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {statusFilter === 'all' 
                  ? 'No projects available yet.' 
                  : `No ${statusFilter} projects available yet.`
                }
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-16">
          <Button asChild className="btn-hero" size="lg">
            <a href="#portfolio">
              View All Projects
            </a>
          </Button>

          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedProject?.title}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-4">
              {/* Full Size Image */}
              <div className="relative">
                <img
                  src={selectedProject.image_url || portfolioWeb}
                  alt={selectedProject.title}
                  className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                />
              </div>
              
              {/* Project Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-primary font-medium">
                    {categoryMap[selectedProject.category]}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedProject.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedProject.status}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground">
                  {selectedProject.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {selectedProject.description}
                </p>
                
                {/* Action Buttons */}
                {selectedProject.project_link && (
                  <div className="pt-2">
                    <a 
                      href={selectedProject.project_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Project
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Portfolio;