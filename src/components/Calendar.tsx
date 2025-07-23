import { useState } from 'react';
import type { CompletionData } from '../types';

interface CalendarProps {
  completionData: CompletionData;
}

function Calendar({ completionData }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const renderCalendarGrid = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const grid = [];

    dayNames.forEach(name => grid.push(<div key={name} className="day-name">{name}</div>));
    for (let i = 0; i < firstDayOfMonth; i++) grid.push(<div key={`blank-${i}`} />);

    for (let i = 1; i <= daysInMonth; i++) {
      const dayStr = new Date(year, month, i).toISOString().split('T')[0];
      const todayStr = new Date().toISOString().split('T')[0];
      
      let classNames = 'calendar-day';
      if (dayStr === todayStr) classNames += ' today';
      
      const dayData = completionData[dayStr];
      if (dayData && dayData.total > 0 && dayData.completed / dayData.total >= 0.75) {
        classNames += ' completed';
      }
      
      grid.push(<div key={i} className={classNames}>{i}</div>);
    }
    return grid;
  };

  return (
    <section >
      <header className="calendar-header">
        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>‹</button>
        <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>›</button>
      </header>
      <div className="calendar-grid">
        {renderCalendarGrid()}
      </div>
      <div className="legend">
        <div><span className="legend-dot completed"></span> &gt; 75% Complete</div>
      </div>
    </section>
  );
}

export default Calendar;