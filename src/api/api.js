import axiosObj from "./axiosInterceptor"
import urls from "./urls"

export default {
    users: {
        login: {
            loginUser(userInfo) {
                let axiosOpt = {
                    url: urls.users.login,
                    method: "post",
                    data: {
                        email: userInfo.email,
                        password: userInfo.password
                    }
                }
                return axiosObj(axiosOpt)
            }
        }
    }
}