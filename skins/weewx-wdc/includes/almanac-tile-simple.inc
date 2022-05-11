<!--prettier-ignore-->
#encoding UTF-8

<div class="bx--col-sm-4 bx--col-md-4 bx--col-lg-4 bx--col-xlg-4 bx--col-max-3">
  <div class="bx--tile almanac-tile simple">
    <div class="bx--row">
      <div class="bx--col">
        <p class="label">
          <!--prettier-ignore-->
          $label_almanac
          #include "includes/pictograms/sun.svg"
        </p>
        <div class="bx--row">
          <div class="bx--col value">
            #include "includes/icons/sunrise.svg"
            <div class="value-col">
              <p class="label small">$gettext("Sunrise")</p>
              <p class="value">$almanac.sunrise</p>
            </div>
          </div>
          <div class="bx--col value">
            #include "includes/icons/sunset.svg"
            <div class="value-col">
              <p class="label small">$gettext("Sunset")</p>
              <p class="value">$almanac.sunset</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
