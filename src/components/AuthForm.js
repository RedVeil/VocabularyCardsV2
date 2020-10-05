import React, { useState } from 'react'
import { useSpring, animated as a } from 'react-spring'
import { useForm } from "react-hook-form";


export default function AuthForm(props) {
  const [correct, setCorrect] = useState(false);
  const [flipped, set] = useState(false);
  const { register, handleSubmit } = useForm();
  const { transform, opacity } = useSpring({
    opacity: flipped && correct ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped && correct ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });

  const onSubmit = (data) => {
    console.log(data)
    if (data.signup){
      set(state => !state);
      setCorrect(state => !state);
      props.registerUser(data.name.trim().toLowerCase(), data.email.trim().toLowerCase());
    } else {
      if (props.checkUser(data.name.trim().toLowerCase(), data.email.trim().toLowerCase())) {
        set(state => !state);
        setCorrect(state => !state);
      } else {
        set(state => !state);
      }
    };
  };

  return (
    <div>
      <a.div 
        className="c front" 
        style={{opacity: opacity.interpolate(o => 1 - o), 
                transform, 
                background: flipped && correct ? "lightgreen" : "rgb(252, 251, 245)"}}
      >
        {flipped && !correct ? <div className="alert error">I couldnt find you</div> : ""}
        <div className="translationForm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input 
              className="textInput" 
              name="name" 
              ref={register({ required: true })}
              placeholder="An app needs a name..." 
              onTouched={window.scrollTo(0,0)}
              />
            <input 
              className="textInput" 
              name="email" 
              ref={register({ required: true })} 
              placeholder="...and a mail" 
              onTouched={window.scrollTo(0,0)}
              />
            <label className="signup-label">
              <input
                className="checkbox" 
                type="checkbox" 
                name="signup" 
                ref={register}/>
              <span className="checkbox-custom"/>
              Sign Up
            </label>
            <input id="submitButton" type="submit" value="Login"/>
          </form>
        </div>
      </a.div>
    </div>
  );
};