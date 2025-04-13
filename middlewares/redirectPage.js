module.exports.clientRedirect = (req, res, next) => {
    if(req.url === "/"){
        return res.redirect("/home");
    }
    return next();
}