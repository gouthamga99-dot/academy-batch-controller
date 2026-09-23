(function () {
  "use strict";

  var shiftEl = document.getElementById("shift");
  var clockEl = document.getElementById("clock");
  var dateEl = document.getElementById("date");

  var lastShift = null;
  var lastSecond = null;

  // Get current date/time parts in India Standard Time (UTC+05:30).
  function istNow() {
    var now = new Date();
    var ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
    return {
      hours: ist.getHours(),
      minutes: ist.getMinutes(),
      seconds: ist.getSeconds(),
      date: ist,
    };
  }

  // Returns the shift text for the given 24h time.
  function getShift(hours, minutes) {
    var total = hours * 60 + minutes;

    if (total < 9 * 60) {
      return { text: "Academy Opens at 9:00 AM", state: "info" };
    }
    if (total < 12 * 60) {
      return { text: "9:00 AM – 12:00 PM", state: "" };
    }
    if (total < 15 * 60) {
      return { text: "12:00 PM – 3:00 PM", state: "" };
    }
    if (total < 18 * 60) {
      return { text: "3:00 PM – 6:00 PM", state: "" };
    }
    return { text: "Academy Closed", state: "closed" };
  }

  function pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function render() {
    var t = istNow();

    // Update the shift only when it actually changes.
    var shift = getShift(t.hours, t.minutes);
    if (shift.text !== lastShift) {
      lastShift = shift.text;
      shiftEl.textContent = shift.text;
      shiftEl.className = "shift" + (shift.state ? " " + shift.state : "");
    }

    // Update the clock every second.
    if (t.seconds !== lastSecond) {
      lastSecond = t.seconds;

      var h12 = t.hours % 12;
      if (h12 === 0) h12 = 12;
      var ampm = t.hours < 12 ? "AM" : "PM";

      clockEl.textContent =
        pad(h12) + ":" + pad(t.minutes) + ":" + pad(t.seconds) + " " + ampm;

      dateEl.textContent = t.date.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  }

  render();
  setInterval(render, 500);
})();
