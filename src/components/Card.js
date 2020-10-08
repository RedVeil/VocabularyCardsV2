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
          <div className="svgContainer">
            <svg className="svgInput" viewBox="-9803.998 -683.999 293.998 165.999">
              <path id="svgInput" d="M -9803.814453125 -518.0000610351563 L -9803.81640625 -518.0020751953125 C -9803.8203125 -518.0072631835938 -9803.8330078125 -518.0231323242188 -9803.853515625 -518.0494384765625 C -9803.884765625 -518.0880126953125 -9803.9326171875 -518.1488647460938 -9803.998046875 -518.2313232421875 L -9803.998046875 -683.7677612304688 C -9803.8779296875 -683.9200439453125 -9803.814453125 -683.9989013671875 -9803.814453125 -683.9989013671875 C -9803.8037109375 -683.8916015625 -9802.609375 -672.3978271484375 -9800.7529296875 -666.581787109375 C -9795.06640625 -648.7684936523438 -9784.8125 -637.873779296875 -9770.27734375 -634.2003173828125 L -9542 -634.2003173828125 C -9537.6806640625 -634.2003173828125 -9533.490234375 -633.3541870117188 -9529.544921875 -631.6854248046875 C -9525.734375 -630.07373046875 -9522.3125 -627.7662963867188 -9519.373046875 -624.8272094726563 C -9516.435546875 -621.8897094726563 -9514.1279296875 -618.4674682617188 -9512.5146484375 -614.6553955078125 C -9510.845703125 -610.711181640625 -9510 -606.5205078125 -9510 -602.199951171875 L -9510 -599.7991333007813 C -9510 -595.4785766601563 -9510.845703125 -591.2879028320313 -9512.5146484375 -587.3436889648438 C -9514.1279296875 -583.5316772460938 -9516.435546875 -580.1094360351563 -9519.373046875 -577.1719360351563 C -9522.3115234375 -574.2329711914063 -9525.734375 -571.925537109375 -9529.544921875 -570.313720703125 C -9533.490234375 -568.6449584960938 -9537.6806640625 -567.798828125 -9542 -567.798828125 L -9770.27734375 -567.798828125 C -9784.8125 -564.12744140625 -9795.06640625 -553.2327270507813 -9800.7529296875 -535.4172973632813 C -9802.568359375 -529.7323608398438 -9803.7646484375 -518.4788208007813 -9803.814453125 -518.0025634765625 L -9803.814453125 -518.0000610351563 Z">
              </path>
            </svg>
            <svg className="svgShadow" viewBox="0.001 0.001 303 91">
              <path id="svgShadow" d="M 303.001220703125 91.00080871582031 L 302.9992065429688 91.00080871582031 L 302.9992065429688 90.99980926513672 L 293.9906005859375 91.00080871582031 C 293.9967041015625 90.74700164794922 294.0003356933594 90.47815704345703 294.0003356933594 90.20069885253906 L 294.0003356933594 87.80131530761719 C 294.0003356933594 83.48085021972656 293.154296875 79.29004669189453 291.4857177734375 75.34531402587891 C 289.8747863769531 71.53485107421875 287.5677185058594 68.11257934570313 284.6286010742188 65.17350769042969 C 281.6884765625 62.23427200317383 278.2662048339844 59.92688751220703 274.4568481445313 58.31550598144531 C 270.5121765136719 56.64692687988281 266.3213806152344 55.80088806152344 262.0007934570313 55.80088806152344 L 33.72391128540039 55.80088806152344 C 19.18760299682617 52.12700271606445 8.934141159057617 41.23215866088867 3.248102903366089 23.41888999938965 C 1.444910526275635 17.77108192443848 0.238602802157402 6.487658500671387 0.188141256570816 6.010119915008545 L 0.187218189239502 6.00119686126709 L 0.1825643330812454 6.006735324859619 C 0.1752181798219681 6.016619682312012 0.1578335762023926 6.038465976715088 0.1310258805751801 6.072042942047119 C 0.1002951115369797 6.110620021820068 0.05721818655729294 6.164735317230225 0.002602801891043782 6.234235286712646 L 0.0009104943019337952 0.0008891390170902014 L 303.001220703125 0.0008891390170902014 L 303.001220703125 91.00080871582031 Z">
              </path>
            </svg>
            <svg className="svgHideRight">
              <rect id="svgHideRight" rx="0" ry="0" x="0" y="0" width="28" height="178">
              </rect>
            </svg>
            <svg className="svgHideTop">
              <rect id="svgHideTop" rx="0" ry="0" x="0" y="0" width="322" height="24">
              </rect>
            </svg>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              className="textInput"
              name="inputTranslation"
              ref={register({ required: true })}
              onTouched={window.scrollTo(0, 0)}
              placeholder="Translation..."
              autoComplete="off"
            />
          </form>
        </div>}
      <button
        className="button primary add"
        onClick={() => props.showHideForm(false)}
        style={{ display: props.user && !props.formVisibility ? "block" : "none" }}
      >
        <Plus className="buttonIcon" color="white" />
      </button>
      <button
        className="button primary edit"
        onClick={() => props.showHideForm(true)}
        style={{ display: props.user && !props.formVisibility ? "block" : "none" }}
      >
        <Edit2 className="buttonIcon" color="white" />
      </button>
      <a.div onClick={backClick} style={props.transitionStyle}>
        <a.div
          className="card front"
          style={{ opacity, transform: transform.interpolate(t => `${t} rotateY(180deg)`) }}
        >
          <p className="text">{props.front}</p>
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