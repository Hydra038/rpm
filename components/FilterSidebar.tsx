type FilterSidebarProps = {
  makes: string[];
  models: string[];
  years: number[];
  categories: string[];
  onFilterChange: (filters: any) => void;
};

export function FilterSidebar({ makes, models, years, categories, onFilterChange }: FilterSidebarProps) {
  // TODO: Implement filter UI and handlers
  return (
    <aside className="w-full md:w-64 p-4 border-r bg-gray-50">
      <h4 className="font-bold mb-2">Filters</h4>
      {/* Add select inputs for make, model, year, category */}
      <div>Filter UI coming soon.</div>
    </aside>
  );
}
