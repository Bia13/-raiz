/**
 * A tiny synthesized ambient pad — three detuned sine tones through a slowly
 * drifting lowpass filter. No audio file to license or ship, just Web Audio.
 */

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

type AmbientPad = {
  setMuted: (muted: boolean) => void;
  stop: () => void;
};

const TARGET_VOLUME = 0.05;
const NOTE_FREQUENCIES = [130.81, 196.0, 261.63]; // C3, G3, C4 — a quiet open triad

export function createAmbientPad(): AmbientPad | null {
  if (typeof window === "undefined") return null;

  const AudioCtx = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioCtx) return null;

  const ctx = new AudioCtx();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});

  const master = ctx.createGain();
  master.gain.value = 0.0001;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;

  master.connect(filter);
  filter.connect(ctx.destination);

  const oscillators: OscillatorNode[] = [];

  NOTE_FREQUENCIES.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.value = i === 0 ? 0.55 : 0.25;
    osc.connect(gain);
    gain.connect(master);
    osc.start();
    oscillators.push(osc);
  });

  // Slow LFO breathing the filter open and closed for gentle movement.
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.05;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 200;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();
  oscillators.push(lfo);

  master.gain.linearRampToValueAtTime(TARGET_VOLUME, ctx.currentTime + 2.5);

  let stopped = false;

  return {
    setMuted(muted) {
      if (stopped) return;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(
        muted ? 0.0001 : TARGET_VOLUME,
        ctx.currentTime + 0.5
      );
    },
    stop() {
      if (stopped) return;
      stopped = true;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      setTimeout(() => {
        oscillators.forEach((osc) => {
          try {
            osc.stop();
          } catch {
            // already stopped
          }
        });
        ctx.close().catch(() => {});
      }, 700);
    },
  };
}
