namespace dom {
    export const root = document.documentElement

    export const byId = (id: string): HTMLElement | HTMLTextAreaElement | null => {
        return document.getElementById(id) as HTMLElement | HTMLTextAreaElement | null;
    }
    export const byQuery = (query: string) => document.querySelector(query)
    export const byQueryAll = (query: string) => document.querySelectorAll(query)
    export const byQ = (elem: HTMLElement | HTMLInputElement | HTMLButtonElement, query: string) => elem.querySelector(query)
    export const byQAll = (elem: HTMLElement | HTMLInputElement | HTMLButtonElement, query: string) => elem.querySelectorAll(query)

    export const getPx = (num: number) => `${num}px`
    export const inner = (elem: HTMLElement, txt: string) => elem.innerHTML = txt

    export type RecursiveHTMLElement<T> = {
        [K in keyof T]:
        T[K] extends string
        ? HTMLElement | HTMLTextAreaElement | null
        : T[K] extends string[]
        ? (HTMLElement | HTMLTextAreaElement | null)[]
        : T[K] extends object
        ? RecursiveHTMLElement<T[K]>
        : never;
    }

    export const getAllById = <T extends Record<string, any>>(obj: T): RecursiveHTMLElement<T> => {
        const results = {} as RecursiveHTMLElement<T>;

        Object.keys(obj).forEach((key) => {
            const value = obj[key];

            if (typeof value === "string") {
                results[key as keyof T] = byId(value) as RecursiveHTMLElement<T>[keyof T];
            } else if (Array.isArray(value)) {
                results[key as keyof T] = value.map(id => byId(id)) as RecursiveHTMLElement<T>[keyof T];
            } else if (typeof value === "object" && value !== null) {
                results[key as keyof T] = getAllById(value) as RecursiveHTMLElement<T>[keyof T];
            }
        });

        return results;
    }

    export const prepare = (node: Element | HTMLElement | HTMLImageElement | string, options?: {
        delete?: boolean,
        id?: string,
        classes?: string[],
        children?: HTMLElement[],
        src?: string,
        inner?: string,
        position?: { x: number, y: number },
    }) => {
        const elem: Element | HTMLElement | HTMLImageElement =
            typeof node === "string" ? document.createElement(node) : node

        if (elem && elem instanceof HTMLElement) {
            if (options.delete) {
                elem.remove()
                return
            }

            if (options?.id) elem.id = options.id
            options?.classes?.forEach((c) => elem.classList.add(c))
            options?.children?.forEach((c) => elem.appendChild(c))

            if (options?.src && elem instanceof HTMLImageElement) {
                elem.src = options.src
            }
            if (options?.inner) {
                elem.textContent = options.inner
            }
            if (options?.position) {
                elem.style.left = `${options.position.x}px`
                elem.style.top = `${options.position.y}px`
            }

            return elem
        }
    }

    export type ModifiableCSSProperties = {
        [K in keyof CSSStyleDeclaration as
        CSSStyleDeclaration[K] extends (...args: any[]) => any ? never : K
        ]: string;
    } & {
        [customProp: `--${string}`]: string
    }


    export const setStyle = (
        element: HTMLElement,
        style: keyof ModifiableCSSProperties,
        value: string
    ) => {
        element.style[style as any] = value
    }

    export type StyleT = [element: HTMLElement, attribute: keyof ModifiableCSSProperties, value: string]
    export type StylesT = StyleT[]
    export const setAllStyles = (styles: StylesT) => styles.forEach((s: StyleT) => setStyle(s[0], s[1], s[2]))

    export type AttributeNamesT = 'x' | 'y' | 'width' | 'height' | 'fill' | 'stroke' | 'stroke-width' | 'viewBox' | 'data-theme'
    export const setAttribute = (element: Element | HTMLElement | SVGRectElement, attribute: AttributeNamesT, value: string) => element.setAttribute(attribute as any, value)

    export type AttributeT = [element: Element | HTMLElement | SVGRectElement, attribute: AttributeNamesT, value: string]
    export type AttributesT = AttributeT[]
    export const setAllAttributes = (attributes: AttributesT) => attributes.forEach((a: AttributeT) => a[0].setAttribute(a[1], a[2]))

    export const disable = (elem: HTMLElement | HTMLInputElement | HTMLButtonElement) => elem.setAttribute('disabled', '')
    export const enable = (elem: HTMLElement | HTMLInputElement | HTMLButtonElement) => elem.removeAttribute('disabled')

    export const check = (elem: HTMLInputElement) => elem.checked = true
    export const uncheck = (elem: HTMLInputElement) => elem.checked = false

    export const display = (elem: HTMLElement | HTMLInputElement | HTMLButtonElement, attribute: string) =>
        elem.style.display = attribute
    export const setColor = (elem: HTMLElement | HTMLInputElement | HTMLButtonElement, color: string) =>
        elem.style.color = color
    export const removeClass = (elem: HTMLElement | HTMLInputElement | HTMLButtonElement, attribute: string) =>
        elem.classList.remove(attribute)
    export const addClass = (elem: HTMLElement | HTMLInputElement | HTMLButtonElement, attribute: string) =>
        elem.classList.add(attribute)

    export const colors = {
        line: 'var(--line_color)',
        prime: 'var(--prime_color)',
        off1: 'var(--off_prime_color)',
        off2: 'var(--off_second_color)',
    } as const

    export type EventNamesT = 'click' | 'input' | 'did-finish-load' | 'console-message' | 'keydown' | 'touchstart' | 'touchmove' | 'touchend' | 'DOMContentLoaded' | 'change'
    export const add = (elem: Document | HTMLElement | HTMLInputElement | HTMLButtonElement, name: EventNamesT, fn: EventListenerOrEventListenerObject) => elem.addEventListener(name, fn)

    export const remove = (elem: Document | HTMLElement | HTMLInputElement | HTMLButtonElement, name: EventNamesT, fn: EventListenerOrEventListenerObject) => elem.removeEventListener(name, fn)

    export const xmlns = 'http://www.w3.org/2000/svg'
    export type NsNamesT = 'rect'
    export const newNS = (name: NsNamesT) => document.createElementNS(xmlns, 'rect')
}