import { connect, ConnectOptions } from "mongoose";

export const dbConnect = ()=>{
    connect('mongodb+srv://ndvkrishna9:TyFMOfMG2hkJAbVj@cluster0.odhuwov.mongodb.net/c_application_db?retryWrites=true&w=majority',{
       // useNewUrlParser: true,
       // iseUnifiedToplogy: true
    } as ConnectOptions ).then(
        ()=>console.log("connect successfully"),
        (error)=>console.log(error)
    )
}