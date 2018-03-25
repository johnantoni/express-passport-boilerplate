module.exports = (req, res, next) => {
    if (req.user === undefined) {
        res.status(401).send("Unauthorized request");
    } else {
        next();
    }
}
