"use client"; // This is a client component 👈🏽
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react'
import {
  Configure,
  DynamicWidgets,
  RefinementList,
  Hits,
  InstantSearch,
  Pagination,
  SearchBox,
} from 'react-instantsearch';
const searchClient = algoliasearch(
  'QNMZQEBJD0',
  '302790e6536a1f4f743b0a8cbcda84e4'
);
const index = searchClient.initIndex('products');

function Search() {
  const searchParams = useSearchParams()
 
  const c = searchParams.get('c') || '';
  return c;
}

export default function Home() {

    const c = Search();
    console.log('searchParams',c)

  const [name, setName] = useState(Search);
  const [datas, setDatas] = useState([]);
  useEffect(() => {
//     if(!name){
//       setDatas([]);
// return;
//     }
    // Should not ever set state during rendering, so do this in useEffect instead.
    index.search(name, {
      distinct: true
  }).then(({ hits }) => {
    //@ts-ignore
    setDatas(hits);
    console.log(hits);
    // const unique = [...new Set(hits.map(item => item.category))]; // [ 'A', 'B']
//   setDatas(unique);
    // console.log('search hists', unique);
  });
    
  }, [name]);

  function unixTime(unixtime) {

    var u = new Date(unixtime*1000);

      return u.getUTCFullYear() +
        '-' + ('0' + u.getUTCMonth()).slice(-2) +
        '-' + ('0' + u.getUTCDate()).slice(-2) + 
        ' ' + ('0' + u.getUTCHours()).slice(-2) +
        ':' + ('0' + u.getUTCMinutes()).slice(-2) +
        ':' + ('0' + u.getUTCSeconds()).slice(-2) +
        '.' + (u.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) 
    };
  return (
    <main className="flex  flex-col items-center justify-between p-5">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <Link href="../" className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          back &nbsp; 

        </Link>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="place-items-center   before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] ">
        {/* <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        /> */}
            <label>
              <br></br>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="hidden bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </label>
{
datas.map((data, index) => (
        <p> <a className="inline-flex items-center p-1 ms-2 mt-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300" href={ "details?company="+data.name } >name: {data.name}  - discription: {data.description}   - title: {data.title}   - Date: {
            new Date(data.lastmodified).toString().substring(4, 15)}  </a></p>
      ))}

        
      </div>

 
    </main>
  );
}
