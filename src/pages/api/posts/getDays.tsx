import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/backend/withHandler";
import client from "@/libs/backend/client";
import { withApiSession } from "@/libs/backend/withSession";

const getMonthName = (monthNumber) => {
  const monthNames = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ];

  return monthNames[monthNumber - 1] || '';
};

function getDaysArray(year, month) {
  // For the "isToday" flag, get today's date
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // Assume "isSelected" is for the 21st of the month
  // const selectedDateString = `${year}-${String(month).padStart(2, '0')}-21`;
  
  const daysInMonth = new Date(year, month, 0).getDate();
  const startDayOfWeek = new Date(year, month - 1, 1).getDay();
  const endDayOfWeek = new Date(year, month - 1, daysInMonth).getDay();

  let days = [];

  // Days of the previous month
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
  for(let i = daysInPrevMonth - startDayOfWeek + 1; i <= daysInPrevMonth; i++){
      days.push({ date: `${year}-${String(month - 1).padStart(2, '0')}-${i}`});
  }

  // Days of the current month
  for(let i = 1; i <= daysInMonth; i++){
      let day = { 
          date: `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
          isCurrentMonth: true
      };

      // If the day is today
      // if(day.date === todayString){
      //     day.isToday = true;
      // }

      // If the day is the selected date
      // if(day.date === selectedDateString){
      //     day.isSelected = true;
      // }

      days.push(day);
  }

  // Days of the next month
  let nextMonthDaysToAdd = 6 - endDayOfWeek;
  for(let i = 1; i <= nextMonthDaysToAdd; i++){
      days.push({ date: `${year}-${String(month + 1).padStart(2, '0')}-${i}`});
  }

  return days;
}


async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const { query: { year, month },
    session: { user } } = req;

    if(!year || !month){
      return res.status(403).json({ ok: false, error: "Year and month query parameters are required." })
    }

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });

    // TODO: Check the permissions of the user
    if (false) {
      return res.status(403).json({ ok: false, error: "Not allowed to access the data." })
    }

    const daysArray = getDaysArray(+year, +month);

    // console.log(daysArray)

    const posts = await client.post.findMany({
      where: {
          originalYear: +year,
          originalMonth: +month,
      },
  });

  for (let i = 0; i < daysArray.length; i++) {
    if (!daysArray[i].isCurrentMonth) continue;

      for (let j = 0; j < posts.length; j++) {
          if (posts[j].originalDay === +new Date(daysArray[i].date).getDate()) {
              daysArray[i].hasPost = true;
              break;
          }
      }
  }


    res.json({
      ok: true,
      daysArray,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);