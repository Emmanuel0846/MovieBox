import React, { useEffect } from 'react'
import { useState } from "react";

function Movie() {

  const [movieList,setMovieList] = useState([])


  const getMovie = () => {
    fetch("https://api.themoviedb.org/3/discover/movie?api_key=aa5c677e096736a95b57c8d27c0075e1")
    .then(res => res.json())
    .then(json => setMovieList(json.results))
  }

  useEffect(() =>{
    getMovie()
  },[])

  console.log(movieList)

  return (
    <div>
      {movieList.map((movie)=>(
        <img style = {{width:"200px", height: "250px", marginLeft: "10px", marginTop: "10px"}} alt='' src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}/>
      ))}
    </div>
  )
}

export default Movie