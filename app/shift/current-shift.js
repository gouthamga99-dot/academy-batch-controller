"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BoardHead from "../components/board-head";
import { useBoard } from "../lib/board";

// /shift route: full-screen display of the currently active shift only,
// with a button to switch back to the clock view (/).
export default function CurrentShift() {
  const view = useBoard();
  const ready = view !== null;
  const state = ready ? view.shiftState : "active";

  return (
    <main className="screen screen--shift">
      <BoardHead />

      <section className={`shift-card ${state}`}>
        <p className="card-label">Current Shift</p>
        <p className="shift-time" aria-live="polite">
          {ready ? view.shiftText : "—"}
        </p>
        <p className="shift-name">{ready ? view.shiftName : ""}</p>
      </section>

      <nav className="actions">
        <Link href="/" className="btn btn-ghost">
          <ArrowLeft size={18} strokeWidth={2.4} aria-hidden="true" />
          Clock
        </Link>
      </nav>
    </main>
  );
}
