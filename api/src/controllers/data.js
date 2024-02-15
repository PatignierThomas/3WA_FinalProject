import Query from "../model/Query.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const getAllGames = async (req, res) => {
    const query = "SELECT * FROM game_section ORDER BY visibility DESC, game_name ASC";
    const data = await Query.run(query)
    res.json(data);
}

export const getAllSubject = async (req, res) => {
    const query = "SELECT * FROM sub_forum";
    const data = await Query.run(query)
    res.json(data);
}

export const getAllPost = async (req, res) => {
    const query = "SELECT * FROM post ORDER BY creation_date DESC";
    const data = await Query.run(query)
    res.json(data);
}

//TODO 
export const getMostRecentPost = async (req, res) => {
    const query = "SELECT * FROM post ORDER BY last_update DESC LIMIT 1";
    const data = await Query.run(query)
    res.json(data);
}

export const getPostById = async (req, res) => {
    const query = `SELECT * 
                   FROM post 
                   JOIN users ON post.user_id = users.id
                   WHERE post.id = ?`;
    const data = await Query.runWithParams(query, [req.params.id])

    // if (data.user_id !== req.user.id) {
    //     const query = "UPDATE post SET views = views + 1 WHERE id = ?";
    //     await Query.runWithParams(query, [req.params.id]);
    // }

    const creation_date = new Date(data[0].creation_date);
    data[0].creation_date = creation_date.toLocaleString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    if (!data[0].last_update === null) {
        const last_update = new Date(data[0].last_update);
        data[0].last_update = last_update.toLocaleString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    console.log(data);
    res.json(data);
}

export const getEditPostById = async (req, res) => {
    const query = `SELECT user_id, status, title, content 
                   FROM post 
                   WHERE id = ?`;
    const [data] = await Query.runWithParams(query, [req.params.id])
    if (req.user.role !== "admin" && (data.user_id !== req.user.id || data.status === "locked" || data.status === "hidden")) {
        return res.status(403).json({error: "Unauthorized"});
    }
    res.json(data);
}

export const getReplyByPostId = async (req, res) => {
    const query = `SELECT * 
                   FROM post_reply 
                   JOIN users ON post_reply.user_id = users.id
                   WHERE post_reply.post_id = ?
                   ORDER BY reply_date DESC`;

    const data = await Query.runWithParams(query, [req.params.postId])
    data.map((reply) => {
        const reply_date = new Date(reply.reply_date);
        reply.reply_date = reply_date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'});
        if (reply.last_update === null) return;
        const last_update = new Date(reply.last_update);
        reply.last_update = last_update.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'});
    })

    res.json(data);
}

export const updatePost = async (req, res) => {
    try {
        const check = "SELECT * FROM post WHERE id = ? AND user_id = ?";
        const checkData = await Query.runWithParams(check, [req.params.id, req.user.id]);
        if (req.user.role !== "admin" && (data.user_id !== req.user.id || data.status === "locked" || data.status === "hidden")) {
            return res.status(403).json({error: "Unauthorized"});
        }
        const query = "UPDATE post SET title = ?, content = ?, last_update = ? WHERE id = ?";
        const data = await Query.runWithParams(query, [req.body.title, req.body.content, new Date(), req.params.id]);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}

export const createPost = async (req, res) => {
    const { content } = req.body;
    
    const token = req.cookies.TK_AUTH;

    const user = jwt.verify(token, process.env.SECRET_TOKEN);

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const query = "INSERT INTO post (title, content, creation_date, last_update, status, sub_forum_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [req.body.title, content, now, now, "ok", req.body.sectionId, user.id];

    const data = await Query.runWithParams(query, values);
    res.json({message: "Post crée"})
}

export const createReply = async (req, res) => {
    const { content } = req.body;
    
    const token = req.cookies.TK_AUTH;

    const user = jwt.verify(token, process.env.SECRET_TOKEN);

    const query = "INSERT INTO post_reply (content, reply_date, status, post_id, user_id) VALUES (?, ?, ?, ?, ?)";
    const values = [content, new Date().toISOString().slice(0, 19).replace('T', ' '), "ok", req.body.postId, user.id];

    const data = await Query.runWithParams(query, values);
    res.json({message: "Réponse crée"})
} 