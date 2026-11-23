import Profile from '../models/Profile.js';

export async function getMyProfile(req, res, next) {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    res.json({ profile });
  } catch (e) { next(e); }
}
export async function saveMyProfile(req, res, next) {
  try {
    const allowed = ['headline', 'education', 'skills', 'experience', 'projects', 'targetRole'];
    const data = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id }, { $set: data, $setOnInsert: { user: req.user._id } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json({ profile });
  } catch (e) { next(e); }
}
