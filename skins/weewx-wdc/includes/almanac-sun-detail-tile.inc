<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8

<div class="bx--col-sm-4 bx--col-md-4 bx--col-lg-4 bx--col-xlg-4 bx--col-max-3">
  <div class="bx--tile almanac-tile detail">
    <div class="bx--row">
      <div class="bx--col">
        <p class="label">$gettext("Sun")</p>
        <div class="bx--row stats">
          <div class="bx--col">
            <p class="label small">$gettext("Start civil twilight")</p>
            <p class="value">$almanac(horizon=-6).sun(use_center=1).rise</p>
          </div>
          <div class="bx--col">
            <p class="label small">$gettext("End civil twilight")</p>
            <p class="value">$almanac(horizon=-6).sun(use_center=1).set</p>
          </div>
        </div>
        <div class="bx--row stats">
          <div class="bx--col">
            <p class="label small">$gettext("Start nautic twilight")</p>
            <p class="value">$almanac(horizon=-12).sun(use_center=1).rise</p>
          </div>
          <div class="bx--col">
            <p class="label small">$gettext("End nautic twilight")</p>
            <p class="value">$almanac(horizon=-12).sun(use_center=1).set</p>
          </div>
        </div>
        <div class="bx--row stats">
          <div class="bx--col">
            <p class="label small">$gettext("Start astronomic twilight")</p>
            <p class="value">$almanac(horizon=-18).sun(use_center=1).rise</p>
          </div>
          <div class="bx--col">
            <p class="label small">$gettext("End astronomic twilight")</p>
            <p class="value">$almanac(horizon=-18).sun(use_center=1).set</p>
          </div>
        </div>
        <div class="bx--row stats">
          <div class="bx--col">
            <p class="label small">$gettext("Azimuth")</p>
            <p class="value">$("%.1f&deg;" % $almanac.sun.az)s</p>
          </div>
          <div class="bx--col">
            <p class="label small">$pgettext("Astronomical", "Altitude")</p>
            <p class="value">$("%.1f&deg;" % $almanac.sun.alt)</p>
          </div>
        </div>
        <div class="bx--row stats">
          <div class="bx--col">
            <p class="label small">$gettext("Right ascension")</p>
            <p class="value">$("%.1f&deg;" % $almanac.sun.ra)</p>
          </div>
          <div class="bx--col">
            <p class="label small">$gettext("Declination")</p>
            <p class="value">$("%.1f&deg;" % $almanac.sun.dec)</p>
          </div>
        </div>
        <!--prettier-ignore-->
        #if $almanac.next_equinox.raw < $almanac.next_solstice.raw
        ## The equinox is before the solstice. Display them in order.
        <div class="bx--row stats">
          <div class="bx--col">
            <p class="label small">$gettext("Equinox")</p>
            <p class="value">$almanac.next_equinox</p>
          </div>
          <div class="bx--col">
            <p class="label small">$gettext("Solstice")</p>
            <p class="value">$almanac.next_solstice</p>
          </div>
        </div>
        <!--prettier-ignore-->
        #else
        ## The solstice is before the equinox. Display them in order.
        <div class="bx--row stats">
          <div class="bx--col">
            <p class="label small">$gettext("Solstice")</p>
            <p class="value">$almanac.next_solstice</p>
          </div>
          <div class="bx--col">
            <p class="label small">$gettext("Equinox")</p>
            <p class="value">$almanac.next_equinox</p>
          </div>
        </div>
        #end if
        <div class="bx--row">
          <div class="bx--col">
            <p class="label small">$gettext("Total daylight")</p>
            <p class="value">$almanac.sun.visible.long_form</p>
            <p class="label small">
              <!--prettier-ignore-->
              $almanac.sun.visible_change.long_form
              #if $almanac.sun.visible_change.raw < 0
                $gettext("less than yesterday")
              #else
                $gettext("more than yesterday")
              #end if
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
