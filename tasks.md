# Boxing Timer - Implementation Tasks

## Phase 1: Project Setup

### Setup Tasks
- [x] T001 Create Next.js 15 project with TypeScript and Tailwind CSS
- [x] T002 Configure Tailwind CSS for dark mode and high contrast colors
- [x] T003 Set up project structure according to implementation plan

### Foundational Tasks
- [x] T004 Create core types and interfaces in `src/types/timer.ts`
- [x] T005 Implement localStorage persistence utilities in `src/utils/storage.ts`
- [x] T006 Add audio assets (gong and beeps) to `public/audio/` directory

## Phase 2: User Story 1 - Core Timer Logic (P1)

### [US1] Story Goal: Implement zero-drift timer logic with state management
**Independent Test Criteria**: Timer should accurately count down without drift, manage WORK/REST states, and track rounds correctly.

- [ ] T007 [P] [US1] Create `useBoxingTimer` hook skeleton in `src/hooks/useBoxingTimer.ts`
- [ ] T008 [US1] Implement TimerState and TimerSettings interfaces in `src/hooks/useBoxingTimer.ts`
- [ ] T009 [US1] Implement state initialization with default settings in `useBoxingTimer`
- [ ] T010 [US1] Implement zero-drift timing logic using `Date.now()` in `updateTimer` function
- [ ] T011 [US1] Implement state transition logic (IDLE → WORK → REST → FINISHED) in `useBoxingTimer`
- [ ] T012 [US1] Implement round tracking logic in `useBoxingTimer`
- [ ] T013 [US1] Implement start/stop/reset functions in `useBoxingTimer`
- [ ] T014 [US1] Add useEffect for timer interval management in `useBoxingTimer`
- [ ] T015 [US1] Integrate localStorage settings loading in `useBoxingTimer`
- [ ] T016 [US1] Add settings update function with localStorage persistence in `useBoxingTimer`

## Phase 3: User Story 2 - Timer Display Component (P2)

### [US2] Story Goal: Create high-visibility display with state-based colors
**Independent Test Criteria**: Display should show large, high-contrast numbers and change colors based on WORK/REST states.

- [x] T017 [P] [US2] Create `TimerDisplay` component skeleton in `src/components/TimerDisplay.tsx`
- [x] T018 [US2] Implement TimerDisplayProps interface in `src/components/TimerDisplay.tsx`
- [x] T019 [US2] Implement time formatting logic (ms to MM:SS) in `TimerDisplay`
- [x] T020 [US2] Add high-contrast styling with Tailwind (text-9xl for large display)
- [x] T021 [US2] Implement dynamic background colors based on currentState (red for WORK, green for REST)
- [x] T022 [US2] Add round indicator display (current/total rounds) in `TimerDisplay`
- [x] T023 [US2] Make TimerDisplay responsive for mobile/tablet screens
- [x] T024 [US2] Add dark mode support for better visibility in `TimerDisplay`

## Phase 4: User Story 3 - Control Panel Component (P3)

### [US3] Story Goal: Build touch-optimized controls for timer configuration
**Independent Test Criteria**: Controls should have large touch targets (44×44px) and properly manage timer settings.

- [x] T025 [P] [US3] Create `ControlPanel` component skeleton in `src/components/ControlPanel.tsx`
- [x] T026 [US3] Implement ControlPanelProps interface in `src/components/ControlPanel.tsx`
- [x] T027 [US3] Add touch-optimized Start/Stop/Reset buttons with min-h-[44px] styling
- [x] T028 [US3] Implement work duration input field with mobile-friendly UI in `ControlPanel`
- [x] T029 [US3] Implement rest duration input field with mobile-friendly UI in `ControlPanel`
- [x] T030 [US3] Implement rounds count input field in `ControlPanel`
- [x] T031 [US3] Add volume control slider in `ControlPanel`
- [x] T032 [US3] Implement Save Settings button with localStorage integration in `ControlPanel`
- [x] T033 [US3] Implement Load Settings button in `ControlPanel`
- [x] T034 [US3] Add responsive grid layout for mobile/tablet in `ControlPanel`

## Phase 5: User Story 4 - Audio System Component (P4)

### [US4] Story Goal: Implement audio-first state change triggers
**Independent Test Criteria**: Audio cues should play at correct times (gong at state changes, beeps at 10-second warnings).

