export const getDisplayDate = (date: string): string => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", options);
}

export const convertPercentageToColour = (percentage: number) => {
  const hue = ((percentage) * 120).toString(10);
  return `hsl(${hue},100%,50%)`;
}