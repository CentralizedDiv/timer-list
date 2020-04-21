(function () {
  // Check permissions
  if ("Notification" in window) {
    var permission = Notification.permission;

    if (permission !== "default") {
      return;
    }

    Notification.requestPermission();
  }

  function displayNotification(body, icon, title, link, duration) {
    link = link || 0; // Link is optional
    duration = duration || 5000; // Default duration is 5 seconds

    var options = {
      body: body,
      icon: icon,
    };

    var n = new Notification(title, options);

    if (link) {
      n.onclick = function () {
        window.open(link);
      };
    }

    setTimeout(n.close.bind(n), duration);
  }
})();
