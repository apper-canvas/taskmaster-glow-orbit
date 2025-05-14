import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

// Icons
const CheckCircleIcon = getIcon('CheckCircle');
const ListTodoIcon = getIcon('ListTodo');
const ClockIcon = getIcon('Clock');
const ArrowRightIcon = getIcon('ArrowRight');

function Home() {
  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    overdue: 0
  });
  
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update stats when tasks change
  const updateStats = (tasks) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    const overdue = tasks.filter(task => {
      if (task.status === 'completed') return false;
      if (!task.dueDate) return false;
      
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    }).length;
    
    setStats({ completed, pending, overdue });
  };
  
  const handleTasksChange = (tasks) => {
    updateStats(tasks);
    toast.success("Tasks updated successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <motion.h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            TaskMaster
          </motion.h1>
          <motion.p 
            className="text-center text-surface-600 dark:text-surface-400 mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Efficiently manage and organize your tasks with our intuitive task management platform
          </motion.p>
        </header>
        
        <AnimatePresence>
          {isLoaded && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card flex items-center gap-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800/30">
                <div className="rounded-full bg-green-100 dark:bg-green-800/30 p-3">
                  <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">{stats.completed}</h3>
                  <p className="text-sm text-green-600 dark:text-green-500">Completed Tasks</p>
                </div>
              </div>
              
              <div className="card flex items-center gap-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800/30">
                <div className="rounded-full bg-blue-100 dark:bg-blue-800/30 p-3">
                  <ListTodoIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400">{stats.pending}</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-500">Pending Tasks</p>
                </div>
              </div>
              
              <div className="card flex items-center gap-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 dark:border-amber-800/30">
                <div className="rounded-full bg-amber-100 dark:bg-amber-800/30 p-3">
                  <ClockIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-400">{stats.overdue}</h3>
                  <p className="text-sm text-amber-600 dark:text-amber-500">Overdue Tasks</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <MainFeature onTasksChange={handleTasksChange} />
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition-colors"
          >
            View project on GitHub
            <ArrowRightIcon className="ml-1 w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;