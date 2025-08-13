import { useEffect, useState } from 'react';

interface sampleData {
  id: string;
  title: string;
  description: string;
}

function useSampleDataHook() {
  const [data, setData] = useState<sampleData[] | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const generatedData = Array.from({ length: 1000 }, (_, index) => ({
        id: (index + 1).toString(),
        title: `Card ${index + 1}`,
        description: `This is card number ${index + 1}.`,
      }));
      setData(generatedData);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return data;
}

export default useSampleDataHook;
