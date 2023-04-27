import { Form, useActionData, useLoaderData } from "react-router-dom";
import * as z from "zod";
import axios from "axios";
import { createErrorsObject } from "../helpers/errorhandling";
import { toast } from "react-toastify";

export const profileLoader = (user) => async () => {
    try {
        let response = await axios.get("http://localhost:4000/users/" + user.id, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`,
            }
        })
    return await response.data

    } catch (error) {
        throw new Response("No user", { status: 401, from: "/secrets" })
    }
   
}

export const profileAction = (user) => async ({request}) => {
    const formData = await request.formData()
    const values = Object.fromEntries(await formData)

    
    let schema = z.object({
        email: z.string().email({ message: "Email not valid" }),
        username: z.string().min(1, {message: "username is required"}),
        firstname: z.string().optional(), 
        lastname: z.string().optional(),
        birthday: z.coerce.date({ invalid_type_error: "Birthday must be a date"}),
        description: z.string().optional()    
        })

        const { success, data, error } = schema.safeParse(values)

        if(success) {
            await axios.patch("http://localhost:4000/users/" + user.id, data, {
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                    Authorization: `Bearer ${user.accessToken}`
                }
            })
            toast.success("User updated!", { autoClose: 800}) 
            return null
        } else {
            return createErrorsObject(error)
        }



}


const Profile = () => {
    // const { user } = useAuth() // { user, logInUser, logOutUser}
    const user = useLoaderData()
    const errors = useActionData()
    
    
    
    return ( 
        <>
            <h1>Edit your profile</h1>

            <Form method="post">
                <div>
                <input type="text" name="email" placeholder="Email" defaultValue={user.email}/>
                {errors?.email && <p style={{ color: "red" }}>{errors.email}</p>}
                </div>
                <div>
                <input type="text" name="username" placeholder="Username" defaultValue={user.username}/>
                {errors?.username && <p style={{ color: "red" }}>{errors.username}</p>}
                </div>
                <div>
                <input type="text" name="firstname" placeholder="First name" defaultValue={user.firstname}/>
                {errors?.firstname && <p style={{ color: "red" }}>{errors.firstname}</p>}
                </div>
                <div>
                <input type="text" name="lastname" placeholder="Last name" defaultValue={user.lastname}/>
                {errors?.lastname && <p style={{ color: "red" }}>{errors.lastname}</p>}
                </div>
                <div>
                <input type="date" name="birthday" defaultValue={user.birthday ? user.birthday.split("T")[0] : null}/> 
                {errors?.birthday && <p style={{ color: "red" }}>{errors.birthday}</p>}
                </div>
                <div>
                <textarea name="description" cols="30" rows="10" placeholder="Descripe yourself" defaultValue={user.description}></textarea>
                {errors?.description && <p style={{ color: "red" }}>{errors.description}</p>}
                </div>

                <button type="submit">Update</button>
            </Form>
        </>
     );
}
 
export default Profile;