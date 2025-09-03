import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell } from 'recharts';
import { FolderOpen, Briefcase, CheckCircle, Clock } from 'lucide-react';

interface DashboardStats {
  totalProjects: number;
  totalServices: number;
  completedProjects: number;
  ongoingProjects: number;
  projectsByCategory: Array<{ category: string; count: number }>;
}

const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalServices: 0,
    completedProjects: 0,
    ongoingProjects: 0,
    projectsByCategory: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [projectsRes, servicesRes, completedRes, ongoingRes] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('services').select('*'),
        supabase.from('projects').select('*').eq('status', 'completed'),
        supabase.from('projects').select('*').eq('status', 'ongoing'),
      ]);

      // Count projects by category
      const categoryStats = projectsRes.data?.reduce((acc: any, project) => {
        acc[project.category] = (acc[project.category] || 0) + 1;
        return acc;
      }, {});

      const projectsByCategory = Object.entries(categoryStats || {}).map(([category, count]) => ({
        category,
        count: count as number,
      }));

      setStats({
        totalProjects: projectsRes.data?.length || 0,
        totalServices: servicesRes.data?.length || 0,
        completedProjects: completedRes.data?.length || 0,
        ongoingProjects: ongoingRes.data?.length || 0,
        projectsByCategory,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
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
    <div className="space-y-6" role="main" aria-labelledby="dashboard-title">
      <div>
        <h1 id="dashboard-title" className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your DevX4 portfolio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="region" aria-label="Dashboard statistics">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServices}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing Projects</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ongoingProjects}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" role="region" aria-label="Dashboard charts">
        <Card>
          <CardHeader>
            <CardTitle id="category-chart-title">Projects by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300} role="img" aria-labelledby="category-chart-title">
              <BarChart data={stats.projectsByCategory}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle id="status-chart-title">Project Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300} role="img" aria-labelledby="status-chart-title">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Completed', value: stats.completedProjects },
                    { name: 'Ongoing', value: stats.ongoingProjects },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#28a745" />
                  <Cell fill="#ffc107" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}