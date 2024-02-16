import jwt from 'jsonwebtoken';
import "dotenv/config";

const dotenv = process.env;

const verifyToken = (req, res, next) => {
    const token = req.cookies.TK_AUTH;
    if (!token) return res.json({error: "Accès refusé"});
    const check = jwt.verify(token, dotenv.SECRET_TOKEN);
    if (check) {
        req.user = check;
        next();
    } else {
        return res.json({error: "Accès refusé"});
    }
}

export default verifyToken;

// (err, user) => {
//     if (err) return res.status(403).json({error: "Token invalide"});
//     req.user = user;

// `
//         SELECT 
//             post.*, 
//             COALESCE(MAX(post_reply.reply_date), post.creation_date) as latest_activity
//         FROM 
//             post
//         LEFT JOIN 
//             post_reply 
//             ON post.id = post_reply.post_id
//         INNER JOIN 
//             sub_forum  
//             ON post.sub_forum_id = sub_forum .id
//         WHERE 
//         sub_forum.game_section_id = ? 
//             AND post.creation_date = (
//                 SELECT 
//                     recent_post.creation_date
//                 FROM 
//                     post AS recent_post
//                 LEFT JOIN 
//                     post_reply AS recent_reply 
//                     ON recent_post.id = recent_reply.post_id
//                 WHERE 
//                 recent_post.sub_forum_id = post.sub_forum_id
//                 ORDER BY 
//                     GREATEST(recent_post.creation_date, COALESCE(recent_reply.reply_date, '0000-00-00')) DESC
//                 LIMIT 1
//             )
//         GROUP BY 
//             post.id
//         ORDER BY 
//             latest_activity DESC`