import { useEffect, useState } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);

  function show(message, type = 'success') {
    setToast({ message, type });
  }

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return { toast, show };
}
