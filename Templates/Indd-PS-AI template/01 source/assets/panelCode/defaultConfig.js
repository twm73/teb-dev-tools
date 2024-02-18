/**
 * Configuration object for the default settings of an application.
 * @typedef {Object} DefaultConfig
 * @property {number} language - The default language setting.
 * @property {string} appLabelKey - The unique identifier for the application ExtendScript label.
 * @property {string} appId - The unique identifier for the application.
 * @property {string} appVersion - The version number of the application.
 * @property {Object} appVersions - Object containing current and update versions.
 * @property {Object} appVersions.current - Object containing the current version.
 * @property {number} appVersions.current.major - The major version number.
 * @property {number} appVersions.current.minor - The minor version number.
 * @property {number} appVersions.current.patch - The patch version number.
 * @property {Object} appVersions.update - Object containing the update version.
 * @property {number} appVersions.update.major - The major version number of the update.
 * @property {number} appVersions.update.minor - The minor version number of the update.
 * @property {number} appVersions.update.patch - The patch version number of the update.
 * @property {string} folderForScriptsFilesShortcuts - The folder for scripts and files shortcuts.
 * @property {string} logFileName - The log file name.
 * @property {string} serverAddress - Update server address.
 * @property {string[]} helpFileRelativePaths - An array of relative paths for help files.
 * @property {Array} selectedElements - An array of selected elements.
 * @property {Object} rasterImageConfig - An object containing the image rasterization configuration.
 * @property {string} rasterImageConfig.format - The format of the raster image.
 * @property {number} rasterImageConfig.resolution - The resolution of the raster image.
 * @property {boolean} rasterImageConfig.transparency - Whether the raster image supports transparency.
 * @property {number} rasterImageConfig.qualityEnumeratorValue - The quality enumerator value of the raster image.
 * @property {number} rasterImageConfig.colourSpaceEnumeratorValue - The colour space enumerator value of the raster image.
 * @property {number} rasterImageConfig.exportFormatEnumeratorValue - The export format enumerator value of the raster image.
 * @property {string} rasterImageConfig.fileExtension - The file extension of the raster image.
 */

var defaultConfig = 'defaultConfigString';