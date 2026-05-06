const prisma = require('../lib/prisma');

const meetingRepository = {
  async findAll() {
    return await prisma.meeting.findMany({
      orderBy: { date_time: 'desc' },
      include: { action_items: true }
    });
  },

  async findById(id) {
    return await prisma.meeting.findUnique({
      where: { id: parseInt(id) },
      include: { action_items: true }
    });
  },

  async create(data) {
    return await prisma.meeting.create({
      data: {
        title: data.title,
        notes: data.notes || ""
      }
    });
  },

  async delete(id) {
    return await prisma.meeting.delete({
      where: { id: parseInt(id) }
    });
  }
};

module.exports = meetingRepository;
