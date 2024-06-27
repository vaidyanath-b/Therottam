import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest) {
  const response = await prisma.topic.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return NextResponse.json(response);
}
