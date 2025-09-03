import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  const [instagramUrl, setInstagramUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('setting_key', 'instagram_feed_url')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setInstagramUrl(data.setting_value || '');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          setting_key: 'instagram_feed_url',
          setting_value: instagramUrl,
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Settings saved successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage website settings and configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="instagram_url">Instagram Profile URL</Label>
            <Input
              id="instagram_url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://www.instagram.com/devx4official/"
            />
            <p className="text-sm text-muted-foreground mt-1">
              This URL will be used for the Instagram feed section on the main website.
            </p>
          </div>
          
          <Button 
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You are currently signed in as an admin. All changes made here will be reflected 
            on the main website in real-time.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}