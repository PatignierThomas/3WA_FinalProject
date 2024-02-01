import pool from "../config/db.js";

class Query {
    static async run(query) {
        const [result] = await pool.execute(query);
        return result;
    }

    static async runWithParams(query, datas) {
        const [result] = await pool.execute(query, datas);
        return result;
    }
}

export default Query;