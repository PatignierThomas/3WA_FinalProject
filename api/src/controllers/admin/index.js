import Query from '../../model/Query.js';

export const getStats = async (req, res) => {
    try {
        const stats = `
        SELECT 
            (SELECT COUNT(*) FROM users) AS total_users,
            (SELECT COUNT(*) FROM post) AS total_posts,
            (SELECT COUNT(*) FROM post_reply) AS total_replies;
        `;
        const data = await Query.run(stats);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}

export const banUser = async (req, res) => {
    try {
        const query = "UPDATE users SET status = 'banned' WHERE id = ?";
        const data = await Query.runWithParams(query, [req.params.id]);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}

export const unbanUser = async (req, res) => {
    try {
        const query = "UPDATE users SET status = 'ok' WHERE id = ?";
        const data = await Query.runWithParams(query, [req.params.id]);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}

export const lockPost = async (req, res) => {
    try {
        const query = "UPDATE post SET status = 'locked' WHERE id = ?";
        const data = await Query.runWithParams(query, [req.params.id]);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}

export const unlockPost = async (req, res) => {
    try {
        const query = "UPDATE post SET status = 'ok' WHERE id = ?";
        const data = await Query.runWithParams(query, [req.params.id]);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}

export const deletePost = async (req, res) => {
    try {
        const query = "DELETE FROM post WHERE id = ?";
        const data = await Query.runWithParams(query, [req.params.id]);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}

export const deleteReply = async (req, res) => {
    try {
        const query = "DELETE FROM post_reply WHERE id = ?";
        const data = await Query.runWithParams(query, [req.params.id]);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}

// export const getAllUsers = async (req, res) => {
//     try {
//         const query = "SELECT * FROM users";
//         const data = await Query.run(query);
//         res.json(data);
//     }
//     catch (error) {
//         console.log(error);
//         res.status(500).json({error: "Erreur serveur"});
//     }
// }




