let bottomContainer = document.getElementById("bottom-container");
let newNoteForm = document.getElementById("new-note-form");
//let noteForm = document.getElementById("note-form");
let folderContainer = document.getElementById("folder-container");
let newFolderForm = document.getElementById("folder-form");
//let changeBtn = document.getElementById("change-btn");

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("user")) || null;
}

const colors = ["pink", "lightgreen", "yellow", "violet"];

function getNotes() {
    const user = getCurrentUser();
    const notesObj = JSON.parse(localStorage.getItem(`${user}-notes`)) || [];
    return notesObj;
}

let notesObj = getNotes();
console.log(notesObj);

function getFolders() {
    const user = getCurrentUser();
    const folders = JSON.parse(localStorage.getItem(`${user}-folders`)) || [
        {
            name: "General",
            id: 1
        }];
    return folders;
}

const folders = getFolders();
console.log(folders);

let idCount = 0;

// Deleting a Note
function deleteNote(id) {
    console.log(id);
    let note = document.getElementById(id);

    notesObj = notesObj.filter(note => note.id !== id);
    const user = getCurrentUser();
    localStorage.setItem(`${user}-notes`, JSON.stringify(notesObj));
    bottomContainer.textContent = "";
    notesObj.filter(eachObj => eachObj.folder === selectedFolder).forEach(eachObj => {
        addNote(eachObj);
    });
}

/*function changeSave(event) {
    event.preventDefault();

    if (noteTitle.value !== "") {
        const newNote = {
            title: noteTitle.value,
            desc: noteDesc.value,
            folder: folderName.value,
            id: idCount
        }
    }
}*/

let editingNoteId = null;
let selectedFolder = 'General';

// Editing a note
function editNote(id) {
    editingNoteId = id;
    let note = document.getElementById(id);
    newNoteForm.style.removeProperty("display");

    noteTitle.value = notesObj[id].title;
    noteDesc.value = notesObj[id].desc;
    folderName.value = notesObj[id].folder;    
}

// Adding New Note
function addNote(obj) {
    newNoteForm.style.display = "none";

    let noteContainer = document.createElement("div");
    noteContainer.id = obj.id;
    noteContainer.style.backgroundColor = obj.bg;
    noteContainer.classList.add("note");
    bottomContainer.appendChild(noteContainer);

    let noteTopContainer = document.createElement('div');
    noteContainer.appendChild(noteTopContainer);
    noteTopContainer.classList.add('note-top-container');

    let titleEl = document.createElement("h1");
    titleEl.textContent = obj.title;
    titleEl.style.order = 0;
    noteTopContainer.appendChild(titleEl);
    
    let noteModifycontainer = document.createElement('div');
    noteTopContainer.appendChild(noteModifycontainer);

    let deleteBtn = document.createElement("img");
    deleteBtn.src = "./images/delete.jpg";
    deleteBtn.classList.add("folder-img");
    deleteBtn.onclick = function() {
        deleteNote(obj.id);
    };
    noteModifycontainer.appendChild(deleteBtn);

    let editBtn = document.createElement("img");
    editBtn.src = "./images/edit.png";
    editBtn.classList.add("folder-img");
    editBtn.onclick = function() {
        editNote(obj.id);
    };
    noteModifycontainer.appendChild(editBtn);

    let ruleEl = document.createElement("hr");
    noteContainer.appendChild(ruleEl);

    let descEl = document.createElement("p");
    descEl.textContent = obj.desc;
    noteContainer.appendChild(descEl);
}

// Rendering the folders
function folderRendering() {
    folderContainer.textContent = "";

    // Storing folders to localstorage
    const user = getCurrentUser();
    localStorage.setItem(`${user}-folders`, JSON.stringify(folders));

    folders.map(eachFolder => {
        let folderDiv = document.createElement("div");
        folderDiv.textContent = eachFolder.name;
        folderDiv.id = eachFolder.id;
        folderDiv.classList.add("folder");
        folderDiv.addEventListener('click', ()=> {
            selectedFolder = eachFolder.name;
            bottomContainer.textContent = "";

            notesObj.filter(eachObj => eachObj.folder === selectedFolder).forEach(eachObj => {
                addNote(eachObj);
            });
        })
        folderContainer.appendChild(folderDiv);

        let imgEl = document.createElement("img");
        imgEl.src = "./images/folder.jpg";
        imgEl.alt = "folder"
        imgEl.classList.add("folder-img");
        folderDiv.appendChild(imgEl);
    });
}

// Showing new Note Form
function newNote() {
    newNoteForm.style.removeProperty("display");
}

// New Note form submission and rendering notes
function submitForm(event) {
    event.preventDefault();

    const randomIndex = Math.floor(Math.random() * colors.length);
    if (noteTitle.value !== "") {
        const newNote = {
            title: noteTitle.value,
            desc: noteDesc.value,
            folder: folderName.value,
            id: idCount,
            bg: colors[randomIndex],
        }

        idCount += 1;

        noteTitle.value = "";
        noteDesc.value = "";

        if (!folders.some(folder => folder.name === folderName.value)) {
            folders.push({
                name: folderName.value,
                id: folders.length + 1
            });
        }

        folderRendering();
        
        // Editing an existing note, update the existing note in notesObj
        if (editingNoteId !== null) {
            newNote.id = editingNoteId;
            notesObj[editingNoteId] = newNote;
            editingNoteId = null;
            newNoteForm.style.display = "none";
        } else {
            // Adding a new note
            notesObj.push(newNote);
        }

        // Storing notes to localstorage
        const user = getCurrentUser();
        localStorage.setItem(`${user}-notes`, JSON.stringify(notesObj));

        bottomContainer.textContent = "";

        notesObj.filter(eachObj => eachObj.folder === selectedFolder).forEach(eachObj => {
            addNote(eachObj);
        });
        console.log(notesObj);
        
    } else {
        alert("Title Should not be Empty");
    }
}

// Logging out the user
function logout() {
    localStorage.removeItem("authenticated");
    window.location.href = "login.html";
}

// Showing Folder Creating Form
function newFolder(name) {
    newFolderForm.style.removeProperty("display");
}

// Creating New Folder
function addFolder(event) {
    event.preventDefault();
    let folderNameInput = document.getElementById("folder-name");
    let folderName = folderNameInput.value;

    if (folderName.trim() === "") {
        alert("Please enter a folder name.");
        return;
    }

    if (!folders.some(folder => folder.name.toLowerCase() === folderName.toLowerCase())) {
        folders.push({
            name: folderName,
            id: folders.length + 1
        });
        folderContainer.textContent = "";
        folderRendering();
        
    } else {
        alert("Folder Already Exists.");
    }

    folderNameInput.value = "";
    newFolderForm.style.display = "none";
}

// Note Form Close function
function closeForm() {
    newNoteForm.style.display = "none";
}


function renderUserNotes() {
    bottomContainer.textContent = "";

    notesObj.filter(eachObj => eachObj.folder === selectedFolder).forEach(eachObj => {
        addNote(eachObj);
    });
}
folderRendering();
renderUserNotes();