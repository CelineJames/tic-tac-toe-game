import './StartScreen.css';

const StartScreen = ({ onSelectMode, soundOn, playClick }) => {
  const handleClick = (mode) => {
    // soundOn();
    // playClick();
    onSelectMode(mode);
  };

  if(soundOn){
    playClick
  }



  return (
    <div className="start-screen"> 
      <h1 className="title">Tic Tac Toe</h1>
      <p className="subtitle">Choose a game mode:</p>

      <div className="buttons">
        <button className="btn blue" onClick={() => handleClick('computer')}>
          Play with Computer 💻
        </button>
        <button className="btn green" onClick={() => handleClick('player')}>
          Player to Player 👥
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
