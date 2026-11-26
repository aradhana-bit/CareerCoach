import { pool } from '../config/db.js';
import { generateResume, generateInterview } from '../services/aiService.js';
const profileFields = `id AS "_id",user_id AS "user",headline,education,skills,experience,projects,target_role AS "targetRole",created_at AS "createdAt",updated_at AS "updatedAt"`;
const generationFields = `id AS "_id",user_id AS "user",type,target_role AS "targetRole",input_snapshot AS "inputSnapshot",content,created_at AS "createdAt",updated_at AS "updatedAt"`;
async function getProfile(userId) {
  const result = await pool.query(`SELECT ${profileFields} FROM profiles WHERE user_id=$1`, [userId]);
  return result.rows[0] || null;
}
async function saveGeneration(userId,type,targetRole,profile,content) {
  const result = await pool.query(`INSERT INTO generations (user_id,type,target_role,input_snapshot,content)
    VALUES ($1,$2,$3,$4::jsonb,$5::jsonb) RETURNING ${generationFields}`,
    [userId,type,targetRole,JSON.stringify(profile),JSON.stringify(content)]);
  return result.rows[0];
}
export async function resume(req, res, next) {
  try {
    const profile = await getProfile(req.user.id);
    if (!profile) return res.status(400).json({ message: 'Complete your profile first' });
    const content = await generateResume(profile, req.user.name);
    const generation = await saveGeneration(req.user.id,'resume','',profile,content);
    res.status(201).json({ generation });
  } catch (error) { next(error); }
}
export async function interview(req, res, next) {
  try {
    const role = String(req.body.role || '').trim();
    if (!role) return res.status(400).json({ message: 'Please select a target role' });
    const profile = await getProfile(req.user.id);
    if (!profile) return res.status(400).json({ message: 'Complete your profile first' });
    const content = await generateInterview(profile,role);
    const generation = await saveGeneration(req.user.id,'interview',role,profile,content);
    res.status(201).json({ generation });
  } catch (error) { next(error); }
}
export async function history(req, res, next) {
  try {
    const result = await pool.query(`SELECT ${generationFields} FROM generations WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100`, [req.user.id]);
    res.json({ generations: result.rows });
  } catch (error) { next(error); }
}