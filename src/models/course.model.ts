import { Schema, model } from "mongoose"

export interface course{
    id:string,
    name:string,
    instructor:string,
    tags:string[],
    description:string,
    topics:string[],
    imageUrl?:string
}

export const CourseSchema = new Schema<course>(
    {
        name: {type:String, required:true},
        instructor: {type:String, required:true},
        tags: {type:[String]},
        description: {type:String, required:true},
        topics: {type:[String], required:true},
        imageUrl: {type:String, required:false}
    },{
        toJSON:{
            virtuals:true
        },
        toObject:{
            virtuals:true
        },
        timestamps:true
    }
);

export const CourseModel = model<course>('course',CourseSchema);