import Query from '../../model/Query.js';
import { letterToIDRoleSwitch } from '../../utils/roleSwitch.js';
import CustomError from '../../utils/customError/errorHandler.js';
import customSuccess from '../../utils/successRes.js';

export const getStats = async (req, res) => {
    try {
        const stats = `
        SELECT 
            (SELECT COUNT(*) FROM users) AS total_users,
            (SELECT COUNT(*) FROM post) AS total_posts,
            (SELECT COUNT(*) FROM post_reply) AS total_replies;
        `;
        const data = await Query.run(stats);
        res.customSuccess(200, "Statistiques", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// get all the subjects of all games
export const allSubject = async (req, res, next) => {
    if (req.user) {
        try {
            const query = ` SELECT sf.id, sf.subject, sf.status, sf.game_section_id, COUNT(post.id) as post_count
                            FROM sub_forum sf
                            LEFT JOIN post ON sf.id = post.sub_forum_id
                            GROUP BY sf.id`;
            const data = await Query.run(query) 
            res.customSuccess(200, "Sujets", data);
        }
        catch (error) {
            const customError = new CustomError(500, "Database error", "Erreur serveur", error);
            return next(customError);
       }
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const query = "SELECT * FROM users";
        const data = await Query.run(query);
        res.customSuccess(200, "Utilisateurs", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// UNUSED
// will generate a random password and update the user's password
// then send the new password to the user's email
// OR it could send a mail to the user with a link to reset the password

// export const resetUserPassword = async (req, res) => {
//     const newPassword = "1234";
//     const hash = await bcrypt.hash(newPassword, Number(dotenv.SALT));

//     const updateUser = "UPDATE users SET password = ? WHERE id = ?";
//     const result = await Query.runWithParams(updateUser, [hash, req.params.id]);

//     res.json({result});
// }




