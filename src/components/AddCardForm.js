import React, { useState } from 'react'
import { X } from 'react-feather';
import { useForm } from "react-hook-form";

export default function AddCardForm(props) {
  const { register, handleSubmit, reset} = useForm();
  const [added, add] = useState(false);

  const onSubmit = (data) => {
    props.addCard([data.original.trim(), data.translation.trim()]);
    add(true);
    reset();
    setTimeout(() => {add(false)}, 1000);
  };
    
  return (
    <div className="newCardContainer" style={props.style}>
      {added && <div className="alert">added</div>}
      <div className="newCardForm">
        <button id="hideFormButton" onClick={() => props.closeAddCardForm()} ><X className="buttonIcon" color="darkgrey" /></button>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input className="textInput" name="original" ref={register({ required: true })} placeholder="Original" value="test"/>
          <input className="textInput" name="translation" ref={register({ required: true })} placeholder="Translation" value=""/>
          <input id="submitButton" type="submit" value="Send"/>
        </form>
        </div>
    </div>
  )
};