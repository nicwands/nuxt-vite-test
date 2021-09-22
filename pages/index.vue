<template>
    <main class="front-page">
        <div class="contained">
            <h1>⚡ Nuxt / Vite</h1>
            <prismic-image
                v-bind="settings.temp_merch_image"
                :videoSrc="settings.temp_merch_video.url"
            />
        </div>
    </main>
</template>

<script>
export default {
    computed: {
        settings() {
            return this.$store.state.settings
        },
    },
}
</script>

<style lang="scss">
.front-page {
    .prismic-image {
        width: 50%;
    }
}
</style>
