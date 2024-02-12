import Query from '../../model/Query.js';

export const deleteGame = async (req, res) => {
    try {
        const query = "DELETE FROM game_section WHERE id = ?";
        const data = await Query.runWithParams(query, [req.body.gameId]);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}

export const deleteSection = async (req, res) => {
    try {
        const query = "DELETE FROM sub_forum WHERE id = ?";
        const data = await Query.runWithParams(query, [req.body.sectionId]);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}