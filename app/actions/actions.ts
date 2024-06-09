
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {prisma} from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { SignInWithPasswordCredentials } from '@supabase/supabase-js'
import axios from 'axios'

export async function login(email:string,password:string) {
    
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const loginData : SignInWithPasswordCredentials = {
    email: email ,
    password: password ,
  }

  const { error } = await supabase.auth.signInWithPassword(loginData)

  if (error) {
    throw error
}
  const {data} = await supabase.auth.getUser()
  const uname =  await prisma.user.findUnique({
    where: {
          email: data.user?.email
    },
    select: {
          username: true
    }
  })
  if(!uname && data.user?.email){
    console.log("Creating user" , data.user?.email , uname)
    await prisma.user.create({
      data: {
        email: data.user?.email,
        username: data.user?.email.split('@')[0]
      }
    })
  }
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  
  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}