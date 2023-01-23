// Initialize Luxon
var DateTime = luxon.DateTime;

// Get current date and time
let now = DateTime.now();

//Users day start and end times
let start = Number(localStorage.getItem('startHour')) || 0;
let end = Number(localStorage.getItem('endHour')) || 24;
$('#startHour').val(start);
$('#endHour').val(end);

// Get todays date formatted
let today = DateTime.now().toLocaleString(DateTime.DATE_FULL)
// Insert on page
$('#currentDay').text(today)

//Get current time
let timeNow =  DateTime.now().toLocaleString(DateTime.TIME_SIMPLE)

// on page load or save update every hour slot with data from local storage
let dayData = [];

// Functions to save and get data from local storage
let saveToLocalStorage = function(dayData) {
    localStorage.setItem('calendarData', JSON.stringify(dayData));
}

let getFromLocalStorage = function(){
    let data = JSON.parse(localStorage.getItem('calendarData'));
    return data;
}

// The base HTML structure of each hour in our calendar
let renderHour = function(hour) {
    let ampm = hour < 12 ? 'am' : 'pm';
    let formatHour = hour % 12;
    formatHour = formatHour ? formatHour : 12;

    let startTime = DateTime.fromObject({hour: hour, minute: 0, second: 0, millisecond: 0});
    let endTime = DateTime.fromObject({hour: hour, minute: 59, second: 59, millisecond: 999});

    return `<div class="hour" data-hour="${hour}" data-period="past" data-start=${startTime} data-end=${endTime}>
                <div class="label">
                    <span>${formatHour}${ampm}</span>
                </div>
                <div class="content">
                    <textarea class="hour-text"></textarea>
                </div>
                <button class="saveBtn" disabled><i class="fas fa-save"></i></button>
            </div>`
}

// function that creates and appends an item for each our in the day with a time label and a save button
function createCalendar() {
    let container = $('.container');

    // set #starthour and #endhour to the values from local storage
    start = Number(localStorage.getItem('startHour')) || 0;
    end = Number(localStorage.getItem('endHour')) || 24;

    // Loop through each hour in a day
    for (let i = start; i < end; i++) {
        let hour = renderHour(i);
        container.append(hour);
    }

    updateHoursFromLocalStorage();
    updateColors();
}

/*
General Event Listeners
*/

// Refresh when times changed
$('#startHour, #endHour').on('change', function() {
    let selectedStartTime = Number($('#startHour').val());
    let selectedEndTime = Number($('#endHour').val());
    localStorage.setItem('startHour', selectedStartTime);
    localStorage.setItem('endHour', selectedEndTime);
    $('.container').empty();
    createCalendar();
});

//if the textarea is not empty, make saveBtn active
$('.container').on('keyup', '.hour-text', function() {
    let text = $(this).val();
    let saveBtn = $(this).parents().siblings('.saveBtn');
    if (text) {
        saveBtn.prop('disabled', false);
    } else {
        saveBtn.prop('disabled', true);
    }
});


// On clicking save, grab all the data available and save it to local storage
$('.container').on('click', '.saveBtn', function() {
    let hour = $(this).parent().data('start');
    let text = $(this).siblings('.content').children('.hour-text').val();
    let thisHour = {time: hour, text: text};

    dayData = getFromLocalStorage() || [];

    if (dayData.length === 0) {
        dayData.push(thisHour);
    } else {
        let found = false;
        for (let i = 0; i < dayData.length; i++) {
            if (dayData[i].time === hour) {
                dayData[i].text = text;
                found = true;
            }
        }
        if (!found) {
            dayData.push(thisHour);
        }
    }

    $(this).prop('disabled', true);

    saveToLocalStorage(dayData);
});

/*
App logic
*/

let updateHoursFromLocalStorage = function() {
    let data = getFromLocalStorage();
    // Loop through each hour in a day and update from localstorage if data matches
    if (data) {
        for (let i = 0; i < data.length; i++) {
            let hour = data[i].time;
            let text = data[i].text;
            let hourDiv = $(`[data-start="${hour}"]`);
            hourDiv.find('.hour-text').val(text);
        }
    }
}

let updateColors = function() {
    // Get current time and update the colors of the hours
    now = DateTime.now();
    let currentHour = now.hour;
    // loop over all the hours in the container and see which ones matches the current hour
    $('.hour').each(function() {
        let hour = $(this).data('hour');
        if (hour === currentHour) {
            $(this).attr('data-period', 'present');
        } else if (hour < currentHour) {
            $(this).attr('data-period', 'past');
        } else if (hour > currentHour) {
            $(this).attr('data-period', 'future');
        }
    });
}

/*
Updating Functionality
*/

// Find out how many seconds are left in the current minute so we can update on the minute
var time = now;
var secondsRemaining = (60 - time.second) * 1000;

setTimeout(function() {
    setInterval(updateColors, 60000);
}, secondsRemaining);

//Start app
createCalendar();