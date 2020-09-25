import React from 'react'
import { X } from 'react-feather';
import { useForm } from "react-hook-form";
import { useSpring, animated as a} from 'react-spring'

export default function AddCardForm(props) {
  const { register, handleSubmit, reset} = useForm();
  const expandStyle = useSpring({
    from: { left: '0%', top: '0%', width: '100%', height: '100%'},
    to: { left: '0%', top: '0%', width: '0%', height: '0%'}});

  const onSubmit = (data) => {
    props.addCard([data.original.trim(), data.translation.trim()]);
    reset()
  };

  const closeForm = () => {
    props.closeAddCardForm()
  }
    
  return (
    <a.div className="newCardContainer" style={{...props.style, ...expandStyle}}>
      <div className="newCardForm">
        <button id="hideFormButton" onClick={() => closeForm} ><X className="buttonIcon" color="darkgrey" /></button>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input className="textInput" name="original" ref={register({ required: true })} placeholder="Original"/>
          <input className="textInput" name="translation" ref={register({ required: true })} placeholder="Translation"/>
          <input id="submitButton" type="submit" value="Send"/>
        </form>
        </div>
    </a.div>
  )
};