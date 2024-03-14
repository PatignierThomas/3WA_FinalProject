import Query from '../../model/Query.js';
import CustomError from '../../utils/customError/errorHandler.js';
import customSuccess from '../../utils/successRes.js';

// return the count of all the users, posts and replies
export const getStats = async (req, res) => {
    try {
        const stats = `
        SELECT 
            (SELECT COUNT(id) FROM users) AS total_users,
            (SELECT COUNT(id) FROM post) AS total_posts,
            (SELECT COUNT(id) FROM post_reply) AS total_replies;
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
            const query = ` SELECT sf.id, sf.subject, sf.status, sf.description, sf.game_section_id, COUNT(post.id) as post_count
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

// will generate a random password and update the user's password
// then send the new password to the user's email
// OR it could send a mail to the user with a link to reset the password




