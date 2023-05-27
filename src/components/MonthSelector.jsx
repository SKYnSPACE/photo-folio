import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'

const months = [
  { month: 'JAN', selectable: false },
  { month: 'FEB', selectable: true },
  { month: 'MAR', selectable: true },
  { month: 'APR', selectable: true },
  { month: 'MAY', selectable: true },
  { month: 'JUN', selectable: false },
  { month: 'JUL', selectable: true },
  { month: 'AUG', selectable: true },
  { month: 'SEP', selectable: true },
  { month: 'OCT', selectable: true },
  { month: 'NOV', selectable: true },
  { month: 'DEC', selectable: true },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function MonthSelector() {
  const [month, setMonth] = useState(months[0]);

  return (
    <div className='my-8'>
      {/* <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium leading-6 text-gray-900">RAM</h2>
      </div> */}

      <RadioGroup value={month} onChange={setMonth} className="mt-2">
        <RadioGroup.Label className="sr-only">Choose a option</RadioGroup.Label>
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-6">
          {months.map((option) => (
            <RadioGroup.Option
              key={option.month}
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
              <RadioGroup.Label as="span">{option.month}</RadioGroup.Label>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}