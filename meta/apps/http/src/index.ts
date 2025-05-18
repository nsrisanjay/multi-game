// create an http server
import express from "express";
const app = express();
import { router } from "./routes/v1";
import client from "@repo/db/client";

app.use(express.json())
app.use("/api/v1",router)

app.listen(process.env.PORT || 3000,()=>console.log("server running...............!"));