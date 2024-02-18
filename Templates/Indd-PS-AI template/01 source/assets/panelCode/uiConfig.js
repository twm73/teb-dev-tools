/*
    InDesign IDSN
    Illustrator ILST
    Photoshop PHXS
 */
/**
 * Object defining in the GUI panels switched by buttons.
 * Must contain at least 2 containers.
 * Their titles will be displayed as multi-state buttons.
 *
 * @typedef SwitchablePanels
 * @type {object}
 * @property {String} name The name that will simultaneously be the ID of the object in the DOM.
 * @property {String} type The constant type definition required by the builder function.
 * @property {String[]} apps Applications in which the item will be displayed, also applies to child elements.
 * @property {String[]} cssClass CSS class names to be assigned to the element.
 * @property {String[]} cssButtonOnClass CSS class names to be assigned to the active button.
 * @property {String[]} cssButtonOffClass CSS class names to be assigned to inactive buttons.
 * @property {Container[]} children Child elements.
 */
/**
 * An object defining a container in the GUI. Used to organize and aggregate child elements.
 *
 * @typedef Container
 * @type {object}
 * @property {String} name The name that will simultaneously be the ID of the object in the DOM.
 * @property {String} type The constant type definition required by the builder function.
 * @property {String} text Reference to the label with the title of the container in the multilingual dictionary object.
 * @property {String[]} apps Applications in which the item will be displayed, also applies to child elements.
 * @property {String[]} cssClass CSS class names to be assigned to the element.
 * @property {(SwitchablePanels|Container|TextLabel|DropDownList|IconButton|TextButton)[]} children Child elements.
 */
/**
 * An object defining a separator in the GUI - a line with parameters defined by assigned CSS classes.
 * Used for separating elements.
 *
 * @typedef Line
 * @type {object}
 * @property {String} name The name that will simultaneously be the ID of the object in the DOM.
 * @property {String} type The constant type definition required by the builder function.
 * @property {String[]} apps Applications in which the element will be displayed, also applies to child elements.
 * @property {String[]} cssClass CSS class names to be assigned to the element.
 */
/**
 * An object defining a text label. Always as <p>.
 * Visual differentiation is solely due to assigned CSS classes.
 * Useful for displaying titles and plain text.
 *
 * @typedef TextLabel
 * @type {object}
 * @property {String} name The name that will simultaneously be the ID of the object in the DOM.
 * @property {String} type The constant type definition required by the builder function.
 * @property {String} text Reference to the label with the text in the multilingual dictionary object.
 * @property {String[]} apps Applications in which the element will be displayed, also applies to child elements.
 * @property {String[]} cssClass CSS class names to be assigned to the element.
 */
/**
 * An object defining a button with a text name that invokes an assigned ExtendScript action.
 *
 * @typedef TextButton
 * @type {object}
 * @property {String} name The name that will simultaneously be ID of the object in the DOM.
 * @property {String} type The constant type definition required by the builder function.
 * @property {String} text Reference to the label with the text in the multilingual dictionary object.
 * @property {String} toolTipText Reference to the label with tooltip text in the multilingual dictionary object.
 * @property {String[]} apps Applications in which the object will be displayed, also applies to child elements.
 * @property {String[]} cssClass CSS class names to be assigned to the element.
 * @property {String} adobeScript ExtendScript function name.
 */
/**
 * An object defining a button with an icon from the [Material Design]{@link https://fonts.google.com/icons} set that invokes an assigned ExtendScript action.
 *
 * @typedef IconButton
 * @type {object}
 * @property {String} name The name that will simultaneously be the ID of the object in the DOM.
 * @property {String} type The constant type definition required by the builder function.
 * @property {String} iconCode The code or name of the icon from the [Material Design]{@link https://fonts.google.com/icons} set.
 * @property {String} toolTipText Reference to the label with tooltip text in the multilingual dictionary object.
 * @property {String[]} apps Applications in which the element will be displayed, also applies to child elements.
 * @property {String[]} cssClass CSS class names to be assigned to the element.
 * @property {String} adobeScript ExtendScript function name.
 */
