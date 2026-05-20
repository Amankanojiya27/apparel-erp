'use client';

import type { OperationBreakdown } from '@/lib/style-types';
import { Gauge, Users, Target, AlertTriangle } from 'lucide-react';

export function OperationBreakdownPanel({ operationBreakdown }: { operationBreakdown?: OperationBreakdown }) {
  if (!operationBreakdown) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
        <Gauge className="mx-auto mb-2 h-8 w-8" />
        <p>Operation breakdown not yet defined</p>
      </div>
    );
  }

  const { operations, lineBalances, totalGarmentSMV, bottleneckOperation } = operationBreakdown;

  const operationsByDepartment = operations.reduce((acc, op) => {
    if (!acc[op.department]) acc[op.department] = [];
    acc[op.department].push(op);
    return acc;
  }, {} as Record<string, typeof operations>);

  const departmentColors: Record<string, string> = {
    cutting: 'bg-blue-100 text-blue-700',
    sewing: 'bg-emerald-100 text-emerald-700',
    washing: 'bg-purple-100 text-purple-700',
    finishing: 'bg-amber-100 text-amber-700',
    packing: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
        <div>
          <p className="text-slate-500">Total Garment SMV</p>
          <p className="text-xl font-bold">{totalGarmentSMV.toFixed(2)} min</p>
        </div>
        <div>
          <p className="text-slate-500">Total Operations</p>
          <p className="text-xl font-bold">{operations.length}</p>
        </div>
        <div>
          <p className="text-slate-500">Production Lines</p>
          <p className="text-xl font-bold">{lineBalances.length}</p>
        </div>
        <div>
          <p className="text-slate-500">Total Operators Required</p>
          <p className="text-xl font-bold">{lineBalances.reduce((sum, lb) => sum + lb.requiredOperators, 0)}</p>
        </div>
      </div>

      {/* Bottleneck Warning */}
      {bottleneckOperation && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <AlertTriangle className="mb-1 inline h-4 w-4" />
          Bottleneck operation: <strong>{bottleneckOperation}</strong>
        </div>
      )}

      {/* Operations by Department */}
      <div className="rounded-lg border border-slate-200 p-4">
        <h3 className="mb-4 font-semibold text-slate-800">Operations by Department</h3>
        <div className="space-y-4">
          {Object.entries(operationsByDepartment).map(([department, deptOps]) => (
            <div key={department}>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-medium capitalize text-slate-700">
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${departmentColors[department]}`}>
                  {department}
                </span>
                <span>({deptOps.length} operations)</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                      <th className="py-2 pr-4">Seq</th>
                      <th className="py-2 pr-4">Operation</th>
                      <th className="py-2 pr-4">SMV (min)</th>
                      <th className="py-2 pr-4">Machine</th>
                      <th className="py-2">Helpers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptOps
                      .sort((a, b) => a.sequence - b.sequence)
                      .map((op) => (
                        <tr key={op.operationId} className="border-b border-slate-100">
                          <td className="py-2 pr-4 font-medium">{op.sequence}</td>
                          <td className="py-2 pr-4 font-medium">{op.operationName}</td>
                          <td className="py-2 pr-4">{op.smv.toFixed(2)}</td>
                          <td className="py-2 pr-4 text-slate-600">{op.machineType}</td>
                          <td className="py-2">{op.helperCount}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Line Balancing */}
      <div className="rounded-lg border border-slate-200 p-4">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
          <Users className="h-4 w-4" />
          Line Balancing
        </h3>
        <div className="space-y-3">
          {lineBalances.map((line) => (
            <div key={line.lineId} className="rounded-lg border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-medium">{line.lineName}</h4>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                  {line.assignedOperations.length} operations
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Total SMV</p>
                  <p className="font-medium">{line.totalSMV.toFixed(2)} min</p>
                </div>
                <div>
                  <p className="text-slate-500">Target Output</p>
                  <p className="font-medium">{line.targetOutputPerHour} pcs/hr</p>
                </div>
                <div>
                  <p className="text-slate-500">Required Operators</p>
                  <p className="font-medium">{line.requiredOperators}</p>
                </div>
                <div>
                  <p className="text-slate-500">Target/Hr/Operator</p>
                  <p className="font-medium">{(line.targetOutputPerHour / line.requiredOperators).toFixed(1)} pcs</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="mb-1 text-xs text-slate-500">Assigned Operations:</p>
                <div className="flex flex-wrap gap-1">
                  {line.assignedOperations.map((opId) => {
                    const op = operations.find((o) => o.operationId === opId);
                    return (
                      <span
                        key={opId}
                        className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                      >
                        {op?.operationName || opId}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
