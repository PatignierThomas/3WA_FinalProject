import Query from '../../model/Query.js';
import { letterToIDRoleSwitch, IDToLetterRoleSwitch } from '../../utils/roleSwitch.js';

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

export const getAllUsers = async (req, res) => {
    try {
        const query = "SELECT * FROM users";
        const data = await Query.run(query);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}

export const getUserById = async (req, res) => {
    try {
        const query = "SELECT username, email, role_id AS role, account_status FROM users WHERE id = ?";
        const [data] = await Query.runWithParams(query, [req.params.id]);
        data.role = IDToLetterRoleSwitch(data.role);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}

//unused
export const getNonBannedUsers = async (req, res) => {
    try {
        const query = "SELECT * FROM users WHERE account_status = 'ok'";
        const data = await Query.run(query);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}

//unused
export const getAllBannedUsers = async (req, res) => {
    try {
        const query = "SELECT * FROM users WHERE account_status = 'banned'";
        const data = await Query.run(query);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}

export const banUser = async (req, res) => {
    try {
        const userIds = req.body.userIds;
        const placeholders = userIds.map(() => '?').join(',');
        const query = `UPDATE users SET account_status = 'banned' WHERE id IN (${placeholders})`;
        const data = await Query.runWithParams(query, userIds);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}

export const unbanUser = async (req, res) => {
    try {
        const userIds = req.body.userIds;
        const placeholders = userIds.map(() => '?').join(',');
        const query = `UPDATE users SET account_status = 'ok' WHERE id IN (${placeholders})`;
        const data = await Query.runWithParams(query, userIds);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}

export const hidePost = async (req, res) => {
    try {
        const query = "UPDATE post SET status = 'hidden' WHERE id = ?";
        const data = await Query.runWithParams(query, [req.params.id]);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}

export const changeUserInfo = async (req, res) => {
    try {
        const {username, email, role, account_status} = req.body;
        const query = "UPDATE users SET username = ?, email = ?, role_id = ?, account_status = ? WHERE id = ?";
        console.log(username, email, letterToIDRoleSwitch(role), account_status, req.params.userId);
        const data = await Query.runWithParams(query, [username, email, letterToIDRoleSwitch(role), account_status, req.params.userId]);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}




