/// <reference types="vite/client" />

// Esta declaración es necesaria para que TypeScript reconozca JSX
import * as React from 'react';

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }
    interface ElementAttributesProperty {
      props: {};
    }
    interface ElementChildrenAttribute {
      children: {};
    }
    
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Definición para import.meta.env
interface ImportMeta {
  readonly env: {
    readonly VITE_API_URL: string;
    readonly [key: string]: string | undefined;
  };
}