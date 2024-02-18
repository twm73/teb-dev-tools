/**
 * Zwraca XML jako String z definicją elementów do rozwijanego menu (boczne menu paletki rozszerzenia).
 * @return {string}
 */
function getFlyoutMenu() {
    let config, flyoutMenu, vocabulary;
    config = getConfig();
    vocabulary = dictionary.languages[config.language].flyout_menu;

    flyoutMenu = '<Menu>';

    uiConfig.flyoutMenu.forEach((menuElement)=>{
        flyoutMenu += '<MenuItem';
        flyoutMenu +=' Id="'+ menuElement.action + '"';
        flyoutMenu +=' Label="'+ vocabulary[menuElement.textLabelNode][menuElement.textLabel] + '"';
        flyoutMenu +=' Enabled="' + menuElement.enabled + '"';
        flyoutMenu += ' />';

    });
    flyoutMenu += ' </Menu>';
    return flyoutMenu;
}