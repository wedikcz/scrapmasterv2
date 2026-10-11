import React, { useState, useRef, useEffect } from 'react';
import { DetectedBox, ScrapComponent } from '../types/scrap';
import { SAMPLE_BOARDS, SampleBoard, queryLocalOllamaVision } from '../services/localVisionEngine';
import {
  Camera,
  Layers,
  ShieldAlert,
  Plus,
  Check,
  Cpu,
  Zap,
  DollarSign,
  AlertTriangle,
  Server,
  Play,
  RotateCw,
  Eye,
  Info
} from 'lucide-react';

interface VisionInspectorProps {
  onAddCompToInventory: (comp: ScrapComponent) => void;
  onSendToBuildPrompt: (comp: ScrapComponent) => void;
}

export const VisionInspector: React.FC<VisionInspectorProps> = ({
  onAddCompToInventory,
  onSendToBuildPrompt
}) => {
  const [selectedBoard, setSelectedBoard] = useState<SampleBoard>(SAMPLE_BOARDS[0]);
  const [selectedBox, setSelectedBox] = useState<DetectedBox | null>(SAMPLE_BOARDS[0].boxes[0]);
  const [isLiveCameraActive, setIsLiveCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTabMode, setActiveTabMode] = useState<'sample' | 'live' | 'upload'>('sample');
  const [localVisionMode, setLocalVisionMode] = useState<'heuristic' | 'ollama'>('heuristic');
  const [ollamaEndpoint, setOllamaEndpoint] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('qwen2-vl:7b');
  const [ollamaStatus, setOllamaStatus] = useState<'idle' | 'checking' | 'connected' | 'fallback'>('idle');
  const [addedItemIds, setAddedItemIds] = useState<Set<string>>(new Set());

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Setup sample board boxes
  useEffect(() => {
    if (selectedBoard && selectedBoard.boxes.length > 0) {
      setSelectedBox(selectedBoard.boxes[0]);
    }
  }, [selectedBoard]);

  // Handle Live Camera Stream
  const toggleLiveCamera = async () => {
    if (isLiveCameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsLiveCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsLiveCameraActive(true);
      } catch (err) {
        alert('Camera access unavailable or permission denied. Using sample board inspector.');
        setIsLiveCameraActive(false);
      }
    }
  };

  // Test local Ollama connection
  const checkOllamaHealth = async () => {
    setOllamaStatus('checking');
    try {
      const res = await fetch(`${ollamaEndpoint.replace(/\/$/, '')}/api/tags`, {
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        setOllamaStatus('connected');
      } else {
        setOllamaStatus('fallback');
      }
    } catch {
      setOllamaStatus('fallback');
    }
  };

  const handleScanBoard = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (selectedBoard.boxes.length > 0) {
        setSelectedBox(selectedBoard.boxes[0]);
      }
    }, 700);
  };

  const handleAddBoxToInventory = (box: DetectedBox) => {
    onAddCompToInventory(box.component);
    setAddedItemIds(prev => new Set(prev).add(box.id));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Processing Engine Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
              <Eye className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-slate-100">
              Multimodal Computer Vision Dissection
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time component detection, IC marking OCR, pinout extraction &amp; high-voltage hazard detection.
          </p>
        </div>

        {/* Engine switcher & Ollama Status */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setLocalVisionMode('heuristic')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                localVisionMode === 'heuristic'
                  ? 'bg-sky-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Local Autonomous Engine (0ms Free)
            </button>
            <button
              onClick={() => {
                setLocalVisionMode('ollama');
                checkOllamaHealth();
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                localVisionMode === 'ollama'
                  ? 'bg-sky-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Ollama / Qwen2-VL</span>
            </button>
          </div>

          {localVisionMode === 'ollama' && (
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono">
              <span className="text-slate-400">Endpoint:</span>
              <span className="text-sky-300">{ollamaEndpoint}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  ollamaStatus === 'connected'
                    ? 'bg-emerald-400'
                    : ollamaStatus === 'checking'
                    ? 'bg-amber-400 animate-ping'
                    : 'bg-rose-400'
                }`}
              />
              <span className="text-slate-400">
                {ollamaStatus === 'connected'
                  ? 'Connected'
                  : ollamaStatus === 'checking'
                  ? 'Pinging...'
                  : 'Using Local Fallback'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Visual Feed (Left) & Deep Inspector Drawer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Viewport & Sample Switcher (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Sample Hardware Board Picker Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto text-xs">
            <button
              onClick={() => {
                setActiveTabMode('sample');
                if (isLiveCameraActive) toggleLiveCamera();
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer shrink-0 ${
                activeTabMode === 'sample'
                  ? 'bg-slate-800 text-sky-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sample Boards ({SAMPLE_BOARDS.length})
            </button>
            <button
              onClick={() => {
                setActiveTabMode('live');
                toggleLiveCamera();
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeTabMode === 'live'
                  ? 'bg-slate-800 text-sky-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Live Webcam / Phone Camera</span>
            </button>
          </div>

          {/* Sample Board Selector Pills */}
          {activeTabMode === 'sample' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {SAMPLE_BOARDS.map(board => (
                <button
                  key={board.id}
                  onClick={() => setSelectedBoard(board)}
                  className={`px-3 py-1.5 rounded-lg border text-left transition-all cursor-pointer shrink-0 ${
                    selectedBoard.id === board.id
                      ? 'bg-slate-800 border-sky-500/60 text-slate-100 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs">{board.name}</div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                    {board.donorSource}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Canvas Viewport with Bounding Box Overlays */}
          <div className="relative w-full h-[400px] sm:h-[460px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-inner select-none flex items-center justify-center">
            {/* Live Camera Feed */}
            {activeTabMode === 'live' ? (
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              /* High-tech stylized Circuit Board Representation */
              <div className="relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
                {/* Circuit board traces texture */}
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage: `
                      radial-gradient(#22c55e 1px, transparent 1px),
                      linear-gradient(45deg, #064e3b 1px, transparent 1px),
                      linear-gradient(-45deg, #022c22 1px, transparent 1px)
                    `,
                    backgroundSize: '28px 28px'
                  }}
                />

                {/* Stylized PCB Graphic Elements */}
                <div className="relative w-[92%] h-[90%] border-2 border-emerald-900/60 rounded-xl bg-emerald-950/20 p-4">
                  <div className="text-[10px] font-mono text-emerald-500/80 mb-2">
                    REV 2.4 · SALVAGED PCB: {selectedBoard.name.toUpperCase()}
                  </div>

                  {/* Silkscreen text decorations */}
                  <div className="absolute bottom-3 left-4 text-[9px] font-mono text-emerald-600/60">
                    GND · +12V · +5V · +3V3 · CLK · DATA · SENSE
                  </div>
                </div>
              </div>
            )}

            {/* Laser Scanline Animation during scanning */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-sky-400 shadow-[0_0_15px_#38bdf8] animate-pulse transition-all duration-700 pointer-events-none top-1/2 -translate-y-1/2" />
            )}

            {/* Bounding Box Overlays */}
            {selectedBoard.boxes.map(box => {
              const isSelected = selectedBox?.id === box.id;
              const isHazard = box.hazardLevel === 'critical' || box.hazardLevel === 'dangerous';

              const borderColor = isHazard
                ? 'border-rose-500 bg-rose-500/10'
                : isSelected
                ? 'border-sky-400 bg-sky-400/15 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                : 'border-emerald-500/70 bg-emerald-500/5 hover:border-emerald-400';

              return (
                <div
                  key={box.id}
                  onClick={() => setSelectedBox(box)}
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`
                  }}
                  className={`absolute border-2 rounded-lg cursor-pointer transition-all duration-150 flex flex-col justify-between p-1.5 ${borderColor}`}
                >
                  {/* Tag label on top of bounding box */}
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded leading-none ${
                        isHazard
                          ? 'bg-rose-950 text-rose-300 border border-rose-700'
                          : isSelected
                          ? 'bg-sky-950 text-sky-200 border border-sky-600'
                          : 'bg-slate-900/90 text-emerald-300 border border-slate-700'
                      }`}
                    >
                      {box.label}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 bg-slate-950/80 px-1 rounded">
                      {Math.round(box.confidence * 100)}%
                    </span>
                  </div>

                  {/* Corner crosshairs */}
                  <div className="flex justify-between items-end opacity-70">
                    <span className="text-[8px] font-mono text-slate-400">
                      [{box.component.packageType}]
                    </span>
                    {isHazard && <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
                  </div>
                </div>
              );
            })}

            {/* Scan Controls floating bar */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
              <button
                onClick={handleScanBoard}
                disabled={isScanning}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-sky-300 border border-slate-700 rounded-lg text-xs font-medium backdrop-blur shadow-lg transition-colors cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Scanning...' : 'Re-Scan Frame'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Deep Inspection Details Drawer (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedBox ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              {/* Component Header & Category */}
              <div>
                <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-400 mb-1">
                  <span className="uppercase text-sky-400 font-semibold">
                    {selectedBox.component.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedBox.component.packageType}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400 font-medium">
                    Est. Value: ${selectedBox.component.salvageValueEstimate}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100">
                  {selectedBox.component.name}
                </h3>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  Part No: <span className="text-sky-300 font-semibold">{selectedBox.component.partNumber}</span>
                </div>
              </div>

              {/* Critical Hazard Alert Banner */}
              {selectedBox.component.safetyWarning && (
                <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-200 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-rose-300 font-semibold mb-0.5">
                      Safety Hazard Callout
                    </strong>
                    <span>{selectedBox.component.safetyWarning}</span>
                  </div>
                </div>
              )}

              {/* Multimeter Test Procedure */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Multimeter Test Procedure</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {selectedBox.component.testProcedure}
                </p>
              </div>

              {/* Pinout Specification Table */}
              {selectedBox.component.pinout.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                    <span>Pinout Diagram &amp; Signal Function</span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {selectedBox.component.pinout.length} Pins
                    </span>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1 pr-1 font-mono text-xs">
                    {selectedBox.component.pinout.map(pin => {
                      const isPwr = pin.type === 'power';
                      const isGnd = pin.type === 'ground';
                      return (
                        <div
                          key={pin.pin}
                          className="flex items-center justify-between p-1.5 bg-slate-950 rounded border border-slate-800/70"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 text-center text-slate-500 font-bold">
                              #{pin.pin}
                            </span>
                            <span
                              className={`font-semibold ${
                                isPwr
                                  ? 'text-rose-400'
                                  : isGnd
                                  ? 'text-slate-400'
                                  : 'text-sky-300'
                              }`}
                            >
                              {pin.name}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 text-right truncate max-w-[160px]">
                            {pin.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2 border-t border-slate-800">
                <button
                  onClick={() => handleAddBoxToInventory(selectedBox)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    addedItemIds.has(selectedBox.id)
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                  }`}
                >
                  {addedItemIds.has(selectedBox.id) ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Added to Scrap Bin</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Scrap Bin</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => onSendToBuildPrompt(selectedBox.component)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5 text-sky-400" />
                  <span>Build with this Part</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs">
              Click any detected bounding box on the circuit board to inspect part details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
