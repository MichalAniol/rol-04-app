namespace tab {
    export namespace simpleMenu {
        export namespace visible {
            const { setStyle, addClass, removeClass, display, add } = dom

            let leftSide: CheckedValuesT = checked.no

            type ShowHideIconT = {
                show: () => void | null
                hide: () => void | null
            }
            const showHideIcon: ShowHideIconT = {
                show: null,
                hide: null
            }

            const moveIconLeft = () => {
                showHideIcon.hide = () => {
                    setStyle(elements.menu, 'borderRadius', '0 30% 0 0')
                    setStyle(elements.menu, 'right', '')
                    setStyle(elements.menu, 'left', '-3%')
                    setStyle(elements.iconHideSvg, 'marginLeft', '0%')
                }
                showHideIcon.show = () => {
                    setStyle(elements.menu, 'borderRadius', '0')
                    setStyle(elements.menu, 'right', '')
                    setStyle(elements.menu, 'left', '0px')
                    setStyle(elements.iconHideSvg, 'marginLeft', '15%')
                }
            }

            const moveIconRight = () => {
                showHideIcon.hide = () => {
                    setStyle(elements.menu, 'borderRadius', '30% 0 0 0')
                    setStyle(elements.menu, 'right', '-3%')
                    setStyle(elements.menu, 'left', '')
                    setStyle(elements.iconHideSvg, 'marginLeft', '15%')
                }
                showHideIcon.show = () => {
                    setStyle(elements.menu, 'borderRadius', '0')
                    setStyle(elements.menu, 'right', '0px')
                    setStyle(elements.menu, 'left', '')
                    setStyle(elements.iconHideSvg, 'marginLeft', '15%')
                }
            }

            const hide = async () => {
                display(elements.iconHide, 'initial')
                display(elements.iconShow, 'none')
                display(elements.list, 'none')
                setStyle(elements.menu, 'width', '17%')
                setStyle(elements.iconShowHide, 'width', '80%')
                if (showHideIcon.hide) showHideIcon.hide()
            }

            const show = async () => {
                display(elements.iconHide, 'none')
                display(elements.iconShow, 'initial')
                display(elements.list, 'flex')
                setStyle(elements.menu, 'width', '100%')
                setStyle(elements.iconShowHide, 'width', '17%')
                if (showHideIcon.show) showHideIcon.show()
            }

            let isVisible = true

            export const menuSide = async (side: CheckedValuesT) => {
                if (side === checked.yes) {
                    addClass(elements.iconShowHide, 'menu-mobile-left-icon')
                    moveIconLeft()
                    elements.items.forEach(i => {
                        setStyle(i, 'borderLeft', '3px solid var(--fourth_from_end_color)')
                        setStyle(i, 'borderRight', '0px solid var(--fourth_from_end_color)')
                    })
                } else {
                    removeClass(elements.iconShowHide, 'menu-mobile-left-icon')
                    moveIconRight()
                    elements.items.forEach(i => {
                        setStyle(i, 'borderLeft', '0px solid var(--fourth_from_end_color)')
                        setStyle(i, 'borderRight', '3px solid var(--fourth_from_end_color)')
                    })
                }

                if (isVisible) {
                    showHideIcon.show()
                } else {
                    showHideIcon.hide()
                }
            }

            export const changeVisibility = () => {
                if (isVisible) {
                    hide()
                    isVisible = false
                } else {
                    show()
                    isVisible = true
                }
            }

            export const init = async () => {
                leftSide = await core.store.get(storageNames.menuLeft) as CheckedValuesT
                menuSide(leftSide)
                add(elements.iconShowHide, 'click', changeVisibility)
            }
        }
    }
}