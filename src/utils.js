import { format, getDaysInMonth, startOfMonth, addDays, getWeekOfMonth } from 'date-fns';

export const INITIAL_HABITS = [
  { id: 'h1', name: 'Exercise', icon: 'Dumbbell', goal: 20 },
  { id: 'h2', name: 'Sleep for 7 hours', icon: 'Moon', goal: 31 },
  { id: 'h3', name: '8 glasses of water', icon: 'Droplets', goal: 31 },
  { id: 'h4', name: 'Meditate', icon: 'Brain', goal: 20 },
  { id: 'h5', name: 'Complete all tasks', icon: 'CheckSquare', goal: 25 },
  { id: 'h6', name: 'Read 20 pages', icon: 'BookOpen', goal: 20 },
  { id: 'h7', name: 'Limit screen time (2h)', icon: 'Smartphone', goal: 31 },
  { id: 'h8', name: 'Be grateful', icon: 'Heart', goal: 31 },
  { id: 'h9', name: 'Write journal', icon: 'PenTool', goal: 15 },
  { id: 'h10', name: 'Self care', icon: 'Smile', goal: 10 },
];

export const getMonthDays = (currentDate) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentDate);
  const start = startOfMonth(currentDate);

  const days = [];
  for (let i = 0; i < daysInMonth; i++) {
    const date = addDays(start, i);
    // getWeekOfMonth returns week 1-5 generally.
    const weekNum = getWeekOfMonth(date, { weekStartsOn: 1 }); 
    // We cap it at 5 because we only styled 5 weeks in CSS.
    const week = Math.min(weekNum, 5); 
    
    days.push({
      date,
      dayNumber: i + 1,
      dayName: format(date, 'EEEE').substring(0, 1), // M, T, W...
      dateString: format(date, 'yyyy-MM-dd'),
      week,
    });
  }
  return days;
};
