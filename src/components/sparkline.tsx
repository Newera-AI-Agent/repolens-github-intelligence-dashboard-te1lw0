interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  ariaLabel?: string;
}

export function Sparkline({ 
  data, 
  color = 'currentColor',
  width = 200,
  height = 60,
  className = '',
  ariaLabel = 'Activity chart'
}: SparklineProps) {
  if (data.length === 0) {
    return (
      <div className={`w-full h-${height / 4} ${className}`} aria-hidden="true">
        <div className="w-full h-full bg-muted/20 dark:bg-muted/10 rounded" />
      </div>
    );
  }

  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const stepX = width / (data.length - 1 || 1);
  const paddingTop = 4;
  const paddingBottom = 4;
  const chartHeight = height - paddingTop - paddingBottom;

  const pathData = data
    .map((value, index) => {
      const x = index * stepX;
      const y = paddingTop + chartHeight - ((value - min) / (max - min || 1)) * chartHeight;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  // Area path
  const areaPathData = [
    `M 0 ${height}`, 
    ...data.map((value, index) => {
      const x = index * stepX;
      const y = paddingTop + chartHeight - ((value - min) / (max - min || 1)) * chartHeight;
      return `L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }),
    `L ${width} ${height} Z`
  ].join(' ');

  return (
    <div className={className} aria-hidden="true">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={ariaLabel}
        className="w-full h-auto"
      >
        <defs>
          <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={areaPathData}
          fill="url(#sparkline-gradient)"
          stroke="none"
        />
        <path
          d={pathData}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="drop-shadow(0 0 4px currentColor)"
        />
        {/* Last point indicator */}
        {data.length > 0 && (
          <circle
            cx={(data.length - 1) * stepX}
            cy={paddingTop + chartHeight - ((data[data.length - 1] - min) / (max - min || 1)) * chartHeight}
            r="3"
            fill={color}
            stroke="white"
            strokeWidth="2"
          />
        )}
      </svg>
    </div>
  );
}

// Multi-series sparkline for comparison
interface MultiSparklineProps {
  series: Array<{
    data: number[];
    color: string;
    label: string;
  }>;
  width?: number;
  height?: number;
  className?: string;
  ariaLabel?: string;
}

export function MultiSparkline({ 
  series, 
  width = 200,
  height = 60,
  className = '',
  ariaLabel = 'Comparison chart'
}: MultiSparklineProps) {
  if (series.length === 0 || series.every(s => s.data.length === 0)) {
    return (
      <div className={`w-full h-${height / 4} ${className}`} aria-hidden="true">
        <div className="w-full h-full bg-muted/20 dark:bg-muted/10 rounded" />
      </div>
    );
  }

  const allData = series.flatMap(s => s.data);
  const max = Math.max(...allData, 1);
  const min = Math.min(...allData);
  const maxLen = Math.max(...series.map(s => s.data.length));
  const stepX = width / (maxLen - 1 || 1);
  const paddingTop = 4;
  const paddingBottom = 4;
  const chartHeight = height - paddingTop - paddingBottom;

  return (
    <div className={className} aria-hidden="true">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={ariaLabel}
        className="w-full h-auto"
      >
        {series.map((s, seriesIndex) => {
          if (s.data.length === 0) return null;
          
          const pathData = s.data
            .map((value, index) => {
              const x = index * stepX;
              const y = paddingTop + chartHeight - ((value - min) / (max - min || 1)) * chartHeight;
              return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
            })
            .join(' ');

          return (
            <g key={seriesIndex}>
              <path
                d={pathData}
                stroke={s.color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.8"
              />
              {/* Last point */}
              <circle
                cx={(s.data.length - 1) * stepX}
                cy={paddingTop + chartHeight - ((s.data[s.data.length - 1] - min) / (max - min || 1)) * chartHeight}
                r="2.5"
                fill={s.color}
                stroke="white"
                strokeWidth="1.5"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
