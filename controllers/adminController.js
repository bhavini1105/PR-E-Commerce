
module.exports.adminPage = (req, res) => {
    return res.render('index');
}

module.exports.loginPage = (req,res)=>{
    return res.render('pages/login');
}

module.exports.signupPage = (req,res)=>{
    return res.render('pages/signup');
}