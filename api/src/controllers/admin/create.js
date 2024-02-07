import Query from '../../model/Query.js';

export const createGame = async (req, res) => {
    try {
        const query = "INSERT INTO game_section (game_name, minimal_age) VALUES (?, ?)";
        const data = await Query.runWithParams(query, [req.body.gameName, req.body.gameAge]);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}

export const createSection = async (req, res) => {
    try {
        const query = "INSERT INTO sub_forum (subject, game_section_id) VALUES (?, ?)";
        const data = await Query.runWithParams(query, [req.body.sectionName, req.body.gameId]);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}
