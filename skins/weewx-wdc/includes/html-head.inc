<!--prettier-ignore-->
#set $diagrams_config = $DisplayOptions.get("diagrams", {})
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

<!--@todo add condition if is set-->
#if "heights" in $diagrams_config
<!--prettier-ignore-->
<style>
  #if "alternative" in $diagrams_config.heights
    #if "height" in $diagrams_config.heights.alternative
      .diagram {
        height: $diagrams_config.heights.alternative.height;
      }
    #end if
    #if "height_md" in $diagrams_config.heights.alternative
      @media screen and (min-width: 672px) {
        .diagram {
          height: $diagrams_config.heights.alternative.height_md;
        }
      }
    #end if
    #if "height_lg" in $diagrams_config.heights.alternative
      @media screen and (min-width: 1056px) {
        .diagram {
          height: $diagrams_config.heights.alternative.height_lg;
        }
      }
    #end if
    #if "height_xlg" in $diagrams_config.heights.alternative
      @media screen and (min-width: 1312px) {
        .diagram {
          height: $diagrams_config.heights.alternative.height_xlg;
        }
      }
    #end if
    #if "height_max" in $diagrams_config.heights.alternative
      @media screen and (min-width: 1920px) {
        .diagram {
          height: $diagrams_config.heights.alternative.height_max;
        }
      }
    #end if
  #end if

  #if "classic" in $diagrams_config.heights
    #if "height" in $diagrams_config.heights.classic
      body.theme-classic .diagram {
        height: $diagrams_config.heights.classic.height;
      }
    #end if
    #if "height_md" in $diagrams_config.heights.classic
      @media screen and (min-width: 672px) {
        body.theme-classic .diagram {
          height: $diagrams_config.heights.classic.height_md;
        }
      }
    #end if
    #if "height_lg" in $diagrams_config.heights.classic
      @media screen and (min-width: 1056px) {
        body.theme-classic .diagram {
          height: $diagrams_config.heights.classic.height_lg;
        }
      }
    #end if
    #if "height_xlg" in $diagrams_config.heights.classic
      @media screen and (min-width: 1312px) {
        body.theme-classic .diagram {
          height: $diagrams_config.heights.classic.height_xlg;
        }
      }
    #end if
    #if "height_max" in $diagrams_config.heights.classic
      @media screen and (min-width: 1920px) {
        body.theme-classic .diagram {
          height: $diagrams_config.heights.classic.height_max;
        }
      }
    #end if
  #end if
</style>
#end if
