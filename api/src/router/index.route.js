import express from 'express';

const indexRouter = express.Router();

indexRouter.get("/api/v1", (req, res) => {
    res.send("Hello World!");
    }
);

indexRouter.get("*", (req, res) => {
    res.json({ error: "Page not found" })
});

export default indexRouter;