(() => {


  'use strict';


  var firebaseConfig = {
    apiKey: "AIzaSyBD3B9WiZvJvKuQy8afAnaFcHK6IGFKYSU",
    authDomain: "fir-study-50c81.firebaseapp.com",
    databaseURL: "https://fir-study-50c81.firebaseio.com",
    projectId: "fir-study-50c81",
    storageBucket: "fir-study-50c81.appspot.com",
    messagingSenderId: "105799614596",
    appId: "1:105799614596:web:3b9387a2d03c254f6b82d1",
    measurementId: "G-V5QNREW97C"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  let db = firebase.firestore();
  // db.settings({
  //   timestampsInSnapshots: true
  // });
  const collection = db.collection('messages');

  const auth = firebase.auth();
  let me = null;


  const message = document.getElementById('message');
  const messages = document.getElementById('messages');
  const login = document.getElementById('login');
  // const login = document.getElementById('login');
  const logout = document.getElementById('logout');
  const form = document.querySelector('form');



  login.addEventListener('click', () => {
    auth.signInAnonymously();
  });

  logout.addEventListener('click', () => {
    auth.signOut();
  });

  auth.onAuthStateChanged(user => {
    if (user) {
      me = user;

      while (messages.firstChild) {
        messages.removeChild(messages.firstChild);
      }
      collection.orderBy('created').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const li = document.createElement('li');
            const d = change.doc.data();
            li.textContent = d.uid.substr(0, 8) + ': ' + d.message;
            messages.appendChild(li);
          }
        });
      }, error => { });
      console.log(`Logged in as ${user.uid}`);
      login.classList.add('hidden');
      [logout, form, messages].forEach(el => {
        el.classList.remove('hidden');
      });
      message.focus();
      return;
    }
    me = null;
    console.log(`Nobody is logged in`);
    login.classList.remove('hidden');
    [logout, form, messages].forEach(el => {
      el.classList.add('hidden');
    });

  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const val = message.value.trim();

    if (val === "") {
      return;
    }
    message.value = '';
    message.focus();

    collection.add({
      message: val,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      uid: me ? me.uid : 'nobody'
    }).then(doc => {
      console.log(`${doc.id} added`);
    }).catch(error => {
      console.log('document add error!');
      console.log(error);
    })
  });




})();