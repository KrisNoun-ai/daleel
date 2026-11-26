/**
 * Cross-tab & Realtime Classroom Sync Bus.
 * Uses BroadcastChannel + localStorage events out of the box for zero-config
 * Student <-> Teacher sync, and is structured to mirror Supabase Realtime channels.
 */

export type ClassroomEvent =
  | {
      type: 'HELP_REQUEST';
      payload: {
        id: string;
        studentId: string;
        studentName: string;
        levelNumber: number;
        levelTitle: string;
        message: string;
        timestamp: string;
        priority: 'normal' | 'stall_3x' | 'safeguarding';
      };
    }
  | {
      type: 'TEACHER_OVERRIDE_PAUSE';
      payload: {
        studentId: string;
        paused: boolean;
      };
    }
  | {
      type: 'TEACHER_DIRECT_MESSAGE';
      payload: {
        studentId: string;
        text: string;
        timestamp: string;
      };
    }
  | {
      type: 'MISCONCEPTION_SIGNAL';
      payload: {
        studentId: string;
        studentName: string;
        misconceptionTag: string | null;
        confidenceTag: string;
      };
    };

const CHANNEL_NAME = 'daleel_classroom_realtime_v1';

export function broadcastClassroomEvent(event: ClassroomEvent): void {
  if (typeof window === 'undefined') return;
  try {
    if ('BroadcastChannel' in window) {
      const ch = new BroadcastChannel(CHANNEL_NAME);
      ch.postMessage(event);
      ch.close();
    }
  } catch {
    // Ignore unsupported BroadcastChannel environments
  }
}

export function subscribeClassroomEvents(
  handler: (event: ClassroomEvent) => void
): () => void {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
    return () => {};
  }
  const ch = new BroadcastChannel(CHANNEL_NAME);
  ch.onmessage = (msg) => {
    if (msg?.data?.type) {
      handler(msg.data as ClassroomEvent);
    }
  };
  return () => ch.close();
}
