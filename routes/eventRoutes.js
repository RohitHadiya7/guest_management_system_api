import express from 'express'
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  inviteGuest,
  rsvpGuest,
  getGuestsForEvent,
  getRsvpPage
} from '../controllers/eventController.js'
import authenticateToken from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', authenticateToken, createEvent)
router.get('/', authenticateToken, getEvents)
router.get('/:id', authenticateToken, getEvent)
router.put('/:id', authenticateToken, updateEvent)
router.delete('/:id', authenticateToken, deleteEvent)
router.post('/guests', authenticateToken, inviteGuest)
router.post('/rsvp/:token', rsvpGuest)
router.get('/rsvp/:token', getRsvpPage) 
router.get('/:eventId/guests', authenticateToken, getGuestsForEvent)

export default router