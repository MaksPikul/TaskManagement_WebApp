"use server"

import { RegisterSchema } from "@/schemas"
import bcrypt from "bcryptjs"
import * as z from "zod"
import { db } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import { getUserByEmail } from "@/data/user"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"
import { getRedisClient } from "@/lib/redis"

export const Register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success){
        return { error: "Invalid fields"}
    }

    const {name, email, password} = validatedFields.data;
    const existingUser = await getUserByEmail(email)
    if (existingUser){
        return {error: "Email already taken"}
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const token = uuidv4()

    const userObj = {
        name: name,
        email: email,
        password: hashedPass,
    }

    await getRedisClient()
    .multi()
    .hmset(token, userObj)
    .expire(token, 60 * 5)
    .exec()

    /* 
    await db.user.create({
        data: {
            name,
            email,
            password: hashedPass,
        }
    })
    */

    //send verification email
    const verificationToken = await generateVerificationToken(email, token);
    await sendVerificationEmail(
        verificationToken.email, 
        verificationToken.token
    )


    return { success: "Email sent"}
}