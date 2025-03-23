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
    const now = endTime ? new Date(endTime).getTime() : new Date().getTime();

    const rawElapsed = now - start - totalPausedTime;
    return Math.max(0, Math.floor(rawElapsed / 1000));
  };

  useEffect(() => {
    setElapsedTime(calculateElapsedTime());

    if (isActive && startTime && !endTime) {
      const timer = setInterval(() => {
        setElapsedTime(calculateElapsedTime());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [
    isActive,
    startTime,
    endTime,
    pauseStartTime.length,
    pauseEndTime.length,
  ]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateColor = (
    seconds: number,
  ): { r: number; g: number; b: number } => {
    const threshold = 30 * 60; // 30 minutes in seconds
    const progress = Math.min(seconds / threshold, 2); // Cap at 2 (60 minutes)

    // Start with green (0, 200, 0)
    // Transition to yellow-orange (200, 200, 0)
    // End with red (200, 0, 0)
    let r = Math.min(200, progress * 200);
    let g = Math.max(0, 200 - Math.max(0, progress - 1) * 200);
    let b = 0;

    return { r: Math.round(r), g: Math.round(g), b };
  };

  const color = calculateColor(elapsedTime);
  const backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;

  return (
    <div
      className="text-sm font-mono px-2 py-1 rounded-md w-fit transition-colors duration-1000"
      style={{ backgroundColor }}
    >
      {formatTime(elapsedTime)}
    </div>
  );
}
