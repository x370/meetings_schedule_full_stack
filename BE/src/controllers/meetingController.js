const meetingService = require('../services/meetingService');
const { meetingSchema } = require('../schemas');

const getMeetings = async (req, res) => {
    try {
        const meetings = await meetingService.getAllMeetings();
        res.status(200).json(meetings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getMeetingById = async (req, res) => {
    try {
        const meeting = await meetingService.getMeetingById(req.params.id);
        res.status(200).json(meeting);
    } catch (err) {
        const status = err.message === 'Meeting not found' ? 404 : 500;
        res.status(status).json({ error: err.message });
    }
};

const createMeeting = async (req, res) => {
    try {
        const validatedData = meetingSchema.parse(req.body);
        const meeting = await meetingService.createNewMeeting(validatedData);
        res.status(201).json(meeting);
    } catch (err) {
        const status = err.name === 'ZodError' ? 400 : 500;
        res.status(status).json({ error: err.errors || err.message });
    }
};

const deleteMeeting = async (req, res) => {
    try {
        await meetingService.deleteMeeting(req.params.id);
        res.status(200).json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getMeetings, getMeetingById, createMeeting, deleteMeeting };