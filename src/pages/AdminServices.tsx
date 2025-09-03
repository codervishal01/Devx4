import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  sort_order: number;
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      toast({
        title: "Error",
        description: "Failed to fetch services.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const serviceData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      icon: formData.get('icon') as string,
      sort_order: editingService?.sort_order || services.length + 1,
    };

    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Service updated successfully." });
      } else {
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Service created successfully." });
      }

      setIsDialogOpen(false);
      setEditingService(null);
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: "Error",
        description: "Failed to save service.",
        variant: "destructive",
      });
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Service deleted successfully." });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: "Failed to delete service.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingService(null);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" role="main" aria-labelledby="services-title">
      <div className="flex justify-between items-center">
        <div>
          <h1 id="services-title" className="text-3xl font-bold text-foreground">Services Management</h1>
          <p className="text-muted-foreground">Manage your service offerings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" role="form" aria-label="Service form">
              <div>
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingService?.name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingService?.description}
                  required
                />
              </div>
              <div>
                <Label htmlFor="icon">Icon Name (Lucide React)</Label>
                <Input
                  id="icon"
                  name="icon"
                  defaultValue={editingService?.icon}
                  placeholder="e.g., Globe, Palette, Video"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingService ? 'Update Service' : 'Create Service'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="region" aria-label="Services list">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Icon: {service.icon}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(service)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteService(service.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}