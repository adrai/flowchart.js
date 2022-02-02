declare module "flowchart.js" {
  namespace FlowChart {
    interface SVGOptions {
      x: number;
      y: number;
      "line-width": number;
      "line-length": number;
      "text-margin": number;
      "font-size": number;
      "font-color": string;
      "line-color": string;
      "element-color": string;
      fill: string;
      roundness?: number;
      "yes-text": string;
      "no-text": string;
      "arrow-end": string;
      scale: number;
      class: string;
      [props: string]: any;
    }

    interface DrawOptions extends Partial<SVGOptions> {
      /** Stymbol Styles */
      symbols?: Record<string, Partial<SVGOptions>>;
      /** FlowState config */
      flowstate?: Record<string, Partial<SVGOptions>>;
    }

    interface Instance {
      clean: () => void;
      drawSVG: (container: HTMLElement | string, options?: DrawOptions) => void;
    }
  }

  interface FlowChart {
    parse: (code: string) => FlowChart.Instance;
  }

  const FlowChart: FlowChart;

  export = FlowChart;
}
