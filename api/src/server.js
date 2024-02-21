import express from 'express';
import "dotenv/config";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

import router from "./router/index.route.js";

const app = express();

const dotenv = process.env;

const PORT = dotenv.PORT || 5000;

app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:9500", // dotenv.CLIENT_URL
    methods: ["GET", "POST", "DELETE", "PATCH"],
    credentials: true, 
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/public/assets/img', express.static(path.join(process.cwd(), "/public/assets/img/")));

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use(router)