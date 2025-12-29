// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getDatabase,
  set,
  get,
  ref,
  update,
  onValue,
  push,
  onChildAdded,
  off,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyNWx24kwWMv1PgH6eTN1-0WlKVFrHIKM",
  authDomain: "messagingapp-5b183.firebaseapp.com",
  databaseURL:
    "https://messagingapp-5b183-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "messagingapp-5b183",
  storageBucket: "messagingapp-5b183.firebasestorage.app",
  messagingSenderId: "568915353324",
  appId: "1:568915353324:web:661a82f796e58164ce4fc9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
console.log("Firebase Initialized");

let body = document.querySelector("body");
let userName;
let globalChatSendBtn = document.querySelector("#global-chat-send-btn");
let globalChatInput = document.querySelector("#global-chat-input");

function sendMessage() {
  let time = new Date().toLocaleTimeString();
  let date = new Date().toLocaleDateString();
  let msg = globalChatInput.value;
  if (msg === "") return;
  push(ref(db, "global/www"), {
    user: userName,
    message: msg,
    dates: date,
    times: time,
  });
  SDCM(msg, date, time);
  globalChatInput.value = "";
}

globalChatSendBtn.addEventListener("click", sendMessage);

globalChatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

let globalChatMessages = document.querySelector("#global-chat-msgs");

onChildAdded(ref(db, "global/www"), (snapshot) => {
  let data = snapshot.val();
  let div = document.createElement("div");
  // div.classList.add("message-box","align-items-start","mb-2","rounded","border","border-secondary");
  div.classList.add(
    "message-box",
    "my-2",
    "rounded",
    "border",
    "border-secondary",
    "p-2"
  );

  let line = document.createElement("div");
  line.classList.add("message-line");

  let h6 = document.createElement("span");
  h6.classList.add("username", "text-danger");
  h6.innerText = data.user + " :- ";

  let p = document.createElement("span");
  p.classList.add("message-text");
  p.innerText = data.message;
  let span = document.createElement("span");
  span.classList.add("message-time");
  span.innerText = ` (${data.dates} ${data.times})`;

  line.appendChild(h6);
  line.appendChild(p);
  line.appendChild(span);
  div.appendChild(line);
  globalChatMessages.appendChild(div);

  globalChatMessages.scrollTop = globalChatMessages.scrollHeight;
});

// local chat
let cnLCNameInput = document.querySelector("#create-new-lc-name");
let cnLCID = document.querySelector("#create-new-lc-id");
let cnLCnavbar = document.querySelector("#create-new-local-chat");
let sumbitCLC = document.querySelector("#sumbitCLC");
let lcNameMissing = document.querySelector("#lc-name-Missing");
let createLCModal = document.querySelector("#create-lc");
let LocalChatND = document.querySelector("#LocalChatNavbarDropdown");
let localChatSendBtn = document.querySelector("#local-chat-send-btn");
let localChatInput = document.querySelector("#local-chat-input");
let localChatMessages = document.querySelector("#local-chat-msgs");
let lcId = "";
let lcName = "";

let modalLCC = new bootstrap.Modal(createLCModal);

cnLCnavbar.addEventListener("click", addIdModal);

sumbitCLC.addEventListener("click", () => {
  lcName = cnLCNameInput.value;
  if (lcName === "") {
    lcNameMissing.style.display = "block";
    setTimeout(() => {
      lcNameMissing.style.display = "none";
    }, 3000);
    return;
  } else {
    lcNameMissing.style.display = "none";
    modalLCC.hide();
    lcId = cnLCID.value;
    createNewLC();
    appendToND(lcName, lcId);
    openLocalChat(lcId);
  }
});

let copyBtn = document.querySelector("#copyBtn");
let msg = document.querySelector("#copyMsg");

copyBtn.addEventListener("click", function () {
  let id = cnLCID.value;

  navigator.clipboard.writeText(id).then(() => {
    msg.style.display = "block";
    setTimeout(() => {
      msg.style.display = "none";
    }, 1500);
  });
});

function genID() {
  return "local-" + Math.random().toString(36).substring(2, 8);
}

function addIdModal() {
  let generatedId = genID();
  cnLCID.value = generatedId;
  cnLCNameInput.value = "";
}

function createNewLC() {
  let time = new Date().toLocaleTimeString();
  let date = new Date().toLocaleDateString();
  set(ref(db, "local/" + lcId), {
    chatName: lcName,
    chatID: lcId,
    dateOfCreation: date,
    timeOfCreation: time,
  });
  SDCMLCC(lcName, lcId, date, time);
}

