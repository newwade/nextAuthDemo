import clientPromise from "../../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getConfig from "next/config";

export default async function Signin(req, res) {
  try {
    const { serverRuntimeConfig } = getConfig();
    const { username, password } = req.body;
    console.log(username, password);
    const client = await clientPromise;
    const db = client.db("KLA_USERS");
    let user = await db
      .collection("user")
      .find({ username: username })
      .toArray();
    user = user[0];

    if (user === undefined) {
      return res
        .status(400)
        .send({ success: false, message: "username or password is not valid" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .send({ success: false, message: "username or password is not valid" });
    }

    const access_token = jwt.sign(
      { id: user._id, username: user.username },
      serverRuntimeConfig.JWT_SECRET,
      {
        expiresIn: 1800,
      }
    );
    const refresh_token = jwt.sign(
      { id: user._id, username: user.username },
      serverRuntimeConfig.JWT_SECRET,
      {
        expiresIn: 3600,
      }
    );

    const userData = {
      id: user._id,
      username: user.username,
      accessToken: access_token,
      refreshToken: refresh_token,
      accessTokenExpiresAt: 1800,
    };

    return res.status(200).send({ success: true, user: userData });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal error" });
  }
}
