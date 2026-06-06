import { core } from "@/core"
import { add, byId, remove, setStyle } from "@/dom"
import { learningType, storageNames } from "@/storage"
import { areNotNull } from "@/utils/isNotNull"

type ElementsT = {
    btnOne: HTMLButtonElement
    btnThree: HTMLButtonElement
}

export const elements = {} as ElementsT

export const init = async () => {
    elements.btnOne = byId('settings-test-type-one') as HTMLButtonElement
    elements.btnThree = byId('settings-test-type-three') as HTMLButtonElement

    areNotNull(elements, ['screens', 'drawing'])

    const learningTypeMemo = core.store.get(storageNames.learningType)
    activeBtn(learningTypeMemo === learningType.upToThree)
}

const activeBtn = (upToThree: boolean) => {
    if (upToThree) {
        setStyle(elements.btnThree, 'backgroundColor', 'var(--mine_color)')
        setStyle(elements.btnOne, 'backgroundColor', 'var(--mine_5_color)')
    } else {
        setStyle(elements.btnThree, 'backgroundColor', 'var(--mine_5_color)')
        setStyle(elements.btnOne, 'backgroundColor', 'var(--mine_color)')
    }
}

const btnOneClick = () => {
    core.store.set(storageNames.learningType, learningType.upToOne)
    activeBtn(false)
}

const btnThreeClick = () => {
    core.store.set(storageNames.learningType, learningType.upToThree)
    activeBtn(true)
}


export const active = () => {
    add(elements.btnOne, 'click', btnOneClick)
    add(elements.btnThree, 'click', btnThreeClick)
}

export const deactivate = () => {
    remove(elements.btnOne, 'click', btnOneClick)
    remove(elements.btnThree, 'click', btnThreeClick)
}