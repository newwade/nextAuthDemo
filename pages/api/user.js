import Cors from "cors";
import isAuthenticated from "../../middleware/authenticateUser";

const cors = Cors({
  methods: ["GET", "HEAD"],
});
export default async function getAuthenticatedUser(req, res) {
  try {
    const response = await isAuthenticated(req, res, cors);

    switch (req.method) {
      case "GET":
        res.json({ status: 200, success: true, user: response });
        break;

      default:
        res.json({ status: 400, success: false, message: "Invalid method" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal error" });
  }
}
