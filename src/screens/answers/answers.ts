import { init as filterInit, active as filterActive, deactivate as filterDeactivate } from './filter/filter'

type ElementsT = {

}

const elements = {} as ElementsT

export const init = () => {
    filterInit()
}

export const active = () => {
    filterActive()
}

export const deactivate = () => {
    filterDeactivate()
}
