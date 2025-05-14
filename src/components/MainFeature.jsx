import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';
import getIcon from '../utils/iconUtils';
import CalendarView from './CalendarView';

// Icons
const ListIcon = getIcon('List');
const CalendarIcon = getIcon('Calendar');
        <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100">Todoodo</h2>
const PlusIcon = getIcon('Plus');
const TrashIcon = getIcon('Trash');
const EditIcon = getIcon('Edit');
const ClockIcon = getIcon('Clock');
const CheckIcon = getIcon('Check');
const TimerIcon = getIcon('Timer');
const XIcon = getIcon('X');
const AlertCircleIcon = getIcon('AlertCircle');
const FlagIcon = getIcon('Flag');
const SaveIcon = getIcon('Save');

// Initial sample data
const initialTasks = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Draft the initial proposal for the new client project',
    priority: 'high',
    status: 'pending',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Schedule team meeting',
    description: 'Set up weekly sync with the development team',
    priority: 'medium',
    status: 'completed',
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString()
  },
  {
    id: '3',
    title: 'Review design mockups',
    description: 'Check the latest UI designs and provide feedback',
    priority: 'low',
    status: 'pending',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()
  }
];

// Priority colors
const priorityConfig = {
  high: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800/50'
  },
  medium: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/50'
  },
  low: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800/50'
  }
};

