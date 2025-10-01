// generator.js - Versão 3.1 (Correção de Campos Vazios)

const mainForm = document.getElementById('main-link-form');
const typeSelect = document.getElementById('type');
const previewDisplay = document.getElementById('preview-display');
const codeOutput = document.getElementById('code-output');
const folderManagement = document.getElementById('folder-items-management');
const sublinkList = document.getElementById('sublink-list');
const noItemsMessage = document.getElementById('no-items-message');

// Array para armazenar os sublinks da pasta
let folderItems = [];

// Lista de campos que disparam a atualização da pré-visualização
const mainFields = ['title', 'target', 'description', 'thumbnail', 'type', 'isVisible'];


// --- FUNÇÕES DE GERENCIAMENTO DE SUBITENS (PASTA) ---

/**
 * Adiciona um novo item (sublink) à lista folderItems.
 */
function addItem() {
    const itemTitle = document.getElementById('item-title').value.trim();
    const itemTarget = document.getElementById('item-target').value.trim();
    // NOTA: Esses campos agora armazenam "" se vazios
    const itemDescription = document.getElementById('item-description').value.trim();
    const itemThumbnail = document.getElementById('item-thumbnail').value.trim();

    if (!itemTitle || !itemTarget) {
        alert('Título e URL do sublink são obrigatórios!');
        return;
    }

    const newItem = {
        title: itemTitle,
        target: itemTarget,
        description: itemDescription,
        thumbnail: itemThumbnail
    };

    folderItems.push(newItem);

    // Limpa o formulário de adição
    document.getElementById('item-title').value = '';
    document.getElementById('item-target').value = '';
    document.getElementById('item-description').value = '';
    document.getElementById('item-thumbnail').value = '';

    renderFolderItemsList();
    updatePreview(); // Atualiza a pré-visualização após adicionar
}

/**
 * Remove um item da lista pelo seu índice.
 * @param {number} index - O índice do item a ser removido.
 */
function removeItem(index) {
    folderItems.splice(index, 1);
    renderFolderItemsList();
    updatePreview(); // Atualiza a pré-visualização após remover
}

/**
 * Renderiza a lista de sublinks adicionados na área de gerenciamento.
 */
function renderFolderItemsList() {
    sublinkList.innerHTML = '';

    if (folderItems.length === 0) {
        noItemsMessage.style.display = 'block';
        sublinkList.appendChild(noItemsMessage);
        return;
    }

    noItemsMessage.style.display = 'none';

    folderItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'sublink-item-display';
        itemDiv.innerHTML = `
            <span>${item.title}</span>
            <button type="button" onclick="removeItem(${index})">Remover</button>
        `;
        sublinkList.appendChild(itemDiv);
    });
}


// --- FUNÇÃO DE PRÉ-VISUALIZAÇÃO (mantida a lógica de visualização) ---

/**
 * Cria a estrutura HTML de um link individual (para pré-visualização).
 */
function createPreviewItem(item, isSublink = false) {
    const linkElement = document.createElement('a');
    linkElement.href = item.target || '#';
    linkElement.target = "_blank";
    linkElement.className = 'preview-link-item';

    const titleColor = isSublink ? '#333' : '#333';
    const descColor = isSublink ? '#666' : '#666';

    const img = document.createElement('img');
    // Usa placeholder se não houver URL, mas item.thumbnail pode ser ""
    img.src = item.thumbnail || 'https://i.pinimg.com/originals/67/54/55/675455f961bfb9346daa8a2b7e41306f.jpg';
    img.alt = item.title;
    img.className = 'preview-thumbnail';
    linkElement.appendChild(img);

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'preview-details';

    const titleH3 = document.createElement('h3');
    titleH3.textContent = item.title;
    titleH3.style.color = titleColor;
    detailsDiv.appendChild(titleH3);

    // Só adiciona o parágrafo de descrição se houver texto
    if (item.description) {
        const descP = document.createElement('p');
        descP.textContent = item.description;
        descP.style.color = descColor;
        detailsDiv.appendChild(descP);
    }

    linkElement.appendChild(detailsDiv);
    return linkElement;
}


/**
 * Atualiza a pré-visualização em tempo real.
 */
