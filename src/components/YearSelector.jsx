import { useState, useEffect } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'

const years = [
  { id: '2023', moments: 0 },
  { id: '2022', moments: 0 },
  { id: '2021', moments: 0 },
  { id: '2020', moments: 0 },
  { id: '2019', moments: 0 },
  { id: '2018', moments: 0 },
  { id: '2017', moments: 0 },
  { id: '2016', moments: 0 },
  { id: '2015', moments: 0 },
  { id: '2014', moments: 0 },
  { id: '2013', moments: 0 },
  { id: '2012', moments: 0 },
  { id: '2011', moments: 0 },
  { id: '2010', moments: 0 },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function YearSelector() {
  const [query, setQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState(years[0])

  const filteredPeople =
    query === ''
      ? years
      : years.filter((year) => {
          return year.id.toLowerCase().includes(query.toLowerCase())
        })

        useEffect(()=>{console.log(selectedYear), [selectedYear]})

  return (
    <Combobox as="div" value={selectedYear} onChange={setSelectedYear}>
      {/* <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">Assigned to</Combobox.Label> */}
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-gray-300 py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(year) => year?.id}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredPeople.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPeople.map((year) => (
              <Combobox.Option
                key={year.id}
                value={year}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-sky-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex">
                      <span className={classNames('truncate', selected && 'font-semibold')}>{year.id}</span>
                      <span
                        className={classNames(
                          'ml-2 truncate text-gray-500',
                          active ? 'text-sky-200' : 'text-gray-500'
                        )}
                      >
                        ({year.moments} moments)
                      </span>
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-sky-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}