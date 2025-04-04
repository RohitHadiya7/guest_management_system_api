import mongoose from 'mongoose'

const GuestSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  email: { type: String, required: true },
  rsvpStatus: { type: String, enum: ['Pending', 'Accepted', 'Declined'], default: 'Pending' },
  rsvpToken: { type: String, unique: true },
})

const Guest = mongoose.model('Guest', GuestSchema)

export default Guest