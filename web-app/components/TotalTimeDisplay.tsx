import { Task } from '../types/task';
import { TaskTimer } from './TaskTimer';
import { TotalTimeSum } from './TotalTimeSum';

interface TotalTimeDisplayProps {
  tasks: Task[];
}

export function TotalTimeDisplay({ tasks }: TotalTimeDisplayProps) {
  const stats = {
    completed: tasks.filter((t) => t.status === 'completed'),
    active: tasks.filter((t) => t.status === 'in_progress'),
    paused: tasks.filter((t) => t.status === 'paused'),
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <div className="border-b pb-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Time Statistics
        </h2>
        <TotalTimeSum tasks={tasks} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-800 mb-2">
            Completed Tasks Time
          </h3>
          <div className="space-y-2">
            {stats.completed.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">{task.title}:</span>
                <TaskTimer
                  startTime={task.startTime}
                  isActive={false}
                  pauseStartTime={task.pauseStartTime}
                  pauseEndTime={task.pauseEndTime}
                  endTime={task.endTime}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <h3 className="font-medium text-indigo-800 mb-2">
            Active Tasks Time
          </h3>
          <div className="space-y-2">
            {stats.active.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">{task.title}:</span>
                <TaskTimer
                  startTime={task.startTime}
                  isActive={true}
                  pauseStartTime={task.pauseStartTime}
                  pauseEndTime={task.pauseEndTime}
                  endTime={task.endTime}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-medium text-yellow-800 mb-2">
            Paused Tasks Time
          </h3>
          <div className="space-y-2">
            {stats.paused.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">{task.title}:</span>
                <TaskTimer
                  startTime={task.startTime}
                  isActive={false}
                  pauseStartTime={task.pauseStartTime}
                  pauseEndTime={task.pauseEndTime}
                  endTime={task.endTime}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
