import React, { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

function Hello() {
  const { data: session } = useSession();

  const getUser = () => {
    console.log(session);
  };

  useEffect(() => {}, []);

  return <div>Hello ${}</div>;
}

export default Hello;
