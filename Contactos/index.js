// Regex
const REGEX_NAME = /^[A-Z][a-z]{1,15}\s[A-Z][a-z]{1,15}[a-z\s]$/;
const REGEX_NUMBER = /^[0](212|412|414|424|416|426)[0-9]{7}$/;

// Selectors
const inputName = document.querySelector('#input-name');
const inputNumber = document.querySelector('#input-number');
const formBtn = document.querySelector('#form-btn');
const form = document.querySelector('#form');
const list = document.querySelector('#list');
const closeBtn = document.querySelector('#off')

// Validations
let nameValidation = false;
let numberValidation = false;
        
// Data

// Functio
const validateInput = (input, validation) => {
  const infoText = input.parentElement.children[2];
  if (input.value === '') {
    input.classList.remove('correct');
    input.classList.remove('incorrect');
    infoText.classList.remove('show-info');
  } else if (validation) {
    input.classList.add('correct');
    input.classList.remove('incorrect');
    infoText.classList.remove('show-info');
  } else {
    infoText.classList.add('show-info');
    input.classList.add('incorrect');
    input.classList.remove('correct');
  }

  if (nameValidation && numberValidation) {
    formBtn.disabled = false;
  } else {
    formBtn.disabled = true;
  }
};


// Events
inputName.addEventListener('input', e => {
  nameValidation = REGEX_NAME.test(inputName.value);
  validateInput(inputName, nameValidation);
});

inputNumber.addEventListener('input', e => {
  numberValidation = REGEX_NUMBER.test(inputNumber.value);
  validateInput(inputNumber, numberValidation)
});


const user = JSON.parse(localStorage.getItem('user'))
const userNumber = JSON.parse(localStorage.getItem('Number')) 

form.addEventListener('submit', async e => {
   e.preventDefault();
   const responseJSON = await fetch('http://localhost:3000/contacts', {
    method: 'POST',
    headers: {
      'Content-type' : 'application/json'
    },
    body: JSON.stringify({
      Text: inputName.value, 
      user: user.username,
      userNumber: inputNumber.value,
      number: user.usernumber}),
   });
   const response = await responseJSON.json();
 
  // agrego al html
   const listItem = document.createElement('li');
   listItem.innerHTML = ` <li id="${response.id}">
   <button class="delete-btn">
     <svg class="delete-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
       <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
     </svg>
    </button>   
    <p>${response.Text}</p>
    <p>${response.userNumber}</p>
     <button class="edit-btn">
       <svg class="edit-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
       <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
       </svg>        
      </button>
      </li>
   `;
   list.append(listItem);

   // Limpiar el formulario
  nameValidation = false;
  numberValidation = false;
         
   inputName.value= '';
   inputNumber.value = '';
   validateInput(inputName, nameValidation);
   validateInput(inputNumber, numberValidation);

   if (!nameValidation || !numberValidation) {
    return;
  } 
});

// obtengo contactos

const getContacts = async () =>{
  const response = await fetch('http://localhost:3000/contacts', {method: 'GET'})
  const info = await response.json();
  const userInfo = info.filter(contact => contact.user === user.username );
  userInfo.forEach(contact => {
    const li = document.createElement('li');
    li.innerHTML = `<li id="${contact.id}">
    <button class="delete-btn">
     <svg class="delete-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
       <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
     </svg>
    </button>   
    <p>${contact.Text}</p>
    <p>${contact.userNumber}</p>
     <button class="edit-btn">
       <svg class="edit-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
       <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
       </svg>        
      </button>
      </li>
    `;
    list.append(li);
  });
}

   
list.addEventListener('click', async e =>{
  const eliminar = e.target.closest('.delete-btn');
  const editButton = e.target.closest('.edit-btn');
   if (eliminar) {     
  const id = eliminar.parentElement.id;

  await fetch(`http://localhost:3000/contacts/${id}`, {
  method: 'DELETE'});
  eliminar.parentElement.remove();
  } else if (editButton) {
      const li = editButton.parentElement;
      const nameEdit = li.children[1];
      const numberEdit = li.children[2];
      editButton.classList.add('active');

      const isValidName = REGEX_NAME.test(nameEdit.innerHTML);
      const isValidNumber = REGEX_NUMBER.test(numberEdit.innerHTML);
  
      if (isValidName) {
          nameEdit.classList.add('correct');
          nameEdit.classList.remove('incorrect');
      } else {
          nameEdit.classList.add('incorrect');
          nameEdit.classList.remove('correct');
          alert('El nombre y el apellido deben empezar en mayúscula, y no deben contener caracteres especiales ni números');
          return;
      } 
      if (isValidNumber) {
          numberEdit.classList.add('correct');
          numberEdit.classList.remove('incorrect');
      } else {
          numberEdit.classList.remove('correct');
          numberEdit.classList.add('incorrect');
          alert('El número celular debe ser un número venezolano');
          return;
      }
  
      if (li.classList.contains('editando')) {
          li.classList.remove('editando');
          const id = li.id;
  
          const updatedContact = {
              Text: nameEdit.innerHTML,
              userNumber: numberEdit.innerHTML
          };
  
          await fetch(`http://localhost:3000/contacts/${id}`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(updatedContact)
          });
          nameEdit.setAttribute('contenteditable', 'false');
          numberEdit.setAttribute('contenteditable', 'false');
          numberEdit.classList.remove('correct');
          nameEdit.classList.remove('correct');
          editButton.innerHTML = `
              <svg class="edit-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              
          `;
      } else {
          li.classList.add('editando');
          nameEdit.setAttribute('contenteditable', 'true');
          numberEdit.setAttribute('contenteditable', 'true');
          editButton.innerHTML = `
              <svg class="edit-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
          `;
          
          nameEdit.addEventListener('input', e => {
              const nameEditValidation = REGEX_NAME.test(nameEdit.innerHTML);
           
              validateInput(nameEdit, nameEditValidation);
              if (nameEditValidation) {
                  editButton.disabled = false;
              } else {
                  editButton.disabled = true;
              }
          });
          numberEdit.addEventListener('input', e =>{
            const numberEditValidation = REGEX_NUMBER.test(numberEdit.innerHTML);
            validateInput(numberEdit, numberEditValidation);
            if(numberEditValidation){
              editButton.disabled = false;
            } else {
              editButton.disabled = true;
            }
          })
      }
  }
  
  
  }
);


closeBtn.addEventListener('click', async e =>{
  localStorage.removeItem('user');
  window.location.href = '../home/index.html'
});


getContacts();
