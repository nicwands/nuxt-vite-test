const resolver = (doc) => {
    if (doc == undefined) {
        return '/not-found'
    }

    // parse slug
    const slug = doc.uid || doc.slug || _get(doc, 'slugs[0]')

    if (doc.isBroken) {
        return '/not-found'
    }

    // external link
    if (doc.link_type === 'Web') {
        // handle hash links
        if (String(doc.url).match(/:\/\/#/g)) {
            return String(doc.url).replace(/^(http|https):\/\//g, '')
        }

        return doc.url
    }

    // FP & Settings
    if (doc.type == 'front_page') {
        return `/`
    }
    if (doc.type == 'settings') {
        return `/`
    }

    // Tags
    if (doc.type == 'tag') {
        return `/tag/${slug}`
    }

    // Tags
    if (doc.type == 'article') {
        return `/posts/${slug}`
    }

    // generic page
    if (slug) {
        return `/${slug}`
    }

    return '/not-found'
}

export default resolver
