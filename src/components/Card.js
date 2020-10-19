import React, { useState } from 'react'
import { useSpring, animated as a } from 'react-spring'
import { Plus, Edit2 } from 'react-feather';
import { useForm } from "react-hook-form";

export default function Card(props) {
  const [correct, setCorrect] = useState(false)
  const { register, handleSubmit } = useForm();

  const [flipped, set] = useState(false)
  const { transform, opacity } = useSpring({
    opacity: flipped ? 0 : 1,
    transform: `rotateY(${flipped ? 0 : 180}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  })

  const onSubmit = (data) => {
    setCorrect(props.back.filter(word => word.toLowerCase() === data.inputTranslation.toLowerCase()).length > 0)
    set(state => !state)
  }

  const backClick = () => {
    if (flipped) {
      props.cardClick(correct)
    }
  };

  return (
    <div style={{ display: !props.formVisibility ? "block" : "none" }}>
      {!flipped &&
        <div className="formContainer">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              className="textInput"
              name="inputTranslation"
              ref={register({ required: true })}
              onTouched={window.scrollTo(0, 0)}
              placeholder={props.front}
              autoComplete="off"
            />
          </form>
          <div className="text">
            <p>{props.front}</p>
          </div>
        </div>}
      <button
        className="button primary add"
        onClick={() => props.showHideForm(false)}
        style={{ display: props.user && !props.formVisibility ? "block" : "none" }}
      >
        <Plus className="buttonIcon" color="#2C5167" />
      </button>
      <button
        className="button primary edit"
        onClick={() => props.showHideForm(true)}
        style={{ display: props.user && !props.formVisibility ? "block" : "none" }}
      >
        <Edit2 className="buttonIcon" color="#2C5167" />
      </button>
      <a.div onClick={backClick} style={props.transitionStyle}>
        <a.div
          className="card front"
          style={{ opacity, transform: transform.interpolate(t => `${t} rotateY(180deg)`) }}
        >
        </a.div>
        <a.div
          className="card back"
          style={{ background: correct ? "#71C974" : "#BF5448", opacity: opacity.interpolate(o => 1 - o), transform }}
        >
          <div className="text solution">
            {props.back.map(text => <p>{text}</p>)}
          </div>
        </a.div>
      </a.div>
    </div>
  )
};