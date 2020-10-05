export const getDisplayDate = (date: string): string => {
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  var dateObj  = new Date(date);
  return dateObj.toLocaleDateString("en-US", options);
}
