import Query from "../model/Query.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const getAllGames = async (req, res) => {
    const query = "SELECT * FROM game_section";
    const data = await Query.run(query)
    res.json(data);
}

export const getAllSubject = async (req, res) => {
    const query = "SELECT * FROM sub_forum";
    const data = await Query.run(query)
    res.json(data);
}

export const getAllPost = async (req, res) => {
    const query = "SELECT * FROM post";
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

    const creation_date = new Date(data[0].creation_date);
    data[0].creation_date = creation_date.toLocaleString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    if (!data[0].last_update === null) {
        const last_update = new Date(data[0].last_update);
        data[0].last_update = last_update.toLocaleString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    res.json(data);
}

export const getReplyByPostId = async (req, res) => {
    const query = `SELECT * 
                   FROM post_reply 
                   JOIN users ON post_reply.user_id = users.id
                   WHERE post_reply.post_id = ?`;

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

export const createPost = async (req, res) => {
    const { content } = req.body;
    
    const token = req.cookies.TK_AUTH;

    const user = jwt.verify(token, process.env.SECRET_TOKEN);

    const query = "INSERT INTO post (title, content, creation_date, status, sub_forum_id, user_id) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [req.body.title, content, new Date().toISOString().slice(0, 19).replace('T', ' '), "ok", req.body.sectionId, user.id];

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