import CurrentShift from "./current-shift";

export const metadata = {
  title: "Current Shift · Academy Batch Controller",
  description: "Live display of the currently active academy shift (IST).",
};

export default function ShiftPage() {
  return <CurrentShift />;
}
