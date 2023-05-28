import { app } from "./app";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5050;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
