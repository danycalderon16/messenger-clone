import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {

    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      name,
      image
    } = body;

    if (!currentUser || !currentUser?.email) {
      return new NextResponse('Unauthorized',
        {
          status: 401,
          statusText: 'Unauthorized'
        });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data:{
        image: image,
        name: name
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return new NextResponse("Internal Server error",
      {
        status: 500,
        statusText: "There was an error processing the request, check logs"
      });
  }
}
