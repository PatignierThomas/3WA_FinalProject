import Query from "../model/Query.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const getAllGames = async (req, res) => {

    if (req.user) {
    const query = "SELECT * FROM game_section ORDER BY visibility DESC, game_name ASC";
    const data = await Query.run(query)
    res.json(data);
    }
    else {
        const query = "SELECT * FROM game_section WHERE visibility = 'Public' ORDER BY game_name ASC";
        const data = await Query.run(query)
        res.json(data);
    }
}

export const getAllSubject = async (req, res) => {
    const query = `SELECT sub_forum.*, COUNT(post.id) as post_count
                   FROM sub_forum 
                   LEFT JOIN post ON sub_forum.id = post.sub_forum_id
                   GROUP BY sub_forum.id`;
    const data = await Query.run(query)
    res.json(data);
}

export const getPostsBySection = async (req, res) => {
    // GREATEST determine the greatest value from a list of values
    // COALESCE returns the first non-null value in a list
    // const query =  `SELECT post.*, COUNT(CASE WHEN post_reply.status = 'ok' THEN 1 END) as replies, 
    //                     MAX(CASE WHEN post_reply.status = 'ok' THEN post_reply.reply_date END) as latest_reply
    //                 FROM post 
    //                 LEFT JOIN post_reply ON post.id = post_reply.post_id AND post_reply.status = 'ok'
    //                 WHERE post.sub_forum_id = ? AND post.status = 'ok'
    //                 GROUP BY post.id
    //                 ORDER BY GREATEST(COALESCE(latest_reply, '0000-00-00'), post.creation_date) DESC;`

    let commonQuery =  `SELECT post.*, COUNT(CASE WHEN post_reply.status = 'ok' THEN 1 END) as replies, 
                            MAX(CASE WHEN post_reply.status = 'ok' THEN post_reply.reply_date END) as latest_reply
                        FROM post 
                        LEFT JOIN post_reply ON post.id = post_reply.post_id AND post_reply.status = 'ok'`

    switch (req.user?.role) {
        case "admin":
            commonQuery += `
            WHERE post.sub_forum_id = ?`;
            break;
        case "user":
            commonQuery += `
            WHERE post.sub_forum_id = ? AND post.status = 'ok'`
            break;
        case null || undefined:
            commonQuery += `
            JOIN sub_forum ON post.sub_forum_id = sub_forum.id
            JOIN game_section ON sub_forum.game_section_id = game_section.id
            WHERE post.status = 'ok' AND post.sub_forum_id = ? AND game_section.visibility = 'Public'`
            break;
    }

    commonQuery += `
    GROUP BY post.id
    ORDER BY GREATEST(COALESCE(latest_reply, '0000-00-00'), post.creation_date) DESC`;

    const data = await Query.runWithParams(commonQuery, [req.params.id])
    res.json(data);
}

export const getMostRecentPostOfCategory = async (req, res) => {
    // get the most recent post of each category and the date of the most recent activity
    const query = `
    SELECT 
        p.id postID, 
        p.title, 
        p.creation_date, 
        p.views, 
        p.user_id, 
        pr.id, 
        pr.reply_date, 
        sub_forum.game_section_id, 
        sub_forum.id subID, 
        users.username

    FROM post_reply pr
    JOIN post p ON p.id = pr.post_id
    JOIN sub_forum on sub_forum.id = p.sub_forum_id
    JOIN users ON p.user_id = users.id
    JOIN (
        SELECT post_id, MAX(reply_date) as max_reply_date
        FROM post_reply
        WHERE status = 'ok'
        GROUP BY post_id
    ) pr_max ON pr.post_id = pr_max.post_id AND pr.reply_date = pr_max.max_reply_date
    WHERE sub_forum.game_section_id = ?
    ORDER BY pr.reply_date DESC;`;

    const data = await Query.runWithParams(query, [req.params.id])

    // filter the first post of each category
    const filteredData = data.filter((post, index, self) => {
        return index === self.findIndex((p) => (
            p.subID === post.subID
        ))
    })

    res.json(filteredData);
}

export const getPostById = async (req, res) => {
    const query = `SELECT * 
                   FROM post 
                   JOIN users ON post.user_id = users.id
                   WHERE post.id = ?`;
    const data = await Query.runWithParams(query, [req.params.id])

    const view = "UPDATE post SET views = views + 1 WHERE id = ?";
    await Query.runWithParams(view, [req.params.id]);

    const creation_date = new Date(data[0].creation_date);
    data[0].creation_date = creation_date.toLocaleString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    if (!data[0].last_update === null) {
        const last_update = new Date(data[0].last_update);
        data[0].last_update = last_update.toLocaleString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    res.json(data);
}

export const getNumberOfPostByCategory = async (req, res) => {
    const query = "SELECT COUNT(*) as total FROM post WHERE sub_forum_id = ?";
    const data = await Query.runWithParams(query, [req.params.id]);
    return data[0].total;
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
    const query = `SELECT post_reply.id, post_reply.content, post_reply.reply_date, post_reply.last_update, post_reply.status, users.username
                   FROM post_reply 
                   JOIN users ON post_reply.user_id = users.id
                   WHERE post_reply.post_id = ?
                   ORDER BY reply_date ASC`;

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
        const check = "SELECT * FROM post WHERE id = ?";
        const [checkData] = await Query.runWithParams(check, [req.params.id]);
        if (req.user.role !== "admin" && (checkData.user_id !== req.user.id || checkData.status === "locked" || checkData.status === "hidden")) {
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

export const updateReply = async (req, res) => {
    try {
        const check = "SELECT * FROM post_reply WHERE id = ?";
        const [checkData] = await Query.runWithParams(check, [req.params.id]);
        if (req.user.role !== "admin" && (checkData.user_id !== req.user.id || checkData.status === "locked" || checkData.status === "hidden")) {
            return res.status(403).json({error: "Unauthorized"});
        }
        const query = "UPDATE post_reply SET content = ?, last_update = ? WHERE id = ?";
        const data = await Query.runWithParams(query, [req.body.content, new Date(), req.params.id]);
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