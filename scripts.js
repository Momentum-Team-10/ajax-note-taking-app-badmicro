/* globals fetch, moment */
console.log("Hello, World!");

const url = "http://localhost:3000/notes";
const notes = document.getElementById("Notes-list");
const form = document.querySelector("#note-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const noteTitle = document.getElementById("note-title").value;
  const noteText = document.getElementById("note-text").value;

  console.log(noteTitle);
  createNote(noteTitle, noteText);
  form.reset();
});

notes.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    deleteNote(e.target);
  }
  if (e.target.classList.contains("edit")) {
    updateNote(e.target);
  }
});

function listNotes() {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      for (let item of data) {
        renderNoteItem(item);
      }
    });
}

function renderNoteItem(noteObj) {
  const li = document.createElement("li");
  li.id = noteObj.id;
  li.title = noteObj.title;
  li.classList.add(
    "lh-copy",
    "pv3",
    "ba",
    "b--dashed",
    "b--black-3",
    "ma2",
    "pa2"
  );
  renderNoteText(li, noteObj);
  notes.appendChild(li);
}

function renderNoteText(li, noteObj) {
  if (noteObj.updated_at) {
    li.innerHTML = `
    <p class="fw6 bb w-75">${noteObj.title} :: ${moment(
      noteObj.updated_at
    ).format("DD MMM YYYY HH:mm")}</p>
    <i class="ml2 dark-red fas fa-times delete cursor: pointer"></i><i class="ml3 fas fa-edit edit cursor: pointer"></i>
    <p class="dib w-60">${noteObj.body}</p>
    `;
  } else {
    li.innerHTML = `
    <p class="fw6 bb w-75">${noteObj.title} :: ${moment(
      noteObj.created_at
    ).format("DD MMM YYYY HH:mm")}</p>
    <i class="ml2 dark-red fas fa-times delete cursor: pointer"></i><i class="ml3 fas fa-edit edit cursor: pointer"></i>
    <p class="dib mw-60">${noteObj.body}</p>
    `;
  }
}

function createNote(title, text) {
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title,
      body: text,
      created_at: moment().format(),
    }),
  })
    .then((res) => res.json())
    .then((data) => renderNoteItem(data));
}

function deleteNote(noteEl) {
  fetch(url + "/" + `${noteEl.parentElement.id}`, {
    method: 'DELETE'
  }).then(() => noteEl.parentElement.remove());
}

function updateNote(noteEl) {
  const noteTitle = document.getElementById("note-title").value;
  const noteText = document.getElementById("note-text").value;
  fetch(url + "/" + `${noteEl.parentElement.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: noteTitle,
      body: noteText,
      updated_at: moment().format(),
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      renderNoteText(noteEl.parentElement, data);
    });
}

listNotes();
