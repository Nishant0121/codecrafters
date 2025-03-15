import React from "react";

// List of props that should not be passed to native DOM/SVG elements
const invalidProps = [
  "formatter",
  "dataKey",
  "axisLine",
  "tickFormatter",
  "activeDot",
  "innerRadius",
  "outerRadius",
  "paddingAngle",
];

// Helper function to filter out invalid props
const filterProps = (props) => {
  const filtered = { ...props };
  invalidProps.forEach((key) => {
    if (filtered.hasOwnProperty(key)) {
      delete filtered[key];
    }
  });
  return filtered;
};

export const AreaChart = ({ children, ...props }) => {
  return (
    <g className="area-chart" {...filterProps(props)}>
      {children}
    </g>
  );
};

export const Bar = ({ ...props }) => {
  return <rect className="bar" {...filterProps(props)} />;
};

export const CartesianGrid = ({ ...props }) => {
  return <g className="cartesian-grid" {...filterProps(props)} />;
};

export const Cell = ({ ...props }) => {
  return <rect className="cell" {...filterProps(props)} />;
};

export const Line = ({ ...props }) => {
  return <path className="line" {...filterProps(props)} />;
};

export const LineChart = ({ children, ...props }) => {
  return (
    <svg className="line-chart" {...filterProps(props)}>
      {children}
    </svg>
  );
};

export const ResponsiveContainer = ({ children, ...props }) => {
  return (
    <div
      className="responsive-container"
      style={{ width: "100%", height: "100%" }}
      {...filterProps(props)}
    >
      {children}
    </div>
  );
};

export const TickLabels = ({ ...props }) => {
  return <text className="tick-labels" {...filterProps(props)} />;
};

export const Tooltip = ({ content: Content, ...props }) => {
  return (
    <div className="tooltip" {...filterProps(props)}>
      {Content && (React.isValidElement(Content) ? Content : <Content />)}
    </div>
  );
};

export const TooltipContent = ({ children, ...props }) => {
  return (
    <div className="tooltip-content" {...filterProps(props)}>
      {children}
    </div>
  );
};

export const XAxis = ({ children, ...props }) => {
  return (
    <g className="x-axis" {...filterProps(props)}>
      {children}
    </g>
  );
};

export const YAxis = ({ children, ...props }) => {
  return (
    <g className="y-axis" {...filterProps(props)}>
      {children}
    </g>
  );
};

export const PieChart = ({ children, ...props }) => {
  return (
    <svg className="pie-chart" {...filterProps(props)}>
      {children}
    </svg>
  );
};

export const Pie = ({ ...props }) => {
  return <path className="pie" {...filterProps(props)} />;
};

export const Legend = ({ ...props }) => {
  return <div className="legend" {...filterProps(props)} />;
};

export const BarChart = ({ children, ...props }) => {
  return (
    <svg className="bar-chart" {...filterProps(props)}>
      {children}
    </svg>
  );
};

export const ChartContainer = ({ children, ...props }) => {
  return (
    <svg className="chart-container" {...filterProps(props)}>
      {children}
    </svg>
  );
};
