import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminSidebar } from './AdminSidebar';

export function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex" role="document">
      <aside role="complementary" aria-label="Admin navigation sidebar" className="w-64 hidden md:block">
        <AdminSidebar />
      </aside>
      <div className="flex-1 flex flex-col" role="main">
        <main className="flex-1 p-6" aria-label="Admin dashboard content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}