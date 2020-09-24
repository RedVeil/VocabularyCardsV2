import React, { useState, useEffect, useCallback } from 'react'
import { useTransition } from 'react-spring'
import { Plus } from 'react-feather';
import analytics from './utils/analytics'
import api from './utils/api'
import isLocalHost from './utils/isLocalHost'
import Card from "./components/Card";
import AddCardForm from "./components/AddCardForm";
import './App.css'



function removeOptimisticCards(cards) {
  return cards.filter((card) => {
    return card.ref
  })
}

export default function App() {
  useEffect(() => {
    /* Track a page view */
    analytics.page()
    api.readAll().then((dbData) => {
      if (dbData.message === 'unauthorized') {
        if (isLocalHost()) {
          alert('FaunaDB key is not unauthorized. Make sure you set it in terminal session where you ran `npm start`. Visit http://bit.ly/set-fauna-key for more info')
        } else {
          alert('FaunaDB key is not unauthorized. Verify the key `FAUNADB_SERVER_SECRET` set in Netlify enviroment variables is correct')
        }
        return false
      }
      console.log('all cards', dbData);
      updateCards(dbData);
    })
  }, []);

  const [cards, updateCards] = useState([]);
  const [index, set] = useState(0);
  const [formVisibility, changeVisibility] = useState(false);
  const nextCard = useCallback(() => set(state => state + 1), []);

  const transitions = useTransition(index, p => p, {
    from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
  });

  const addCard = (cardData) => {
    const newCard = {
      original: cardData[0],
      translation: cardData[1],
      user_id: 1
    };
    const optimisticNewCard = {
      data: newCard,
      ts: new Date().getTime() * 10000
    };
    updateCards([...cards, optimisticNewCard]);

    api.create(newCard).then((response) => {
      console.log(response)
      /* Track a custom event */
      /*analytics.track('cardsCreated', {
        category: 'cards',
        label: newCard,
      })
      */
      const persistedState = removeOptimisticCards(cards).concat(response)
      updateCards(persistedState);
    }).catch((e) => {
      console.log('An API error occurred', e)
      const revertedState = removeOptimisticCards(cards)
      updateCards(revertedState);
    })
  };

  const cardClick = (correct, cardKey) => {
    if(correct && cardKey){
      api.delete(cardKey).then(() => {
        console.log(`deleted todo id ${cardKey}`)
        /*analytics.track('todoDeleted', {
          category: 'cards',
        })*/
      }).catch((e) => {
        console.log(`There was an error removing ${cardKey}`, e)
      })
    };
    if(index === cards.length-1){
      api.readAll().then((dbData) => {
        if (dbData.message === 'unauthorized') {
          if (isLocalHost()) {
            alert('FaunaDB key is not unauthorized. Make sure you set it in terminal session where you ran `npm start`. Visit http://bit.ly/set-fauna-key for more info')
          } else {
            alert('FaunaDB key is not unauthorized. Verify the key `FAUNADB_SERVER_SECRET` set in Netlify enviroment variables is correct')
          }
          return false
        }
        console.log('all cards', dbData)
        updateCards(dbData);
      }).then(set(0));
    } else {
      nextCard();
    }
  };

  const showHideForm = () => {
    changeVisibility(!formVisibility);
  };

  return (
    <div className="App">
     <button id="showFormButton" onClick={showHideForm}><Plus className="buttonIcon" color="white"/></button>
      <AddCardForm addCard={addCard} closeAddCardForm={showHideForm} style={{visibility: formVisibility ? "visible": "hidden"}}/>
      {cards.length !== 0 ? transitions.map(({ item, transitionStyle, key}) => {
        let cardKey
        if(cards[item].ref !== undefined){
          cardKey = cards[item].ref['@ref'].id;
        } else { cardKey = null };
        return <Card 
                key={key} 
                front={cards[item].data.original} 
                back={cards[item].data.translation} 
                cardKey={cardKey} 
                transitionStyle={transitionStyle} 
                cardClick={cardClick}/>
        }) : <div>You have no more Cards...</div>}
    </div>
  )
};
