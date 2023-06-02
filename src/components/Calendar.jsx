import { useRouter } from "next/router";

import { Fragment } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'

const __days = [
  { date: '2021-12-27' },
  { date: '2021-12-28' },
  { date: '2021-12-29' },
  { date: '2021-12-30' },
  { date: '2021-12-31' },
  { date: '2022-01-01', isCurrentMonth: true },
  { date: '2022-01-02', isCurrentMonth: true },
  { date: '2022-01-03', isCurrentMonth: true },
  { date: '2022-01-04', isCurrentMonth: true },
  { date: '2022-01-05', isCurrentMonth: true },
  { date: '2022-01-06', isCurrentMonth: true },
  { date: '2022-01-07', isCurrentMonth: true },
  { date: '2022-01-08', isCurrentMonth: true },
  { date: '2022-01-09', isCurrentMonth: true },
  { date: '2022-01-10', isCurrentMonth: true },
  { date: '2022-01-11', isCurrentMonth: true },
  { date: '2022-01-12', isCurrentMonth: true, hasPost: true },
  { date: '2022-01-13', isCurrentMonth: true },
  { date: '2022-01-14', isCurrentMonth: true },
  { date: '2022-01-15', isCurrentMonth: true },
  { date: '2022-01-16', isCurrentMonth: true },
  { date: '2022-01-17', isCurrentMonth: true },
  { date: '2022-01-18', isCurrentMonth: true },
  { date: '2022-01-19', isCurrentMonth: true },
  { date: '2022-01-20', isCurrentMonth: true },
  { date: '2022-01-21', isCurrentMonth: true, isSelected: true },
  { date: '2022-01-22', isCurrentMonth: true },
  { date: '2022-01-23', isCurrentMonth: true },
  { date: '2022-01-24', isCurrentMonth: true },
  { date: '2022-01-25', isCurrentMonth: true },
  { date: '2022-01-26', isCurrentMonth: true },
  { date: '2022-01-27', isCurrentMonth: true },
  { date: '2022-01-28', isCurrentMonth: true },
  { date: '2022-01-29', isCurrentMonth: true },
  { date: '2022-01-30', isCurrentMonth: true },
  { date: '2022-01-31', isCurrentMonth: true },
  { date: '2022-02-01' },
  { date: '2022-02-02' },
  { date: '2022-02-03' },
  { date: '2022-02-04' },
  { date: '2022-02-05' },
  { date: '2022-02-06' },
]


function getDaysArray(year, month) {
  // For the "hasPost" flag, get today's date
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
  for (let i = daysInPrevMonth - startDayOfWeek + 1; i <= daysInPrevMonth; i++) {
    days.push({ date: `${year}-${String(month - 1).padStart(2, '0')}-${i}` });
  }

  // Days of the current month
  for (let i = 1; i <= daysInMonth; i++) {
    let day = {
      date: `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      isCurrentMonth: true
    };

    // If the day is today
    if (day.date === todayString) {
      day.isToday = true;
    }

    // If the day is the selected date
    // if (day.date === selectedDateString) {
    //   day.isSelected = true;
    // }

    days.push(day);
  }

  // Days of the next month
  let nextMonthDaysToAdd = 6 - endDayOfWeek;
  for (let i = 1; i <= nextMonthDaysToAdd; i++) {
    days.push({ date: `${year}-${String(month + 1).padStart(2, '0')}-${i}` });
  }

  return days;
}

// const days = getDaysArray(2023, 6);

const getMonthName = (monthNumber) => {
  const monthNames = [
    'January', 'Febuary', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return monthNames[monthNumber - 1] || '';
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function Calendar({days}) {
  const router = useRouter();
  const { year, month } = router.query;

  return (
    <div>
      <div className="flex items-center">
        <h2 className="flex-auto text-sm font-semibold text-gray-200">{getMonthName(month)} {year}</h2>
        {/* <button
          type="button"
          className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-200"
        >
          <span className="sr-only">Previous month</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-500 hover:text-gray-200"
        >
          <span className="sr-only">Next month</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button> */}
      </div>
      <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-gray-500 font-bold">
        <div className="text-rose-800">S</div>
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
      </div>
      <div className="mt-2 grid grid-cols-7 text-sm">
        {days?.map((day, dayIdx) => (
          <div key={day.date} className={classNames(dayIdx > 6 && 'border-t border-gray-600', 'py-2')}>
            <button
              type="button"
              className={classNames(
                day.isSelected && 'text-white',
                !day.isSelected && day.hasPost && 'text-sky-400',
                !day.isSelected && !day.hasPost && day.isCurrentMonth && 'text-white',
                !day.isSelected && !day.hasPost && !day.isCurrentMonth && 'text-gray-500',
                day.isSelected && day.hasPost && 'bg-sky-400',
                day.isSelected && !day.hasPost && 'bg-gray-700',
                !day.isSelected && 'hover:bg-gray-200 hover:text-gray-800',
                (day.isSelected || day.hasPost) && 'font-semibold',
                'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
              )}
            >
              <time dateTime={day.date}>{day.date.split('-').pop().replace(/^0/, '')}</time>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}