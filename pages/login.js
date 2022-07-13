import React, { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

function Login() {
  const { data: session } = useSession();

  const getUser = () => {
    console.log(session);
  };

  const handleSignin = (e) => {
    e.preventDefault();
    console.log(e.target.username.value);
    console.log(e.target.password.value);
    signIn("credentials", {
      username: e.target.username.value,
      password: e.target.password.value,
      callbackUrl: `/`,
    });
  };

  useEffect(() => {}, []);

  return (
    <div>
      <form onSubmit={handleSignin}>
        <input name="username" type="text" />
        <input name="password" type="password" />
        <button type="submit">Signin</button>
      </form>
    </div>
  );
}

export default Login;
