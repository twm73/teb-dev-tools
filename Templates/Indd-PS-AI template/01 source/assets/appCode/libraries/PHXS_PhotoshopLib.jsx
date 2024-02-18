/**
 * PhotoShop
 * Flattens all layers in the active document.
 */
function flattenAllLayers() {
    if(app.documents.length > 0) {
        app.activeDocument.flatten();
    }
}

/**
 * PhotoShop
 * Adds a text layer with given text.
 * @param {string} text - text to be displayed
 * @param {[number, number]} position - coordinates [x, y]
 * @param {number} textSize - text size
 * @param {[number, number, number]} [rgbColorValue] - array with color components in RGB space
 */
function addTextLayer(text, position, textSize, rgbColorValue) {
    if(app.documents.length > 0) {
        var textLayer, color;
        textLayer = app.activeDocument.artLayers.add();
        textLayer.kind = LayerKind.TEXT;
        textLayer.textItem.kind = TextType.PARAGRAPHTEXT;
        textLayer.textItem.size = textSize;
        textLayer.textItem.position = position;
        if(arguments.length >3) {
            color = new SolidColor();
            color.rgb.red = rgbColorValue[0];
            color.rgb.green = rgbColorValue[1];
            color.rgb.blue = rgbColorValue[2];
            textLayer.textItem.color = color;
        } else textLayer.textItem.color = app.foregroundColor;
        textLayer.textItem.contents = text;
        textLayer.textItem.width = new UnitValue((text.length * textSize) + " pixels");
        textLayer.textItem.height = new UnitValue(textSize + " pixels");
    }
}

/**
 * PhotoShop
 * Adds a test document in RGB.
 */
function createTestDocument() {
    var testDoc, layer1, layer2, tempSelectionBounds, tempColor;
    testDoc = app.documents.add(1200, 1000, 72, 'Test', NewDocumentMode.RGB);
    testDoc.artLayers.add();
    fillArea([[50, 50], [50, 500],[500,500], [500, 50]], [0, 200, 0]);
    testDoc.artLayers.add();
    fillArea([[170, 170], [170, 620],[620,620], [620, 170]], [200, 50, 0]);
    testDoc.artLayers.add();
    fillArea([[100, 300], [100, 600],[200,600]], [0, 50, 200]);
    testDoc.artLayers.add();
    fillArea([[600, 200], [900, 300], [700, 800]], [150, 50, 150]);
    addTextLayer('Test document', [200, 200], 30, [0, 0, 0]);
    app.activeDocument.guides.add(Direction.HORIZONTAL, new UnitValue("100 pixels"));
    app.activeDocument.guides.add(Direction.HORIZONTAL, new UnitValue("200 pixels"));
    app.activeDocument.guides.add(Direction.VERTICAL, new UnitValue("150 pixels"));
    app.activeDocument.guides.add(Direction.VERTICAL, new UnitValue("300 pixels"));
}


/**
 * PhotoShop
 * Fills the specified area in the active document with the given RGB color value.
 *
 * @param {[number, number][]} bounds - The bounds of the area to be filled. It should be an array
 *                          of four numbers representing the top-left x, top-left y,
 *                          width, and height of the area, respectively.
 * @param {[number, number, number]} rgbColorValue - The RGB color value to be used for filling the area.
 *                                It should be an array of three numbers representing
 *                                the red, green, and blue values, respectively.
 *
 */
function fillArea(bounds, rgbColorValue) {
    if(app.documents.length > 0) {
        var color = new RGBColor();
        color.red = rgbColorValue[0];
        color.green = rgbColorValue[1];
        color.blue = rgbColorValue[2];
        app.activeDocument.selection.deselect();
        app.activeDocument.selection.select(bounds);
        app.activeDocument.selection.fill(color);
        app.activeDocument.selection.deselect();
    }
}

/**
 * Clears all guides in the active document.
 *
 * @return {void}
 */
function clearAllGuides() {
    if(app.documents.length > 0) {
        app.activeDocument.guides.removeAll();
    }
}