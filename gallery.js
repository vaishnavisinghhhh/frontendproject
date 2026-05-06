const canvas = document.getElementById('canvas');
let zIndexCounter = 10;

// Intro animation
if (typeof gsap !== 'undefined') {
    gsap.to("body", { opacity: 1, duration: 1, ease: "power2.out" });
}

// Page transition
window.transitionTo = function (url) {
    if (typeof gsap !== 'undefined') {
        gsap.to("body", {
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
                window.location.href = url;
            }
        });
    } else {
        window.location.href = url;
    }
}

// Generate Item ID
function generateId() {
    return 'item-' + Math.random().toString(36).substr(2, 9);
}

// Hide empty state if items exist
function checkEmptyState() {
    const emptyState = document.getElementById('empty-state');
    if (!emptyState || !canvas) return;
    
    const hasItems = canvas.querySelectorAll('.canvas-item').length > 0;
    if (hasItems) {
        emptyState.style.display = 'none';
    } else {
        emptyState.style.display = 'block';
    }
}

// Wrap HTML for canvas items to include handles
function wrapCanvasItem(contentHtml, x, y, zIndex, width = 'auto', height = 'auto', isResizable = false) {
    const id = generateId();
    const resizeStyle = isResizable ? `width: ${width}; height: ${height};` : '';
    const wrapperClass = isResizable ? 'resize-wrapper' : '';
    
    return `
        <div id="${id}" class="canvas-item" style="left: ${x}px; top: ${y}px; z-index: ${zIndex};">
            <div class="drag-handle"></div>
            <button class="delete-btn" onclick="deleteItem('${id}')">×</button>
            <div class="${wrapperClass}" style="${resizeStyle}">
                ${contentHtml}
            </div>
        </div>
    `;
}

// Add Text
window.addText = function() {
    if (!canvas) return;
    zIndexCounter++;
    const textHtml = `<div class="item-text-content font-editorial text-4xl" contenteditable="true" spellcheck="false" style="color: white;">Editable Text</div>`;
    
    // Position near center of CURRENT viewport
    const x = window.scrollX + window.innerWidth / 2 - 100 + (Math.random() * 40 - 20);
    const y = window.scrollY + window.innerHeight / 2 - 50 + (Math.random() * 40 - 20);
    
    canvas.insertAdjacentHTML('beforeend', wrapCanvasItem(textHtml, x, y, zIndexCounter));
    checkEmptyState();
}

// Stickers
// Stickers / Editorial Labels
const stickersList = ['THRIVE', 'TRANSFORM', 'DAY BY DAY', 'FLOW', 'ZEN', 'PURE', 'FOCUS', 'MANIFEST'];
const stickerPanel = document.getElementById('sticker-panel');

if (stickerPanel) {
    stickersList.forEach(s => {
        const btn = document.createElement('button');
        btn.className = 'sticker-btn';
        btn.innerText = s;
        btn.onclick = () => window.addSticker(s);
        stickerPanel.appendChild(btn);
    });
}

window.toggleStickers = function() {
    if (stickerPanel) {
        stickerPanel.style.display = stickerPanel.style.display === 'grid' ? 'none' : 'grid';
    }
}

window.addSticker = function(label) {
    if (!canvas) return;
    zIndexCounter++;
    const textHtml = `<div class="item-text-content font-display text-white border border-white/20 px-4 py-2 uppercase tracking-widest text-lg bg-black/40 backdrop-blur-md" style="font-size: 1.5rem;">${label}</div>`;
    
    // Position near center of CURRENT viewport
    const x = window.scrollX + window.innerWidth / 2 - 50 + (Math.random() * 40 - 20);
    const y = window.scrollY + window.innerHeight / 2 - 50 + (Math.random() * 40 - 20);
    
    canvas.insertAdjacentHTML('beforeend', wrapCanvasItem(textHtml, x, y, zIndexCounter));
    checkEmptyState();
    window.toggleStickers();
}

// Handle Image Upload
window.handleImageUpload = function(event) {
    if (!canvas) return;
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const imgData = e.target.result;
        zIndexCounter++;
        
        // We create a wrapper that is resizable
        const imgHtml = `<img src="${imgData}" class="item-image" alt="Gallery photo" />`;
        
        // Position near center of CURRENT viewport
        const x = window.scrollX + window.innerWidth / 2 - 150 + (Math.random() * 40 - 20);
        const y = window.scrollY + window.innerHeight / 2 - 200 + (Math.random() * 40 - 20);
        
        canvas.insertAdjacentHTML('beforeend', wrapCanvasItem(imgHtml, x, y, zIndexCounter, '300px', '400px', true));
        checkEmptyState();
        
        // Reset input
        event.target.value = '';
    };
    reader.readAsDataURL(file);
}

