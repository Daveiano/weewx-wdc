<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8

#set diagram_classes = "bx--col-sm-4 bx--col-md-4 bx--col-lg-6 bx--col-xlg-6 bx--col-max-4"
#if $DisplayOptions.get('layout', 'alternative') == 'classic'
  #set diagram_classes = "bx--col-sm-4 bx--col-md-8 bx--col-lg-12 bx--col-xlg-6 bx--col-max-6"
#end if

#set $partial_obs_key = $get_custom_data_binding_obs_key($partial_obs)
#set $series_name = $partial_obs + 'GaugeSeries' + str($gauges_index)

<div class="$diagram_classes">
  <div class="diagram-tile gauge" data-test="$partial_obs">
    <div class="bx--row">
      <div class="bx--col">
        <!--prettier-ignore-->
        <div class="value">
          <!--prettier-ignore-->
          #if $context == 'day'
          <!--prettier-ignore-->
          <script>
            var $series_name = {
                current: $getattr($current, $partial_obs_key).nolabel('%.2f').replace(',','.'),
                min: $getattr($span(time_delta=$int($get_gauge_diagram_prop($partial_obs, 'aggregate_interval', $context))), $partial_obs_key).min.nolabel('%.2f').replace(',','.'),
                max: $getattr($span(time_delta=$int($get_gauge_diagram_prop($partial_obs, 'aggregate_interval', $context))), $partial_obs_key).max.nolabel('%.2f').replace(',','.'),
                obs: '$obs.label[$partial_obs]',
                unit: "$get_unit_label($get_unit_for_obs($partial_obs, $partial_obs_key, $context))",
                rounding: $get_rounding($partial_obs, $partial_obs_key),
                properties: $get_gauge_diagram_props($partial_obs, $context),
                label: "$obs.label[$partial_obs]"
            }
          </script>
          #end if

          <div class="diagram" data-value="$series_name"></div>
        </div>
      </div>
    </div>
  </div>
</div>
