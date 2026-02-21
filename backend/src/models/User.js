const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: [true,'Name required'], trim: true },
  email:    { type: String, required: [true,'Email required'], unique: true, lowercase: true },
  password: { type: String, required: [true,'Password required'], minlength: 8, select: false },
  role:     { type: String, enum: ['customer','admin'], default: 'customer' },
  phone:    { type: String, default: '' },
  address:  { type: String, default: '' },
  dob:      { type: String, default: '' },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function(entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
