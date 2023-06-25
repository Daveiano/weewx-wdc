<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8

#set $layout = $DisplayOptions.get('layout', 'alternative')
#set $gauges_size = $DisplayOptions.get('gauges_size', "small")

#set $gauges_display = $DisplayOptions.get('gauges_display', 'before')
#set $diagram_classes = "bx--col-sm-4 bx--col-md-4 bx--col-lg-4 bx--col-xlg-3 bx--col-max-2"
#if $layout == 'classic'
  #set $diagram_classes = "bx--col-sm-4 bx--col-md-4 bx--col-lg-6 bx--col-xlg-3 bx--col-max-3"
#end if

#if $gauges_size == "medium" and $layout == 'alternative'
  #set $diagram_classes = "bx--col-sm-4 bx--col-md-4 bx--col-lg-6 bx--col-xlg-4 bx--col-max-3"
#end if
#if $gauges_size == "large" and $layout == 'alternative'
  #set $diagram_classes = "bx--col-sm-4 bx--col-md-4 bx--col-lg-6 bx--col-xlg-6 bx--col-max-4"
#end if
#if $gauges_size == "medium" and $layout == 'classic'
  #set $diagram_classes = "bx--col-sm-4 bx--col-md-4 bx--col-lg-6 bx--col-xlg-4 bx--col-max-4"
#end if
#if $gauges_size == "large" and $layout == 'classic'
  #set $diagram_classes = "bx--col-sm-4 bx--col-md-4 bx--col-lg-12 bx--col-xlg-6 bx--col-max-6"
#end if

#set $partial_obs_key = $get_custom_data_binding_obs_key($partial_obs)
#set $series_name = $partial_obs + 'GaugeSeries' + str($gauges_index)

#set $obs_data_binding = $get_data_binding($partial_obs)

<div class="$diagram_classes">
  <div
    class="bx--tile diagram-tile gauge"
    data-test="$series_name"
    data-observation="$partial_obs_key"
  >
    <div class="bx--row">
      <div class="bx--col">
        <!--prettier-ignore-->
        <div class="value">
          <!--prettier-ignore-->
          <script>
            // TODO: Implement custom context logic from combined-diagram-tile template
            var $series_name = {
                #if $context == 'day' and not $daily_archive
                  current: "$getattr($current, $partial_obs_key).nolabel('%.2f').replace(',','.')",
                #else
                  current: "$getattr($gauge_obs_binding, 'avg').nolabel('%.2f').replace(',','.')",
                #end if

                min: "$getattr($gauge_obs_binding, 'min').nolabel('%.2f').replace(',','.')",
                max: "$getattr($gauge_obs_binding, 'max').nolabel('%.2f').replace(',','.')",
                obs: '$obs.label[$partial_obs]',
                unit: "$get_unit_label($get_unit_for_obs($partial_obs, $partial_obs_key, $context))",
                rounding: $get_rounding($partial_obs, $partial_obs_key),
                properties: $get_gauge_diagram_props($partial_obs, $context),
                label: "$obs.label[$partial_obs]"
            }
          </script>
          <div class="diagram" data-value="$series_name"></div>
        </div>
      </div>
    </div>
  </div>
</div>
