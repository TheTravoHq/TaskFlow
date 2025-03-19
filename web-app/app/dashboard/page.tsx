'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { TaskTimer } from '../../components/TaskTimer';

export default function DashboardPage() {
  const { isAuthenticated, isLoading, userData } = useAuth();
  const { tasks, loading, error, fetchTasks, createTask, updateTaskStatus } =
    useTasks();
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks(userData?.id);
    }
  }, [isAuthenticated, fetchTasks]);

  if (isLoading || loading) {
    return <div>Loading...</div>;
  }

  console.log('tasks', tasks);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            My Tasks
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg 
            transition duration-200 ease-in-out shadow-md hover:shadow-lg flex items-center gap-2"
          >
            {showForm ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                New Task
              </>
            )}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-10 bg-white p-6 rounded-xl shadow-lg transition-all duration-200"
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg 
                transition duration-200 ease-in-out shadow-md hover:shadow-lg font-medium"
              >
                Create Task
              </button>
            </div>
          </form>
        )}

        {error && (
          <div className="text-red-500 bg-red-50 p-4 rounded-lg mb-6 border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Active Tasks Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">
              Active Tasks
            </h2>
            <div className="space-y-4">
              {tasks
                ?.filter((t) => t.status === 'in_progress')
                .map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">
                            Title: {task.title}
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
                          Description: {task.description || 'NA'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateTaskStatus(task.id, 'pause')}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Pause
                        </button>
                        <button
                          onClick={() => updateTaskStatus(task.id, 'end')}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Complete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Pending Tasks Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">
              Pending Tasks
            </h2>
            <div className="space-y-4">
              {tasks
                ?.filter((t) => t.status === 'pending')
                .map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Title: {task.title}
                        </h3>
                        <p className="text-gray-700">
                          Description: {task.description || 'NA'}
                        </p>
                      </div>
                      <button
                        onClick={() => updateTaskStatus(task.id, 'start')}
                        className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Paused Tasks Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">
              Paused Tasks
            </h2>
            <div className="space-y-4">
              {tasks
                ?.filter((t) => t.status === 'paused')
                .map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Title: {task.title}
                        </h3>
                        <p className="text-gray-700">
                          Description: {task.description || 'NA'}
                        </p>
                        <p className="text-sm text-yellow-700 mt-2">
                          Total time:{' '}
                        </p>
                        <TaskTimer
                          startTime={task.startTime}
                          isActive={false}
                          pauseEndTime={task.pauseEndTime}
                          pauseStartTime={task.pauseStartTime}
                          endTime={task.endTime}
                        />
                      </div>
                      <button
                        onClick={() => updateTaskStatus(task.id, 'resume')}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Resume
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Completed Tasks Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">
              Completed Tasks
            </h2>
            <div className="space-y-4">
              {tasks
                ?.filter((t) => t.status === 'completed')
                .map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Title: {task.title}
                        </h3>
                        <p className="text-gray-700">
                          Description: {task.description || 'NA'}
                        </p>
                        <p className="text-sm text-red-600 mt-2">
                          Total time spent:{' '}
                        </p>

                        <TaskTimer
                          startTime={task.startTime}
                          isActive={false}
                          pauseEndTime={task.pauseEndTime}
                          pauseStartTime={task.pauseStartTime}
                          endTime={task.endTime}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
