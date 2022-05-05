#encoding UTF-8
<div class="bx--col-sm-4 bx--col-md-8 bx--col-lg-8 bx--col-xlg-8 bx--col-max-6">
  <div class="bx--tile diagram-tile">
    <div class="bx--row">
      <div class="bx--col">
        <p class="label">
          <!--prettier-ignore-->
          #if $get_icon($partial_obs) is not None
          #include $get_icon($partial_obs)
          #end if
          $obs.label[$partial_obs]
        </p>
        <p class="value">
          #set $series_name = $partial_obs + 'Series'
          <script>
            // prettier-ignore
            var $series_name = $day.outTemp.series(aggregate_type='avg', aggregate_interval='1800',
                                                         time_series='start', time_unit='unix_epoch').round(2).json;
          </script>

          <div class="diagram" data-value="$series_name" data-unit="$getattr($unit.label, $partial_obs)"></div>
        </p>
      </div>
    </div>
  </div>
</div>
