'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { TaskTimer } from '../../components/TaskTimer';
import { format, toZonedTime } from 'date-fns-tz';
import { isToday, parseISO, isValid } from 'date-fns';

// Update the formatLocalDate function with null checks and error handling
const formatLocalDate = (
  date: string | null | undefined,
  formatStr: string,
) => {
  if (!date) return 'Not set';

  try {
    const parsedDate = parseISO(date);
    if (!isValid(parsedDate)) return 'Invalid date';

    const zonedDate = toZonedTime(
      parsedDate,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );

    return format(zonedDate, formatStr, {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

export default function DashboardPage() {
  const { isAuthenticated, isLoading, userData, getUserData } = useAuth();
  const { tasks, loading, error, fetchTasks, createTask, updateTaskStatus } =
    useTasks();
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showPreviousTasks, setShowPreviousTasks] = useState(false);

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchTasks(userData?.id);
    }
  }, [isAuthenticated, fetchTasks, userData]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask(newTask);
      setNewTask({ title: '', description: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  // Group tasks by date
  const groupTasksByDate = (tasks: any[]) => {
    const grouped = tasks.reduce((acc: any, task) => {
      let date;
      const today = format(new Date(), 'yyyy-MM-dd');

      if (task.status === 'completed') {
        date = formatLocalDate(task.endTime, 'yyyy-MM-dd');
      } else if (
        task.status === 'paused' ||
        task.status === 'pending' ||
        task.status === 'in_progress'
      ) {
        date = today;
      } else {
        date = formatLocalDate(task.createdAt, 'yyyy-MM-dd');
      }

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(task);
      return acc;
    }, {});

    // Sort dates in descending order
    return Object.entries(grouped).sort(
      ([dateA], [dateB]) =>
        new Date(dateB).getTime() - new Date(dateA).getTime(),
    );
  };

  // Filter tasks based on selected date
  const filteredTasks = tasks?.filter((task) => {
    if (!selectedDate) return true;

    if (task.status === 'completed') {
      return (
        formatLocalDate(
          task.endTime instanceof Date
            ? task.endTime.toISOString()
            : task.endTime,
          'yyyy-MM-dd',
        ) === selectedDate
      );
    } else if (task.status === 'paused' || task.status === 'pending') {
      return format(new Date(), 'yyyy-MM-dd') === selectedDate;
    } else {
      return formatLocalDate(task.createdAt, 'yyyy-MM-dd') === selectedDate;
    }
  });

  const groupedTasks = groupTasksByDate(filteredTasks || []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header section */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            My Tasks
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="group relative px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg 
              transition duration-300 shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2"
            >
              {showForm ? (
                <>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                  </svg>
                  New Task
                </>
              )}
            </button>
            <input
              type="date"
              onChange={(e) => setSelectedDate(e.target.value)}
              value={selectedDate || ''}
              className="px-4 py-2.5 text-gray-700 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Task Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-10 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300"
          >
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 
                  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200
                  text-gray-900 placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 
                  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200
                  text-gray-900 placeholder-gray-500"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg 
                transition duration-300 shadow-md hover:shadow-lg font-medium"
              >
                Create Task
              </button>
            </div>
          </form>
        )}

        {error && (
          <div className="text-red-600 bg-red-50 p-4 rounded-lg mb-6 border border-red-200 font-medium">
            {error}
          </div>
        )}

        {/* Tasks Sections */}
        <div className="space-y-8">
          {/* Today's Tasks */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 transition-all duration-300">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">
              Today's Tasks
            </h2>
            {groupedTasks
              .filter(([date]) => isToday(parseISO(date)))
              .map(([date, dateTasks]: [string, any[]]) => (
                <div key={date} className="space-y-4">
                  {renderTasksByStatus(dateTasks, updateTaskStatus)}
                </div>
              ))}
          </div>

          {/* Previous Tasks (Collapsible) */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 transition-all duration-300">
            <button
              onClick={() => setShowPreviousTasks(!showPreviousTasks)}
              className="w-full flex justify-between items-center text-2xl font-bold text-indigo-700 mb-6"
            >
              <span>Previous Tasks</span>
              <svg
                className={`w-6 h-6 transform transition-transform duration-300 ${
                  showPreviousTasks ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showPreviousTasks && (
              <div className="space-y-8">
                {groupedTasks
                  .filter(([date]) => !isToday(parseISO(date)))
                  .map(([date, dateTasks]: [string, any[]]) => (
                    <div
                      key={date}
                      className="border-t pt-6 first:border-t-0 first:pt-0"
                    >
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        {formatLocalDate(date, 'MMMM d, yyyy')}
                      </h3>
                      {renderTasksByStatus(dateTasks, updateTaskStatus)}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to render tasks by status
function renderTasksByStatus(tasks: any[], updateTaskStatus: any) {
  const statusSections = [
    { status: 'in_progress', title: 'In Progress', bgColor: 'bg-indigo-50/80' },
    { status: 'pending', title: 'Pending', bgColor: 'bg-gray-50/80' },
    { status: 'paused', title: 'Paused', bgColor: 'bg-yellow-50/80' },
    { status: 'completed', title: 'Completed', bgColor: 'bg-green-50/80' },
  ];

  return (
    <div className="space-y-6">
      {statusSections.map(({ status, title, bgColor }) => {
        const filteredTasks = tasks.filter((t) => t.status === status);
        if (filteredTasks.length === 0) return null;

        return (
          <div key={status} className="space-y-4">
            <h4 className="text-lg font-medium text-indigo-700">{title}</h4>
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`${bgColor} p-6 rounded-xl border border-gray-200/50 transition-all duration-300 hover:shadow-lg relative`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {task.title}
                      </h3>
                      <TaskTimer
                        startTime={task.startTime}
                        isActive={task.status === 'in_progress'}
                        pauseEndTime={task.pauseEndTime}
                        pauseStartTime={task.pauseStartTime}
                        endTime={task.endTime}
                      />
                    </div>
                    <p className="text-gray-700">
                      {task.description || 'No description'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {task.status === 'in_progress' && (
                      <>
                        <button
                          onClick={() => updateTaskStatus(task.id, 'pause')}
                          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          Pause
                        </button>
                        <button
                          onClick={() => updateTaskStatus(task.id, 'end')}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          Complete
                        </button>
                      </>
                    )}
                    {task.status === 'pending' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'start')}
                        className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                      >
                        Start
                      </button>
                    )}
                    {task.status === 'paused' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'resume')}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Resume
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500 absolute bottom-2 right-4 flex flex-col items-end">
                  {task.createdAt && (
                    <div>
                      Created:{' '}
                      {formatLocalDate(task.createdAt, 'MMM d, yyyy h:mm a')}
                    </div>
                  )}
                  {task.endTime && (
                    <div>
                      <>
                        Completed:{' '}
                        {formatLocalDate(task.endTime, 'MMM d, yyyy h:mm a')}
                      </>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
