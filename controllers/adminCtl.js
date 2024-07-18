const admin=require("../models/admin_model")
const path = require('path');
const fs=require('fs');
const nodemailer = require("nodemailer");


const login= async(req,res)=>{
    res.clearCookie('admin');
    const captcha_code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"

    let captcha ="";
    
    for(var i=0; i<6; i++){
        captcha+= captcha_code.charAt(Math.round(Math.random()*captcha_code.length))
    }
    
    res.cookie('captcha',captcha)
    return res.render('login',{
        captchaCode:captcha
    })
    
}

const AdminLoginData = async(req,res)=>{
    console.log(req.body)
    checkEmail= await admin.findOne({email: req.body.email})
    if(checkEmail){
        if(checkEmail.password == req.body.password){
            if(req.cookies.captcha==req.body.captcha){
                res.clearCookie('captcha');
                res.cookie('admin', checkEmail )
                return res.redirect('/dashboard')
            }
            else{
                console.log("invelid captcha");
                return res.redirect("back");
            }
        }
        else{
            console.log("invelid password");
            return res.redirect("back");
            
        }
    }
    else{
        console.log("invelid email");
        return res.redirect("back");
    }
}

const dashboard= async(req,res)=>{
    if(req.cookies.admin==undefined){
        return res.redirect('/')
    }
    return res.render('dashboard',{
        adminCookies:req.cookies.admin
    })
}

const add_admin=async (req,res) =>{
    if(req.cookies.admin==undefined){
        return res.redirect('/')
    }
    return res.render('add_admin',{
        adminCookies:req.cookies.admin
    })
}

const view_admin = async (req,res)=> {
    if(req.cookies.admin==undefined){
        return res.redirect('/')
    }
    var viewData =await admin.find();
    return res.render('view_admin',{
        adminCookies:req.cookies.admin,
        viewData:viewData
    })
    
}

const adminInsertData = async(req,res)=>{
    console.log(req.body);
    console.log(req.file);
    var img = "";
    if (req.file) {
        img = admin.ipath + "/" + req.file.filename;
    }
    
    req.body.image = img;
    req.body.name=req.body.fname+" "+req.body.lname;
    
    
    await admin.create(req.body);
    return res.redirect("back");

}

const deleteAdminRecord = async(req,res)=>{
    const deteleAdmin = await admin.findById(req.params.id);

    if (deteleAdmin) {
        var ipath = path.join(__dirname,'..',deteleAdmin.image)
        await fs.unlinkSync(ipath);
    }
   
    await admin.findByIdAndDelete(req.params.id);
    return res.redirect('back');
}

const updateAdminRecord=async(req,res)=>{
    if(req.cookies.admin==undefined){
        return res.redirect('/')
    }
    let updatedata = await admin.findById(req.query.id);
     return res.render('update_Admin',{
        adminCookies:req.cookies.admin,
        admindata : updatedata
     })
}

const adminEditData =async(req,res)=>{
    const editData = await admin.findById(req.body.id);
     if(req.file){
          if (editData) {
               var ipath = path.join(__dirname,'..',editData.image);
               try{
                   await fs.unlinkSync(ipath);

               }
               catch(err){
                 console.log(err);
               }
          }
        
            req.body.image =admin.ipath+"/"+req.file.filename;
        
        }
        else{
            const editData = await admin.findById(req.body.id);
            if(editData){
                req.body.image = editData.image;
            }
        }
        
        req.body.name=req.body.fname+" "+req.body.lname; 
        
     await admin.findByIdAndUpdate(req.body.id,req.body);
     console.log(req.body.id,req.body)
     console.log(req.body.name);
     return res.redirect("/view_admin")
}

const profile= async(req,res)=>{
    if(req.cookies.admin==undefined){
        return res.redirect('/')
    }
    return res.render('profile',{
        adminCookies:req.cookies.admin
    })
}


const ForgetPassWord =async(req,res)=>{
    return res.render('ForgottenPassword');
}

const ForgottenPasswordForm=async(req,res)=>{
   
    const checkEmail=await admin.findOne({email:req.body.email})
if(checkEmail){
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: "asodariyashyam555@gmail.com",
          pass: "faziibbmovatlyqg",
        },
      });

      const otp=Math.round(Math.random()*1000000)
      res.cookie('otp',otp)
      res.cookie('email',req.body.email)

      const msg=`<h1>shyam admin penal</h1><h2>OTP : ${otp}</h2><br><a href="http://localhost:8008/loginforgottenpass">forgotten password</a>`

      const info = await transporter.sendMail({
        from: 'asodariyashyam555@gmail.com', // sender address
        to: req.body.email, // list of receivers
        subject: "Your OTP is here ✔", // Subject line
        text: "Hello world?", // plain text body
        html: msg, // html body
      });

      return res.redirect("/VerifyOTP")
    

}
else{
    console.log("invalid email")
    return res.redirect('back')
}

}

const  VerifyOtp=(req,res)=>{
    return res.render("VerifyOTP")
}

const verifyOtpForm=async (req,res)=>{
    if(req.body.otp==req.cookies.otp){
        res.clearCookie('otp')
       return res.redirect('/loginforgottenpass')

    }
    else{
        console.log("OTP not verify");
    }
}

const loginforgottenpass =async (req,res) => { 
    return res.render('loginforgottenpass')
 }

 const loginEditPassword=async(req,res)=>{
    console.log(req.body);
    console.log(req.cookies.email);

    if(req.body.npass == req.body.cpass){

        var email=req.cookies.email;
        const checkEmail =await admin.findOne({email:email});

        if(checkEmail){
            let changepass=await admin.findByIdAndUpdate(checkEmail.id,{
                password : req.body.npass
            })

            if(changepass){
                res.clearCookie("email")
                return res.redirect('/');
            }
            else{
                console.log("password not changed")
                return res.redirect('back');
            }
        }
        else{
            return res.redirect('back');
        }
    }
    else{
        console.log("invalid email")
        return res.redirect('back');
    }

 }

 const ChangePassword =async(req,res)=>{
    return res.render('ChangePassword')
}

const AdminChangePassword=async(req,res)=>{
    
    var dbpass=req.cookies.admin.password
    if(dbpass == req.body.current_password){
        if(req.body.current_password != req.body.new_password){
            if(req.body.new_password == req.body.conform_password){
                await admin.findByIdAndUpdate(req.cookies.admin._id,{
                    password:req.body.new_password
                })
                return res.redirect('/');
            }
        }
        else{
            console.log("New Password and Confirm Password are same");
            return res.redirect('/');
        }
    }
    else{
        console.log("dbpassword and current password not match");
        return res.redirect('/');
    }

}


module.exports={
    dashboard , add_admin, view_admin ,adminInsertData ,deleteAdminRecord ,
    updateAdminRecord , adminEditData ,login , AdminLoginData ,profile ,
    ForgetPassWord ,ForgottenPasswordForm, VerifyOtp, verifyOtpForm ,
    loginforgottenpass ,loginEditPassword , ChangePassword ,AdminChangePassword
};