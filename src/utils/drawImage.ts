export const drawImage = () => (() => {
    type DataT = {
        canvas: HTMLCanvasElement | null
        ctx: CanvasRenderingContext2D | null
        fitCanvas: HTMLCanvasElement | null
        fitCtx: CanvasRenderingContext2D | null
        fitWidth: number
    }

    const data: DataT = {
        canvas: null,
        ctx: null,
        fitCanvas: null,
        fitCtx: null,
        fitWidth: 0
    }

    const init = (canvas: HTMLCanvasElement, fitCanvas: HTMLCanvasElement,
    ) => {
        data.canvas = canvas
        data.ctx = canvas.getContext('2d')

        data.fitCanvas = fitCanvas
        data.fitCtx = fitCanvas.getContext('2d')
    }

    const setWidth = (width: number) => data.fitWidth = width

    const fitToWidth = (img: HTMLImageElement) => {
        if (!data.fitCanvas || !data.fitCtx) return

        const scale = data.fitWidth / img.width

        const displayWidth = img.width * scale
        const displayHeight = img.height * scale

        const dpr = window.devicePixelRatio || 1

        data.fitCanvas.style.width = displayWidth + 'px'
        data.fitCanvas.style.height = displayHeight + 'px'

        data.fitCanvas.width = displayWidth * dpr
        data.fitCanvas.height = displayHeight * dpr

        data.fitCtx.setTransform(dpr, 0, 0, dpr, 0, 0)

        data.fitCtx.clearRect(
            0,
            0,
            displayWidth,
            displayHeight
        )

        data.fitCtx.drawImage(
            img,
            0,
            0,
            displayWidth,
            displayHeight
        )
    }

    const draw = (() => {
        let currentUrl: string | null = null

        return async (source: Blob | string) => {
            if (!data.ctx || !data.canvas) return

            if (currentUrl) {
                URL.revokeObjectURL(currentUrl)
                currentUrl = null
            }

            const img = new Image()

            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve()
                img.onerror = reject

                if (typeof source === 'string') {
                    img.src = source
                } else {
                    currentUrl = URL.createObjectURL(source)
                    img.src = currentUrl
                }
            })

            // 1. canvas 1:1 (raw)
            data.canvas.width = img.width
            data.canvas.height = img.height

            data.ctx.clearRect(0, 0, img.width, img.height)
            data.ctx.drawImage(img, 0, 0)

            // 2. canvas scaled
            fitToWidth(img)

            if (currentUrl) {
                URL.revokeObjectURL(currentUrl)
                currentUrl = null
            }
        }
    })()

    return {
        init,
        setWidth,
        draw,
    }
})()
