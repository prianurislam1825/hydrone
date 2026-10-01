'use client';

import { useEffect, useRef, useState } from 'react';

interface RovState {
  fwd: number;
  yaw: number;
  vert: number;
  armed: boolean;
  relays: [boolean, boolean, boolean, boolean];
}

interface Telemetry {
  raw: string;
  connected: boolean;
}

export function useRovControl(ipAddress: string = '192.168.4.2') {
  const [telemetry, setTelemetry] = useState<Telemetry>({ raw: '', connected: false });
  const [gamepadConnected, setGamepadConnected] = useState(false);
  const [activeCommand, setActiveCommand] = useState({ fwd: 0, yaw: 0, vert: 0, source: 'none' });
  
  // Virtual control state (controlled by UI)
  const virtualState = useRef<RovState>({
    fwd: 0,
    yaw: 0,
    vert: 0,
    armed: false,
    relays: [false, false, false, false],
  });

  // Keep track of previous button states for edge detection (toggling)
  const prevButtons = useRef<boolean[]>(new Array(16).fill(false));

  // Keyboard state
  const keys = useRef<Set<string>>(new Set());

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase());
    const onKeyUp = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Listen for gamepad connections
    const onGamepadConnected = () => setGamepadConnected(true);
    const onGamepadDisconnected = () => setGamepadConnected(false);
    
    window.addEventListener('gamepadconnected', onGamepadConnected);
    window.addEventListener('gamepaddisconnected', onGamepadDisconnected);

    let isPolling = true;

    // Command interval (10Hz / 100ms)
    const cmdInterval = setInterval(() => {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      const pad = pads[0]; // Use first connected gamepad

      let fwd = virtualState.current.fwd;
      let yaw = virtualState.current.yaw;
      let vert = virtualState.current.vert;
      let armed = virtualState.current.armed;
      let relays = [...virtualState.current.relays] as [boolean, boolean, boolean, boolean];

      if (pad) {
        setGamepadConnected(true);
        const deadzone = 0.15;
        const throttle = 100;

        // Axes (Gamepad API: stick UP is -1.0)
        let rawFwd = pad.axes[1] || 0;
        let rawYaw = pad.axes[0] || 0;
        let rawVert = pad.axes[3] || 0;

        rawFwd = Math.abs(rawFwd) < deadzone ? 0 : rawFwd;
        rawYaw = Math.abs(rawYaw) < deadzone ? 0 : rawYaw;
        rawVert = Math.abs(rawVert) < deadzone ? 0 : rawVert;

        const padFwd = Math.round(-rawFwd * throttle);
        const padYaw = Math.round(rawYaw * throttle);
        const padVert = Math.round(-rawVert * throttle);

        // Override virtual directions if gamepad is being used
        if (padFwd !== 0 || padYaw !== 0 || padVert !== 0) {
          fwd = padFwd;
          yaw = padYaw;
          vert = padVert;
        }

        // Edge detection for buttons
        // Button 0 (A): Toggle Arm
        const btnArm = pad.buttons[0]?.pressed || false;
        if (btnArm && !prevButtons.current[0]) {
          armed = !virtualState.current.armed;
          virtualState.current.armed = armed;
        }
        prevButtons.current[0] = btnArm;

        // Button 2 (X): Relay 1
        const btnR1 = pad.buttons[2]?.pressed || false;
        if (btnR1 && !prevButtons.current[2]) {
          relays[0] = !virtualState.current.relays[0];
          virtualState.current.relays[0] = relays[0];
        }
        prevButtons.current[2] = btnR1;

        // Button 3 (Y): Relay 2
        const btnR2 = pad.buttons[3]?.pressed || false;
        if (btnR2 && !prevButtons.current[3]) {
          relays[1] = !virtualState.current.relays[1];
          virtualState.current.relays[1] = relays[1];
        }
        prevButtons.current[3] = btnR2;

        // Button 4 (LB): Relay 3
        const btnR3 = pad.buttons[4]?.pressed || false;
        if (btnR3 && !prevButtons.current[4]) {
          relays[2] = !virtualState.current.relays[2];
          virtualState.current.relays[2] = relays[2];
        }
        prevButtons.current[4] = btnR3;

        // Button 5 (RB): Relay 4
        const btnR4 = pad.buttons[5]?.pressed || false;
        if (btnR4 && !prevButtons.current[5]) {
          relays[3] = !virtualState.current.relays[3];
          virtualState.current.relays[3] = relays[3];
        }
        prevButtons.current[5] = btnR4;
      } else {
        setGamepadConnected(false);
      }

      // --- Keyboard Fallback (if no physical gamepad axes override) ---
      // WASD for fwd/yaw. ArrowUp/Down for vert.
      let kFwd = 0;
      let kYaw = 0;
      let kVert = 0;
      
      if (!gamepadConnected || (fwd === 0 && yaw === 0 && vert === 0)) {
        if (keys.current.has('w')) kFwd = -100;
        if (keys.current.has('s')) kFwd = 100;
        if (keys.current.has('d')) kYaw = 100;
        if (keys.current.has('a')) kYaw = -100;
        
        if (keys.current.has('arrowup')) kVert = 100;
        if (keys.current.has('arrowdown')) kVert = -100;

        if (kFwd !== 0 || kYaw !== 0 || kVert !== 0) {
          fwd = kFwd;
          yaw = kYaw;
          vert = kVert;
        }

        // We don't do toggle for keyboard relays here to avoid rapid firing, 
        // but user can use mouse to click UI buttons.
      }

      // Update UI state for visual feedback
      let source = 'none';
      if (kFwd !== 0 || kYaw !== 0 || kVert !== 0) {
         source = 'keyboard';
      } else if (pad && (Math.abs(pad.axes[1] || 0) > 0.15 || Math.abs(pad.axes[0] || 0) > 0.15 || Math.abs(pad.axes[3] || 0) > 0.15)) {
         source = 'gamepad';
      } else if (fwd !== 0 || yaw !== 0 || vert !== 0) {
         source = 'virtual';
      }
      
      setActiveCommand(prev => {
         if (prev.fwd === fwd && prev.yaw === yaw && prev.vert === vert && prev.source === source) return prev;
         return { fwd, yaw, vert, source };
      });

      // Dummy mode presentation shortcuts
      let dummyModeStr = '';
      if (keys.current.has('1')) dummyModeStr = '&dummyMode=1';
      if (keys.current.has('2')) dummyModeStr = '&dummyMode=2';
      if (keys.current.has('3')) dummyModeStr = '&dummyMode=3';

      // Send to ESP32 via API proxy to bypass CORS (and proxy will send UDP to ESP32)
      const query = `fwd=${fwd}&yaw=${yaw}&vert=${vert}&armed=${armed ? 1 : 0}&r1=${relays[0] ? 1 : 0}&r2=${relays[1] ? 1 : 0}&r3=${relays[2] ? 1 : 0}&r4=${relays[3] ? 1 : 0}${dummyModeStr}`;
      fetch(`/api/rov?ip=${ipAddress}&type=cmd&${query}`).catch(() => {});

    }, 50);

    // Telemetry polling (2Hz / 500ms)
    const statusInterval = setInterval(() => {
      fetch(`/api/rov?ip=${ipAddress}&type=status`)
        .then(r => r.json())
        .then(json => {
          if (isPolling) {
            if (json.success && json.data) {
              setTelemetry({ raw: json.data, connected: true });
            } else {
              setTelemetry(prev => ({ ...prev, connected: false }));
            }
          }
        })
        .catch(() => {
          if (isPolling) setTelemetry(prev => ({ ...prev, connected: false }));
        });
    }, 500);

    return () => {
      isPolling = false;
      clearInterval(cmdInterval);
      clearInterval(statusInterval);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('gamepadconnected', onGamepadConnected);
      window.removeEventListener('gamepaddisconnected', onGamepadDisconnected);
    };
  }, [ipAddress]);

  return {
    telemetry,
    gamepadConnected,
    setVirtualArmed: (armed: boolean) => { virtualState.current.armed = armed; },
    setVirtualRelay: (idx: number, state: boolean) => { virtualState.current.relays[idx] = state; },
    setVirtualVector: (fwd: number, yaw: number, vert: number) => {
      virtualState.current.fwd = fwd;
      virtualState.current.yaw = yaw;
      virtualState.current.vert = vert;
    },
    // Expose current states for UI re-rendering
    getVirtualState: () => virtualState.current,
    activeCommand
  };
}
