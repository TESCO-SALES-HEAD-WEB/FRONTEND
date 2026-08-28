import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import './DateRangePicker.css';

const PRESETS = [
  'Today',
  'Yesterday',
  'Last 7 Days',
  'Last 30 Days',
  'This Month',
  'Custom'
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function formatDateDisplay(date) {
  if (!date) return '';
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

function startOfDay(d) {
  const dt = new Date(d);
  dt.setHours(0,0,0,0);
  return dt;
}

export default function DateRangePicker({ onApply } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState('Last 30 Days');
  const dropdownRef = useRef(null);
  
  // Set default state to match screenshot (July 16, 2026)
  const baseDate = new Date(); // today
  
  const [currentMonth, setCurrentMonth] = useState(baseDate);
  const [startDate, setStartDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 30); d.setHours(0,0,0,0); return d; });
  const [endDate, setEndDate] = useState(() => { const d = new Date(); d.setHours(0,0,0,0); return d; });
  useEffect(() => { if (typeof onApply === 'function' && startDate && endDate) onApply(startDate, endDate); }, [startDate, endDate]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePresetClick = (preset) => {
    setActivePreset(preset);
    const today = startOfDay(baseDate);
    
    if (preset === 'Today') {
      setStartDate(today);
      setEndDate(today);
      setCurrentMonth(today);
    } else if (preset === 'Yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      setStartDate(yesterday);
      setEndDate(yesterday);
      setCurrentMonth(yesterday);
    } else if (preset === 'Last 7 Days') {
      const last7 = new Date(today);
      last7.setDate(last7.getDate() - 6);
      setStartDate(last7);
      setEndDate(today);
      setCurrentMonth(today);
    } else if (preset === 'Last 30 Days') {
      const last30 = new Date(today);
      last30.setDate(last30.getDate() - 29);
      setStartDate(last30);
      setEndDate(today);
      setCurrentMonth(today);
    } else if (preset === 'This Month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setStartDate(firstDay);
      setEndDate(lastDay);
      setCurrentMonth(today);
    }
    
    if (preset !== 'Custom') {
      setIsOpen(false);
    }
  };

  const handleDayClick = (dayNum) => {
    setActivePreset('Custom');
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum);
    
    if (startDate && endDate) {
      // Reset selection
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (clickedDate < startDate) {
        setStartDate(clickedDate);
      } else {
        setEndDate(clickedDate);
      }
    } else {
      setStartDate(clickedDate);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  const blanks = Array(firstDayOfMonth).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const allSlots = [...blanks, ...days];

  const getDayClasses = (dayNum) => {
    if (!dayNum) return "dp-day empty";
    
    const d = new Date(year, month, dayNum);
    let classes = "dp-day";
    
    const isStart = startDate && d.getTime() === startDate.getTime();
    const isEnd = endDate && d.getTime() === endDate.getTime();
    const isBetween = startDate && endDate && d > startDate && d < endDate;
    
    // Check if it's both start and end
    if (isStart && isEnd) {
      classes += " start-date end-date single-day";
    } else {
      if (isStart) classes += " start-date";
      if (isEnd) classes += " end-date";
      if (isBetween) classes += " in-range";
    }
    
    return classes;
  };

  const buttonText = activePreset === 'Custom' 
    ? (startDate && endDate ? `${formatDateDisplay(startDate)} - ${formatDateDisplay(endDate)}` : 'Select date range')
    : `${activePreset} ${startDate ? `(${formatDateDisplay(startDate)} - ${formatDateDisplay(endDate || startDate)})` : ''}`;

  return (
    <div className="date-picker-container" ref={dropdownRef}>
      <button 
        className={`btn btn--secondary filter-dropdown date-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon size={16} className="text-muted" />
        <span className="font-medium">{buttonText}</span>
        <ChevronDown size={14} className="text-muted" />
      </button>

      {isOpen && (
        <div className="date-picker-popover">
          <div className="dp-sidebar">
            {PRESETS.map(preset => (
              <button 
                key={preset}
                className={`dp-preset-btn ${activePreset === preset ? 'active' : ''}`}
                onClick={() => handlePresetClick(preset)}
              >
                {preset}
              </button>
            ))}
          </div>
          
          <div className="dp-calendar">
            <div className="dp-header">
              <button className="dp-nav-btn" onClick={handlePrevMonth}><ChevronLeft size={16} /></button>
              <div className="dp-month-year">{MONTHS[month]} {year}</div>
              <button className="dp-nav-btn" onClick={handleNextMonth}><ChevronRight size={16} /></button>
            </div>
            
            <div className="dp-grid dp-weekdays">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>
            
            <div className="dp-grid dp-days">
              {allSlots.map((day, idx) => {
                if (day === null) return <span key={`blank-${idx}`} className="dp-day empty"></span>;
                
                return (
                  <span 
                    key={day} 
                    className={getDayClasses(day)}
                    onClick={() => handleDayClick(day)}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
