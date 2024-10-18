const express=require("express");
const mongoose=require("mongoose");
const app=express();
// let port=8080;
// const port = process.env.PORT || 8080;
const path=require("path");
const { emit } = require("process");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.listen(8000,()=>{
    console.log("port working successfully");
});
app.get("/index",(req,res)=>{
    res.render("index.ejs");
});

app.post("/index/home",(req,res)=>{
   let {who}=req.body;
   if(who==="warden"){
    res.render("loginwarden.ejs");
   }
   if(who==="student"){
    res.render("loginstudent.ejs");
   }
});

app.get("/home/contact",(req,res)=>{
    res.render("contact.ejs");
})

app.get("/home/registerstudent",(req,res)=>{
    res.render("registerstudent.ejs");
})

app.get("/home/registerwarden",(req,res)=>{
    res.render("registerwarden.ejs");
})



// app.get("/home/loginstudent",(req,res)=>{
//     res.render("loginstudent.ejs");
// });

app.get("/home/loginwarden",(req,res)=>{
    res.render("loginwarden.ejs");
});
// home_stud
// ********** db connection******//

mongoose.connect("mongodb://127.0.0.1:27017/project");
                                                                //student database;

const schema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        pattern: "^b1[0-9]{5}@rgukt\\.ac\\.in$",
    },
    password: {
        type:String,
        required:true,
    }
});

let stud=new mongoose.model("student",schema);

app.post("/home/registerstudent",async (req,res)=>{
    
    try{

    let {username,email,password}=req.body;
    let temp=await stud.findOne({email:email});
    let temp2=await stud.findOne({username:username});
    if(temp!=null){
        res.send("Email already registered..! Please do login.");
    }
    else if(temp2!=null){
        res.send("username already exists. Try another name...!");User
    }
    else{
        
        let s=new stud({
            username: username,
            email: email,
            password : password
        });

     await s.save();
     let check=await stud.findOne({username:username});
    res.render("complaint.ejs",{check}); 
    } 

}catch(err){
    console.log("registration failed..!");
}
});


//*****warden database */

const schema2=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password: {
        type:String,
        required:true,
    }
});

let ward=new mongoose.model("warden",schema);

app.post("/home/registerwarden",async (req,res)=>{
    let {username,email,password}=req.body;
  //  console.log(password);
    let w=new ward({
        username: username,
        email: email,
        password : password
    });
   await w.save();
    let check=await ward.findOne({username:username,password:password})
    let count=await complaint.find().countDocuments();
//    console.log("successful");
 // alert("registration successful");
 complaint.find().then((result)=>{
    res.render("viewcomplaint.ejs",{check,result,count}); }).catch((err)=>{
        console.log("error:",err);
    });
});

// app.get("/home/loginwarden/viewcomplaint",(req,res)=>{
//     res.render("viewcomplaint.ejs");
// });

app.get("/index/database/student",(req,res)=>{
    stud.find().then((result)=>{
        res.render("stud_database.ejs",{result});
    }).catch((err)=>{
        console.log("error:",err);
    })
});

app.get("/index/database/warden",(req,res)=>{
    ward.find().then((result)=>{
        res.render("ward_database.ejs",{result});
    }).catch((err)=>{
        console.log("error:",err);
    })
});

// app.get("/home/loginstudent/complaint",(req,res)=>{
//     res.render("complaint.ejs");
// })


app.post("/home/loginstudent", async (req,res)=>{
   try{

    let{username,password}=req.body;
    let check=await stud.findOne({username:username,password:password})
    if(check==null){
        res.send("Your are not an authenticated user! Please do register first. If registered, enter your details correctly");
    }
    else{
        // 
        // prompt("login successful");
        res.render("complaint.ejs",{check});
    }
    
   } catch{
         console.log("wrong details entered ..!");
   }

});



// app.get("/home/loginwarden/viewcomplaint",(req,res)=>{
//     res.render("viewcomplaint.ejs");
// })

app.post("/home/loginwarden", async (req,res)=>{
   try{

    let{username,password}=req.body;
    let count=await complaint.find().countDocuments();
    let check=await ward.findOne({username:username,password:password})
    if(check==null){
        res.send("user authentication failed!!");
    }
    else{
        
         complaint.find().then((result)=>{
            res.render("viewcomplaint.ejs",{check,result,count});
        }).catch((err)=>{
            console.log("error:",err);
        })
        // res.render("viewcomplaint.ejs",{check});
    } 
    
   } catch{
         console.log("wrong details entered ..!");
   }

});

app.get("/home/loginstudent/complaint",async (req,res)=>{
    let {user1,user2}=req.query;
    // console.log(id);
    if(user1){
     res.render("comp.ejs",{user1});
    }
    if(user2){
        let count=await complaint.find({username:user2}).countDocuments();
        let check=await complaint.find({username:user2});
        res.render("studentview.ejs",{user2,check,count});
        
    }
});

app.post("/home/loginstudent/complaint/delete",async (req,res)=>{

    let {del,user2}=req.body;
    console.log(del);
    await complaint.deleteOne({_id:del})
    let check=await complaint.find({username:user2});
    let count=await complaint.find({username:user2}).countDocuments();
    res.render("studentview.ejs",{user2,check,count})

})
// app.get("home/loginstudent/complaint",(req,res)=>{
//     let {username}=req.query.username;
//     console.log(username);
//     res.render("comp.ejs",{username});
// })

app.get("/home/loginstudent/password",(req,res)=>{
    stud.find().then((result)=>{
        res.render("passstudent.ejs",{result});
    }).catch((err)=>{
        console.log("error:",err);
    })
});

