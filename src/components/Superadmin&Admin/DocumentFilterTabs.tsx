interface DocumentFilterTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DocumentFilterTabs({
  tabs,
  activeTab,
  onTabChange,
}: DocumentFilterTabsProps) {
  return (
    <div className="flex gap-4 md:gap-6 mt-6 md:mt-12 mb-4 md:mb-6 border-b border-gray-200 px-4 md:px-6 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`pb-2 md:pb-3 px-2 md:px-1 font-medium text-sm md:text-base whitespace-nowrap ${
            activeTab === tab
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-600 hover:text-indigo-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