- [ ] T035 [P] [US4] Create `AudioSystem` component skeleton in `src/components/AudioSystem.tsx`
- [ ] T036 [US4] Implement AudioSystemProps interface in `src/components/AudioSystem.tsx`
- [ ] T037 [US4] Implement audio preloading for gong and beeps sounds in `AudioSystem`
- [ ] T038 [US4] Add volume control synchronization in `AudioSystem`
- [ ] T039 [US4] Implement gong playback logic (start/end of WORK, end of final REST) in `AudioSystem`
- [ ] T040 [US4] Implement three-beeps warning logic (10 seconds before interval end) in `AudioSystem`
- [ ] T041 [US4] Add audio playback completion callbacks in `AudioSystem`
- [ ] T042 [US4] Implement error handling for audio playback in `AudioSystem`

## Phase 6: User Story 5 - Main Application Integration (P5)

### [US5] Story Goal: Integrate all components into a cohesive application
**Independent Test Criteria**: All components should work together seamlessly with proper state propagation.

- [ ] T043 [P] [US5] Create main page component in `app/page.tsx`
- [ ] T044 [US5] Initialize `useBoxingTimer` hook in main page with default settings
- [ ] T045 [US5] Integrate `TimerDisplay` component with timer state in `app/page.tsx`
- [ ] T046 [US5] Integrate `ControlPanel` component with timer controls in `app/page.tsx`
- [ ] T047 [US5] Integrate `AudioSystem` component with audio triggers in `app/page.tsx`
- [ ] T048 [US5] Implement responsive layout container in `app/page.tsx`
- [ ] T049 [US5] Add global styles for high-contrast mobile optimization in `app/globals.css`
- [ ] T050 [US5] Set up proper component communication and state flow

## Phase 7: Polish & Cross-Cutting Concerns

### Final Polish Tasks
- [ ] T051 Test timer precision across different intervals and verify zero-drift
- [ ] T052 Verify audio cue timing accuracy (gong and 10-second beeps)
- [ ] T053 Test mobile responsiveness on various screen sizes
- [ ] T054 Verify touch target sizes (minimum 44×44px) on mobile devices
- [ ] T055 Test localStorage persistence across page reloads
- [ ] T056 Verify high-contrast color accessibility (WORK=red, REST=green)
- [ ] T057 Add loading states and error boundaries for better UX
- [ ] T058 Optimize performance for mobile devices
- [ ] T059 Add PWA capabilities for mobile installation
- [ ] T060 Final testing and bug fixes

## Dependencies

### Story Completion Order:
1. **US1 (Core Timer Logic)** - Must complete first as it provides foundation
2. **US2 (Timer Display)** - Depends on US1 for timer state
3. **US3 (Control Panel)** - Depends on US1 for timer controls
4. **US4 (Audio System)** - Depends on US1 for audio triggers
5. **US5 (Application Integration)** - Depends on all previous stories

### Parallel Execution Opportunities:
- **Within US1**: T007-T016 can be worked on sequentially
- **Within US2**: T017-T024 can be parallelized after US1 completes
- **Within US3**: T025-T034 can be parallelized after US1 completes  
- **Within US4**: T035-T042 can be parallelized after US1 completes
- **Within US5**: T043-T050 can be parallelized after US2-US4 complete
- **Polish Phase**: T051-T060 can be parallelized after integration

## Implementation Strategy

### MVP Scope (First Deliverable):
Complete **User Story 1 (Core Timer Logic)** and basic integration to have a functional timer with:
- Zero-drift timing
- Basic state management
- LocalStorage persistence

### Incremental Delivery:
1. **Week 1**: Setup + US1 (Core logic)
2. **Week 2**: US2 + US3 (Display + Controls)
3. **Week 3**: US4 + US5 (Audio + Integration)
4. **Week 4**: Polish & testing

### Quality Gates:
- Each user story must be independently testable
- All audio cues must trigger at exact millisecond precision
- Mobile touch targets must meet 44×44px minimum
- Settings must persist across browser sessions

## Summary

**Total Tasks**: 60
**Tasks per Story**:
- Setup: 3 tasks
- Foundational: 3 tasks
- US1: 10 tasks
- US2: 8 tasks
- US3: 10 tasks
- US4: 8 tasks
- US5: 8 tasks
- Polish: 10 tasks

**Parallel Opportunities**: High - Multiple components can be developed simultaneously after core logic is complete
**Suggested MVP**: Complete US1 for basic functional timer
**Format Validation**: All tasks follow required checklist format with IDs, story labels, and file paths
