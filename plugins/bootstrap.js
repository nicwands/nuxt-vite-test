import Vue from 'vue'

export default async ({ $prismic, store, route }, inject) => {
    const settings = await $prismic.api.getSingle('settings')
    if (settings) store.commit('SET_SITE_SETTINGS', settings.data)

    // get all channels
    const allChannels = await $prismic.api.query(
        $prismic.predicates.at('document.type', 'channel'),
        { pageSize: 100 }
    )
    store.commit('SET_ALL_CHANNELS', allChannels.results)
}
