<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8

#if $varExists('forecast') or 'radar_img' in $Extras
<!--prettier-ignore-->
#set $only_radar = True if not $varExists('forecast') and 'radar_img' in $Extras else False
#set $only_forecast = True if $varExists('forecast') and not 'radar_img' in $Extras else False

<div class="bx--row">
  <header class="bx--col section-header">
    <h2>
      <!--prettier-ignore-->
      #if 'radar_img' in $Extras
        $gettext("Recent radar")
      #end if
      #if $varExists('forecast') and 'radar_img' in $Extras
       & 
      #end if
      #if $varExists('forecast')
        $gettext("Forecast")
      #end if
    </h2>
  </header>
</div>
<div class="bx--row">
  <div class="bx--col">
    <div class="bx--row">
      #if 'radar_img' in $Extras
      <div
        class="bx--col-sm-4 bx--col-md-8 bx--col-lg-12 bx--col-xlg-6 bx--col-max-6"
      >
        <div class="bx--tile tile-radar-forecast">
          <!--prettier-ignore-->
          #if 'radar_url' in $Extras
          <a href="$Extras.radar_url">
            #end if
            <img src="$Extras.radar_img" alt="Radar" />
            #if 'radar_url' in $Extras
          </a>
          <!--prettier-ignore-->
          #end if
        </div>
      </div>
      #end if
      <!--prettier-ignore-->
      #if $varExists('forecast')
      <div
        class="bx--col-sm-4 bx--col-md-8 bx--col-lg-12 bx--col-xlg-6 bx--col-max-6"
      >
        <div class="bx--tile forecast-tile">
          #if $varExists('forecast.zambretti')
          <div class="forecast">
            <h3>Zambretti</h3>
            <p>
              <!--prettier-ignore-->
              The forecast is $forecast.label('Zambretti', $forecast.zambretti.code)<br />
              <span class="issued"
                >Issued at $forecast.zambretti.issued_ts</span
              >
            </p>
          </div>
          #end if
          <div class="forecast">
            <!--prettier-ignore-->
            #include "includes/forecast-table.inc"
          </div>
        </div>
      </div>
      #end if
    </div>
  </div>
</div>
#end if
