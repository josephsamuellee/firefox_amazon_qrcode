/**
 * Injects the QR overlay into the active tab when the toolbar button is clicked.
 * activeTab + scripting grant temporary access for this user gesture.
 */
browser.action.onClicked.addListener(async (tab) => {
  if (tab.id === undefined) return;
  try {
    await browser.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content/qr-overlay.js"],
    });
  } catch (err) {
    console.error("Clean URL QR: could not inject content script", err);
  }
});
