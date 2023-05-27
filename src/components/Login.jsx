
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  ArchiveBoxIcon,
} from '@heroicons/react/24/solid'

import {
  LockClosedIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'

import useMutation from "@/libs/frontend/useMutation"
import { useRouter } from "next/router";

import MessageModal from "@/components/Modals/MessageModal";

const popups = [
  {
    id: 0,
    icon: ExclamationCircleIcon,
    title: 'ERROR',
    detail: `Server is not responding correctly.\n This may due to the incorrect user account, or too many login attempts. Ask the administrator if the problem continues.`,
    href: '#',
    iconForeground: 'text-red-700',
    iconBackground: 'bg-red-50',
  },
  {
    id: 1,
    icon: ExclamationCircleIcon,
    title: 'ERROR',
    detail: `Server is not responding correctly.\n This may due to the incorrect OTP. Ask the administrator if the problem continues.`,
    href: '#',
    iconForeground: 'text-red-700',
    iconBackground: 'bg-red-50',
  },
];

export function Login() {
  const { register, handleSubmit, setError } = useForm();
  const [enter, { loading, data, error }] = useMutation("/api/users/enter");

  const { register: tokenRegister, handleSubmit: tokenHandleSubmit, setError: tokenSetError } = useForm();
  const [tokenConfirm, { loading: tokenLoading, data: tokenData, error: tokenError }] = useMutation("/api/users/confirm");

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isOtpErrorModalOpen, setIsOtpErrorModalOpen] = useState(false)

  const onEmailFormValid = (validForm) => {
    console.log("Valid form given. Generating Token, fetching user data from DB and sending Email.");

    if (loading) return;
    enter(validForm);
  }
  const onEmailFormInvalid = () => {
    console.log("Do something when the form is invalid.");
  }

  const onTokenFormValid = (validForm) => {
    if (tokenLoading) return;
    tokenConfirm(validForm);
  }
  const onTokenFormInvalid = (validForm) => {

  }

  const router = useRouter();
  useEffect(() => {
    if (tokenData?.ok) {
      router.replace("/");
    }
  }, [tokenData, router]);

  useEffect(() => {
    if (error || data?.error) {
      console.log(error, data?.error);
      setIsModalOpen(true);
    }
  }, [data, error])

  useEffect(() => {
    if (tokenError || tokenData?.error) {
      console.log(tokenError, tokenData?.error);
      setIsOtpErrorModalOpen(true);
    }
  }, [tokenData, tokenError])


  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
          /> */}
        <  ArchiveBoxIcon className="mx-auto h-10 w-auto mb-8 text-sky-500" />



        <h1 className="font-display text-4xl/tight font-light text-white">
          Tales of Remembrance: {' '}<br />
          <span className="text-sky-300">A Visual Legacy</span>
        </h1>


        <p className="mt-12 text-sm/6 text-gray-300">
          This is a private space. Please sign in to continue...
        </p>

        {/* <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Sign in to continue
        </h2> */}
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">


        {data?.ok ?
          <form onSubmit={tokenHandleSubmit(onTokenFormValid, onTokenFormInvalid)} className="space-y-6" action="#" method="POST">
            <input type="hidden" name="token" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="token" className="sr-only">
                  One-time password
                </label>
                <input
                  {...tokenRegister("token", {
                    required: "Token is required.",
                    maxLength: {
                      message: "The Token must be less than 10 chars.",
                      value: 10,
                    },
                  })}
                  id="token"
                  name="token"
                  type="number"
                  autoComplete="token"
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 bg-white/5 text-white placeholder-gray-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                  placeholder="One-time Password"
                />
              </div>
            </div>


            <p className="text-center text-sm text-gray-200">
              {/* <a href={data.link.toString()} target="_blank" className="font-medium text-sky-600 hover:text-sky-500">
                  &rarr;{' '}Check this Link{' '}&larr;
                  </a> */}
              {/* {' '}to see your access token. */}
              Check your Email for the one-time password.
            </p>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                disabled={tokenLoading}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-sky-500 group-hover:text-sky-400" aria-hidden="true" />
                </span>
                {tokenLoading ? <span>Signing in...</span> : <span>Sign in</span>}
                {tokenLoading ? <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>

                </span> : <></>}

              </button>

            </div>


          </form>
          :

          <form onSubmit={handleSubmit(onEmailFormValid, onEmailFormInvalid)} className="space-y-6" action="#" method="POST">
            <input type="hidden" name="email" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  {...register("email", {
                    required: "Email is required.",
                    maxLength: {
                      message: "The Email must be less than 255 chars.",
                      value: 255,
                    },
                  })}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-md border-0 px-3 py-2 bg-white/5 ring-1 ring-inset ring-white/10 text-white placeholder-gray-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              {/* <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                    placeholder="Password"
                  />
                </div> */}
            </div>

            {/* <div className="flex items-center justify-center">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-sky-600 hover:text-sky-500">
                      Any problems signing in?
                    </a>
                  </div>
                </div> */}

            {data?.error.code == "429" ?
              <p className="text-center text-sm text-red-600">
                Too many login attempts. {data?.error?.message}
              </p> :
              <></>
            }


            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                disabled={loading}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-sky-500 group-hover:text-sky-400" aria-hidden="true" />
                </span>
                {loading ? <span>Sending Email to your account...</span> : <span>Get Access Token</span>}

                {loading ? <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>

                </span> : <></>}


              </button>

            </div>


          </form>

        }











        <p className="mt-10 text-center text-sm text-gray-400">
          Not a member?{' '}
          <a href="#" className="font-semibold leading-6 text-sky-400 hover:text-sky-300">
            Ask your admin for an invite
          </a>
        </p>
      </div>
    </div>
  );
}