/**
 * An object defining a child element of a drop-down list.
 *
 * @typedef DropDownListItem
 * @type {object}
 * @property {String} name The name that will simultaneously be the ID of the object in the DOM.
 * @property {String} type The constant type definition required by the builder function.
 * @property {String} text Reference to the label with the text of the item in the multilingual dictionary object.
 */
/**
 * An object defining a drop-down list. The state of the list is updated in the configuration file and constitutes a context for the invoked commands.
 *
 * @typedef DropDownList
 * @type {object}
 * @property {String} name The name that will simultaneously be the ID of the object in the DOM.
 * @property {String} type The constant type definition required by the builder function.
 * @property {String[]} apps Applications in which the element will be displayed, also applies to child elements.
 * @property {String[]} cssClass CSS class names to be assigned to the element.
 * @property {DropDownList[]} items List items.
 */
const imagesTools = [
    {
        name:'toolsPanelNo1Title1',
        text: 'images_tools',
        type:'textLabel',
        apps: ['IDSN', 'ILST', 'PHXS'],
        cssClass: ['toolsPanelButtonTitle', 'default']
    },
    {
        name:'convertSelectionToRasterImage',
        toolTipText: 'convert_selection_to_raster_image_button_tooltip',
        type:'iconButton',
        apps: ['IDSN'],
        cssClass: ['iconButton'],
        iconCode:'center_focus_weak',
        adobeScript:'convertSelectionToRasterImage'
    },
    {
        name:'flattenImage',
        toolTipText: 'flatten_image_button_tooltip',
        type:'iconButton',
        apps: ['IDSN'],
        cssClass: ['iconButton'],
        iconCode:'filter_none',
        adobeScript:'flattenCommand'
    }
]

const universalTools = [
    {
        name:'toolsPanelNo1TitleForOthers',
        text: 'tools_panel_no_1_title_for_others',
        type:'textLabel',
        apps: ['IDSN', 'ILST', 'PHXS'],
        cssClass: ['toolsPanelButtonTitle', 'default']
    },
    {
        name:'createTestDocument',
        toolTipText: 'create_test_document_button_tooltip',
        type:'iconButton',
        apps: ['IDSN', 'ILST', 'PHXS'],
        cssClass: ['iconButton'],
        iconCode:'note_add',
        adobeScript:'createTestDocument'
    },
    {
        name:'clearAllGuides',
        toolTipText: 'clear_all_guides_button_tooltip',
        type:'iconButton',
        apps: ['IDSN', 'ILST', 'PHXS'],
        cssClass: ['iconButton'],
        iconCode:'border_clear',
        adobeScript:'clearAllGuides'
    },
    {
        name:'showAll',
        toolTipText: 'show_all_button_tooltip',
        type:'iconButton',
        apps: ['IDSN', 'ILST'],
        cssClass: ['iconButton'],
        iconCode:'visibility',
        adobeScript:'showAll'
    },
    {
        name:'unlockAll',
        toolTipText: 'unlock_all_button_tooltip',
        type:'iconButton',
        apps: ['IDSN', 'ILST'],
        cssClass: ['iconButton'],
        iconCode:'lock_open',
        adobeScript:'unlockAll'
    },
    {
        name:'ungroupAll',
        toolTipText: 'ungroup_all_button_tooltip',
        type:'iconButton',
        apps: ['IDSN'],
        cssClass: ['iconButton'],
        iconCode:'grain',
        adobeScript:'ungroupAllInDocument'
    },
    {
        name:'line2',
        type:'line',
        apps: ['IDSN', 'ILST', 'PHXS'],
        cssClass: ['line']
    }
];

