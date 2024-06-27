import { getUserData } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { StudyRoomData } from "@/types";
import { StudyRoomListData } from "@/types";
export async function GET(req: NextRequest) {
  const { user, username } = await getUserData();
  try {
    if (!user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }
    const memberships = await prisma.studyRoomMember.findMany({
      where: {
        username: username,
      },
      include: {
        studyRoom: {
          include: {
            owner: true,
          },
        },
      },
    });
    const studyRooms: StudyRoomListData[] = memberships.map((membership) => {
      return {
        ...membership.studyRoom,
        owner: membership.studyRoom.owner.username,
      };
    });

    return NextResponse.json(studyRooms);
  } catch (error) {
    console.error("Error fetching study rooms:", error);
    return NextResponse.json(
      { message: "Error fetching study rooms" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { user, username } = await getUserData();
  try {
    if (!user || !username) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }
    const reqData: StudyRoomData = await req.json();

    const createdRoom = await prisma.studyRoom.create({
      data: {
        name: reqData.name,
        code: reqData.roomCode,
        owner: {
          connect: {
            username: username,
          },
        },
        members: {
          create: {
            username: username,
          },
        },
      },
    });

    return NextResponse.json(createdRoom, { status: 200 });
  } catch (error) {
    console.error("Error creating study room:", error);
    return NextResponse.json(
      { message: "Error creating study room" },
      { status: 500 }
    );
  }
}
