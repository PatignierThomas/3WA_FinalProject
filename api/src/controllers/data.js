import Query from "../model/Query.js";

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
    const query = `SELECT * FROM post WHERE id = ?`;
    const data = await Query.runWithParams(query, [req.params.id])
    res.json(data);
}

export const getReplyByPostId = async (req, res) => {
    const query = `SELECT * FROM post_reply WHERE post_id = ?`;
    const data = await Query.runWithParams(query, [req.params.id])
    res.json(data);
}
