import { useRouter } from 'next/router';
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react';

import useSWR from 'swr';

import clsx from 'clsx'

import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

import { FormattedDate } from '@/components/FormattedDate'
import PostDetails from '@/components/Modals/PostDetails';




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


function generateImagesArray(post) {
  const images = [];
  for (let i = 1; i <= post.imageCount; ++i) {
    const image = {
      original: `/uploads/images/${post.token}/${i}.png`,
      thumbnail: `/uploads/images/${post.token}/${i}.png`,
    };
    images.push(image);
  }
  return images;
}


export default function PostsByYearMonth() {
  const router = useRouter();
  const { year, month } = router.query;

  const apiUrl = `/api/posts/${year}/${month}`;

  const fetcher = (url) => fetch(url).then((response) => response.json());

  const { data, error, isLoading } = useSWR(year && month ? apiUrl : null, fetcher);


  const heightRef = useRef()
  const [heightAdjustment, setHeightAdjustment] = useState(0)
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
  }, []);


  useEffect(() => {
    if (data && data.ok) {
      console.log(data);
    }
  }, [data]);


  // if (!year || !month) {
  //   // Handle the case when year or month is undefined
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   // Handle the error case
  //   return <div>Error: {error.message}</div>;
  // }
  // Render the component with the fetched data
  return (
    <article
      id={0}
      className="scroll-mt-16 pt-20"
      style={{ paddingBottom: `${heightAdjustment}px` }}
    >
      <div ref={heightRef} />

      {(data && data?.posts?.length > 0) ?
        (data.posts.map((post, index) => (

          <div key={index} ref={heightRef} className='pb-20'>
            <ArticleHeader id={index} date={post.originalDate} />
            <ContentWrapper className="typography">

<div className='w-full'>
<ImageGallery items={generateImagesArray(post)}/>

<h2>{post.title}</h2>
              <p>{post.content}</p>
</div>


            </ContentWrapper>
          </div>
        ))) :
        <ContentWrapper className="typography">

          <div>No posts available</div>

        </ContentWrapper>
      }


    </article>
  );
}