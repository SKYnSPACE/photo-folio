import Link from 'next/link'

import { useEffect, useState } from 'react'

import {
  ArrowRightOnRectangleIcon,
  DocumentPlusIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/solid'


export function ActionIcons() {

  return (
    <div className="absolute right-4 top-4 z-50 -m-2.5 p-2.5 flex flex-row items-center justify-center space-x-2 ">
      <Link href="/create" className="group" passHref>

        <button
          type="button"

        >
          <DocumentPlusIcon className="h-6 w-6 fill-white opacity-50 transition-opacity group-hover:opacity-100 lg:fill-gray-900 lg:dark:fill-white" />
        </button>
      </Link>
      <Link href="/signout" className="group" passHref>
        <button
          type="button"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6 fill-white opacity-50 transition-opacity group-hover:opacity-100 lg:fill-gray-900 lg:dark:fill-white" />
        </button>
      </Link>
    </div>
  )
}
