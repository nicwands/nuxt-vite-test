<template>
    <section class="layout-slices">
        <components
            v-for="(slice, i) in slices"
            v-bind="slice.primary"
            :is="getCmpType(slice)"
            :items="slice.items"
            :key="i"
        />
    </section>
</template>

<script>
const MAP = {
    // content: 'slice-content',
}

export default {
    components: {
        // SliceContent: () => import('./SliceContent.vue'),
    },
    props: {
        slices: Array,
    },
    methods: {
        getCmpType(slice) {
            if (MAP[slice.slice_type]) return MAP[slice.slice_type]
            return 'div'
        },
    },
}
</script>

<style lang="scss">
.layout-slices {
}
</style>
