import react, { useState } from "react"
import {planeWordList} from "../WordList/planewordlist"

const Test =()=>{ 
const[currWord,setCurrWord]= useState(0)
const[currWordStatus,setCurrWordStatus] = useState(false)



const handlekeyUp =(event)=>{
    if(event.key == ' ') {
        setCurrWord(currWord + 1)
    }
}

  const wordListArray = planeWordList.split(" ")

const handleConrrection =(e)=>{
    let currIndex = e.length
    if(wordListArray[currWord]?.slice(0,currIndex) !== e){
        setCurrWordStatus(true)
    }
    else{
        setCurrWordStatus(false)
    }
  }
 return(
<>
  <h1 style={{color: currWordStatus ? "red" : "black"}}>{wordListArray[currWord]}</h1>
  <input type="text" onChange={(e)=>handleConrrection(e.target.value)} onKeyUp={handlekeyUp}/>
</>
 )   
}

export default Test