function addDialogScripts(editor) {
  editor.on("component:add", (model) => {
    if (
      model.is("button") &&
      model.get("attributes").id.startsWith("dialog-button-")
    ) {
      const baseId = model.get("attributes").id.replace("dialog-button-", "");

      const dialogOverlay = document.getElementById(`dialog-${baseId}-overlay`);
      const dialogContent = document.getElementById(`dialog-${baseId}-content`);
      const dialogBox = document.getElementById(`dialog-${baseId}-box`);

      model.view.el.addEventListener("click", () => {
        if (dialogOverlay && dialogContent && dialogBox) {
          dialogOverlay.classList.remove("hidden");
          dialogContent.classList.remove("hidden");
          dialogBox.classList.remove("hidden");
        }
      });

      if (dialogOverlay) {
        dialogOverlay.addEventListener("click", () => {
          dialogOverlay.classList.add("hidden");
          dialogContent.classList.add("hidden");
          dialogBox.classList.add("hidden");
        });
      }

      const closeBtn = document.getElementById(`dialog-${baseId}-close`);
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          if (dialogOverlay && dialogContent && dialogBox) {
            dialogOverlay.classList.add("hidden");
            dialogContent.classList.add("hidden");
            dialogBox.classList.add("hidden");
          }
        });
      }
    }
  });
}
