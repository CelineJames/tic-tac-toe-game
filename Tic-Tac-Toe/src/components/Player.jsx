import {useState} from 'react'

export default function Player({initialName, symbol, isActive, onChangeName}) {

    const [playerName, setPlayerName] = useState(initialName)
    // const [playerSymbol, setPlayerSymbol] = useState(symbol)
   const [isEditing, setisEditing] = useState(false)

   function handleEditClick() {
       setisEditing(prev => !prev)
       if (isEditing) {
       onChangeName(symbol, playerName)
       }
   }

   function handleChange () {
         setPlayerName(event.target.value);
   }

   let editablePlayerName = <span className="player-name">{playerName}</span>;
    let btnCaption = 'Edit';
   
   if (isEditing) {
         editablePlayerName = <input type="text"  value="" required onChange={handleChange} />;
            btnCaption = 'Save';
    }

    return (
        
            <li className={isActive ? 'active' : ''}>
          <span className="player">
            {editablePlayerName}
             <span className="player-symbol">{symbol}</span>
          </span>
          <button onClick={handleEditClick}>{btnCaption}</button>
        </li>
         
        
    )  
}