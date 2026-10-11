export type ComponentCategory =
  | 'ic'
  | 'motor'
  | 'power'
  | 'passive'
  | 'display'
  | 'sensor'
  | 'switch'
  | 'hazard';

export type ComponentCondition = 'working' | 'untested' | 'damaged' | 'salvaged';

export interface PinDefinition {
  pin: number;
  name: string;
  type: 'power' | 'ground' | 'input' | 'output' | 'io' | 'analog' | 'passive';
  desc: string;
}

export interface ScrapComponent {
  id: string;
  name: string;
  partNumber: string;
  category: ComponentCategory;
  packageType: string; // e.g. DIP-8, TO-220, SOIC-16, SOT-23, Cylindrical 18650
  extractedFrom: string; // e.g. "Dead DVD-RW Optical Drive", "PC ATX Power Supply"
  condition: ComponentCondition;
  quantity: number;
  pinCount: number;
  pinout: PinDefinition[];
  specs: Record<string, string>;
  testProcedure: string;
  salvageValueEstimate: number; // in USD
  safetyWarning?: string;
  hazardLevel?: 'safe' | 'caution' | 'dangerous' | 'critical';
  dateAdded: string;
  notes?: string;
}

export interface ExternalComponent {
  id: string;
  partNumber: string;
  name: string;
  category: ComponentCategory;
  packageType: string;
  description: string;
  keySpecs: Record<string, string>;
  pinCount: number;
  pinout: PinDefinition[];
  commonSources: string;
  equivalents: string[];
  datasheetUrl?: string;
  salvageTips?: string;
  typicalSalvagePrice: number;
}

export type SearchResultType = 'inventory' | 'recipe' | 'external_db';

export interface GlobalSearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  category: string;
  badge?: string;
  badgeColor?: string;
  data: ScrapComponent | any | ExternalComponent;
  matchedFields: string[];
}

export interface DetectedBox {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  label: string;
  category: ComponentCategory;
  confidence: number;
  component: ScrapComponent;
  hazardLevel?: 'safe' | 'caution' | 'dangerous' | 'critical';
  hazardNotice?: string;
}

export interface SchematicPin {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'in' | 'out' | 'pwr' | 'gnd' | 'io';
}

export interface SchematicNode {
  id: string;
  label: string;
  subLabel?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'ic' | 'motor' | 'power' | 'passive' | 'switch' | 'mcu' | 'sensor';
  pins: SchematicPin[];
  package?: string;
}

export interface SchematicWire {
  id: string;
  fromNode: string;
  fromPin: string;
  toNode: string;
  toPin: string;
  color?: string;
  signalName?: string;
  voltage?: string;
}

export interface PinMappingItem {
  label: string;
  defaultPin: string;
  currentPin: string;
  type: string;
  description: string;
}

export interface AssemblyStep {
  step: number;
  title: string;
  instruction: string;
  caution?: string;
  testingTip?: string;
}

export interface ProjectRecipe {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'robotics' | 'power' | 'automation' | 'audio' | 'measurement';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedBuildTime: string;
  salvageSavingsEstimate: number;
  requiredParts: {
    partNumber: string;
    componentName: string;
    category: ComponentCategory;
    quantity: number;
    alternatives: string[];
    inInventory?: boolean;
  }[];
  schematicNodes: SchematicNode[];
  schematicWires: SchematicWire[];
  codeTemplates: {
    arduino: string;
    esp32: string;
    micropython: string;
  };
  pinMappings: PinMappingItem[];
  assemblySteps: AssemblyStep[];
  safetyChecklist: string[];
  firmwareNotes?: string;
}

export interface TeardownFrame {
  id: string;
  timestamp: string;
  title: string;
  action: string;
  toolRequired: string;
  extractedPart: string;
  caution?: string;
  safetyCaution?: string;
  salvageTips: string;
}

export interface InverseTeardown {
  id: string;
  title: string;
  donorDevice: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  dangerLevel: 'low' | 'medium' | 'high';
  keyYield: string[];
  frames: TeardownFrame[];
  revivalProjects: string[];
  safetyWarnings: string[];
}

export interface MotionVector {
  x: number;
  y: number;
  vx: number;
  vy: number;
  magnitude: number;
  angle: number;
  confidence: number;
}

export interface FrameMotionAnalysis {
  frameIndex: number;
  timestamp: string;
  averageVelocity: number;
  peakVelocity: number;
  vectorField: MotionVector[];
  detectedMotionType: string;
  stictionDetected: boolean;
  wearLevel: 'none' | 'minor' | 'moderate' | 'critical';
}

export type KinematicMechanismType =
  | 'lead_screw_actuator'
  | 'gear_train_reduction'
  | 'rack_and_pinion'
  | 'crank_slider_linkage'
  | 'cam_and_follower'
  | 'centrifugal_pump'
  | 'solenoid_escapement';

export interface RepairStep {
  step: number;
  title: string;
  action: string;
  toolRequired: string;
  lubricantOrConsumable?: string;
  cautionNotice?: string;
}

export interface RepurposingIdea {
  title: string;
  description: string;
  difficulty: 'easy' | 'moderate' | 'advanced';
  estimatedUtilityValue: number; // in USD
  targetElectronics: string[];
  firmwareType: 'stepper_driver' | 'pwm_speed_control' | 'h_bridge' | 'relay_pulse';
}

export interface MechanismInference {
  type: KinematicMechanismType;
  name: string;
  confidence: number;
  mechanicalAdvantage: string;
  estimatedRPM: string;
  estimatedTorque: string;
  operatingPrinciples: string[];
  backlashAndWearAnalysis: string;
  repairProtocol: RepairStep[];
  repurposingOpportunities: RepurposingIdea[];
  safetyProtocols: string[];
}

export interface VideoEngineeringAnalysis {
  id: string;
  videoTitle: string;
  donorCategory: string;
  durationSeconds: number;
  totalFramesAnalyzed: number;
  fps: number;
  motionTimeline: {
    time: number;
    velocity: number;
    acceleration: number;
    stiction: boolean;
  }[];
  keyFrames: FrameMotionAnalysis[];
  inference: MechanismInference;
  ioContract: {
    inputSchema: Record<string, any>;
    outputSchema: Record<string, any>;
  };
  createdAt: string;
}

export type AgentRole =
  | '@Architect-MoE'
  | '@Vision-Inspector'
  | '@Augmented-Coder'
  | '@Scanner-Diagnostics'
  | '@Self-Healing-Engine';

export interface AgentLog {
  id: string;
  agent: AgentRole;
  message: string;
  timestamp: string;
  status: 'info' | 'success' | 'warning' | 'healed' | 'critical';
  details?: string;
}

export interface LocalAISettings {
  ollamaEndpoint: string;
  selectedModel: string;
  visionEngineMode: 'heuristic-local' | 'ollama-qwen' | 'custom-termux';
  autoHealEnabled: boolean;
  highVoltageAlerts: boolean;
  soundEffects: boolean;
}
