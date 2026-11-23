import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  headline: { type: String, trim: true, maxlength: 160, default: '' },
  education: [{ institution: String, degree: String, field: String, startYear: String, endYear: String }],
  skills: [{ type: String, trim: true }],
  experience: [{ company: String, title: String, description: String, startDate: String, endDate: String }],
  projects: [{ name: String, technologies: [String], description: String, link: String }],
  targetRole: { type: String, trim: true, default: '' }
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);
