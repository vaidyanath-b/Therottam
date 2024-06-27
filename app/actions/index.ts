"use server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function Logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return;
}

export async function getUserData() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  let username;
  if (data.user) {
    username = await prisma.user.findUnique({
      where: {
        email: data.user?.email,
      },
      select: {
        username: true,
      },
    });
  }
  return { ...data, username: username?.username };
}
