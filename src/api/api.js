import axiosObj from "./axiosInterceptor"
import urls from "./urls"

export default {
    users: {
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
        },
        signUp(userInfo) {
            let axiosOpt = {
                url: urls.users.signup,
                method: "post",
                data: {
                    email: userInfo.email,
                    password: userInfo.password,
                    name: userInfo.name
                }
            }
            return axiosObj(axiosOpt)
        },
        doubleEmailCheck(email) {
            let axiosOpt = {
                url: urls.users.doubleEmailCheck,
                method: "get",
                params: {
                    email: email
                }
            }
            return axiosObj(axiosOpt)
        },
        sendEmail(email) {
            let axiosOpt = {
                url: urls.users.sendEmail,
                method: "post",
                data: {
                    email: email
                }
            }
            return axiosObj(axiosOpt)
        }
    }
}