<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8
#set $forecast_settings = $Extras['weewx-DWD']['forecast_diagram']
#set $dwd_obs = $forecast_settings.get('data_types', {})
#set $data_binding = $forecast_settings.get('data_binding')

<div class="bx--col">
  <div class="bx--tile diagram-tile dwd">
    <p class="label">
      $Extras['weewx-DWD']['forecast_diagram'].get('label', 'Meteogramm')
    </p>
    <div class="value">
      <!--prettier-ignore-->
      #set $series_names = []
      #set $series_labels = []
      #set $series_colors = []

      <!--prettier-ignore-->
      #for $dwd_observation in $dwd_obs.keys()
      #set $series_name = $dwd_observation + 'Series' + 'dwd'
      #silent $series_labels.append($obs.label[$dwd_observation])
      #silent $series_names.append($series_name)
      #silent $series_colors.append($get_color($dwd_observation, $context))
      <script>
        /* prettier-ignore */
        var $series_name = $jsonize($get_dwd_forecast($dwd_observation))
      </script>
      #end for

      <!--@todo Remove/adjust data-obs, data-aggregate-type-->
      <div
        class="diagram combined"
        data-labels="$series_labels"
        data-value="$series_names"
        data-obs="temp"
        data-aggregate-type="['none', 'none', 'none', 'none', 'none']"
        data-context="week"
        data-color="$series_colors"
        data-unit="$getattr($unit.label, $dwd_obs.keys()[0])"
      ></div>
    </div>
  </div>
</div>
