import React, { useState } from 'react'
import { useSpring, animated as a } from 'react-spring'
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
    setCorrect(props.back.toLowerCase() === data.inputTranslation.toLowerCase())
    set(state => !state)
  }

  const backClick = () => {
    if(flipped){
      props.cardClick(correct, props.cardKey)
    }
  };
    
  return (
    <div>
      {!flipped && 
      <div className="translationForm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input className="textInput" name="inputTranslation" ref={register({ required: true })} placeholder="Translation..." autoComplete={false}/>
        </form>
        </div>}
    <a.div onClick={backClick} style={props.transitionStyle}>
      <a.div className="c front" style={{ opacity, transform: transform.interpolate(t => `${t} rotateY(180deg)`) }}>
        <p className="text">{props.front}</p>
        
      </a.div>
      <a.div className="c back" style={{ background: correct ? "lightgreen" : "lightcoral", opacity: opacity.interpolate(o => 1 - o), transform }}>
        <p className="text">{props.back}</p>
      </a.div>
    </a.div>
  </div>
  )
};