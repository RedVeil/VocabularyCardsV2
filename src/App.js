import React, { useState, useEffect, useCallback } from 'react';
import { useTransition } from 'react-spring';
import { v4 as uuidv4 } from 'uuid';
import { Plus } from 'react-feather';
import analytics from './utils/analytics';
import api from './utils/api';
import Card from "./components/Card";
import CardForm from "./components/CardForm";
import Authform from "./components/AuthForm";
import './App.css';


function reloadAllCards(){
  window.location.reload();
};

function createTranslation(cardData) {
  return cardData.split(",").map(item => item.trim())
};

function removeOptimisticCards(cards) {
  return cards.filter((card) => {
    return card.ref
  });
};

function handleResize() {
  let vh = window.innerHeight * 0.01;
  console.log(`vh ${vh}px`)
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

export default function App() {
  useEffect(() => {
    analytics.page()
    const user_id = localStorage.getItem('user_id');
    if (user_id) {
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
      translation: createTranslation(cardData[1]),
      user_id: user
    };
    const optimisticNewCard = {
      data: newCard,
      ts: new Date().getTime() * 10000
    };
    updateCards([...cards, optimisticNewCard]);
    api.create(newCard).then((response) => {
      const persistedState = removeOptimisticCards(cards).concat(response)
      updateCards(persistedState);
    }).catch((e) => {
      console.log('An API error occurred', e)
      const revertedState = removeOptimisticCards(cards)
      updateCards(revertedState);
    })
  };

  const updateCard = (cardData) => {
    const cardKey = cards[index].ref['@ref'].id;
    deleteCard(cardKey);
    addCard(cardData);
  };

  const deleteCard = (cardKey) => {
    api.delete(cardKey).then(() => {
      if (index === cards.length - 1) {
        reloadAllCards()
      } else {
        nextCard();
      }
    }).catch((e) => {
      console.log(`There was an error removing ${cardKey}`, e)
    }) 
  };

  const cardClick = (correct) => {
    const cardKey = cards[index].ref['@ref'].id;
    if (correct && cardKey) {
      deleteCard(cardKey);
    } else {
        if (index === cards.length - 1) {
        reloadAllCards();
        } else {
          nextCard();
        };
      };
  };

  const registerUser = (name, email) => {
    const user_id = uuidv4();
    const newUser = {
      name: name,
      email: email,
      user_id: user_id
    };
    api.createUser(newUser).then((response) => {
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
      name: userName,
      email: userEmail,
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
    if (edit) {
      setCardContent({ original: cards[index].data.original, translation: cards[index].data.translation })
    } else {
      setCardContent(false)
    };
  };

  if(window.innerWidth > 500){
    return (
    <div>
      <p>This App is build for Portrait mode on mobile devices only.</p>
    </div>)
  }

  return (
    <div className="App">
      <CardForm
        closeCardForm={showHideForm}
        addCard={addCard}
        deleteCard={deleteCard}
        updateCard={updateCard}
        original={cardContent.original}
        translation={cardContent.translation}
        style={{ display: formVisibility ? "block" : "none" }}
      />
      {!user && <Authform registerUser={registerUser} checkUser={checkUser} />}
      {user && cards.length !== 0 ? transitions.map(({ item, transitionStyle, key }) => {
        return <Card
          key={key}
          front={cards[item].data.original}
          back={cards[item].data.translation}
          transitionStyle={transitionStyle}
          cardClick={cardClick}
          showHideForm={showHideForm}
          user={user}
          formVisibility={formVisibility}
        />
      }) :<div>
            <button
              className="button primary add"
              onClick={() => showHideForm(false)}
              style={{ display: user && !formVisibility ? "block" : "none" }}>
              <Plus className="buttonIcon" color="white" />
            </button>
            <p id="noMoreCardsMessage">You have no more Cards...</p>
          </div>}
      {cards.length > 1 || formVisibility ? <div className="card background1"></div> : ""}
      {cards.length > 1 && formVisibility ? <div className="card background2"></div> : ""}
      {cards.length > 2 && <div className="card background2"></div>}
    </div>
  )
};
