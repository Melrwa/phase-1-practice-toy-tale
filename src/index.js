let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
// Get elements from the DOM
const toyCollection = document.getElementById('toy-collection');
const addToyForm = document.querySelector('.add-toy-form');

// Function to fetch and render toys
function fetchToys() {
  fetch('http://localhost:3000/toys') // Make sure the server is running on this port
    .then(response => response.json())
    .then(toys => {
      toys.forEach(renderToy);
    });
}

// Function to render a single toy
function renderToy(toy) {
  const toyCard = document.createElement('div');
  toyCard.className = 'toy-card';
  toyCard.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" alt="${toy.name}" />
    <p>Likes: <span class="like-count">${toy.likes}</span></p>
    <button class="like-btn" data-id="${toy.id}">Like</button>
  `;
  toyCollection.appendChild(toyCard);
}

// Function to add a new toy
function addNewToy(event) {
  event.preventDefault();
  
  const name = event.target.name.value;
  const image = event.target.image.value;

  const newToy = { name, image, likes: 0 };
  
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newToy),
  })
    .then(response => response.json())
    .then(renderToy);

  // Reset form fields
  addToyForm.reset();
}

// Function to like a toy
function likeToy(event) {
  if (event.target.classList.contains('like-btn')) {
    const toyId = event.target.getAttribute('data-id');
    const likeCountSpan = event.target.previousElementSibling.querySelector('.like-count');
    let currentLikes = parseInt(likeCountSpan.innerText);

    currentLikes++;
    likeCountSpan.innerText = currentLikes;

    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ likes: currentLikes }),
    });
  }
}

// Event listeners
addToyForm.addEventListener('submit', addNewToy);
toyCollection.addEventListener('click', likeToy);

// Fetch toys on page load
document.addEventListener('DOMContentLoaded', fetchToys);

