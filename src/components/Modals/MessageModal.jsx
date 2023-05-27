import { Dialog } from "@headlessui/react";

import { CheckCircleIcon, ExclamationCircleIcon, } from '@heroicons/react/24/outline';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function MessageModal({props}) {
  const {popup, isModalOpen, setIsModalOpen} = {...props};

  return (
    <Dialog
      as="div"
      className="fixed z-10 inset-0 overflow-y-auto"
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      <div className="flex items-end justify-center min-h-screen pt-32 px-4 pb-20 text-center sm:block">
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
          <div className={classNames("mx-auto flex items-center justify-center h-12 w-12 rounded-full", popup.iconBackground)}>

            <popup.icon
              className={classNames("h-6 w-6", popup.iconForeground)}
              aria-hidden="true"
            />
          </div>

          <div className="mt-3 text-center sm:mt-5">
            <Dialog.Title
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900"
            >
              {popup.title}
            </Dialog.Title>
          </div>
          <Dialog.Description className="mt-4">
            {popup.detail}
          </Dialog.Description>

          <div className="mt-5 flex flex-col items-center">

            
              
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2980b9]   sm:text-sm"
                onClick={(e) => setIsModalOpen(false)}
              >
                Close
              </button>
            

          </div>



        </div>
      </div>
    </Dialog>

  );
}