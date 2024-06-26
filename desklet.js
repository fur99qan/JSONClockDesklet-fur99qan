const Desklet = imports.ui.desklet;
const St = imports.gi.St;
const Mainloop = imports.mainloop;
const GLib = imports.gi.GLib;

function BinClockDesklet(metadata, desklet_id) {
  this._init(metadata, desklet_id);
}

BinClockDesklet.prototype = {
  __proto__: Desklet.Desklet.prototype,

  _init: function (metadata, desklet_id) {
    Desklet.Desklet.prototype._init.call(this, metadata, desklet_id);
    Mainloop.timeout_add_seconds(1, () => {
      this.updateUI();
      return true;
    });
    this.setupUI();
  },

  setupUI: function () {
    this._text = new St.Label({
      text: '00000 : 000000 : 000000',
      style: 'font-size: 10px;',
    });
    this.setContent(this._text);
  },
  updateUI: function () {
    let now = new Date();

    // Utility functions to get the weekday name and format the date with the ordinal suffix
    function getWeekdayName(dayIndex) {
      const weekdays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      return weekdays[dayIndex];
    }

    function getFormattedDate(dateObj) {
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const day = dateObj.getDate();
      const month = months[dateObj.getMonth()];
      const year = dateObj.getFullYear();

      let suffix;
      if (day > 3 && day < 21) suffix = 'th'; // special case for 11th to 20th
      else
        switch (day % 10) {
          case 1:
            suffix = 'st';
            break;
          case 2:
            suffix = 'nd';
            break;
          case 3:
            suffix = 'rd';
            break;
          default:
            suffix = 'th';
        }

      return `${day}${suffix} ${month} ${year}`;
    }

    // Get hours, minutes, seconds, day, and date separately
    let hours = now.getHours(); // Gets the hour (0-23)
    let minutes = now.getMinutes(); // Gets the minutes (0-59)
    let seconds = now.getSeconds(); // Gets the seconds (0-59)
    let day = getWeekdayName(now.getDay()); // Gets the weekday name
    let date = getFormattedDate(now); // Gets the formatted date

    // Determine AM or PM
    let ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Create an object with the extracted information
    let timeInfo = {
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      day: day,
      date: date,
      ampm: ampm,
    };

    // Format the output with proper spacing
    let timeInfoString = `{
    hours:     ${timeInfo.hours},
    minutes:   ${timeInfo.minutes},
    seconds:   ${timeInfo.seconds},
    day:       ${timeInfo.day},
    date:      ${timeInfo.date},
    ampm:      ${timeInfo.ampm}
}`;

    this._text.set_text(timeInfoString);
  },
};

function main(metadata, desklet_id) {
  return new BinClockDesklet(metadata, desklet_id);
}
