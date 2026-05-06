const prisma = require('../lib/prisma');

const actionRepository = {
  async findById(id) {
    return await prisma.actionItem.findUnique({
      where: { id: parseInt(id) }
    });
  },

  async create(data) {
    return await prisma.actionItem.create({
      data: {
        meeting_id: data.meeting_id,
        description: data.description,
        status: 'pending'
      }
    });
  },

  async updateStatus(id, status) {
    return await prisma.actionItem.update({
      where: { id: parseInt(id) },
      data: { status }
    });
  },

  async delete(id) {
    return await prisma.actionItem.delete({
      where: { id: parseInt(id) }
    });
  }
};

module.exports = actionRepository;
