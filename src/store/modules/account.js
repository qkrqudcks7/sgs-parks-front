export default {
    namespaced: true,
    state: {
        user: undefined,
        authToken: undefined
    },
    getters: {
        authToken: state => {
          return state.authToken
        },
        user: state => {
            if (!state.user) {
                try {
                    const user = localStorage.getItem("user")
                    if (user) {
                        state.user = JSON.parse(user)
                    }
                } catch (e) {
                    console.error(e)
                }
            }
            return state.user
        }
    },
    mutations: {
        setAuthToken(state,authToken) {
            state.authToken = authToken
        },
        setUser(state,user) {
            state.user = user
            localStorage.setItem("user",JSON.stringify(user))
        },
        resetAccount(state) {
            localStorage.removeItem("user")
            Object.assign(state, {user: undefined, authToken: undefined})
        }
    }
}