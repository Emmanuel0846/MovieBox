import React from 'react';
import Movie from './Movie';
import MovieDetails from './MovieDetails';

const HomePage = ({ movies, selectMovie, movie, playing, trailer, setPlaying }) => {
    const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280";

    const renderMovies = () =>
        movies.map((movie) => (
            <Movie selectMovie={selectMovie} key={movie.id} movie={movie} />
        ));

    return (
        <div>
            {movies.length ? (
                <main>
                    {movie ? (
                        <div
                            className="poster"
                            style={{
                                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${BACKDROP_PATH}${movie.backdrop_path})`,
                            }}
                        >
                            {playing ? (
                                <div>
                                    {/* YouTube video */}
                                    {trailer ? (
                                        <div className="youtube-container">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${trailer.key}`}
                                                title={movie.title}
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    ) : (
                                        'Sorry, no trailer available'
                                    )}
                                    <button
                                        onClick={() => setPlaying(false)}
                                        className={"button close-video"}
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <div className="center-max-size">
                                    <div className="poster-content">
                                        {trailer ? (
                                            <button
                                                className={"button play-video"}
                                                onClick={() => setPlaying(true)}
                                                type="button"
                                            >
                                                Play Trailer
                                            </button>
                                        ) : (
                                            'Sorry, no trailer available'
                                        )}
                                        <h1>{movie.title}</h1>
                                        <p>{movie.overview}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}

                    <div className={"center-max-size container"}>
                        {renderMovies()}
                    </div>
                </main>
            ) : (
                'Sorry, no movies found'
            )}

            {movie ? (
                <MovieDetails
                    movie={movie}
                    trailer={trailer}
                    playing={playing}
                    setPlaying={setPlaying}
                />
            ) : null}
        </div>
    );
};

export default HomePage;
