import * as React from 'react';

declare module 'recharts' {
  export class Pie extends React.Component<any, any> {}
  export class Bar extends React.Component<any, any> {}
  export class XAxis extends React.Component<any, any> {}
  export class YAxis extends React.Component<any, any> {}
  export class Tooltip extends React.Component<any, any> {}
  export class Legend extends React.Component<any, any> {}
  export class Cell extends React.Component<any, any> {}
}
