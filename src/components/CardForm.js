import React, { useState } from 'react'
import { X, Trash } from 'react-feather';
import { useForm } from "react-hook-form";

export default function CardForm(props) {
  const { register, handleSubmit, reset} = useForm();
  const [added, add] = useState(false);

  const onSubmit = (data) => {
    if(props.original){
      console.log("updating")
      props.updateCard([data.original.trim(), data.translation.trim()])
    } else {
      props.addCard([data.original.trim(), data.translation.trim()]);
      reset();
    }
    add(true);
    setTimeout(() => {add(false)}, 1000);
  };
  console.log(props.index)
  return (
    <div className="newCardContainer" style={props.style}>
      {added && !props.original ? <div className="alert">added</div> : ""}
      <div className="newCardForm">
        <button id="hideFormButton" onClick={() => props.closeCardForm(false)} ><X className="buttonIcon" color="darkgrey" /></button>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input className="textInput" name="original" ref={register({ required: true })} placeholder="Original" defaultValue={props.original}/>
          <input className="textInput" name="translation" ref={register({ required: true })} placeholder="Translation" defaultValue={props.translation}/>
          <input id="submitButton" type="submit" value="Send"/>
        </form>
        {props.original && 
        <button className="formButton add"onClick={() => props.deleteCard(props.index)}>
          <Trash className="buttonIcon" color="white" />
        </button>}
        </div>
    </div>
  )
};