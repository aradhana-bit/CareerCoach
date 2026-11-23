import Profile from '../models/Profile.js';
import Generation from '../models/Generation.js';
import { generateResume, generateInterview } from '../services/aiService.js';

export async function resume(req, res, next) {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(400).json({ message: 'Complete your profile first' });
    const content = await generateResume(profile, req.user.name);
    const record = await Generation.create({ user: req.user._id, type: 'resume', inputSnapshot: profile.toObject(), content });
    res.status(201).json({ generation: record });
  } catch (e) { next(e); }
}
export async function interview(req, res, next) {
  try {
    const role = (req.body.role || '').trim();
    if (!role) return res.status(400).json({ message: 'Please select a target role' });
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(400).json({ message: 'Complete your profile first' });
    const content = await generateInterview(profile, role);
    const record = await Generation.create({ user: req.user._id, type: 'interview', targetRole: role, inputSnapshot: profile.toObject(), content });
    res.status(201).json({ generation: record });
  } catch (e) { next(e); }
}
export async function history(req, res, next) {
  try {
    const generations = await Generation.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100);
    res.json({ generations });
  } catch (e) { next(e); }
}
