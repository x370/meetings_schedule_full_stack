const meetingRepository = require('../repositories/meetingRepository');

const meetingService = {
  async getAllMeetings() {
    return await meetingRepository.findAll();
  },

  async getMeetingById(id) {
    const meeting = await meetingRepository.findById(id);
    if (!meeting) throw new Error('Meeting not found');
    return meeting;
  },

  async createNewMeeting(data) {
    return await meetingRepository.create(data);
  },

  async deleteMeeting(id) {
    return await meetingRepository.delete(id);
  }
};

module.exports = meetingService;
