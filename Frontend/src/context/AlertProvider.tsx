import { useState, ReactNode } from 'react';
import { AlertContext, AlertType } from './AlertContext.tsx';

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<AlertType>('info');

  const showAlert = (msg: string, alertType: AlertType = 'info') => {
    setMessage(msg);
    setType(alertType);
  };

  const clearAlert = () => {
    setMessage('');
    setType('info');
  };

  return (
    <AlertContext.Provider value={{ message, type, showAlert, clearAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
export default AlertProvider;