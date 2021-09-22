import Prismic from 'prismic-javascript'
const LRU = require('lru-cache')

// Create cache for Prismic requests
const cache = new LRU({
    max: 50,
    maxAge: 1000 * 60 * 2
})

// helper to init API
const CACHE_TIME = 3 * 60 * 1000
let api, stamp
const getApi = () => {
    const isExpired = new Date().getTime() - stamp > CACHE_TIME
    if (!api || isExpired) {
        stamp = new Date().getTime()
        api = Prismic.api(process.env.PRISMIC_URL)
    }
    return api
}

// Helper to get document(s) by type and
// optionally slug
const fetchPrismicDocByType = async ops => {
    try {
        const key = JSON.stringify(ops)

        // If we have a cached version, return it
        if (cache.get(key)) {
            return cache.get(key)
        }

        const api = await getApi()

        // resolve settings
        const settings = Object.assign(
            {
                type: 'page',
                slug: '',
                pageSize: 40,
                page: 1,
                orderings: ''
            },
            ops
        )

        const predicates = [
            Prismic.Predicates.at('document.type', settings.type)
        ]

        // if slug was specified
        if (settings.slug) {
            const artist = await api.getByUID(settings.type, settings.slug)

            // Set into cache & return
            cache.set(key, artist)
            return artist
        }

        // run query, limit time
        const { results } = await api.query(predicates, {
            pageSize: settings.pageSize,
            page: settings.page,
            orderings: settings.orderings
        })

        // Set into cache & return
        cache.set(key, results)
        return results
    } catch (err) {
        console.log('Error in Prismic fetchPrismicDocByType', ops)
        console.log(err)
        return []
    }
}

export const fetchByID = async ID => {
    const api = await getApi()
    const doc = await api.getByID(ID)
    return doc
}

// Query by type with timeout
export const fetchByType = ops => {
    const TIMEOUT = 12 * 1000
    return Promise.race([
        fetchPrismicDocByType(ops),
        new Promise((resolve, reject) => {
            setTimeout(() => {
                return reject(
                    `Took longer than ${Math.round(
                        TIMEOUT / 1000
                    )} seconds to get data.`
                )
            }, TIMEOUT)
        })
    ]).catch(err => {
        console.log('Error in Prismic fetchByType', ops)
        console.log(err)
    })
}

// Full text search
export const searchDocs = async (s = '', ops = {}) => {
    const api = await getApi()
    const { results } = await api.query(
        [
            Prismic.Predicates.any('document.type', ['work']),
            Prismic.Predicates.fulltext('document', s)
        ],
        Object.assign(
            {
                pageSize: 20,
                page: 0
            },
            ops
        )
    )

    return results
}
