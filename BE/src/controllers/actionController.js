const actionService = require('../services/actionService');
const { actionItemSchema } = require('../schemas');

exports.addActionItem = async (req, res) => {
    try {
        const validatedData = actionItemSchema.parse(req.body);
        const item = await actionService.addActionItem(validatedData);
        res.status(201).json(item);
    } catch (err) {
        const status = err.name === 'ZodError' ? 400 : 500;
        res.status(status).json({ error: err.errors || err.message });
    }
};

exports.markAsDone = async (req, res) => {
    try {
        const item = await actionService.toggleActionStatus(req.params.id);
        res.status(200).json(item);
    } catch (err) {
        const status = err.message === 'Task not found' ? 404 : 500;
        res.status(status).json({ error: err.message });
    }
};

exports.deleteActionItem = async (req, res) => {
    try {
        await actionService.removeActionItem(req.params.id);
        res.status(200).json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
