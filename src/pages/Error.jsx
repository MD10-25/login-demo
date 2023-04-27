import { Form, isRouteErrorResponse, useRouteError, useNavigate } from "react-router-dom";
import { useEffect } from "react";




const Error = () => {
    const error = useRouteError()
    const navigate = useNavigate()


    useEffect(() => {    
    if(isRouteErrorResponse(error) && error.status === 401) {
        console.log(error)
        setTimeout(() => {
            navigate("/login", {state: { from: {pathname: error.data.from} }})
        }, 500)

    }

    }, [error]); 


    if(isRouteErrorResponse(error) && error.status === 404) {
        return(
            <div>
                <h1>OOPS!</h1>
                <p>You have reached a place that does not seem to exist!</p>
                <Link to="/">Back to Home</Link>
            </div>
        )
    }
    if(isRouteErrorResponse(error) && error.status === 401) {
        return(
            <div>
                <h1>No access!</h1>
                <p>Did you remember to log in? - or maybe your token is expired...</p>
                <p>Redirecting..</p>
                <Form action="/login">
                    <button>Click to log in now</button>
                </Form>
            </div>
        )
    }
    
    console.log(error.data)


    return ( 
        <>
            <h1>OOPS!</h1>
            <p>Something went wrong!</p>
        </>
     );
}
 
export default Error;