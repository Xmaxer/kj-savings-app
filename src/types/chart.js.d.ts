import {ChartType} from 'chart.js';

declare module 'chart.js' {
    interface Chart{
        pointLineIndicatorDetails: {x: number, y: number, shouldDraw: boolean};
    }
    interface ChartTypeRegistry {
        pointLineIndicator: PointLineIndicatorOptions
    }
    interface PluginOptionsByType<TType extends ChartType> {
        pointLineIndicator?: PointLineIndicatorOptions
    }
}
