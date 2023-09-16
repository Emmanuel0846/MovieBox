import React, { useEffect, useState } from "react";
import axios from "axios";
import Youtube from "react-youtube";
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import tomato from '../assets/tomato.svg';
import logo from '../assets/logpng.png';
import home from '../assets/Home.svg';
import movies from '../assets/Movie Projector.svg';
import tv from '../assets/TV Show.svg';
import calendar from '../assets/Calendar.svg';
import logout from '../assets/Logout.svg';
import poster from '../assets/Posters.jpg';
import play from '../assets/Play.svg';

function MovieDetails() {
  const MOVIE_API = "https://api.themoviedb.org/3/";
  const API_KEY = "aa5c677e096736a95b57c8d27c0075e1";
  const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280";

  const [trailer, setTrailer] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [movie, setMovie] = useState({});
  const { id } = useParams();

  useEffect(() => {
    fetchMovieDetails(id);
  }, [id]);

  const fetchMovieDetails = async (movieId) => {
    try {
      const { data } = await axios.get(`${MOVIE_API}movie/${movieId}`, {
        params: {
          api_key: API_KEY,
          append_to_response: "videos,credits",
        },
      });

      if (data.videos && data.videos.results) {
        const trailer = data.videos.results.find(
          (vid) => vid.name === "Official Trailer"
        );
        setTrailer(trailer ? trailer : data.videos.results[0]);
      }

      const director = getDirector(data.credits);
      const stars = getStars(data.credits);
      const genres = data.genres.map((genre) => genre.name);

      setMovie({
        ...data,
        director,
        stars,
        genres,
      });
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const getDirector = (credits) => {
    const director = credits.crew.find((member) => member.job === "Director");
    return director ? director.name : "Unknown";
  };

  const getStars = (credits) => {
    const stars = credits.cast.slice(0, 5);
    return stars.map((star) => star.name).join(", ");
  };

  return (
    <main className="container-details">
      <div className="sidebar-details">
        <Link to="/">
          <div className="logo-details">
            <img src={logo} alt='brand_details' className='brand_details' />
            <div className="moviebox details">MovieBox</div>
          </div>
        </Link>

        <Link to="/">
          <div className="logo-details pink">
            <img src={home} alt='brand_details' className='brand_details details' />
            <div className="moviebox">Home</div>
          </div>
        </Link>

        <Link to="/">
          <div className="logo-details pink">
            <img src={movies} alt='brand_details' className='brand_details details' />
            <div className="moviebox">Movies</div>
          </div>
        </Link>

        <Link to="/">
          <div className="logo-details pink">
            <img src={tv} alt='brand_details' className='brand_details details' />
            <div className="moviebox">TV Series</div>
          </div>
        </Link>

        <Link to="/">
          <div className="logo-details pink">
            <img src={calendar} alt='brand_details' className='brand_details details' />
            <div className="moviebox">Upcoming</div>
          </div>
        </Link>
        
        
        <div className="game-details">
          <h4 className="play-game">Play movie quizes and earn free tickets</h4>
          <h5>50k people are playing now</h5>
          <a className="start-playing" href="/">Start playing</a>
        </div>
        <div className="logo-details pink">
          <img src={logout} alt='brand_details' className='brand_details details' />
          <div className="moviebox">Log out</div>
        </div>
      </div>

      <div>
          {movie ?
            <div className="poster-details"
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
                      {trailer ?
                      <button className={"button play-btn"} onClick={() => setPlaying(true)}
                        type="button"> <span><img src={play} alt='play-logo' className='play-trailer' /></span> <br/> <strong>WATCH
                        TRAILER</strong> </button>
                      : 'Sorry, no trailer available'}
                </div>
              }
            </div>
          : null}

          <div className="content-details">
            <div className="flex-flex">
              <h3>{movie.title}</h3> <h3>&#183;</h3>
              <h3 data-testid="movie-release-date">{movie.release_date}</h3> <h3>&#183;</h3>
              <h3 data-testid="movie-runtime">{movie.runtime} minutes</h3><h3>&#183;</h3>
              <h3 data-testid="movie-genre">{movie.genres ? movie.genres.join(", ") : ''}</h3>
              <img src={tomato} alt='tomato-logo' className='tomato-details' />
              {movie.vote_average ? <span className={"tomato-voting"}>{Math.round(movie.vote_average * 10)+5}%</span> : null}
            </div>
            <div className="flex2">
              <div className="column1">
                <p>{movie.overview}</p>
                <p>Director:<span className="red-pink">{movie.director}</span></p>
                <p data-testid="movie-stars">Stars:<span className="red-pink">{movie.stars}</span></p>

                <div className="award">
                  {movie.vote_average ? <span className={"top-rating"}>Top rated movie #{Math.round(movie.vote_average * 10)+5}</span> : null}
                  <p className="nomination">Award {Math.round(Math.random()*10)+10} nominations</p>
                </div>
              </div> 

              <div className="column2">
                <p className="showtime">See Showtimes</p>
                <p className="watch-option">More Watch Options</p>
                <div className="upcoming-container">
                  <img src={poster} alt='poster-upcoming' className='upcoming-movies' />
                </div>
              </div>   
            </div>          
          </div>
      </div>
      
    </main>
  );
}

export default MovieDetails;
