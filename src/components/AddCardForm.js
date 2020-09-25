import React from 'react'
import { X } from 'react-feather';
import { useForm } from "react-hook-form";

export default function AddCardForm(props) {
  const { register, handleSubmit, reset} = useForm();

  const onSubmit = (data) => {
    props.addCard([data.original.trim(), data.translation.trim()]);
    reset()
  };
    
  return (
    <div className="newCardContainer" style={props.style}>
      <div className="newCardForm">
        <button id="hideFormButton" onClick={() => props.closeAddCardForm()} ><X className="buttonIcon" color="darkgrey" /></button>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input className="textInput" name="original" ref={register({ required: true })} placeholder="Original"/>
          <input className="textInput" name="translation" ref={register({ required: true })} placeholder="Translation"/>
          <input id="submitButton" type="submit" value="Send"/>
        </form>
        </div>
    </div>
  )
};