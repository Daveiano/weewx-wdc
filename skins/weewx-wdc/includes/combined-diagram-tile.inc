#encoding UTF-8
<div class="bx--col-sm-4 bx--col-md-8 bx--col-lg-6 bx--col-xlg-6 bx--col-max-4">
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
          <script>
            /* prettier-ignore */
            var $series_name = $getattr($span($hour_delta=$get_delta($partial_obs, $precision)), $combined_obs).series(aggregate_type=$get_aggregate_type($partial_obs), aggregate_interval=$get_aggregate_interval($partial_obs, $precision), time_series='start', time_unit='unix_epoch').round($get_rounding($combined_obs)).json;
          </script>
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