app.post("/home/loginstudent/password",async (req,res)=>{
   try{
    let{email,password}=req.body;
    console.log(email);
    let check= await stud.updateOne({email:email},{$set :{password:password}})
    //check.update({email:email},{$set :{password:password}});
    if(check===null){
        res.send("wrong email.Enter correct emailid");
    }
    else{
        res.redirect("/index");
    }
   }catch(err){
      console.log("error",err);
   }
})


app.get("/home/loginwarden/password",(req,res)=>{
    stud.find().then((result)=>{
        res.render("passwarden.ejs",{result});
    }).catch((err)=>{
        console.log("error:",err);
    })
});

app.post("/home/loginwarden/password",async (req,res)=>{
   try{
    let{email,password}=req.body;
    console.log(email);
    let check= await ward.updateOne({email:email},{$set :{password:password}})
    //check.update({email:email},{$set :{password:password}});
    if(check===null){
        res.send("wrong email.Enter correct emailid");
    }
    else{
        res.redirect("/index");
    }
   }catch(err){
      console.log("error",err);
   }
})

const schema3=new mongoose.Schema({
    username:{
        type:String,
      
    },
    id:{
        type:String,
    },
    cat:{
        type:String,
        required:true,

    },
    hostel:{
        type:String,
        required:true,
    },
    wing:{
        type:String,
        required:true,
    },
    room:{
        type:String,
    },
    info:{
        type:String,
    },
    time:{
        type: String,
    },
    resolvedtime:{
        type: String,
    },
    Status:{
        type:String,
    }
});

let complaint=new mongoose.model("complaint",schema3);

app.post("/home/loginstudent/complaint/raisecomplaint",async (req,res)=>{
    let {cat,hostel,wing,room,info,username}=req.body;
    let temp=await stud.findOne({username:username});
    let a=new Date().toString().split(" ")[4];
    let b=new Date().toString().split(" ").slice(1,4).join(" ");
    console.log(a+b);
     let c=new complaint({
        username:username,
        id:temp.email.slice(0,7),
        cat:cat,
        hostel:hostel,
        wing:wing,
        room:room,
        info:info,
        time:a+",  "+b,
        resolvedtime:null,
        Status:"Pending",
     });

     c.save();
     let check=await stud.findOne({username:username});
     res.render("complaint.ejs",{check});
})
// app.get("/home/loginwarden/complaints",(req,res)=>{
//     res.render("wardenview.ejs");
// })
app.post("/home/loginwarden/complaints",async (req,res)=>{
     let {elec,carp,clean,user}=req.body;
     if(elec){
        let name=elec;
        let count=await complaint.find({cat:elec}).countDocuments();
        let check= await complaint.find({cat:elec});
        let scount=count;
         res.render("wardenview.ejs",{check,count,name,user,scount});
        // console.log(check);
     }
     if(carp){
        let name=carp;
        let count=await complaint.find({cat:carp}).countDocuments();
        let check= await complaint.find({cat:carp});
        let scount=count;
        res.render("wardenview.ejs",{check,count,name,user,scount});
        // console.log(carp);
     }
     if(clean){
        let name=clean;
        let count=await complaint.find({cat:clean}).countDocuments();
        let check= await complaint.find({cat:clean});
        let scount=count;
        res.render("wardenview.ejs",{check,count,name,user,scount});
        // console.log(clean);
     }
})

app.post("/home/loginwarden/complaints/status",async (req,res)=>{
    let{id,status,name,count,user}=req.body;
    if(status==="Resolved"){
        let a=new Date().toString().split(" ")[4];
        let b=new Date().toString().split(" ").slice(1,4).join(" ");
        let time=a+",  "+b;
        console.log(time);
    await complaint.updateOne({_id:id},{$set:{resolvedtime:time}});   }
    else if(status==="Rejected"){
        let a=new Date().toString().split(" ")[4];
        let b=new Date().toString().split(" ").slice(1,4).join(" ");
        let time=a+",  "+b;
        console.log(time);
    await complaint.updateOne({_id:id},{$set:{resolvedtime:time}});   }
await complaint.updateOne({_id:id},{$set:{Status:status}});
console.log("successful66");
console.log(name);
let scount=count;
if(name==="electrical"){
   
    let check= await complaint.find({cat:"electrical"});
     res.render("wardenview.ejs",{check,count,name,user,scount});
     console.log("successful");
 }
 if(name==="carpenter"){

    let check= await complaint.find({cat:"carpenter"});
    res.render("wardenview.ejs",{check,count,name,user,scount});
    // console.log(carp);
 }
 if(name==="cleaning"){   
    let check= await complaint.find({cat:"cleaning"});
    res.render("wardenview.ejs",{check,count,name,user,scount});
    // console.log(clean);
 }

});

app.post("/home/loginwarden/complaints/status/filter", async (req,res)=>{
    let {user,name,count,cstate}=req.body;
    let check=null;
    let scount=null;
    if(cstate==="temp"){
         check=await complaint.find({ })
         scount=await complaint.find({ }).countDocuments();
    }
    else{
     check=await complaint.find({Status:cstate,cat:name})
     scount=await complaint.find({Status:cstate,cat:name}).countDocuments(); }
    res.render("wardenview.ejs",{check,count,name,user,scount});
})

app.get("/home/loginstudent/logout",(req,res)=>{
    res.redirect("/index")
})

app.get("/home/loginwarden/logout",(req,res)=>{
    res.redirect("/index")
})