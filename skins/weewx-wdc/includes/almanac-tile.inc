<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8
#set $planet = $label_almanac.lower()

<div class="bx--col-sm-4 bx--col-md-4 bx--col-lg-4 bx--col-xlg-4 bx--col-max-3">
  <div class="bx--tile almanac-tile">
    <div class="bx--row">
      <div class="bx--col">
        <p class="label">
          <!--prettier-ignore-->
          $gettext($label_almanac)
          #if $get_celestial_icon($label_almanac, None) is not None
          #include $get_celestial_icon($label_almanac, None)
          #end if
        </p>
        <div class="bx--row">
          <div class="bx--col value">
            <!--prettier-ignore-->
            #if $get_celestial_icon($label_almanac, 'rise') is not None
            #include $get_celestial_icon($label_almanac, 'rise')
            #end if
            <div class="value-col">
              <p class="label small">$gettext($label_almanac + "rise")</p>
              <p class="value">$getattr($almanac, $planet).rise</p>
            </div>
          </div>
          <div class="bx--col value">
            <!--prettier-ignore-->
            #if $get_celestial_icon($label_almanac, 'transit') is not None
            #include $get_celestial_icon($label_almanac, 'transit')
            #end if
            <div class="value-col">
              <p class="label small">$gettext("Transit")</p>
              <p class="value">$getattr($almanac, $planet).transit</p>
            </div>
          </div>
          <div class="bx--col value">
            <!--prettier-ignore-->
            #if $get_celestial_icon($label_almanac, 'set') is not None
            #include $get_celestial_icon($label_almanac, 'set')
            #end if
            <div class="value-col">
              <p class="label small">$gettext($label_almanac + "set")</p>
              <p class="value">$getattr($almanac, $planet).set</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
