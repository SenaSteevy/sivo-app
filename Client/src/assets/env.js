(function (window) {
    window["env"] = window["env"] || {};
    // This line will be replaced with the actual environment variable at runtime
    window["env"]["apiUrl"] = "${API_GATEWAY_URL}";
  })(this);
  