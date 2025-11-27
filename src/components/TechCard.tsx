import React from 'react';
interface TechCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  footer?: ReactNode;
  className?: string;
  onClick?: () => void;
}
export function TechCard({
  title,
  description,
  icon,
  footer,
  className = '',
  onClick
}: TechCardProps) {
  return <div className={`bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''} ${className} relative overflow-hidden group`} onClick={onClick}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      {/* Tech corner decoration */}
      <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0L64 0L64 64L0 0Z" fill="rgba(59, 130, 246, 0.05)" />
        </svg>
      </div>
      <div className="p-6 relative z-10">
        {icon && <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform relative overflow-hidden">
            <div className="relative z-10">{icon}</div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
          {title}
        </h3>
        {description && <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
            {description}
          </p>}
      </div>
      {footer && <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-lg relative z-10 group-hover:bg-gray-100 transition-colors">
          {footer}
        </div>}
      {/* Bottom border animation */}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 group-hover:w-full transition-all duration-300"></div>
    </div>;
}