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

export const hideReply = async (req, res) => {
    try {
        const query = "UPDATE post_reply SET status = 'hidden' WHERE id = ?";
        const data = await Query.runWithParams(query, [req.params.id]);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
    }
}

