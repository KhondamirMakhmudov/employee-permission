const FilterButton = ({ children }) => {
  return (
    <button class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-blue-500 text-blue-500 bg-blue/5 px-4 transition-colors cursor-pointer">
      <span class="text-sm font-semibold">{children}</span>
    </button>
  );
};

export default FilterButton;
