import {Router} from 'express';
// import { sample_users } from '../data';
const sample_users=require('../data')
import asyncHandler from 'express-async-handler';
import jwt from "jsonwebtoken";
import { User, UserModel } from '../models/user.model';
// import { HTTP_BAD_REQUEST } from '../constants/Http_Status';
const HTTP_BAD_REQUEST = require('../constants/Http_Status');
import { CourseModel } from '../models/course.model';
const router=Router();

router.get("/seed",asyncHandler(
    async(req,res)=>{
        const usersCount = await UserModel.countDocuments();
        if(usersCount > 0){
            res.send("Seed is already done");
            return;
        }
        await UserModel.create(sample_users);
        res.send("Seed Is Done!");
    }));
    

router.post("/login",asyncHandler(async(req,res)=>{
    // const body=req.body;
    const {email,password} = req.body;
    const user = await UserModel.findOne({email,password});

    if(user){
        res.send(generateTokenResponse(user));
    }else{
        res.status(HTTP_BAD_REQUEST).send("user name or password is not valid!");
    }
}))

router.post('/register',asyncHandler(
    async(req,res)=>{
        const {name,email,password,phone} = req.body;
        const user = await UserModel.findOne({email});
        if(user){
            res.send(HTTP_BAD_REQUEST)
            .send("User is already exist, please login!");
            return;
        }
        const newUser:User = {
            id:'',
            email: email.toLowerCase(),
            password,
            name,
            phone,
            enrolled_courses:[],
            completed_courses:[],
            isAdmin:false
        }

        const dbUser = await UserModel.create(newUser);
        res.send(generateTokenResponse(dbUser));
    }
))

router.get("/:id",asyncHandler(async(req,res)=>{
    const user = await UserModel.findById(req.params.id);
    res.send(user);
}))

router.put("/enroll",asyncHandler(async(req,res)=>{
    console.log("update url");
    let u_id=req.body.u_id;
    let c_id=req.body.c_id;
    const ack = await UserModel.updateMany({_id:u_id},{$push:{"enrolled_courses":c_id}});
    res.send(ack);
}))

router.get("/enrolled/:id",asyncHandler(async(req,res)=>{
    // console.log("get url");
    const user = await UserModel.findOne({_id:req.params.id});
    if(!user){
        res.send("invalid user");
        return;
    }
    const courses = await CourseModel.find({_id:user.enrolled_courses});
    res.send(courses);
}))

router.get("/completed/:id",asyncHandler(async(req,res)=>{
    const user = await UserModel.findOne({_id:req.params.id});
    if(!user){
        res.send("invalid user");
        return;
    }
    const courses = await CourseModel.find({_id:user.completed_courses});
    res.send(courses);
}))



router.put("/complete/:u_id/:c_id",asyncHandler(async (req,res)=>{
    
    const ack = await UserModel.updateMany({_id:req.params.u_id},{$push:{"completed_courses":req.params.c_id}});
    res.send(ack);
}))

router.delete("/unenroll/:u_id/:c_id",asyncHandler(async(req,res)=>{
    const ack = await UserModel.updateMany({_id:req.params.u_id},{$pull:{"enrolled_courses":req.params.c_id}});
    res.send(ack);
}))

const generateTokenResponse = (user:any)=>{
    const token = jwt.sign({
        email:user.email,isAdmin:user.isAdmin
    },"SomeRandomText",{
        expiresIn:"30d"
    });
    user.token=token;
    return user;
}

export default router;