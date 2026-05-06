const prisma = require('../lib/prisma');

// Add an action item
exports.addActionItem = async (req, res) => {
    const { meeting_id, description } = req.body;
    if (!meeting_id || !description) return res.status(400).json({ error: 'Meeting ID and description are required' });

    try {
        const actionItem = await prisma.actionItem.create({
            data: {
                meeting_id: parseInt(meeting_id),
                description,
                status: 'pending',
            },
        });
        res.status(201).json(actionItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mark action item as done
exports.markAsDone = async (req, res) => {
    const { id } = req.params;
    try {
        const actionItem = await prisma.actionItem.update({
            where: { id: parseInt(id) },
            data: { status: 'done' },
        });
        res.status(200).json(actionItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
