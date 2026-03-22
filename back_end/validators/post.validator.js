import Joi from "joi";
import { objectIdSchema } from "../middleware/validate.js";

export const createPostSchema = Joi.object({
  title: Joi.string().trim().min(5).max(120).required(),
  description: Joi.string().trim().min(10).max(3000).required(),
  price: Joi.number().min(0).max(1000000000).required(),
  images: Joi.array().items(Joi.string().trim().uri()).max(5).optional(),
});

export const updatePostSchema = Joi.object({
  title: Joi.string().trim().min(5).max(120).optional(),
  description: Joi.string().trim().min(10).max(3000).optional(),
  price: Joi.number().min(0).max(1000000000).optional(),
  images: Joi.array().items(Joi.string().trim().uri()).max(5).optional(),
}).min(1);

export const rejectPostSchema = Joi.object({
  reason: Joi.string().trim().min(3).max(255).optional(),
});

export const postIdParamsSchema = Joi.object({
  id: objectIdSchema,
});

export const myPostsQuerySchema = Joi.object({
  status: Joi.string().valid("all", "pending", "approved", "rejected", "sold").optional(),
});

export const moderationQuerySchema = Joi.object({
  status: Joi.string().valid("all", "pending", "approved", "rejected", "sold").optional(),
  search: Joi.string().trim().max(120).optional(),
  category: Joi.string().trim().max(120).optional(),
});

export const postsPublicQuerySchema = Joi.object({
  search: Joi.string().trim().max(120).optional(),
  category: Joi.string().trim().max(120).optional(),
});
