import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageCircle, Phone, Mail, ExternalLink, X, ZoomIn } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Website' | 'Graphics' | 'Video' | 'Ads';
  status: 'ongoing' | 'completed';
  image_url?: string;
  project_link?: string;
  created_at: string;
}

const ProjectsByCategory = () => {
  const { category } = useParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryMap = {
    'website': 'Website',
    'graphics': 'Graphics',
    'video': 'Video',
    'ads': 'Ads'
  };

  const categoryName = categoryMap[category as keyof typeof categoryMap] || category;

  useEffect(() => {
    if (category) {
      fetchProjects();
    }
  }, [category]);

  const fetchProjects = async () => {
    try {
      // Map the URL parameter to the correct database value
      const categoryEnumValue = categoryMap[category as keyof typeof categoryMap];
      
      if (!categoryEnumValue) {
        console.error('Invalid category:', category);
        setProjects([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('category', categoryEnumValue)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleCall = () => {
    window.location.href = 'tel:7999671829';
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/917999671829', '_blank');
  };

  const handleEmail = () => {
            window.location.href = 'mailto:devx4official@gmail.com';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" role="document">
      {/* Header */}
      <header role="banner" className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <nav role="navigation" aria-label="Breadcrumb navigation" className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </nav>
          <h1 id="page-heading" className="text-4xl font-bold text-gradient">{categoryName} Projects</h1>
          <p className="text-muted-foreground mt-2">
            Explore our {categoryName.toLowerCase()} portfolio and see our work in action
          </p>
        </div>
      </header>

      {/* Projects Grid */}
      <main role="main" aria-labelledby="page-heading" className="container mx-auto px-4 py-12">
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold mb-4">No Projects Found</h3>
            <p className="text-muted-foreground">
              We don't have any {categoryName.toLowerCase()} projects to showcase yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" role="grid" aria-label={`${categoryName} projects gallery`}>
            {projects.map((project) => (
              <div 
                key={project.id} 
                role="gridcell"
                className="card-glow rounded-2xl p-6 group cursor-pointer hover:scale-105 transform transition-all duration-300"
                onClick={() => handleCardClick(project)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(project);
                  }
                }}
                aria-label={`View details for ${project.title}`}
              >
                {/* Project Image */}
                <div className="aspect-video rounded-lg overflow-hidden mb-6 bg-muted relative">
                  {project.image_url ? (
                    <>
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Zoom Icon Overlay */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-background/80 backdrop-blur-sm rounded-full p-2">
                          <ZoomIn className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-gradient transition-colors">
                      {project.title}
                    </h3>
                    <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {project.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2" role="group" aria-label="Project actions">
                    {project.project_link && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.project_link, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Website
                      </Button>
                    )}
                    <Button 
                      variant="default" 
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsApp();
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Discuss
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Contact Section */}
      <section role="complementary" aria-labelledby="cta-heading" className="bg-card border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 id="cta-heading" className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Let's discuss how we can help bring your vision to life. Get in touch with us today!
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto" role="group" aria-label="Contact options">
            <Button 
              variant="outline" 
              size="lg" 
              className="h-16 flex flex-col items-center justify-center gap-2"
              onClick={handleCall}
              aria-label="Call DevX4 at +91 7999671829"
            >
              <Phone className="h-6 w-6" />
              <span>Call Us</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="h-16 flex flex-col items-center justify-center gap-2"
              onClick={handleWhatsApp}
              aria-label="Start WhatsApp chat with DevX4"
            >
              <MessageCircle className="h-6 w-6" />
              <span>WhatsApp</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="h-16 flex flex-col items-center justify-center gap-2"
              onClick={handleEmail}
              aria-label="Send email to devx4official@gmail.com"
            >
              <Mail className="h-6 w-6" />
              <span>Email</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" role="dialog" aria-labelledby="modal-title">
          <DialogHeader>
            <DialogTitle id="modal-title" className="flex items-center justify-between">
              <span>{selectedProject?.title}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="h-8 w-8 p-0"
                aria-label="Close project details modal"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-4">
              {/* Full Size Image */}
              <div className="relative">
                {selectedProject.image_url ? (
                  <img
                    src={selectedProject.image_url}
                    alt={selectedProject.title}
                    className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                    No Image Available
                  </div>
                )}
              </div>
              
              {/* Project Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-primary font-medium">
                    {categoryName}
                  </span>
                  <Badge variant={selectedProject.status === 'completed' ? 'default' : 'secondary'}>
                    {selectedProject.status}
                  </Badge>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground">
                  {selectedProject.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {selectedProject.description}
                </p>
                
                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {selectedProject.project_link && (
                    <Button 
                      variant="default"
                      className="flex-1"
                      onClick={() => window.open(selectedProject.project_link, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Project
                    </Button>
                  )}
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      closeModal();
                      handleWhatsApp();
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Discuss Project
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsByCategory;