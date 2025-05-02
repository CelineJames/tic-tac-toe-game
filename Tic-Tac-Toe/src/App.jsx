import { useState, useEffect, useRef } from 'react';
import StartScreen from './components/start-screen/StartScreen';
import PlayerVsPlayer from './components/PlayervsPlayer'; 
import PlayervsComputer from './components/PlayervsComputer'
import { FaVolumeUp, FaVolumeMute, FaMusic, FaRegTimesCircle } from 'react-icons/fa';

function App() {
  const bgMusicRef = useRef(null);
  const [musicOn, setMusicOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [mode, setMode] = useState(null);

  // hook to handle background music
  useEffect(() => {
    const bgMusic = new Audio('/game-sound.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.4;
    bgMusicRef.current = bgMusic;

    if (musicOn) {
      bgMusic.play().catch(() => console.log("Autoplay blocked."));
    }

    return () => bgMusic.pause();
  }, [musicOn]);

  // Function to play click sound
  const playClick = () => {
    if (soundOn) {
      new Audio('/game-start-317318.mp3').play();
    }
  };

  // Toggle music on/off
  const toggleMusic = () => {
    if (musicOn) {
      bgMusicRef.current.pause();
    } else {
      bgMusicRef.current.play();
    }
    setMusicOn(!musicOn);
  };

  // Toggle sound on/off
  const toggleSound = () => setSoundOn(!soundOn);

  return (
    <>
      {/* Controls for music and sound */}
      <div className="controls">
        <button onClick={toggleMusic} title={musicOn ? "Turn off music" : "Turn on music"}>
          {musicOn ? <FaMusic /> : <FaRegTimesCircle />}
        </button>
        <button onClick={toggleSound} title={soundOn ? "Turn off sound" : "Turn on sound"}>
          {soundOn ? <FaVolumeUp /> : <FaVolumeMute />}
        </button>
      </div>

      {/* Conditional rendering based on the selected mode */}
      {!mode ? (
        <StartScreen
          onSelectMode={setMode}
          // toggleMusic={toggleMusic}
          // toggleSound={toggleSound}
          // musicOn={musicOn}
          soundOn={soundOn}
          playClick={playClick}
        />
      ) : mode === 'computer' ? (
        <PlayervsComputer playClick={playClick} soundOn={soundOn}/>
      ) : (
        <PlayerVsPlayer playClick={playClick} soundOn={soundOn} />
      )}
    </>
  );
}

export default App;
