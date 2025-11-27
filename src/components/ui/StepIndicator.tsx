import { Fragment } from 'react'
interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
  className?: string
}
export function StepIndicator({
  currentStep,
  totalSteps,
  labels,
  className = ''
}: StepIndicatorProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className='flex items-center justify-between mb-2'>
        {Array.from({
          length: totalSteps
        }).map((_, index) => (
          <Fragment key={index}>
            {/* Step circle */}
            <div className='flex flex-col items-center'>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  index + 1 < currentStep
                    ? 'border-indigo-500 bg-indigo-500 text-white'
                    : index + 1 === currentStep
                    ? 'border-indigo-500 bg-white text-indigo-500'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {index + 1 < currentStep ? (
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                ) : (
                  <span className='text-sm font-medium'>{index + 1}</span>
                )}
              </div>
              {labels && labels[index] && (
                <span
                  className={`mt-1 text-xs ${
                    index + 1 <= currentStep
                      ? 'text-indigo-600 font-medium'
                      : 'text-gray-500'
                  }`}
                >
                  {labels[index]}
                </span>
              )}
            </div>
            {/* Connector line (except after last step) */}
            {index < totalSteps - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  index + 1 < currentStep ? 'bg-indigo-500' : 'bg-gray-300'
                }`}
              />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
