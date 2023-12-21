import { NextFunction, Request, Response, json, urlencoded } from "express";
import express from "express";
import dotenv from "dotenv";
import user_router from "./Routes/userRoutes";
import post_router from "./Routes/postRoutes";
import cors from "cors";


dotenv.config();
const port = 3000;
console.log(port);

const app = express();
app.use(json());
app.use(cors());
app.use(urlencoded({ extended: true }));

app.use("/user", user_router);
app.use("/post", post_router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.json({
    error: err.message,
  });
});

app.listen(port, () => {
  console.log(`Talky is running on port ${port}`);
});
