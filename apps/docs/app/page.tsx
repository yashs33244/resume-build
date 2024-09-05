import LandingPage from "../components/Landing/Landing";
import { authOptions } from "./lib/auth";
import { getServerSession } from "next-auth";

const getUserDetails = async () => {
  const session = await getServerSession(authOptions);
  return session;
};

export default async function Page() {
  const session = await getUserDetails();
  if (session?.user) {
    return (
      <main>
        {/* <Frontpage />  */}
        <LandingPage />
      </main>
    );
  }
  return (
    <main>
      {/* <Frontpage />  */}
      <LandingPage />
      {/* not logged in */}
    </main>
  );
}
