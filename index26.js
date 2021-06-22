const taskContainer = document.querySelector(".task__container");

var globalStore = [];

const generateNewCard = (taskData) => `
<div class="col-md-6 col-lg-4" id=${taskData.id}>
<div class="card">
  <div class="card-header d-flex justify-content-end gap-2 bg-dark">
    <button type="button" class="btn btn-outline-success">
      <i class="fas fa-pencil-alt"></i>
    </button>
    <button type="button" class="btn btn-outline-danger" onclick="taskContainer.apply(this, arguments)">
      <i class="fas fa-trash-alt"></i>
    </button>
  </div>
  <img
    src=${taskData.imageUrl}
    class="card-img-top"
    alt="Task image"
  />
  <div class="card-body bg-info">
    <h5 class="card-title">${taskData.taskTitle}</h5>
    <p class="card-text">
      ${taskData.taskDescription}
    </p>
    <a href="#" class="btn btn-secondary">${taskData.taskType}</a>
  </div>
  <div class="card-footer bg-dark">
    <button type="button" class="btn btn-outline-info float-end">
      Open Task
    </button>
  </div>
</div>
</div>
`;


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
  })

};

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

/*
const deleteCard = (event) => {
event = window.event;
//id
const targetID = event.target.id;

//match the id of the element with the id inside the globalStorage
//If match found then remove it

globalStore = const newUpdatedArray = globalStore.filter((cardObject) => cardObject.id !== targetID);

//contact parent

taskContainer.removeChild()
};
*/
