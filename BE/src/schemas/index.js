const { z } = require('zod');

const meetingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  notes: z.string().optional(),
});

const actionItemSchema = z.object({
  meeting_id: z.number().int().positive(),
  description: z.string().min(1, "Description is required"),
});

module.exports = {
  meetingSchema,
  actionItemSchema
};
