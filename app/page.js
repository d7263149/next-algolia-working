"use client"; // This is a client component 👈🏽
import Image from "next/image";
import React, { useRef, useEffect, forwardRef , useState} from 'react'
import useGoogleMapsApi from './useGoogleMapsApi'
import algoliasearch from 'algoliasearch';
import Link from 'next/link';

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

export default function Home() {


  const inputRef = useRef()
  const autocompleteRef = useRef()
  const googleMapsApi = useGoogleMapsApi()

  useEffect(() => {
    if (googleMapsApi) {
      autocompleteRef.current = new googleMapsApi.places.Autocomplete(inputRef.current, { types: ['(cities)'] })
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace()
        // Do something with the resolved place here (ie store in redux state)
      })
    }
  }, [googleMapsApi])

  const handleSubmit = (e) => {
    e.preventDefault()
    return false
  }

  const [name, setName] = useState("");
  const [gname, setgName] = useState('');
  const [clocation, setclocation] = useState('');
  const [datas, setDatas] = useState([]);
  useEffect(() => {
    if(!name){
      setDatas([]);
return;
    }
    index.setSettings({
      searchableAttributes: [
        'category',
      ]
    }).then(() => {
      // done
    })
    // Should not ever set state during rendering, so do this in useEffect instead.
    index.search(name, {
      distinct: true
  }).then(({ hits }) => {
    console.log('hits',hits);
    //@ts-ignore
    const unique = [...new Set(hits.map(item => item.category))]; // [ 'A', 'B']


  setDatas(unique);
    // console.log('search hists', unique);
  });
    
  }, [name]);


// function find(d){
//   var lat = position.coords.latitude;
//   var lng = position.coords.longitude;
// console.log(d);

// }

function showPosition(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  console.log(lat,lng)
  // map.setCenter(new google.maps.LatLng(lat, lng));
  fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + lat + ',' + lng + '&key=AIzaSyAqGh594BM_qawNhAr7Qyxd8X7Z_ABMdg8')
        .then((response) => response.json())
        .then((responseJson) => {
          let data = JSON.stringify(responseJson);
            // console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
            console.log('data',responseJson['results'][0]?.formatted_address)
            setclocation(responseJson['results'][0]?.formatted_address);
})
}

function find(s) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}


  return (
    <main className="flex  flex-col items-center justify-between p-5">
      {/* <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.js</code>
        </p>
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
      </div> */}

      <div className="place-items-center   before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] ">
        {/* <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        /> */}
<button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" value="working" onClick={(e) => find(e.target.value)

} >my current location </button>

<h3>{clocation}</h3>
<form autoComplete='off' onSubmit={handleSubmit}>
      <label htmlFor='location'>Enter  location:</label>
      <input
        name='location'
        aria-label='Search locations'
        ref={inputRef}
        placeholder='placeholder'
        autoComplete='off'
         className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </form>


        {/* <label>Enter  location:
              <br></br>
        <input 
          type="text" 
          value={gname}
          name="search_input"
          onChange={(e) => setgName(e.target.value)}
          className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </label> */}
            <label>Enter category:
              <br></br>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </label>
{
datas.map((data, index) => (
        <p><Link className="inline-flex items-center p-1 ms-2 mt-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300" href={ "details?c="+data.toLowerCase() } >{data} </Link></p>
      ))}

        
      </div>

 
    </main>
  );
}
