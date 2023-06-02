import { useRouter } from "next/router";

import { useState, useEffect } from 'react'
import { RadioGroup } from '@headlessui/react'

const months = [
  { id: 'JAN', selectable: false },
  { id: 'FEB', selectable: true },
  { id: 'MAR', selectable: true },
  { id: 'APR', selectable: true },
  { id: 'MAY', selectable: true },
  { id: 'JUN', selectable: false },
  { id: 'JUL', selectable: true },
  { id: 'AUG', selectable: true },
  { id: 'SEP', selectable: true },
  { id: 'OCT', selectable: true },
  { id: 'NOV', selectable: true },
  { id: 'DEC', selectable: true },
]

const getMonthName = (monthNumber) => {
  const monthNames = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ];

  return monthNames[monthNumber - 1] || '';
};

const defaultMonth = { id: 'default', selectable: false };


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function MonthSelector({months}) {
  // console.log(months)
  const router = useRouter();
  const { year, month } = router.query;
  // const [selectedMonth, setSelectedMonth] = useState(
  //   month ? months.find((item) => item.id === getMonthName(month)) : "default"
  // );
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);


  // useEffect(() => {
  //   if(months){
  //     console.log(months[0])
  //     setSelectedMonth(months[0]);
  //   }
  // },[months]);

  useEffect(() => {
    if(months && months.length > 0){
      setSelectedMonth(months[month-1]);
    }
  },[months]);


  // useEffect(() => {
  //   // console.log(selectedMonth)
  //   if (selectedMonth && selectedMonth.id)
  //   {
  //     const monthInNumber = months.findIndex((item) => item.id === selectedMonth.id) + 1;
  //     router.replace(`/posts/${year}/${monthInNumber}`);
  //   }
  // }
  //   , [selectedMonth])

    useEffect(() => {
      if (selectedMonth && selectedMonth.id && selectedMonth.id !== 'default')
      {
        const monthInNumber = months.findIndex((item) => item.id === selectedMonth.id) + 1;
        router.replace(`/posts/${year}/${monthInNumber}`);
      }
    }
      , [selectedMonth])

    

    // useEffect(()=>{
    //   console.log(year,month);
    //   setSelectedMonth( month ? months.find((item) => item.id === getMonthName(month)) : "default");
    // },[year, month])
    
    // useEffect(() => {
    //   // console.log(year,month);
    //   console.log(months[0])
    //   setSelectedMonth(month ? months.find((item) => item.id === getMonthName(month)) : months[0]);
    // }, [year]);

    return (
      <div className="my-8">
        <RadioGroup value={selectedMonth} onChange={setSelectedMonth} className="mt-2">
          <RadioGroup.Label className="sr-only">Choose an option</RadioGroup.Label>
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-6">
            {/* Invisible default option */}
            <RadioGroup.Option key={"default"} value={defaultMonth} className="hidden">
            <RadioGroup.Label as="span"></RadioGroup.Label>
          </RadioGroup.Option>

  
            {months?.map((option) => (
              <RadioGroup.Option
                key={option.id}
                value={option}
                className={({ active, checked }) =>
                  classNames(
                    option.selectable ? 'cursor-pointer focus:outline-none' : 'cursor-not-allowed opacity-25',
                    active ? 'ring-2 ring-sky-600 ring-offset-2' : '',
                    checked
                      ? 'bg-sky-600 text-white hover:bg-sky-500'
                      : 'ring-1 ring-inset ring-gray-300 bg-gray-300 text-gray-900 hover:bg-gray-50',
                    'flex items-center justify-center rounded-md py-2 px-3 text-sm font-semibold uppercase sm:flex-1'
                  )
                }
                disabled={!option.selectable}
              >
                <RadioGroup.Label as="span">{option.id}</RadioGroup.Label>
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    );
  }