import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

async function refreshAccessToken(token) {
  try {
    const response = await fetch("http://localhost:3000/api/refresh", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();
    console.log("refreshedTokens", refreshedTokens);

    if (!refreshedTokens.success) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires:
        Date.now() + refreshedTokens.accessTokenExpiresAt * 1000,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {
        username: {
          label: "Email",
          type: "text",
          placeholder: "johndoe@test.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const response = await fetch("http://localhost:3000/api/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
          }),
        });
        const data = await response.json();
        console.log(data);

        if (data.success) {
          return data.user;
        }

        // login failed
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      // first time jwt callback is run, user object is available
      if (user) {
        return {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + user.accessTokenExpiresAt * 1000,
          user: {
            id: user.id,
            username: user.username,
          },
        };
      }
      console.log(new Date(Date.now()), new Date(token.accessTokenExpires));
      console.log("token", token);
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
      return refreshAccessToken(token);
    },
    session: ({ session, token }) => {
      if (token) {
        session.user = token.user;
        session.accessToken = token.accessToken;
        session.error = token.error;
      }
      console.log("session", session);
      return session;
    },
  },
  secret: "test",
  jwt: {
    secret: "test",
    encryption: true,
  },
  pages: {
    signIn: "/login",
  },
});
