import mongoose, { Schema } from 'mongoose'

const ScheduledTaskSchema = new Schema({
  id: { type: String, required: true, unique: true },
  task: { type: String, required: true },
  save_browser_data: { type: Boolean, default: false },
  structured_output_json: { type: String },
  llm_model: { type: String, default: 'gpt-4o' },
  use_adblock: { type: Boolean, default: true },
  use_proxy: { type: Boolean, default: true },
  highlight_elements: { type: Boolean, default: true },
  proxy_country_code: { type: String },
  browser_viewport_width: { type: Number },
  browser_viewport_height: { type: Number },
  max_agent_steps: { type: Number },
  enable_public_share: { type: Boolean, default: false },
  allowed_domains: { type: [String], default: undefined },
  included_file_names: { type: [String], default: undefined },
  secrets: { type: Schema.Types.Mixed },
  browser_profile_id: { type: String },
  // Recording settings (local persistence)
  enable_recordings: { type: Boolean, default: false },
  recording_quality: { type: String, enum: ['standard', 'high'], default: 'standard' },
  recording_fps: { type: Number, default: 15 },
  recording_resolution: { type: String, default: '1280x960' },
  schedule_type: { type: String, enum: ['interval', 'cron'], required: true },
  interval_minutes: { type: Number },
  cron_expression: { type: String },
  start_at: { type: Date },
  next_run_at: { type: Date },
  end_at: { type: Date },
  is_active: { type: Boolean, default: true },
  metadata: { type: Schema.Types.Mixed },
  created_at: { type: Date },
  updated_at: { type: Date }
})

export default mongoose.models.ScheduledTask || mongoose.model('ScheduledTask', ScheduledTaskSchema)


