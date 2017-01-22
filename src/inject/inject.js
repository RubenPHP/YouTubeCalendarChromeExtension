chrome.extension.sendMessage({}, function(response) {
	$('<div id="yt-scheduled-videos-calendar"></div>').insertAfter('#body-container');
	$('<a id="launch-calendar-link" href="#yt-scheduled-videos-calendar">Calendar</a>').insertBefore('#vm-view-filter');
	$('#launch-calendar-link').leanModal();

	var readyStateCheckInterval = setInterval(function() {
		var ngHide = jQuery(".ng-hide").length;
		if (
			document.readyState === "complete"
			&& ngHide != null && ngHide > 0)
		{
			clearInterval(readyStateCheckInterval);

			// ----------------------------------------------------------
			// This part of the script triggers when page is done loading
			console.log("Hello. This message was sent from scripts/inject.js");
			// ----------------------------------------------------------
			var eventArray = createEventArray();
			generateScheduledVideoCalendar(eventArray);
		}
	}, 10);
});

function createEventArray() {

	var eventArray = $('#vm-playlist-video-list-ol .vm-scheduled-date').map(function() {

		return {
			date: new Date($(this).data('timestamp') * 1000).toISOString(),
			title: 'temporal'
		};
	}).get();

	return eventArray;
}

function generateScheduledVideoCalendar(eventArray) {

	// Call this from the developer console and you can control both instances
	var calendars = {};

	$(document).ready( function() {
		// Assuming you've got the appropriate language files,
		// clndr will respect whatever moment's language is set to.
		// moment.locale('ru');

		// Here's some magic to make sure the dates are happening this month.
		var thisMonth = moment().format('YYYY-MM');

		// The order of the click handlers is predictable. Direct click action
		// callbacks come first: click, nextMonth, previousMonth, nextYear,
		// previousYear, nextInterval, previousInterval, or today. Then
		// onMonthChange (if the month changed), inIntervalChange if the interval
		// has changed, and finally onYearChange (if the year changed).
		calendars.clndr1 = $('#yt-scheduled-videos-calendar').clndr({
			weekOffset: 1,
			//daysOfTheWeek: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
			events: eventArray,
			clickEvents: {
				click: function (target) {
					console.log('Cal-1 clicked: ', target);
				},
				today: function () {
					console.log('Cal-1 today');
				},
				nextMonth: function () {
					console.log('Cal-1 next month');
				},
				previousMonth: function () {
					console.log('Cal-1 previous month');
				},
				onMonthChange: function () {
					console.log('Cal-1 month changed');
				},
				nextYear: function () {
					console.log('Cal-1 next year');
				},
				previousYear: function () {
					console.log('Cal-1 previous year');
				},
				onYearChange: function () {
					console.log('Cal-1 year changed');
				},
				nextInterval: function () {
					console.log('Cal-1 next interval');
				},
				previousInterval: function () {
					console.log('Cal-1 previous interval');
				},
				onIntervalChange: function () {
					console.log('Cal-1 interval changed');
				}
			},
			multiDayEvents: {
				singleDay: 'date',
				endDate: 'endDate',
				startDate: 'startDate'
			},
			showAdjacentMonths: true,
			adjacentDaysChangeMonth: false
		});

		// Bind all clndrs to the left and right arrow keys
		$(document).keydown( function(e) {
			// Left arrow
			if (e.keyCode == 37) {
				calendars.clndr1.back();
				calendars.clndr2.back();
				calendars.clndr3.back();
			}

			// Right arrow
			if (e.keyCode == 39) {
				calendars.clndr1.forward();
				calendars.clndr2.forward();
				calendars.clndr3.forward();
			}
		});
	});
}