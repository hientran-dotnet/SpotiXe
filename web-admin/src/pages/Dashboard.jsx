import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Crown,
  Activity,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Music,
  Play,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatNumber, formatCurrency } from '@/lib/utils';

const streamData = [
  { date: 'Jan 1', streams: 45000 },
  { date: 'Jan 5', streams: 52000 },
  { date: 'Jan 10', streams: 61000 },
  { date: 'Jan 15', streams: 58000 },
  { date: 'Jan 20', streams: 71000 },
  { date: 'Jan 25', streams: 68000 },
  { date: 'Jan 30', streams: 82000 },
];

const genreData = [
  { genre: 'Pop', count: 3200 },
  { genre: 'Rock', count: 2800 },
  { genre: 'Hip Hop', count: 3500 },
  { genre: 'Electronic', count: 2100 },
  { genre: 'Jazz', count: 1600 },
];

const userTypeData = [
  { name: 'Premium', value: 35000, color: '#1DB954' },
  { name: 'Free', value: 85000, color: '#B3B3B3' },
];

const topTracks = [
  { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', streams: 2840000, duration: '3:20', cover: '🎵' },
  { id: 2, title: 'Shape of You', artist: 'Ed Sheeran', streams: 2650000, duration: '3:53', cover: '🎵' },
  { id: 3, title: 'Someone Like You', artist: 'Adele', streams: 2340000, duration: '4:45', cover: '🎵' },
  { id: 4, title: 'Bohemian Rhapsody', artist: 'Queen', streams: 2120000, duration: '5:55', cover: '🎵' },
  { id: 5, title: 'Imagine', artist: 'John Lennon', streams: 1980000, duration: '3:03', cover: '🎵' },
];

const recentActivities = [
  { id: 1, type: 'signup', user: 'John Doe', action: 'signed up for Premium', time: '2 min ago' },
  { id: 2, type: 'upload', user: 'Artist Name', action: 'uploaded new track "Summer Vibes"', time: '15 min ago' },
  { id: 3, type: 'payment', user: 'Jane Smith', action: 'subscribed to Family Plan', time: '1 hour ago' },
  { id: 4, type: 'signup', user: 'Mike Johnson', action: 'created a new account', time: '2 hours ago' },
];

const StatCard = ({ title, value, change, icon: Icon, trend }) => {
  const isPositive = trend === 'up';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-admin-text-secondary">{title}</p>
              <h3 className="text-3xl font-bold text-admin-text-primary mt-2">{value}</h3>
              <div className="flex items-center gap-2 mt-2">
                {trend && (
                  <>
                    {isPositive ? (
                      <TrendingUp size={16} className="text-spotify-green" />
                    ) : (
                      <TrendingDown size={16} className="text-apple-red" />
                    )}
                    <span className={`text-sm font-medium ${isPositive ? 'text-spotify-green' : 'text-apple-red'}`}>
                      {change}
                    </span>
                  </>
                )}
                <span className="text-sm text-admin-text-tertiary">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow-green">
              <Icon size={24} className="text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Dashboard = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* <h1 className="text-3xl font-bold text-admin-text-primary">Welcome back, Admin! 👋</h1>
        <p className="text-admin-text-secondary mt-1">{currentDate}</p> */}
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={formatNumber(120000)}
          change="+12.5%"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Active Subscriptions"
          value={formatNumber(35000)}
          change="+8.2%"
          icon={Crown}
          trend="up"
        />
        <StatCard
          title="Total Streams Today"
          value={formatNumber(82000)}
          change="+15.3%"
          icon={Activity}
          trend="up"
        />
        <StatCard
          title="Revenue This Month"
          value={formatCurrency(285000)}
          change="+6.7%"
          icon={DollarSign}
          trend="up"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stream Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Stream Activity</CardTitle>
              <CardDescription>Last 30 days streaming trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={streamData}>
                  <defs>
                    <linearGradient id="streamGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1DB954" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1DB954" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#282828" />
                  <XAxis dataKey="date" stroke="#B3B3B3" />
                  <YAxis stroke="#B3B3B3" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #282828',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="streams"
                    stroke="#1DB954"
                    strokeWidth={3}
                    fill="url(#streamGradient)"
                    dot={{ fill: '#1DB954', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Genre Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Genres</CardTitle>
              <CardDescription>Most popular music genres</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={genreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#282828" />
                  <XAxis dataKey="genre" stroke="#B3B3B3" />
                  <YAxis stroke="#B3B3B3" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #282828',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                    }}
                  />
                  <Bar dataKey="count" fill="#1DB954" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* User Distribution & Top Tracks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Type Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
              <CardDescription>Premium vs Free users</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={userTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #282828',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {userTypeData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-admin-text-secondary">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-admin-text-primary">
                      {formatNumber(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Performing Tracks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Tracks</CardTitle>
              <CardDescription>Most streamed songs this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTracks.map((track, index) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-admin-bg-hover transition-colors cursor-pointer group"
                  >
                    <span className="text-admin-text-tertiary font-medium w-6">{index + 1}</span>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-2xl">
                      {track.cover}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-admin-text-primary truncate">{track.title}</p>
                      <p className="text-sm text-admin-text-secondary truncate">{track.artist}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-admin-text-primary">{formatNumber(track.streams)}</p>
                      <p className="text-sm text-admin-text-tertiary">{track.duration}</p>
                    </div>
                    <button className="p-2 rounded-full bg-spotify-green/20 text-spotify-green opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={16} fill="currentColor" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest platform events and user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-admin-bg-hover transition-colors">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Music size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-admin-text-primary">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-admin-text-tertiary mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
