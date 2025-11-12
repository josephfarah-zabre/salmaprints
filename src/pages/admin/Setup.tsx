import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Shield, Check } from "lucide-react";

const AdminSetup = () => {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const createAdminUser = async () => {
    setCreating(true);
    try {
      // Sign up the admin user
      const { data, error } = await supabase.auth.signUp({
        email: 'MohmadSalma123@admin.local',
        password: 'HHJKSHhjkshjks678678%&^*%^&',
        options: {
          emailRedirectTo: `${window.location.origin}/admin/dashboard`,
        },
      });

      if (error) {
        // If user already exists, that's okay
        if (error.message.includes('already registered')) {
          toast.success('Admin user already exists!');
          setCreated(true);
          return;
        }
        throw error;
      }

      if (data.user) {
        // Add admin role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ user_id: data.user.id, role: 'admin' });

        if (roleError && !roleError.message.includes('duplicate')) {
          throw roleError;
        }

        toast.success('Admin user created successfully!');
        setCreated(true);
      }
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast.error(error.message || 'Failed to create admin user');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md shadow-hover">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-primary rounded-full">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Admin Setup</CardTitle>
          <CardDescription>
            Create the admin account for your catalogue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="font-semibold">Admin Credentials:</p>
            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Username:</span> <code className="bg-background px-2 py-1 rounded">MohmadSalma123</code></p>
              <p><span className="text-muted-foreground">Password:</span> <code className="bg-background px-2 py-1 rounded text-xs">HHJKSHhjkshjks678678%&^*%^&</code></p>
            </div>
          </div>

          {!created ? (
            <Button
              onClick={createAdminUser}
              className="w-full bg-gradient-primary"
              disabled={creating}
            >
              {creating ? 'Creating Admin User...' : 'Create Admin User'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 justify-center">
                <Check className="w-5 h-5" />
                <span>Admin user created successfully!</span>
              </div>
              <Button
                onClick={() => navigate('/admin/login')}
                className="w-full bg-gradient-primary"
              >
                Go to Admin Login
              </Button>
            </div>
          )}

          <div className="text-center">
            <Button variant="ghost" onClick={() => navigate('/')}>
              Back to Catalogue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;