function MainFeature({ onTasksChange }) {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });
  
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    id: '',
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'pending'
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    if (onTasksChange) {
      onTasksChange(tasks);
    }
  }, [tasks, onTasksChange]);

  // Filter tasks based on status
  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'all') return true;
    return task.status === filterStatus;
  });

  // Reset form
  const resetForm = () => {
    setTaskForm({
      id: '',
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      status: 'pending'
    });
    setFormErrors({});
    setIsEditMode(false);
  };

  // Open modal for add/edit
  const openModal = (task = null) => {
    resetForm();
    
    if (task) {
      // Edit mode
      setTaskForm({
        ...task,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
      });
      setIsEditMode(true);
    } else {
      // Add mode
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setTaskForm({
        ...taskForm,
        dueDate: tomorrow.toISOString().split('T')[0]
      });
    }
    
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!taskForm.title.trim()) {
      errors.title = 'Title is required';
    } else if (taskForm.title.length > 100) {
      errors.title = 'Title must be less than 100 characters';
    }
    
    if (taskForm.description && taskForm.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }
    
    if (!taskForm.dueDate) {
      errors.dueDate = 'Due date is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }
    
    if (isEditMode) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === taskForm.id ? { ...taskForm, updatedAt: new Date().toISOString() } : task
      );
      setTasks(updatedTasks);
      toast.success("Task updated successfully!");
    } else {
      // Add new task
      const newTask = {
        ...taskForm,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      setTasks([...tasks, newTask]);
      toast.success("Task added successfully!");
    }
    
    closeModal();
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({ ...prev, [name]: value }));
    
    // Clear the error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Toggle task completion
  const toggleTaskStatus = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        return { 
          ...task, 
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    toast.info("Task status updated");
  };

  // Update task due date (used by calendar drag-and-drop)
  const updateTaskDueDate = (taskId, newDate) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, dueDate: newDate.toISOString(), updatedAt: new Date().toISOString() };
      }
      return task;
    });
    setTasks(updatedTasks);
    toast.success("Task rescheduled successfully");
  };

  // Delete task
  const deleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      toast.success("Task deleted successfully");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Check if task is overdue
  const isOverdue = (task) => {
    if (task.status === 'completed') return false;
    if (!task.dueDate) return false;
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(23, 59, 59, 999); // End of day
    return dueDate < new Date();
  };
  
  // Toggle between list and calendar views
  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-surface-800 shadow-soft">
      <div className="border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-surface-800 dark:text-surface-100">
            {viewMode === 'list' ? 'Task Management' : 'Task Calendar'}
          </h2>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
            {viewMode === 'list' 
              ? 'Manage and organize your tasks efficiently' 
              : 'Visualize and reschedule your tasks in a calendar'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg overflow-hidden border border-surface-300 dark:border-surface-600">
            <button
              onClick={() => toggleViewMode('list')}
              className={`flex items-center gap-1 py-2 px-3 text-sm font-medium ${
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-600'
              }`}
            >
              <ListIcon className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => toggleViewMode('calendar')}
              className={`flex items-center gap-1 py-2 px-3 text-sm font-medium ${
                viewMode === 'calendar'
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-600'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              Calendar
            </button>
          </div>
          
          <div className="relative w-full sm:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-40 pl-3 pr-10 py-2 text-sm bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <motion.button
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white rounded-lg px-4 py-2 text-sm font-medium transition-all w-full sm:w-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PlusIcon className="w-4 h-4" />
            Add Task
          </motion.button>
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <CalendarView 
            tasks={filteredTasks} 
            onSelectTask={openModal} 
            onUpdateTaskDueDate={updateTaskDueDate}
            priorityConfig={priorityConfig}
          />
        )}
        
        {/* List View */}
        {viewMode === 'list' && filteredTasks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
              <ClipboardIcon className="w-8 h-8 text-surface-400" />
            </div>
            <h3 className="text-lg font-medium text-surface-700 dark:text-surface-300 mb-2">
              No tasks {filterStatus !== 'all' ? `marked as ${filterStatus}` : 'found'}
            </h3>
            <p className="text-surface-500 dark:text-surface-400 max-w-md mx-auto">
              {filterStatus === 'all' 
                ? "Get started by adding your first task using the 'Add Task' button."
                : `Change the filter or add a new task to get started.`}
            </p>
          </motion.div>
        ) : viewMode === 'list' && (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => {
                const isTaskOverdue = isOverdue(task);
                const priorityStyle = priorityConfig[task.priority];
                
                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className={`relative rounded-xl overflow-hidden border ${priorityStyle.border} ${task.status === 'completed' ? 'opacity-75' : ''}`}
                  >
                    <div className={`p-4 ${priorityStyle.bg}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <button 
                            onClick={() => toggleTaskStatus(task.id)}
                            className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${
                              task.status === 'completed' 
                                ? 'bg-green-500 text-white' 
                                : 'border-2 border-surface-400 dark:border-surface-500'
                            }`}
                            aria-label={task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            {task.status === 'completed' && <CheckIcon className="w-3 h-3" />}
                          </button>
                          
                          <h3 className={`font-medium ${priorityStyle.text} ${
                            task.status === 'completed' ? 'line-through text-opacity-70' : ''
                          }`}>
                            {task.title}
                          </h3>
                        </div>
                        
                        <div className="flex gap-1">
                          <motion.button
                            onClick={() => openModal(task)}
                            className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 p-1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Edit task"
                          >
                            <EditIcon className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            onClick={() => deleteTask(task.id)}
                            className="text-surface-500 hover:text-red-500 dark:text-surface-400 dark:hover:text-red-400 p-1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Delete task"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-surface-600 dark:text-surface-300 mb-3">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center ${isTaskOverdue ? 'text-red-600 dark:text-red-400' : 'text-surface-500 dark:text-surface-400'}`}>
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {formatDate(task.dueDate)}
                          </div>
                          
                          {isTaskOverdue && (
                            <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/40 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">
                              <AlertCircleIcon className="w-3 h-3 mr-1" />
                              Overdue
                            </span>
                          )}
                        </div>
                        
                        <div className={`flex items-center gap-1 capitalize ${priorityStyle.text}`}>
                          <FlagIcon className="w-3 h-3" />
                          {task.priority}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
      
      {/* Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-md w-full mx-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between bg-surface-50 dark:bg-surface-700 px-6 py-4 border-b border-surface-200 dark:border-surface-600">
                <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100">
                  {isEditMode ? 'Edit Task' : 'Add New Task'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Task Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={taskForm.title}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-white dark:bg-surface-700 border ${
                        formErrors.title ? 'border-red-500 dark:border-red-500' : 'border-surface-300 dark:border-surface-600'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                      placeholder="Enter task title"
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={taskForm.description}
                      onChange={handleChange}
                      rows="3"
                      className={`w-full px-3 py-2 bg-white dark:bg-surface-700 border ${
                        formErrors.description ? 'border-red-500 dark:border-red-500' : 'border-surface-300 dark:border-surface-600'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                      placeholder="Enter task description"
                    />
                    {formErrors.description && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Priority
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={taskForm.priority}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Due Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          id="dueDate"
                          name="dueDate"
                          value={taskForm.dueDate}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 bg-white dark:bg-surface-700 border ${
                            formErrors.dueDate ? 'border-red-500 dark:border-red-500' : 'border-surface-300 dark:border-surface-600'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 pointer-events-none w-4 h-4" />
                      </div>
                      {formErrors.dueDate && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.dueDate}</p>
                      )}
                    </div>
                  </div>
                  
                  {isEditMode && (
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={taskForm.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-lg text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <motion.button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <SaveIcon className="w-4 h-4" />
                    {isEditMode ? 'Update Task' : 'Add Task'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Clipboard icon for empty state
const ClipboardIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

export default MainFeature;