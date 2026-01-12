const Card = ({ classNames, title, icon, iconColor, value }) => {
  return (
    <div
      className={` ${classNames} bg-white border border-gray-200 p-4 rounded-md`}
    >
      <div className="flex justify-between items-center mb-2">
        <p class="text-[#616f89] dark:text-slate-400 text-sm font-medium leading-normal uppercase tracking-wider">
          {title}
        </p>
        <p className={`material-symbols-outlined ${iconColor}`}>{icon}</p>
      </div>

      <h4 className="text-3xl text-black">{value}</h4>
    </div>
  );
};

export default Card;
