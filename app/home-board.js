"use client";

import Link from "next/link";
import BoardHead from "./components/board-head";
import { useBoard } from "./lib/board";

// Home route (/): the clock plus the single currently active shift only.
// One button opens the large classroom display of that shift (/shift).
export default function HomeBoard() {
  const view = useBoard();
  const ready = view !== null;
  const state = ready ? view.shiftState : "active";

  return (
    <main className="screen">
      <BoardHead />

      <section className="clock-block">
        <div className="clock">{ready ? view.clock : "—"}</div>
        <div className="date">{ready ? view.date : ""}</div>
      </section>

      {/* Only the active shift is ever rendered here. */}
      <section className={`shift-card ${state}`}>
        <p className="card-label">Current Shift</p>
        <p className="shift-time" aria-live="polite">
          {ready ? view.shiftText : "—"}
        </p>
        <p className="shift-name">{ready ? view.shiftName : ""}</p>
      </section>

      <nav className="actions">
        <Link href="/shift" className="btn btn-primary">
          Open Shift Display
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
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </nav>
    </main>
  );
}