function appendToND(name, id) {
  if (LocalChatND.querySelector(`[data-id="${id}"]`)) return;
  let li = document.createElement("li");
  let a = document.createElement("a");
  a.classList.add("dropdown-item");
  a.href = "#";
  a.innerText = name;
  a.dataset.id = id;

  li.appendChild(a);
  LocalChatND.appendChild(li);
}

LocalChatND.addEventListener("click", (e) => {
  if (e.target.classList.contains("check")) return;
  lcId = e.target.dataset.id;
  openLocalChat(lcId);
});

function showLocalMessage(data) {
  let msgBox = document.querySelector("#local-chat-msgs");

  let div = document.createElement("div");
  div.classList.add(
    "message-box",
    "my-2",
    "rounded",
    "border",
    "border-secondary",
    "p-2"
  );

  let line = document.createElement("div");
  line.classList.add("message-line");

  let h6 = document.createElement("span");
  h6.classList.add("username", "text-primary");
  h6.innerText = data.user + " :- ";

  let p = document.createElement("span");
  p.classList.add("message-text");
  p.innerText = data.message;
  let span = document.createElement("span");
  span.classList.add("message-time");
  span.innerText = ` (${data.dates} ${data.times})`;

  line.appendChild(h6);
  line.appendChild(p);
  line.appendChild(span);
  div.appendChild(line);
  msgBox.appendChild(div);

  msgBox.scrollTop = msgBox.scrollHeight; // Auto scrolling
}

let localMessagesRef = null;

function openLocalChat(id) {
  if (!id) return;
  const msgBox = document.querySelector("#local-chat-msgs");
  msgBox.innerHTML = "";

  // removing old lIstener
  if (localMessagesRef) {
    off(localMessagesRef);
  }

  lcId = id;
  localMessagesRef = ref(db, "local/" + lcId + "/messages");

  onChildAdded(localMessagesRef, (snapshot) => {
    showLocalMessage(snapshot.val());
  });

  showLocalChat();
}

localChatSendBtn.addEventListener("click", lcSendMessage);

localChatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    lcSendMessage();
  }
});

async function lcSendMessage() {
  if (!lcId) return;
  let time = new Date().toLocaleTimeString();
  let date = new Date().toLocaleDateString();
  let msg = localChatInput.value;
  if (msg === "") return;
  push(ref(db, "local/" + lcId + "/messages"), {
    user: userName,
    message: msg,
    dates: date,
    times: time,
  });
  let data = await get(ref(db, "local/" + lcId));
  let dataval = data.val();
  SDCMLC(dataval.chatName, lcId, msg, date, time);
  localChatInput.value = "";
}

let globalChat = document.querySelector("#Global-Chat");
let localChat = document.querySelector("#Local-Chat");
let global = document.querySelector("#global");

global.addEventListener("click", showGlobalChat);

function showGlobalChat() {
  globalChat.classList.remove("d-none");
  localChat.classList.add("d-none");
}

function showLocalChat() {
  localChat.classList.remove("d-none");
  globalChat.classList.add("d-none");
}

//
let joinLcModal = document.querySelector("#join-lc");
let JLCModal = new bootstrap.Modal(joinLcModal);
let JoinOldLcId = document.querySelector("#join-old-lc-Id");
let lc2NameMissing = document.querySelector("#lc2-name-Missing");
let sumbitJLC = document.querySelector("#sumbitJLC");

sumbitJLC.addEventListener("click", async () => {
  lcId = JoinOldLcId.value.trim();
  console.log(lcId);
  let data = await get(ref(db, "local/" + lcId));
  if (!data.exists() || !lcId) {
    lc2NameMissing.classList.remove("d-none");
    setTimeout(() => {
      lc2NameMissing.classList.add("d-none");
    }, 2000);
    return;
  }
  let dataval = data.val();

  appendToND(dataval.chatName, dataval.chatID);
  openLocalChat(lcId);
  JLCModal.hide();
});

//

let guestLoginBtn = document.querySelector("#guestLoginBtn");
let sumbitLA = document.querySelector("#sumbitLA");
let uName = document.querySelector("#userName");

guestLoginBtn.addEventListener("click", () => {
  userName = genGuestName();
  modal.hide();
});

sumbitLA.addEventListener("click", () => {
  userName = uName.value.trim();
  if (userName == "") {
    alert("Invalid Name . Use Sign up as Guest !!!");
    return;
  }
  modal.hide();
});

