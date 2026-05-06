const actionRepository = require('../repositories/actionRepository');

const actionService = {
  async addActionItem(data) {
    return await actionRepository.create(data);
  },

  async toggleActionStatus(id) {
    const item = await actionRepository.findById(id);
    if (!item) throw new Error('Task not found');

    const newStatus = item.status === 'done' ? 'pending' : 'done';
    return await actionRepository.updateStatus(id, newStatus);
  },

  async removeActionItem(id) {
    return await actionRepository.delete(id);
  }
};

module.exports = actionService;
