import React, { useEffect, useState } from "react";
import axios from "axios";
import Youtube from "react-youtube";
import { useParams } from "react-router-dom";

function MovieDetails() {
  const MOVIE_API = "https://api.themoviedb.org/3/";
  const API_KEY = "aa5c677e096736a95b57c8d27c0075e1";

  const [trailer, setTrailer] = useState(null);
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
    <div className="movie-details">
      <h1 data-testid="movie-title">{movie.title}</h1>
      <p data-testid="movie-release-date">Release Date: {movie.release_date}</p>
      <p data-testid="movie-runtime">Runtime: {movie.runtime} minutes</p>
      <p data-testid="movie-overview">{movie.overview}</p>
      <p data-testid="movie-director">Director: {movie.director}</p>
      <p data-testid="movie-stars">Stars: {movie.stars}</p>
      <p data-testid="movie-genre">Genre: {movie.genres ? movie.genres.join(", ") : ''}</p>

      {trailer ? (
        <div className="trailer">
          <Youtube
            videoId={trailer.key}
            className={"youtube"}
            containerClassName={"youtube-container"}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                autoplay: 0,
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
          <button className={"button close-video"}>Close Trailer</button>
        </div>
      ) : (
        <p>Sorry, no trailer available.</p>
      )}
    </div>
  );
}

export default MovieDetails;
