import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Icons
const AlertTriangleIcon = getIcon('AlertTriangle');
const HomeIcon = getIcon('Home');
const ArrowLeftIcon = getIcon('ArrowLeft');

function NotFound() {
  const navigate = useNavigate();
  
  // Auto-redirect after 10 seconds
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 10000);
    
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      <motion.div 
        className="max-w-md w-full space-y-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mx-auto"
        >
          <AlertTriangleIcon className="h-24 w-24 mx-auto text-amber-500" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-surface-800 dark:text-surface-100 mb-2">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-surface-700 dark:text-surface-200 mb-6">
            Page Not Found
          </h2>
          <p className="text-surface-600 dark:text-surface-400 mb-8 max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved.
            You'll be redirected to the home page automatically in a few seconds.
          </p>
        </motion.div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <motion.button
              className="btn bg-primary hover:bg-primary-dark text-white flex items-center justify-center gap-2 w-full sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <HomeIcon className="h-4 w-4" />
              Go to Home
            </motion.button>
          </Link>
          
          <motion.button
            onClick={() => navigate(-1)}
            className="btn bg-surface-200 hover:bg-surface-300 text-surface-700 dark:bg-surface-700 dark:hover:bg-surface-600 dark:text-surface-200 flex items-center justify-center gap-2 w-full sm:w-auto"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Go Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFound;