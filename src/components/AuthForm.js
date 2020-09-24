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
    if (data.register){
      //Add user to db
      set(state => !state);
      setCorrect(state => !state);
      props.registerUser(data.name, data.email);
    } else {
      set(state => !state);
      if (props.checkUser(data.name, data.email)) {
        setCorrect(state => !state);
      };
    };
  };

  return (
    <div>
      <a.div className="c front" style={{ 
                                opacity: opacity.interpolate(o => 1 - o), 
                                transform, 
                                background: flipped && correct ? "lightgreen" : "rgb(252, 251, 245)"}}>
        {flipped && !correct ? <p id="errorMessage">I couldnt find you</p> : ""}
        <div className="translationForm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input className="textInput" name="name" ref={register({ required: true })} placeholder="An app needs a name..." />
            <input className="textInput" name="email" ref={register({ required: true })} placeholder="...and a mail" />
            <label htmlFor="register" id="registerLabel">Register</label>
            <input className="checkbox" type="checkbox" name="register"/>
            <input id="submitButton" type="submit" value="Login"/>
          </form>
        </div>
      </a.div>
    </div>
  );
};