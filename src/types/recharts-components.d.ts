// Declaraciones de tipos para los componentes de Recharts
declare module 'recharts' {
  import * as React from 'react';

  export interface PieProps {
    data?: any[];
    dataKey?: string;
    nameKey?: string;
    cx?: string | number;
    cy?: string | number;
    startAngle?: number;
    endAngle?: number;
    innerRadius?: number | string;
    outerRadius?: number | string;
    fill?: string;
    label?: React.ReactNode | Function;
    labelLine?: React.ReactNode | Function | boolean;
    paddingAngle?: number;
    children?: React.ReactNode;
    onMouseEnter?: Function;
    onMouseLeave?: Function;
    onClick?: Function;
    isAnimationActive?: boolean;
    animationBegin?: number;
    animationDuration?: number;
    animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  }

  export class Pie extends React.Component<PieProps> {}

  export interface CellProps {
    fill?: string;
    stroke?: string;
    key?: string | number;
  }

  export class Cell extends React.Component<CellProps> {}

  export interface TooltipProps {
    content?: React.ReactElement | React.StatelessComponent | Function;
    viewBox?: { x?: number, y?: number, width?: number, height?: number };
    active?: boolean;
    separator?: string;
    formatter?: Function;
    offset?: number;
    itemStyle?: Object;
    labelStyle?: Object;
    wrapperStyle?: Object;
    cursor?: boolean | Object | React.ReactElement;
    coordinate?: { x: number, y: number };
    position?: { x: number, y: number };
    label?: string | number;
    payload?: Array<{ name: string, value: string | number, unit: string }>;
  }

  export class Tooltip extends React.Component<TooltipProps> {}

  export interface LegendProps {
    width?: number;
    height?: number;
    layout?: 'horizontal' | 'vertical';
    align?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    iconSize?: number;
    iconType?: 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye';
    payload?: Array<{ value: string, id: string, type: string, color: string }>;
    formatter?: Function;
    onClick?: Function;
    onMouseEnter?: Function;
    onMouseLeave?: Function;
    content?: React.ReactElement | React.StatelessComponent;
    wrapperStyle?: Object;
  }

  export class Legend extends React.Component<LegendProps> {}

  export interface XAxisProps {
    hide?: boolean;
    dataKey?: string;
    xAxisId?: string | number;
    width?: number;
    height?: number;
    orientation?: 'bottom' | 'top';
    type?: 'number' | 'category';
    allowDecimals?: boolean;
    allowDataOverflow?: boolean;
    tickCount?: number;
    domain?: Array<string | number | 'auto' | 'dataMin' | 'dataMax'>;
    interval?: number | 'preserveStart' | 'preserveEnd' | 'preserveStartEnd';
    padding?: { left?: number, right?: number };
    minTickGap?: number;
    axisLine?: boolean | Object;
    tickLine?: boolean | Object;
    tickSize?: number;
    tickFormatter?: Function;
    ticks?: Array<any>;
    tick?: boolean | React.ReactElement | Function;
    mirror?: boolean;
    reversed?: boolean;
    label?: string | number | React.ReactElement | Function;
    scale?: 'auto' | 'linear' | 'pow' | 'sqrt' | 'log' | 'identity' | 'time' | 'band' | 'point' | 'ordinal' | 'quantile' | 'quantize' | 'utc' | 'sequential' | 'threshold';
    unit?: string | number;
    name?: string | number;
    onClick?: Function;
    onMouseDown?: Function;
    onMouseUp?: Function;
    onMouseMove?: Function;
    onMouseOver?: Function;
    onMouseOut?: Function;
    onMouseEnter?: Function;
    onMouseLeave?: Function;
  }

  export class XAxis extends React.Component<XAxisProps> {}

  export interface YAxisProps {
    hide?: boolean;
    dataKey?: string;
    yAxisId?: string | number;
    width?: number;
    height?: number;
    orientation?: 'left' | 'right';
    type?: 'number' | 'category';
    domain?: Array<string | number | 'auto' | 'dataMin' | 'dataMax'>;
    tickCount?: number;
    interval?: number | 'preserveStart' | 'preserveEnd' | 'preserveStartEnd';
    allowDecimals?: boolean;
    allowDataOverflow?: boolean;
    padding?: { top?: number, bottom?: number };
    minTickGap?: number;
    axisLine?: boolean | Object;
    tickLine?: boolean | Object;
    tickSize?: number;
    tickFormatter?: Function;
    ticks?: Array<any>;
    tick?: boolean | React.ReactElement | Function;
    mirror?: boolean;
    reversed?: boolean;
    label?: string | number | React.ReactElement | Function;
    scale?: 'auto' | 'linear' | 'pow' | 'sqrt' | 'log' | 'identity' | 'time' | 'band' | 'point' | 'ordinal' | 'quantile' | 'quantize' | 'utc' | 'sequential' | 'threshold';
    unit?: string | number;
    name?: string | number;
    onClick?: Function;
    onMouseDown?: Function;
    onMouseUp?: Function;
    onMouseMove?: Function;
    onMouseOver?: Function;
    onMouseOut?: Function;
    onMouseEnter?: Function;
    onMouseLeave?: Function;
  }

  export class YAxis extends React.Component<YAxisProps> {}

  export interface BarProps {
    dataKey: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    xAxisId?: string | number;
    yAxisId?: string | number;
    name?: string | number;
    barSize?: number;
    maxBarSize?: number;
    shape?: React.ReactElement | Function;
    stackId?: string | number;
    minPointSize?: number;
    background?: React.ReactElement | Function | Object;
    unit?: string | number;
    isAnimationActive?: boolean;
    animationBegin?: number;
    animationDuration?: number;
    animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
    onAnimationStart?: Function;
    onAnimationEnd?: Function;
    onClick?: Function;
    onMouseDown?: Function;
    onMouseUp?: Function;
    onMouseMove?: Function;
    onMouseOver?: Function;
    onMouseOut?: Function;
    onMouseEnter?: Function;
    onMouseLeave?: Function;
  }

  export class Bar extends React.Component<BarProps> {}

  export interface PieChartProps {
    width?: number;
    height?: number;
    margin?: { top?: number, right?: number, bottom?: number, left?: number };
    onClick?: Function;
    onMouseEnter?: Function;
    onMouseLeave?: Function;
    onMouseMove?: Function;
    onMouseDown?: Function;
    onMouseUp?: Function;
    children?: React.ReactNode;
  }

  export class PieChart extends React.Component<PieChartProps> {}

  export interface BarChartProps {
    width?: number;
    height?: number;
    data?: Array<Object>;
    layout?: 'horizontal' | 'vertical';
    barCategoryGap?: number | string;
    barGap?: number | string;
    barSize?: number;
    maxBarSize?: number;
    stackOffset?: 'expand' | 'none' | 'wiggle' | 'silhouette' | 'sign';
    margin?: { top?: number, right?: number, bottom?: number, left?: number };
    onClick?: Function;
    onMouseEnter?: Function;
    onMouseLeave?: Function;
    onMouseMove?: Function;
    onMouseDown?: Function;
    onMouseUp?: Function;
    reverseStackOrder?: boolean;
    children?: React.ReactNode;
  }

  export class BarChart extends React.Component<BarChartProps> {}

  export interface ResponsiveContainerProps {
    aspect?: number;
    width?: string | number;
    height?: string | number;
    minWidth?: string | number;
    minHeight?: string | number;
    maxHeight?: number;
    children?: React.ReactNode;
    debounce?: number;
    id?: string;
    className?: string;
  }

  export class ResponsiveContainer extends React.Component<ResponsiveContainerProps> {}
}
