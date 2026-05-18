// File: components/WorkflowPipeline.tsx
'use client';

import { WORKFLOW_STEPS } from '@/lib/planning';
import { CheckCircle2, Circle } from 'lucide-react';

export function WorkflowPipeline({ activeStep = 3 }: { activeStep?: number }) {
  const displaySteps = WORKFLOW_STEPS.slice(0, 8);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-[720px] items-start">
        {displaySteps.map((step, i) => {
          const done = i < activeStep;
          const current = i === activeStep;
          return (
            <div key={step.id} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                {i > 0 && (
                  <div className={`h-0.5 flex-1 ${done ? 'bg-blue-500' : 'bg-gray-200'}`} />
                )}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                    done
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : current
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 bg-white text-gray-400'
                  }`}
                >
                  {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
                </div>
                {i < displaySteps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${i < activeStep - 1 ? 'bg-blue-500' : 'bg-gray-200'}`}
                  />
                )}
              </div>
              <p
                className={`mt-2 px-1 text-center text-xs font-medium ${
                  current ? 'text-blue-600' : done ? 'text-gray-700' : 'text-black/50'
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
