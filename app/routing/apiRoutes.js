// contain two routes:
// GET route with the url /api/friends. This will be used to display a JSON of all possible friends.
// POST routes /api/friends. This will be used to handle incoming survey results. 
// This route will also be used to handle the compatibility logic.
// ===============================================================================
// LOAD DATA
// link our routes to "data" source that holds arrays of information on survey results.
// ===============================================================================
var friends = require("../data/friends");


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {

    // GET route with the url /api/friends. This will be used to display a JSON of all possible friends.
    app.get("/api/friends", function(req, res) {
        res.json(friends);
    });

    // POST routes /api/friends. This will be used to handle incoming survey results. 
    // This route will also be used to handle the compatibility logic.
    // Below code handles when a user submits a form and thus submits data to the server.
    // In each of the below cases, when a user submits form data (a JSON object)
    // ...the JSON is pushed to the appropriate JavaScript array
    // (ex. User fills out a survey... this data is then sent to the server...
    // Then the server saves the data to the friends array)
    // ---------------------------------------------------------------------------

    app.post("/api/friends", function(req, res) {
        // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
        // It will do this by sending out the value "true" have a table
        if (friends.length > 0) {
            // init minDifference with the totalDifference between the current user and the first
            // user in the friend Array
            var matchIndex = 0;
            var minDifference = caculateTotalDifference(req.body.scores, friends[0].scores);

            // calculate the totalDifference between current user's scores against those from the rest of 
            // other users and set the matchIndex of the user that with the least amount of difference
            for (var i = 1; i < friends.length; i++) {
                var currTotalDifference = caculateTotalDifference(req.body.scores, friends[i].scores);
                // b = (b > a) ?  a : b;
                // if the friend of the current index has the fewer amount of difference
                // reset minDifference and matchIndex with the current friend index and currTotalDifference
                if (minDifference > currTotalDifference) {
                    minDifference = currTotalDifference;
                    matchIndex = i;
                }
            }

            friends.push(req.body);

            // send the matched friend information as a JSON object
            res.json(friends[matchIndex]);
        } else {
            // send the current user as a JSON object due to lack of other user info
            friends.push(req.body);
            res.json(friends[0]);
        }
    });
};

// Compare the difference between scores A against scores B, question by question. 
// Add up the differences to calculate the totalDifference.
function caculateTotalDifference(scoresA, scoresB) {
    var totalDifference = 0;
    for (var i = 0; i < scoresA.length; i++) {
        totalDifference += Math.abs(scoresA[i] - scoresB[i]);
    }
    // console.log("totalDifference: " + totalDifference);
    return totalDifference;
}