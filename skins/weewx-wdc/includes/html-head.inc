<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8
#set $diagrams_config = $DisplayOptions.get("diagrams", {})
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/2.6.0/webcomponents-loader.min.js"></script>
<!-- <script>
  window.WebComponents = window.WebComponents || {};
  window.WebComponents.root = "node_modules/@webcomponents/webcomponentsjs/";
</script> -->
#if 'windRose' in $DisplayOptions.get('diagram_tile_observations', [])
<script src="plotly-custom-build.min.js" defer></script>
#end if
<link
  href="dist/main.css"
  rel="preload"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
<noscript><link rel="stylesheet" href="dist/main.css" /></noscript>
<link rel="icon" type="image/x-icon" href="favicon.ico" />
<meta
  name="description"
  content='Weewx $station.location - $gettext("Station Description")'
/>
<link rel="manifest" href="manifest.json" />
<meta name="theme-color" content="#161616" />
<link rel="apple-touch-icon" href="icon-192x192.png" />
<script>
  // Check that service workers are supported
  if ("serviceWorker" in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js");
    });
  }
</script>
<!--prettier-ignore-->
#set $diagramWindDirOrdinals = int($DisplayOptions.get('diagram_tile_winddir_ordinal', True) == "True")
<script>
  /*prettier-ignore*/
  window.weewxWdcConfig = {
    diagramWindDirOrdinals: $diagramWindDirOrdinals,
    ordinalCompass: $get_ordinates,
    windRoseColors: $jsonize($DisplayOptions.get('windRose_colors', ["rgb(243, 206, 201)", "#e7a4b6", "#cd7eaf", "#a262a9", "#6f4d96", "#3d3b72"])),
    units: $unit.unit_type_dict,
    dwdForecastTable: $Extras.get("weewx-DWD").get("forecast_table_settings")
  };
</script>

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
