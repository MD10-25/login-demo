import { createContext, useState } from "react";
import Cookies from "js-cookie";


export const AuthContext = createContext()

const AuthProvider = ({ children }) => {

const [user, setUser] = useState(
    Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null
);

const logInUser = (newUser, callback) => {
    let userObj = {
        id: newUser.user.id,
        accessToken: newUser.accessToken,
    }
    setUser(userObj)
    Cookies.set("user", JSON.stringify(userObj))

    callback()
}

const logOutUser = (callback) => {
    Cookies.remove("user")
    setUser(null)

    callback()
}

    return ( 
       <AuthContext.Provider value={{ user, logInUser, logOutUser}}>
        {children}
       </AuthContext.Provider>
     );
}
 
export default AuthProvider;