// Delete Item
window.deleteItem = function(id) {
    const el = document.getElementById(id);
    if (el) {
        el.remove();
        checkEmptyState();
    }
}

// Dragging Logic using Event Delegation
let isDragging = false;
let dragTarget = null;
let startX, startY, initialLeft, initialTop;

if (canvas) {
    canvas.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('drag-handle')) {
            // We drag by the handle
            isDragging = true;
            dragTarget = e.target.closest('.canvas-item');
            
            // Bring to front
            zIndexCounter++;
            dragTarget.style.zIndex = zIndexCounter;

            startX = e.clientX;
            startY = e.clientY;
            initialLeft = parseInt(dragTarget.style.left || 0);
            initialTop = parseInt(dragTarget.style.top || 0);

            dragTarget.classList.add('active');
        } else if (e.target.classList.contains('item-image')) {
            // Bring image to front naturally if clicked
            const item = e.target.closest('.canvas-item');
            if (item) {
                zIndexCounter++;
                item.style.zIndex = zIndexCounter;
            }
        } else if (e.target.classList.contains('item-text-content')) {
            // Focus text, bring to front
            const item = e.target.closest('.canvas-item');
            if (item) {
                zIndexCounter++;
                item.style.zIndex = zIndexCounter;
            }
        }
    });
}

window.addEventListener('mousemove', (e) => {
    if (!isDragging || !dragTarget) return;
    
    e.preventDefault(); // Prevent text selection while dragging that handle
    
    const currentX = e.clientX;
    const currentY = e.clientY;
    const dx = currentX - startX;
    const dy = currentY - startY;
    
    dragTarget.style.left = (initialLeft + dx) + 'px';
    dragTarget.style.top = (initialTop + dy) + 'px';
});

window.addEventListener('mouseup', () => {
    if (isDragging && dragTarget) {
        dragTarget.classList.remove('active');
        isDragging = false;
        dragTarget = null;
    }
});

// Save state to localStorage
window.saveCanvas = function() {
    if (!canvas) return;
    // Before saving, we must capture current structural modifications like inline styles
    // But thankfully innerHTML accurately captures standard style attributes modified via JavaScript
    // Except we might want to clean up classes
    const items = canvas.innerHTML;
    localStorage.setItem('gallery_layout', items);
    
    // Brief visual feedback
    const saveBtn = document.querySelector('button[onclick="saveCanvas()"]');
    if (saveBtn) {
        const originalText = saveBtn.innerText;
        saveBtn.innerText = 'Saved!';
        saveBtn.classList.add('bg-green-500/30', 'text-white');
        setTimeout(() => {
            saveBtn.innerText = originalText;
            saveBtn.classList.remove('bg-green-500/30', 'text-white');
        }, 1500);
    }
}

window.clearCanvas = function() {
    if (!canvas) return;
    if(confirm("Are you sure you want to clear the entire canvas? This cannot be undone unless you exit without saving.")) {
        canvas.innerHTML = \`
        <div id="empty-state" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-500 pointer-events-none select-none">
            <h2 class="font-editorial text-4xl mb-2 text-white/40">Your Editorial Canvas</h2>
            <p>Add texts and photos to build your personalized gallery.</p>
        </div>
        \`;
    }
}

// Load state on startup
window.addEventListener('DOMContentLoaded', () => {
    // Scroll to center of canvas
    window.scrollTo({
        left: 2500 - window.innerWidth / 2,
        top: 2500 - window.innerHeight / 2,
        behavior: 'instant'
    });

    if (canvas) {
        const savedLayout = localStorage.getItem('gallery_layout');
        if (savedLayout) {
            canvas.innerHTML = savedLayout;
            checkEmptyState();
            
            // Let's evaluate z-indexes to update the counter so new items go on top
            const items = canvas.querySelectorAll('.canvas-item');
            let maxZ = 10;
            items.forEach(item => {
                const z = parseInt(item.style.zIndex) || 10;
                if (z > maxZ) maxZ = z;
            });
            zIndexCounter = maxZ;
        }
    }
});
