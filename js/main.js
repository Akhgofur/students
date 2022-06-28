const elUsers = document.querySelector('.students')
const elEditModal = document.querySelector('.edit-student')
const selectElement = (element, parentElement = document) => parentElement.querySelector(element)
const createDOM = (element) => document.createElement(element)
const elStudentTemplate = selectElement("#student-temp").content
const elStudentsList = selectElement(".students")
const elCreateForm = selectElement(".add-studet")
const elNameInput = selectElement("#name")
const elSurnameInput = selectElement("#surname")
const elAgeInput = selectElement("#age")
const elEditForm = selectElement(".edit-student-form", elEditModal)
const elEditName = selectElement("#edit-name", elEditModal)
const elEditSurname = selectElement("#edit-surname", elEditModal)
const elEditAge = selectElement("#edit-age", elEditModal)


//  FUNCTIONS

// RENDER
function renderStudents(students, element){
  element.innerHTML = null
  const elFragment = document.createDocumentFragment()
  students.forEach(student => {
    const template = elStudentTemplate.cloneNode(true)
      selectElement(".students__item-heading", template).textContent = student.first_name + ' ' + student.last_name
      selectElement(".students__item-age", template).textContent = student.age
      selectElement(".students__item", template).setAttribute("data-id", student.student_id)
      selectElement(".students__id", template).textContent = "id: " + student.student_id
      elFragment.append(template)
    });
    element.append(elFragment)
  }
  
  // GET STUDENTS
async function getStudents() {
  const res = await fetch('https://student-express.herokuapp.com/site/student')
  const stData = await res.json()
  console.log(stData.message);
  renderStudents(stData.message, elStudentsList)
}

// CREATE STUDENT
async function createStudent(name, lastName, age){
  const res = await fetch("https://student-express.herokuapp.com/site/student",{
    method: "POST",
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      firstName:name,
      lastName: lastName,
      age: age
    })
  })
  getStudents()
}

// EDIT STUDENT 
async function editStudent(id, name, lastName, age){
  const res = await fetch("https://student-express.herokuapp.com/site/student",{
    method: "PUT",
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      studentId:id,
      firstName:name,
      lastName: lastName,
      age: age
    })
  })

  console.log(await res.json());
  getStudents()
}

// DELETE STUDENT 
async function deleteStudent(id){
  const res = await fetch("https://student-express.herokuapp.com/site/student",{
    method: "DELETE",
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      studentId:id,
    })
  })
  getStudents()
}

elCreateForm.addEventListener("submit", (e) => {
  e.preventDefault()
  createStudent(elNameInput.value.trim(), elSurnameInput.value.trim(), elAgeInput.value.trim())
  elCreateForm.reset()
})
elUsers.addEventListener('click', (e) => {
  
  if(e.target.matches('.students__item-edit')) {
    elEditModal.classList.add('edit-student--open')
    console.log(e.target.closest(".students__item").dataset.id);
    const currentStId = e.target.closest(".students__item").dataset.id
    function editEvent(e) {
      e.preventDefault()
      console.log(e.target);
      console.log(currentStId);
      editStudent(currentStId, elEditName.value.trim(), elEditSurname.value.trim(), elEditAge.value.trim())
      
      elEditModal.classList.remove('edit-student--open')
    }
    elEditForm.addEventListener('submit', editEvent)
    
  }
  else if(e.target.matches(".students__item-delete")){
    const currentStId = e.target.closest(".students__item").dataset.id
    console.log(currentStId);
    deleteStudent(currentStId)
  }
})
getStudents()