import React from 'react';
import { Star } from 'lucide-react';
import { toggleFeatureStatus } from '../../services/communityService';
interface AdminToggleProps {
  memberId: string;
  isFeatured: boolean;
  onToggle: (featured: boolean) => void;
}
export function AdminToggle({
  memberId,
  isFeatured,
  onToggle
}: AdminToggleProps) {
  const handleToggle = async () => {
    try {
      await toggleFeatureStatus(memberId, !isFeatured);
      onToggle(!isFeatured);
    } catch (error) {
      console.error('Failed to toggle feature status:', error);
    }
  };
  return <button onClick={handleToggle} className={`p-1.5 rounded-full ${isFeatured ? 'bg-yellow-400 text-yellow-800' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`} title={isFeatured ? 'Remove from featured' : 'Add to featured'}>
      <Star className={`h-3.5 w-3.5 ${isFeatured ? 'fill-current' : ''}`} />
    </button>;
}