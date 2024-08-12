import { asyncHandler } from "../utils/asyncHandler.js";
import { Todo } from "../models/todo.models.js";

import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const todoTestAPI = asyncHandler(async(req, res)=> {
    const { todoData } = req.body;

    return res
    .status(200)
    .json(new ApiResponse(200, {name: "Abhishek"}, "Successful"))
})

const createTodo = asyncHandler(async(req, res) => {
    //get todo details
    //validate
    //take user._id from auth middleware(req.user)
    //create new todo for the userid

    const { title, description } = req.body;
    console.log("Received fields: ", {title, description});

    if (!title || !description) {
        throw new ApiError(400, "All fields are required");

    }

    try {
        const todoEntry = await Todo.create({
            title,
            description,
            ownerId: req.user?._id
        })
        
    } catch (error) {
        throw new ApiError(500, "Issue in creating Todo!", error)
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Todo created successfully"));


})

const updateTodo = asyncHandler( async(req, res)=>{
    //enter the id of the todo to be updated in params
    //enter new title and description
    //validate
    //check in datbase with the id of the todo with findByIdAndUpdate


    //findByIdAndUpdate:-
    let { todoId } = req.params
    todoId = String(todoId)
    console.log(todoId)

    const { title, description } = req.body

    await Todo.findByIdAndUpdate(
        todoId,
        {

            $set: {
                title,
                description
            },
            
        },
        {new: true}

    )

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Todo Updated Successfully"))

    // findbyId:-
    // let { todoId } = req.params;
    // todoId = String(todoId);

    // const { title, description } = req.body;

    // const fetchedDbTodo = await Todo.findById(todoId);

    // if (!fetchedDbTodo) {
    //     throw new ApiError(400, "Todo not found");
    // }

    // fetchedDbTodo.title = title,
    // fetchedDbTodo.description = description;
    // await fetchedDbTodo.save();

    // return res
    // .status(200)
    // .json(new ApiResponse(200, {}, "Todo updated successfully"))
    



    
})

const fetchAllTodos = asyncHandler(async(req, res) => {
    //get userId from req.user._id through jwt
    //use find keyword to find respective todos in the databases

    const allTodos = await Todo.find({ ownerId: req.user?._id, status: true });
    console.log(allTodos);

    if (allTodos.length === 0) {
        return res
        .status(404)
        .json(new ApiResponse(404, {}, "No todos found for this user"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200, allTodos, "Todos fetched successfully"))





})

const trashTodo = asyncHandler( async(req, res)=> {
    //take todoId from params and validate
    //use findByIdAndUpdate to find the todo in the db and make the status "false"

    let { todoId } = req.params;
    todoId = String(todoId);

    if (!todoId) {
        throw new ApiError(400, "todoId is required in params")

    }

    await Todo.findByIdAndUpdate(
        todoId,
        {

            $set: {
                status: false
            },
            
        },
        {new: true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Todo moved to trash"))



})

const deleteTodo = asyncHandler(async(req, res)=> {

    const { todoId } = req.params;

    if (!todoId) {
        throw new ApiError(400, "todoId is required in params")
    }

    const todoExists = await Todo.findById(todoId);

    if (!todoExists) {
        throw new ApiError(400, "Todo not found");
    }

    await Todo.findByIdAndDelete(todoId);

    return res
    .status(200)
    .json(new ApiResponse(200, {deletedTodo: todoExists}, "Todo deleted successfully"))
})

const retrieveTodo = asyncHandler(async(req, res)=> {
    let { todoId } = req.params;
    todoId = String(todoId);

    if (!todoId) {
        throw new ApiError(400, "todoId is required in params");
    }

    const trashedTodo = await Todo.find({ _id: todoId, status: false })
    
    if (!trashTodo) {
        throw new ApiError(400, "No trashed todo with this id was found")
    }

    await Todo.findByIdAndUpdate(
        todoId,
        {

            $set: {
                status: true
            },
            
        },
        {new: true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, {retrievedTodo: trashedTodo}, "Todo retrieved successfully"))


})

const shareTodo = asyncHandler(async(req, res) => {

    //take sharable todoId from params
    //take the receiverUserId from req.body
    //validate for the user through ownerId of "Todo" or the _id of "User"
    //make a clone of the todo and assign the receiverUserId to its ownerId

    let { todoId } = req.params;
    todoId = String(todoId);

    const sharableTodo = await Todo.findById(todoId);
    if (!sharableTodo) {
        throw new ApiError(400, "No todo found with the given id");
    }

    let { receiverUserId } = req.body;
    receiverUserId = String(receiverUserId);

    const receiver = await Todo.find({ownerId: receiverUserId});

    if (!receiver) {
        throw new ApiError(400, "No receiver found with the given id");
    }

    const cloneTodo = await Todo.create({
        title: sharableTodo.title,
        description: sharableTodo.description,
        ownerId: receiverUserId 
    })
        

    return res
    .status(200)
    .json(new ApiResponse(200, {sharedTodo: cloneTodo}, "Todo shared successfully"))






})

export{
    todoTestAPI,
    createTodo,
    updateTodo,
    fetchAllTodos,
    trashTodo,
    deleteTodo,
    retrieveTodo,
    shareTodo
}