import Generation from '../models/Generation.js';
import User from '../models/User.js';

export async function usageReport(_req, res, next) {
  try {
    const [byUser, totals] = await Promise.all([
      Generation.aggregate([
        { $group: { _id: '$user', totalGenerations: { $sum: 1 }, resumeCount: { $sum: { $cond: [{ $eq: ['$type', 'resume'] }, 1, 0] } }, interviewCount: { $sum: { $cond: [{ $eq: ['$type', 'interview'] }, 1, 0] } } } },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
        { $unwind: '$user' },
        { $project: { name: '$user.name', email: '$user.email', totalGenerations: 1, resumeCount: 1, interviewCount: 1 } },
        { $sort: { totalGenerations: -1 } }
      ]),
      Promise.all([User.countDocuments(), Generation.countDocuments()])
    ]);
    res.json({ totalUsers: totals[0], totalGenerations: totals[1], usageByUser: byUser });
  } catch (e) { next(e); }
}
