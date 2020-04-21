(function () {
  // Check permissions
  if ("Notification" in window) {
    var permission = Notification.permission;

    if (permission !== "default") {
      return;
    }

    Notification.requestPermission();
  }
})();
