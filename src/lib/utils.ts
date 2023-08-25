// Create an array of month names
const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type Month = {
  name: string;
  firstDay: number;
  days: {
    number: number;
    weekDay: string;
  }[];
};

// Generate the calendar for the entire year
export function generateCalendar(year: number) {
  const Months = [];

  for (let month = 0; month < 12; month++) {
    const firstDay = new Date(year, month, 1); // first day of the month
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // number of days in the month
    const startIndex = firstDay.getDay(); // Calculate the index of the first day

    // Create the month object and set the first day of the month
    const monthObj: Month = {
      name: monthNames[month],
      firstDay: startIndex,
      days: [],
    };

    // Add the days to the month object
    for (let day = 1; day <= daysInMonth; day++) {
      const weekDay = weekDays[(startIndex + day - 1) % 7];
      monthObj.days.push({ number: day, weekDay });
    }

    // Push the month object to the month array
    Months.push(monthObj);
  }
  // Return the month array
  return Months;
}
