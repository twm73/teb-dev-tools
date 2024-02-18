/**
 * Indesign
 * Resets the view preferences of the document.
 * Stores and returns an object with the original settings.
 *
 * @function resetViewPreferences
 * @returns {userPref} - The original preferences
 */
function resetViewPreferences(){
    var userPref = {};
    userPref.horizontalMeasurementUnits = app.activeDocument.viewPreferences.horizontalMeasurementUnits;
    userPref.verticalMeasurementUnits = app.activeDocument.viewPreferences.verticalMeasurementUnits;
    userPref.rulerOrigin = app.activeDocument.viewPreferences.rulerOrigin;
    userPref.zeroPoint = app.activeDocument.zeroPoint;
    app.activeDocument.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.millimeters;
    app.activeDocument.viewPreferences.verticalMeasurementUnits = MeasurementUnits.millimeters;
    app.activeDocument.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
    app.activeDocument.zeroPoint = [0,0];
    return userPref;
}

/**
 * Indesign
 * Restores the view preferences of the document with the given parameters.
 *
 * @function restoreViewPreferences
 * @param {UserPref} userPref - Object containing the view preferences parameters.
 * @return {undefined}
 *
 * @see resetViewPreferences
 */
function restoreViewPreferences(userPref){
    app.activeDocument.viewPreferences.horizontalMeasurementUnits = userPref.horizontalMeasurementUnits;
    app.activeDocument.viewPreferences.verticalMeasurementUnits = userPref.verticalMeasurementUnits;
    app.activeDocument.viewPreferences.rulerOrigin = userPref.rulerOrigin;
    app.activeDocument.zeroPoint = userPref.zeroPoint;
}
