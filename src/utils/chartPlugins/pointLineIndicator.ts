import {type Plugin} from "chart.js";

interface PointLineIndicatorOptions {
    width: number;
    color: string;
    dash?: [number, number];
}

const defaults: PointLineIndicatorOptions = {
    width: 1,
    color: '#FF4949',
    dash: undefined,
}

const pointLineIndicatorPlugin: Plugin<'pointLineIndicator', PointLineIndicatorOptions> = {
    id: 'pointLineIndicator',
    defaults: defaults,
    afterInit: (chart, args, opts) => {
        chart.pointLineIndicatorDetails = {
            x: 0,
            y: 0,
            shouldDraw: false
        }
    },
    // beforeBuildTicks(chart, args, options) {
    //     console.log(args)
    // },
    afterEvent: (chart, args) => {
        // console.log(args.event.type)
        const {inChartArea} = args
        const {x,y} = args.event

        chart.pointLineIndicatorDetails = {x: x as number, y: y as number, shouldDraw: inChartArea}
        chart.draw()
    },
    beforeDatasetsDraw: (chart, args, opts) => {

        const {ctx} = chart
        const {top, bottom, left, right} = chart.chartArea
        const {x, y, shouldDraw} = chart.pointLineIndicatorDetails
        if (!shouldDraw) return

        ctx.save()

        ctx.beginPath()
        ctx.lineWidth = opts.width
        ctx.strokeStyle = opts.color
        if(opts.dash) {
            ctx.setLineDash(opts.dash)
        }
        ctx.moveTo(x, bottom)
        ctx.lineTo(x, top)
        ctx.moveTo(left, y)
        ctx.lineTo(right, y)
        ctx.stroke()

        ctx.restore()
    }
}

export default pointLineIndicatorPlugin
