import { Form, json, useNavigate } from "react-router-dom";
import { createErrorsObject } from "../helpers/errorhandling";
import { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import * as z from "zod";
import axios from "axios";
import useAuth from "../hooks/useAuth";


const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const HidePass = () => setShowPassword(!showPassword)
  const [errors, setErrors] = useState();
  const auth = useAuth() // { user, logInUser, logOutUser }
  const navigate = useNavigate()

  const schema = z
    .object({
      email: z.string().email("Your email is not valid!"),
      password: z.string().min(1, { message: "Password is required!" }),
      confirmPassword: z
        .string()
        .min(1, { message: "Please confirm your password!" }),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: "Passwords do not match!",
      path: ["confirmPassword"],
    });

    

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null)
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData);

    let validated = schema.safeParse(values)
    console.log(validated) // { success, data, error }

    if(validated.success){
      // poste data til axios
      let response = await axios.post("http://localhost:4000/register", {
        email: validated.data.email,
        password: validated.data.password
      })
      // console.log(response.data)
      if(response.status === 400) setErrors({ exists: "User already exists"})
      auth.logInUser(response.data, () => navigate("/"))
    } else {
      setErrors(createErrorsObject(validated.error))
    }

    /*try {


      if (validatedValues) {
        let response = await axios.post("http://localhost:4000/register", {
          validatedValues,
        });
        console.log(response.data);
      }

      //return null;
    } catch (error) {
      let data = Promise.resolve({ error });

      console.log(data);
      //let errors = createErrorsObject(json({ error }));
      //console.log(errors);
    }*/
  };
  return (
    <Form method="post" onSubmit={handleSubmit}>
      <div className="formgroup">
        <input type="email" name="email" id="email" placeholder="Email"/>
        {errors?.email && (<p style={{color: "red"}}>{errors.email}</p>)}
      </div>
      <div className="formgroup">
      <p style={{display: "flex", alignItems: "center", gap: "1em", fontSize: "10px", margin: "0", justifyContent: "center"}}>Show password{showPassword ? <FaEye onClick={HidePass}/> : <FaEyeSlash onClick={HidePass}/>}</p> 
        <input type={showPassword ? "text" : "password"} name="password" id="password" placeholder="Password" autoComplete="false"/>
        {errors?.password && (<p style={{color: "red"}}>{errors.password}</p>)}
      </div>
      <div className="formgroup">
        <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" autoComplete="false"/>
        {errors?.confirmPassword && (<p style={{color: "red"}}>{errors.confirmPassword}</p>)}
      </div>
      <button type="submit">Register</button>
      {errors?.exists && (<p style={{color: "red"}}>{errors.exists}</p>)}
    </Form>
  );
};

export default Register;
