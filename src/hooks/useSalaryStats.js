import { useMemo } from "react";

// Hook para calcular el promedio de sueldos y la desviación estándar
const useSalaryStats = (departmentData) => {
  const calculateAverage = (salaries) => {
    const total = salaries.reduce((acc, salary) => acc + salary, 0);
    return salaries.length > 0 ? total / salaries.length : 0;
  };

  const calculateStandardDeviation = (salaries, average) => {
    const variance =
      salaries.reduce((acc, salary) => acc + Math.pow(salary - average, 2), 0) /
      salaries.length;
    return Math.sqrt(variance);
  };

  const salaryStats = useMemo(() => {
    return departmentData.map((department) => {
      const average = calculateAverage(department.salaries);
      const standardDeviation = calculateStandardDeviation(department.salaries, average);

      return {
        name: department.name,
        average,
        standardDeviation,
      };
    });
  }, [departmentData]);

  return salaryStats;
};

export default useSalaryStats;
