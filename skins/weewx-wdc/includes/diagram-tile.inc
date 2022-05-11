#encoding UTF-8
<div class="bx--col-sm-4 bx--col-md-8 bx--col-lg-6 bx--col-xlg-6 bx--col-max-4">
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
        <div class="value">
          <!--prettier-ignore-->
          #set $series_name = $partial_obs + 'Series' + str($diagram_index)

          <!--prettier-ignore-->
          #if $precision == 'month' and $use_parameter_month
          <script>
            /* prettier-ignore */
            var $series_name = $getattr($month, $partial_obs).series(aggregate_type=$get_aggregate_type($partial_obs), aggregate_interval=$get_aggregate_interval($partial_obs, $precision), time_series='start', time_unit='unix_epoch').round($get_rounding($partial_obs)).json;
          </script>
          <!--prettier-ignore-->
          #else if $precision == 'year' and $use_parameter_year
          <script>
            /* prettier-ignore */
            var $series_name = $getattr($year, $partial_obs).series(aggregate_type=$get_aggregate_type($partial_obs), aggregate_interval=$get_aggregate_interval($partial_obs, $precision), time_series='start', time_unit='unix_epoch').round($get_rounding($partial_obs)).json;
          </script>
          #else
          <script>
            /* prettier-ignore */
            var $series_name = $getattr($span($hour_delta=$get_delta($partial_obs, $precision)), $partial_obs).series(aggregate_type=$get_aggregate_type($partial_obs), aggregate_interval=$get_aggregate_interval($partial_obs, $precision), time_series='start', time_unit='unix_epoch').round($get_rounding($partial_obs)).json;
          </script>
          #end if

          <!--
            @todo Define helper fn for data-obs
          -->
          <div
            class="diagram"
            data-labels="['$obs.label[$partial_obs]']"
            data-color="['$get_color($partial_obs)']"
            data-value="$series_name"
            data-unit="$getattr($unit.label, $partial_obs)"
            data-obs="$get_diagram_type($partial_obs)"
            data-diagram="$get_diagram($partial_obs)"
            data-precision="$precision"
          ></div>
        </div>
      </div>
    </div>
  </div>
</div>
