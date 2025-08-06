
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface NavigationProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

const Navigation = ({ onLoginClick, onSignupClick }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    
  ];

  return (
    <nav className="glass border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <span className="font-bold text-lg text-primary-foreground">SS</span>
            </div>
            <span className="font-bold text-xl text-foreground">SalarySync</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-muted-foreground hover:text-primary transition-colors ${
                  location.pathname === item.path ? "text-primary font-medium" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* CTA Buttons */}
            {onLoginClick && onSignupClick && (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  onClick={onLoginClick}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={onSignupClick}
                  className="button-modern px-6 rounded-full shadow-[var(--shadow-modern)]"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  Start Free Trial
                </Button>
              </div>
            )}
          </div>

          

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 glass py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-muted-foreground hover:text-primary transition-colors px-4 py-2 ${
                    location.pathname === item.path ? "text-primary font-medium" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {onLoginClick && onSignupClick && (
                <div className="flex flex-col space-y-3 px-4 pt-4 border-t border-border/50">
                  <Button 
                    variant="ghost" 
                    onClick={onLoginClick} 
                    className="w-full text-muted-foreground hover:text-foreground"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={onSignupClick} 
                    className="w-full button-modern rounded-full"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    Start Free Trial
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
