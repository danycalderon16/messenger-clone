import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  conversationId?: string;
}

export async function POST(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const currentUser = await getCurrentUser();
    const {
      conversationId
    } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // findo the existing converation
    const converation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        messages: {
          include: {
            seen: true
          }
        },
        users: true
      }
    });

    if (!converation) {
      return new NextResponse("Ivalid ID", { status: 400 });
    }

    // Find the last message
    const lastMessage = converation.messages[converation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(converation);
    }

    // Update seen of last message
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id
      },
      include: {
        seen: true,
        sender: true
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id
          }
        }
      }
    });

    await pusherServer.trigger(currentUser.email, "conversation:update",{
      id: conversationId,
      messages: [updatedMessage]
    });

    if( lastMessage.seenIds.indexOf(currentUser.id)!== -1){
      return NextResponse.json(converation);
    }

    await pusherServer.trigger(conversationId!, "message:update",updatedMessage);
    

    return NextResponse.json(updatedMessage);
  } catch (error: any) {
    console.error(error, 'ERROR_MESSAGES_SEEN');
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}