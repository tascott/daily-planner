// Initialize Luxon
var DateTime = luxon.DateTime;

// Get current date and time
let now = DateTime.now();

// Get todays date formatted
let today = DateTime.now().toLocaleString(DateTime.DATE_FULL)
// Insert on page
$('#currentDay').text(today)

//Get current time
let timeNow =  DateTime.now().toLocaleString(DateTime.TIME_SIMPLE)


// The base HTML structure of each hour in our calendar
let renderHour = function(hour) {
    let ampm = hour < 12 ? 'am' : 'pm';
    hour = hour % 12;
    hour = hour ? hour : 12;

    let startTime = DateTime.fromObject({hour: hour, minute: 0, second: 0, millisecond: 0});
    let endTime = DateTime.fromObject({hour: hour, minute: 59, second: 59, millisecond: 999});

    return `<div class="hour" data-start=${startTime} data-end=${endTime}>
                <div class="label">
                    <span>${hour}${ampm}</span>
                </div>
                <div class="content">
                    <textarea class="hour-text"></textarea>
                </div>
                <button class="saveBtn"><i class="fas fa-save"></i></button>
            </div>`
}


// function that creates and appends an item for each our in the day with a time label and a save button
function createCalendar() {
        // Get the calendar container
        let container = $('.container');

        // Loop through each hour in the day
        for (let i = 0; i < 24; i++) {
            // Create a new hour
            let hour = renderHour(i);
            // Append the hour to the container
            container.append(hour);
        }
}


// On clicking save, grab all the data available and save it to local storage

$('.container').on('click', '.saveBtn', function() {
    let hour = $(this).parent().data('start');
    let text = $(this).siblings('.content').children('.hour-text').val();
    console.log(hour, text)
    localStorage.setItem(hour, text);
})


createCalendar();


// Loop and run the update function every second, need to find a way to make sure we don't clear stuff when entering - maybe a flag?


// When the clock ticks over to the next hour, update the calendar
