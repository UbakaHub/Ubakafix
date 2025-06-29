import { createContext } from 'react';

export type AlertType = 'success' | 'error' | 'info';

export interface AlertContextType {
  message: string;
  type: AlertType;
  showAlert: (msg: string, type?: AlertType) => void;
  clearAlert: () => void;
}

export const AlertContext = createContext<AlertContextType | undefined>(undefined);
