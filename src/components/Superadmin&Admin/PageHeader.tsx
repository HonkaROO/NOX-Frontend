interface PageHeaderProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
}

export function PageHeader({
  title,
  description,
  buttonText,
  onButtonClick,
}: PageHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-4xl font-semibold">{title}</h1>
        <p className="pt-2">{description}</p>
      </div>
      <div className="mb-6">
        <button
          onClick={onButtonClick}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
