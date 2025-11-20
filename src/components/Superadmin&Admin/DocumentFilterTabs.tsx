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
    <div className="flex gap-6 mt-12 mb-6 border-b border-gray-200 px-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`pb-3 px-1 font-medium ${
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
