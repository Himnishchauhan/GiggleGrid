import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Check, Plus, Trash2, X } from 'lucide-react';
import { ICON_PRESETS } from '../iconPresets';

export default function HabitGrid({ days, habits, logs, toggleLog, updateHabit, addHabit, deleteHabit }) {
  const [activeIconPicker, setActiveIconPicker] = useState(null);
  // Compute monthly totals per habit
  const getHabitMonthlyTotal = (habitId) => {
    let total = 0;
    days.forEach(day => {
      if (logs[day.dateString]?.[habitId]) {
        total++;
      }
    });
    return total;
  };

  // Compute daily totals
  const getDailyTotal = (dateString) => {
    let total = 0;
    habits.forEach(habit => {
      if (logs[dateString]?.[habit.id]) {
        total++;
      }
    });
    return total;
  };

  const gridTemplate = `minmax(120px, 2fr) repeat(${days.length}, minmax(0, 1fr)) minmax(60px, 1fr)`;

  return (
    <div className="glass-panel grid-wrapper" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div className="habit-grid" style={{ gridTemplateColumns: gridTemplate, width: '100%', height: '100%' }}>
        {/* HEADER ROW 1: Week grouping */}
        <div className="grid-cell grid-header habit-name" style={{ borderBottom: 'none' }}>
          WEEK
        </div>
        {days.map((day, idx) => {
          // Only show week label on the first day of the week or first day of month
          const isFirstDayOfWeek = idx === 0 || day.week !== days[idx - 1].week;
          return (
            <div key={`week-${day.dateString}`} className={`grid-cell grid-header week-${day.week}`} style={{ fontWeight: 'bold' }}>
              {isFirstDayOfWeek ? `WEEK ${day.week}` : ''}
            </div>
          );
        })}
        <div className="grid-cell grid-header monthly-goal" style={{ borderBottom: 'none' }}></div>

        {/* HEADER ROW 2: Days */}
        <div className="grid-cell grid-header habit-name" style={{ alignItems: 'flex-start' }}>
          DAILY HABITS
        </div>
        {days.map(day => (
          <div key={`day-${day.dateString}`} className={`grid-cell grid-header week-${day.week}`}>
            <span>{day.dayNumber}</span>
            <span>{day.dayName}</span>
          </div>
        ))}
        <div className="grid-cell grid-header monthly-goal">
          MONTHLY GOAL
        </div>

        {/* HABIT ROWS */}
        {habits.map(habit => {
          const IconComponent = Icons[habit.icon] || Icons.Circle;
          return (
            <React.Fragment key={habit.id}>
              <div className="grid-cell habit-name" style={{ paddingLeft: '5px', display: 'flex', alignItems: 'center', position: 'relative' }}>
                <button 
                  onClick={() => setActiveIconPicker(activeIconPicker === habit.id ? null : habit.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: 'inherit' }}
                  title="Change Icon"
                >
                  <IconComponent className="habit-icon" size={16} strokeWidth={1.5} style={{ flexShrink: 0, marginRight: '4px' }} />
                </button>

                <input 
                  type="text" 
                  value={habit.name} 
                  onChange={(e) => updateHabit(habit.id, 'name', e.target.value)}
                  className="habit-input"
                  style={{ flexGrow: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-primary)' }}
                />
                <button 
                  onClick={() => deleteHabit(habit.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#cbd5e1', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                  title="Delete Habit"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {days.map(day => {
                const isChecked = logs[day.dateString]?.[habit.id] || false;
                return (
                  <div key={`${habit.id}-${day.dateString}`} className={`grid-cell week-${day.week}`}>
                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={() => toggleLog(day.dateString, habit.id)}
                      />
                      <div className="custom-checkbox">
                        <Check strokeWidth={3} />
                      </div>
                    </label>
                  </div>
                );
              })}
              <div className="grid-cell monthly-goal text-center font-bold" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.75rem' }}>{getHabitMonthlyTotal(habit.id)} / </span>
                <input 
                  type="number" 
                  value={habit.goal} 
                  onChange={(e) => updateHabit(habit.id, 'goal', parseInt(e.target.value) || 0)}
                  style={{ width: '30px', background: 'transparent', border: 'none', outline: 'none', fontSize: '0.75rem', fontWeight: 'bold', color: 'inherit', textAlign: 'center' }}
                />
              </div>
            </React.Fragment>
          );
        })}

        {/* ADD HABIT ROW */}
        <div className="grid-cell habit-name" style={{ paddingLeft: '5px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
          <button 
            onClick={addHabit}
            style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-blue)', fontSize: '0.8rem', fontWeight: 600, padding: '4px' }}
          >
            <Plus size={16} strokeWidth={2} style={{ marginRight: '4px' }} />
            Add Habit
          </button>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', paddingLeft: '4px', marginTop: '2px', fontStyle: 'italic' }}>
            Tip: Click any habit's icon to change it
          </span>
        </div>
        {days.map(day => (
          <div key={`add-${day.dateString}`} className={`grid-cell week-${day.week}`}></div>
        ))}
        <div className="grid-cell monthly-goal"></div>

        {/* SUMMARY ROW 1: Habits completed daily */}
        <div className="grid-cell summary-row summary-label habit-name" style={{ marginTop: '5px' }}>
          Habits completed daily:
        </div>
        {days.map(day => (
          <div key={`total-${day.dateString}`} className={`grid-cell summary-row week-${day.week}`} style={{ marginTop: '5px' }}>
            {getDailyTotal(day.dateString)}
          </div>
        ))}
        <div className="grid-cell summary-row monthly-goal" style={{ marginTop: '5px' }}></div>

        {/* SUMMARY ROW 2: Progress % */}
        <div className="grid-cell summary-row summary-label habit-name">
          Progress %:
        </div>
        {days.map(day => {
          const dailyTotal = getDailyTotal(day.dateString);
          const percent = Math.round((dailyTotal / habits.length) * 100) || 0;
          return (
            <div key={`percent-${day.dateString}`} className={`grid-cell summary-row week-${day.week}`}>
              {percent}%
            </div>
          );
        })}
        <div className="grid-cell summary-row monthly-goal"></div>

      </div>

      {/* ICON PICKER MODAL */}
      {activeIconPicker && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setActiveIconPicker(null)}>
          <div style={{
            background: 'var(--bg-color)', border: '1px solid var(--panel-border)', borderRadius: '12px', 
            padding: '15px', width: '280px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Select an Icon</span>
              <button onClick={() => setActiveIconPicker(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={16}/></button>
            </div>
            {ICON_PRESETS.map(iconName => {
              const PresetIcon = Icons[iconName] || Icons.Circle;
              const habit = habits.find(h => h.id === activeIconPicker);
              const isSelected = habit?.icon === iconName;
              return (
                <button
                  key={iconName}
                  onClick={() => {
                    updateHabit(activeIconPicker, 'icon', iconName);
                    setActiveIconPicker(null);
                  }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: '6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '6px', transition: 'background 0.2s',
                    color: isSelected ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    backgroundColor: isSelected ? 'var(--input-focus)' : 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--summary-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isSelected ? 'var(--input-focus)' : 'transparent'}
                >
                  <PresetIcon size={20} strokeWidth={2} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
