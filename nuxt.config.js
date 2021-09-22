const dotenv = require('dotenv')
dotenv.config()

const universal = {
    /*
     * Build settings
     */
    buildModules: ['nuxt-vite'],
    components: ['~/components'],
    build: {
        html: {
            minify: {
                minifyCSS: false,
                minifyJS: false,
            },
        },
    },

    /*
     * Global CSS
     */
    css: ['~/assets/scss/_base.scss'],

    /*
     * Env variables
     */
    env: {
        ...process.env,
    },

    /*
     * Head
     */
    head: {
        htmlAttrs: {
            lang: 'en',
        },
        title: 'Nuxt Vite',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
        ],
        link: [
            { rel: 'icon', href: '/images/favicon.svg' },
            { rel: 'stylesheet', href: '/fonts/fonts.css' },
        ],
    },

    /*
     * Loading bar
     */
    loading: false,

    /*
     * Build & target
     */
    target: 'static',

    /*
     * Modules
     */
    modules: [
        '@nuxtjs/style-resources',
        '@nuxtjs/component-cache',
        '@nuxtjs/prismic',
        // '@nuxtjs/gtm',
    ],

    // gtm: {
    //     id: 'GTM-P9TGQDN',
    // },

    /*
     * Prismic Config
     */
    prismic: {
        endpoint: `https://${process.env.PRISMIC_REPO_NAME}.cdn.prismic.io/api/v2`,
        modern: true,
        linkResolver: '~/libs/prismic/linkResolver',
        htmlSerializer: '~/libs/prismic/htmlSerializer',
        components: false,
    },

    /*
     * Plugins
     */
    plugins: [
        '~/plugins/bootstrap',
        { src: '~/plugins/prismicLinks', ssr: false },
        { src: '~/plugins/browser', ssr: false },
    ],

    /*
     * Router
     */
    router: {
        middleware: ['updateRoute'],
    },

    /*
     * Static Site Generation
     */
    generate: {
        fallback: true,
    },

    /*
     * Style resources
     */
    styleResources: {
        scss: ['~/assets/scss/_vars.scss'],
    },

    vue: {
        config: {
            ignoredElements: ['shader-doodle'],
        },
    },
}

/*
 * Dev-only config
 */
const dev = {
    /*
     * Webpack build options
     */
    build: {
        ...universal.build,
        analyze: false,
    },
}

/*
 * Prod-only config
 */
const prod = {
    /*
     * Server middleware
     */
    // serverMiddleware: ['redirect-ssl']
}

module.exports = {
    ...universal,
    ...(process.env.NODE_ENV === 'development' ? dev : prod),
}
