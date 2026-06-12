
import { useAuth } from '../../context/AuthContext';

interface AdBannerProps {
  format?: 'horizontal' | 'rectangle';
}

const AdBanner = ({ format = 'horizontal' }: AdBannerProps) => {
  const { user } = useAuth();

  // Don't show ads to Premium users
  if (user?.isPremium) {
    return null;
  }

  return (
    <div className={`w-full bg-muted border border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center p-4 text-muted-foreground ${format === 'horizontal' ? 'min-h-[100px]' : 'min-h-[250px] max-w-[300px] mx-auto'}`}>
      <span className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Advertisement</span>
      <div className="text-sm opacity-80 text-center">
        AdSense Placeholder<br/>
        <span className="text-xs">(Go Premium to remove ads)</span>
      </div>
    </div>
  );
};

export default AdBanner;
