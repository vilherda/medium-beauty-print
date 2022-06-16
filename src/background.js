chrome.runtime.onInstalled.addListener((details) => {
  const info = chrome.runtime.getManifest();
  console.log(
    `Installed extension ${info.name} v${info.version}`,
    JSON.stringify(details)
  );
});

chrome.action.onClicked.addListener(async (tab) => {
  const target = { tabId: tab.id };
  await chrome.scripting.insertCSS({target, files: ['custom.css']});
  await chrome.scripting.executeScript({target, files: ['injection.js']});
});
