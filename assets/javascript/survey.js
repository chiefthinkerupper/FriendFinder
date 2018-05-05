var questions = [
    "Your mind is always buzzing with unexplored ideas and plans.",
    "Generally speaking, you rely more on your experience than your imagination.",
    "You find it easy to stay relaxed and focused even when there is some pressure.",
    "You rarely do something just out of sheer curiosity.",
    "People can rarely upset you.",
    "It is often difficult for you to relate to other people’s feelings.",
    "In a discussion, truth should be more important than people’s sensitivities.",
    "You rarely get carried away by fantasies and ideas.",
    "You think that everyone’s views should be respected regardless of whether they are supported by facts or not.",
    "You feel more energetic after spending time with a group of people."
];

function initQuestions() {
    $.each(questions, function(qIndex, value) {
        $('#questions').append('<h3><strong>Question ' + (qIndex + 1) + '</strong></h3><h4>' + value + '</h4>');
        var options = [1, 2, 3, 4, 5];
        var optionlabels = ["1 (Strongly Disagree)", "2", "3", "4", "5 (Strongly Agree)"];
        $.each(options, function(aIndex, option) {
            $('#questions').append('<label class="radio-inline"><input type="radio" name="Q' + qIndex + '" value="' + option + '"> ' +
                optionlabels[aIndex] + '</label>');
        });
        $('#questions').append('<br>');
    });
}

// function to check all the survey records
// to find the person with the the best match for the current user
function getTheBestMatch(userData) {
    // Grab the URL of the website
    var currentURL = window.location.origin;

    // AJAX post the data to the friends API. 
    $.post(currentURL + "/api/friends", userData, function(data) {

        // Grab the result from the AJAX post so that the best match's name and photo are displayed.
        $("#matchName").text(data.name);
        $('#matchImg').attr("src", data.photo);

        // Show the modal with the best match 
        $("#resultsModal").modal('toggle');

    });
}



function validateSurvey() {
    var data = {
        valid: true,
        userData: {
            name: $("#name").val(),
            photo: $("#photo").val(),
            scores: []
        }
    };

    $('.form-control').each(function() {
        if ($(this).val() === '') {
            data.valid = false;
            return data;
        }
    });

    //for each question, get the selected answer, 
    //compare to the correct answer and caculate the result counters

    $.each(questions, function(qIndex, value) {
        var radioValue = $("input[name='Q" + qIndex + "']:checked").val();
        if (radioValue) { //any choice been selected 
            data.userData.scores.push(parseInt(radioValue));
        } else { //no choice been selected 
            data.valid = false;
            return data;
        }
    });

    return data;
}


$(document).ready(function() {
    initQuestions();
    // Capture the form inputs 
    $("#submit").on("click", function() {
        var surveyResult = validateSurvey();

        // If all required fields are filled
        //display the best match
        if (surveyResult.valid === true) {
            // console.log(surveyResult.userData);
            getTheBestMatch(surveyResult.userData);

        } else {
            alert("Please fill out all fields before submitting!");
        }
        return false;
    });
});