// include two routes:
// GET Route to /survey which should display the survey page.
// default USE route that leads to home.html which displays the home page.
var path = require("path");

module.exports = function(app) {

    //GET Route to /survey which should display the survey page
    app.get("/survey", function(req, res) {
        res.sendFile(path.join(__dirname, "/../public/survey.html"));
    });

    // If no matching route is found default to home
    app.use(function(req, res) {
        res.sendFile(path.join(__dirname, "/../public/home.html"));
    });
};