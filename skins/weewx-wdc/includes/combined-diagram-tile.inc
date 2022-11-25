<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8
#set diagram_classes = "bx--col-sm-4 bx--col-md-8 bx--col-lg-12 bx--col-xlg-6 bx--col-max-4"
#if $DisplayOptions.get('layout', 'alternative') == 'classic'
  #set diagram_classes = "bx--col-sm-4 bx--col-md-8 bx--col-lg-12 bx--col-xlg-6 bx--col-max-6"
#end if
<!--prettier-ignore-->
#set $combined_diagram_obs = {}
#for $combined_obs in $combined_diagram.obs.keys()
#silent $combined_diagram_obs.update({ $combined_obs: $combined_diagram.obs[$combined_obs].observation })
#end for

#set combined_obs_string = '-'.join($combined_diagram_obs.values())

<div class="$diagram_classes">
  <div class="bx--tile diagram-tile combined" data-test="$combined_obs_string">
    <div class="bx--row">
      <div class="bx--col">
        <!--prettier-ignore-->
        <p class="label">
          #for $combined_obs in $combined_diagram_obs.values()
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
          #set series_aggregate_type = []
          #set $combined_index = 0

          <!--prettier-ignore-->
          #for $combined_obs in $combined_diagram_obs.keys()
            #set $series_observation = $combined_diagram_obs[$combined_obs]
            #set $series_name = $series_observation + 'Series' + str($diagram_index) + str($combined_index)
            #silent $series_names.append($series_name)
            #silent $series_labels.append($obs.label[$series_observation])
            #silent $series_aggregate_type.append($get_aggregate_type($series_observation, $context, combined=$combined_diagram.obs[$combined_obs]))
            #silent $series_colors.append($get_color($comb_obs, $context, combined=True, combined_obs_key=$combined_obs, combined_obs=$series_observation))
            #set $series_observation_key = $get_custom_data_binding_obs_key($series_observation)

          <!--prettier-ignore-->
          #if $context == 'month' and $use_parameter_month
          <script>
            /* prettier-ignore */
            var $series_name = $getattr($month($data_binding=$get_data_binding_combined_diagram($combined_obs, $combined_diagram, $comb_obs)), $series_observation_key).series(aggregate_type=$get_aggregate_type($series_observation_key, $context, combined=$combined_diagram.obs[$combined_obs]), aggregate_interval=$get_aggregate_interval($series_observation_key, $context, alltime_start=$alltime.start.format('%d.%m.%Y'), alltime_end=$alltime.end.format('%d.%m.%Y')), time_series='both', time_unit='unix_epoch').round($get_rounding($series_observation_key)).json;
          </script>
          <!--prettier-ignore-->
          #else if $context == 'year' and $use_parameter_year
          <script>
            /* prettier-ignore */
            var $series_name = $getattr($year($data_binding=$get_data_binding_combined_diagram($combined_obs, $combined_diagram, $comb_obs)), $series_observation_key).series(aggregate_type=$get_aggregate_type($series_observation_key, $context, combined=$combined_diagram.obs[$combined_obs]), aggregate_interval=$get_aggregate_interval($series_observation_key, $context, alltime_start=$alltime.start.format('%d.%m.%Y'), alltime_end=$alltime.end.format('%d.%m.%Y')), time_series='both', time_unit='unix_epoch').round($get_rounding($series_observation_key)).json;
          </script>
          #else if $context == 'alltime'
          <script>
            /* prettier-ignore */
            var $series_name = $getattr($alltime($data_binding=$get_data_binding_combined_diagram($combined_obs, $combined_diagram, $comb_obs)), $series_observation_key).series(aggregate_type=$get_aggregate_type($series_observation_key, $context, combined=$combined_diagram.obs[$combined_obs]), aggregate_interval=$get_aggregate_interval($series_observation_key, $context, alltime_start=$alltime.start.format('%d.%m.%Y'), alltime_end=$alltime.end.format('%d.%m.%Y')), time_series='both', time_unit='unix_epoch').round($get_rounding($series_observation_key)).json;
          </script>
          #else if $context == 'yesterday'
          <script>
            /* prettier-ignore */
            var $series_name = $getattr($yesterday($data_binding=$get_data_binding_combined_diagram($combined_obs, $combined_diagram, $comb_obs)), $series_observation_key).series(aggregate_type=$get_aggregate_type($series_observation_key, $context, combined=$combined_diagram.obs[$combined_obs]), aggregate_interval=$get_aggregate_interval($series_observation_key, $context, alltime_start=$alltime.start.format('%d.%m.%Y'), alltime_end=$alltime.end.format('%d.%m.%Y')), time_series='both', time_unit='unix_epoch').round($get_rounding($series_observation_key)).json;
          </script>
          #else
          <script>
            /* prettier-ignore */
            var $series_name = $getattr($span($data_binding=$get_data_binding_combined_diagram($combined_obs, $combined_diagram, $comb_obs),$hour_delta=$get_hour_delta($context), $boundary=$get_diagram_boundary($context)), $series_observation_key).series(aggregate_type=$get_aggregate_type($series_observation_key, $context, combined=$combined_diagram.obs[$combined_obs]), aggregate_interval=$get_aggregate_interval($series_observation_key, $context, alltime_start=$alltime.start.format('%d.%m.%Y'), alltime_end=$alltime.end.format('%d.%m.%Y')), time_series='both', time_unit='unix_epoch').round($get_rounding($series_observation_key)).json;
          </script>
          <!--prettier-ignore-->
          #end if
            #set $combined_index = $combined_index + 1
          #end for

          <div
            class="diagram combined"
            data-labels="$series_labels"
            data-value="$series_names"
            data-color="$series_colors"
            data-unit="$getattr($unit.label, $get_custom_data_binding_obs_key($combined_diagram.obs[list($combined_diagram.obs.keys())[0]].observation))"
            data-obs="$get_diagram_type($combined_diagram.obs[list($combined_diagram.obs.keys())[0]].observation)"
            data-diagram="$get_diagram($combined_diagram.obs[list($combined_diagram.obs.keys())[0]].observation)"
            data-context="$context"
            data-aggregate-type="$series_aggregate_type"
            data-nivo-props="$get_diagram_props($comb_obs, $context)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</div>
