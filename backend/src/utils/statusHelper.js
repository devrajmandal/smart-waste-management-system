export const getBinStatus = (fillLevel, gasLevel, temperature) => {
  if (gasLevel > 300) return "HAZARDOUS";
  if (temperature > 50) return "ALERT";
  if (fillLevel > 80) return "FULL";
  if (fillLevel > 40) return "MODERATE";
  return "EMPTY";
};