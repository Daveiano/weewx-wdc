<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8

<div class="bx--col-sm-4 bx--col-md-4 bx--col-lg-4 bx--col-xlg-4 bx--col-max-3">
  <div class="bx--tile almanac-tile detail">
    <div class="bx--row">
      <div class="bx--col">
        <p class="label">$gettext("Moon")</p>
        <div class="bx--row stats">
          <div class="bx--col">
            <p class="label small">$gettext("Azimuth")</p>
            <p class="value">$("%.1f&deg;" % $almanac.moon.az)s</p>
          </div>
          <div class="bx--col">
            <p class="label small">$pgettext("Astronomical", "Altitude")</p>
            <p class="value">$("%.1f&deg;" % $almanac.moon.alt)</p>
          </div>
        </div>
        <div class="bx--row stats">
          <div class="bx--col">
            <p class="label small">$gettext("Right ascension")</p>
            <p class="value">$("%.1f&deg;" % $almanac.moon.ra)</p>
          </div>
          <div class="bx--col">
            <p class="label small">$gettext("Declination")</p>
            <p class="value">$("%.1f&deg;" % $almanac.moon.dec)</p>
          </div>
        </div>
        <!--prettier-ignore-->
        #if $almanac.next_full_moon.raw < $almanac.next_new_moon.raw
        <div class="bx--row stats">
          <div class="bx--col">
            <p class="label small">$gettext("Full moon")</p>
            <p class="value">$almanac.next_full_moon</p>
          </div>
          <div class="bx--col">
            <p class="label small">$gettext("New moon")</p>
            <p class="value">$almanac.next_new_moon</p>
          </div>
        </div>
        #else
        <div class="bx--row stats">
          <div class="bx--col">
            <p class="label small">$gettext("New moon")</p>
            <p class="value">$almanac.next_new_moon</p>
          </div>
          <div class="bx--col">
            <p class="label small">$gettext("Full moon")</p>
            <p class="value">$almanac.next_full_moon</p>
          </div>
        </div>
        #end if
        <div class="bx--row">
          <div class="bx--col">
            <p class="label small">$gettext("Phase")</p>
            <p class="value">$almanac.moon_phase</p>
            <p class="label small">$almanac.moon_fullness% $gettext("full")</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
