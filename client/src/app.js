const axios = require('axios').default
import AuthService from "./services/AuthService"

var isAuth = false;

async function login(email, password){
    try{
        const response = await AuthService.login(email, password)
        console.log(response)
        localStorage.setItem('token', response.data.accessToken)
        isAuth = true
    }
    catch (e) {
        
    }
}