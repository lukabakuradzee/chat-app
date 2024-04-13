import React, { useState } from 'react';

const DatePicker = ({ onSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Helper function to generate days in a month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  // Function to handle date selection
  const handleDateClick = (day) => {
    const date = new Date();
    date.setDate(day);
    setSelectedDate(date);
    onSelect(date);
  };

  // Get the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Month starts from 0
  const currentYear = currentDate.getFullYear();

  // Generate days for the current month
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="date-picker">
      <table>
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {daysArray.map((day, index) => (
            <tr key={index}>
              {index % 7 === 0 && index !== 0 && <tr></tr>} {/* Start a new row every 7 days */}
              <td
                className={selectedDate && selectedDate.getDate() === day ? 'selected' : ''}
                onClick={() => handleDateClick(day)}
              >
                {day}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DatePicker;
