# <img src="https://raw.githubusercontent.com/rahulkapoor90/YouTube-Enhancement-Suite/master/Media/logo.gif" width="500">

[![Code Climate](https://codeclimate.com/github/rahulkapoor90/YouTube-Enhancement-Suite/badges/gpa.svg)](https://codeclimate.com/github/rahulkapoor90/YouTube-Enhancement-Suite)

> *This Repository is highly inspired from [Reddit Enhancement Suite.](https://github.com/honestbleeps/Reddit-Enhancement-Suite "RES")*

> Chrome extension that helps you to enhance your browsing experience at [YouTube] (https://www.youtube.com)

For general documentation, visit the [YouTube Enhancement Suite Wiki](https://github.com/rahulkapoor90/YouTube-Enhancement-Suite/wiki).

<img src="https://i.imgur.com/Pr2szKf.png">
## Contributor guidelines

Contributions are welcome. if you see any issue then open an issue and if you think you can fix it then start working on it by forking this project. We just ask that you follow a few simple guidelines:

1. It would be greatly appreciated if you could stick to a few style guidelines:

  - please use tabs for indentation
  - please use spaces in your `if` statements, e.g. `if (foo === bar)`, not `if(foo===bar)`
  - please use single quotes `'` and not double quotes `"` for strings
  - please comment your code!
  
2. If you are introducing a big change, please make sure that everything else is working correctly.

## Download

"YES" is available for Chrome users though the firefox is still in BETA phase and will be out as soon as Chrome one is stable. you can download the extension using the following links:

* Google Chrome Download -> [YES](https://chrome.google.com/webstore/detail/youtube-enhancement-suite/lbmbojneffepdjppjdakeejfoidecjmo)

## Project structure

  - `Extension for Chrome/`: Chrome-specific  VES files
  - `Media/`: Image source
  - `CHANGELOG.md`: self-explanatory 
  - `README.md`: YOU ARE HERE, unless you're browsing on GitHub.
  
## Building development versions of the extension

##### Building in Chrome

  1. Go to `Menu->Tools->Extensions` and tick the `Developer Mode` checkbox
  2. Choose `Load unpacked extension` and point it to the `dist/chrome` folder. Make sure you only have one VITacademics ES version running at a time.
  3. Any time you make changes to the script, you must go back to the `Menu->Tools->Extensions` page and `Reload` the extension.
