<!--prettier-ignore-->
#encoding UTF-8

<div id="footer">
  <div class="bx--grid bx--grid--full-width">
    <div class="bx--row">
      <div class="bx--col">
        <p>
          $gettext("Weewx uptime"): $station.uptime<br />
          $gettext("Server uptime"): $station.os_uptime<br />
          weewx $station.version with $station.hardware<br />
          $gettext("Skin"): $SKIN_NAME $SKIN_VERSION
        </p>
      </div>
      <div class="bx--col">
        <p>
          $pgettext("Geographical", "Altitude"): $station.altitude<br />
          $gettext("Latitude"): $station.latitude[0]&deg; $station.latitude[1]'
          $station.latitude[2]<br />
          $gettext("Longitude"): $station.longitude[0]&deg;
          $station.longitude[1]' $station.longitude[2]
        </p>
      </div>
    </div>
    <div class="bx--row">
      <div class="bx--col">
        <!--prettier-ignore-->
        <p class="footnote">
          $gettext("This station is controlled by <a target='_blank' href='https://weewx.com'>WeeWX</a>, an experimental weather software system written in Python.")
        </p>
      </div>
    </div>
  </div>
</div>
