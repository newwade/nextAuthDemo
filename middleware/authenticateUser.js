import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import getConfig from "next/config";

export default function isAuthenticated(req, res, fn) {
  const { serverRuntimeConfig } = getConfig();

  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      try {
        console.log("result", result);
        if (result instanceof Error) {
          return reject(result);
        }
        let response = "";
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        // const decoded_token = jwt_decode(token);

        // const currentTimestamp = new Date().getTime() / 1000;
        // if (decoded_token.exp > currentTimestamp) {
        jwt.verify(token, serverRuntimeConfig.JWT_SECRET, (err, user) => {
          if (err) {
            res.json({ status: 401, success: false, user: "Invalid token" });
          } else {
            return resolve({ user });
          }
        });
        // } else {
        // res.json({ status: 403, success: false, user: "forbidden" });
        // }
      } catch (error) {
        console.log(error);
        res.status(401).send({ success: false, message: "Invalid token" });
      }
    });
  });
}
