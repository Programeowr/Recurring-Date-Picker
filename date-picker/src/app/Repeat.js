"use client";
import { FaChevronDown } from "react-icons/fa";

import { useState } from "react";
import "./styles/Repeat.css";
import Calendar from "./Calendar.js"

export default function Repeat({startDate, setStartDate, endDate, setEndDate, 
                                setParentSelectedDays, setParentSelectedMonths,
                                removeDateOfMonth, setRemoveDateOfMonth,
                                removeWeekdayInstance, setRemoveWeekdayInstance}) {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];
    const [showRepeat, setShowRepeat] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedMonths, setSelectedMonths] = useState([0,1,2,3,4,5,6,7,8,9,10,11]);
    const [selectAllDays, setSelectAllDays] = useState(false);
    const [selectAllMonths, setSelectAllMonths] = useState(true);
    const [showStartCalendar, setShowStartCalendar] = useState(false);
    const [showEndCalendar, setShowEndCalendar] = useState(false);

    const handleWeekRepeat = (dayIndex) => {
        let updatedDays = [];
        if(selectedDays.includes(dayIndex)){
            updatedDays = selectedDays.filter((i) => i !== dayIndex);
        } else {
            updatedDays = [...selectedDays, dayIndex];
        }
        setSelectedDays(updatedDays);
        setSelectAllDays(updatedDays.length === 7);
        setParentSelectedDays(updatedDays);
    };

    const handleWeekSelect = (checked) => {
        setSelectAllDays(checked);
        if(checked){
            setSelectedDays([0,1,2,3,4,5,6]);
            setParentSelectedDays([0,1,2,3,4,5,6]);
        } else{
            setSelectedDays([]);
            setParentSelectedDays([]);
        }
    };

    const handleMonthRepeat = (monthIndex) => {
        let updatedMonths = [];
        if(selectedMonths.includes(monthIndex)){
            updatedMonths = selectedMonths.filter((i) => i !== monthIndex);
        } else {
            updatedMonths = [...selectedMonths, monthIndex];
        }
        setSelectedMonths(updatedMonths);
        setSelectAllMonths(updatedMonths.length === 12);
        setParentSelectedMonths(updatedMonths);
    };

    const handleMonthSelect = (checked) => {
        setSelectAllMonths(checked);
        if(checked){
            setSelectedMonths([0,1,2,3,4,5,6,7,8,9,10,11]);
            setParentSelectedMonths([0,1,2,3,4,5,6,7,8,9,10,11]);
        } else{
            setSelectedMonths([]);
            setParentSelectedMonths([]);
        }
    };

    return(
        <div className="repeatContainer">
            <div className="repeatHeader">
                <div>Repeat</div>
                <button onClick={() => setShowRepeat(!showRepeat)}><FaChevronDown /></button>
            </div>
            {showRepeat && (
                <div className="repeatBox">
                    <div className="dateRange">
                        <div className="dateField" onClick={() => {setShowStartCalendar(!showStartCalendar); setShowEndCalendar(false);}}>
                            <label>Start Date: </label>
                            <span>{startDate ? startDate.toDateString() : "Select"}</span>
                        </div>

                        <div className="dateField" onClick={() => {setShowEndCalendar(!showEndCalendar); setShowStartCalendar(false);}}>
                            <label>End Date: </label>
                            <span>{endDate ? endDate.toDateString() : "Select"}</span>
                        </div>
                    </div>
                    <div className="rangeCalendar">
                        {showStartCalendar && (
                            <div className="startCalendar" style={{transform: 'scale(0.5)'}}>
                                <Calendar initialDate={startDate || new Date()}
                                    onDateSelect={(date) => {
                                        setStartDate(date);
                                        setShowStartCalendar(false);
                                    }}
                                    startDate={new Date()}
                                    
                                />
                            </div>
                        )}

                        {showEndCalendar && (
                            <div className="endCalendar" style={{transform: 'scale(0.5)'}}>
                                <Calendar initialDate={endDate || new Date()}
                                    onDateSelect={(date) => {
                                        setEndDate(date);
                                        setShowEndCalendar(false);
                                    }}
                                    startDate={startDate}
                                />
                            </div>
                        )}
                    </div>
                    <div className="weekHeader">
                        Every Day
                        <input type="checkbox" checked={selectAllDays} onChange={(e) =>handleWeekSelect(e.target.checked)}></input>
                    </div>
                    <div className="weekGrid">
                        {days.map((d, i) => (
                            <div key = {i} className={`weekCell ${selectedDays.includes(i) ? "selected" : ""}`} onClick={() => handleWeekRepeat(i)}>
                                {d}
                            </div>
                        ))}
                    </div>
                    <div className="monthHeader">
                        Every Month
                        <input type="checkbox" checked={selectAllMonths} onChange={(e) =>handleMonthSelect(e.target.checked)}></input>
                    </div>
                    <div className="monthCheck">
                        {months.map((m, i) => (
                            <div key = {m} className={`monthCircle ${selectedMonths.includes(i) ? "selected" : ""}`} onClick={() => handleMonthRepeat(i)}>
                                {m}
                            </div>
                        ))}
                    </div>
                    <div className="remover">
                            <div className="removerDate">
                                Remove/Add Date of Every Month
                                <input type="checkbox" checked={removeDateOfMonth} onChange={(e) => {
                                    const checked = e.target.checked;
                                    setRemoveDateOfMonth(checked);
                                    if(checked) setRemoveWeekdayInstance(false)
                                    }}></input>
                            </div>
                            <div className="removerWeek">
                                Remove/Add Week of Every Month
                                <input type="checkbox" checked={removeWeekdayInstance} onChange={(e) => {
                                    const checked = e.target.checked;
                                    setRemoveWeekdayInstance(checked);
                                    if(checked) setRemoveDateOfMonth(false);
                                    }}></input>
                            </div>
                        </div>
                </div>
            )}
        </div>
    );
}