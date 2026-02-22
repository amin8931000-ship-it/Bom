
export enum EnhancementModel {
  LOW_RES_V2 = "Low Resolution V2",
  FIDELITY_ULTRA = "Fidelity Ultra",
  NATURAL_PRO = "Natural Pro"
}

export interface EnhancementParams {
  model: EnhancementModel;
  creativity: number;
  faceEnhancement: boolean;
  subjectDetection: "Foreground" | "Full Image";
  upscaleFactor: "2x" | "4x";
}

export interface EnhancementResult {
  originalUrl: string;
  enhancedUrl: string;
  timestamp: number;
}
