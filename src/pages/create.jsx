import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react'

import axios from "axios";
import useSWR from "swr";
import { useForm } from 'react-hook-form';

import { format, parseISO } from "date-fns";


import { PaperClipIcon, ExclamationTriangleIcon, StarIcon } from '@heroicons/react/20/solid';
import { CalendarDaysIcon, ClockIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline';


import useMutation from "@/libs/frontend/useMutation";

import ProgressBarSimple from '@/components/ProgressBarSimple';
import Notification from '@/components/Notification';
import LoadingSpinner from '@/components/LoadingSpinner';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
  })
}


export default function Create() {
  const { data: seminarData, error: seminarDataError, isLoading: seminarDataIsLoading, mutate: mutateSeminarData } = useSWR(`/api/seminar`);

  const { register, setValue, watch, handleSubmit } = useForm();
  const titleLength = watch("title")?.length;
  const descriptionsLength = watch("descriptions")?.length;

  const timeStampDate = watch("date");
  const timeStampTime = watch("time");

  const [createPost, { loading: createPostLoading, data: createPostData, error: createPostError }] = useMutation("/api/create");

  const [progress, setProgress] = useState(0);
  const [remaining, setRemaining] = useState(0);

  const [uploadedImagesToken, setUploadedImagesToken] = useState(null);
  const [uploadedFileIndex, setUploadedFileIndex] = useState(0);

  const [saved, setSaved] = useState(false);


  const [isNotify, setIsNotify] = useState(false);
  const [message, setMessage] = useState({ type: 'success', title: 'Confirmed!', details: 'Test message initiated.', });

  const onValid = (validForm) => {
    createPost({
      ...validForm,
      imageToken: uploadedImagesToken,
      fileIndex: uploadedFileIndex,
    });
    scrollToTop();
  }

  const onInvalid = (errors) => {
    console.log(errors);
  }

  const handleDeleteDraftFile = async (e) => {
    if (uploadedImagesToken) {
      const deleteResponse = await fetch(`/api/delete?token=${uploadedImagesToken}`, {
        method: 'DELETE'
      })
      console.log(deleteResponse)
    }
  };

  const onSelectedImageFiles = async (e) => {
    setProgress(0); setRemaining(0);

    const fileInput = e.target;
    if (!fileInput.files || fileInput.files.length === 0) return;

    e.preventDefault();

    /** Files validation */
    const validFiles = [];
    for (let i = 0; i < fileInput.files.length; ++i) {
      const file = fileInput.files[i];

      if (!file.type.startsWith("image")) {
        alert(`File idx: ${i+1} is invalid. Must be a common image file.`);
        continue;
      }

      validFiles.push(file);
    }

    if (!validFiles.length) {
      alert("No valid files were chosen");
      return;
    }


    // TODO: REMOVE file from the server when uploadedImagesToken is not null 
    if (uploadedImagesToken) {
      const deleteResponse = await fetch(`/api/delete?token=${uploadedImagesToken}`, {
        method: 'DELETE'
      })
      console.log(deleteResponse)
    }

    /** Uploading files to the server */
    try {
      let startAt = Date.now();
      let formData = new FormData();
      validFiles.forEach((file) => formData.append("media", file));
      // formData.append("media", file);

      const options = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;

          // Calculate the progress percentage
          const percentage = (loaded * 100) / total;
          setProgress(+percentage.toFixed(2));

          // Calculate the progress duration
          const timeElapsed = Date.now() - startAt;
          const uploadSpeed = loaded / timeElapsed;
          const duration = (total - loaded) / uploadSpeed;
          setRemaining(duration);
        },
      };

      const {
        data: { data },
      } = await axios.post("/api/upload", formData, options);

      console.log("File was uploaded successfylly:", data);
      setUploadedImagesToken(data?.token);
      setUploadedFileIndex(data?.fileIndex);
      // saveDraft({ alias: seminarData?.mySeminarSubmission?.alias, token });

    } catch (e) {
      console.error(e);
      const error =
        e.response && e.response.data
          ? e.response.data.error
          : "Sorry! something went wrong.";
      alert(error);
    }
  };


  useEffect(() => {
    const handleTabClose = event => {
      event.preventDefault();
  
      console.log('beforeunload event triggered');
  
      return (event.returnValue =
        'Are you sure you want to exit?');
    };
  
    window.addEventListener('beforeunload', handleTabClose);
  
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, []);

  // useEffect(() => {
  //   return () => {
  //     if (!saved) handleDeleteDraftFile();
  //   };
  // }, []);

  // useEffect(() => {
  //   return () => {
  //     if (!saved)
  //     {
  //       console.log('About to close without saving: ', uploadedImagesToken);
  //     }
  //   };
  // }, [saved, uploadedImagesToken]);


  useEffect(() => {
    if (seminarData?.mySeminarSubmission) {

      setValue("title", seminarData.mySeminarSubmission.title);
      setValue("descriptions", seminarData.mySeminarSubmission.descriptions);
      setValue("category", seminarData.mySeminarSubmission.category);
      setValue("tags", seminarData.mySeminarSubmission.tags);

    }
  }, [seminarData]);


  useEffect(() => {
    setTimeout(() => {
      mutateSeminarData();
    }, 3000);
  }, [createPostLoading]);

  useEffect(() => {
    // if (createPostData?.ok) {
    //   setMessage(
    //     { type: 'success', title: 'Successfully Sent!', details: 'Wait for the page reload.', }
    //   )
    //   setIsNotify(true);
    // } BUG HERE due to fileupload conflict. DO NOT USE! (setIsNotify will trigger page reload. and this will reset all form inputs)

    if (createPostData?.error) {
      switch (createPostData?.error) {
        case '503':
          setMessage(
            { type: 'fail', title: 'Occupied.', details: "Try another presentation time", }
          )
          setIsNotify(true);
          return;
        case 'P1017':
          setMessage(
            { type: 'fail', title: 'Connection Lost.', details: "Database Server does not respond.", }
          )
          setIsNotify(true);
          return;
        case 'P2002':
          setMessage(
            { type: 'fail', title: 'Creating user failed!', details: "User already exists. Or you may typed someone else's Email and phone number.", }
          )
          setIsNotify(true);
          return;
        default:
          setMessage(
            { type: 'fail', title: `${createPostData?.error}`, details: "", }
          )
          setIsNotify(true);
      }

    }
  }, [createPostData]);


  useEffect(() => {
    ///@todo: redirect to home. 
    if (saved) return;
  }, [saved]);

  return (


    <div className="py-16 px-4 lg:px-10 mx-auto max-w-7xl">

      <form onSubmit={handleSubmit(onValid, onInvalid)} className="bg-gray-900 p-4 shadow-sm ring-1 ring-gray-500 rounded-xl space-y-8 divide-y-2 divide-gray-300">

        <div className="space-y-8 divide-y-2 divide-gray-300 sm:space-y-5">



          <div className="space-y-6 sm:space-y-5">

            <div className="mt-6">
              <h3 className="text-2xl font-semibold leading-6 text-sky-500">Write</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                This information will be displayed publicly so be careful what you share.
              </p>
            </div>

            <div className="space-y-6 sm:space-y-5">

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-400 sm:pt-5">
                <label htmlFor="title" className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                  Title {titleLength > 180 ? <span className="text-red-500">({titleLength}/180)</span> : <span>({titleLength}/180)</span>}
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    {...register("title", {
                      required: "Title is required.",
                      maxLength: {
                        message: "Maximum length of the title is 180.",
                        value: 180
                      }
                    })
                    }
                    id="title"
                    name="title"
                    type="text"
                    required
                    className={classNames(titleLength > 180 ? " text-red-500 focus:ring-2 focus:ring-inset focus:ring-red-500" : "text-white focus:ring-2 focus:ring-inset focus:ring-sky-500",
                      "block w-full min-w-0 px-2 py-1.5 flex-1 rounded-md border-0 ring-1 ring-inset ring-white/30 bg-white/10 sm:text-sm")}
                    defaultValue={''}
                  />
                </div>
              </div>


              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-400 sm:pt-5">
                <label htmlFor="title" className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                  Time Stamp
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="w-full">
                    <div className="flex items-center justify-between space-x-4">

                      <div className="relative w-1/2 flex rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-white text-sm">DATE /</span>
                        </div>
                        <input
                          {...register("date", {
                            required: "Date is required.",
                          })}
                          type="date"
                          name="date"
                          id="date"
                          required
                          className="block w-full flex-1 pl-14 rounded-md border-0 ring-1 ring-inset ring-white/30 bg-white/10 text-sm text-white focus:ring-2 focus:ring-inset focus:ring-sky-500"

                        />
                      </div>

                      <div className="relative w-1/2 flex rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-white text-sm">TIME /</span>
                        </div>
                        <input
                          {...register("time", {
                            required: "Time is required.",
                          })}
                          type="time"
                          name="time"
                          id="time"
                          required
                          className="block w-full flex-1 pl-14 rounded-md border-0 ring-1 ring-inset ring-white/30 bg-white/10 text-sm text-white focus:ring-2 focus:ring-inset focus:ring-sky-500"

                        />
                      </div>

                    </div>
                  </div>
                </div>
              </div>


              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-400 sm:pt-5">
                <label htmlFor="descriptions" className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                  Descriptions {descriptionsLength > 500 ? <span className="text-red-500">({descriptionsLength}/500)</span> : <span>({descriptionsLength}/500)</span>}
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <textarea
                    {...register("descriptions", {
                      maxLength: {
                        message: "Maximum length of the descriptions is 500.",
                        value: 500
                      }
                    })
                    }
                    id="descriptions"
                    name="descriptions"
                    rows={7}
                    className={classNames(descriptionsLength > 500 ? " text-red-500 focus:ring-2 focus:ring-inset focus:ring-red-500" : "text-white focus:ring-2 focus:ring-inset focus:ring-sky-500",
                      "block w-full min-w-0 px-2 py-1.5 flex-1 rounded-md border-0 ring-1 ring-inset ring-white/30 bg-white/10 sm:text-sm")}
                    defaultValue={''}
                  />
                  <p className="mt-2 text-sm text-gray-500">Write few words about the footage.</p>
                </div>
              </div>


              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-400 sm:pt-5">
                <label htmlFor="imageFiles" className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                  Media
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">


                  <div className="flex max-w-2xl justify-center rounded-md border-2 border-dashed border-gray-400 px-6 pt-5 pb-6">

                    <div className="space-y-1 text-center">

                      <div className="flex text-sm text-gray-400">
                        <label
                          htmlFor="imageFiles"
                          className="relative cursor-pointer rounded-md font-medium text-sky-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2 hover:text-sky-500"
                        >
                          <span>Upload new image(s).</span>
                          <input
                            id="imageFiles"
                            name="imageFiles"
                            type="file" className="sr-only"
                            onChange={onSelectedImageFiles}
                            multiple
                          />
                        </label>
                        {/* <p className="pl-1">or drag and drop</p> */}
                        <p className="pl-1">(up to 200MB)</p>
                      </div>
                      {/* <p className="text-xs text-gray-500">up to 200MB</p> */}

                      <ProgressBarSimple progress={progress} remaining={remaining} />

                      {progress != 100 ?
                        <div className="text-sm text-center text-gray-400">
                          <p>
                            <span>Supports common image files only.<br />Compress or resize images if needed. </span>
                          </p>
                        </div>
                        : <div className="text-sm text-center text-gray-400">
                          <span>Press save to complete the post.</span>
                          {uploadedImagesToken ?
                            <p>
                              <span>Image preview: </span>
                              </p>
                            : <></>}
                        </div>
                      }

                    </div>
                  </div>




                </div>
              </div>




            </div>




          </div>
        </div>


        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              onClick={(e) => {
                scrollToTop();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              disabled={createPostLoading}
            >

              {createPostLoading ?
                <span className="flex items-center text-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>processing...</span>
                : <span>Post</span>}


            </button>
          </div>
        </div>
      </form >

      <Notification props={{ message, isNotify, setIsNotify }} />
    </div>
  )
}
