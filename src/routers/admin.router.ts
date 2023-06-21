import asyncHandler from 'express-async-handler';
import { CourseModel, course } from '../models/course.model';
import { query } from 'express';

const express = require("express");
const router = express.Router();

router.post("/addcourse",asyncHandler(async (req,res)=>{
     let {name,instructor,tags,description,topics,imageUrl}=req.body;
     tags=tags.split(",");
     topics=topics.split(",");
     const course:course = {
        id:'',
        name,
        instructor,
        tags,
        description,
        topics,
        imageUrl
     };
     const newCourse = await CourseModel.create(course);
     res.send(newCourse);
}));

router.get("/course/:id",asyncHandler(async (req,res)=>{
    const course=await CourseModel.findById(req.params.id);
    res.send(course);
}));

// router.get("/:courseId",asyncHandler(async(req,res)=>{
//     const course = await CourseModel.findById(req.params.courseId);
//     res.send(course);
// }));

router.put("/edit/:id",asyncHandler(async (req,res)=>{
    let {name,instructor,tags,description,topics,imageUrl}=req.body;
    tags=tags.split(",");
    topics=topics.split(",");
    const course={name,instructor,tags,description,topics,imageUrl};
    // console.log(course);
    const ack=await CourseModel.updateMany({_id:req.params.id},{$set:{
        "name":name,
        "instructor":instructor,
        "tags":tags,
        "description":description,
        "topics":topics,
        "imageUrl":imageUrl
    }});
    res.send(ack);
}));

router.delete("/remove/:id",asyncHandler(async (req,res)=>{
    const ack=await CourseModel.deleteOne({_id:req.params.id});
    res.send(ack);
}));

export default router;