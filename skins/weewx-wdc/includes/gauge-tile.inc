<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8

#set diagram_classes = "bx--col-sm-4 bx--col-md-8 bx--col-lg-12 bx--col-xlg-6 bx--col-max-4"
#if $DisplayOptions.get('layout', 'alternative') == 'classic'
  #set diagram_classes = "bx--col-sm-4 bx--col-md-8 bx--col-lg-12 bx--col-xlg-6 bx--col-max-6"
#end if

#set $partial_obs_key = $get_custom_data_binding_obs_key($partial_obs)
#set $series_name = $partial_obs + 'GaugeSeries' + str($gauges_index)

<div class="$diagram_classes">
  <div class="bx--tile diagram-tile gauge" data-test="$partial_obs">
    <div class="bx--row">
      <div class="bx--col">
        <!--prettier-ignore-->
        <p class="label">
          #set $icon = $get_icon($partial_obs_key, $use_diagram_config=True, $context=$context)
          #if $icon != 'none' and "includes/icons/" in $icon and '.svg' in $icon
            #include $icon
          #elif $icon != 'none' and "includes/icons/" not in $icon
            <img src="$icon" alt="$obs.label[$partial_obs]" />
          #end if
          $obs.label[$partial_obs]
        </p>
        <div class="value">
          <!--prettier-ignore-->
          #if $context == 'day'
          <!--prettier-ignore-->
          <script>
            var $series_name = {
                current: $getattr($current, $partial_obs_key).nolabel('%.2f').replace(',','.'),
                min: $getattr($span(time_delta=$int($DisplayOptions.get("gauge_tiles_day_aggregate_interval", 21600))), $partial_obs_key).min.nolabel('%.2f').replace(',','.'),
                max: $getattr($span(time_delta=$int($DisplayOptions.get("gauge_tiles_day_aggregate_interval", 21600))), $partial_obs_key).max.nolabel('%.2f').replace(',','.'),
                obs: '$obs.label[$partial_obs]',
                unit: "$get_unit_label($get_unit_for_obs($partial_obs, $partial_obs_key, $context))",
                rounding: $get_rounding($partial_obs, $partial_obs_key),
            }
          </script>
          #end if

          <div class="diagram" data-value="$series_name"></div>
        </div>
      </div>
    </div>
  </div>
</div>
