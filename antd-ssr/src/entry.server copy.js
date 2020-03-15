import createApp from './main';

export default (ctx) => {
    return new Promise((resolve, reject) => {
        const { app, router, store } = createApp();
        router.push(ctx.url);
        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents()
            // if (!matchedComponents.length) {
            //     return reject('没有匹配到到路由')
            // }
            Promise.all(matchedComponents.map(({ asyncData }) => asyncData && asyncData({
                store,
                route: router.currentRoute
            }))).then(() => {
                ctx.state = store.state;
                resolve(app);
            }).catch(reject)

        }, reject)
    });

}