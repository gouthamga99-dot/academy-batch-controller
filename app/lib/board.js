"use client";

import { useEffect, useState } from "react";

// Single source of truth for the academy day, in minutes from local midnight.
// The board follows the computer's own clock — no timezone conversion.
export const SHIFTS = [
  {
    start: 9 * 60,
    end: 12 * 60,
    label: "9:00 AM – 12:00 PM",
    name: "Morning Shift",
  },
  {
    start: 12 * 60,
    end: 15 * 60,
    label: "12:00 PM – 3:00 PM",
    name: "Afternoon Shift",
  },
  {
    start: 15 * 60,
    end: 18 * 60,
    label: "3:00 PM – 6:00 PM",
    name: "Evening Shift",
  },
];

const DAY_SEC = 24 * 60 * 60;
const OPEN_SEC = SHIFTS[0].start * 60; // 9:00 AM
const CLOSE_SEC = SHIFTS[SHIFTS.length - 1].end * 60; // 6:00 PM

// Exactly one current shift at any moment. Ranges are half-open
// (start <= t < end), so the shift flips exactly at 12:00 PM and 3:00 PM.
export function getBoard(sec) {
  // Before the academy opens.
  if (sec < OPEN_SEC) {
    return {
      current: {
        text: "Academy Starts at 9:00 AM",
        name: "Before First Shift",
        state: "info",
      },
      next: SHIFTS[0],
      remaining: OPEN_SEC - sec,
    };
  }

  for (let i = 0; i < SHIFTS.length; i += 1) {
    const shift = SHIFTS[i];
    const endSec = shift.end * 60;

    if (sec < endSec) {
      const following = SHIFTS[i + 1];
      return {
        current: {
          text: shift.label,
          name: shift.name,
          state: "active",
        },
        // On the last shift of the day the "next" event is closing time.
        next: following || { label: "Academy Closed", name: "Day Complete" },
        remaining: endSec - sec,
      };
    }
  }

  // After 6:00 PM: closed, counting down to tomorrow's first shift.
  return {
    current: {
      text: "Academy Closed",
      name: "All Shifts Completed",
      state: "closed",
    },
    next: SHIFTS[0],
    remaining: DAY_SEC - sec + OPEN_SEC,
  };
}

export function pad(n) {
  return n < 10 ? "0" + n : String(n);
}

export function formatClock(date) {
  const h = date.getHours() % 12 || 12;
  const ampm = date.getHours() < 12 ? "AM" : "PM";
  return `${pad(h)}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${ampm}`;
}

// "Tuesday, 22 September 2026"
export function formatDate(date) {
  const weekday = date.toLocaleDateString("en-GB", { weekday: "long" });
  const month = date.toLocaleDateString("en-GB", { month: "long" });
  return `${weekday}, ${date.getDate()} ${month} ${date.getFullYear()}`;
}

export function formatCountdown(totalSeconds) {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

export function snapshot() {
  const now = new Date();
  const sec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const board = getBoard(sec);

  return {
    clock: formatClock(now),
    date: formatDate(now),
    shiftText: board.current.text,
    shiftName: board.current.name,
    shiftState: board.current.state,
    nextLabel: board.next.label,
    countdown: formatCountdown(board.remaining),
  };
}

function same(a, b) {
  return (
    a.clock === b.clock &&
    a.date === b.date &&
    a.shiftText === b.shiftText &&
    a.shiftName === b.shiftName &&
    a.shiftState === b.shiftState &&
    a.nextLabel === b.nextLabel &&
    a.countdown === b.countdown
  );
}

// Shared live data hook: checks 4x per second and only re-renders when a
// value actually changes. No refresh is ever required.
export function useBoard() {
  const [view, setView] = useState(null);

  useEffect(() => {
    const tick = () => {
      setView((prev) => {
        const next = snapshot();
        return prev && same(prev, next) ? prev : next;
      });
    };

    tick();
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, []);

  return view;
}
