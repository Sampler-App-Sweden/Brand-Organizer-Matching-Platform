import React, { useState } from 'react';
import { DraftProfile, UserRole } from '../../types/profile';
import { ChevronDownIcon, ChevronUpIcon, EditIcon } from 'lucide-react';
interface ProfileSummaryProps {
  profile: DraftProfile | null;
  role: UserRole | null;
}
export function ProfileSummary({
  profile,
  role
}: ProfileSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<DraftProfile | null>(profile);
  if (!profile || !role) return null;
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const toggleEdit = () => {
    if (isEditing) {
      // Save changes
      // In a real implementation, you would call a service to update the draft
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };
  const handleInputChange = (key: string, value: string) => {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      [key]: value
    });
  };
  // Get fields to display based on role
  const getFieldsForRole = () => {
    switch (role) {
      case 'brand':
        return [{
          key: 'companyName',
          label: 'Company Name'
        }, {
          key: 'name',
          label: 'Contact Name'
        }, {
          key: 'email',
          label: 'Email'
        }, {
          key: 'productName',
          label: 'Product'
        }, {
          key: 'productDescription',
          label: 'Description'
        }, {
          key: 'targetAudience',
          label: 'Target Audience'
        }, {
          key: 'productQuantity',
          label: 'Quantity Available'
        }, {
          key: 'marketingGoals',
          label: 'Marketing Goals'
        }, {
          key: 'budget',
          label: 'Budget'
        }];
      case 'organizer':
        return [{
          key: 'organizerName',
          label: 'Organization'
        }, {
          key: 'name',
          label: 'Contact Name'
        }, {
          key: 'email',
          label: 'Email'
        }, {
          key: 'eventName',
          label: 'Event'
        }, {
          key: 'eventDate',
          label: 'Date'
        }, {
          key: 'location',
          label: 'Location'
        }, {
          key: 'audienceDescription',
          label: 'Audience'
        }, {
          key: 'attendeeCount',
          label: 'Expected Attendees'
        }, {
          key: 'sponsorshipNeeds',
          label: 'Sponsorship Needs'
        }];
      case 'community':
        return [{
          key: 'name',
          label: 'Name'
        }, {
          key: 'email',
          label: 'Email'
        }, {
          key: 'age',
          label: 'Age'
        }, {
          key: 'occupation',
          label: 'Occupation'
        }, {
          key: 'location',
          label: 'Location'
        }, {
          key: 'interests',
          label: 'Interests'
        }, {
          key: 'availability',
          label: 'Availability'
        }];
      default:
        return [{
          key: 'name',
          label: 'Name'
        }, {
          key: 'email',
          label: 'Email'
        }];
    }
  };
  const fields = getFieldsForRole();
  // Determine which fields to show in collapsed view
  const collapsedFields = fields.slice(0, 3);
  const expandedFields = fields;
  const displayFields = isExpanded ? expandedFields : collapsedFields;
  return <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-800">Profile Summary</h3>
        <div className="flex space-x-2">
          <button onClick={toggleEdit} className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm">
            <EditIcon className="h-4 w-4 mr-1" />
            {isEditing ? 'Save' : 'Edit'}
          </button>
          <button onClick={toggleExpand} className="text-gray-600 hover:text-gray-800 flex items-center text-sm">
            {isExpanded ? <>
                <ChevronUpIcon className="h-4 w-4 mr-1" />
                Collapse
              </> : <>
                <ChevronDownIcon className="h-4 w-4 mr-1" />
                Expand
              </>}
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayFields.map(field => <div key={field.key} className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">
                {field.label}
              </label>
              {isEditing ? <input type="text" className="border border-gray-300 rounded-md px-3 py-1.5 text-sm" value={editedProfile?.[field.key as keyof DraftProfile] as string || ''} onChange={e => handleInputChange(field.key, e.target.value)} /> : <div className="text-sm text-gray-800">
                  {profile[field.key as keyof DraftProfile] || <span className="text-gray-400 italic">Not provided</span>}
                </div>}
            </div>)}
        </div>
        {!isExpanded && fields.length > collapsedFields.length && <div className="mt-2 text-xs text-gray-500">
            {fields.length - collapsedFields.length} more fields available
          </div>}
      </div>
    </div>;
}