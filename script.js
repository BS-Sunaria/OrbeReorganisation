const draggables = document.querySelectorAll('.draggable');
const container = document.querySelector('.container');
const choices  = ["§4Rage VI", "§cImmolation IV", "§cPyro III", "§cLifesteal V", "§f> Bonus de dégâts : §c+8%"]

// Color code

document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.draggable, .preview-enchant');

    elements.forEach(element => {
        let text = element.innerHTML;
        text = text.replace(/§([0-9a-f])/g, '<span class="color-$1 tl">').replace(/§r/g, '</span>');
        text = text + '</span>'.repeat((text.match(/<span class="color-([0-9a-f])">/g) || []).length - (text.match(/<\/span>/g) || []).length);
        element.innerHTML = text;
    });
});

// Draggables

function createDraggableElement(text) {
    const draggable = document.createElement('div');
    draggable.classList.add('draggable');
    draggable.setAttribute('draggable', 'true');
    draggable.textContent = text;
    return draggable;
}

// function updateTooltip() {
//     const enchantments = document.querySelector('.tooltip .enchantments');
//     enchantments.innerHTML = '';
//     document.querySelectorAll('.dragging-enchantments').forEach((draggable) => {
//         const enchantment = document.createElement('p');
//         enchantment.textContent = draggable.textContent;
//         enchantments.appendChild(enchantment);
//     });
// }

function updateTooltip() {
    const enchantments = document.querySelector('.tooltip .enchantments');
    enchantments.innerHTML = '';
    document.querySelectorAll('.tl').forEach((draggable) => {
        const enchantment = document.createElement('p');
        const clonedElement = draggable.cloneNode(true); // Clone l'élément avec toutes ses balises et son contenu
        enchantment.appendChild(clonedElement); // Ajoute le clone à l'élément <p>
        enchantments.appendChild(enchantment); // Ajoute l'élément <p> à la tooltip
    });
}

function initializeDraggables() {
    const container = document.querySelector('.container');

    choices.forEach(choice => {
        const draggable = createDraggableElement(choice);
        container.appendChild(draggable);

        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            updateTooltip();
        });
    });

    container.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const dragging = document.querySelector('.dragging');
        if (afterElement == null) {
            container.appendChild(dragging);
        } else {
            container.insertBefore(dragging, afterElement);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Initialise les éléments draggables et la tooltip
initializeDraggables();
// updateTooltip();
