import React, { useState, useEffect, useCallback } from 'react';
import { useTransition } from 'react-spring';
import { Plus,  Edit2 } from 'react-feather'; 
import { v4 as uuidv4 } from 'uuid';
import analytics from './utils/analytics';
import api from './utils/api';
import Card from "./components/Card";
import CardForm from "./components/CardForm";
import Authform from "./components/AuthForm";
import './App.css';



function removeOptimisticCards(cards){
  return cards.filter((card) => {
    return card.ref
  });
};

function handleResize(){
  let vh = window.innerHeight * 0.01;
  console.log(`vh ${vh}px`)
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

export default function App() {
  useEffect(() => {
    analytics.page()
    const user_id = localStorage.getItem('user_id');
    if(user_id){
      api.readAll(user_id).then((data) => {
        if (data.message === 'unauthorized') {
          return false
        }
        console.log('all cards', data);
        updateUser(user_id);
        updateCards(data);
      })
    };
    handleResize();
    window.addEventListener('resize', handleResize);
  }, []);
  const [user, updateUser] = useState(false);
  const [cards, updateCards] = useState([]);
  const [index, set] = useState(0);
  const [formVisibility, changeVisibility] = useState(false);
  const [cardContent, setCardContent] = useState(false);
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
      user_id: user
    };
    const optimisticNewCard = {
      data: newCard,
      ts: new Date().getTime() * 10000
    };
    updateCards([...cards, optimisticNewCard]);

    api.create(newCard).then((response) => {
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

  const updateCard = (cardData) => {
    deleteCard();
    addCard(cardData);
    console.log(cards)
  };

  const deleteCard = () => {
    const cardKey = cards[index].ref['@ref'].id
    api.delete(cardKey).then(() => {
      console.log(`deleted todo id ${cardKey}`)
      /*analytics.track('todoDeleted', {
        category: 'cards',
      })*/
    }).catch((e) => {
      console.log(`There was an error removing ${cardKey}`, e)
    })
    if (index === cards.length - 1) {
      api.readAll().then((dbData) => {
        if (dbData.message === 'unauthorized') {
          return false
        }
        updateCards(dbData);
      }).then(set(0));
    } else {
      nextCard();
    }
  };

  const cardClick = (correct, cardKey) => {
    if (correct && cardKey) {
      api.delete(cardKey).then(() => {
        console.log(`deleted todo id ${cardKey}`)
        /*analytics.track('todoDeleted', {
          category: 'cards',
        })*/
      }).catch((e) => {
        console.log(`There was an error removing ${cardKey}`, e)
      })
    };
    if (index === cards.length - 1) {
      api.readAll().then((dbData) => {
        if (dbData.message === 'unauthorized') {
          return false
        }
        updateCards(dbData);
      }).then(set(0));
    } else {
      nextCard();
    }
  };

  const registerUser = (name, email) => {
    const user_id = uuidv4();
    const newUser = {
      name: name,
      email: email,
      user_id: user_id
    };
    api.createUser(newUser).then((response) => {
      console.log(response)
      /* Track a custom event */
      /*analytics.track('cardsCreated', {
        category: 'cards',
        label: newCard,
      })
      */
      localStorage.setItem('user_id', user_id);
      updateUser(user_id);
    }).catch((e) => {
      console.log('An API error occurred', e);
      localStorage.removeItem('user_id');
      updateUser(false);
    })
  };

  const checkUser = (userName, userEmail) => {
    const user = {
      name:userName,
      email:userEmail,
    };
    api.getUser(user).then((data) => {
      if (data.message === 'unauthorized') {
        return false
      }
      const user_id = data[0]
      updateUser(user_id);
      localStorage.setItem("user_id", user_id);

      api.readAll(user_id).then((dbData) => {
        if (dbData.message === 'unauthorized') {
          return false
        }
        updateCards(dbData);
      });
      return true
    });
  };

  const showHideForm = (edit) => {
    changeVisibility(!formVisibility);
    console.log(`showHide ${edit}`)
    if(edit){
      setCardContent({original: cards[index].data.original, translation: cards[index].data.translation})
    } else {
      setCardContent(false)
    };
  };

  return (
    <div className="App">
      <CardForm 
        closeCardForm={showHideForm}
        addCard={addCard} 
        deleteCard={deleteCard}
        updateCard={updateCard}
        original={cardContent.original} 
        translation={cardContent.translation} 
        style={{ visibility: formVisibility ? "visible" : "hidden" }} 
        />
      <button className="formButton add" onClick={() => showHideForm(false)} style={{visibility: user && !formVisibility ? "visible" : "hidden"}}>
        <Plus className="buttonIcon" color="white" />
      </button>
      <button className="formButton edit" onClick={() => showHideForm(true)} style={{visibility: user && !formVisibility ? "visible" : "hidden"}}>
        <Edit2 className="buttonIcon" color="white" />
      </button>
      {!user && <Authform registerUser={registerUser} checkUser={checkUser} />}
      {user && cards.length !== 0 ? transitions.map(({ item, transitionStyle, key}) => {
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
        }) : <div id="noMoreCardsMessage">You have no more Cards...</div>}
    </div>
  )
};
