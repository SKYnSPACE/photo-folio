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


export default function Submission() {
  const { data: seminarData, error: seminarDataError, isLoading: seminarDataIsLoading, mutate: mutateSeminarData } = useSWR(`/api/seminar`);

  const { register, setValue, watch, handleSubmit } = useForm();
  const titleLength = watch("title")?.length;
  const abstractLength = watch("abstract")?.length;
  const tagsLength = watch("tags")?.length;

  const timeStampDate = watch("date");
  const timeStampTime = watch("time");

  const [saveSubmission, { loading: submissionLoading, data: submissionData, error: submissionError }] = useMutation("/api/seminar/save");
  const [saveDraft, { loading: saveDraftLoading, data: saveDraftData, error: saveDraftError }] = useMutation("/api/seminar/saveDraft");
  const [saveFinal, { loading: saveFinalLoading, data: saveFinalData, error: saveFinalError }] = useMutation("/api/seminar/saveFinal");
  // const [download, { loading:downloadLoading, data: downloadData, error: downloadError }] = useMutation("/api/seminar/download");

  const [progress, setProgress] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [uploadedDraftFile, setUploadedDraftFile] = useState(null);
  const [uploadedFinalFile, setUploadedFinalFile] = useState(null);

  const { data: reviewData, error: reviewError, isLoading: reviewIsLoading, mutate: mutateReviewData } = useSWR(seminarData?.mySeminarSubmission ? `/api/seminar/review` : null);
  const [reviewers, setReviewers] = useState([]);
  const [reviewRequest, { loading: reviewRequestLoading, data: reviewRequestData, error: reviewRequestError }] = useMutation("/api/request/review");
  const [reviews, setReviews] = useState([]);

  const [waiver, setWaiver] = useState(false)
  const [skipReview, setSkipReview] = useState(false)
  const [skipRevision, setSkipRevision] = useState(false)

  const { data: availableSlotsData, error: getAvailableSlotsError, isLoading: getAvailableSlotsLoading } = useSWR('/api/slot/available');



  const [isNotify, setIsNotify] = useState(false);
  const [message, setMessage] = useState({ type: 'success', title: 'Confirmed!', details: 'Test message initiated.', });

  const onValid = (validForm) => {
    // console.log({
    //   ...validForm, alias: seminarData?.mySeminarSubmission?.alias,
    //   draftFile: uploadedDraftFile, finalFile: uploadedFinalFile,
    //   waiver, skipReview, skipRevision
    // });
    saveSubmission({
      ...validForm, alias: seminarData?.mySeminarSubmission?.alias,
      draftFile: uploadedDraftFile, finalFile: uploadedFinalFile,
      waiver, skipReview, skipRevision
    });
    scrollToTop();
  }
  const onInvalid = (errors) => {
    console.log(errors);
  }

  const askForReview = async (id) => {
    // console.log(id)
    reviewRequest({ requestFor: id, alias: seminarData?.mySeminarSubmission?.alias })
  }


  const handleDeleteDraftFile = async (e) => {
    if (uploadedDraftFile) {
      const deleteResponse = await fetch(`/api/seminar/delete?token=${uploadedDraftFile.name}&ext=${uploadedDraftFile.ext}`, {
        method: 'DELETE'
      })
      // console.log(deleteResponse)
    }
  };

  const onSelectedDraftFile = async (e) => {
    const fileInput = e.target;
    if (!fileInput.files || fileInput.files.length === 0) return;

    e.preventDefault();

    /** Files validation */
    const validFiles = [];
    for (let i = 0; i < fileInput.files.length; ++i) {
      const file = fileInput.files[i];

      if (!file.type.startsWith("image")) {
        alert(`File with idx: ${i} is invalid`);
        continue;
      }

      validFiles.push(file);
    }

    if (!validFiles.length) {
      alert("No valid files were chosen");
      return;
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
      setUploadedDraftFile({ name: data?.fileName, ext: data?.extension });
      saveDraft({ alias: seminarData?.mySeminarSubmission?.alias, draftFile: { name: data?.fileName, ext: data?.extension } });

    } catch (e) {
      console.error(e);
      const error =
        e.response && e.response.data
          ? e.response.data.error
          : "Sorry! something went wrong.";
      alert(error);
    }
  };

  const onSelectedFinalFile = async (e) => {
    const fileInput = e.target;
    if (!fileInput.files || fileInput.files.length === 0) return;

    e.preventDefault();

    const file = fileInput.files[0];
    if (!file) return;

    //TODO: REMOVE file from the server when uploadedDraftFile is not null 
    if (uploadedFinalFile) {
      const deleteResponse = await fetch(`/api/seminar/delete?token=${uploadedFinalFile.name}&ext=${uploadedFinalFile.ext}`, {
        method: 'DELETE'
      })
      // console.log(deleteResponse)
    }
    else if (seminarData?.mySeminarSubmission?.finalFile) {
      const prevFile = seminarData?.mySeminarSubmission?.finalFile;
      const indexOfLastDot = prevFile.lastIndexOf('.');
      const fileName = prevFile.slice(0, indexOfLastDot); //name only (w/o extension)
      const extension = prevFile.slice(indexOfLastDot + 1);

      const deleteResponse = await fetch(`/api/seminar/delete?token=${fileName}&ext=${extension}`, {
        method: 'DELETE'
      })
      // console.log(deleteResponse)
    }

    try {
      let startAt = Date.now();
      let formData = new FormData();
      formData.append("media", file);

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
      } = await axios.post("/api/seminar/upload", formData, options);

      // console.log("File was uploaded successfylly:", data);
      setUploadedFinalFile({ name: data?.fileName, ext: data?.extension });
      saveFinal({ alias: seminarData?.mySeminarSubmission?.alias, finalFile: { name: data?.fileName, ext: data?.extension } });

    } catch (e) {
      console.error(e);
      const error =
        e.response && e.response.data
          ? e.response.data.error
          : "Sorry! something went wrong.";
      alert(error);
    }
  };

  useEffect((
  ) => {
    if (uploadedDraftFile) {
      saveSubmission({
        alias: seminarData?.mySeminarSubmission?.alias,
        file: uploadedDraftFile,
        waiver, skipReview, skipRevision
      })
    }
  }, [uploadedDraftFile])

  useEffect((
  ) => {
    if (uploadedFinalFile) {
      saveSubmission({
        alias: seminarData?.mySeminarSubmission?.alias,
        file: uploadedFinalFile,
        waiver, skipReview, skipRevision
      })
    }
  }, [uploadedFinalFile])


  useEffect(() => {
    if (seminarData?.mySeminarSubmission) {

      setValue("title", seminarData.mySeminarSubmission.title);
      setValue("abstract", seminarData.mySeminarSubmission.abstract);
      setValue("category", seminarData.mySeminarSubmission.category);
      setValue("tags", seminarData.mySeminarSubmission.tags);

      setWaiver(seminarData.mySeminarSubmission.waiver);
      setSkipReview(seminarData.mySeminarSubmission.skipReview);
      setSkipRevision(seminarData.mySeminarSubmission.skipRevision);
    }
  }, [seminarData]);

  useEffect(() => {
    if (reviewData?.reviewers) {
      setReviewers(reviewData.reviewers);
    }
    if (reviewData?.reviews) {
      // console.log(reviewData.reviews)
      setReviews(reviewData.reviews)
    }
  }, [reviewData])

  useEffect(() => {
    setTimeout(() => {
      mutateSeminarData();
      mutateReviewData();
    }, 3000);
  }, [submissionLoading]);

  useEffect(() => {
    // if (submissionData?.ok) {
    //   setMessage(
    //     { type: 'success', title: 'Successfully Sent!', details: 'Wait for the page reload.', }
    //   )
    //   setIsNotify(true);
    // } BUG HERE due to fileupload conflict. DO NOT USE! (setIsNotify will trigger page reload. and this will reset all form inputs)

    if (submissionData?.error) {
      switch (submissionData?.error) {
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
            { type: 'fail', title: `${submissionData?.error}`, details: "", }
          )
          setIsNotify(true);
      }

    }
  }, [submissionData]);


  useEffect(() => {
    if (reviewRequestData?.ok) {
      setMessage(
        { type: 'success', title: 'Ask review completed!', details: 'Created review request successfully. Wait for the page reload.', }
      )
      setIsNotify(true);
    }

    if (reviewRequestData?.error) {
      switch (reviewRequestData.error?.code) {
        case 'P1017':
          // console.log("Connection Lost.")
          setMessage(
            { type: 'fail', title: 'Connection Lost.', details: "Database Server does not respond.", }
          )
          setIsNotify(true);
          return;
        case 'P2002':
          // console.log("Existing Request.");
          setMessage(
            { type: 'fail', title: 'Creating request failed!', details: "Request already exists.", }
          )
          setIsNotify(true);
          return;
        default:
          console.log("ERROR CODE", reviewRequestData.error);
          setMessage(
            { type: 'fail', title: `ERROR ${reviewRequestData.error?.code}`, details: `${reviewRequestData.error?.message}`, }
          )
          setIsNotify(true);
      }
    }

  }, [reviewRequestData])

  return (

    
    <div className="py-16 px-10 mx-auto max-w-7xl">

      <form onSubmit={handleSubmit(onValid, onInvalid)} className="bg-gray-900 p-4 shadow-sm ring-1 ring-gray-500 rounded-xl space-y-8 divide-y-2 divide-gray-300">

        <div className="space-y-8 divide-y-2 divide-gray-300 sm:space-y-5">


          {/* {DRAFT} */}


          <div className="space-y-6 sm:space-y-5">

            <div className="mt-6">
              <h3 className="text-2xl font-semibold leading-6 text-sky-500">Write</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                This information will be displayed publicly so be careful what you share.
              </p>
            </div>

            {seminarDataIsLoading ? <div className="flex items-center justify-center my-16"> <LoadingSpinner className="h-8 w-8 text-sky-500" /> </div> : <></>}


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
                    disabled={seminarData?.mySeminarSubmission?.currentStage >= 3}
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
                <label htmlFor="abstract" className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                  Descriptions {abstractLength > 500 ? <span className="text-red-500">({abstractLength}/500)</span> : <span>({abstractLength}/500)</span>}
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <textarea
                    {...register("abstract", {
                      required: "Abstract is required.",
                      maxLength: {
                        message: "Maximum length of the abstract is 500.",
                        value: 500
                      }
                    })
                    }
                    id="abstract"
                    name="abstract"
                    rows={7}
                    required
                    disabled={seminarData?.mySeminarSubmission?.currentStage >= 3}
                    className={classNames(abstractLength > 500 ? " text-red-500 focus:ring-2 focus:ring-inset focus:ring-red-500" : "text-white focus:ring-2 focus:ring-inset focus:ring-sky-500",
                      "block w-full min-w-0 px-2 py-1.5 flex-1 rounded-md border-0 ring-1 ring-inset ring-white/30 bg-white/10 sm:text-sm")}
                    defaultValue={''}
                  />
                  <p className="mt-2 text-sm text-gray-500">Write a few sentences about the presentation.</p>
                </div>
              </div>


              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-400 sm:pt-5">
                <label htmlFor="draft" className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2">
                  Media
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">


                <div className="flex max-w-2xl justify-center rounded-md border-2 border-dashed border-gray-400 px-6 pt-5 pb-6">

                    <div className="space-y-1 text-center">

                      <div className="flex text-sm text-gray-400">
                        <label
                          htmlFor="draft"
                          className="relative cursor-pointer rounded-md font-medium text-sky-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2 hover:text-sky-500"
                        >
                          <span>Upload a new file</span>
                          <input
                            id="draft"
                            name="draft"
                            type="file" className="sr-only"
                            onChange={onSelectedDraftFile}
                            multiple
                          />
                        </label>
                        {/* <p className="pl-1">or drag and drop</p> */}
                        <p className="pl-1">(single file up to 200MB)</p>
                      </div>
                      {/* <p className="text-xs text-gray-500">up to 200MB</p> */}

                      <ProgressBarSimple progress={progress} remaining={remaining} />

                      {progress != 100 ?
                        <div className="text-sm text-center text-gray-400">
                          <p>
                            <span>Only supports single file upload.<br />Compress your materials if needed. </span>
                          </p>
                        </div>
                        : <div className="text-sm text-center text-gray-400">
                          {uploadedDraftFile ?
                            <p>
                              <span>Your token: </span>
                              <a className="relative cursor-pointer rounded-md bg-white font-medium text-sky-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2 hover:text-sky-500"
                                href={`/uploads/seminar/${uploadedDraftFile.name}.${uploadedDraftFile.ext}`}
                                download={`${seminarData?.mySeminarSubmission?.alias}-draft.${uploadedDraftFile.ext}`}>{uploadedDraftFile.name}</a> </p>
                            : <></>}
                          <span>Press save to complete <br />the draft submission.</span>
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
              disabled={submissionLoading}
            >

              {submissionLoading ?
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
