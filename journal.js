// --- DATA & STATE ---
let notes = JSON.parse(localStorage.getItem('therapeutic_notes_v1')) || [
    { id: Date.now(), title: 'First Reflection', content: '<div>What made you smile today?</div><div><br></div>', date: new Date().toISOString(), mood: 'blue' }
];
let activeNoteId = notes[0]?.id;

// --- ELEMENTS ---
const editor = document.getElementById('editor');
const notesList = document.getElementById('notes-list');
const saveStatus = document.getElementById('save-status');

// --- SYNC / SELECT ---
window.selectNote = function(id) {
    // Save existing active note before switching
    window.saveActiveNote();

    activeNoteId = id;
    const note = notes.find(n => n.id === id);
    
    // Re-render
    if (editor) {
        editor.innerHTML = note.content;
    }
    
    const dateFull = document.getElementById('note-date-full');
    if (dateFull) {
        dateFull.innerText = new Date(note.date).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
        });
    }

    window.renderNotesList();
    
    // Soft Transition effect on text
    if (editor) {
        editor.classList.remove('fade-in-text');
        void editor.offsetWidth; // trigger reflow
        editor.classList.add('fade-in-text');
    }

    updateMoodUI(note.mood);
}

window.createNewNote = function() {
    const newNote = {
        id: Date.now(),
        title: 'New Entry',
        content: '',
        date: new Date().toISOString(),
        mood: 'blue'
    };
    notes.unshift(newNote);
    activeNoteId = newNote.id;
    window.selectNote(newNote.id);
}

window.saveActiveNote = function() {
    if (!activeNoteId || !editor) return;
    const idx = notes.findIndex(n => n.id === activeNoteId);
    if (idx === -1) return;

    // Extract title from first line
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = editor.innerHTML;
    const textContent = tempDiv.innerText.trim();
    const firstLine = textContent.split('\n')[0] || 'Untitled';
    
    notes[idx].content = editor.innerHTML;
    notes[idx].title = firstLine.length > 30 ? firstLine.substring(0, 30) + '...' : firstLine;
    
    localStorage.setItem('therapeutic_notes_v1', JSON.stringify(notes));
    
    if (saveStatus) {
        saveStatus.innerText = "Synced";
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(saveStatus, { opacity: 0.2 }, { opacity: 0.8, duration: 0.3, yoyo: true, repeat: 1 });
        }
    }
}

window.renderNotesList = function() {
    if (!notesList) return;
    notesList.innerHTML = '';
    notes.forEach(note => {
        const item = document.createElement('div');
        item.className = `note-item ${note.id === activeNoteId ? 'active' : ''}`;
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = note.content;
        const plainText = tempDiv.innerText.trim();
        const previewText = plainText.split('\n').filter(l => l.length > 0)[1] || 'Start writing...';

        item.innerHTML = `
            <div class="note-content-wrapper" onclick="selectNote(${note.id})">
                <div class="note-title">${note.title || 'Untitled'}</div>
                <div class="note-preview">${previewText}</div>
                <div class="note-date">${new Date(note.date).toLocaleDateString()}</div>
            </div>
            <div class="delete-note" onclick="deleteNote(${note.id})" title="Delete">
                <i class="ph ph-trash"></i>
            </div>
        `;
        notesList.appendChild(item);
    });
}

window.deleteNote = function(id) {
    if (notes.length <= 1) {
        alert("The sanctuary requires at least one page for reflection.");
        return;
    }
    if (!confirm("Are you sure you want to let go of this reflection?")) return;

    const idx = notes.findIndex(n => n.id === id);
    notes.splice(idx, 1);

    if (activeNoteId === id) {
        activeNoteId = notes[0].id;
        window.selectNote(activeNoteId);
    } else {
        window.renderNotesList();
    }
    localStorage.setItem('therapeutic_notes_v1', JSON.stringify(notes));
}

// --- COMMANDS ---
window.execCmd = function(cmd, val = null) {
    document.execCommand('styleWithCSS', false, true); // Use spans for colors
    document.execCommand(cmd, false, val);
    if (editor) editor.focus();
}

window.insertChecklist = function() {
    // Very simple checklist implementation
    const tag = `<div><input type="checkbox" style="width: 16px; height: 16px; margin-right: 8px; vertical-align: middle;">Task description</div>`;
    window.execCmd('insertHTML', tag);
}

// --- FOCUS MODE ---
const focusBtn = document.getElementById('focus-btn');
if (focusBtn) {
    focusBtn.addEventListener('click', () => {
        document.body.classList.toggle('focus-mode');
        const isActive = document.body.classList.contains('focus-mode');
        focusBtn.classList.toggle('active', isActive);
        
        if (typeof gsap !== 'undefined') {
            if(isActive) {
                gsap.to(".sidebar", { width: 0, opacity: 0, duration: 0.5 });
            } else {
                gsap.to(".sidebar", { width: 320, opacity: 1, duration: 0.5 });
            }
        }
    });
}

// --- MOOD ---
function updateMoodUI(mood) {
    document.querySelectorAll('.mood-dot').forEach(dot => {
        dot.classList.toggle('active', dot.dataset.mood === mood);
    });
}

document.querySelectorAll('.mood-dot').forEach(dot => {
    dot.addEventListener('click', () => {
        const mood = dot.dataset.mood;
        const idx = notes.findIndex(n => n.id === activeNoteId);
        if (idx !== -1) {
            notes[idx].mood = mood;
            updateMoodUI(mood);
            window.saveActiveNote();
            window.renderNotesList();
        }
    });
});

// --- INIT ---
window.addEventListener('load', () => {
    if (typeof gsap !== 'undefined') {
        gsap.to("body", { opacity: 1, duration: 1, ease: "power2.out" });
    }
    window.renderNotesList();
    if (activeNoteId) window.selectNote(activeNoteId);
    
    // Auto Save
    let timeout;
    if (editor) {
        editor.addEventListener('input', () => {
            if (saveStatus) saveStatus.innerText = "Syncing...";
            clearTimeout(timeout);
            timeout = setTimeout(window.saveActiveNote, 1500);
        });
    }

    const addNoteBtn = document.getElementById('add-note-btn');
    if (addNoteBtn) {
        addNoteBtn.onclick = window.createNewNote;
    }
});
