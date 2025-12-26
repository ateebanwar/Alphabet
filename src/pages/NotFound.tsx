import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center"
      >
        <motion.div
          className="neu-circle w-40 h-40 mx-auto mb-8 flex items-center justify-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-5xl font-bold text-primary">404</span>
        </motion.div>
        
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="neu-tile inline-flex items-center gap-2 px-6 py-3 text-foreground font-medium"
          >
            <Home className="w-5 h-5 text-primary" />
            Return Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;

