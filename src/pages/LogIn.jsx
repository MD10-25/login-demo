import { Form, useNavigate, useLocation } from "react-router-dom";
import { createErrorsObject } from "../helpers/errorhandling";
import { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import * as z from "zod";
import axios from "axios";
import useAuth from "../hooks/useAuth";


const LogIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const HidePass = () => setShowPassword(!showPassword)
  const [errors, setErrors] = useState();
  const auth = useAuth() // { user, logInUser, logOutUser }
  const navigate = useNavigate()
  const location = useLocation()

  // const from = location.state?.from?.pathname || "/"



  const schema = z
    .object({
      email: z.string().email("Your email is not valid!"),
      password: z.string().min(1, { message: "Password is required!" }),
    })
  
    

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null)
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData);

    let validated = schema.safeParse(values)
    console.log(validated) // { success, data, error }

    if(validated.success){
      // poste data til axios
      let response = await axios.post("http://localhost:4000/login", {
        email: validated.data.email,
        password: validated.data.password
      })
      // console.log(response.data)
      auth.logInUser(response.data, () => navigate("/"))
    } else {
      setErrors(createErrorsObject(validated.error))
    }


  };
  return (
    <Form method="post" onSubmit={handleSubmit} style={{marginTop: "1rem"}}>
      <div className="formgroup">
        <input type="email" name="email" id="email" placeholder="Email"/>
        {errors?.email && (<p style={{color: "red"}}>{errors.email}</p>)}
      </div>
      <div className="formgroup">
      <p style={{display: "flex", alignItems: "center", gap: "1em", fontSize: "10px", margin: "0", justifyContent: "center"}}>Show password{showPassword ? <FaEye onClick={HidePass}/> : <FaEyeSlash onClick={HidePass}/>}</p> 
        <input type={showPassword ? "text" : "password"} name="password" id="password" placeholder="Password" autoComplete="false"/>
        {errors?.password && (<p style={{color: "red"}}>{errors.password}</p>)}
      </div>
      
      <button type="submit" style={{marginTop: "1rem"}}>Log In</button>

    </Form>
  );
};

export default LogIn;
