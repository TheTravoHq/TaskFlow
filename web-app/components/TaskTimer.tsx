import { useState, useEffect } from 'react';

interface TaskTimerProps {
  startTime: Date | null;
  endTime: Date | null;
  isActive: boolean;
  pauseStartTime: Date[];
  pauseEndTime: Date[];
}

export function TaskTimer({
  startTime,
  isActive,
  pauseEndTime,
  pauseStartTime,
  endTime,
}: TaskTimerProps) {
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const calculatePausedDuration = (): number => {
    if (pauseStartTime.length !== pauseEndTime.length) return 0;

    return pauseStartTime.reduce((total, pauseStart, index) => {
      const pauseEnd = pauseEndTime[index];
      const pauseDuration =
        new Date(pauseEnd).getTime() - new Date(pauseStart).getTime();
      return total + (pauseDuration > 0 ? pauseDuration : 0);
    }, 0);
  };

  const calculateElapsedTime = () => {
    if (!startTime) return 0;

    const totalPausedTime = calculatePausedDuration();
    const start = new Date(startTime).getTime();
    const now = new Date().getTime();
    const end = endTime ? new Date(endTime).getTime() : start + totalPausedTime;

    if (!endTime) {
      return Math.floor((now - start - totalPausedTime) / 1000);
    } else {
      return Math.floor((end - start - totalPausedTime) / 1000);
    }
  };

  useEffect(() => {
    setElapsedTime(calculateElapsedTime());
    let timer = null;
    if (isActive && startTime) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, startTime, pauseStartTime, pauseEndTime]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-sm font-mono bg-gray-700 px-2 py-1 rounded-md">
      {formatTime(elapsedTime)}
    </div>
  );
}
