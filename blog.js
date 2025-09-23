// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

function setTheme(theme) {
    if (theme === 'dark') {
        htmlElement.classList.add('dark');
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        htmlElement.classList.remove('dark');
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        localStorage.setItem('theme', 'light');
    }
    updateIcons();
}

function updateIcons() {
    const isDark = htmlElement.classList.contains('dark');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    
    if (sunIcon && moonIcon) {
        if (isDark) {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    }
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const newTheme = htmlElement.classList.contains('dark') ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

// Rich Text Editor Functionality
const editor = document.getElementById('editor');
const boldBtn = document.getElementById('bold-btn');
const italicBtn = document.getElementById('italic-btn');
const underlineBtn = document.getElementById('underline-btn');
const textColor = document.getElementById('text-color');
const noteTitle = document.getElementById('note-title');
const saveBtn = document.getElementById('save-note');
const fileUpload = document.getElementById('file-upload');
const fileList = document.getElementById('file-list');
const notesContainer = document.getElementById('notes-container');

let attachedFiles = [];

// Formatting functions
if (boldBtn) boldBtn.addEventListener('click', () => document.execCommand('bold'));
if (italicBtn) italicBtn.addEventListener('click', () => document.execCommand('italic'));
if (underlineBtn) underlineBtn.addEventListener('click', () => document.execCommand('underline'));
if (textColor) textColor.addEventListener('change', (e) => document.execCommand('foreColor', false, e.target.value));

// File upload handling
if (fileUpload) {
    fileUpload.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        attachedFiles = [...attachedFiles, ...files];
        displayFileList();
    });
}

function displayFileList() {
    if (fileList) {
        fileList.innerHTML = attachedFiles.map((file, index) => 
            `<div class="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1">
                <span class="text-sm">${file.name}</span>
                <button onclick="removeFile(${index})" class="text-red-500 hover:text-red-700">×</button>
            </div>`
        ).join('');
    }
}

function removeFile(index) {
    attachedFiles.splice(index, 1);
    displayFileList();
}

// Save note functionality
if (saveBtn) saveBtn.addEventListener('click', saveNote);

function saveNote() {
    const title = noteTitle ? noteTitle.value.trim() : '';
    const content = editor ? editor.innerHTML : '';
    
    if (!title || !content || content === '<br>' || content === '<div><br></div>') {
        alert('Please enter both title and content');
        return;
    }

    const note = {
        id: Date.now(),
        title,
        content,
        files: attachedFiles.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type
        })),
        timestamp: new Date().toLocaleString()
    };

    // Save to localStorage
    const notes = JSON.parse(localStorage.getItem('blogNotes') || '[]');
    notes.unshift(note);
    localStorage.setItem('blogNotes', JSON.stringify(notes));

    // Clear form
    if (noteTitle) noteTitle.value = '';
    if (editor) editor.innerHTML = '';
    attachedFiles = [];
    displayFileList();

    // Refresh notes display
    displayNotes();
    
    alert('Note saved successfully!');
}

// Display saved notes
function displayNotes() {
    if (!notesContainer) return;
    
    const notes = JSON.parse(localStorage.getItem('blogNotes') || '[]');
    
    if (notes.length === 0) {
        notesContainer.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400">No notes yet. Create your first note above!</p>';
        return;
    }

    notesContainer.innerHTML = notes.map(note => `
        <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 mb-6 hover:border-indigo-600 dark:hover:border-indigo-400 transition-colors duration-300">
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">${escapeHtml(note.title)}</h3>
                <div class="flex gap-2 items-center">
                    <span class="text-sm text-gray-500 dark:text-gray-400">${note.timestamp}</span>
                    <button onclick="deleteNote(${note.id})" class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors">🗑️</button>
                </div>
            </div>
            <div class="prose dark:prose-invert max-w-none mb-4">${note.content}</div>
            ${note.files.length > 0 ? `
                <div class="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attachments:</h4>
                    ${note.files.map(file => `
                        <div class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <span>📎</span>
                            <span>${escapeHtml(file.name)}</span>
                            <span class="text-xs">(${(file.size/1024).toFixed(1)}KB)</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function deleteNote(id) {
    if (confirm('Are you sure you want to delete this note?')) {
        const notes = JSON.parse(localStorage.getItem('blogNotes') || '[]');
        const filteredNotes = notes.filter(note => note.id !== id);
        localStorage.setItem('blogNotes', JSON.stringify(filteredNotes));
        displayNotes();
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Editor placeholder functionality
if (editor) {
    editor.addEventListener('focus', function() {
        if (this.innerHTML === '' || this.innerHTML === '<br>') {
            this.innerHTML = '';
        }
    });

    editor.addEventListener('blur', function() {
        if (this.innerHTML === '') {
            this.innerHTML = '<br>';
        }
    });

    // Add placeholder styling
    editor.addEventListener('input', function() {
        if (this.innerHTML === '' || this.innerHTML === '<br>') {
            this.classList.add('empty');
        } else {
            this.classList.remove('empty');
        }
    });
}

// Initialize notes display on page load
document.addEventListener('DOMContentLoaded', () => {
    displayNotes();
    updateIcons();
});

// Additional formatting functions
function insertLink() {
    const url = prompt('Enter URL:');
    if (url) {
        document.execCommand('createLink', false, url);
    }
}

function insertImage() {
    const url = prompt('Enter image URL:');
    if (url) {
        document.execCommand('insertImage', false, url);
    }
}

// Export/Import functionality
function exportNotes() {
    const notes = localStorage.getItem('blogNotes');
    if (notes) {
        const blob = new Blob([notes], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'blog-notes.json';
        a.click();
        URL.revokeObjectURL(url);
    }
}

function importNotes(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedNotes = JSON.parse(e.target.result);
                localStorage.setItem('blogNotes', JSON.stringify(importedNotes));
                displayNotes();
                alert('Notes imported successfully!');
            } catch (error) {
                alert('Error importing notes. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
}
