import React, { useEffect, useState } from "react";
import './App.css';
import axios from 'axios';
import Movie from "./components/Movie";
import Youtube from 'react-youtube';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MovieDetails from "./components/MovieDetails";
import NotFound from "./components/NotFound";
import logo from './assets/Logo.svg';
import menu from './assets/Menu.svg';
import imdb from './assets/imdb.svg';
import tomato from './assets/tomato.svg';
import facebook from './assets/facebook.svg';
import instagram from './assets/instagram.svg';
import twitter from './assets/twitter.svg';
import youtube from './assets/youtube.svg';


function App() {
  const MOVIE_API = "https://api.themoviedb.org/3/";
  const SEARCH_API = MOVIE_API + "search/movie";
  const DISCOVER_API = MOVIE_API + "movie/top_rated";
  const API_KEY = "aa5c677e096736a95b57c8d27c0075e1";
  const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280";

  const [playing, setPlaying] = useState(false);
  const [trailer, setTrailer] = useState(null);
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [movie, setMovie] = useState({ title: "Loading Movies" });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async (event) => {
    if (event) {
      event.preventDefault();
    }

    try {
      const { data } = await axios.get(`${searchKey ? SEARCH_API : DISCOVER_API}`, {
        params: {
          api_key: API_KEY,
          query: searchKey
        }
      });

      setMovies(data.results);
      setMovie(data.results[0]);

      if (data.results.length) {
        await fetchMovie(data.results[0].id);
      }
    } catch (error) {
      console.error("Error fetching movies:", error.message);
      // Handle the error here, e.g., display an error message to the user
    }
  };

  const fetchMovie = async (id) => {
    try {
      const { data } = await axios.get(`${MOVIE_API}movie/${id}`, {
        params: {
          api_key: API_KEY,
          append_to_response: "videos,credits" // Include videos and credits for director and cast
        }
      });

      if (data.videos && data.videos.results) {
        const trailer = data.videos.results.find(vid => vid.name === "Official Trailer");
        setTrailer(trailer ? trailer : data.videos.results[0]);
      }

      setMovie({
        ...data,
        director: getDirector(data.credits),
        stars: getStars(data.credits),
        genres: data.genres ? data.genres.map(genre => genre.name) : [] // Handle undefined genres
      });
    } catch (error) {
      console.error("Error fetching movie details:", error.message);
      // Handle the error here, e.g., display an error message to the user
    }
  };

  const getDirector = (credits) => {
    if (credits && credits.crew) {
      const director = credits.crew.find(member => member.job === "Director");
      return director ? director.name : "Unknown";
    }
    return "Unknown";
  };

  const getStars = (credits) => {
    if (credits && credits.cast) {
      const stars = credits.cast.slice(0, 5);
      return stars.map(star => star.name).join(", ");
    }
    return "Unknown";
  };

  const selectMovie = (selectedMovie) => {
    fetchMovie(selectedMovie.id);
    setPlaying(false);
    setMovie(selectedMovie);
    window.scrollTo(0, 0);
  };

  const renderMovies = () => (
    movies.map(movie => (
      <Movie
        selectMovie={selectMovie}
        key={movie.id}
        movie={{
          ...movie,
          director: getDirector(movie.credits), // Add director to movie data
          stars: getStars(movie.credits), // Add stars to movie data
          genres: movie.genres // Handle undefined genres
        }}
      />
    ))
  );

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <main>
                {movie ?
                  <div className="poster"
                    style={{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${BACKDROP_PATH}${movie.backdrop_path})` }}>
                    {playing ?
                      <>
                        <Youtube
                          videoId={trailer.key}
                          className={"youtube amru"}
                          containerClassName={"youtube-container amru"}
                          opts={{
                            width: '100%',
                            height: '100%',
                            playerVars: {
                              autoplay: 1,
                              controls: 0,
                              cc_load_policy: 0,
                              fs: 0,
                              iv_load_policy: 0,
                              modestbranding: 0,
                              rel: 0,
                              showinfo: 0,
                            },
                          }}
                        />
                        <button onClick={() => setPlaying(false)} className={"button close-video"}>Close
                        </button>
                      </> :
                      <div className="center-max-size">
                        <div className="poster-content">
                          <h1 data-testid="movie-title">{movie.title}</h1>
                          <p data-testid="movie-release-date">Release Date: {movie.release_date}</p>
                          <p data-testid="movie-runtime">Runtime: {movie.runtime} minutes</p>
                          <div>
                            <img src={imdb} alt='imdb-logo' className='imdb' />
                            {movie.vote_average ? <span className={"movie-voting"}>{Math.round(movie.vote_average * 10)}/100</span> : null}

                            <img src={tomato} alt='tomato-logo' className='tomato' />
                            {movie.vote_average ? <span className={"tomato-voting"} data-testid="movie-rating">{Math.round(movie.vote_average * 10)+5}%</span> : null}
                          </div>
                          
                          <p data-testid="movie-overview">{movie.overview}</p>
                          <p data-testid="movie-director">Director: {movie.director}</p>
                            {trailer ?
                            <button className={"button play-video"} onClick={() => setPlaying(true)}
                              type="button"> <span className="play">&#9654;</span> &nbsp; <strong>WATCH
                              TRAILER</strong> </button>
                            : 'Sorry, no trailer available'}
                        </div>
                      </div>
                    }
                  </div>
                  : null}
                  
                    <div className="top-rated">
                      <h2>Top-Rated Movie</h2>
                      <a href="./">See more 	&gt;</a>
                    </div>
                <div className={"center-max-size container"}>
                  {renderMovies()}
                </div>
              </main>
            }
          />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <header className="center-max-size header">
          <Link to="/">  <img src={logo} alt='brand-logo' className='brand' /></Link>
          <form className="form" onSubmit={fetchMovies}>
            <input placeholder="What do you want to watch?" className="search" type="text" id="search"
            value={searchKey} onInput={(event) => setSearchKey(event.target.value)} />
            <button className="submit-search" type="submit"><i className="fa fa.search"></i></button>
          </form>
          <Link to="./" className="sign-in">Sign in <img src={menu} alt='menu-logo' className='menu' /></Link>
        </header>

        <footer className="footer">
          <div className="footer-social">
            <a href="/" className={"facebook"}>  <img src={facebook} alt='facebook-logo' className='social'/></a>
            <a href="/" className={"instagram"}>  <img src={instagram} alt='instagram-logo' className='social'/></a>
            <a href="/" className={"twitter"}>  <img src={twitter} alt='twitter-logo' className='social'/></a>
            <a href="/" className={"you_tube"}>  <img src={youtube} alt='youtube-logo' className='social'/></a>
          </div>
          <div className="condition">
            <a href="/">Conditions of use</a>
            <a href="/">Privacy &amp; Policy</a>
            <a href="/">Press Room</a>
          </div>
          <h4> &#169; 2023 MovieBox by Olaoluwa Emmanuel</h4>
        </footer>
      </div>
    </Router>
  );
}

export default App;
