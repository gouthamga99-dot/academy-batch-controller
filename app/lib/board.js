"use client";

import { useEffect, useState } from "react";

// Single source of truth for the day's schedule (IST minutes from midnight).
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

// Current date/time parts in India Standard Time (UTC+05:30), regardless of
// the machine's own timezone.
export function istNow() {
  const now = new Date();
  return new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
}

// Exactly one current shift at any moment. Boundaries are half-open
// (start <= t < end), so a shift changes exactly at 12:00 PM and 3:00 PM.
export function getBoard(sec) {
  const openSec = SHIFTS[0].start * 60;

  if (sec < openSec) {
    return {
      current: {
        text: "Academy Starts at 9:00 AM",
        name: "Before First Shift",
        state: "info",
      },
      next: SHIFTS[0],
      remaining: openSec - sec,
      note: null,
    };
  }

  for (let i = 0; i < SHIFTS.length; i += 1) {
    const endSec = SHIFTS[i].end * 60;
    if (sec < endSec) {
      return {
        current: {
          text: SHIFTS[i].label,
          name: SHIFTS[i].name,
          state: "active",
        },
        next: SHIFTS[i + 1] || null,
        remaining: endSec - sec,
        note: SHIFTS[i + 1] ? null : "No more shifts today",
      };
    }
  }

  return {
    current: {
      text: "Academy Closed",
      name: "All Shifts Completed",
      state: "closed",
    },
    next: null,
    remaining: 0,
    note: "No more shifts today",
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

export function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatCountdown(totalSeconds) {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

export function snapshot() {
  const now = istNow();
  const sec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const board = getBoard(sec);

  return {
    clock: formatClock(now),
    date: formatDate(now),
    shiftText: board.current.text,
    shiftName: board.current.name,
    shiftState: board.current.state,
    nextLabel: board.next ? board.next.label : "—",
    countdown: board.next ? formatCountdown(board.remaining) : "—",
    note: board.note,
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
    a.countdown === b.countdown &&
    a.note === b.note
  );
}

// Shared live data hook: checks 4x per second and only triggers a re-render
// when a value actually changes. Used by every route.
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
