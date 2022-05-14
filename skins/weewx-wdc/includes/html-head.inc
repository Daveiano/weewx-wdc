#if $encoding == 'utf8'
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
#end if
<meta name="viewport" content="width=device-width, initial-scale=1" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/2.6.0/webcomponents-loader.min.js"></script>
<script>
  window.WebComponents = window.WebComponents || {};
  window.WebComponents.root = "node_modules/@webcomponents/webcomponentsjs/";
</script>
<link rel="stylesheet" href="dist/scss/index.css" />
<link rel="icon" type="image/x-icon" href="favicon.ico" />
<meta
  name="description"
  content='Weewx $station.location - $gettext("Station Description")'
/>
<link rel="manifest" href="manifest.json" />
<meta name="theme-color" content="#161616" />
<link rel="apple-touch-icon" href="/icon-192x192.png" />
<script>
  // Check that service workers are supported
  if ("serviceWorker" in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js");
    });
  }
</script>
