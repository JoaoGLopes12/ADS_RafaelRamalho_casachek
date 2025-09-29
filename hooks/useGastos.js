import { useCallback, useState } from "react";

const API_URL = "http://localhost:5001/api";

export const useGastos = (userId) => {
  const [gastos, setGastos] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  // useCallback is used for per...
  const fetchGastos = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/gastos/${userId}`);
      const data = await response.json();
      setGastos(data);
    } catch (error) {
      console.error("Error fetching gastos:", error);
    }
  }, [userId]);
};
