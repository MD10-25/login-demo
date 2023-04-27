import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
const Navigation = () => {

    const auth = useAuth()

    return ( 
    <nav>
        <Link to="/">Home</Link> <Link to="/about">About</Link>
        {" "}
        <Link to="/statements">Statements</Link>
        {" "}
        {auth.user ? <Link to="/secrets">Secrets</Link> : null }
        {" "}
        {!auth.user && <Link to="/signup">Sign up</Link>}
        {" "}
        {auth.user ? <Link to="/profile">Profile</Link> : null }
    </nav>
     );
}
 
export default Navigation;