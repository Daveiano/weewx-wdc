#encoding UTF-8
<div class="bx--col-sm-4 bx--col-md-4 bx--col-lg-4 bx--col-xlg-4 bx--col-max-3">
  <div class="bx--tile stat-tile">
    <div class="bx--row">
      <div class="bx--col">
        <p class="label">$obs.label[$partial_obs]</p>
        <p class="value">
          <!--prettier-ignore-->
          #if $get_icon($partial_obs) is not None
          #include $get_icon($partial_obs)
          #end if

          <span>$getattr($current, $partial_obs)</span>
        </p>
      </div>
    </div>
    <div class="bx--row">
      #if $get_show_min_stat($partial_obs)
      <div class="bx--col">
        <p class="stat-label">$gettext("Min")</p>
        <p class="stat-value">$getattr($day, $partial_obs).min</p>
      </div>
      #end if
      <div class="bx--col">
        <p class="stat-label">$gettext("Max")</p>
        <p class="stat-value">$getattr($day, $partial_obs).max</p>
      </div>
    </div>
  </div>
</div>
