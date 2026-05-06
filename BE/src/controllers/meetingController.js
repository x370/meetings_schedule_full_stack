const prisma = require('../lib/prisma');

// Create a meeting
exports.createMeeting = async (req, res) => {
    const { title, notes, date_time } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    try {
        const meeting = await prisma.meeting.create({
            data: {
                title,
                notes,
                date_time: date_time ? new Date(date_time) : new Date(),
            },
        });
        res.status(201).json(meeting);
    } catch (err) {
        console.error('❌ Prisma Error (createMeeting):', err);
        res.status(500).json({ error: err.message });
    }
};

// List all meetings
exports.getMeetings = async (req, res) => {
    try {
        const meetings = await prisma.meeting.findMany({
            orderBy: {
                date_time: 'desc',
            },
            include: {
                action_items: true,
            },
        });
        res.status(200).json(meetings);
    } catch (err) {
        console.error('❌ Prisma Error (getMeetings):', err);
        res.status(500).json({ error: err.message });
    }
};

// Get single meeting with action items
exports.getMeetingById = async (req, res) => {
    const { id } = req.params;
    try {
        const meeting = await prisma.meeting.findUnique({
            where: { id: parseInt(id) },
            include: {
                action_items: true,
            },
        });
        
        if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
        res.status(200).json(meeting);
    } catch (err) {
        console.error('❌ Prisma Error (getMeetingById):', err);
        res.status(500).json({ error: err.message });
    }
};
