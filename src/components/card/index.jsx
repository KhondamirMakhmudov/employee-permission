const Card = ({ classNames, title, icon, value }) => {
  return (
    <div
      className={` ${classNames} bg-white border border-gray-200 p-4 rounded-md`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-4xl uppercase text-gray-600">{title}</h3>
        <p></p>
      </div>
    </div>
  );
};

export default Card;
