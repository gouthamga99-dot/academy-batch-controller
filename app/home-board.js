"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BoardHead from "./components/board-head";
import { useBoard } from "./lib/board";

// Home route (/): time display + what is coming next, with a button that
// switches to the current-shift view (/shift).
export default function HomeBoard() {
  const view = useBoard();
  const ready = view !== null;

  return (
    <main className="screen">
      <BoardHead />

      <section className="clock-block">
        <div className="clock">{ready ? view.clock : "—"}</div>
        <div className="date">{ready ? view.date : ""}</div>
      </section>

      <section className="next-row">
        <div className="next-card">
          <p className="card-label">Next Shift</p>
          <p className="next-time">{ready ? view.nextLabel : "—"}</p>
          {ready && view.note ? <p className="next-note">{view.note}</p> : null}
        </div>

        <div className="next-card">
          <p className="card-label">Next Shift In</p>
          <p className="countdown">{ready ? view.countdown : "—"}</p>
          {ready && view.note ? <p className="next-note">{view.note}</p> : null}
        </div>
      </section>

      <nav className="actions">
        <Link href="/shift" className="btn btn-primary">
          Current Shift
          <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
        </Link>
      </nav>
    </main>
  );
}
