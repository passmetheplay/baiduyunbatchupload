// // 用于接收来自contentScript.js的消息
// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//     if (message.file) {
//         // 将消息传递给popup.js
//         chrome.browserAction.setBadgeText({ text: '1', tabId: sender.tab.id });
//         chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000', tabId: sender.tab.id });
//         chrome.browserAction.setIcon({ path: 'images/icon48.png', tabId: sender.tab.id });
//     }
// });
