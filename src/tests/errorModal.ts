namespace tests {
    export const errorModal = async () => {
        const test1 = await queries.test.getCsrf()
        console.log('test 1:', test1)

        await utils.sleep(100)

        const test2 = await queries.test.getDdos()
        console.log('test 2:', test2)

        await utils.sleep(100)

        const test3 = await queries.test.getDdosId()
        console.log('test 3:', test3)

        await utils.sleep(100)

        const test4 = await queries.test.getNoMahakala()
        console.log('test 4:', test4)

        await utils.sleep(100)

        const test5 = await queries.test.getWrongMahakala()
        console.log('test 5:', test5)
    }
}