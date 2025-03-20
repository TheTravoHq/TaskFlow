import { Task } from '../types/task';
import { useState, useEffect } from 'react';

interface TotalTimeSumProps {
  tasks: Task[];
}

export function TotalTimeSum({ tasks }: TotalTimeSumProps) {
  const [totalSeconds, setTotalSeconds] = useState(0);

  const calculateTaskDuration = (task: Task): number => {
    if (!task.startTime) return 0;

    const start = new Date(task.startTime).getTime();
    const end = task.endTime
      ? new Date(task.endTime).getTime()
      : task.status === 'in_progress'
        ? new Date().getTime()
        : null;

    if (!end) return 0;

    const pausedDuration = task.pauseStartTime.reduce(
      (total, pauseStart, index) => {
        const pauseEnd = task.pauseEndTime[index];
        if (!pauseEnd) return total;
        return (
          total +
          (new Date(pauseEnd).getTime() - new Date(pauseStart).getTime())
        );
      },
      0,
    );

    const rawDuration = end - start - pausedDuration;
    return Math.max(0, Math.floor(rawDuration / 1000));
  };

  useEffect(() => {
    const total = tasks
      .filter((task) => task.status !== 'in_progress')
      .reduce((sum, task) => sum + calculateTaskDuration(task), 0);
    setTotalSeconds(total);
    //Todo: not calculating time for in_progress tasks
    // if (tasks.some((t) => t.status === 'in_progress')) {
    //   const current_progress_task = tasks.find(
    //     (t) => t.status === 'in_progress',
    //   );
    //   const timer = setInterval(() => {
    //     const newTotal = total + calculateTaskDuration(current_progress_task);
    //     setTotalSeconds(newTotal);
    //   }, 1000);
    //   return () => clearInterval(timer);
    // }
  }, [tasks]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 text-gray-700">
      <span className="font-medium">Total Time Across All Tasks:</span>
      <div className="text-sm font-mono bg-gray-700 text-white px-2 py-1 rounded-md">
        {formatTime(totalSeconds)}
      </div>
    </div>
  );
}
