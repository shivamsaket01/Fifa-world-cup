
import { ShoppingBag, ExternalLink } from 'lucide-react';

interface AffiliateShopProps {
  teamName: string;
}

const AffiliateShop = ({ teamName }: AffiliateShopProps) => {
  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold">Official Merchandise</h3>
      </div>
      
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20 hover:border-primary/40 transition-colors group cursor-pointer">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-foreground mb-1">Buy {teamName} 2026 Kit</h4>
            <p className="text-sm text-muted-foreground">Up to 20% off with code GOALZONE</p>
          </div>
          <div className="bg-primary text-primary-foreground p-3 rounded-full group-hover:scale-110 transition-transform shadow-md">
            <ExternalLink className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateShop;
