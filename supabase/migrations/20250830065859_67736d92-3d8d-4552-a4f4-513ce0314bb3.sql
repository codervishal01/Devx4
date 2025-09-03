-- Create enum for project categories
CREATE TYPE project_category AS ENUM ('Website', 'Graphics', 'Video', 'Ads');

-- Create enum for project status
CREATE TYPE project_status AS ENUM ('ongoing', 'completed');

-- Create projects table
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category project_category NOT NULL,
    status project_status DEFAULT 'ongoing',
    image_url TEXT,
    project_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name TEXT NOT NULL,
    review TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_settings table
CREATE TABLE public.admin_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for the main website)
CREATE POLICY "Anyone can view projects" ON public.projects
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view services" ON public.services
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view testimonials" ON public.testimonials
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view settings" ON public.admin_settings
    FOR SELECT USING (true);

-- Create policies for admin access (authenticated users can manage all data)
CREATE POLICY "Authenticated users can manage projects" ON public.projects
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage services" ON public.services
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage testimonials" ON public.testimonials
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage settings" ON public.admin_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);

-- Create storage policies
CREATE POLICY "Anyone can view project images" ON storage.objects
    FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload project images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update project images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete project images" ON storage.objects
    FOR DELETE USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

-- Create storage bucket for testimonial images
INSERT INTO storage.buckets (id, name, public) VALUES ('testimonial-images', 'testimonial-images', true);

-- Create storage policies for testimonials
CREATE POLICY "Anyone can view testimonial images" ON storage.objects
    FOR SELECT USING (bucket_id = 'testimonial-images');

CREATE POLICY "Authenticated users can upload testimonial images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'testimonial-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update testimonial images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'testimonial-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete testimonial images" ON storage.objects
    FOR DELETE USING (bucket_id = 'testimonial-images' AND auth.role() = 'authenticated');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON public.admin_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default services
INSERT INTO public.services (name, description, icon, sort_order) VALUES
('Website Development', 'Custom websites built with modern technologies and responsive design', 'Globe', 1),
('Graphic Designing', 'Creative visual designs for branding, marketing materials and digital assets', 'Palette', 2),
('Video Editing', 'Professional video editing and post-production services', 'Video', 3),
('Social Media Handling & Meta Ads', 'Complete social media management and targeted advertising campaigns', 'Share2', 4);

-- Insert default testimonials
INSERT INTO public.testimonials (client_name, review) VALUES
('Sarah Johnson', 'DevX4 transformed our online presence completely. Their web development skills are outstanding and the results exceeded our expectations.'),
('Mike Chen', 'Professional team that delivers quality work on time. Their graphic design services helped establish our brand identity perfectly.'),
('Emily Rodriguez', 'Amazing video editing work! They understood our vision and created content that perfectly represents our brand.');

-- Insert default settings
INSERT INTO public.admin_settings (setting_key, setting_value) VALUES
('instagram_feed_url', 'https://www.instagram.com/devx4official/');

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_settings;