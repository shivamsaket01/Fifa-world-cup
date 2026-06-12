import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { User as UserIcon, Trophy, Heart } from 'lucide-react';
import api from '../services/api';

const Profile = () => {
  const { user } = useAuth(); // login is actually our way to reset the user context locally or we can just fetch /me
  const [isEditing, setIsEditing] = useState(false);

  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await api.get('/teams');
      return response.data;
    }
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: user?.name || '',
      favoriteTeam: user?.favoriteTeam || '',
    }
  });

  // Keep form in sync if user loads later
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        favoriteTeam: user.favoriteTeam?._id || user.favoriteTeam || '',
      });
    }
  }, [user, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put('/auth/profile', data);
      return response.data;
    },
    onSuccess: () => {
      setIsEditing(false);
      // Hacky way to update context without a dedicated update function, just reload the window or we can trust the next fetch
      window.location.reload(); 
    }
  });

  const onSubmit = (data: any) => {
    updateProfileMutation.mutate(data);
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <h1 className="text-4xl font-black flex items-center gap-3">
          <UserIcon className="h-10 w-10 text-primary" />
          My Profile
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Stats Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-card border rounded-2xl p-6 text-center shadow-lg">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-background shadow-inner">
                <span className="text-4xl font-black text-primary">{user.name.charAt(0)}</span>
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              
              <div className="mt-6 p-4 bg-muted/30 rounded-xl border flex flex-col items-center">
                <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
                <span className="text-3xl font-black">{user.points || 0}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Prediction Points</span>
              </div>
            </div>
          </div>

          {/* Details / Edit Form */}
          <div className="md:col-span-2">
            <div className="bg-card border rounded-2xl p-8 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Profile Details</h3>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="text-sm font-bold text-primary hover:underline">
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-muted-foreground mb-2">Display Name</label>
                    <input {...register('name')} className="w-full bg-background border-2 rounded-xl px-4 py-3 focus:border-primary focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-muted-foreground mb-2 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-destructive" /> Favorite Team
                    </label>
                    <select {...register('favoriteTeam')} className="w-full bg-background border-2 rounded-xl px-4 py-3 focus:border-primary focus:outline-none">
                      <option value="">Select a team</option>
                      {teams?.map((team: any) => (
                        <option key={team._id} value={team._id}>{team.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 font-bold text-muted-foreground hover:bg-muted rounded-xl transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={updateProfileMutation.isPending} className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50">
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <span className="text-sm font-bold text-muted-foreground block mb-1">Display Name</span>
                    <p className="text-lg font-medium">{user.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-muted-foreground block mb-1">Email Address</span>
                    <p className="text-lg font-medium">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-muted-foreground flex items-center gap-2 mb-2">
                      <Heart className="h-4 w-4 text-destructive" /> Favorite Team
                    </span>
                    {user.favoriteTeam ? (
                      <div className="flex items-center gap-3 p-3 bg-muted/30 border rounded-xl w-max pr-6">
                        <img src={user.favoriteTeam.logo} alt="" className="w-8 h-8 object-contain" />
                        <span className="font-bold">{user.favoriteTeam.name}</span>
                      </div>
                    ) : (
                      <p className="text-sm italic text-muted-foreground">No favorite team selected.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
