import React, { useState } from 'react';
import { DataStory, StoryStep } from '../data/stories';
import { TrendingUp, BarChart3, Scale, Layers } from 'lucide-react';

interface DataStoryChartProps {
  story: DataStory;
  currentStep: StoryStep;
  activeViewOverride?: 'trend' | 'breakdown' | 'impact';
}

export const DataStoryChart: React.FC<DataStoryChartProps> = ({
  story,
  currentStep,
  activeViewOverride,
}) => {
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const activeMode = activeViewOverride || currentStep.chartState.viewMode;

  const { chartData } = story;
  const labels = chartData.labels;
  const primary = chartData.primarySeries;
  const secondary = chartData.secondarySeries;

  // Chart Geometry & Bounds
  const width = 560;
  const height = 320;
  const padding = { top: 35, right: 35, bottom: 45, left: 55 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const allValues = [...primary, ...(secondary || [])];
  const minVal = Math.min(0, Math.floor(Math.min(...allValues)));
  const maxVal = Math.ceil(Math.max(...allValues, chartData.threshold || 0) * 1.15);

  const getX = (index: number) => padding.left + (index / (labels.length - 1)) * chartW;
  const getY = (val: number) => padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  // Create SVG path for primary series
  const primaryPath = primary
    .map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getY(val).toFixed(1)}`)
    .join(' ');

  // Area under curve for primary
  const primaryArea = `${primaryPath} L ${getX(primary.length - 1).toFixed(1)} ${getY(minVal).toFixed(1)} L ${getX(0).toFixed(1)} ${getY(minVal).toFixed(1)} Z`;

  // Secondary path
  const secondaryPath = secondary
    ? secondary
        .map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getY(val).toFixed(1)}`)
        .join(' ')
    : '';

  // Determine active highlighted index based on step
  const activeHighlightIndex = currentStep.chartState.highlightYear
    ? labels.indexOf(String(currentStep.chartState.highlightYear))
    : -1;

  const thresholdY = chartData.threshold !== undefined ? getY(chartData.threshold) : null;

  return (
    <div className="w-full bg-stone-900 border border-stone-800 rounded-xl p-5 text-stone-100 shadow-xl select-none">
      {/* Chart Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400">
              {currentStep.badge} Focus
            </span>
            <span className="text-stone-500" aria-hidden="true">·</span>
            <span className="text-xs text-stone-400">Step {currentStep.stepNumber} of 5</span>
          </div>
          <h4 className="text-base font-semibold text-stone-100 mt-0.5">
            {activeMode === 'trend' && 'Historical Trajectory & Volatility'}
            {activeMode === 'breakdown' && 'Basket & Geographic Contribution'}
            {activeMode === 'impact' && 'Net Real Economic & Planetary Impact'}
          </h4>
        </div>

        {/* View Mode Indicator */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-950/80 rounded-lg border border-stone-800 self-start sm:self-auto text-xs font-mono">
          <span className={`px-2 py-1 rounded flex items-center gap-1 ${activeMode === 'trend' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-stone-500'}`}>
            <TrendingUp className="w-3 h-3" /> Trend
          </span>
          <span className={`px-2 py-1 rounded flex items-center gap-1 ${activeMode === 'breakdown' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-stone-500'}`}>
            <BarChart3 className="w-3 h-3" /> Breakdown
          </span>
          <span className={`px-2 py-1 rounded flex items-center gap-1 ${activeMode === 'impact' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-stone-500'}`}>
            <Scale className="w-3 h-3" /> Impact
          </span>
        </div>
      </div>

      {/* Primary Visual Zone */}
      <div className="py-4">
        {activeMode === 'trend' && (
          <div className="relative">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto overflow-visible"
              aria-label="Interactive Time-Series Trend Chart"
            >
              <defs>
                <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[minVal, minVal + (maxVal - minVal) / 2, maxVal].map((tickVal, i) => {
                const y = getY(tickVal);
                return (
                  <g key={`grid-${i}`}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={width - padding.right}
                      y2={y}
                      stroke="#292524"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding.left - 10}
                      y={y + 4}
                      fill="#78716c"
                      fontSize="11"
                      textAnchor="end"
                      fontFamily="JetBrains Mono"
                      className="tabular-nums"
                    >
                      {tickVal.toFixed(1)}{chartData.unit}
                    </text>
                  </g>
                );
              })}

              {/* Baseline Threshold Line (e.g. 2.0% target or 1.5C breach) */}
              {thresholdY !== null && (
                <g>
                  <line
                    x1={padding.left}
                    y1={thresholdY}
                    x2={width - padding.right}
                    y2={thresholdY}
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                  />
                  <text
                    x={width - padding.right}
                    y={thresholdY - 6}
                    fill="#ef4444"
                    fontSize="10"
                    textAnchor="end"
                    fontFamily="JetBrains Mono"
                    fontWeight="600"
                  >
                    Target / Threshold: {chartData.threshold}{chartData.unit}
                  </text>
                </g>
              )}

              {/* Shaded Area */}
              <path d={primaryArea} fill="url(#primaryGradient)" />

              {/* Secondary series path if present */}
              {secondaryPath && (
                <path
                  d={secondaryPath}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  className="transition-all duration-500"
                />
              )}

              {/* Primary Series Line */}
              <path
                d={primaryPath}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                className="transition-all duration-500"
              />

              {/* Data Points */}
              {primary.map((val, idx) => {
                const cx = getX(idx);
                const cy = getY(val);
                const isStepHighlight = activeHighlightIndex === idx;
                const isHovered = hoveredPointIndex === idx;

                return (
                  <g
                    key={`pt-${idx}`}
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                    className="cursor-pointer"
                  >
                    {isStepHighlight && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="14"
                        fill="#f59e0b"
                        fillOpacity="0.25"
                        className="animate-ping"
                      />
                    )}

                    <circle
                      cx={cx}
                      cy={cy}
                      r={isStepHighlight || isHovered ? 7 : 4.5}
                      fill={isStepHighlight ? '#f59e0b' : '#1c1917'}
                      stroke="#f59e0b"
                      strokeWidth={isStepHighlight ? 3 : 2}
                      className="transition-all duration-200"
                    />

                    {/* Step highlight ring */}
                    {isStepHighlight && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="10"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="1.5"
                      />
                    )}
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {labels.map((year, idx) => {
                const x = getX(idx);
                const isStepHighlight = activeHighlightIndex === idx;
                return (
                  <text
                    key={`lbl-${year}`}
                    x={x}
                    y={height - padding.bottom + 22}
                    fill={isStepHighlight ? '#fbbf24' : '#a8a29e'}
                    fontSize="11"
                    fontWeight={isStepHighlight ? '600' : '400'}
                    textAnchor="middle"
                    fontFamily="JetBrains Mono"
                  >
                    {year}
                  </text>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPointIndex !== null && (
              <div 
                className="absolute top-2 right-2 bg-stone-950/95 border border-stone-700 px-3 py-2 rounded text-xs shadow-lg font-mono pointer-events-none"
              >
                <div className="text-amber-400 font-semibold">{labels[hoveredPointIndex]}</div>
                <div className="text-stone-200">
                  {chartData.primaryLabel}: <span className="text-white font-bold">{primary[hoveredPointIndex]}{chartData.unit}</span>
                </div>
                {secondary && (
                  <div className="text-sky-300">
                    {chartData.secondaryLabel}: {secondary[hoveredPointIndex]}{chartData.unit}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeMode === 'breakdown' && (
          <div className="space-y-3.5 py-2">
            <p className="text-xs text-stone-400 font-mono mb-2">
              Relative variance across critical components (indexed against baseline):
            </p>
            {chartData.breakdownCategories?.map((item, idx) => {
              const absVal = Math.abs(item.value);
              const maxCatVal = Math.max(...(chartData.breakdownCategories?.map((c) => Math.abs(c.value)) || [50]));
              const barWidth = Math.min(100, (absVal / maxCatVal) * 100);
              const isPositive = item.value >= 0;

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-stone-200">{item.category}</span>
                    <span className={`font-mono ${isPositive ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {item.delta}
                    </span>
                  </div>
                  <div className="h-3 w-full bg-stone-950 rounded-full overflow-hidden border border-stone-800 flex">
                    <div
                      className={`h-full transition-all duration-700 ease-out rounded-full ${
                        isPositive ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeMode === 'impact' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-lg">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Cumulative Real Magnitude
              </span>
              <div className="text-3xl font-serif font-bold text-amber-400 tracking-tight">
                {currentStep.dataCallout.value}
              </div>
              <p className="text-xs text-stone-300 mt-2">
                {currentStep.dataCallout.change}
              </p>
              <div className="mt-3 pt-3 border-t border-stone-800/80 text-[11px] text-stone-400">
                Source: Bureau of Labor Statistics & Global Climate Modeling Registry.
              </div>
            </div>

            <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-lg">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Structural Realignment
              </span>
              <div className="text-2xl font-serif font-semibold text-stone-200">
                {story.id === 'story-inflation' ? 'Permanent Base Step' : 'Thermal Lag Effect'}
              </div>
              <p className="text-xs text-stone-300 mt-2">
                {story.id === 'story-inflation'
                  ? 'Nominal wage increases of +18.4% failed to fully outpace essentials, leaving consumer sentiment compressed.'
                  : 'Deep ocean heat content guarantees ongoing shelf grounding melt even if atmospheric levels stabilize immediately.'}
              </p>
              <div className="mt-3 pt-3 border-t border-stone-800/80 text-[11px] font-mono text-amber-400">
                Data verification: High Confidence (98%)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend / Footnote */}
      <div className="pt-3 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-500 inline-block rounded" />
            <span>{chartData.primaryLabel}</span>
          </div>
          {chartData.secondaryLabel && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-sky-400 inline-block rounded border-dashed" />
              <span>{chartData.secondaryLabel}</span>
            </div>
          )}
        </div>
        <div className="font-mono text-[11px] text-stone-500">
          Scroll steps to advance interactive analysis
        </div>
      </div>
    </div>
  );
};
