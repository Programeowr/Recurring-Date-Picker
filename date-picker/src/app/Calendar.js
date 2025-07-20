"use client";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";

import { useState, useEffect } from "react";
import "./styles/Calendar.css";

export default function Calendar({onDateSelect, initialDate, highlightedWeekdays = [], highlightedMonths = [], 
                                  startDate, endDate, removeDateOfMonth, removeWeekdayInstance}) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const years = Array.from({ length: 101 }, (_, i) => 1950 + i);

    const [currentDate, setCurrentDate] = useState(initialDate || new Date());
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);

    const today = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const currentYearIndex = years.indexOf(today.getFullYear());
    const initialStartIndex = Math.max(0, currentYearIndex - 6); 
    const [yearStartIndex, setYearStartIndex] = useState(initialStartIndex);

    const firstDay = new Date(year, month, 1).getDay();
    const numDays = new Date(year, month+1, 0).getDate();

    const prevMonth = () => {
        setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth()-1, 1));
    };

    const nextMonth = () => {
        setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth()+1, 1));
    };

    const handleMonthChange = (newMonth) => {
        setCurrentDate(new Date(year, newMonth, 1));
        setShowMonthPicker(false);
    };

    const handleYearChange = (selectedYear) => {
        setCurrentDate(new Date(selectedYear, month, 1));
        setShowYearPicker(false);
    };

    const isSameDate = (date1, date2) => date1.getFullYear() === date2.getFullYear() &&
                                         date1.getMonth() === date2.getMonth() &&
                                         date1.getDate() === date2.getDate();

    const handleDayClick = (dayNum) => {
        const clickedDate = new Date(year, month, dayNum);

        if ((startDate && clickedDate < new Date(startDate.setHours(0,0,0,0))) ||
            (endDate && clickedDate > new Date(endDate.setHours(0,0,0,0)))) {
            return; 
        }

        const matchDay = clickedDate.getDate();
        const matchWeekday = clickedDate.getDay();

        const getWeekOfMonth = (date) => {
            const first = new Date(date.getFullYear(), date.getMonth(), 1);
            const dayOfWeek = first.getDay();
            return Math.floor((date.getDate() + dayOfWeek - 1) / 7);
        };
        const matchWeekOfMonth = getWeekOfMonth(clickedDate);

        const updatedDates = [...selectedDates];

        const isMatch = (d) => {
            if (removeDateOfMonth)
                return d.getDate() === matchDay;
            if (removeWeekdayInstance)
                return d.getDay() === matchWeekday &&
                    getWeekOfMonth(d) === matchWeekOfMonth;
            return isSameDate(d, clickedDate);
        };

        const alreadyExists = updatedDates.some(isMatch);

        if (alreadyExists) {
            // REMOVE matching dates
            const filtered = updatedDates.filter((d) => !isMatch(d));
            setSelectedDates(filtered);
            onDateSelect?.(clickedDate);
        } else {
            // ADD matching pattern
            const start = new Date(startDate);
            const end = endDate ? new Date(endDate) : new Date(years[years.length - 1], 11, 31);
            const newDates = [];

            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const copy = new Date(d);
                if (removeDateOfMonth && copy.getDate() === matchDay) {
                    newDates.push(copy);
                } else if (
                    removeWeekdayInstance &&
                    copy.getDay() === matchWeekday &&
                    getWeekOfMonth(copy) === matchWeekOfMonth
                ) {
                    newDates.push(copy);
                }
            }

            const merged = [...updatedDates, ...newDates.filter(nd =>
                !updatedDates.some(sd => isSameDate(sd, nd)))];
            setSelectedDates(merged);
            onDateSelect?.(clickedDate);
        }
    };

    useEffect(() => {
        const autoSelectHighlightedDates = () => {
            if(!startDate)  return;

            const start = new Date(startDate);
            const end = endDate ? new Date(endDate) : new Date(years[years.length - 1], 11, 31);
            const newSelected = [];
            for (let d = new Date(start); d <= end; d.setDate(d.getDate()+1)) {
                const date = new Date(d);
                const isHighlightedWeekday = highlightedWeekdays.includes(date.getDay());
                const isHighlightedMonth = highlightedMonths.includes(date.getMonth());
                if (isHighlightedWeekday && isHighlightedMonth) {
                    newSelected.push(date);
                }
            }
            const isSame =
                newSelected.length === selectedDates.length &&
                newSelected.every(d => selectedDates.some(s => isSameDate(s, d)));

            if (!isSame) {
                setSelectedDates(newSelected);
            }
        };

        autoSelectHighlightedDates();
    }, [JSON.stringify(highlightedWeekdays), JSON.stringify(highlightedMonths), startDate, endDate]);    

  return (
    <div className="calendarContainer">
        <div className="calendarDropdown">
            <button onClick={prevMonth} id="calendarButton1"><GrPrevious/></button>
            <div className="calendarHeader">
                <div className="monthPicker" onClick={() => {setShowMonthPicker(!showMonthPicker); setShowYearPicker(false)}}>
                    {months[month]}
                </div>

                <div className="yearPicker" onClick={() => {setShowYearPicker(!showYearPicker); setShowMonthPicker(false)}}>
                    {years[year-1950]}
                </div>
            </div>
            <button onClick={nextMonth} id="calendarButton2"><GrNext /></button>
        </div>
        {showMonthPicker && !showYearPicker && (
            <div className="monthGrid">
                {months.map((m,i) => (
                    <div key={m} className="monthCell" onClick={() => handleMonthChange(i)}>
                        {m}
                    </div>
                ))}
            </div>
        )}
        {showYearPicker && !showMonthPicker && (
            <div className="yearSelect">
                
                <div className="yearGrid">
                    <button className="yearButton" onClick={() => setYearStartIndex((prev) =>
                        Math.max(prev-13, 0))}>Prev</button>
                    {years.slice(yearStartIndex, yearStartIndex+13).map((y) => (
                        <div key={y} className="yearCell" onClick={() => handleYearChange(y)}>
                            {y}
                        </div>
                    ))}
                    <button className="yearButton" onClick={() => setYearStartIndex((prev) =>
                        Math.min(prev+13, years.length-13))}>Next</button>
                </div>
                
            </div>
        )}
        
        <div className="calendarGrid">
            {days.map((day) => (
                <div key={day} className="calendarCellHeader">
                    {day}
                </div>
            ))}

            {[...Array(firstDay)].map((_, i) => (
            <div key={`blank-${i}`} className="calendarCell"></div>
            ))}
            {[...Array(numDays)].map((_, i) => {
            
                const dayNum = i + 1;
                const isToday = dayNum === today.getDate() && 
                                month === today.getMonth() && 
                                year === today.getFullYear();

                const date = new Date(year, month, dayNum);
                const isSelected = selectedDates.some((d) => isSameDate(d, date));
                const isDisabled = (startDate && date < new Date(startDate.setHours(0,0,0,0))) ||
                                   (endDate && date > new Date(endDate.setHours(0,0,0,0)));

                return (
                    <div key={`day-${dayNum}`}
                    className={`calendarCellDay${isToday ? " today" : ""}${isSelected ? " selected" : ""}${isDisabled ? " disabled" : ""}`}
                    onClick={() => handleDayClick(dayNum)}>
                        {dayNum}
                    </div>
                );
            })}

        </div>
    </div>
  );
}