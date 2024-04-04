document.addEventListener("DOMContentLoaded", function() {
    const monsterContainer = document.getElementById('monster-container');
    const createMonsterDiv = document.getElementById('create-monster');
    const backButton = document.getElementById('back');
    const forwardButton = document.getElementById('forward');
    const createMonsterForm = document.createElement('form');

    let currentPage = 1;

    createMonsterForm.innerHTML = `
        <input type="text" id="name" placeholder="Name">
        <input type="number" id="age" placeholder="Age">
        <input type="text" id="description" placeholder="Description">
        <button type="submit">Create Monster</button>
    `;
    createMonsterDiv.appendChild(createMonsterForm);

    backButton.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadMonsters();
        }
    });

    forwardButton.addEventListener('click', function() {
        currentPage++;
        loadMonsters();
    });

    createMonsterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const nameInput = document.getElementById('name');
        const ageInput = document.getElementById('age');
        const descriptionInput = document.getElementById('description');
        const name = nameInput.value.trim();
        const age = parseFloat(ageInput.value.trim());
        const description = descriptionInput.value.trim();
        if (name === '' || isNaN(age) || description === '') {
            alert('Please fill in all fields.');
            return;
        }
        createMonster(name, age, description);
        nameInput.value = '';
        ageInput.value = '';
        descriptionInput.value = '';
    });

    function loadMonsters() {
        const url = `http://localhost:3000/monsters/?_limit=50&_page=${currentPage}`;
        fetch(url)
        .then(response => response.json())
        .then(data => {
            displayMonsters(data);
        })
        .catch(error => {
            console.error('Error loading monsters:', error);
        });
    }

    function displayMonsters(monsters) {
        monsterContainer.innerHTML = '';
        monsters.forEach(monster => {
            const monsterItem = document.createElement('div');
            monsterItem.innerHTML = `
                <h3>Name: ${monster.name}</h3>
                <p>Age: ${monster.age}</p>
                <p>Description: ${monster.description}</p>
            `;
            monsterContainer.appendChild(monsterItem);
        });
    }

    function createMonster(name, age, description) {
        const url = 'http://localhost:3000/monsters';
        const formData = {
            name: name,
            age: age,
            description: description
        };
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Monster created:', data);
            loadMonsters();
        })
        .catch(error => {
            console.error('Error creating monster:', error);
        });
    }

    loadMonsters();
});
