const toDos = document.querySelector("#toDos");
const toDo = document.querySelector("#toDo");
const add = document.querySelector("#add");
const form = document.querySelector('form input[type="text"]');

let tasks = [];
let temp;

displayTasks = (array) => {
  array.forEach((e) => {
    temp = toDo.cloneNode(true);
    temp.removeAttribute("id");
    temp.children[0].innerHTML = e;
    toDos.appendChild(temp);
  });
};

getTasks = () => {
  fetch("/getTasks")
    .then((response) => response.json())
    .then((json) => {
      tasks = JSON.parse(json);
      displayTasks(tasks);
    })
    .then(() => {
      let remove = document.querySelectorAll(".toDoStyle .remove");
      for (let i = 0; i < remove.length; i++) {
        const element = remove[i];
        element.addEventListener("click", removeTask);
      }
    });
};
getTasks();

addToDo = (e) => {
  e.preventDefault();
  if (form.value != "") {
    fetch("/", {
      method: "POST",
      body: JSON.stringify({
        text: `${form.value}`,
      }),
    }).then(() => {
      temp = toDo.cloneNode(true);
      temp.removeAttribute("id");
      temp.children[0].innerHTML = form.value;  
      temp.children[1].addEventListener("click", removeTask);
      toDos.prepend(temp);

      form.value="";
    });
  }
};

add.addEventListener("click", addToDo);

removeTask = (e) => {
  let toRemove = e.currentTarget.parentElement;
  toRemove.remove();
  fetch("/toRemove", {
    method: "POST",
    body: JSON.stringify({
      text: `${toRemove.children[0].innerHTML}`,
    }),
  })
};
