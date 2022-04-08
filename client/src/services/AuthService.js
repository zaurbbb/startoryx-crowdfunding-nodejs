import $api from "../http/index"

export default class AuthService {
    static async login(email, password){
        return $api.post('/login', {email, password})
    }
    static async registration(email, password){
        return $api.post('/registration', {email, password})
    }
    static async logout(email, password){
        return $api.post('/logout', {email, password})
    }
}