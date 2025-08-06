import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-page)' }}>
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-4 text-primary">404</h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-6">Oops! Page not found</p>
        <a href="/" className="text-primary hover:text-primary/80 underline text-sm md:text-base">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
