import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";


import { FormattedDate } from '@/components/FormattedDate'

const images = [
  {
    original: '/uploads/images/jC_T8T-3Wq361OWN/1.png',
    thumbnail: '/uploads/images/jC_T8T-3Wq361OWN/1.png',
  },
  {
    original: '/uploads/images/jC_T8T-3Wq361OWN/2.png',
    thumbnail: '/uploads/images/jC_T8T-3Wq361OWN/2.png',
  },
  {
    original: '/uploads/images/jC_T8T-3Wq361OWN/3.png',
    thumbnail: '/uploads/images/jC_T8T-3Wq361OWN/3.png',
  },
];

function ContentWrapper({ className, children }) {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
      <div className="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">
        <div
          className={clsx(
            'mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto',
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function ArticleHeader({ id, date }) {
  return (
    <header className="relative mb-10 xl:mb-0">
      <div className="pointer-events-none absolute left-[max(-0.5rem,calc(50%-18.625rem))] top-0 z-50 flex h-4 items-center justify-end gap-x-2 lg:left-0 lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] xl:h-8">
        <Link href={`#${id}`} className="inline-flex">
          <FormattedDate
            date={date}
            className="hidden xl:pointer-events-auto xl:block xl:text-sm/4 xl:font-medium xl:text-white/50"
          />
        </Link>
        <div className="h-[0.0625rem] w-3.5 bg-gray-400 lg:-mr-3.5 xl:mr-0 xl:bg-gray-300" />
      </div>
      <ContentWrapper>
        <div className="flex">
          <Link href={`#${id}`} className="inline-flex">
            <FormattedDate
              date={date}
              className="text-sm/4 font-medium text-gray-500 dark:text-white/50 xl:hidden"
            />
          </Link>
        </div>
      </ContentWrapper>
    </header>
  )
}

export default function Home() {
  let heightRef = useRef()
  let [heightAdjustment, setHeightAdjustment] = useState(0)

  let id = 1;
  let date = '2017-06-02';
  const children = () => {
    return (<div className='w-full'>

      {/* <img src="https://images.hdqwalls.com/download/dark-blue-evening-rl-2560x1440.jpg"/> */}

      <ImageGallery items={images} />

      <div className="w-full top-1/3 right-0 mr-12 flex justify-end ">
        <figure className="relative isolate pt-6 sm:pt-12">
          <svg
            viewBox="0 0 162 128"
            fill="none"
            aria-hidden="true"
            className="absolute left-0 top-0 -z-10 h-32 stroke-white/20"
          >
            <path
              id="b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb"
              d="M65.5697 118.507L65.8918 118.89C68.9503 116.314 71.367 113.253 73.1386 109.71C74.9162 106.155 75.8027 102.28 75.8027 98.0919C75.8027 94.237 75.16 90.6155 73.8708 87.2314C72.5851 83.8565 70.8137 80.9533 68.553 78.5292C66.4529 76.1079 63.9476 74.2482 61.0407 72.9536C58.2795 71.4949 55.276 70.767 52.0386 70.767C48.9935 70.767 46.4686 71.1668 44.4872 71.9924L44.4799 71.9955L44.4726 71.9988C42.7101 72.7999 41.1035 73.6831 39.6544 74.6492C38.2407 75.5916 36.8279 76.455 35.4159 77.2394L35.4047 77.2457L35.3938 77.2525C34.2318 77.9787 32.6713 78.3634 30.6736 78.3634C29.0405 78.3634 27.5131 77.2868 26.1274 74.8257C24.7483 72.2185 24.0519 69.2166 24.0519 65.8071C24.0519 60.0311 25.3782 54.4081 28.0373 48.9335C30.703 43.4454 34.3114 38.345 38.8667 33.6325C43.5812 28.761 49.0045 24.5159 55.1389 20.8979C60.1667 18.0071 65.4966 15.6179 71.1291 13.7305C73.8626 12.8145 75.8027 10.2968 75.8027 7.38572C75.8027 3.6497 72.6341 0.62247 68.8814 1.1527C61.1635 2.2432 53.7398 4.41426 46.6119 7.66522C37.5369 11.6459 29.5729 17.0612 22.7236 23.9105C16.0322 30.6019 10.618 38.4859 6.47981 47.558L6.47976 47.558L6.47682 47.5647C2.4901 56.6544 0.5 66.6148 0.5 77.4391C0.5 84.2996 1.61702 90.7679 3.85425 96.8404L3.8558 96.8445C6.08991 102.749 9.12394 108.02 12.959 112.654L12.959 112.654L12.9646 112.661C16.8027 117.138 21.2829 120.739 26.4034 123.459L26.4033 123.459L26.4144 123.465C31.5505 126.033 37.0873 127.316 43.0178 127.316C47.5035 127.316 51.6783 126.595 55.5376 125.148L55.5376 125.148L55.5477 125.144C59.5516 123.542 63.0052 121.456 65.9019 118.881L65.5697 118.507Z"
            />
            <use href="#b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb" x={86} />
          </svg>
          <blockquote className="text-xl font-semibold leading-8 text-white sm:text-2xl sm:leading-9">
            <p>
              Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...
            </p>
          </blockquote>
          <p>
            Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...
          </p>
          <p>
            Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...
          </p>
          <p>
            Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...
          </p>
          <p>
            Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...
          </p>
          <p>
            Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...
          </p>
        </figure>
      </div>
    </div>)
  };

  useEffect(() => {
    let observer = new window.ResizeObserver(() => {
      let { height } = heightRef.current.getBoundingClientRect()
      let nextMultipleOf8 = 8 * Math.ceil(height / 8)
      setHeightAdjustment(nextMultipleOf8 - height)
    })

    observer.observe(heightRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (

    <article
      id={id}
      className="scroll-mt-16 pt-20"
      style={{ paddingBottom: `${heightAdjustment}px` }}
    >
      <div ref={heightRef} className='pb-20'>
        <ArticleHeader id={id} date={date} />
        <ContentWrapper className="typography">

          {children()}

        </ContentWrapper>
      </div>

      <div ref={heightRef} className='pb-20'>
        <ArticleHeader id={id} date={date} />
        <ContentWrapper className="typography">

          {children()}

        </ContentWrapper>
      </div>
    </article>



  )

}


{/* <div className="w-full flex justify-end overflow-hidden relative">

<img src="https://images.hdqwalls.com/download/dark-blue-evening-rl-2560x1440.jpg"
/>

<div className="absolute w-5/12 top-1/3 right-0 mr-12 flex justify-end ">
  <figure className="relative isolate pt-6 sm:pt-12">
    <svg
      viewBox="0 0 162 128"
      fill="none"
      aria-hidden="true"
      className="absolute left-0 top-0 -z-10 h-32 stroke-white/20"
    >
      <path
        id="b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb"
        d="M65.5697 118.507L65.8918 118.89C68.9503 116.314 71.367 113.253 73.1386 109.71C74.9162 106.155 75.8027 102.28 75.8027 98.0919C75.8027 94.237 75.16 90.6155 73.8708 87.2314C72.5851 83.8565 70.8137 80.9533 68.553 78.5292C66.4529 76.1079 63.9476 74.2482 61.0407 72.9536C58.2795 71.4949 55.276 70.767 52.0386 70.767C48.9935 70.767 46.4686 71.1668 44.4872 71.9924L44.4799 71.9955L44.4726 71.9988C42.7101 72.7999 41.1035 73.6831 39.6544 74.6492C38.2407 75.5916 36.8279 76.455 35.4159 77.2394L35.4047 77.2457L35.3938 77.2525C34.2318 77.9787 32.6713 78.3634 30.6736 78.3634C29.0405 78.3634 27.5131 77.2868 26.1274 74.8257C24.7483 72.2185 24.0519 69.2166 24.0519 65.8071C24.0519 60.0311 25.3782 54.4081 28.0373 48.9335C30.703 43.4454 34.3114 38.345 38.8667 33.6325C43.5812 28.761 49.0045 24.5159 55.1389 20.8979C60.1667 18.0071 65.4966 15.6179 71.1291 13.7305C73.8626 12.8145 75.8027 10.2968 75.8027 7.38572C75.8027 3.6497 72.6341 0.62247 68.8814 1.1527C61.1635 2.2432 53.7398 4.41426 46.6119 7.66522C37.5369 11.6459 29.5729 17.0612 22.7236 23.9105C16.0322 30.6019 10.618 38.4859 6.47981 47.558L6.47976 47.558L6.47682 47.5647C2.4901 56.6544 0.5 66.6148 0.5 77.4391C0.5 84.2996 1.61702 90.7679 3.85425 96.8404L3.8558 96.8445C6.08991 102.749 9.12394 108.02 12.959 112.654L12.959 112.654L12.9646 112.661C16.8027 117.138 21.2829 120.739 26.4034 123.459L26.4033 123.459L26.4144 123.465C31.5505 126.033 37.0873 127.316 43.0178 127.316C47.5035 127.316 51.6783 126.595 55.5376 125.148L55.5376 125.148L55.5477 125.144C59.5516 123.542 63.0052 121.456 65.9019 118.881L65.5697 118.507Z"
      />
      <use href="#b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb" x={86} />
    </svg>
    <blockquote className="text-xl font-semibold leading-8 text-white sm:text-2xl sm:leading-9">
      <p>
        Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...
      </p>
    </blockquote>
  </figure>
</div>
</div> */}