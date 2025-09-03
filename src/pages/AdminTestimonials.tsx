import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, User } from 'lucide-react';

interface Testimonial {
  id: string;
  client_name: string;
  review: string;
  image_url?: string;
  created_at: string;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: "Error",
        description: "Failed to fetch testimonials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('testimonial-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('testimonial-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    let imageUrl = editingTestimonial?.image_url;
    
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
      if (!imageUrl) {
        toast({
          title: "Error",
          description: "Failed to upload image.",
          variant: "destructive",
        });
        return;
      }
    }

    const testimonialData = {
      client_name: formData.get('client_name') as string,
      review: formData.get('review') as string,
      image_url: imageUrl,
    };

    try {
      if (editingTestimonial) {
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialData)
          .eq('id', editingTestimonial.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Testimonial updated successfully." });
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([testimonialData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Testimonial created successfully." });
      }

      setIsDialogOpen(false);
      setEditingTestimonial(null);
      setImageFile(null);
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to save testimonial.",
        variant: "destructive",
      });
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Testimonial deleted successfully." });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingTestimonial(null);
    setImageFile(null);
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
    <div className="space-y-6" role="main" aria-labelledby="testimonials-title">
      <div className="flex justify-between items-center">
        <div>
          <h1 id="testimonials-title" className="text-3xl font-bold text-foreground">Testimonials Management</h1>
          <p className="text-muted-foreground">Manage client testimonials and reviews</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" role="form" aria-label="Testimonial form">
              <div>
                <Label htmlFor="client_name">Client Name</Label>
                <Input
                  id="client_name"
                  name="client_name"
                  defaultValue={editingTestimonial?.client_name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="review">Review</Label>
                <Textarea
                  id="review"
                  name="review"
                  defaultValue={editingTestimonial?.review}
                  required
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="image">Client Photo (Optional)</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="region" aria-label="Testimonials list">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {testimonial.image_url ? (
                    <img
                      src={testimonial.image_url}
                      alt={testimonial.client_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">{testimonial.client_name}</CardTitle>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(testimonial)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteTestimonial(testimonial.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic">
                "{testimonial.review}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}