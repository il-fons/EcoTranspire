export interface WeatherData {
  temperature: number; // Celsius
  humidity: number; // Percentage
  windSpeed: number; // km/h
  solarRadiation: number; // W/m2 (Simplified representation)
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum SimulationState {
  IDLE,
  RUNNING,
  PAUSED
}
