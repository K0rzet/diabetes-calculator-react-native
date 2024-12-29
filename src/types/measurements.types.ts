export type MeasurementStatus = 'before_meal' | 'after_meal' | 'before_sleep' | 'fasting';

export interface SugarMeasurement {
  id: number;
  sugarLevel: number;
  datetime: string;
  status: MeasurementStatus;
  notes?: string;
  mood?: string;
  insulin?: number;
}

export interface CreateMeasurementDto {
  sugarLevel: number;
  status: MeasurementStatus;
  notes?: string;
  mood?: string;
  insulin?: number;
}

export interface MeasurementStatistics {
  average: number;
  min: number;
  max: number;
  total: number;
  inTargetRange: number;
  byStatus: {
    [key: string]: number[];
  };
} 