// Shared board header: title + LIVE indicator. Used by every route.
export default function BoardHead() {
  return (
    <header className="head">
      <h1 className="title">Academy Batch Controller</h1>
      <p className="live">
        <span className="live-dot" aria-hidden="true" />
        Live
      </p>
    </header>
  );
}
