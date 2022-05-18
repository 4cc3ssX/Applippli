
# Welcome to Applippli
JP population app by e-stats API


# Installation

    yarn install
   
**For Android** 

    yarn android # For release yarn android --variant=release

**For iOS**

    cd ios
    pod install
    cd ..
    yarn ios

# Known Issues

If iOS installation **failed** during the build and show `Multiple commands reproduce...`

 - Open Xcode
 - Click on the App name from the sidebar.
 - Click on `Build Phases` tab
 - Expand the `[CP] Copy Pods Resources`
 - Delete all entry inside `Output Files` and `Output File Lists`
 - Clean the project & Rebuild

**(or)** manually open `project.pbxproj` and find `outputPaths` under `name = "[CP] Copy Pods Resources` and then **delete** all tuple entries inside `outputPaths = (...)`.
