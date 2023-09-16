import React from 'react';
import { Link } from 'react-router-dom';
import love from '../assets/Favorite.svg';
import imdb from '../assets/imdb.svg';
import tomato from '../assets/tomato.svg';

const Movie = ({ movie }) => {
  const IMAGE_PATH = "https://image.tmdb.org/t/p/w500";

  return (
    <Link to={`/movies/${movie.id}`} className={"movie"}>
      <div className="movie-title">
        {movie.poster_path && (
          <img src={IMAGE_PATH + movie.poster_path} alt={movie.title} />
        )}
        <div className={"flex between movie-infos"}>
          <h5 className={"movie-title"}>{movie.title}</h5>
          <img src={love} alt='love-logo' className='love' />
          <p data-testid="movie-release-date" className="movie-release-date">{movie.release_date}</p>
          <div className='card'>
            <img src={imdb} alt='imdb-logo' className='imdb-card' />
            {movie.vote_average ? <span className={"movie-voting-card"}>{Math.round(movie.vote_average * 10)}/100</span> : null}

            <img src={tomato} alt='tomato-logo' className='tomato-card' />
            {movie.vote_average ? <span className={"tomato-voting-card"}>{Math.round(movie.vote_average * 10)+5}%</span> : null}
          </div>
          {movie.genres ? movie.genres.join(", ") : ''}
        </div>
      </div>
    </Link>
  );
};

export default Movie;
