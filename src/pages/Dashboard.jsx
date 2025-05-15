import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import { useContext } from 'react';
import { AuthContext } from '../App';
import { 
  fetchTasksStart, 
  fetchTasksSuccess, 
  fetchTasksFailure 
} from '../store/taskSlice';
import { fetchTasks } from '../services/taskService';

// Icons
const CheckCircleIcon = getIcon('CheckCircle');
const ListTodoIcon = getIcon('ListTodo');
const ClockIcon = getIcon('Clock');
const ArrowRightIcon = getIcon('ArrowRight');
const LogOutIcon = getIcon('LogOut');

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { user } = useSelector(state => state.user);
  const { tasks, loading, error } = useSelector(state => state.tasks);
  
  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    overdue: 0
  });
  
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load tasks from the backend
  useEffect(() => {
    const loadTasks = async () => {
      try {
        dispatch(fetchTasksStart());
        const tasksData = await fetchTasks();
        dispatch(fetchTasksSuccess(tasksData));
        updateStats(tasksData);
        setIsLoaded(true);
      } catch (error) {
        dispatch(fetchTasksFailure(error.message));
        toast.error("Failed to load tasks. Please try again.");
      }
    };
    
    loadTasks();
  }, [dispatch]);
  
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
  
  const handleTasksChange = (updatedTasks) => {
    updateStats(updatedTasks);
    toast.success("Tasks updated successfully");
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              TaskMaster
            </motion.h1>
            <motion.p 
              className="text-center md:text-left text-surface-600 dark:text-surface-400 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Efficiently manage and organize your tasks with our intuitive task management platform
            </motion.p>
          </div>
          
          <motion.div 
            className="mt-4 md:mt-0 flex flex-col md:flex-row items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-surface-600 dark:text-surface-400 text-sm">
              Welcome, {user?.firstName || 'User'}!
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light text-sm bg-white dark:bg-surface-700 px-4 py-2 rounded-md shadow-sm"
            >
              <LogOutIcon className="w-4 h-4" />
              Sign Out
            </button>
          </motion.div>
        </header>
        
        {loading && !isLoaded ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <div className="text-red-500 mb-4">Failed to load tasks</div>
            <button onClick={() => window.location.reload()} className="text-primary hover:underline">
              Try Again
            </button>
          </div>
        ) : (
          <MainFeature onTasksChange={handleTasksChange} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;