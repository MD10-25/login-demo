import axios from "axios";
import { Form, useLoaderData, json, useActionData } from "react-router-dom";
import * as z from "zod";
import { createErrorsObject } from "../helpers/errorhandling";


export const secretsLoader = ( user ) => async () => {
    try {
        let response = await axios("http://localhost:4000/secrets", {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        })
        return await response.data
    } catch (error) {
        throw json({from: "/secrets"}, { status: 401  })
    }
}



export const action = (user) => async ({ request }) => {
        

    let formData = await request.formData();
    let values = Object.fromEntries(await formData);
  
    let schema = z.object({
    quote: z
        .string({ required_error: "Du skal taste noget!" })
        .min(1, { message: "Du skal taste noget!" }),

    author: z
        .string({ required_error: "Du skal taste noget!" })
        .min(1,{ message: "Du skal taste noget!"}),
    
    // Carsetn gjorde: origin: z.string().optional()
    origin: z
        .union([z.string().length(0,{message: "Skal enten være tom eller mindst 5 karakter"}), z.string().min(5)])
        .optional()
        .transform(e => e === "" ? undefined : e)

    });
  
    try {
      let {success, data, error} = schema.safeParse(values); // {success, data, error}
  
      if(success) {
        await axios.post("http://localhost:4000/secrets", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.accessToken}`
            }
        });
        return null;
      } else {
        return createErrorsObject(error)
      }
    } catch (error) {
      return json({ error });
    }
  };


const Secrets = () => {
    const secrets = useLoaderData()
    const errors = useActionData();

    console.log(secrets)

    return ( 
        <>
            <h1>Secrets</h1>

           {secrets.map((secret) => (
                <p key={secret.id}>{secret.quote} {secret.origin ? "-" : " "} {secret.origin ?  secret.origin : ""} - {secret.author} </p>
           ))}

           <Form method="post">
            <div>
                <input type="text" name="quote" placeholder="quote"/>
                {errors?.quote && <p style={{ color: "red" }}>{errors.quote}</p>}
            </div>

            <div>
                <input type="text" name="author" placeholder="author"/>
                {errors?.author && <p style={{ color: "red" }}>{errors.author}</p>}
            </div>

            <div>
                <input type="text" name="origin" placeholder="origin"/>
                {errors?.origin && <p style={{ color: "red" }}>{errors.origin}</p>}
            </div>

                <button type="submit">add</button>
           </Form>
        </>
     );
}
 
export default Secrets;