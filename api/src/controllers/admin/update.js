import Query from '../../model/Query.js';

export const updateGame = async (req, res) => {
    try {
        const query = "UPDATE game_section SET game_name = ?, minimal_age = ? WHERE id = ?";
        const data = await Query.runWithParams(query, [req.body.gameName, req.body.gameAge, req.params.id]);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}