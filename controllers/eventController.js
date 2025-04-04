import Event from '../models/Event.js'
import Guest from '../models/Guest.js'
import emailService from '../services/emailService.js'
import crypto from 'crypto'

const createEvent = async (req, res) => {
  try {
    const event = new Event({
      userId: req.user._id,
      name: req.body.name,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
    })
    await event.save()
    res.status(201).json(event)
  } catch (error) {
    console.error("Error creating event:", error)
    res.status(500).send('Error creating event')
  }
}

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user._id })
    res.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    res.status(500).send('Error fetching events')
  }
}

const getEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.user._id })
    if (!event) {
      return res.status(404).send('Event not found')
    }
    res.json(event)
  } catch (error) {
    console.error("Error fetching event:", error)
    res.status(500).send('Error fetching event')
  }
}

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    )
    if (!event) {
      return res.status(404).send('Event not found')
    }
    res.json(event)
  } catch (error) {
    console.error("Error updating event:", error)
    res.status(500).send('Error updating event')
  }
}

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    if (!event) {
      return res.status(404).send('Event not found')
    }
    await Guest.deleteMany({ eventId: req.params.id })
    res.send('Event deleted')
  } catch (error) {
    console.error("Error deleting event:", error)
    res.status(500).send('Error deleting event')
  }
}

const inviteGuest = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.body.eventId, userId: req.user._id })
    if (!event) {
      return res.status(404).send('Event not found or you do not have permission')
    }

    const rsvpToken = crypto.randomBytes(20).toString('hex')
    const guest = new Guest({
      eventId: req.body.eventId,
      email: req.body.email,
      rsvpToken: rsvpToken,
    })
    await guest.save()

    const rsvpLink = `${process.env.FRONTEND_URL}/rsvp/${rsvpToken}`
    await emailService.sendInvitationEmail(req.body.email, event.name, rsvpLink)
    res.status(201).json(guest)
  } catch (error) {
    console.error("Error inviting guest:", error)
    res.status(500).send('Error inviting guest')
  }
}

const rsvpGuest = async (req, res) => {
  try {
    const guest = await Guest.findOne({ rsvpToken: req.params.token })
    if (!guest) {
      return res.status(404).send('Invalid RSVP token')
    }

    guest.rsvpStatus = req.body.rsvpStatus
    await guest.save()

    res.send('RSVP updated successfully!')
  } catch (error) {
    console.error("Error updating RSVP status:", error)
    res.status(500).send('Error updating RSVP status')
  }
}

const getGuestsForEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.eventId, userId: req.user._id })
    if (!event) {
      return res.status(404).send('Event not found or you do not have permission')
    }

    const guests = await Guest.find({ eventId: req.params.eventId })
    res.json(guests)
  } catch (error) {
    console.error("Error fetching guests:", error)
    res.status(500).send('Error fetching guests')
  }
}

const getRsvpPage = async (req, res) => {
  try {
    const guest = await Guest.findOne({ rsvpToken: req.params.token })

    if (!guest) {
      return res.status(404).json({ message: 'Invalid RSVP token' })
    }

    const event = await Event.findById(guest.eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    let responseData = {
      event: {
        name: event.name,
        date: event.date,
        time: event.time,
        location: event.location,
      },
    };

    if (guest.rsvpStatus === 'Accepted' || guest.rsvpStatus === 'Declined') {
      responseData.show = 'no';
    }

    res.json(responseData);
  } catch (error) {
    console.error('Error displaying RSVP options:', error);
    res.status(500).json({ message: 'Error displaying RSVP options' });
  }
};

export {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  inviteGuest,
  rsvpGuest,
  getGuestsForEvent,
  getRsvpPage
}