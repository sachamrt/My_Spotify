import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WebPlayer.css';
import PlayIcon from '@mui/icons-material/PlayCircleSharp';
import PauseIcon from '@mui/icons-material/PauseCircleFilledSharp';
import PreviousIcon from '@mui/icons-material/SkipPreviousSharp';
import NextIcon from '@mui/icons-material/SkipNextSharp';
import DevicesIcon from '@mui/icons-material/DevicesSharp';

function WebPlayer(props) {

    const [is_paused, setPaused] = useState(false);
    const [playbackState, setPlaybackState] = useState([]);
    const [devices, setDevices] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const getDevices = async () => {
        const response = await axios.get('https://api.spotify.com/v1/me/player/devices', {
            headers: {
                Authorization: `Bearer ${props.token}`
            }
        });
        setDevices(response.data.devices);
    }

    const PlayState = async () => {
        try {
            const response = await axios.get('https://api.spotify.com/v1/me/player', {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            });
            console.log(response.data);
            setPlaybackState(response.data);
            setPaused(response.data.is_playing);
        } catch (error) {
            console.error(error);
        };
    }

    const pausePlayback = async () => {
        try {
            const response = await axios.put('https://api.spotify.com/v1/me/player/pause', null, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            });
        } catch (error) {
            console.error(error);
        };
    };

    const playButton = async () => {
        try {
            const response = await axios.put('https://api.spotify.com/v1/me/player/play', null, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            });
        } catch (error) {
            console.error(error);
        };
    };

    const previousTrack = async () => {
        try {
            const response = await axios.post('https://api.spotify.com/v1/me/player/previous', null, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            });
        } catch (error) {
            console.error(error);
        };
    };
    
    const nextTrack = async () => {
        try {
            const response = await axios.post('https://api.spotify.com/v1/me/player/next', null, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            });
        } catch (error) {
            console.error(error);
        };
    };
    
    
    const transferPlayback = async (deviceId) => {
        try {
            const headers = {
                Authorization: `Bearer ${props.token}`
            };
            const params = JSON.stringify({
                device_ids: [deviceId]
            });
            const response = await axios.put('https://api.spotify.com/v1/me/player', params, { headers });
        } catch (error) {
            console.error(error);
        };
    };
    
    const displayDevice = () => {
        if (isOpen === true) {
            setIsOpen(false);
        } else
        setIsOpen(true);
    }
            
    useEffect(() => {
        const refresh = setInterval(() => {
            PlayState();
            getDevices();
        }, 1000);
        return () => clearInterval(refresh);
    }, []);
    
    const renderStatus = () => {
        if (!is_paused) {
            return (
            <PlayIcon className="btn-spotify" onClick={() => { is_paused ? pausePlayback() : playButton() }} >
            </PlayIcon>
            );
        } else {
            return (
                <PauseIcon className="btn-spotify" onClick={() => { is_paused ? pausePlayback() : playButton() }} >
                    PAUSE
                </PauseIcon>
            );
        }
    }
    
    const renderDevices = () => {
        return (
            <div>
                <DevicesIcon onClick={() => { displayDevice() }} className='menu-button'></DevicesIcon>
                {isOpen &&
                    <div className='Menu'>
                        {devices.map((device) => (
                            <button onClick={() => { transferPlayback(device.id) }} className='button'>{device.name}</button>
                        ))}
                    </div>
                }
            </div>
        );
    }

    const renderArtists = () => {
        if (playbackState.item) {
            const artistNames = playbackState.item.artists.map((artist) => artist.name)
            if (artistNames.length > 1) {
                return artistNames.join(", ")
            } else {
                return artistNames[0]
            }
        }
    }
    
    return (
        <>
            <body className='Pages'>
                <div className='container'>
                    <div className="">
                        <img src={playbackState.item ? playbackState.item.album.images[0].url : ""} 
                        alt="" />
                        <div>
                            <div className="now-playing__name">{playbackState.item ? playbackState.item.name : ""}</div>
                            <div className="now-playing__artist">{renderArtists()}</div>
                            <div className="Buttons">
                                <PreviousIcon className="btn-spotify" onClick={() => { previousTrack() }} ></PreviousIcon>
                                {renderStatus()}
                                <NextIcon className="btn-spotify" onClick={() => { nextTrack() }} ></NextIcon>
                            </div>
                            {renderDevices()}
                        </div>
                    </div>
                </div>
            </body>
        </>
    );
}

export default WebPlayer
