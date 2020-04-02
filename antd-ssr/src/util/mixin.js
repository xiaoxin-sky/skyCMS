function getTitle(vm) {
    let path = vm.$route.path;
    let metaTitle = vm.$route.meta.title;
    if (path == '/' || path == '/index' || path == '/index/') {
        return metaTitle;
    } else {
        let { title } = vm.$options
        let contentTitle = typeof title === 'function' ? title.call(vm) : title;
        return `${contentTitle} | ${metaTitle}`
    }
}
const serverTitleMixin = {
    created() {
        this.$ssrContext.title = getTitle(this);
    }
}

const clientTitleMixin = {
    mounted() {
        document.title = getTitle(this);
    }
}

export default process.env.VUE_ENV === 'server'
    ? serverTitleMixin
    : clientTitleMixin
