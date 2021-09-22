export default async function (to, from, savedPosition) {
    // for issue pages, keep scroll behavior
    if (to.name === 'issues-uid' && from.name === 'issues-uid') {
        return
    }

    // for all other pages, wait for transition then scroll to top
    await new Promise((res) => setTimeout(res, 400))
    return { x: 0, y: 0 }
}
