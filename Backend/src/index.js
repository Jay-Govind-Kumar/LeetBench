import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
