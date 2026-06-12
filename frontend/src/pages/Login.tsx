import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const user = await login(data);
      if (user?.role === 'admin' || user?.role === 'superadmin') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      setError('root', { message: error.response?.data?.message || 'Invalid email or password' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center">
      <div className="bg-card border rounded-2xl p-8 w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-black text-center mb-6">Welcome Back</h1>
        
        {errors.root && (
          <div className="bg-destructive/10 text-destructive text-sm font-medium p-3 rounded-lg mb-6 text-center">
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-1">Email Address</label>
            <input 
              type="email"
              {...register('email')} 
              className="w-full bg-background border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                {...register('password')} 
                className="w-full bg-background border-2 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-primary"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors mt-6 disabled:opacity-50"
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