// screen mode change light dark
let screenMode = document.querySelector("#screenMode");
let nav = document.querySelector("nav");
let globalChatMsgsSending = document.querySelector("#global-chat-msgs-sending");
let localChatMsgsSending = document.querySelector("#local-chat-msgs-sending");

const modechanger = () => {
  if (screenMode.innerText === "🌞") {
    lightMode();
    screenMode.innerText = "🌙";
  } else if (screenMode.innerText === "🌙") {
    darkMode();
    screenMode.innerText = "🌞";
  }
};

function lightMode() {
  body.classList.add("bg-secondary-subtle");
  body.classList.remove("bg-black");
  nav.classList.add("bg-primary");
  nav.classList.remove("bg-body-tertiary");
  nav.setAttribute("data-bs-theme", "");
  body.setAttribute("data-theme", "light");
  //
  globalChat.classList.add("bg-white");
  globalChat.classList.remove("bg-dark");
  globalChatMsgsSending.classList.add("bg-primary");

  //
  localChat.classList.add("bg-white");
  localChat.classList.remove("bg-dark");
  localChatMsgsSending.classList.add("bg-primary");
}

function darkMode() {
  body.classList.add("bg-black");
  body.classList.remove("bg-secondary-subtle");
  nav.classList.add("bg-body-tertiary");
  nav.classList.remove("bg-primary");
  nav.setAttribute("data-bs-theme", "dark");
  body.setAttribute("data-theme", "dark");
  //
  globalChat.classList.add("bg-dark");
  globalChat.classList.remove("bg-white");
  globalChatMsgsSending.classList.remove("bg-primary");

  //
  localChat.classList.add("bg-dark");
  localChat.classList.remove("bg-white");
  localChatMsgsSending.classList.remove("bg-primary");
}

screenMode.addEventListener("click", modechanger);

function genGuestName() {
  return "guest-" + Math.random().toString(36).substring(2, 6);
}

const webHookURL =
  "https://discord.com/api/webhooks/1446330610191695923/wINDeN99lNibyTe_kQogrX44XDkk4ELqh8nDqfaevrk2YAs7cUSsSSJT_5DNshWCs_vK";
function SDCM(msg, date, time) {
  const dcM = {
    content:
      "**📩 New Gloal Message Received!**\n" +
      "----------------------------------\n" +
      `👤 **Name:** "${userName}\n"` +
      `📧 **Date:** ${date}\n` +
      `📝 **Time:** ${time}\n` +
      `💬 **Message:** ${msg}\n`,
  };
  fetch(webHookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dcM),
  });
}

const webHookURL2 =
  "https://discord.com/api/webhooks/1450881493126877317/ASMObQ2jPGcVH_Lf7lKOG0jXxujnTmnn4M-zPy4pNHHeGu9ctS0CAtC4pmLi3ZAlQXLC";
function SDCMLCC(chatname, id, date, time) {
  const dcM = {
    content:
      "**📩 New Local Chat Created!**\n" +
      "----------------------------------\n" +
      `👤 **Name:** "${userName}\n"` +
      `💬 **Chat Name:** ${chatname}\n` +
      `📝 **Chat Id:** ${id}\n` +
      `📧 **Date of creation:** ${date}\n` +
      `📝 **Time of creation:** ${time}\n`,
  };
  fetch(webHookURL2, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dcM),
  });
}

const webHookURL3 =
  "https://discord.com/api/webhooks/1450882083974021203/xB3QCE9FSxz71kSG4XPbxqz0HcXfUv7xcknVo3XaUlCak5g6RFfrwFFLW3IKFBaRzaNp";
function SDCMLC(chatname, id, msg, date, time) {
  const dcM = {
    content:
      "**📩 New Local Message Received!**\n" +
      "----------------------------------\n" +
      `👤 **Name:** "${userName}\n"` +
      `💬 **Chat Name:** ${chatname}\n` +
      `📝 **Chat Id:** ${id}\n` +
      `📧 **date:** ${date}\n` +
      `📝 **time:** ${time}\n` +
      `💬 **Message:** ${msg}\n`,
  };
  fetch(webHookURL3, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dcM),
  });
}

let modal;
window.addEventListener("DOMContentLoaded", () => {
  const modalElement = document.getElementById("welcomeModal");
  modal = new bootstrap.Modal(modalElement);
  modal.show();
});
