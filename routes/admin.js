const express=require('express');

const adminCtl=require('../controllers/adminCtl')

const admin = require('../models/admin_model')

const routes=express.Router();


//------------------------------login and logout --------------------------
routes.get('/',adminCtl.login);

routes.get('/logout',(req,res)=>{
    if(req.cookies.admin== undefined){
            return res.redirect('/');
    }
    res.clearCookie('admin');
    return res.redirect('/')
})

//------------------------------end login and logout --------------------------

routes.post('/AdminLoginData',adminCtl.AdminLoginData)

routes.get('/dashboard',adminCtl.dashboard);

routes.get('/add_admin',adminCtl.add_admin);

routes.get('/view_admin',adminCtl.view_admin);

routes.post('/adminInsertData',admin.uploadimage,adminCtl.adminInsertData);

routes.get('/deleteAdminRecord/:id',adminCtl.deleteAdminRecord)

routes.get('/updateAdminRecord',adminCtl.updateAdminRecord)

routes.post('/adminEditData',admin.uploadimage,adminCtl.adminEditData)




routes.get('/profile',adminCtl.profile)


routes.get('/ForgetPassWord',adminCtl.ForgetPassWord)

routes.post('/ForgottenPasswordForm',adminCtl.ForgottenPasswordForm)

routes.get('/VerifyOtp',adminCtl.VerifyOtp)

routes.post('/verifyOtpForm',adminCtl.verifyOtpForm)

routes.get('/loginforgottenpass',adminCtl.loginforgottenpass)

routes.post('/loginEditPassword',adminCtl.loginEditPassword)


routes.get('/ChangePassword',adminCtl.ChangePassword);

routes.post('/AdminChangePassword',adminCtl.AdminChangePassword)


module.exports= routes