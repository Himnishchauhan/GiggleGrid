import React from 'react';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

export default function BottomChart({ days, habits, logs }) {
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

  const totalComputed = data.reduce((acc, curr) => acc + curr.completed, 0);
  const totalPossible = days.length * habits.length;

  return (
    <div className="bottom-stats glass-panel">
      <div style={{ width: '250px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          DAILY HABITS OVERVIEW
        </div>
        <div style={{ marginTop: '20px', fontSize: '0.9rem', fontWeight: 500 }}>
          COMPUTED: {totalComputed} / {totalPossible}
        </div>
      </div>
      <div className="overview-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <Tooltip 
              cursor={{fill: 'var(--panel-border)'}} 
              contentStyle={{ backgroundColor: 'var(--panel-bg)', color: 'var(--text-primary)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
            <Bar dataKey="completed" fill="#f472b6" radius={[4, 4, 0, 0]} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
