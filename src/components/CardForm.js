import React, { useState } from 'react'
import { X, Plus, Trash } from 'react-feather';
import { useForm } from "react-hook-form";
import classNames from 'classnames';

export default function CardForm(props) {
  const { register, handleSubmit, reset } = useForm();
  const [added, add] = useState(false);

  const onSubmit = (data) => {
    if (props.original) {
      props.updateCard([data.original.trim(), data.translation.trim()])
      props.closeCardForm(false)
    } else {
      props.addCard([data.original.trim(), data.translation.trim()]);
      add(true);
      setTimeout(() => { add(false) }, 1000);
      reset();
    }

  };

  const handleDelete = () => {
    props.deleteCard()
    props.closeCardForm(false)
  }

  return (
    <div className={classNames("card front backgroundTransition", added && "added")} style={props.style}>
      <div className="correctContent up">
        <div className="correctContent left">
          {props.original &&
            <button className="button primary edit" onClick={handleDelete}>
              <Trash className="buttonIcon" color="#2C5167" />
            </button>}
          <button
            className="button primary add"
            type="submit"
            form="updateCardForm">
            <Plus className="buttonIcon" color="#2C5167" />
          </button>
        </div>
        <button
          className={classNames({"button hideForm backgroundTransition": true, "added": added})}
          onClick={() => props.closeCardForm(false)} >
          <X className="buttonIcon" color="darkgrey" />
        </button>
        <div className="formContainer">
          <form id="updateCardForm" onSubmit={handleSubmit(onSubmit)}>
            <input
              className={classNames("textInput backgroundTransition", added && "addedInput")}
              name="original"
              ref={register({ required: true })}
              placeholder="Original"
              defaultValue={props.original}
              onTouched={window.scrollTo(0, 0)}
              autoComplete="off"
            />
            <input
              className={classNames("textInput backgroundTransition", added && "addedInput")}
              name="translation"
              ref={register({ required: true })}
              placeholder="Translation"
              defaultValue={props.translation}
              onTouched={window.scrollTo(0, 0)}
              autoComplete="off"
            />
          </form>
        </div>
      </div>
    </div>
  )
};