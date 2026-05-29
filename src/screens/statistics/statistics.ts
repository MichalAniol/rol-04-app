namespace statistics {
    const { byId, getPx, setStyle } = dom

    type ElementsT = {
        sheet: HTMLElement | null
        monitor: HTMLCanvasElement | null
        ctx: CanvasRenderingContext2D | null
        legend: HTMLElement | null
        table: HTMLElement | null
        bottom: HTMLElement | null
        tooltip: HTMLElement | null
    }

    export const elements: ElementsT = {
        sheet: null,
        monitor: null,
        ctx: null,
        legend: null,
        table: null,
        bottom: null,
        tooltip: null,
    }


    export const init = async () => {
        elements.sheet = byId('statistics-sheet') as HTMLElement
        elements.monitor = byId('statistics-monitor') as HTMLCanvasElement
        elements.ctx = elements.monitor.getContext('2d')
        elements.table = byId('statistics-table') as HTMLElement
        elements.legend = byId('statistics-colors-legend') as HTMLElement
        elements.bottom = byId('statistics-bottom') as HTMLElement
        elements.tooltip = byId('tooltip') as HTMLElement

        utils.areNotNull(elements, ['screens', 'drawing'])

        await engine.params.updateAnswers()
        draw.init()

        utils.waitFor(() => engine.params.data.answers.length !== 0 && data.steps.used.length !== 0 && elements.legend !== null, legend.setMonitorLegend)()
    }

    export const resize = (w: number, h: number) => {
        data.monitor.width = Math.min((w - 60 - (core.isMobile ? 0 : 220)), 660)

        const menuH = core.isMobile ? (121 / 701) * w : 0
        setStyle(elements.sheet, 'height', `calc(${getPx(h)})`)
        setStyle(elements.bottom, 'height', getPx(menuH))

        draw.resize(w, h)
    }

    export const active = () => {
        utils.waitFor(() => data.monitor.size !== 0, draw.cells)()
        utils.waitFor(() => data.monitor.size !== 0, legend.setData)()

        mouse.active()
    }

    export const deactivate = () => { 
        mouse.deactivate()
    }

    export const firstUse = () => {
        init()
        resize(window.visualViewport.width, window.visualViewport.height)
        draw.cells()
    }
}