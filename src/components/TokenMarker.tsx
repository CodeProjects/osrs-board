import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PathStep } from "../lib/movePath";
import helmetIcon from "../assets/helmet icon.png";
import "./TokenMarker.css";

const WALK_STEP_MS = 160;
const SLIDE_STEP_MS = 500;

function durationFor(segment: PathStep["segment"] | undefined): number {
  return segment === "chute" || segment === "ladder" ?
      SLIDE_STEP_MS
    : WALK_STEP_MS;
}

interface TokenMarkerProps {
  /** Animation route for the move in progress, or null when the token is at rest. */
  path: PathStep[] | null;
  /** Resting tile to show when there's no path animating. */
  restingTile: number;
  /** Looks up the rendered tile element for a tile number, so the marker can align to it. */
  getTileEl: (tileNumber: number) => HTMLElement | null;
  /** Positioning anchor — must be `position: relative` and wrap every tile the token can visit. */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Called once the token reaches the end of `path`. */
  onSettle: () => void;
}

// Rendered with `key={moveId}` by BoardPage so a new path always starts this
// component fresh (stepIndex back at 0) instead of needing to reset state
// in response to a prop change.
function TokenMarker({
  path,
  restingTile,
  getTileEl,
  containerRef,
  onSettle,
}: TokenMarkerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const markerRef = useRef<HTMLImageElement>(null);

  // Advance through the path over time; settle once it reaches the last step.
  useEffect(() => {
    if (!path) return;
    if (stepIndex >= path.length - 1) {
      // Wait out the last hop's own transition before settling — settling switches
      // the marker to "snap" mode (no transition), so calling onSettle immediately
      // would cut the final slide off mid-flight instead of letting it finish.
      const duration = durationFor(path[stepIndex].segment);
      const timer = setTimeout(onSettle, duration);
      return () => clearTimeout(timer);
    }
    const duration = durationFor(path[stepIndex + 1].segment);
    const timer = setTimeout(() => setStepIndex((i) => i + 1), duration);
    return () => clearTimeout(timer);
  }, [path, stepIndex, onSettle]);

  const activeTile = path ? path[stepIndex].tileNumber : restingTile;
  const isFirstStep = !path || stepIndex === 0;
  const transitionMs = isFirstStep ? 0 : durationFor(path[stepIndex].segment);

  // Position the marker over whichever tile is currently active, measuring real DOM
  // rects rather than computing grid math so it stays correct across the corner tiles,
  // the numbered grid, and the mobile tile-size breakpoint.
  const reposition = (duration: number) => {
    const marker = markerRef.current;
    const container = containerRef.current;
    const tileEl = getTileEl(activeTile);
    if (!marker || !container || !tileEl) return;

    const containerRect = container.getBoundingClientRect();
    const tileRect = tileEl.getBoundingClientRect();
    const x = tileRect.left - containerRect.left;
    const y = tileRect.top - containerRect.top;

    marker.style.transitionDuration = `${duration}ms`;
    marker.style.width = `${tileRect.width}px`;
    marker.style.height = `${tileRect.height}px`;
    marker.style.transform = `translate(${x}px, ${y}px)`;
  };

  useLayoutEffect(() => {
    reposition(transitionMs);
  });

  // On mount, `containerRef` (the `.board-frame` ancestor) hasn't attached yet when the
  // effect above first runs — React attaches a parent's ref only after its descendants'
  // layout effects have already fired — so that first call silently no-ops. `useEffect`
  // fires once the whole tree has committed, by which point the ref is populated, so
  // this catches the initial placement (e.g. on page load/refresh).
  useEffect(() => {
    reposition(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-align on resize (e.g. crossing the mobile tile-size breakpoint) without animating.
  useEffect(() => {
    const handleResize = () => reposition(0);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <img
      ref={markerRef}
      className={`token-marker ${isFirstStep ? "token-marker--snap" : ""}`}
      src={helmetIcon}
      alt="Team token"
    />
  );
}

export default TokenMarker;
