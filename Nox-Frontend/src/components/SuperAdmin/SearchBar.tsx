interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search users.." }: SearchBarProps) {
  return (
    <div className="relative w-full sm:w-auto">
      <div className="absolute left-2 top-1/2 -translate-y-1/2">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/bee2bddeb15453fa8c7a40e256b577322e4156d2?width=14"
          alt="Search"
          className="w-[7px] h-2 object-contain"
        />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full sm:w-[200px] h-[36px] pl-8 pr-4 text-sm font-normal text-black placeholder:text-black/60 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
