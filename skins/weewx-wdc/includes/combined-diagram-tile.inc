<!--prettier-ignore-->
#encoding UTF-8
#set diagram_classes = "bx--col-sm-4 bx--col-md-8 bx--col-lg-12 bx--col-xlg-6 bx--col-max-4"
#if $DisplayOptions.get('layout') == 'classic'
  #set diagram_classes = "bx--col-sm-4 bx--col-md-8 bx--col-lg-12 bx--col-xlg-6 bx--col-max-6"
#end if

<div class="$diagram_classes">
  <div class="bx--tile diagram-tile combined">
    <div class="bx--row">
      <div class="bx--col">
        <!--prettier-ignore-->
        <p class="label">
          #for $combined_obs in $combined_diagram.obs.keys()
            <span>
              #if $get_icon($combined_obs) is not None
                #include $get_icon($combined_obs)
              #end if
            </span>
          #end for
          $combined_diagram.label
        </p>
        <div class="value">
          <!--prettier-ignore-->
          #set $series_names = []
          #set $series_colors = []
          #set $series_labels = []

          <!--prettier-ignore-->
          #for $combined_obs in $combined_diagram.obs.keys()
            #set $series_name = $combined_obs + 'Series' + str($diagram_index)
            #silent $series_names.append($series_name)
            #silent $series_labels.append($obs.label[$combined_obs])
            #if 'color' in $combined_diagram.obs[$combined_obs] then $series_colors.append($combined_diagram.obs[$combined_obs].color) else $series_colors.append($get_color($combined_obs))#

          <!--prettier-ignore-->
          #if $precision == 'month' and $use_parameter_month
          <script>
            /* prettier-ignore */
            var $series_name = $getattr($month, $combined_obs).series(aggregate_type=$get_aggregate_type($combined_obs), aggregate_interval=$get_aggregate_interval($combined_obs, $precision, alltime_start=$alltime.start.format('%d.%m.%Y'), alltime_end=$alltime.end.format('%d.%m.%Y')), time_series='both', time_unit='unix_epoch').round($get_rounding($combined_obs)).json;
          </script>
          <!--prettier-ignore-->
          #else if $precision == 'year' and $use_parameter_year
          <script>
            /* prettier-ignore */
            var $series_name = $getattr($year, $combined_obs).series(aggregate_type=$get_aggregate_type($combined_obs), aggregate_interval=$get_aggregate_interval($combined_obs, $precision, alltime_start=$alltime.start.format('%d.%m.%Y'), alltime_end=$alltime.end.format('%d.%m.%Y')), time_series='both', time_unit='unix_epoch').round($get_rounding($combined_obs)).json;
          </script>
          #else
          <script>
            /* prettier-ignore */
            var $series_name = $getattr($span($hour_delta=$get_hour_delta($precision), $week_delta=$get_week_delta($precision), $boundary=$get_diagram_boundary($precision)), $combined_obs).series(aggregate_type=$get_aggregate_type($combined_obs), aggregate_interval=$get_aggregate_interval($combined_obs, $precision, alltime_start=$alltime.start.format('%d.%m.%Y'), alltime_end=$alltime.end.format('%d.%m.%Y')), time_series='both', time_unit='unix_epoch').round($get_rounding($combined_obs)).json;
          </script>
          <!--prettier-ignore-->
          #end if
          #end for

          <div
            class="diagram combined"
            data-labels="$series_labels"
            data-value="$series_names"
            data-color="$series_colors"
            data-unit="$getattr($unit.label, $combined_diagram.obs.keys()[0])"
            data-obs="$get_diagram_type($combined_diagram.obs.keys()[0])"
            data-diagram="$get_diagram($combined_diagram.obs.keys()[0])"
            data-precision="$precision"
          ></div>
        </div>
      </div>
    </div>
  </div>
</div>
