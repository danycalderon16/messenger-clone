import prisma from "@/app/libs/prismadb"
import getSession from "./getSession";

const getUsers = async () => {
  const session = await getSession();
console.log(session);

  if(!session?.user?.email) {
    console.log("*****");
    console.log("There is not session");
    console.log("*****");    
    return [];
  }

  try {
    const users = await prisma.user.findMany({
      orderBy:{
        createdAt: 'desc'
      },
      where:{
        NOT: {
          email: session.user.email
        }
      }
    });

    return users;
  } catch (error) {
    return [];
  }
}

export default getUsers;