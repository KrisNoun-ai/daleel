'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOmniMesh } from '../../context/SnackLabContext';
import {
  Mic,
  Square,
  X,
  Sparkles,
  CheckCircle2,
  Volume2,
} from 'lucide-react';

interface VivaVoceModalProps {
  isOpen: boolean;
  onClose: () => void;
  levelNumber: number;
}

export const VivaVoceModal: React.FC<VivaVoceModalProps> = ({
  isOpen,
  onClose,
  levelNumber,
}) => {
  const {
    student,
    activeBlueprint,
    claimsByLevel,
    vivaSubmissions,
    saveVivaSubmission,
  } = useOmniMesh();

  const [isRecording, setIsRecording] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  const existing = vivaSubmissions[levelNumber];

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  if (!isOpen) return null;

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
  };

  const startRecording = async () => {
    setErrorMsg(null);
    setSecondsElapsed(0);
    setAudioUrl(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setIsRecording(true);

      // Optional live browser speech-to-text transcription
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';
        rec.onresult = (event: any) => {
          let finalStr = '';
          for (let i = 0; i < event.results.length; i++) {
            finalStr += event.results[i][0].transcript + ' ';
          }
          setTranscript(finalStr.trim());
        };
        rec.start();
        recognitionRef.current = rec;
      }

      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => {
          if (prev + 1 >= 180) {
            stopRecording();
            return 180;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setErrorMsg(
        'Microphone access unavailable in this browser. You can still type or dictate your 2-minute oral defense transcript below.'
      );
    }
  };

  const handleEvaluate = async () => {
    if (!transcript.trim()) {
      setErrorMsg('Record or enter your oral defense explanation before evaluating.');
      return;
    }
    setIsEvaluating(true);
    setErrorMsg(null);
    try {
      const resp = await fetch('/api/viva/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          durationSeconds: secondsElapsed || 30,
          levelNumber,
          studentName: student.name,
          initialClaim: claimsByLevel[levelNumber]?.claimText || '',
          blueprint: activeBlueprint,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.evaluation) {
        throw new Error(data.error || 'Evaluation failed');
      }
      saveVivaSubmission(levelNumber, {
        transcript,
        durationSeconds: secondsElapsed || 30,
        evaluation: data.evaluation,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not evaluate oral defense.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#223528] text-amber-300 flex items-center justify-center">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Oral Defense (Viva Voce) — Level {levelNumber}
              </h3>
              <p className="text-xs text-stone-500">
                2–3 minute audio explanation evaluated against your venture rubric
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs bg-[#FBFBF9]">
          {/* Recorder Controls */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  <Mic className="h-4 w-4" />
                  <span>Start 2–3 Min Recording</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xs animate-pulse cursor-pointer"
                >
                  <Square className="h-4 w-4" />
                  <span>Stop Recording</span>
                </button>
              )}
              <span className="font-mono text-sm font-bold text-slate-800">
                {formatTime(secondsElapsed)} / 03:00
              </span>
            </div>

            {audioUrl && (
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-emerald-700" />
                <audio controls src={audioUrl} className="h-8 max-w-[200px]" />
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
              {errorMsg}
            </div>
          )}

          {/* Transcript Box */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">
              Spoken Transcript (Auto-transcribed or editable)
            </label>
            <textarea
              rows={4}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Explain your variable isolation, evidence, and cost/impact reasoning in your own words..."
              className="w-full rounded-2xl border border-stone-300 bg-white p-3.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#223528]/20"
            />
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleEvaluate}
                disabled={isEvaluating || !transcript.trim()}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#223528] hover:bg-[#19271e] text-white font-bold disabled:opacity-40 cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>{isEvaluating ? 'Evaluating Against Rubric...' : 'Evaluate Oral Defense'}</span>
              </button>
            </div>
          </div>

          {/* Rubric Evaluation Result */}
          {existing && (
            <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-5 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <div className="flex items-center gap-2 font-serif font-bold text-sm text-slate-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  <span>Rubric Readiness: {existing.evaluation.overallReadiness}</span>
                </div>
                <span className="text-[10px] font-mono text-stone-400">
                  Saved at {existing.submittedAt}
                </span>
              </div>

              <div className="space-y-1">
                <strong className="text-slate-800 block">Strengths Observed:</strong>
                <ul className="list-disc pl-5 text-stone-700 space-y-0.5">
                  {existing.evaluation.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                <strong>Defense Follow-Up Question:</strong> {existing.evaluation.followUpQuestion}
              </div>

              <div className="space-y-1.5">
                {existing.evaluation.criterionScores.map((cs, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{cs.criterion}</span>
                      <span className="text-stone-600">{cs.note}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                      {cs.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
