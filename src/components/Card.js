import React, { useState } from 'react'
import { useSpring, animated as a } from 'react-spring'
import { Plus,  Edit2 } from 'react-feather'; 
import { useForm } from "react-hook-form";

export default function Card(props) {
  const [correct, setCorrect] = useState(false)
  const { register, handleSubmit} = useForm();
  
  const [flipped, set] = useState(false)
  const { transform, opacity } = useSpring({
    opacity: flipped ? 0 : 1,
    transform: `rotateY(${flipped ? 0 : 180}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  })

  const onSubmit = (data) => {
    console.log(props.back.filter(word => word.toLowerCase() === data.inputTranslation.toLowerCase())); 
    setCorrect(props.back[0].toLowerCase() === data.inputTranslation.toLowerCase())
    set(state => !state)
  }

  const backClick = () => {
    if(flipped){
      props.cardClick(correct)
    }
  };
    
  return (
    <div style={{display: !props.formVisibility ? "block" : "none"}}>
      {!flipped && 
      <div className="formContainer">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input 
            className="textInput" 
            name="inputTranslation" 
            ref={register({ required: true })} 
            onTouched={window.scrollTo(0,0)} 
            placeholder="Translation..."
            autoComplete="off"
          />
        </form>
      </div>}
      <button 
        className="button primary add" 
        onClick={() => props.showHideForm(false)} 
        style={{display: props.user && !props.formVisibility ? "block" : "none"}}
      >
        <Plus className="buttonIcon" color="white" />
      </button>
      <button 
        className="button primary edit" 
        onClick={() => props.showHideForm(true)} 
        style={{display: props.user && !props.formVisibility ? "block" : "none"}}
      >
        <Edit2 className="buttonIcon" color="white" />
      </button>
      <a.div onClick={backClick} style={props.transitionStyle}>
        <a.div 
          className="card front" 
          style={{ opacity, transform: transform.interpolate(t => `${t} rotateY(180deg)`) }}
        >
          <p className="text">{props.front.title()}</p>
        </a.div>
        <a.div 
          className="card back" 
          style={{ background: correct ? "lightgreen" : "lightcoral", opacity: opacity.interpolate(o => 1 - o), transform }}
        > 
          <div className="text">
            {props.back.map(text => <p>{text}</p>)}
          </div>
        </a.div>
      </a.div>
    </div>
  )
};