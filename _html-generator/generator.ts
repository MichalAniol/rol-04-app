const generator = (function () {
    const minify = (code: string) => {
        if (!configuration.minifyFiles) return code

        const stringsToRemove = ['\n', '\r', '  ']

        stringsToRemove.forEach(s => {
            let index = code.indexOf(s)
            while (index > -1) {
                const splitted = code.split(s)
                code = splitted.join(' ')
                index = code.indexOf(s)
            }
        })

        return code
    }

    let css = ''

    const aggregateCss = (myPath: string, $: any) => {
        const linkElements = $('link')

        linkElements.each((index: number, element: any) => {
            const href = element.attribs.href
            // const elementType = element.attribs.type
            const rel = element.attribs.rel

            if (rel === 'stylesheet' && href) {
                const cssPath = `${globalPath}${myPath}//${href}`
                const file = oof.load(cssPath)
                if (file) {
                    const splitted = href.split('/')
                    splitted.pop()

                    let folder = ''
                    for (let i = 0; i < splitted.length; ++i) {
                        folder += `${splitted[i]}${i < splitted.length - 1 ? '\\' : ''}`
                    }

                    const newCss = minify(file.toString())
                    css += ` ${minify(newCss)}`
                    $(element).replaceWith('')
                }
                console.log(`  >> added file: _html\\${href.replace(/\//g, '\\')}`, index + 1, linkElements.length)
            }
        })
    }

    const putSvgToHtmlFile = (myPath: string, $: any) => {
        const imgElements = $('img')

        if (imgElements.length > 0) {
            imgElements.each((index: number, element: any) => {
                const src = element.attribs.src
                if (src.indexOf('.svg') > -1) {
                    const svgPath = `${globalPath}${myPath}//${src}`
                    console.log('%c cssPath:', 'background: #ffcc00; color: #003300', svgPath)
                    const file = oof.load(svgPath)
                    if (file) {
                        const splitted = src.split('/')
                        splitted.pop()

                        let folder = ''
                        for (let i = 0; i < splitted.length; ++i) {
                            folder += `${splitted[i]}${i < splitted.length - 1 ? '\\' : ''}`
                        }
                        console.log('%c folder:', 'background: #ffcc00; color: #003300', folder)

                        const newCode = file.toString()
                        const $$ = cheerio.load(newCode)
                        const svgElement = $$('svg')

                        const attrs = ['xmlns', 'xmlns:svg', 'version', 'id']
                        attrs.forEach(attr => svgElement.removeAttr(attr))

                        const svgBody = $$('body')
                        $(element).replaceWith(svgBody.html())
                        console.log('%c svgBody:', 'background: #ffcc00; color: #003300', svgBody.html())
                    }
                }
            })
        }
    }

    const aggregateFiles = (myPath: string, $: any) => {
        aggregateCss(myPath, $)
        if (configuration.addSvgToHtml) {
            putSvgToHtmlFile(myPath, $)
        }

        const fileElements = $('file')
        let folder = ''
        if (fileElements.length > -1) {
            fileElements.each((index: number, element: any) => {
                const src = element.attribs.src

                if (src) {
                    const file = oof.load(`${globalPath}${myPath}\\${src}`)
                    if (file) {
                        const splitted = src.split('/')
                        splitted.pop()

                        folder = ''
                        for (let i = 0; i < splitted.length; ++i) {
                            folder += `${splitted[i]}${i < splitted.length - 1 ? '\\' : ''}`
                        }

                        const newCode = file.toString()
                        const $$ = cheerio.load(newCode)

                        if (folder.length > 0) {
                            const code = aggregateFiles(`${myPath}\\${folder}`, $$)
                            $(element).replaceWith(minify(code.html()))
                        } else {
                            $(element).replaceWith(minify(newCode))
                        }

                    } else {
                        console.error(`>>>>>>>>>>Błędny "src" do pliku: ${myPath}\\${src}`)
                    }
                    console.log(`  >> added file: ${myPath}\\${src.replace(/\//g, '\\')}`, index + 1, fileElements.length)
                } else {
                    console.error(`Brakuje "src" w pliku: ${myPath}\\${src}`)
                }
            })
        }

        return $
    }


    const start = () => {
        const pathFile = `${globalPath}${configuration.folderPathIn}\\${configuration.htmlStartFile}.html`
        const file = oof.load(pathFile)
        const $ = cheerio.load(file)

        // copyFiles(configuration.folderPathIn, configuration.folderPathOut)
        //     .then(() => console.log('Kopiowanie zakończone!'))
        //     .catch(err => console.error('Błąd:', err))

        aggregateFiles(configuration.folderPathIn, $)

        // Dodaj <link> do <head>, jeśli jeszcze go tam nie ma
        if ($('head link[rel="stylesheet"][href="style.css"]').length === 0) {
            $('head').append('<link rel="stylesheet" href="style.css">')
        }

        const code = ($.html())

        oof.save(`${globalPath}${configuration.folderPathOut}\\index.html`, minify(code))
        oof.save(`${globalPath}${configuration.folderPathOut}\\style.css`, minify(minify(css)))
        console.log(`>>>> Saved!!! file: prod\\index.html`)
        css = ''
    }
    start()

    return { start }
}())
