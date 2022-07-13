import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import getConfig from "next/config";

export default function handler(req, res) {
  try {
    const { serverRuntimeConfig } = getConfig();

    switch (req.method) {
      case "POST":
        const { token } = req.body;
        jwt.verify(token, serverRuntimeConfig.JWT_SECRET, (err, user) => {
          if (err) {
            res.status(201).send({ success: false, user: "invalid token" });
          } else {
            const access_token = jwt.sign(
              { id: user.id, username: user.username },
              serverRuntimeConfig.JWT_SECRET,
              {
                expiresIn: 60,
              }
            );
            const data = {
              accessToken: access_token,
              refreshToken: token,
              accessTokenExpiresAt: 60,
            };
            res.status(200).send({ success: true, ...data });
          }
        });
        break;

      default:
        res.status(400).send({ success: false, message: "Invalid method" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal error" });
  }
}
