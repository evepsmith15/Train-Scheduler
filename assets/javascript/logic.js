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
    name = $("#Train-Name").val().trim();
    destination = $("#Destination").val().trim();
    firstTrain = $("#First-Train").val().trim();
    frequency = $("#Frequency").val().trim();

 
    var pushedObject = {
      name: name,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency,
      recentDate: firebase.database.ServerValue.TIMESTAMP //A placeholder value for auto-populating the current timestamp
    };
    console.log("TIMESTAMP FROM SERVER - " + (pushedObject.recentDate));
    database.ref().push(pushedObject);
  $("input")[0].reset(); //after putting the data into the table marked as input, the database resets to a blank state

  })
  //code for pushingto the database 
  
//code for the database reference 
database.ref().on("child_added", function(childSnapshot) {
  var NextMin;
  //a year is added to show the difference
  var NewTrainTime = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
  console.log("NewTrainTime: " + NewTrainTime);

  //Difference between the current train and the first train
  var timeNow = moment();
  var DiffTime = timeNow.diff((moment((NewTrainTime))))
  console.log("DiffTime: " + DiffTime);

    //takes the difference in time by the dataSnapShot value and frequency
  var remainder = DiffTime % childSnapshot.val().frequency;
  console.log("remainder: " + remainder);

  //Minutes until next train
  var NextMin = (childSnapshot.val().frequency - remainder);
  console.log("NextMin: " + childSnapshot.val().frequency);
  //equation for next train time
  var nextTrain = moment().add(NextMin, "minutes");
  nextTrain = moment(nextTrain).format('LLL');
  console.log("nextTrain: " + nextTrain);

  //need to add a row on its own with arrays instead of doing them manually 
  $("#add-row").append("<tr><td>" + childSnapshot.val().name +
    "</td><td>" + childSnapshot.val().destination +
    "</td><td>" + childSnapshot.val().frequency +
    "</td><td>" + nextTrain +
    "</td><td>" + NextMin +
    "</td></tr>");
},
  // error messages in case something goes wrong in the code 
  function (errorObject) {
    console.log("Error handled: " + errorObject.code);
  });

})
//I used this website for reference https://firebase.google.com/docs/database/web/lists-of-data
//and this website https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot