import { Button } from "@repo/ui/components/ui/button";
import { Profilebutton } from "@repo/ui/components/profilebutton";
import { authOptions } from './lib/auth';
import { getServerSession } from "next-auth";

const getUserDetails = async () => {
  const session = await getServerSession(authOptions); 
  return session;
}

export default async function Page() {
  const session = await getUserDetails(); 
  if (session?.user) {
    return (
      <main>
        {/* <Frontpage />  */}
        logged in
      </main>
    );
  }
  return (
    <main>
      {/* <Frontpage />  */}
      not logged in
    </main>
  );
}
