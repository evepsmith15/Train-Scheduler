// Your web app's Firebase configuration
$(document).ready(function () {

  var firebaseConfig = {
    apiKey: "AIzaSyCTmxljMXuzZ2Jf3-vFCC7RyQUEX4IKc8U",
    authDomain: "train-scheduler-e70ee.firebaseapp.com",
    databaseURL: "https://train-scheduler-e70ee.firebaseio.com",
    projectId: "train-scheduler-e70ee",
    storageBucket: "train-scheduler-e70ee.appspot.com",
    messagingSenderId: "426380095914",
    appId: "1:426380095914:web:cdb56b8970ff8df3"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  //variables for code 
  var database = firebase.database();
  var name;
  var destination;
  var firstTrain;
  var frequency = 0;

  //add train on click
  $("#add-train").on("click", function () {
    event.preventDefault();
    name = $("Train-Name").val().trim();
    destination = $("destination").val().trim();
    firstTrain = $("First-Train").val().trim();
    frequency = $("#Frequency").val().trim();

  })
  //code for pushingto the database 
  database.ref().push({
    name: name,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency,
    recentDate: firebase.database.ServerValue.TIMESTAMP //A placeholder value for auto-populating the current timestamp
  });
  $("input")[0].reset(); //after putting the data into the table marked as input, the database resets to a blank state
})
//code for the database reference 
database.ref().on("child_added", function(dataSnapshot) {
  var NextMin;
  //a year is added to show the difference
  var NewTrainTime = moment(dataSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
  //Difference between the current train and the first train
  var DiffTime = moment().diff(moment(NewTrainTime), "minutes");
  //takes the difference in time by the dataSnapShot value and frequency
  var remainder = DiffTime % dataSnapshot.val().frequency;
  //Minutes until next train
  var NextMin = dataSnapshot.val().frequency - remainder;
  //equation for next train time
  var nextTrain = moment().add(NextMin, "minutes");
  nextTrain = moment(nextTrain).format("hh:mm");

  //need to add a row on its own with arrays instead of doing them manually 
  $("#add-row").append("<tr><td>" + dataSnapshot.val().name +
    "</td><td>" + dataSnapshot.val().destination +
    "</td><td>" + dataSnapshot.val().frequency +
    "</td><td>" + dataSnapshot.val().nextTrain +
    "</td><td>" + dataSnapshot.val().NextMin +
    "</td></tr>");
},
  // error messages in case something goes wrong in the code 
  function (errorObject) {
    console.log("Error handled: " + errorObject.code);
  });


//I used this website for reference https://firebase.google.com/docs/database/web/lists-of-data
//and this website https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot