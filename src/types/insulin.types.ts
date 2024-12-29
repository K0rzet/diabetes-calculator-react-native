export interface UserSettings {
  targetSugarLevel: number;
  insulinSensitivityFactor: number;
  carbRatio: number;
}

export interface InsulinCalculation {
  id: number;
  currentSugarLevel: number;
  targetSugarLevel: number;
  carbAmount: number;
  correctionDose: number;
  mealDose: number;
  totalDose: number;
  notes?: string;
  createdAt: string;
}

export interface CalculationInput {
  currentSugarLevel: number;
  carbAmount: number;
  notes?: string;
} 