import { NextResponse } from 'next/server';
import { readClassroomStore, writeClassroomStore } from '../../../../lib/classroomStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  const state = readClassroomStore();
  return NextResponse.json(state);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload } = body as { action: string; payload: any };
    const state = readClassroomStore();

    switch (action) {
      case 'ACTIVATE_BLUEPRINT': {
        state.activeBlueprint = payload.blueprint;
        break;
      }
      case 'SUBMIT_CLAIM': {
        const { studentId, claim } = payload;
        state.claimsByStudent[studentId] = {
          ...(state.claimsByStudent[studentId] || {}),
          [claim.levelNumber]: claim,
        };
        break;
      }
      case 'COMPLETE_LEVEL': {
        const { studentId, levelNumber } = payload;
        const existing = state.completedLevelsByStudent[studentId] || [];
        if (!existing.includes(levelNumber)) {
          state.completedLevelsByStudent[studentId] = [...existing, levelNumber];
        }
        break;
      }
      case 'LOG_BATCH': {
        const { studentId, record } = payload;
        state.batchLogsByStudent[studentId] = record;
        break;
      }
      case 'REQUEST_HELP': {
        const reqItem = payload.request;
        if (!state.helpRequests.some((r) => r.id === reqItem.id)) {
          state.helpRequests = [reqItem, ...state.helpRequests];
        }
        break;
      }
      case 'RESOLVE_HELP': {
        state.helpRequests = state.helpRequests.map((r) =>
          r.id === payload.id ? { ...r, status: 'resolved' } : r
        );
        break;
      }
      case 'TOGGLE_AI_PAUSE': {
        const { studentId } = payload;
        state.pausedStudentIds[studentId] = !state.pausedStudentIds[studentId];
        break;
      }
      case 'DIRECT_MESSAGE': {
        const { studentId, message } = payload;
        const list = state.directMessagesByStudent[studentId] || [];
        state.directMessagesByStudent[studentId] = [...list, message];
        break;
      }
      case 'UPDATE_SIGNAL': {
        const { studentId, misconceptionTag, confidenceTag } = payload;
        state.studentSignals[studentId] = { misconceptionTag, confidenceTag };
        break;
      }
      case 'ADD_DISCUSSION_POST': {
        state.discussionPosts = [payload.post, ...state.discussionPosts];
        break;
      }
      case 'LIKE_DISCUSSION_POST': {
        state.discussionPosts = state.discussionPosts.map((p) =>
          p.id === payload.id ? { ...p, likes: p.likes + 1 } : p
        );
        break;
      }
      case 'SAVE_VIVA': {
        const { studentId, levelNumber, submission } = payload;
        state.vivaByStudent[studentId] = {
          ...(state.vivaByStudent[studentId] || {}),
          [levelNumber]: submission,
        };
        break;
      }
      case 'SEND_PARENT_NOTE': {
        state.parentNotes = [payload.note, ...state.parentNotes];
        break;
      }
      case 'DELETE_STUDENT_DATA': {
        const { studentId } = payload;
        delete state.claimsByStudent[studentId];
        delete state.completedLevelsByStudent[studentId];
        delete state.vivaByStudent[studentId];
        delete state.pausedStudentIds[studentId];
        delete state.directMessagesByStudent[studentId];
        delete state.studentSignals[studentId];
        delete state.batchLogsByStudent[studentId];
        state.helpRequests = state.helpRequests.filter((r) => r.studentId !== studentId);
        state.parentNotes = state.parentNotes.filter((n) => n.studentId !== studentId);
        break;
      }
      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    const updated = writeClassroomStore(state);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Classroom state update failed' },
      { status: 500 }
    );
  }
}
