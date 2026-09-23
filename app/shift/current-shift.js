"use client";

import Link from "next/link";
import BoardHead from "../components/board-head";
import { useBoard } from "../lib/board";

// "02:45:13 PM" -> "02:45 PM": ticking seconds would only add flicker on a
// screen meant to be read from a distance.
function quietClock(clock) {
  return clock.replace(/^(\d{1,2}:\d{2}):\d{2}/, "$1");
}

// /shift route: the current shift only, set as large as possible so it stays
// readable from the back of a classroom. Navigation back to the clock (/).
export default function CurrentShift() {
  const view = useBoard();
  const ready = view !== null;
  const state = ready ? view.shiftState : "active";

  return (
    <main className="screen screen--shift">
      <BoardHead />

      {/* Small live time: useful for punctuality, never louder than the shift. */}
      <p className="shift-clock">
        <span>{ready ? quietClock(view.clock) : "—"}</span>
        <span className="shift-clock-sep" aria-hidden="true">
          ·
        </span>
        <span>{ready ? view.date : ""}</span>
      </p>

      <section className={`shift-card shift-card--hero ${state}`}>
        <p className="card-label">Current Shift</p>
        <p className="shift-time" aria-live="polite">
          {ready ? view.shiftText : "—"}
        </p>
        <p className="shift-name">{ready ? view.shiftName : ""}</p>
      </section>

      <nav className="actions">
        <Link href="/" className="btn btn-ghost">
          <svg
            className="btn-icon"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          Back to Clock
        </Link>
      </nav>
    </main>
  );
}
