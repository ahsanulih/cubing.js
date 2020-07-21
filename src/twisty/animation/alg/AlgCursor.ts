/* eslint-disable no-case-declarations */
// TODO: private vs. public properties/methods.
// TODO: optional construtor arguments for DOM elements
// TODO: figure out what can be moved into a worker using OffscreenCanvas https://developers.google.com/web/updates/2018/08/offscreen-canvas

/* eslint-disable @typescript-eslint/no-empty-interface */

// start of imports
import { AlgPart, Sequence } from "../../../alg";
import {
  KPuzzleDefinition,
  Transformation as KPuzzleState,
} from "../../../kpuzzle";
import { TreeAlgorithmIndexer } from "../../../twisty-old/cursor";
import { KSolvePuzzle } from "../../../twisty-old/puzzle";
import {
  MillisecondTimestamp,
  Timeline,
  TimelineTimestampListener,
} from "../Timeline";
// end of imports

// Model

export type Fraction = number; // Value from 0 to 1.
export enum Direction {
  Forwards = 1,
  Paused = 0,
  Backwards = -1,
}
export interface MoveInProgress {
  move: AlgPart;
  direction: Direction;
  fraction: number;
}

export type PuzzlePosition = {
  state: KPuzzleState;
  movesInProgress: MoveInProgress[];
};

export interface PositionListener {
  onPositionChange(position: PuzzlePosition): void;
}

export interface PositionDispatcher {
  addPositionListener(positionListener: PositionListener): void;
}

export class AlgCursor
  implements TimelineTimestampListener, PositionDispatcher {
  private todoIndexer: TreeAlgorithmIndexer<KSolvePuzzle>;
  private positionListeners: Set<PositionListener> = new Set(); // TODO: accessor instead of direct access
  constructor(timeline: Timeline, def: KPuzzleDefinition, alg: Sequence) {
    timeline.addTimestampListener(this);
    const kp = new KSolvePuzzle(def);
    this.todoIndexer = new TreeAlgorithmIndexer(kp, alg);
    /*...*/
  }

  addPositionListener(positionListener: PositionListener): void {
    this.positionListeners.add(positionListener);
  }

  onTimelineTimestampChange(timestamp: MillisecondTimestamp): void {
    const idx = this.todoIndexer.timestampToIndex(timestamp);
    const state = this.todoIndexer.stateAtIndex(idx) as any; // TODO
    const position: PuzzlePosition = {
      state,
      movesInProgress: [
        {
          move: this.todoIndexer.getMove(idx),
          direction: Direction.Forwards,
          fraction:
            (timestamp - this.todoIndexer.indexToMoveStartTimestamp(idx)) /
            this.todoIndexer.moveDuration(idx),
        },
      ],
    };
    for (const listener of this.positionListeners) {
      listener.onPositionChange(position);
    }
  }
}
