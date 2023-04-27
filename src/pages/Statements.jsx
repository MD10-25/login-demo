import { useLoaderData, Form, useActionData, json, useSubmit } from "react-router-dom";
import axios from "axios";
import * as z from "zod";
import { createErrorsObject } from "../helpers/errorhandling";
import { toast } from "react-toastify"



export const loader = async () => {
  let response = await fetch("http://localhost:4000/statements");

  return await response.json();
};

export const action = async ({ request }) => {
  let formData = await request.formData();

  let values = Object.fromEntries(await formData);

  console.log(values._action)


  if(values._action === "delete") {
    // GØRE NOGET (SLETTE)
    await axios.delete("http://localhost:4000/statements/" + values._id)

    return null

  } else {





  let schema = z.object({
    sentence: z
      .string({ required_error: "Du skal taste noget!" })
      .min(1, { message: "Du skal taste noget!" }),

  });



  try {

    let {success, data, error} = schema.safeParse(values); // {success, data, error}

    if(success) {
      await axios.post("http://localhost:4000/statements", data);

      return null;
    } else {
      return createErrorsObject(error)
    }

  } catch (error) {
    return json({ error });
  }

}

};



const Statements = () => {
  const statements = useLoaderData();
  const errors = useActionData();
  const submit = useSubmit()



  const handleDelete = (form) => {
    toast.dismiss()
    submit(form)
  }



  const handleConfirmation = (e) => {
    let form = e.target
    e.preventDefault()
    toast(<div>

      <p>Are you sure you want to delete the statement?</p>

      <div>

        <button onClick={() => handleDelete(form)} style={{ backgroundColor: "red", color: "white"}}>Delete</button>

        <button style={{backgroundColor: "lightgray", color: "black", marginLeft: "1rem", }} onClick={() => toast.dismiss()}>Cancel</button>

      </div>

    </div>, {

      autoClose: false,

      closeButton: false,

      closeOnClick: false,

      draggable: false

    })

  }

  return (
    <>
      <section>
        <h1>Statements</h1>
        {statements.map((statement) => (
          <div key={statement.id} style={{display: "flex", justifyContent: "center", gap: "1rem"}}>
            <p>{statement.sentence}</p>
          <Form method="post" onSubmit={handleConfirmation}>  
            <input type="hidden" name="_action" value="delete"/>
            <input type="hidden" name="_id" value={statement.id}/>
            <button>&times;</button>
          </Form></div>
        ))}
      </section>
      <Form method="post">
        <input type="text" name="sentence" />
        <button type="submit">add</button>
        {errors?.sentence && <p style={{ color: "red" }}>{errors.sentence}</p>}
      </Form>
    </>

  );

};



export default Statements;