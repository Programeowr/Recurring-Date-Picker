"use client";

import Calendar from "./Calendar.js"
import Repeat from "./Repeat.js"
import { useState } from "react";

export default function Home() {
  const [highlightedWeekdays, setHighlightedWeekdays] = useState([]);
  const [highlightedMonths, setHighlightedMonths] = useState([0,1,2,3,4,5,6,7,8,9,10,11]);

  const [removeDateOfMonth, setRemoveDateOfMonth] = useState(false);
  const [removeWeekdayInstance, setRemoveWeekdayInstance] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  return (
    <div className="calendar" style={{transform: 'scale(0.5)', marginTop : '-35vh'}}>
        <Calendar highlightedWeekdays={highlightedWeekdays} highlightedMonths={highlightedMonths}
                  removeDateOfMonth={removeDateOfMonth} removeWeekdayInstance={removeWeekdayInstance}
                  startDate={startDate} endDate={endDate}></Calendar>

        <Repeat setParentSelectedMonths = {setHighlightedMonths} setParentSelectedDays={setHighlightedWeekdays}
                removeDateOfMonth={removeDateOfMonth} setRemoveDateOfMonth={setRemoveDateOfMonth}
                removeWeekdayInstance={removeWeekdayInstance} setRemoveWeekdayInstance={setRemoveWeekdayInstance} 
                startDate={startDate} endDate={endDate}
                setStartDate={setStartDate} setEndDate={setEndDate}></Repeat>
    </div>
  );
}
