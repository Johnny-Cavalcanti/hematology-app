// Importa o arquivo CSS para que o Vite o inclua no build final.
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const viewport = document.getElementById('microscope-viewport');
    const movableContent = document.getElementById('movable-content');
    const loadingOverlay = document.getElementById('loading-overlay');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const resetViewBtn = document.getElementById('reset-view');
    const zoomLevelDisplay = document.getElementById('zoom-level-display');
    const categorySelectorContainer = document.getElementById('category-selector-container');
    const activeSlideDisplay = document.getElementById('active-slide-display');
    const openModalBtn = document.getElementById('open-modal-btn');
    const slideModal = document.getElementById('slide-modal');
    const modalContent = document.getElementById('modal-content');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalCategoryTitle = document.getElementById('modal-category-title');
    const modalGrid = document.getElementById('modal-grid');

    // --- DADOS ESTRUTURADOS POR CATEGORIA ---
    const microscopyData = {
        "Hematologia": [
            { title: "Lâmina Contínua (1+2)", srcs: ["[https://i.postimg.cc/SK176WFp/lma-1.png](https://i.postimg.cc/SK176WFp/lma-1.png)", "[https://i.postimg.cc/CLCGPyT7/lma-2.png](https://i.postimg.cc/CLCGPyT7/lma-2.png)"] },
            { title: "Lâmina Contínua (3+4)", srcs: ["[https://i.postimg.cc/9FHPYmSz/lma-3.png](https://i.postimg.cc/9FHPYmSz/lma-3.png)", "[https://i.postimg.cc/vBfL6h92/linfocito-reativo.png](https://i.postimg.cc/vBfL6h92/linfocito-reativo.png)"] },
            { title: "Lâmina Mista (4+5+6)", srcs: ["[https://i.postimg.cc/vBfL6h92/linfocito-reativo.png](https://i.postimg.cc/vBfL6h92/linfocito-reativo.png)", "[https://i.postimg.cc/g0Y1kwZZ/eritroblastos.png](https://i.postimg.cc/g0Y1kwZZ/eritroblastos.png)", "[https://i.postimg.cc/W3zKgQSp/lamina-normal.png](https://i.postimg.cc/W3zKgQSp/lamina-normal.png)"] },
            { title: "Células Anormais (7+6)", srcs: ["[https://i.postimg.cc/KvpzvRxW/fagott-cells.png](https://i.postimg.cc/KvpzvRxW/fagott-cells.png)", "[https://i.postimg.cc/W3zKgQSp/lamina-normal.png](https://i.postimg.cc/W3zKgQSp/lamina-normal.png)"] },
            { title: "Alterações Leucocitárias (8+9+10)", srcs: ["[https://i.postimg.cc/8PzcShQW/bastonete-de-auer.png](https://i.postimg.cc/8PzcShQW/bastonete-de-auer.png)", "[https://i.postimg.cc/nhJD6Hcd/desvio-a-esquerda.png](https://i.postimg.cc/nhJD6Hcd/desvio-a-esquerda.png)", "[https://i.postimg.cc/2j1hWcKx/linfocitos.png](https://i.postimg.cc/2j1hWcKx/linfocitos.png)"] }
        ],
        "Microbiologia": [],
        "Câmara de Neubauer": [],
        "Citologia Oncótica": []
    };

    // --- ESTADO DA APLICAÇÃO ---
    let isDragging = false, zoomLevel = 1.0;
    let currentTranslate = { x: 0, y: 0 }, velocity = { x: 0, y: 0 }, lastTouch = { x: 0, y: 0 };
    let animationFrameId = null;
    let currentCategoryKey = Object.keys(microscopyData)[0];

    // --- CONFIGURAÇÕES ---
    const friction = 0.95, MIN_ZOOM = 0.2, MAX_ZOOM = 20.0;

    // --- FUNÇÕES DE RENDERIZAÇÃO E UI ---
    const updateTransform = () => { movableContent.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px) scale(${zoomLevel})`; };
    const updateZoomDisplay = () => { zoomLevelDisplay.textContent = `Zoom: ${zoomLevel.toFixed(1)}x`; };
    const showLoading = (show) => { loadingOverlay.classList.toggle('hidden', !show); };

    const populateCategories = () => {
        Object.keys(microscopyData).forEach((key, index) => {
            const button = document.createElement('button');
            button.className = `font-semibold py-2 px-3 text-sm rounded-full transition-colors ${index === 0 ? 'active-category' : 'bg-slate-700 hover:bg-slate-600'}`;
            button.textContent = key;
            button.dataset.categoryKey = key;
            button.addEventListener('click', () => selectCategory(key));
            categorySelectorContainer.appendChild(button);
        });
    };

    const selectCategory = (categoryKey) => {
        currentCategoryKey = categoryKey;
        document.querySelectorAll('#category-selector-container button').forEach(btn => {
            const isActive = btn.dataset.categoryKey === categoryKey;
            btn.classList.toggle('active-category', isActive);
            btn.classList.toggle('bg-slate-700', !isActive);
            btn.classList.toggle('hover:bg-slate-600', !isActive);
        });
    };

    const openSlideModal = () => {
        modalCategoryTitle.textContent = currentCategoryKey;
        modalGrid.innerHTML = '';
        const slideDecks = microscopyData[currentCategoryKey];

        if (slideDecks.length === 0) {
            modalGrid.innerHTML = `<p class="text-slate-400 text-center col-span-full">Nenhuma lâmina disponível para esta categoria.</p>`;
        } else {
            slideDecks.forEach((deck) => {
                const card = document.createElement('button');
                card.className = "bg-slate-700/50 rounded-lg p-3 text-left hover:bg-slate-700 transition-colors";
                card.innerHTML = `
                    <img src="${deck.srcs[0]}" class="w-full h-32 object-cover rounded-md mb-3" draggable="false">
                    <h3 class="font-semibold text-white truncate">${deck.title}</h3>
                    <p class="text-xs text-slate-400">${deck.srcs.length} imagem(ns)</p>
                `;
                card.onclick = () => {
                    setupView(deck);
                    closeSlideModal();
                };
                modalGrid.appendChild(card);
            });
        }
        slideModal.classList.remove('hidden');
        slideModal.classList.add('modal-fade-in');
        modalContent.classList.add('modal-scale-in');
    };

    const closeSlideModal = () => {
        slideModal.classList.add('modal-fade-out');
        modalContent.classList.add('modal-scale-out');
        setTimeout(() => {
            slideModal.classList.add('hidden');
            slideModal.classList.remove('modal-fade-in', 'modal-fade-out');
            modalContent.classList.remove('modal-scale-in', 'modal-scale-out');
        }, 200);
    };

    // --- LÓGICA PRINCIPAL ---
    const clampPosition = () => {
        if (!movableContent.offsetWidth) return; // Previne erro se a imagem não carregou
        const viewportRect = viewport.getBoundingClientRect();
        const scaledWidth = movableContent.offsetWidth * zoomLevel;
        const scaledHeight = movableContent.offsetHeight * zoomLevel;
        currentTranslate.x = Math.max(viewportRect.width - scaledWidth, Math.min(0, currentTranslate.x));
        currentTranslate.y = Math.max(viewportRect.height - scaledHeight, Math.min(0, currentTranslate.y));
    };
    const inertiaLoop = () => {
        if (isDragging) return;
        currentTranslate.x += velocity.x; currentTranslate.y += velocity.y;
        velocity.x *= friction; velocity.y *= friction;
        clampPosition(); updateTransform();
        if (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1) animationFrameId = requestAnimationFrame(inertiaLoop);
    };
    const resetView = () => {
        zoomLevel = 1.0; velocity = { x: 0, y: 0 };
        cancelAnimationFrame(animationFrameId);
        if (movableContent.offsetWidth) { // Só calcula se tiver conteúdo
            const viewportRect = viewport.getBoundingClientRect();
            currentTranslate.x = (viewportRect.width - movableContent.offsetWidth * zoomLevel) / 2;
            currentTranslate.y = (viewportRect.height - movableContent.offsetHeight * zoomLevel) / 2;
        }
        clampPosition(); updateTransform(); updateZoomDisplay();
    };
    const setupView = (deck) => {
        showLoading(true);
        activeSlideDisplay.textContent = deck.title;
        movableContent.innerHTML = '';
        movableContent.style.width = `${4000 * deck.srcs.length}px`;
        movableContent.style.height = '3000px';
        movableContent.style.display = 'flex';
        
        const imagePromises = deck.srcs.map(src => new Promise((resolve, reject) => {
            const img = document.createElement('img');
            img.src = src; img.className = "h-full w-auto"; img.draggable = false;
            img.onload = resolve;
            img.onerror = reject;
            movableContent.appendChild(img);
        }));
        
        Promise.all(imagePromises).then(() => { resetView(); showLoading(false); }).catch(() => {
            console.error("Erro ao carregar uma ou mais imagens da lâmina.");
            showLoading(false);
        });
    };

    // --- LÓGICA DE INTERAÇÃO (DRAG & ZOOM) ---
    const startDrag = (x, y) => {
        isDragging = true; viewport.classList.add('grabbing');
        cancelAnimationFrame(animationFrameId); velocity = { x: 0, y: 0 }; lastTouch = { x, y };
    };
    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false; viewport.classList.remove('grabbing');
        requestAnimationFrame(inertiaLoop);
    };
    const doDrag = (x, y) => {
        if (!isDragging) return;
        const deltaX = x - lastTouch.x, deltaY = y - lastTouch.y;
        currentTranslate.x += deltaX; currentTranslate.y += deltaY;
        velocity = { x: deltaX, y: deltaY }; lastTouch = { x, y };
        clampPosition(); updateTransform();
    };
    const doZoom = (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.07 : 1 / 1.07;
        const newZoomLevel = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel * zoomFactor));
        const rect = viewport.getBoundingClientRect();
        const mouseX = e.clientX - rect.left, mouseY = e.clientY - rect.top;
        const imageX = (mouseX - currentTranslate.x) / zoomLevel, imageY = (mouseY - currentTranslate.y) / zoomLevel;
        zoomLevel = newZoomLevel;
        currentTranslate.x = mouseX - imageX * zoomLevel;
        currentTranslate.y = mouseY - imageY * zoomLevel;
        clampPosition(); updateTransform(); updateZoomDisplay();
    };

    // --- INICIALIZAÇÃO E EVENT LISTENERS ---
    resetViewBtn.addEventListener('click', resetView);
    openModalBtn.addEventListener('click', openSlideModal);
    closeModalBtn.addEventListener('click', closeSlideModal);
    slideModal.addEventListener('click', (e) => { if (e.target === slideModal) closeSlideModal(); }); // Fecha ao clicar fora
    
    zoomInBtn.addEventListener('click', () => doZoom({ deltaY: -1, clientX: viewport.clientWidth / 2, clientY: viewport.clientHeight / 2, preventDefault: () => {} }));
    zoomOutBtn.addEventListener('click', () => doZoom({ deltaY: 1, clientX: viewport.clientWidth / 2, clientY: viewport.clientHeight / 2, preventDefault: () => {} }));
    
    viewport.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
    window.addEventListener('mouseup', endDrag); window.addEventListener('mousemove', (e) => doDrag(e.clientX, e.clientY)); window.addEventListener('mouseleave', endDrag);
    viewport.addEventListener('touchstart', (e) => { if (e.touches.length > 0) startDrag(e.touches[0].clientX, e.touches[0].clientY); });
    window.addEventListener('touchend', endDrag); window.addEventListener('touchmove', (e) => { if (e.touches.length > 0) doDrag(e.touches[0].clientX, e.touches[0].clientY); });
    viewport.addEventListener('wheel', doZoom, { passive: false });
    
    populateCategories();
    selectCategory(currentCategoryKey);
});
