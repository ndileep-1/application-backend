import {Router} from 'express';
// import { courses } from '../data';
const courses = require('../data');
import asyncHandler from 'express-async-handler';
import { CourseModel } from '../models/course.model';
const router=Router();

router.get("/seed",asyncHandler(
async(req,res)=>{
    const coursesCount = await CourseModel.countDocuments();
    if(coursesCount > 0){
        res.send("Seed is already done");
        return;
    }
    await CourseModel.create(courses);
    res.send("Seed Is Done!");
}));

router.get("/",asyncHandler(
    async(req,res)=>{
    const courses = await CourseModel.find();
    res.send(courses);
}));

router.get("/search/:searchTearm",asyncHandler(async(req,res)=>{
    const searchRegex = new RegExp(req.params.searchTearm,'i');
    const course = await CourseModel.find({name: {$regex:searchRegex}});
    res.send(course);
}));

router.get("/enrolled",asyncHandler(
    async(req,res)=>{
    const courses = await CourseModel.find({isenrolled:true});
    res.send(courses);
}));

router.get("/tags",asyncHandler(async(req,res)=>{
    const tags = await CourseModel.aggregate([
        {
            $unwind:'$tags'
        },
        {
            $group:{
                _id:'$tags',
                count:{$sum: 1}
            }
        },
        {
            $project:{
                _id: 0,
                name:'$_id',
                count: '$count'
            }
        }
    ]).sort({count:-1});

    const all = {
        name : 'All',
        count: await CourseModel.countDocuments()
    }
    tags.unshift(all);
    res.send(tags);
}));

router.get("/tags/:tagName",asyncHandler(async(req,res)=>{
    const course = await CourseModel.find({tags: req.params.tagName})
    res.send(course);
}));

router.get("/getcourse/:id",asyncHandler(async(req,res)=>{
    const course = await CourseModel.findOne({"_id":req.params.id});
    res.send(course);
}));

router.get("/:courseId",asyncHandler(async(req,res)=>{
    const course = await CourseModel.findById(req.params.courseId);
    res.send(course);
}));



export default router;