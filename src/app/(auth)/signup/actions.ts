"use server"

import { isRedirectError } from "next/dist/client/components/redirect"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { hash } from "@node-rs/argon2"
import { generateIdFromEntropySize } from "lucia"

import { lucia } from "@/auth"
import prisma from "@/lib/prisma"
import { signUpSchema, SignUpValues } from "@/lib/validation"

export async function signUp(
  credentials: SignUpValues,
): Promise<{ error: string }> {
  try {
    const { email, password, username } = signUpSchema.parse(credentials)

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })

    const userId = generateIdFromEntropySize(10)

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    })

    if (existingUsername) {
      return { error: "Username already taken" }
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    })

    if (existingEmail) {
      return { error: "Email already taken" }
    }

    await prisma.user.create({
      data: {
        id: userId,
        username,
        displayName: username,
        email,
        passwordHash,
      },
    })

    const session = await lucia.createSession(userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    )

    return redirect("/")
  } catch (error) {
    // redirect function error needs to be thrown to redirect
    if (isRedirectError(error)) throw error
    console.error(error)
    return { error: "Something went wrong. Please try again." }
  }
}
