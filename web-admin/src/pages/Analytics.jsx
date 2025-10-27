import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Input';

const Analytics = () => {
  const userGrowthData = [
    { month: 'Jul', users: 95000 },
    { month: 'Aug', users: 102000 },
    { month: 'Sep', users: 108000 },
    { month: 'Oct', users: 112000 },
    { month: 'Nov', users: 117000 },
    { month: 'Dec', users: 120000 },
  ];

  const deviceData = [
    { device: 'Mobile', value: 65 },
    { device: 'Desktop', value: 25 },
    { device: 'Tablet', value: 7 },
    { device: 'Smart Speaker', value: 3 },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-admin-text-primary">Analytics Dashboard</h1>
        <p className="text-admin-text-secondary mt-1">Track platform performance and user behavior</p>
      </motion.div>

      <div className="flex gap-4">
        <Select className="w-48">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
          <option>Last year</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Total users over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1DB954" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1DB954" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#282828" />
                <XAxis dataKey="month" stroke="#B3B3B3" />
                <YAxis stroke="#B3B3B3" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #282828',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                  }}
                />
                <Area type="monotone" dataKey="users" stroke="#1DB954" fill="url(#userGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
            <CardDescription>User sessions by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deviceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#282828" />
                <XAxis type="number" stroke="#B3B3B3" />
                <YAxis dataKey="device" type="category" stroke="#B3B3B3" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #282828',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                  }}
                />
                <Bar dataKey="value" fill="#1DB954" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;