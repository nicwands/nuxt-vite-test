<template>
    <div :class="classes" :style="styles">
        <!-- header -->
        <site-header />

        <!-- main content -->
        <tv-screen />

        <!-- Page Content -->
        <nuxt />

        <!-- footer -->
        <site-footer />
    </div>
</template>

<script>
import _kebabCase from 'lodash/kebabCase'

export default {
    data() {
        return {
            mounted: false,
        }
    },
    mounted() {
        this.mounted = true
    },
    computed: {
        classes() {
            return [
                'container',
                { mounted: this.mounted },
                _kebabCase(this.$route.name),
                { 'fonts-loading': this.$store.state.browser.fontsLoading },
            ]
        },
        styles() {
            return {
                '--winHeight': this.$store.state.browser.winHeight + 'px',
                '--header-height':
                    this.$store.getters['browser/headerHeight'] + 'px',
            }
        },
    },
}
</script>

<style lang="scss">
.container {
    transition: min-height 150ms linear;
    --winHeight: 100vh;
    min-height: var(--winHeight);
    overflow: hidden;
    position: relative;
    grid-template-rows: 1fr;
    display: grid;

    & > main {
        min-height: var(--winHeight);
    }
}
</style>
