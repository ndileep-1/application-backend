import { Schema, model } from "mongoose"

export interface User{
    id:string;
    email:string;
    password:string;
    name:string;
    phone:string;
    enrolled_courses?:string[];
    completed_courses?:string[];
    isAdmin:boolean;
};

export const UserSchema = new Schema<User>({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    phone:{type:String,required:true},
    enrolled_courses:{type:[String],required:false},
    completed_courses:{type:[String],required:false},
    isAdmin:{type:Boolean,required:true},
},{
    timestamps:true,
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    }
})

export const UserModel = model<User>('user',UserSchema);