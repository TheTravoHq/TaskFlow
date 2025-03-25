'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function ProfilePage() {
  const router = useRouter();
  const { isLoading, userData, logout, getUserData } = useAuth();
  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    paused: 0,
    pending: 0,
  });

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      const tasks = userData?.tasks;
      setStats({
        completed: tasks.filter((t) => t.status === 'completed').length,
        inProgress: tasks.filter((t) => t.status === 'in_progress').length,
        paused: tasks.filter((t) => t.status === 'paused').length,
        pending: tasks.filter((t) => t.status === 'pending').length,
      });
    }
  }, [userData]);

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  console.log(userData);

  const chartData = [
    { name: 'Completed', value: stats.completed, color: '#10B981' },
    { name: 'In Progress', value: stats.inProgress, color: '#6366F1' },
    { name: 'Paused', value: stats.paused, color: '#F59E0B' },
    { name: 'Pending', value: stats.pending, color: '#6B7280' },
  ];

  const totalTasks = userData?.tasks?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Profile
              </h1>
              <p className="text-gray-700 mt-2 text-lg">{userData?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg 
              transition duration-300 flex items-center gap-2 shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Task Statistics */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">
              Task Statistics
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                    }) => {
                      const radius =
                        innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x =
                        cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                      const y =
                        cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                      return percent > 0 ? (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="text-sm font-medium"
                        >
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      ) : null;
                    }}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task Summary */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">
              Task Summary
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Completed', value: stats.completed, color: 'green' },
                {
                  label: 'In Progress',
                  value: stats.inProgress,
                  color: 'indigo',
                },
                { label: 'Paused', value: stats.paused, color: 'amber' },
                { label: 'Pending', value: stats.pending, color: 'gray' },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 bg-${item.color}-50 rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full bg-${item.color}-500`}
                    ></div>
                    <span className="text-gray-700 font-medium">
                      {item.label}
                    </span>
                  </div>
                  <span className={`font-semibold text-${item.color}-700`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Total Tasks Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-indigo-700">
                Total Tasks
              </h2>
              <p className="text-gray-700 mt-1">All time tasks created</p>
            </div>
            <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {totalTasks}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
