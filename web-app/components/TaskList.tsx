import { Task } from '../types/task';

interface TaskListProps {
  tasks: Task[];
  onUpdateStatus: (taskId: string, status: Task['status']) => Promise<void>;
}

export function TaskList({ tasks, onUpdateStatus }: TaskListProps) {
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'TODO':
        return 'bg-gray-100';
      case 'IN_PROGRESS':
        return 'bg-blue-100';
      case 'PAUSED':
        return 'bg-yellow-100';
      case 'COMPLETED':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`p-4 rounded-lg shadow ${getStatusColor(task.status)}`}
        >
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-gray-600 mt-1">{task.description}</p>
          <div className="mt-4 flex gap-2">
            {task.status === 'TODO' && (
              <button
                onClick={() => onUpdateStatus(task.id, 'IN_PROGRESS')}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Start
              </button>
            )}
            {task.status === 'IN_PROGRESS' && (
              <>
                <button
                  onClick={() => onUpdateStatus(task.id, 'PAUSED')}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Pause
                </button>
                <button
                  onClick={() => onUpdateStatus(task.id, 'COMPLETED')}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Complete
                </button>
              </>
            )}
            {task.status === 'PAUSED' && (
              <button
                onClick={() => onUpdateStatus(task.id, 'IN_PROGRESS')}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Resume
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
