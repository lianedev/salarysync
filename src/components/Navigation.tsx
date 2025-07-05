
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
    <nav className="fixed top-1 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl rounded-2xl bg-transparent backdrop-blur-md border border-white/30 shadow-lg flex items-center justify-between   z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <span className="font-bold text-lg">SS</span>
            </div>
            <span className="font-bold text-xl text-gray-900">SalarySync</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-gray-600 hover:text-blue-600 transition-colors ${
                  location.pathname === item.path ? "text-blue-600 font-medium" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
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
          <div className="md:hidden border-t bg-white py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-gray-600 hover:text-blue-600 transition-colors px-4 py-2 ${
                    location.pathname === item.path ? "text-blue-600 font-medium" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {onLoginClick && onSignupClick && (
                <div className="flex flex-col space-y-2 px-4 pt-4 border-t">
                  <Button variant="ghost" onClick={onLoginClick} className="w-full">
                    Login
                  </Button>
                  <Button onClick={onSignupClick} className="w-full">
                    Sign Up
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