const textTools = [
    {
        name:'toolsPanelNo1Title2',
        text: 'text_tools_title',
        type:'textLabel',
        apps: ['IDSN', 'ILST', 'PHXS'],
        cssClass: ['toolsPanelButtonTitle', 'default']
    },
    {
        name:'addTextInPhotoshop',
        toolTipText: 'add_text_in_photoshop_button_tooltip',
        text: 'add_text_in_photoshop_button_text_label',
        type:'textButton',
        apps: ['PHXS'],
        cssClass: ['textButton'],
        adobeScript:'addTestTextInPhotoshop'
    },
    {
        name:'addTextInIllustrator',
        toolTipText: 'add_text_in_illustrator_button_tooltip',
        text: 'add_text_in_illustrator_text_label',
        type:'textButton',
        apps: ['ILST'],
        cssClass: ['textButton'],
        adobeScript:'addTestTextInIllustrator'
    },
    {
        name:'addTextInIndesign',
        toolTipText: 'add_text_in_indesign_button_tooltip',
        text: 'add_text_in_indesign_text_label',
        type:'textButton',
        apps: ['IDSN'],
        cssClass: ['textButton'],
        adobeScript:'addTestTextInIndesign'
    }
];

const textList = [
    {
        name:'toolsPanelNo2Title1',
        text: 'test_list_title',
        type:'textLabel',
        apps: ['IDSN', 'ILST', 'PHXS'],
        cssClass: ['toolsPanelButtonTitle', 'default']
    },
    {
        name:'toolsPanelNo2List1',
        type:'dropDownList',
        apps: ['IDSN', 'ILST', 'PHXS'],
        cssClass: ['dropDownList'],
        items: [
            {
                name: 'toolsPanelNo2List1Item1',
                type:'dropDownListItem',
                text: 'tools_panel_no_2_list_1_item_1_name'
            },
            {
                name: 'toolsPanelNo2List1Item2',
                type:'dropDownListItem',
                text: 'tools_panel_no_2_list_1_item_2_name'
            },
            {
                name: 'toolsPanelNo2List1Item3',
                type:'dropDownListItem',
                text: 'tools_panel_no_2_list_1_item_3_name'
            }

        ]
    },
    {
        name:'runListContent',
        toolTipText: 'run_list_content_button_tooltip',
        text: 'run_list_content_button_text_label',
        type:'textButton',
        apps: ['IDSN', 'ILST', 'PHXS'],
        cssClass: ['textButton'],
        adobeScript:'runList'
    }
];

const flyoutMenuItems = [  {
    name: "preferences",
    textLabelNode: "preferences",
    textLabel: "menu_text",
    enabled: true,
    action: 'preferences'
},
    {
        name: "help",
        textLabelNode: "help",
        textLabel: "menu_text",
        enabled: true,
        action: 'showHelpFile'
    },
    {
        name: "about",
        textLabelNode: "about",
        textLabel: "menu_text",
        enabled: true,
        action: 'about'
    },
    {
        name: "resetConfig",
        textLabelNode: "reset_config",
        textLabel: "menu_text",
        enabled: true,
        action: 'resetConfig'
    }];

/**
 * @typedef {Object} UIConfig
 * @property {Array} flyoutMenu - An array of flyout menu items
 * @property {Array} guiElements - An array of GUI elements
 */
const uiConfig = {
    flyoutMenu: [].concat(flyoutMenuItems),
    guiElements: [
        {
            name:'mainPanel',
            type:'switchablePanels',
            apps: ['IDSN', 'ILST', 'PHXS'],
            cssClass: [],
            cssButtonOnClass: ['switchablePanelsButtonOn'],
            cssButtonOffClass: ['switchablePanelsButtonOff'],
            children: [
                {
                    name:'toolsPanelNo1',
                    text: 'title_for_panel_button_no_1',
                    type:'container',
                    apps: ['IDSN', 'ILST', 'PHXS'],
                    cssClass: [],
                    children: [].concat(imagesTools, universalTools, textTools)
                },
                {
                    name:'toolsPanelNo2',
                    text: 'title_for_panel_button_no_2',
                    type:'container',
                    apps: ['IDSN', 'ILST', 'PHXS'],
                    cssClass: [],
                    children: [].concat(textList)
                }
            ]
        },
    ]
}