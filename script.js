const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');

function addTask() {
    if (inputBox.value === '') {
        alert('Please enter a task.');
    } else {
        let li = document.createElement('li');
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);

        let spanEdit = document.createElement('span');
        spanEdit.innerHTML = "✎"; // Using plain pencil icon for edit
        spanEdit.className = 'edit';
        li.appendChild(spanEdit);

        let spanDelete = document.createElement('span');
        spanDelete.innerHTML = "\u00D7"; // Unicode for multiplication sign (delete)
        spanDelete.className = 'delete';
        li.appendChild(spanDelete);

        inputBox.value = "";
        saveData();
    }
}

// Allow adding tasks by pressing Enter
inputBox.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && inputBox.value.trim() !== '') {
        addTask();
    }
});

listContainer.addEventListener("click", function(e) {
    if (e.target.tagName === 'LI') {
        e.target.classList.toggle('checked');
        saveData();
    } else if (e.target.classList.contains('delete')) {
        e.target.parentElement.remove();
        saveData();
    } else if (e.target.classList.contains('edit')) {
        let li = e.target.parentElement;
        let taskText = li.firstChild.textContent.trim();
        
        // Create input element for inline editing
        let input = document.createElement('input');
        input.type = 'text';
        input.value = taskText;
        input.className = 'edit-input';
        
        // Change edit icon to save icon
        let editIcon = e.target;
        editIcon.innerHTML = '✔'; // Checkmark icon for save
        editIcon.className = 'save';
        
        // Replace task text with input
        li.firstChild.replaceWith(input);
        input.focus();

        // Save on Enter key
        input.addEventListener('keypress', function handler(e) {
            if (e.key === 'Enter' && input.value.trim() !== '') {
                li.firstChild.replaceWith(document.createTextNode(input.value.trim()));
                li.querySelector('.save').innerHTML = '✎'; // Revert to edit icon
                li.querySelector('.save').className = 'edit';
                saveData();
            }
        });

        // Save on blur (if not empty)
        input.addEventListener('blur', function handler() {
            if (input.value.trim() !== '') {
                li.firstChild.replaceWith(document.createTextNode(input.value.trim()));
                li.querySelector('.save').innerHTML = '✎'; // Revert to edit icon
                li.querySelector('.save').className = 'edit';
                saveData();
            } else {
                li.remove(); // Remove task if input is empty
                saveData();
            }
        });

        // Save on save button click
        editIcon.addEventListener('click', function handler(e) {
            e.stopPropagation(); // Prevent triggering edit handler
            if (input.value.trim() !== '') {
                li.firstChild.replaceWith(document.createTextNode(input.value.trim()));
                editIcon.innerHTML = '✎'; // Revert to edit icon
                editIcon.className = 'edit';
                saveData();
            } else {
                li.remove(); // Remove task if input is empty
                saveData();
            }
            // Remove this click listener to prevent multiple bindings
            editIcon.removeEventListener('click', handler);
        });
    }
}, false);

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTasks() {
    listContainer.innerHTML = localStorage.getItem("data") || "";
}

showTasks();