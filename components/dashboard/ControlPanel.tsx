'use client'

import { Anchor, Filter, Power, TriangleAlert, Gamepad2, Wifi, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import VirtualJoystick, { type JoystickVector } from './VirtualJoystick';
import { useRovControl } from '@/hooks/useRovControl';

function ToggleSwitch({ label, icon, active, onToggle, color = '#1A56DB' }: { label: string; icon: React.ReactNode; active: boolean; onToggle: () => void; color?: string }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all border"
      style={{ background: 'var(--t-surface-2)', borderColor: 'var(--t-border)' }}
      onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(26,86,219,0.5)')}
      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--t-border)')}
    >
      <div className="flex items-center gap-2.5">
        <span style={{ color: active ? color : 'var(--t-muted)' }}>{icon}</span>
        <span className="text-sm font-medium" style={{ color: 'var(--t-text)' }}>{label}</span>
      </div>
      <div className="relative w-10 rounded-full border transition-all duration-300" style={{ height: 22, background: active ? color : 'var(--t-bg)', borderColor: active ? color : 'var(--t-border)' }}>
        <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300" style={{ left: active ? 20 : 2 }} />
      </div>
    </button>
  )
}

export default function ControlPanel() {
  const [ipAddress, setIpAddress] = useState('192.168.4.2');
  const [editIp, setEditIp] = useState(false);
  
  const { 
    telemetry, 
    gamepadConnected, 
    setVirtualArmed, 
    setVirtualRelay, 
    setVirtualVector,
    getVirtualState,
    activeCommand
  } = useRovControl(ipAddress);

  const [uiState, setUiState] = useState({
    armed: false,
    r1: false,
    r2: false,
    r3: false,
    r4: false
  });

  // Force re-render state periodically if gamepad changes it
  useEffect(() => {
    const interval = setInterval(() => {
      const state = getVirtualState();
      setUiState({
        armed: state.armed,
        r1: state.relays[0],
        r2: state.relays[1],
        r3: state.relays[2],
        r4: state.relays[3],
      });
    }, 200);
    return () => clearInterval(interval);
  }, [getVirtualState]);

  const handleJoystickLeft = (v: JoystickVector) => {
    const state = getVirtualState();
    setVirtualVector(Math.round(-v.y * 100), Math.round(v.x * 100), state.vert);
  };

  const handleJoystickRight = (v: JoystickVector) => {
    const state = getVirtualState();
    setVirtualVector(state.fwd, state.yaw, Math.round(-v.y * 100));
  };

  const handleEmergencyStop = () => {
    setVirtualArmed(false);
    setVirtualRelay(0, false);
    setVirtualRelay(1, false);
    setVirtualRelay(2, false);
    setVirtualRelay(3, false);
    setVirtualVector(0, 0, 0);
  };

  return (
    <section role="region" aria-label="Control panel" className="mt-6 rounded-2xl overflow-hidden border" style={{ borderColor: telemetry.connected ? '#22C55E30' : '#F05A2230' }}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b transition-colors" 
           style={{ background: telemetry.connected ? 'rgba(34, 197, 94, 0.1)' : 'rgba(122,45,17,0.15)', borderColor: 'var(--t-border)' }}>
        <div className="flex items-center gap-3">
          {telemetry.connected ? <Wifi size={18} className="text-[#22C55E] shrink-0 animate-pulse" /> : <TriangleAlert size={18} className="text-[#F05A22] shrink-0" />}
          <div>
            <div className="text-sm font-bold tracking-wide flex items-center gap-2" style={{ color: telemetry.connected ? '#22C55E' : '#F05A22' }}>
              ROV CONTROL CENTER
              {gamepadConnected && <span className="flex items-center gap-1 text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30"><Gamepad2 size={12}/> Gamepad Active</span>}
            </div>
            <div className="text-xs mt-0.5 flex items-center gap-2" style={{ color: 'var(--t-muted)' }}>
              ESP32 IP: 
              {editIp ? (
                <input 
                  type="text" 
                  value={ipAddress} 
                  onChange={(e) => setIpAddress(e.target.value)}
                  onBlur={() => setEditIp(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditIp(false)}
                  className="bg-black/20 border border-white/10 rounded px-1 w-24 text-white text-xs outline-none focus:border-blue-500"
                  autoFocus
                />
              ) : (
                <span className="cursor-pointer hover:text-white underline decoration-dashed" onClick={() => setEditIp(true)}>{ipAddress}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setVirtualArmed(!uiState.armed); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-lg ${uiState.armed ? 'bg-[#EF4444] text-white border-red-400' : 'bg-transparent text-green-500 border-green-500 hover:bg-green-500/10'}`}
          >
            {uiState.armed ? 'DISARM MOTORS' : 'ARM MOTORS'}
          </button>
          <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold border ${telemetry.connected ? 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30' : 'bg-[#F05A22]/15 text-[#F05A22] border-[#F05A22]/30'}`}>
            {telemetry.connected ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ background: 'var(--t-surface)' }}>
        
        {/* Left Joystick (Fwd/Yaw) */}
        <div className="flex flex-col items-center gap-4">
          <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'var(--t-muted)' }}>Maneuver (Fwd / Yaw)</span>
          <div className="opacity-100 transition-opacity" style={{ opacity: gamepadConnected ? 0.3 : 1 }}>
            <VirtualJoystick label="L-STICK" size={140} onChange={handleJoystickLeft} accentColor="#00B4D8" />
          </div>
          <div className="text-[10px] text-center" style={{ color: 'var(--t-muted)' }}>
            {gamepadConnected ? 'Use Controller Left Stick' : 'Drag to move'}
          </div>
        </div>

        {/* Right Joystick (Depth/Vert) */}
        <div className="flex flex-col items-center gap-4">
          <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'var(--t-muted)' }}>Depth (Vert)</span>
          <div className="opacity-100 transition-opacity" style={{ opacity: gamepadConnected ? 0.3 : 1 }}>
            <VirtualJoystick label="R-STICK" size={140} onChange={handleJoystickRight} accentColor="#22C55E" />
          </div>
          <div className="text-[10px] text-center" style={{ color: 'var(--t-muted)' }}>
            {gamepadConnected ? 'Use Controller Right Stick' : 'Drag Y to ascend/descend'}
          </div>
        </div>

        {/* Relays & Systems */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'var(--t-muted)' }}>Systems & Relays</span>
          <div className="flex flex-col gap-3">
            <ToggleSwitch label="Relay 1 (Net/Filter)" icon={<Filter size={14} />} active={uiState.r1} onToggle={() => setVirtualRelay(0, !uiState.r1)} color="#1A56DB" />
            <ToggleSwitch label="Relay 2 (Pump)" icon={<Zap size={14} />} active={uiState.r2} onToggle={() => setVirtualRelay(1, !uiState.r2)} color="#D4A017" />
            <ToggleSwitch label="Relay 3 (Aux 1)" icon={<Anchor size={14} />} active={uiState.r3} onToggle={() => setVirtualRelay(2, !uiState.r3)} color="#22C55E" />
            <ToggleSwitch label="Relay 4 (Aux 2)" icon={<Zap size={14} />} active={uiState.r4} onToggle={() => setVirtualRelay(3, !uiState.r4)} color="#9C27B0" />
            
            <button onClick={handleEmergencyStop} className="mt-2 flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 hover:bg-[#EF4444]/20 active:scale-95 transition-all text-[#EF4444] text-sm font-bold">
              <Power size={14} />Emergency Stop
            </button>
          </div>
        </div>

      </div>

      {/* Keyboard/Gamepad Status Feedback */}
      <div className="px-4 py-2 border-t text-[10px] font-mono flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}>
        <span>
          Input Source: <span className="font-bold text-white uppercase">{activeCommand.source}</span>
        </span>
        <span className="flex gap-4">
          <span>FWD: <span className={activeCommand.fwd !== 0 ? "text-[#00B4D8]" : ""}>{activeCommand.fwd}</span></span>
          <span>YAW: <span className={activeCommand.yaw !== 0 ? "text-[#00B4D8]" : ""}>{activeCommand.yaw}</span></span>
          <span>VERT: <span className={activeCommand.vert !== 0 ? "text-[#22C55E]" : ""}>{activeCommand.vert}</span></span>
        </span>
      </div>

      {/* Raw Telemetry Debug (Optional) */}
      <div className="px-4 py-2 border-t text-[10px] font-mono flex items-center justify-between" style={{ background: '#000', borderColor: 'var(--t-border)', color: telemetry.connected ? '#4ADE80' : '#6B7280' }}>
        <span>RAW: {telemetry.raw || 'No data'}</span>
        {gamepadConnected && <span>[Gamepad API Active]</span>}
      </div>

    </section>
  )
}

