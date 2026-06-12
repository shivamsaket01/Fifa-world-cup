import { Link } from 'react-router-dom';
import { Globe, Camera, Video, MessageSquare, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-black tracking-tighter">GoalZone<span className="text-primary">.</span></span>
            </Link>
            <p className="text-muted-foreground leading-relaxed text-sm">
              The ultimate destination for real-time football scores, AI match predictions, and global standings. Experience the beautiful game like never before.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><MessageSquare className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-pink-500 transition-colors"><Camera className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-red-500 transition-colors"><Video className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-blue-500 transition-colors"><Globe className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/live-scores" className="hover:text-primary transition-colors">Live Scores</Link></li>
              <li><Link to="/today" className="hover:text-primary transition-colors">Today's Matches</Link></li>
              <li><Link to="/standings" className="hover:text-primary transition-colors">Global Standings</Link></li>
              <li><Link to="/predictions" className="hover:text-primary transition-colors">AI Predictions</Link></li>
              <li><Link to="/premium" className="hover:text-primary transition-colors">GoalZone Pro</Link></li>
            </ul>
          </div>

          {/* Legal & Help */}
          <div>
            <h3 className="font-bold text-lg mb-4">Support & Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center / FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Accessibility</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>123 Stadium Road, Football City, FC 90210</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+1 (555) 123-GOAL</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>support@goalzone.app</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} GoalZone Sports. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Built with passion for the fans.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
