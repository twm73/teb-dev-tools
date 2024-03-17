![](images/teb-logo.svg)

# Developer Tools for CEP Extensions 

**A toolkit for creating extensions for programs from the Adobe CC package.**  
Copyright: Tomasz Mnich  
>Version 1.4.1

## Requirements

Before installing the package, make sure that minimum requirements are met.

To work with **Extension Builder**, an account in [Adobe Creative Cloud](https://www.adobe.com/pl/creativecloud.html) with an active subscription (or in a trial period) is required."

The package was developed and tested on MS Windows. 
It should work on Mac OS X, but this hasn't been verified. 
The generated extensions will function fully on Adobe CS for Mac OS X. The computer where the package will be installed must have:

1. [Node JS](https://nodejs.org/en/) version 7.2 or newer.
2. The versioning system [Git](https://git-scm.com).
3. The current version of the [Adobe CC](https://www.adobe.com/pl/creativecloud.html), along with the applications Indesign, Photoshop, Illustrator.
4. [CEP](https://github.com/Adobe-CEP/CEP-Resources)
5. [ZXP/UXP installer](https://aescripts.com/learn/zxp-installer/)

## Recommended Applications
For convenient work with the package an IDE (Integrated Development Environment), 
tools for editing dialog options in the i18n standard, and for reading log files are needed. 
Any can be used, the following have been tested during work on the package:

1. IntelliJ IDEA [WebStorm](https://www.jetbrains.com/webstorm/) - IDE
2. [Visual Studio Code](https://code.visualstudio.com/) — free IDE with plugins
    - [Auto-Save](https://marketplace.visualstudio.com/items?itemName=mcright.auto-save)
    - [Jasmine ES5](https://marketplace.visualstudio.com/items?itemName=deerawan.vscode-jasmine-es5)
    - [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)
    - [Task Explorer](https://marketplace.visualstudio.com/items?itemName=spmeesseman.vscode-taskexplorer)
3. [Notepad++](https://notepad-plus-plus.org/downloads/) - an application for reading log files ([configuration method](https://darekkay.com/blog/turn-notepad-into-a-log-file-analyzer/)).
4. [i18n-editor](https://github.com/jcbvm/i18n-editor) - dialog options editor.

## Installation

1. We start by downloading the content of the repository to a folder on the local computer.
2. Then, you should install Node JS packages by running the `npm install` command in the main package directory.
3. Run the command `GULP` `EXTENSION BUILDER init`.
4. An `extensionbuilder.json` will be created.
5. In the local copy of the package, the paths in `extensionbuilder.json` should be updated so that they are
   consistent with the actual location of the Extension Builder package folder.
   - `paths.root` - Full path to the **Extension Builder** package folder
   - `paths.publicInstallerPath` - Full path to the folder where the production versions of extensions should be generated
   - `root.localExtensionsFolder` - Full path to the local folder with extensions
      - `~user/AppData/Roaming/Adobe/CEP/extensions`
   - `tools.adobeDebugConsole.path` - Full path to `cefclient.exe`
     from [Adobe Creative Cloud APIs and SDK](https://developer.adobe.com/apis/)
   - `tools.zip.path` - Full path to `7z.exe` ([7-Zip](https://7-zip.org.pl/))
   - `tools.installerGenerator.path` - Full path
     to `ISCC.exe` ([Inno Setup](https://jrsoftware.org/isdl.php))
   - `tools.adobeExtendScriptToolkit.path` - Full path to `ExtendScript Toolkit.exe`
     from [Adobe Creative Cloud APIs and SDK](https://developer.adobe.com/apis/)


## Directory Structure:
- [`./Extensions/`](Extensions/README.md) - Extensions project directory
- [`./Installers/`](Installers/README.md) - Directory with installer versions of utility programs
- [`./Templates/`](Templates) - Templates for new extensions
- [`./Tools/`](Tools/README.md) - Directory containing programs and scripts - developer tools

### Extension templates.
At this moment only one is available :)
#### 1. Adobe InDesign, Photoshop and Illustrator Extension
A universal extension template that works simultaneously in InDesign, Photoshop, and Illustrator.

Folder: [`./Templates/Indd-PS-AI template/`](Templates/Indd-PS-AI%20template/README.md)

![](../Templates/Indd-PS-AI%20template/04%20documentation/indd-ps-ai-template.png)

[Link to the template documentation.](Templates/Indd-PS-AI%20template/04%20documentation/template-documentation/README.md)  
[Link to the template manual](Templates/Indd-PS-AI%20template/04%20documentation/extension-help/README.md)

### Developer Tools

Developer tools are available as `Gulp` scripts. They can be invoked from the console or displayed in the IDE as a menu. Some are available at the package level, others at the extension level.

#### Package level

`gulp EXTENSION_BUILDER_init` - Tests the paths in the extension configuration file. If it does not exist, it creates a new one.

###### ExtensionBuilder Versioning

`gulp VERSION_UP_Major` - Increases `Major` version and resets others (+.0.0).

`gulp VERSION_UP_Minor` - Increases `Minor` version and resets `Patch` (x.+.0).

`gulp VERSION_UP_Patch` - Increases `Patch` version (x.x.+).

###### Generating Extensions

`gulp EXTENSION_create_new` - Runs a generator for a new extension in the console.

`gulp EXTENSION_create_test` - Creates a predefined, test extension.

###### Tools

`gulp DEBUG_MODE_enable` - Enables debug mode for the _Adobe Creative Cloud_ package.
#### Extension level

A detailed description of the commands available at the extension level can be found in the [Technical documentation of the template](Templates/Indd-PS-AI%20template/04%20documentation/template-documentation/README.md#developer-toolstable-of-contents).

###### Quick Test

`gulp QUICK_TEST_on_installed_aps` - Generates a testing extension directly in the _Adobe Creative Cloud_ directory. It allows for quick tests in InDesign, Photoshop, and Illustrator.

###### Resources

`gulp ICONS_update` - Updates icon files from the source repository.


###### Extension Versioning

`gulp VERSION_UP_Major` - Raises the `Major` version and resets everything else (+.0.0).

`gulp VERSION_UP_Minor` - Increases `Minor` version and resets `Patch` (x.+.0).

`gulp VERSION_UP_Patch` - Increases `Patch` version (x.x.+).

###### Extension Generation

`gulp BUILD_minimal` - Generates extension to the `02 build` directory.

`gulp BUILD_with_installer` - Generates an installation executable file to the `03 install` directory.

###### Debugging Console

`gulp DEBUGGING_CONSOLE_Indesign` - Launches the debugging console for InDesign.

`gulp DEBUGGING_CONSOLE_Photoshop` - Launches the debugging console for Photoshop.

`gulp DEBUGGING_CONSOLE_Illustrator` - Launches the debugging console for Illustrator.

###### Extend Script Console

`gulp ExtendScript_CONSOLE` - Launches the test console.

`gulp ExtendScript_CONSOLE_initialize_test_files` - Creates test files.


## Creating a new extension.
1. Extensions can be created by running the `gulp EXTENSION_create_new` command.
2. After running and providing the required parameters, a new extension will be created in the `Extensions` directory.
3. Then, you should create a new repository dedicated to the new extension.
4. In the directory, you should run the `npm install` command.
5. Extensions should be versioned individually (recommend standard: [semantic versioning](https://docs.npmjs.com/about-semantic-versioning)).
6. Development tools for the new extension are available as **Gulp** scripts. They can be invoked from the console or displayed in the IDE as a menu.


## Links

1. Documentation
    - [Adobe Creative Cloud APIs and SDK](https://developer.adobe.com/apis/)
    - [Indesign API](https://www.indesignjs.de/extendscriptAPI/indesign-latest/#Application.html)
    - [Acrobat SDK](https://opensource.adobe.com/dc-acrobat-sdk-docs/acrobatsdk/)
    - [Adobe CEP](https://github.com/Adobe-CEP)

2. Tutorials for unit testing library:
    - [Jasmine tutorial 1](https://www.testim.io/blog/jasmine-js-a-from-scratch-tutorial-to-start-testing)
    - [Jasmine tutorial 2](https://www.youtube.com/watch?v=g6oEpkbhoeQ)
    - [Jasmine tutorial 3](https://www.youtube.com/watch?v=y4FxyLOBlUA)




   



   

