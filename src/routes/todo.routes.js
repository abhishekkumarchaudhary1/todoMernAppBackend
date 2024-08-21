import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTodo, deleteTodo, fetchActiveTodos, fetchTrashedTodos, retrieveTodo, shareTodo, todoTestAPI, trashTodo, updateTodo } from "../controllers/todo.controller.js";

const router = Router();

router.route("/todo-test-api").get(todoTestAPI)

router.route("/create-todo").post(verifyJWT, createTodo)

router.route("/update-todo/:todoId").post(verifyJWT, updateTodo)

router.route("/fetch-active-todos").get(verifyJWT, fetchActiveTodos)

router.route("/trash-todo/:todoId").post(verifyJWT, trashTodo)

router.route("/fetch-trashed-todos").get(verifyJWT, fetchTrashedTodos)

router.route("/delete-todo/:todoId").delete(verifyJWT, deleteTodo)

router.route("/retrieve-todo/:todoId").post(verifyJWT, retrieveTodo)

router.route("/share-todo/:todoId").post(verifyJWT, shareTodo)

export default router;