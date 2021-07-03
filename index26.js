const taskContainer = document.querySelector(".task__container");
const taskModal = document.querySelector(".task__modal__body");

let globalStore = [];

//New Card
const generateNewCard = (taskData) => `
<div class="col-md-6 col-lg-4">
<div class="card shadow mb-5 mt-4">
  <div class="card-header d-flex justify-content-end gap-2">
    <button type="button" class="btn btn-outline-success" id=${taskData.id} onclick="editCard.apply(this, arguments)">
      <i class="fas fa-pencil-alt" id=${taskData.id} onclick="editCard.apply(this, arguments)"></i>
    </button>
    <button type="button" class="btn btn-outline-danger" id=${taskData.id} onclick="deleteCard.apply(this, arguments)">
      <i class="fas fa-trash-alt" id=${taskData.id} onclick="deleteCard.apply(this, arguments)"></i>
    </button>
  </div>
  <img
    src=${taskData.imageUrl}
    class="card-img-top"
    alt="Task image"
  />
  <div class="card-body">
    <h5 class="card-title">${taskData.taskTitle}</h5>
    <p class="card-text">
      ${taskData.taskDescription}
    </p>
    <a href="#" class="btn btn-secondary">${taskData.taskType}</a>
  </div>
  <div class="card-footer">
    <button type="button" id=${taskData.id}
      data-bs-toggle="modal"
      data-bs-target="#showTask"
      onclick="openCard.apply(this, arguments)"
      class="btn btn-outline-dark float-end">
      Open Task
    </button>
  </div>
</div>
</div>
`;

// Open card Modal
const cardContent = (taskData) => {
 const date = new Date(parseInt(taskData.id));
 return ` <div id=${taskData.id}>
  <img
  src = ${taskData.imageUrl || `https://analyticsinsight.b-cdn.net/wp-content/uploads/2020/03/integrated-robotics-cover-848w477h.jpg` }
  alt = "bg image"
  class = "img-fluid place__holder__image mb-3"
  />
  <strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
  <h2 class="my-3">${taskData.taskTitle}</h2>
  <p class="lead">
  ${taskData.taskDescription}
  </p></div>`;
};

const loadInitialCardData = () => {
  //localstorage to get tasky card taskData
  const getCardData = localStorage.getItem("tasky");

  //convert to normal object
  const {cards} = JSON.parse(getCardData);

  //loop over those array of task object to create HTML card
  cards.map((cardObject) => {
    //inject it to DOM
    taskContainer.insertAdjacentHTML("beforeend", generateNewCard(cardObject));

    //update our globalStore
    globalStore.push(cardObject);
  });

};

//Save Changes
const saveChanges = () => {
  const taskData = {
    id: `${Date.now()}`, // unique number for id
    imageUrl: document.getElementById("imageurl").value,
    taskTitle: document.getElementById("tasktitle").value,
    taskType: document.getElementById("tasktype").value,
    taskDescription: document.getElementById("taskdescription").value,
  };


  taskContainer.insertAdjacentHTML("beforeend", generateNewCard(taskData));

  globalStore.push(taskData);

  localStorage.setItem("tasky", JSON.stringify({cards:globalStore}));

};

//Open Card
const openCard = (event) => {

     if (!event)
      event = window.event;
     //ID
      const targetID = event.target.id;

      const taskData = {
        id: `${Date.now()}`, // unique number for id
        imageUrl: document.getElementById("imageurl").value,
        taskTitle: document.getElementById("tasktitle").value,
        taskType: document.getElementById("tasktype").value,
        taskDescription: document.getElementById("taskdescription").value,
        };

  const getTask = globalStore.filter((taskData) => taskData.id === targetID);

  taskModal.innerHTML = cardContent(getTask[0]);

};

//Delete feature
const deleteCard = (event) => {

  event = window.event;
  //ID
    const targetID = event.target.id;
    const tagname = event.target.tagName; //BUTTON

    globalStore = globalStore.filter((cardObject) => {
       cardObject.id !== targetID
     });

  localStorage.setItem("tasky", JSON.stringify({cards:globalStore}));

 //contact parentNode
    if (tagname === "BUTTON"){
     return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode);
   } else {
     return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
   }
};

//Edit feature
const editCard = (event) => {
  event = window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagName;

  let parentElement;

  if (tagname === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  let taskTitle = parentElement.childNodes[5].childNodes[1];
  let taskDescription = parentElement.childNodes[5].childNodes[3];
  let taskType = parentElement.childNodes[5].childNodes[5];
  let submitButton = parentElement.childNodes[7].childNodes[1];

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");
  submitButton.setAttribute(
    "onclick",
    "saveEditchanges.apply(this, arguments)"
  );
  submitButton.innerHTML = "Save Changes";
};

const saveEditchanges = (event) => {
  event = window.event;
  const targetID = event.target.id;
  console.log(targetID);
  const tagname = event.target.tagName;

  let parentElement;

  if (tagname === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  let taskTitle = parentElement.childNodes[5].childNodes[1];
  let taskDescription = parentElement.childNodes[5].childNodes[3];
  let taskType = parentElement.childNodes[5].childNodes[5];
  let submitButton = parentElement.childNodes[7].childNodes[1];

  const updatedData = {
    taskTitle: taskTitle.innerHTML,
    taskType: taskType.innerHTML,
    taskDescription: taskDescription.innerHTML,
  };

  globalStore = globalStore.map((task) => {
    if (task.id === targetID) {
      return {
        id: task.id,
        imageUrl: task.imageUrl,
        taskTitle: updatedData.taskTitle,
        taskType: updatedData.taskType,
        taskDescription: updatedData.taskDescription,
      };
    }
    return task; // Important
  });

  localStorage.setItem("tasky", JSON.stringify({cards:globalStore}));

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");
  submitButton.removeAttribute("onclick");
  submitButton.innerHTML = "Open Task";
};

const searchTask = (event) => {

  if (!event) event = window.event;

  while (taskContainer.firstChild) {
    taskContainer.removeChild(taskContainer.firstChild);
  }

  const resultData = globalStore.filter(({taskTitle}) =>
    taskTitle.includes(event.target.value)
  );

  resultData.map((taskData) => {
    taskContainer.insertAdjacentHTML("beforeend", generateNewCard(taskData));
  });
};
