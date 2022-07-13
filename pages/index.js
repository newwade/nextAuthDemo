import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { signIn } from "next-auth/react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState();
  console.log("session", session);

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      console.log(session);
      signIn(); // Force sign in to hopefully resolve error
    }
    setUsername(session?.user.username);
  }, [session]);

  return (
    <div className={styles.container}>
      <p>{`logged in as ${username}`}</p>
      <Link href="/login">
        <button>Signin</button>
      </Link>
    </div>
  );
}
