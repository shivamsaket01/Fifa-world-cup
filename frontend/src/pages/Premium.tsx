import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Crown, Zap, Shield, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Premium = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      alert('Please login to upgrade');
      navigate('/login');
      return;
    }
    
    setLoading(true);
    try {
      // MOCK PAYMENT DELAY
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const res = await api.post('/auth/upgrade');
      updateUser(res.data);
      alert('Successfully upgraded to Premium!');
      navigate('/');
    } catch (err) {
      alert('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4 flex items-center justify-center gap-3">
          <Crown className="h-10 w-10 text-yellow-500" />
          GoalZone <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Pro</span>
        </h1>
        <p className="text-xl text-muted-foreground">Elevate your football experience to the next level.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Features List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-6">Why upgrade to Pro?</h2>
          
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-xl"><Shield className="h-6 w-6 text-primary" /></div>
            <div>
              <h3 className="font-bold text-lg">100% Ad-Free Experience</h3>
              <p className="text-muted-foreground">No more interruptions. Enjoy clean, fast pages.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-xl"><Zap className="h-6 w-6 text-primary" /></div>
            <div>
              <h3 className="font-bold text-lg">AI Match Predictions</h3>
              <p className="text-muted-foreground">Unlock Gemini-powered insights and win probabilities.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-xl"><Sparkles className="h-6 w-6 text-primary" /></div>
            <div>
              <h3 className="font-bold text-lg">Advanced Analytics</h3>
              <p className="text-muted-foreground">Deep dive into player heatmaps and passing networks.</p>
            </div>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="bg-card border-2 border-primary/20 rounded-2xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
            MOST POPULAR
          </div>
          
          <h3 className="text-2xl font-bold mb-2">Pro Subscription</h3>
          <div className="flex items-end gap-1 mb-6">
            <span className="text-5xl font-extrabold">$4.99</span>
            <span className="text-muted-foreground mb-1">/ month</span>
          </div>
          
          <ul className="space-y-3 mb-8">
            {['No Ads', 'AI Predictions', 'Priority Support', 'Exclusive Badges'].map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>
          
          {user?.isPremium ? (
            <button disabled className="w-full py-4 rounded-xl font-bold bg-muted text-muted-foreground flex justify-center items-center gap-2">
              <CheckCircle2 className="h-5 w-5" /> You are already Pro
            </button>
          ) : (
            <button 
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 transition-all shadow-lg hover:shadow-yellow-500/25 flex justify-center items-center gap-2"
            >
              {loading ? 'Processing Payment...' : 'Upgrade Now'}
            </button>
          )}
          <p className="text-xs text-center text-muted-foreground mt-4">
            *This is a mock payment for demonstration. No real charges are made.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Premium;
