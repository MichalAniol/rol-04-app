namespace tab {
    // LINK doc\adr\0002.tab-menu.md
    export namespace simpleMenu {
        const { byId, byQuery, byQAll, getPx, setStyle } = dom

        export type ElementsT = {
            menu: HTMLElement | null
        }

        export const elements: ElementsT = {
            menu: null,
        }

        export const resize = () => {
        }

        export const init = () => {

        }
    }
}