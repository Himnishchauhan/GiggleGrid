import React from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function TopChart({ days, habits, logs }) {
  const data = days.map(day => {
    let completed = 0;
    habits.forEach(habit => {
      if (logs[day.dateString]?.[habit.id]) completed++;
    });
    return {
      name: day.dayNumber.toString(),
      completed,
    };
  });

  return (
    <div className="top-chart glass-panel">
      <div style={{ textAlign: 'center', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
        DAILY HABITS COMPUTED
      </div>
      <ResponsiveContainer width="100%" height={80}>
        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f472b6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f472b6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--panel-bg)', color: 'var(--text-primary)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
            itemStyle={{ color: 'var(--text-primary)' }}
          />
          <YAxis domain={[0, habits.length]} hide />
          <Area type="monotone" dataKey="completed" stroke="#ec4899" fillOpacity={1} fill="url(#colorCompleted)" strokeWidth={2} activeDot={{ fill: 'var(--bg-color)', stroke: '#ec4899', strokeWidth: 2, r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
