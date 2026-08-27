import React, { useState, useRef, useEffect } from 'react';
import '../styles/VideoModal.css';

const VideoModal = ({ movie, onClose }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState(0);
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const controlsTimeoutRef = useRef(null);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (movie) {
      if (movie.target_episode_index !== undefined) {
        setSelectedEpisodeIndex(movie.target_episode_index);
      } else {
        setSelectedEpisodeIndex(0);
      }
      setShowEpisodeList(false);
      
      const checkWatchlist = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/watchlist/1`);
          const data = await res.json();
          const isTVShowCheck = movie.episodes && movie.episodes.length > 0;
          const isSaved = data.some(item => 
            isTVShowCheck 
              ? item.id === (movie.tv_show_id || movie.id) && item.type === "tv_show" 
              : item.id === (movie.movie_id || movie.id) && item.type === "movie"
          );
          setIsInWatchlist(isSaved);
        } catch (err) {
          console.error("Gagal mengecek watchlist", err);
        }
      };
      checkWatchlist();
    }
  }, [movie]);

  if (!movie) return null;

  const isTVShow = movie && movie.episodes && movie.episodes.length > 0;
  const currentEpisode = isTVShow ? movie.episodes[selectedEpisodeIndex] : null;
  const currentVideoUrl = isTVShow ? currentEpisode?.video_url : movie.video_url;
  const currentTitle = isTVShow ? `${movie.title} - Eps ${currentEpisode?.episode_number}: ${currentEpisode?.title}` : movie.title;

  const saveProgress = () => {
    if (!videoRef.current || !movie) return;
    const curr = Math.floor(videoRef.current.currentTime);
    const dur = Math.floor(videoRef.current.duration || 0);
    if (curr < 2 || dur <= 0) return;

    const payload = {
      movie_id: isTVShow ? null : (movie.movie_id || movie.id),
      tv_show_id: isTVShow ? (movie.tv_show_id || movie.id) : null,
      episode_id: isTVShow ? currentEpisode?.id : null,
      progress_seconds: curr,
      total_seconds: dur,
      user_id: 1
    };

    fetch(`${import.meta.env.VITE_API_URL}/api/history/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(err => console.log("Gagal simpan progres:", err));
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        saveProgress();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleWatchlist = async () => {
    const payload = {
      user_id: 1, 
      movie_id: isTVShow ? null : (movie.movie_id || movie.id),
      tv_show_id: isTVShow ? (movie.tv_show_id || movie.id) : null
    };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/watchlist/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setIsInWatchlist(data.status === "added");
    } catch (err) {
      console.log("Gagal memodifikasi My List", err);
    }
  };

  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
      if (Math.floor(videoRef.current.currentTime) > 0 && Math.floor(videoRef.current.currentTime) % 5 === 0) {
        saveProgress();
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      if (movie && movie.progress_seconds > 0) {
        videoRef.current.currentTime = movie.progress_seconds;
        setCurrentTime(movie.progress_seconds);
      }
    }
  };

  const handleSeek = (e) => {
    const seekTime = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
      setVolume(newVol);
      setIsMuted(newVol === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => console.log(err));
      setIsFullscreen(false);
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    const minStr = minutes < 10 && hours > 0 ? `0${minutes}` : minutes;
    const secStr = seconds < 10 ? `0${seconds}` : seconds;

    if (hours > 0) {
      return `${hours}:${minStr}:${secStr}`;
    }
    return `${minStr}:${secStr}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className="netflix-player-container" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={currentVideoUrl}
        className="netflix-video-element"
        autoPlay
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div 
        className={`netflix-controls-overlay ${showControls ? "show" : "hide"}`}
        onClick={togglePlay}
      >
        <div className="netflix-top-bar" onClick={(e) => e.stopPropagation()}>
          <button className="netflix-back-btn" onClick={() => { saveProgress(); onClose(); }}>
            <span className="icon-arrow">←</span>
          </button>
          <button 
            className="netflix-flag-btn" 
            title="My List" 
            onClick={toggleWatchlist}
            style={{ marginLeft: "15px", fontSize: "1.5rem", fontWeight: "bold" }}
          >
            {isInWatchlist ? "✓" : "+"}
          </button>
          <button className="netflix-flag-btn" title="Report issue">
            ⚑
          </button>
        </div>

        <div className="netflix-bottom-bar" onClick={(e) => e.stopPropagation()}>
          <div className="netflix-progress-container">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="netflix-progress-slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progressPercent}%, #555 ${progressPercent}%, #555 100%)`
              }}
            />
            <span className="netflix-time-text">{formatTime(duration - currentTime)}</span>
          </div>

          <div className="netflix-controls-row">
            <div className="controls-left">
              <button className="control-btn" onClick={togglePlay}>
                {isPlaying ? "❚❚" : "▶"}
              </button>
              
              <button className="control-btn skip-btn" onClick={() => skip(-10)} title="Rewind 10s">
                <span className="skip-icon">↺</span><span className="skip-text">10</span>
              </button>
              
              <button className="control-btn skip-btn" onClick={() => skip(10)} title="Forward 10s">
                <span className="skip-icon">↻</span><span className="skip-text">10</span>
              </button>

              <div className="volume-container">
                <button className="control-btn" onClick={toggleMute}>
                  {isMuted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>
            </div>

            <div className="controls-center">
              <span className="movie-title-display">{currentTitle}</span>
            </div>

            <div className="controls-right">
              {isTVShow && (
                <button 
                  className="ep-btn-badge" 
                  onClick={() => setShowEpisodeList(!showEpisodeList)}
                  title="Pilih Episode"
                >
                  📺 Eps {selectedEpisodeIndex + 1}
                </button>
              )}
              <button className="control-btn" title="Subtitles / Audio">💬</button>
              <button className="control-btn" title="Speed">⏲</button>
              <button className="control-btn" onClick={toggleFullscreen} title="Fullscreen">
                {isFullscreen ? "🗗" : "🖵"}
              </button>
            </div>
          </div>
        </div>

        {isTVShow && showEpisodeList && (
          <div className="sanflix-episode-list-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Daftar Episode ({movie.episodes.length})</h3>
              <button className="close-drawer-btn" onClick={() => setShowEpisodeList(false)}>✕</button>
            </div>
            <div className="drawer-content">
              {movie.episodes.map((ep, idx) => (
                <div 
                  key={ep.id} 
                  className={`drawer-episode-item ${idx === selectedEpisodeIndex ? "active" : ""}`}
                  onClick={() => {
                    setSelectedEpisodeIndex(idx);
                    setShowEpisodeList(false);
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                      videoRef.current.play();
                      setIsPlaying(true);
                    }
                  }}
                >
                  <img src={ep.thumbnail_url} alt={ep.title} className="ep-thumb" />
                  <div className="ep-info">
                    <strong>Eps {ep.episode_number}: {ep.title}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VideoModal;