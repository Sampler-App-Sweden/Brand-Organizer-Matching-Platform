/**
 * Password Strength Indicator Component
 * Shows real-time feedback on password requirements matching Supabase configuration
 */

import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

export const PasswordStrengthIndicator: React.FC<
  PasswordStrengthIndicatorProps
> = ({ password, showRequirements = true }) => {
  const requirements: PasswordRequirement[] = [
    {
      id: 'length',
      label: 'At least 8 characters',
      test: (pwd) => pwd.length >= 8,
      met: password.length >= 8,
    },
    {
      id: 'lowercase',
      label: 'Contains lowercase letter (a-z)',
      test: (pwd) => /[a-z]/.test(pwd),
      met: /[a-z]/.test(password),
    },
    {
      id: 'uppercase',
      label: 'Contains uppercase letter (A-Z)',
      test: (pwd) => /[A-Z]/.test(pwd),
      met: /[A-Z]/.test(password),
    },
    {
      id: 'digit',
      label: 'Contains digit (0-9)',
      test: (pwd) => /[0-9]/.test(pwd),
      met: /[0-9]/.test(password),
    },
  ];

  const metCount = requirements.filter((req) => req.met).length;
  const allMet = metCount === requirements.length;

  // Calculate strength level
  const getStrengthLevel = () => {
    if (metCount === 0) return { label: '', color: '' };
    if (metCount <= 1) return { label: 'Weak', color: 'text-red-600' };
    if (metCount <= 2) return { label: 'Fair', color: 'text-orange-600' };
    if (metCount === 3) return { label: 'Good', color: 'text-yellow-600' };
    return { label: 'Strong', color: 'text-green-600' };
  };

  const strength = getStrengthLevel();

  if (!showRequirements && password.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      {/* Strength indicator bar */}
      {password.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Password strength:</span>
            <span className={`font-medium ${strength.color}`}>
              {strength.label}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                metCount <= 1
                  ? 'bg-red-500'
                  : metCount <= 2
                    ? 'bg-orange-500'
                    : metCount === 3
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
              }`}
              style={{ width: `${(metCount / requirements.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Requirements checklist */}
      {showRequirements && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700">
            Password must contain:
          </p>
          <ul className="space-y-1">
            {requirements.map((req) => (
              <li
                key={req.id}
                className={`text-sm flex items-center gap-2 ${
                  req.met ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                <span className="text-base">
                  {req.met ? '✓' : '○'}
                </span>
                <span>{req.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Note about leaked passwords */}
      {allMet && (
        <p className="text-xs text-gray-500 mt-2">
          Note: Passwords found in data breaches will be rejected
        </p>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
