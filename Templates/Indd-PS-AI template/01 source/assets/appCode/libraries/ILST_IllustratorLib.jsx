/**
 * Illustrator
 * Unlocks all objects.
 *
 * @returns {void}
 */
function unlockAll() {
    app.executeMenuCommand('unlockAll');
}
/**
 * Merges all layers in Illustrator.
 * @returns {void}
 */
function flattenAllLayers() {
    if(app.documents.length>0) {
        app.executeMenuCommand('showAll');
        $.sleep(50);
        app.executeMenuCommand('unlockAll');
        $.sleep(50);
        app.executeMenuCommand('selectall');
        $.sleep(50);
        app.executeMenuCommand('group');
    }
}

/**
 * Illustrator
 * Shows all hidden layers and objects.
 *
 * @returns {void}
 */
function showAll() {
    app.executeMenuCommand('showAll');
}




/**
 * Adds a test document to Illustrator.
 *
 * @returns {void}
 */
function createTestDocument() {
    app.documents.add();
    addTextFrame('Hello word!', 20, 20).hidden = true;
    app.activeDocument.layers.add().name = 'Test layer 1';
    addTextFrame('Test document', 100, 100);
    app.activeDocument.layers.add().name = 'Test layer 2';
    addTextFrame('Test text', 50, 50).locked = true;
    app.activeDocument.layers.add().name = 'Guides';
    addGuide(40, true);
    addGuide(100, true);
    addGuide(50, false);
    addGuide(150, false);
}


/**
 * Illustrator
 *
 * Creates and adds a text frame to the active document.
 *
 * @param {string} text - The content to be added to the text frame.
 * @param {number} xPosition - Optional. The x-position for the text frame. Defaults to the center of the active document if not provided.
 * @param {number} yPosition - Optional. The y-position for the text frame. Defaults to the center of the active document if not provided.
 * @return {TextFrame|null} - The created text frame, or null if there is no active document.
 */
function addTextFrame(text, xPosition, yPosition) {
    if(app.documents.length>0){
        var textFrame = app.activeDocument.textFrames.add();
        if(arguments.length===3){
            textFrame.position = [xPosition, yPosition];
        }
        else textFrame.position = [app.activeDocument.width/2, app.activeDocument.height/2];
        textFrame.contents = text;
        return textFrame;
    }
    return null;
}

/**
 * Illustrator
 *
 * Adds a guide line to the active document at the specified position.
 *
 * @param {number} position - The position where the guide line should be placed.
 * @param {boolean} vertical - Indicates whether the guide line should be vertical (true) or horizontal (false).
 */
function addGuide(position, vertical) {
    var guideLine, x1, x2, y1, y2;
    if(app.documents.length>0){
        guideLine = app.activeDocument.pathItems.add();
        if(vertical){
            x1 = position;
            y1 = 0;
            x2 = position;
            y2 = app.activeDocument.height;
        }
        else {
            x1 = 0;
            y1 = position;
            x2 = app.activeDocument.width;
            y2 = position;
        }
        guideLine.setEntirePath([[x1, y1],[x2, y2]]);
        guideLine.guides = true;
    }

}