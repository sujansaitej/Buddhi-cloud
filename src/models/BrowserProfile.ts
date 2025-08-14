import mongoose, { Schema } from 'mongoose'

const BrowserProfileSchema = new Schema({
  profile_id: { type: String, required: true, unique: true },
  profile_name: { type: String, required: true },
  description: { type: String, default: '' },
  persist: { type: Boolean, default: true },
  ad_blocker: { type: Boolean, default: true },
  proxy: { type: Boolean, default: true },
  proxy_country_code: { type: String, default: 'US' },
  browser_viewport_width: { type: Number, default: 1280 },
  browser_viewport_height: { type: Number, default: 960 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

BrowserProfileSchema.pre('save', function (next) {
  this.set('updated_at', new Date())
  next()
})

export default mongoose.models.BrowserProfile || mongoose.model('BrowserProfile', BrowserProfileSchema)



