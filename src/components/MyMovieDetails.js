import React from 'react';
import { Link } from 'react-router-dom';

const MovieDetails = ({ movie, trailer, playing, setPlaying }) => {
    return (
        <div className="center-max-size">
            <div className="poster-content">
                {playing ?
                    <>
                        {/* YouTube video */}
                        <div className="youtube-container">
                            <iframe
                                src={`https://www.youtube.com/embed/${trailer.key}`}
                                title={movie.title}
                                allowFullScreen
                            ></iframe>
                        </div>
                        <button onClick={() => setPlaying(false)} className={"button close-video"}>Close</button>
                    </> :
                    <div className="center-max-size">
                        <div className="poster-content">
                            {trailer ?
                                <button className={"button play-video"} onClick={() => setPlaying(true)} type="button">Play Trailer</button>
                                : 'Sorry, no trailer available'}
                            <h1>{movie.title}</h1>
                            <p>{movie.overview}</p>
                        </div>
                    </div>
                }
                <Link to="/" className={"button go-back"}>Go Back to Homepage</Link>
            </div>
        </div>
    );
};

export default MovieDetails;