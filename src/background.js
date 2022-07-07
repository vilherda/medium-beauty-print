const NULL_FUNCTION = () => null;

chrome.runtime.onInstalled.addListener((details) => {
  const info = chrome.runtime.getManifest();
  console.log(
    `Installed extension ${info.name} v${info.version}`,
    JSON.stringify(details)
  );
});

function enableOrDisable(tabId, url) {
  chrome.permissions.getAll((permissions) => {
    if (permissions.origins) {
      const success = permissions.origins.map((matchingScheme) => new RegExp(`${matchingScheme}`.substring(0, `${matchingScheme}`.length - 1).replace(/\./g, '\\.').replace(/\*/g, '.*').concat('.+')).test(url)).find((validation) => validation);
      let title = 'DISABLED';
      if (success) {
        title = 'ENABLED';
        chrome.action.enable( tabId, NULL_FUNCTION );
      } else {
        chrome.action.disable( tabId, NULL_FUNCTION );
      }
      chrome.action.setTitle( { tabId, title }, NULL_FUNCTION );
    }
  });
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url) {
      enableOrDisable(tab.id, tab.url);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    enableOrDisable(tabId, changeInfo.url);
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  const target = { tabId: tab.id };
  await chrome.scripting.insertCSS({target, files: ['custom.css']});
  await chrome.scripting.executeScript({target, files: ['injection.js']});
});
