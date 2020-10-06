import React, { useState } from 'react'
import { X, Plus, Trash } from 'react-feather';
import { useForm } from "react-hook-form";

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
    <div className="card" style={props.style}>
      {added && <div className="alert">added</div>}
      {props.original &&
        <button className="button primary edit" onClick={handleDelete}>
          <Trash className="buttonIcon" color="white" />
        </button>}
      <button
        className="button primary add"
        type="submit"
        form="updateCardForm">
        <Plus className="buttonIcon" color="white" />
      </button>
      <button
        className="button hideForm"
        onClick={() => props.closeCardForm(false)} >
        <X className="buttonIcon" color="darkgrey" />
      </button>
      <div className="formContainer">
        <form id="updateCardForm" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="textInput"
            name="original"
            ref={register({ required: true })}
            placeholder="Original"
            defaultValue={props.original}
            onTouched={window.scrollTo(0, 0)}
            autoComplete="off"
          />
          <input
            className="textInput"
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
  )
};