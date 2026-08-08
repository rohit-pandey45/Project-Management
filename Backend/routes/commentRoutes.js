import express from "express";
import { addComment, getTaskComment } from "../controllers/commentController.js";


const commentRouter = express.Router()
commentRouter.post('/', addComment);
commentRouter.post('/:taskId', getTaskComment);


export default commentRouter