# Boxing Timer Feature Specification

## Precision
- Use system clock via `Date.now()` to calculate delta time, preventing drift.

## States
- **IDLE**: Timer not running, awaiting start.
- **WORK**: Counting down work interval.
- **REST**: Counting down rest interval.
- **FINISHED**: All rounds completed; timer stopped.

## Audio Signals
- **Long gong**: Played at the start of a WORK interval, at the end of a WORK interval, and at the end of the final REST interval (i.e., session end).
- **Three beeps**: Played 10 seconds before the end of any WORK or REST interval to warn the user.

## Persistence
- User settings (round count, work duration, rest duration, sound volume, etc.) are persisted using `localStorage` so they survive page reloads and browser restarts.

## Additional Considerations (derived from Constitution)
- **High Visibility**: UI will employ high‑contrast colors (e.g., red/green) for readability at a distance.
- **Mobile Ready**: Interface optimized for touch inputs on smartphones and tablets.
- **Sound First**: The audio cues (gong/beeps) are the primary triggers for state changes; visual updates follow.
