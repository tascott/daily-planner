// Initialize Luxon
var DateTime = luxon.DateTime;

// Get current date and time
let now = DateTime.now();

// Get todays date formatted
let today = DateTime.now().toLocaleString(DateTime.DATE_FULL)

//Get current time
let timeNow =  DateTime.now().toLocaleString(DateTime.TIME_SIMPLE)


// An object to store all our data
let todaysCalendar = {
}

// The base HTML structure of each hour in our calendar
let renderHour = function(hour) {


    let hour = `<div class="hour">
            <div class="hour-label">
                <span class="hour-label>${hour}</span>
            </div>
            <div class="hour-content">
                <textarea class="hour-text"></textarea>
                <button class="hour-save">Save</button>
            </div>
        </div>
    `
}


// function that creates and appends an item for each our in the day with a time label and a save button
function createCalendar() {

        // Get the calendar container
        let calendar = document.querySelector('.calendar');

        // Loop through each hour in the day
        for (let i = 0; i < 24; i++) {

            // Create a new hour
            let hour = renderHour(i);

            // Append the hour to the calendar
            calendar.appendChild(hour);
        }
}

createCalendar();