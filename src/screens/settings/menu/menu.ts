namespace settings {
    export namespace menu {
        const { byId, byQuery, getPx, setStyle } = dom

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
        }

        export let menuRatio: RatioT

        export const init = () => {
            controlMenuData.clickList = [
                () => tab.simpleMenu.visible.menuSide(checked.no),
                () => tab.simpleMenu.visible.menuSide(checked.yes),
            ]
            menuRatio = utils.getRadio(controlMenuData)
            menuRatio.init()
        }
    }
}