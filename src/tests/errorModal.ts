import { sleep } from '../utils/sleep'
import { getCsrf, getDdos, getDdosId, getNoMahakala, getWrongMahakala } from '../queries/tests'

export const errorModal = async () => {
    const test1 = await getCsrf()
    console.log('test 1:', test1)

    await sleep(100)

    const test2 = await getDdos()
    console.log('test 2:', test2)

    await sleep(100)

    const test3 = await getDdosId()
    console.log('test 3:', test3)

    await sleep(100)

    const test4 = await getNoMahakala()
    console.log('test 4:', test4)

    await sleep(100)

    const test5 = await getWrongMahakala()
    console.log('test 5:', test5)
}
