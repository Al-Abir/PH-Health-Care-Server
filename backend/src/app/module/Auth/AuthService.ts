
const loginUser =( payload: {
    email:string,
    password:string
})=>{
     console.log("auth .......", payload)
}

export const AuthService={
     loginUser,
}