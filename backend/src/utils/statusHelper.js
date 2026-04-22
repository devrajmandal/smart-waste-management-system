export const getBinStatus = ({ fillLevel }) => {

  if (fillLevel >= 80) return "FULL";
  if (fillLevel >= 40) return "MODERATE";

  return "EMPTY";
};