import { useState, useCallback } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import { format, parseISO, addHours } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Configure date-fns localizer
import { dateFnsLocalizer } from 'react-big-calendar';
import { parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';

// Icons
const ClockIcon = getIcon('Clock');
const FlagIcon = getIcon('Flag');
const CheckIcon = getIcon('Check');
const XIcon = getIcon('X');

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function CalendarView({ tasks, onSelectTask, onUpdateTaskDueDate, priorityConfig }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewType, setViewType] = useState('month');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Convert tasks to calendar events
  const events = tasks.map(task => {
    const start = new Date(task.dueDate);
    start.setHours(9, 0, 0, 0); // Default to 9 AM
    
    // For all-day events in month view
    const end = new Date(start);
    end.setHours(10, 0, 0, 0); // 1-hour duration by default
    
    return {
      id: task.id,
      title: task.title,
      start,
      end,
      allDay: viewType === 'month',
      priority: task.priority,
      status: task.status,
      description: task.description,
      resource: task // Store the original task as a resource
    };
  });

  // Event styling based on priority
  const eventPropGetter = useCallback((event) => {
    const isCompleted = event.status === 'completed';
    
    if (isCompleted) {
      return { className: 'event-completed' };
    }
    
    switch (event.priority) {
      case 'high':
        return { className: 'event-high-priority' };
      case 'medium':
        return { className: 'event-medium-priority' };
      case 'low':
        return { className: 'event-low-priority' };
      default:
        return {};
    }
  }, []);

  // Custom event component
  const EventComponent = ({ event }) => (
    <div className="text-xs">
      <div className="font-medium">{event.title}</div>
      {viewType !== 'month' && event.description && (
        <div className="text-xs mt-1 opacity-80 truncate">{event.description}</div>
      )}
    </div>
  );

  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
  };

  // Close event detail popup
  const closeEventDetail = () => {
    setSelectedEvent(null);
  };

  // Handle event drag and drop (reschedule)
  const moveEvent = ({ event, start, end }) => {
    onUpdateTaskDueDate(event.id, start);
  };

  // Handle date navigation
  const onNavigate = (newDate) => {
    setSelectedDate(newDate);
  };

  // Format date for display
  const formatEventTime = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="h-[600px] md:h-[700px]">
      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        <button 
          onClick={() => setViewType('month')} 
          className={`px-3 py-1 text-sm font-medium rounded ${viewType === 'month' ? 'bg-primary text-white' : 'bg-white dark:bg-surface-700 text-surface-700 dark:text-surface-300 border border-surface-300 dark:border-surface-600'}`}
        >
          Month
        </button>
        <button 
          onClick={() => setViewType('week')} 
          className={`px-3 py-1 text-sm font-medium rounded ${viewType === 'week' ? 'bg-primary text-white' : 'bg-white dark:bg-surface-700 text-surface-700 dark:text-surface-300 border border-surface-300 dark:border-surface-600'}`}
        >
          Week
        </button>
        <button 
          onClick={() => setViewType('day')} 
          className={`px-3 py-1 text-sm font-medium rounded ${viewType === 'day' ? 'bg-primary text-white' : 'bg-white dark:bg-surface-700 text-surface-700 dark:text-surface-300 border border-surface-300 dark:border-surface-600'}`}
        >
          Day
        </button>
      </div>
      
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={selectedDate}
        view={viewType}
        onNavigate={onNavigate}
        onView={setViewType}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventPropGetter}
        components={{ event: EventComponent }}
        onEventDrop={moveEvent}
        resizable={false}
        draggableAccessor={() => true}
        popup={true}
        className="rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700"
      />
      
      {/* Event Detail Popup */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4 z-50"
            onClick={closeEventDetail}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-surface-200 dark:border-surface-700 p-4">
                <h3 className="font-medium text-lg">Task Details</h3>
                <button onClick={closeEventDetail} className="text-surface-500 hover:text-surface-700">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{selectedEvent.title}</h2>
                
                {selectedEvent.description && (
                  <p className="text-surface-600 dark:text-surface-300 mb-4">
                    {selectedEvent.description}
                  </p>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                    <ClockIcon className="w-4 h-4" />
                    <span>Due: {formatEventTime(selectedEvent.dueDate)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FlagIcon className="w-4 h-4" />
                    <span className="capitalize">{selectedEvent.priority} Priority</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4" />
                    <span className="capitalize">Status: {selectedEvent.status}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-surface-200 dark:border-surface-700 p-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    onSelectTask(selectedEvent);
                    closeEventDetail();
                  }}
                  className="px-4 py-2 bg-primary text-white rounded font-medium text-sm"
                >
                  Edit Task
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CalendarView;