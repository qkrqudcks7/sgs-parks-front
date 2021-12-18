function loadGuard(router,store) {
    router.beforeEach((to,from,next) => {
        if ((from.path === "/" && to.path === "/login") || (from.path === "/" && to.path === "/")) {
            next()
        } else {
            const token = store.getters["account/authToken"]
            console.log(token)

            if (to.params?.message === "resetStore") {
                if (to.params?.type === "logout") {
                    next({name: "로그인", params: {message: "logOut"}})
                } else if (to.params?.type === "sessionOut") {
                    next({name: "로그인", params: {message: "sessionOut"}})
                }
                clearStore();
            } else if (token === undefined) {
                console.log("2")
                next({name: "로그인", params: {message: "sessionOut"}})
                clearStore()
            } else {
                next()
            }
        }
        function clearStore() {
            store.commit("account/resetAccount")
        }
    })
}

export { loadGuard }