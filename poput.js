// VERSIÓN SIMPLIFICADA - Funciona inmediatamente
document.addEventListener('DOMContentLoaded', function() {
    
    // Botón de resumen de página
    document.getElementById('summarize-page').addEventListener('click', async function() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            const result = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: extractPageContent
            });

            const content = result[0].result;
            showSummary(generateSummary(content));
            
        } catch (error) {
            showError('Could not analyze page. Please try again.');
        }
    });

    // Botón de resumen de texto seleccionado
    document.getElementById('summarize-selection').addEventListener('click', async function() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            const result = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: extractSelectedText
            });

            const selectedText = result[0].result;
            if (!selectedText) {
                showError('Please select some text on the page first.');
                return;
            }

            showSummary(generateSummary(selectedText));
            
        } catch (error) {
            showError('Please select text and try again.');
        }
    });

    // Función para extraer contenido de la página
    function extractPageContent() {
        return document.body.innerText.substring(0, 5000);
    }

    // Función para extraer texto seleccionado
    function extractSelectedText() {
        return window.getSelection().toString().trim();
    }

    // Generar resumen simple
    function generateSummary(text) {
        const sentences = text.split('.').filter(s => s.length > 10);
        const summary = sentences.slice(0, 3).join('. ') + '.';
        
        return {
            summary: summary,
            originalLength: text.length,
            summaryLength: summary.length
        };
    }

    // Mostrar resultados
    function showSummary(data) {
        document.getElementById('summary-content').innerHTML = `
            <p><strong>Summary:</strong> ${data.summary}</p>
            <p style="color: #666; font-size: 12px;">
                Reduced from ${data.originalLength} to ${data.summaryLength} characters
            </p>
        `;
        document.getElementById('summary-result').style.display = 'block';
    }

    function showError(message) {
        document.getElementById('summary-content').innerHTML = `
            <p style="color: red;">❌ ${message}</p>
        `;
        document.getElementById('summary-result').style.display = 'block';
    }
});
