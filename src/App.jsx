import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import HabitGrid from './components/HabitGrid';
import MoodTracker from './components/MoodTracker';
import TopChart from './components/TopChart';
import BottomChart from './components/BottomChart';
import { INITIAL_HABITS, getMonthDays } from './utils';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState([]);
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habit_list');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });
  
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('habit_logs');
    return saved ? JSON.parse(saved) : {};
  });

  const [moods, setMoods] = useState(() => {
    const saved = localStorage.getItem('habit_moods');
    return saved ? JSON.parse(saved) : {};
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    setDays(getMonthDays(currentDate));
  }, [currentDate]);

  useEffect(() => {
    localStorage.setItem('habit_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('habit_moods', JSON.stringify(moods));
  }, [moods]);

  useEffect(() => {
    localStorage.setItem('habit_list', JSON.stringify(habits));
  }, [habits]);

  const updateHabit = (habitId, field, value) => {
    setHabits(prev => prev.map(h => h.id === habitId ? { ...h, [field]: value } : h));
  };

  const addHabit = () => {
    const newId = `h${Date.now()}`;
    setHabits(prev => [...prev, { id: newId, name: 'New Habit', icon: 'Circle', goal: 30 }]);
  };

  const deleteHabit = (habitId) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  const toggleLog = (dateString, habitId) => {
    setLogs(prev => {
      const dayLogs = prev[dateString] || {};
      const currentStatus = dayLogs[habitId] || false;
      return {
        ...prev,
        [dateString]: {
          ...dayLogs,
          [habitId]: !currentStatus
        }
      };
    });
  };

  const updateMood = (dateString, field, value) => {
    setMoods(prev => {
      const dayMoods = prev[dateString] || {};
      return {
        ...prev,
        [dateString]: {
          ...dayMoods,
          [field]: value
        }
      };
    });
  };

  const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));

  if (days.length === 0) return null;

  return (
    <div className="app-container">
      <div className="header-section">
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div className="month-display glass-panel" style={{ position: 'relative' }}>
            <button onClick={handlePrevMonth} className="month-nav-btn" style={{ position: 'absolute', left: '10px' }}>
              <ChevronLeft size={24} />
            </button>
            <div style={{ textAlign: 'center' }}>
              <h1>{format(currentDate, 'MMMM')}</h1>
              <h2>{format(currentDate, 'yyyy')}</h2>
            </div>
            <button onClick={handleNextMonth} className="month-nav-btn" style={{ position: 'absolute', right: '10px' }}>
              <ChevronRight size={24} />
            </button>
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className="glass-panel"
            title="Toggle Dark Mode"
            style={{ 
              padding: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer',
              border: 'none',
              color: 'var(--text-primary)',
              background: 'var(--panel-bg)'
            }}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
        <TopChart days={days} habits={habits} logs={logs} />
      </div>
      
      <HabitGrid 
        days={days} 
        habits={habits} 
        logs={logs} 
        toggleLog={toggleLog} 
        updateHabit={updateHabit}
        addHabit={addHabit}
        deleteHabit={deleteHabit}
      />
      
      <MoodTracker 
        days={days} 
        moods={moods} 
        updateMood={updateMood} 
      />
      
      <BottomChart 
        days={days} 
        habits={habits} 
        logs={logs} 
      />
    </div>
  );
}

export default App;
