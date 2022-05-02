<!--prettier-ignore-->
#encoding UTF-8

<div class="bx--col-sm-4 bx--col-md-4 bx--col-lg-4 bx--col-xlg-4 bx--col-max-3">
  <div class="bx--tile stat-tile">
    <div class="bx--row">
      <div class="bx--col">
        <p class="label">$obs.label[$partial_obs]</p>
        <p class="value">
          #include $get_icon($partial_obs)
          <span>$getattr($current, $partial_obs)</span>
        </p>
      </div>
    </div>
    <div class="bx--row">
      <div class="bx--col">
        <p class="stat-label">$gettext("Min") $obs.label[$partial_obs]</p>
        <p class="stat-value">$getattr($day, $partial_obs).min</p>
      </div>
      <div class="bx--col">
        <p class="stat-label">$gettext("Max") $obs.label[$partial_obs]</p>
        <p class="stat-value">$getattr($day, $partial_obs).max</p>
      </div>
    </div>
  </div>
</div>
