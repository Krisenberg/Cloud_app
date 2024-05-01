import { useEffect } from 'react';

const PreventUnload = () => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Cancel the event
      event.preventDefault();
      // Chrome requires returnValue to be set
      event.returnValue = '';
      // Display a confirmation dialog
      const confirmationMessage = 'Are you sure you want to leave? Your connection will be closed.';
      event.returnValue = confirmationMessage; // For Chrome
      return confirmationMessage; // For other browsers
    };

    // Add event listener for beforeunload event
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup: Remove event listener when component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PreventUnload;