/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDjHTntDnNvtvEIdN6LXVjzEOKB2kxJep0",
    authDomain: "trainschedule-76392.firebaseapp.com",
    databaseURL: "https://trainschedule-76392.firebaseio.com",
    projectId: "trainschedule-76392",
    storageBucket: "trainschedule-76392.appspot.com",
    messagingSenderId: "49160242453"
  };
  firebase.initializeApp(config);



var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var trainStart = $("#start-input").val().trim();
  var frequency = $("#frequency-input").val().trim();

  // console.log(trainName);
  // console.log(destination);
  // console.log(trainStart);
  // console.log(frequency);
  

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    trainName: trainName,
    destination: destination,
    trainStart: trainStart,
    frequency: frequency
  };
  // Uploads employee data to the database
  database.ref().push(newTrain);
  //Make sure trainStart is in military format
  var trainStart = moment(trainStart).format("HH:mm");
  // Logs everything to console
  // console.log(newTrain.trainName);
  // console.log(newTrain.destination);
  // console.log(newTrain.trainStart);
  // console.log(newTrain.frequency);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().trainStart;
  var trainFrequency = childSnapshot.val().frequency;

  // Train Info
  console.log(trainName);
  console.log(destination);
  console.log(trainStart);
  console.log(trainFrequency);

//calculate the time until the next train

   // First Time (pushed back 1 year to make sure it comes before current time)
   var firstTimeConverted = moment(trainStart, "HH:mm").subtract(1, "years");
  
   // Current Time
   var currentTime = moment();
  
   // Difference between the times
   var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  
   // Time apart (remainder)
   var tRemainder = diffTime % trainFrequency;
  
   // Minute Until Train
   var tMinutesTillTrain = trainFrequency - tRemainder;
  
   // Next Train
   var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  
//   // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
  trainFrequency + " minutes" + "<td><td>" + tMinutesTillTrain + "</td><td></tr>");
});  
