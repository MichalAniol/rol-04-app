import { checked, storageNames } from '@/storage'
import { menuSide } from '../../../tab/simpleMenu/visible'
import { getRadio, RadioDataT, RatioT } from '../../../utils/radio'

const ids = {
    prefix: 'setting-menu-',
    side: {
        right: 'right',
        left: 'left',
    },
}

const valuesList = [checked.no, checked.yes]

// @ts-ignore
const menuNames = Object.values(ids.side) as const

const controlMenuData: RadioDataT = {
    prefix: ids.prefix,
    storeName: storageNames.menuLeft,
    elementList: menuNames,
    nameList: valuesList,
    clickList: [],
}

export let menuRatio: RatioT

export const init = () => {
    controlMenuData.clickList = [
        () => menuSide(checked.no),
        () => menuSide(checked.yes),
    ]
    menuRatio = getRadio(controlMenuData)
    menuRatio.init()
}
