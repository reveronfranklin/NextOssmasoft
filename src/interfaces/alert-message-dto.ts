export interface IAlertMessageDto {
  text:string;
  isValid: boolean;
  severity?: 'success' | 'warning' | 'error' | 'info';
  timestamp: number;
}