const EmployeeCard = ({
  name,
  position,
  department,
  avatarUrl,
  priority,
  visitPurpose,
  date,
  duration,
  onApprove,
  onReject,
}) => {
  const priorityStyles = {
    urgent: {
      bg: "bg-orange-100",
      text: "text-orange-700",
      label: "Срочно",
    },
    planned: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      label: "Планово",
    },
  };

  const currentPriority = priorityStyles[priority] || priorityStyles.planned;

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-[#dbdfe6] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div
              className="size-12 rounded-full bg-cover bg-center shrink-0"
              style={{ backgroundImage: `url('${avatarUrl}')` }}
            />
            <div>
              <h3 className="text-[#111318] font-bold text-lg">{name}</h3>
              <p className="text-[#616f89] text-sm">
                {position} • {department}
              </p>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded ${currentPriority.bg} ${currentPriority.text} text-xs font-bold uppercase tracking-wider`}
          >
            {currentPriority.label}
          </span>
        </div>

        {/* Visit Purpose */}
        <div className="flex flex-col gap-2 py-2">
          <p className="text-sm font-medium text-[#616f89]">Цель визита</p>
          <p className="text-[#111318] text-sm leading-relaxed">
            {visitPurpose}
          </p>
        </div>

        {/* Schedule */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[#f0f2f4] rounded-lg">
          <span className="material-symbols-outlined text-slate-500">
            schedule
          </span>
          <div className="flex flex-col">
            <span className="text-[#111318] text-sm font-semibold">{date}</span>
            <span className="text-[#616f89] text-xs">
              Длительность: {duration}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto border-t border-[#dbdfe6] p-4 grid grid-cols-2 gap-3 bg-gray-50">
        <button
          onClick={onReject}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-medium text-sm transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
          Отклонить
        </button>
        <button
          onClick={onApprove}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm shadow-blue-200"
        >
          <span className="material-symbols-outlined text-[18px]">check</span>
          Одобрить
        </button>
      </div>
    </div>
  );
};
export default EmployeeCard;
