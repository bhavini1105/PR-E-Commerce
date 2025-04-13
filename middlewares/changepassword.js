const changepass = (req,res,next)=>{
    if(req.cookies.email){
        return next();
    }
    return res.json({message : "Enter your mail first"});
}
module.exports = changepass;