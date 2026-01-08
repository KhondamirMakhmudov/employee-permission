// components/ui/TimeRange.jsx
import React from "react";
import TimeInput from "./TimeInput";

const TimeRange = ({
  fromLabel = "Время выхода",
  toLabel = "Время возврата",
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-slate-700 text-sm font-semibold">
        Интервал времени (с / по)
      </label>
      <div className="grid grid-cols-2 gap-4">
        <TimeInput
          id="time-from"
          timeLabel="C"
          icon="schedule"
          placeholder="14:00"
        />
        <TimeInput
          id="time-to"
          timeLabel="По"
          icon="history"
          placeholder="15:00"
        />
      </div>
    </div>
  );
};

export default TimeRange;
