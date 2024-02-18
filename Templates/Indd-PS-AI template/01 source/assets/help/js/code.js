function showElement(sectionId) {
    hideAll();
    console.log(sectionId);
    console.log(document.getElementById(sectionId));
    document.getElementById(sectionId).style.display = 'inline';
}

function hideAll() {
    let elements = document.querySelectorAll('section.h2-section');
    for (let item of elements) item.style.display = 'none';
}




function showMenu() {
    addNavLevel(document.getElementById('sidenav'), document, 2, 0);
}

function addNavLevel(parent, source, level, counter){
    let list, elements, listItem, link, targetId;
    elements = source.querySelectorAll('section.h' + level + '-section');
    if(elements.length > 0) {
        list = document.createElement('ol');
        list.classList.add('nav-ol-h' + level + '-level');
        for (let item of elements) {
            item.id = item.id || 'navItem-' + (++counter)
            listItem = document.createElement('li');
            link = document.createElement('a');
            link.append(document.createTextNode(item.querySelectorAll('h' + level)[0].textContent));
            link.classList.add('nav-h' + level +'-level');
            link.href = '#' + item.id;
            listItem.append(link);
            if(level < 6) counter = addNavLevel(listItem, item, level+1, counter);
            list.append(listItem);
        }
        parent.append(list);
    }
    return counter;
}

showMenu();