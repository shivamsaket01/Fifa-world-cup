import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await api.post('/auth/register', data);
      // Log them in immediately after successful registration
      await login({ email: data.email, password: data.password });
      navigate('/');
    } catch (error: any) {
      setError('root', { message: error.response?.data?.message || 'Registration failed' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center">
      <div className="bg-card border rounded-2xl p-8 w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-black text-center mb-6">Create Account</h1>
        
        {errors.root && (
          <div className="bg-destructive/10 text-destructive text-sm font-medium p-3 rounded-lg mb-6 text-center">
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-1">Full Name</label>
            <input 
              {...register('name')} 
              className="w-full bg-background border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
          </div>

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
                type={showPassword ? "text" : "password"}
                {...register('password')} 
                className="w-full bg-background border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-primary pr-12"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors mt-6 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
