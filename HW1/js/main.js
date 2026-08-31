const journalEntries = [ 
  { date: "2026-01-01", notes: "New Year's Day!  I made a resolution to learn JavaScript." , mood: ["happy", "anxious"], sleepHours: 8.5 },
  { date: "2026-01-02", notes: "I started learning JavaScript today.  It's a bit confusing, but I'm excited to learn more." , mood: ["excited"], sleepHours: 7.5 },
  { date: "2026-01-03", notes: "I learned about variables and data types today.  It's starting to make sense." , mood: ["confident"], sleepHours: 6 },
  { date: "2026-01-04", notes: "Javascript is starting to get confusing. I need practice more often." , mood: ["confused", "sad"], sleepHours: 5 }
]

let currentMood = [];
let sleepHours;
let notes;

document.addEventListener("DOMContentLoaded", function () {
  let yesterday = journalEntries[journalEntries.length - 1];
  let yesterdayDate = yesterday.date;
  let sleepHours = yesterday.sleepHours;
  let totalSleepHours = 0;
  for (let i = 0; i < journalEntries.length; i++) {
    totalSleepHours += journalEntries[i].sleepHours;
  }
  let moodString;
  for (let i = 0; i < yesterday.mood.length; i++) {
    if (i === 0) {
      moodString = yesterday.mood[i];
    } else if (i === yesterday.mood.length - 1) {
      moodString += " and " + yesterday.mood[i];
    } else {
      moodString += ", " + yesterday.mood[i];
    }
  }

  const today = new Date();
  const formattedDate =
    today.getFullYear() + "-" +
    (today.getMonth() + 1) + "-" +
    today.getDate();

  document.getElementById("date").textContent = "Today is " + formattedDate;
  document.getElementById("yesterday").textContent = "Yesterday, (" + yesterdayDate + "), you slept " + sleepHours + " hours and felt " + moodString + ".";
  document.getElementById("sleepSummary").textContent = "Average sleep hours: " + (totalSleepHours / journalEntries.length).toFixed(2);
  addNewEntry(formattedDate);
  updateMoodHistory();
});

function addNewEntry(date) {
  // Add a new entry to the journalEntries array with the specified date
  journalEntries.push({
    date: date,
    notes: "",
    mood: [],
    sleepHours: 0
  });
}

function updateEntry(field, value) {
  // Update current journal entry
  journalEntries[journalEntries.length - 1][field] = value;
  console.log("Current jounral entry: " + JSON.stringify(journalEntries[journalEntries.length - 1]));
}

function updateMood(checkboxID) {
  // Update current mood based on checkbox state of ID
  if (document.getElementById(checkboxID).checked) {
    currentMood.push(checkboxID);
  }
  if (!document.getElementById(checkboxID).checked) {
    const index = currentMood.indexOf(checkboxID);
    if (index >= 0) {
      currentMood.splice(index, 1);
    }
  }
  // Print current mood to console
  console.log("Current mood: " + currentMood.join(", "));
  updateEntry("mood", currentMood);
  updateMoodHistory();
}

function updateSleepHours() {
  let sleepHours = document.getElementById("sleepHours").value;
  console.log("Sleep hours: " + sleepHours);

  // Update average sleep hours and journal entry of the current day 
  updateEntry("sleepHours", parseFloat(sleepHours));
  updateSleepHistory();  
}

function updateNotes() {
  let notes = document.getElementById("notes").value;
  console.log("Notes: " + notes);
  updateEntry("notes", notes);
}

let updateSleepHistory = function() {
  let totalSleepHours = 0;
  for (let i = 0; i < journalEntries.length; i++) { 
    totalSleepHours += journalEntries[i].sleepHours;
  }
  let average = (totalSleepHours / journalEntries.length).toFixed(2);
  document.getElementById("sleepSummary").textContent = "Average sleep hours: " + average;
  console.log("Average sleep hours: " + average);
}

let updateMoodHistory = function() {
  // Iterate through journal entries and count occurences of each mood
  let moodCounts = {};
  for (let i = 0; i < journalEntries.length; i++) {
    let moods = journalEntries[i].mood;
    for (let j = 0; j < moods.length; j++) {
      let mood = moods[j];
      if (moodCounts[mood]) {
        moodCounts[mood]++;
      } else {
        moodCounts[mood] = 1;
      }
    }
  }
  // Print mood counts to console
  console.log("Mood counts: " + JSON.stringify(moodCounts));
  
  // Update mood history in HTML
  let moodSummary = "";
  for (let mood in moodCounts) {
    moodSummary += "<li>" + mood + ": " + moodCounts[mood] + "</li>";
  }
  document.getElementById("moodSummary").innerHTML = moodSummary;
}