function updatePreview() {
    const item = {
        title: document.getElementById('title').value.trim() || 'Título de Exemplo',
        target: document.getElementById('target').value.trim(),
        description: document.getElementById('description').value.trim(),
        thumbnail: document.getElementById('thumbnail').value.trim(),
        type: typeSelect.value,
        isVisible: document.getElementById('isVisible').value === 'true'
    };

    previewDisplay.innerHTML = '';

    if (!item.isVisible) {
        previewDisplay.innerHTML = '<p style="color: red; font-weight: bold; margin-top: 50px;">[Link Oculto] Não será exibido.</p>';
        return;
    }

    if (item.type === 'LINK_DIRECT') {
        previewDisplay.appendChild(createPreviewItem(item));
    } else if (item.type === 'FOLDER') {
        const folderTitle = document.createElement('div');
        folderTitle.className = 'preview-folder-title';

        const titleH3 = document.createElement('h3');
        titleH3.textContent = item.title;
        folderTitle.appendChild(titleH3);

        const svgIcon = createSvgIcon();
        folderTitle.appendChild(svgIcon);

        previewDisplay.appendChild(folderTitle);

        const contentContainer = document.createElement('div');
        contentContainer.className = 'group-items-container';

        if (folderItems.length > 0) {
            folderItems.forEach(subItem => {
                contentContainer.appendChild(createPreviewItem(subItem, true));
            });
        } else {
            const emptyMsg = document.createElement('p');
            emptyMsg.style.margin = '10px';
            emptyMsg.style.fontStyle = 'italic';
            emptyMsg.textContent = 'Pasta Vazia. Adicione itens abaixo.';
            contentContainer.appendChild(emptyMsg);
        }

        previewDisplay.appendChild(contentContainer);
    }
}


// --- FUNÇÃO DE GERAÇÃO DE CÓDIGO FINAL (MODIFICADA) ---

function generateCode(event) {
    event.preventDefault();

    const item = {
        title: document.getElementById('title').value.trim(),
        target: document.getElementById('target').value.trim(),
        description: document.getElementById('description').value.trim(), // Garantido que será "" se vazio
        thumbnail: document.getElementById('thumbnail').value.trim(),     // Garantido que será "" se vazio
        type: typeSelect.value,
        isVisible: document.getElementById('isVisible').value
    };

    let codeString = `{\n`;
    codeString += `    title: "${item.title}",\n`;
    codeString += `    type: "${item.type}",\n`;

    if (item.type === 'LINK_DIRECT') {
        // LINK_DIRECT: Inclui target, description e thumbnail, mesmo se vazios

        codeString += `    target: "${item.target}",\n`;
        // *NOVIDADE: Descrição e Thumbnail incluídas sempre*
        codeString += `    description: "${item.description}",\n`;
        codeString += `    thumbnail: "${item.thumbnail}",\n`;

    } else if (item.type === 'FOLDER') {
        // FOLDER: Estrutura da pasta

        codeString += `    isExpanded: false, // Defina para 'true' se quiser que comece aberta\n`;
        codeString += `    items: [\n`;

        // Adiciona os sublinks da pasta
        folderItems.forEach((subItem, index) => {

            // Os valores de subItem.description e subItem.thumbnail já são "" se vazios
            const subDescription = subItem.description;
            const subThumbnail = subItem.thumbnail;

            codeString += `        {\n`;
            codeString += `            title: "${subItem.title}",\n`;
            codeString += `            target: "${subItem.target}",\n`;

            // *NOVIDADE: Descrição incluída sempre*
            codeString += `            description: "${subDescription}",\n`;

            // *NOVIDADE: Thumbnail incluída sempre (último item, sem vírgula)*
            codeString += `            thumbnail: "${subThumbnail}"\n`;

            codeString += `        }${index < folderItems.length - 1 ? ',' : ''}\n`;
        });

        codeString += `    ],\n`;
    }

    // Adiciona isVisible por último
    codeString += `    isVisible: ${item.isVisible}\n`;

    codeString += `}`;

    codeOutput.textContent = codeString;
}


// --- FUNÇÕES AUXILIARES E INICIALIZAÇÃO ---

/**
 * Função utilitária para criar e retornar o elemento SVG da seta.
 */
function createSvgIcon() {
    const svgHTML = `
        <svg class="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = svgHTML.trim();
    return tempDiv.firstChild;
}

/**
 * Alterna a visibilidade da seção de gerenciamento de sublinks.
 */
function toggleFolderManagement() {
    if (typeSelect.value === 'FOLDER') {
        folderManagement.style.display = 'block';
    } else {
        folderManagement.style.display = 'none';
    }
    // Limpa os itens ao trocar de tipo para evitar confusão
    folderItems = [];
    renderFolderItemsList();
    updatePreview();
}

// 1. Adiciona a função de pré-visualização em tempo real
mainFields.forEach(fieldId => {
    document.getElementById(fieldId).addEventListener('input', updatePreview);
});

// 2. Adiciona a função para mostrar/esconder o gerenciamento de sublinks
typeSelect.addEventListener('change', toggleFolderManagement);

// 3. Adiciona a função de geração de código ao formulário
mainForm.addEventListener('submit', generateCode);

// 4. Inicialização
renderFolderItemsList();
toggleFolderManagement();
updatePreview();

// Adiciona as funções ao escopo global para que o botão HTML possa chamá-las
window.copyCode = function () {
    const textToCopy = codeOutput.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Código copiado para a área de transferência!');
    }).catch(err => {
        console.error('Erro ao copiar o código: ', err);
        alert('Falha ao copiar. Por favor, selecione e copie o código manualmente.');
    });
}

window.addItem = addItem;
window.removeItem = removeItem;