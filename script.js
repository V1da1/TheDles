// Default games
const defaultGames = {
    daily: [
        { name: "NYT Wordle", url: "https://www.nytimes.com/games/wordle/index.html", emoji: "🎯" },
        { name: "Termo", url: "https://term.ooo/", emoji: "🔤" },
        { name: "Duotrigordle", url: "https://duotrigordle.com/", emoji: "🎲" },
        { name: "Spellcheck", url: "https://spellcheckgame.com/", emoji: "✍️" },
        { name: "Futbol11", url: "https://futbol-11.com/", emoji: "⚽" },
        { name: "Globle", url: "https://globle-game.com/", emoji: "🌍" },
        { name: "Worldle", url: "https://worldle.teuteuf.fr/", emoji: "🗺️" },
        { name: "Flagle", url: "https://www.flagle.io/", emoji: "🏳️" },
        { name: "Flagle Game", url: "https://flagle-game.com/", emoji: "🎌" },
        { name: "NYT Connections", url: "https://www.nytimes.com/games/connections", emoji: "🔗" },
        { name: "Gamedle", url: "https://www.gamedle.wtf/#", emoji: "🎮" }
    ],
    other: []
};

// Load saved games from localStorage
function loadGames() {
    let savedGames;
    try {
        savedGames = JSON.parse(localStorage.getItem('games'));
        // Check if the saved data has the correct structure
        if (!savedGames || !Array.isArray(savedGames.daily) || !Array.isArray(savedGames.other)) {
            throw new Error('Invalid data structure');
        }
    } catch (e) {
        // If there's any error (invalid JSON or wrong structure), reset to defaults
        savedGames = defaultGames;
        localStorage.setItem('games', JSON.stringify(defaultGames));
    }
    
    // Clear existing lists
    document.getElementById('dailyGames').innerHTML = '';
    document.getElementById('otherGames').innerHTML = '';
    
    // Add saved games to their respective lists
    savedGames.daily.forEach(game => addGameToList(game, 'dailyGames'));
    savedGames.other.forEach(game => addGameToList(game, 'otherGames'));

    // Add remove buttons to existing items
    const existingItems = document.querySelectorAll('.game-item');
    existingItems.forEach(item => {
        if (!item.querySelector('.remove-button')) {
            const removeButton = document.createElement('button');
            removeButton.className = 'remove-button';
            removeButton.innerHTML = '×';
            removeButton.onclick = function() { removeGame(this); };
            item.appendChild(removeButton);
        }
    });
}

// Add a game to the specified list
function addGameToList(game, listId) {
    const list = document.getElementById(listId);
    const li = document.createElement('li');
    li.className = 'game-item';
    li.draggable = true;
    li.innerHTML = `
        <a href="${game.url}" class="game-link" target="_blank">
            ${game.emoji} ${game.name}
        </a>
        <button class="remove-button" onclick="removeGame(this)">×</button>
    `;

    // Add drag and drop event listeners
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragend', handleDragEnd);
    
    list.appendChild(li);
}

// Remove a game from the list
function removeGame(button) {
    const li = button.parentElement;
    li.remove();
    saveGames();
}

// Toggle list expansion
function toggleList(listId) {
    const list = document.getElementById(listId);
    const button = list.nextElementSibling;
    list.classList.toggle('collapsed');
    button.textContent = list.classList.contains('collapsed') ? 'Show More' : 'Show Less';
}

// Drag and drop functionality
function handleDragStart(e) {
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', this.innerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
}

// Initialize drag and drop for lists
function initializeDragAndDrop() {
    const lists = document.querySelectorAll('.game-list');
    lists.forEach(list => {
        list.addEventListener('dragover', e => {
            e.preventDefault();
            list.classList.add('drag-over');
        });

        list.addEventListener('dragleave', () => {
            list.classList.remove('drag-over');
        });

        list.addEventListener('drop', e => {
            e.preventDefault();
            list.classList.remove('drag-over');
            
            const draggedItem = document.querySelector('.dragging');
            if (draggedItem) {
                const newList = e.target.closest('.game-list');
                if (newList && newList !== draggedItem.parentElement) {
                    newList.appendChild(draggedItem);
                    saveGames();
                }
            }
        });
    });
}

// Save games to localStorage
function saveGames() {
    const dailyGames = Array.from(document.getElementById('dailyGames').children).map(li => {
        const link = li.querySelector('a');
        return {
            name: link.textContent.trim().split(' ').slice(1).join(' '),
            url: link.href,
            emoji: link.textContent.trim().split(' ')[0]
        };
    });

    const otherGames = Array.from(document.getElementById('otherGames').children).map(li => {
        const link = li.querySelector('a');
        return {
            name: link.textContent.trim().split(' ').slice(1).join(' '),
            url: link.href,
            emoji: link.textContent.trim().split(' ')[0]
        };
    });

    localStorage.setItem('games', JSON.stringify({
        daily: dailyGames,
        other: otherGames
    }));
}

// Handle form submission
document.getElementById('addGameForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const game = {
        name: document.getElementById('gameName').value,
        url: document.getElementById('gameUrl').value,
        emoji: document.getElementById('gameEmoji').value,
        type: document.getElementById('gameType').value
    };

    const listId = game.type === 'daily' ? 'dailyGames' : 'otherGames';
    addGameToList(game, listId);
    saveGames();

    // Reset form
    this.reset();
});

// Load saved games and initialize drag and drop when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadGames();
    initializeDragAndDrop();
}); 