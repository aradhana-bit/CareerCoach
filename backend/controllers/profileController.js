import { pool } from '../config/db.js';
const profileFields = `id AS "_id",user_id AS "user",headline,education,skills,experience,projects,target_role AS "targetRole",created_at AS "createdAt",updated_at AS "updatedAt"`;
export async function getMyProfile(req, res, next) {
  try {
    const result = await pool.query(`SELECT ${profileFields} FROM profiles WHERE user_id=$1`, [req.user.id]);
    res.json({ profile: result.rows[0] || null });
  } catch (error) { next(error); }
}
export async function saveMyProfile(req, res, next) {
  try {
    const allowed = ['headline','education','skills','experience','projects','targetRole'];
    const data = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const values = {
      headline: typeof data.headline === 'string' ? data.headline.slice(0,160) : '',
      education: Array.isArray(data.education) ? data.education : [],
      skills: Array.isArray(data.skills) ? data.skills : [],
      experience: Array.isArray(data.experience) ? data.experience : [],
      projects: Array.isArray(data.projects) ? data.projects : [],
      targetRole: typeof data.targetRole === 'string' ? data.targetRole : ''
    };
    const result = await pool.query(`INSERT INTO profiles (user_id,headline,education,skills,experience,projects,target_role)
      VALUES ($1,$2,$3::jsonb,$4::jsonb,$5::jsonb,$6::jsonb,$7)
      ON CONFLICT (user_id) DO UPDATE SET headline=EXCLUDED.headline,education=EXCLUDED.education,skills=EXCLUDED.skills,experience=EXCLUDED.experience,projects=EXCLUDED.projects,target_role=EXCLUDED.target_role,updated_at=NOW()
      RETURNING ${profileFields}`, [req.user.id,values.headline,JSON.stringify(values.education),JSON.stringify(values.skills),JSON.stringify(values.experience),JSON.stringify(values.projects),values.targetRole]);
    res.json({ profile: result.rows[0] });
  } catch (error) { next(error); }
}