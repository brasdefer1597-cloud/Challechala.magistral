// Content script básico - Botón flotante al seleccionar texto
let floatingElement = null;

document.addEventListener('mouseup', function(e) {
    setTimeout(() => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText.length > 30) {
            showFloatingButton(selectedText, e);
        } else {
            removeFloatingButton();
        }
    }, 300);
});

function showFloatingButton(text, event) {
    removeFloatingButton();

    floatingElement = document.createElement('div');
    floatingElement.innerHTML = '🦎 Summarize';
    floatingElement.style.cssText = `
        position: fixed;
        left: ${event.pageX}px;
        top: ${event.pageY - 50}px;
        background: #667eea;
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        cursor: pointer;
        z-index: 10000;
        font-family: sans-serif;
        font-size: 12px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;

    floatingElement.addEventListener('click', function() {
        // Enviar mensaje a la extensión
        chrome.runtime.sendMessage({
            action: 'textSelected',
            text: text
        });
        removeFloatingButton();
    });

    document.body.appendChild(floatingElement);

    // Auto-remove después de 5 segundos
    setTimeout(removeFloatingButton, 5000);
}

function removeFloatingButton() {
    if (floatingElement && floatingElement.parentNode) {
        floatingElement.parentNode.removeChild(floatingElement);
        floatingElement = null;
    }
}
