import React from 'react';

export default function MoodTracker({ days, moods, updateMood }) {
  const handleInputChange = (dateString, field, value) => {
    // only allow numbers between 1 and 10 or empty
    if (value === '') {
      updateMood(dateString, field, '');
      return;
    }
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= 10) {
      updateMood(dateString, field, num);
    }
  };

  const gridTemplate = `minmax(120px, 2fr) repeat(${days.length}, minmax(0, 1fr)) minmax(60px, 1fr)`;

  return (
    <div className="glass-panel mood-tracker grid-wrapper" style={{ flexShrink: 0, marginTop: '5px' }}>
      <div className="mood-row" style={{ gridTemplateColumns: gridTemplate }}>
        <div className="grid-cell habit-name summary-row">
          Rate your mood (1-10)
        </div>
        {days.map(day => (
          <div key={`mood-${day.dateString}`} className="grid-cell summary-row">
            <input 
              type="text" 
              className="mood-input" 
              value={moods[day.dateString]?.mood || ''} 
              onChange={(e) => handleInputChange(day.dateString, 'mood', e.target.value)}
            />
          </div>
        ))}
        <div className="grid-cell monthly-goal summary-row"></div>
      </div>

      <div className="mood-row" style={{ gridTemplateColumns: gridTemplate }}>
        <div className="grid-cell habit-name summary-row">
          Rate your energy level (1-10)
        </div>
        {days.map(day => (
          <div key={`energy-${day.dateString}`} className="grid-cell summary-row">
            <input 
              type="text" 
              className="mood-input" 
              value={moods[day.dateString]?.energy || ''} 
              onChange={(e) => handleInputChange(day.dateString, 'energy', e.target.value)}
            />
          </div>
        ))}
        <div className="grid-cell monthly-goal summary-row"></div>
      </div>
    </div>
  );
}
