chrome.extension.sendMessage({}, function(response) {
	$('<div id="yt-scheduled-videos-calendar"></div>').insertAfter('#body-container');
	$('<a id="launch-calendar-link" href="#yt-scheduled-videos-calendar"><span class="icon-calendar">Calendar</span></a>').insertBefore('#vm-view-filter-label');
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
	var scheduledVideos = $('#vm-playlist-video-list-ol .vm-scheduled-date').map(function() {
		var videoItem = $(this).parent().parent().parent().parent().parent();
		var date = new Date($(this).data('timestamp') * 1000);
		var amPm = (date.getHours() >= 12) ? "PM" : "AM";

		var event = {
			date: date.toISOString(),
			time: addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ' ' + amPm,
			videoId: $(videoItem).attr('id'),
			title: $(videoItem).find('.vm-video-title-container a').html(),
			type: 'scheduled'
		};

		return event;
	}).get();

	var notScheduledVideos = $('#vm-playlist-video-list-ol > li').not(':has(".vm-scheduled-date")').map(function() {
		debugger;
		var videoItem = $(this);
		var hasDate = $(this).find('.localized-date').length > 0;
		if ( ! hasDate) {
			return null;
		}

		var scheduledPublishedDate = $(this).find('.vm-schduled-date-published-label + .localized-date');
		var definitiveDate = scheduledPublishedDate.length > 0 ? scheduledPublishedDate : $(this).find('.localized-date');

		var date = new Date(definitiveDate.data('timestamp') * 1000);

		var amPm = (date.getHours() >= 12) ? "PM" : "AM";

		var numberOfViews = ($(this).find('.vm-video-side-view-count').text()).trim();

		var event = {
			date: date.toISOString(),
			time: addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ' ' + amPm,
			videoId: $(videoItem).attr('id'),
			title: '(' + numberOfViews + ') ' + $(videoItem).find('.vm-video-title-container a').html(),
			type: 'not-scheduled'
		};

		return event;
	}).get();

	var eventArray = scheduledVideos.concat(notScheduledVideos);

	return eventArray;
}

function generateScheduledVideoCalendar(eventArray) {

	// Call this from the developer console and you can control both instances
	var calendars = {};

	$(document).ready( function() {
		// Assuming you've got the appropriate language files,
		// clndr will respect whatever moment's language is set to.
		// moment.locale('ru');

		// The order of the click handlers is predictable. Direct click action
		// callbacks come first: click, nextMonth, previousMonth, nextYear,
		// previousYear, nextInterval, previousInterval, or today. Then
		// onMonthChange (if the month changed), inIntervalChange if the interval
		// has changed, and finally onYearChange (if the year changed).
		calendars.clndr1 = $('#yt-scheduled-videos-calendar').clndr({
			weekOffset: 1,
			//daysOfTheWeek: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
			template: getCalendarTemplate(),
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
			showAdjacentMonths: false,
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

function getCalendarTemplate() {
	var template =
		"<div class='clndr-controls'>" +
			"<div class='clndr-control-button'>" +
				"<span class='clndr-previous-button'>previous</span>" +
			"</div>" +
			"<div class='month'><%= month %> <%= year %></div>" +
			"<div class='clndr-control-button rightalign'>" +
				"<span class='clndr-next-button'>next</span>" +
			"</div>" +
		"</div>" +
		"<table class='clndr-table' border='0' cellspacing='0' cellpadding='0'>" +
			"<thead>" +
				"<tr class='header-days'>" +
					"<% for(var i = 0; i < daysOfTheWeek.length; i++) { %>" +
						"<td class='header-day'><%= daysOfTheWeek[i] %></td>" +
					"<% } %>" +
				"</tr>" +
			"</thead>" +
		"<tbody>" +
			"<% for(var i = 0; i < numberOfRows; i++){ %>" +
				"<tr>" +
					"<% for(var j = 0; j < 7; j++){ %>" +
						"<% var d = j + i * 7; %>" +
						"<td class='<%= days[d].classes %>'>" +
							"<div class='day-contents'><%= days[d].day %></div>" +
							"<% for(var k = 0; k < days[d].events.length; k++) { %>" +
								"<div class='day-event'><span class='time'><%= days[d].events[k].time %></span> <%= days[d].events[k].title %></div>" +
							"<% } %>" +
						"</td>" +
					"<% } %>" +
				"</tr>" +
			"<% } %>" +
		"</tbody>" +
		"</table>";

	return template;
}

function addZero(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}