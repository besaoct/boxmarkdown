'use server'

import { sendContactEmail } from "@/lib/mail";

export const sendMessage = async(   values: { name:string, email:string, message:string}
) => {

    const message = await sendContactEmail({
       name: values.name,
       email: values.email,
       message: values.message
      })

    return { message, success: "Message sent!" };

}