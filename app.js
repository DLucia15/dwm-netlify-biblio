// CONFIGURACIÓ FIREBASE (LA TEVA)
const firebaseConfig = {
  apiKey: "AIzaSyA_BNHv55OdW21ZH1Hw33CxfzSMXMAstmg",
  authDomain: "dwm-app-aea4.firebaseapp.com",
  projectId: "dwm-app-aea4",
  storageBucket: "dwm-app-aea4.appspot.com",
  messagingSenderId: "201742955149",
  appId: "1:201742955149:web:0f7f58fea521ac41d9a8c4"
};

// Inicialitzar Firebase
firebase.initializeApp(firebaseConfig);

// Firestore
const db = firebase.firestore();
const llibresRef = db.collection("llibres");

// DOM
const form = document.getElementById("form-llibre");
const titol = document.getElementById("titol");
const autor = document.getElementById("autor");
const llista = document.getElementById("llista-llibres");

// Afegir llibre
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  await llibresRef.add({
    titol: titol.value,
    autor: autor.value,
    prestat: false,
    creatEl: firebase.firestore.FieldValue.serverTimestamp()
  });

  titol.value = "";
  autor.value = "";
});

// Escoltar canvis
llibresRef.orderBy("creatEl", "asc").onSnapshot(snapshot => {
  llista.innerHTML = "";

  snapshot.forEach(doc => {
    const llibre = doc.data();
    const li = document.createElement("li");

    li.textContent = `"${llibre.titol}" – ${llibre.autor}`;
    if (llibre.prestat) li.style.textDecoration = "line-through";

    li.onclick = () => {
      llibresRef.doc(doc.id).update({
        prestat: !llibre.prestat
      });
    };

    const btn = document.createElement("button");
    btn.textContent = "🗑️";
    btn.onclick = () => llibresRef.doc(doc.id).delete();

    li.appendChild(btn);
    llista.appendChild(li);
  });
});
