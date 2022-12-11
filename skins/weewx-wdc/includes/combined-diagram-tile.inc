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

#set $obs_icons = []
#for $combined_obs in $combined_diagram_obs.values()
  #if $get_icon($combined_obs) is not None and $get_icon($combined_obs) not in $obs_icons
    #silent $obs_icons.append($get_icon($combined_obs))
  #end if
#end for

<div class="$diagram_classes">
  <div class="bx--tile diagram-tile combined" data-test="$combined_obs_string">
    <div class="bx--row">
      <div class="bx--col">
        <!--prettier-ignore-->
        <p class="label">
          #set $icon = $get_icon($comb_obs, $use_combined_diagram_config=True, $context=$context)

          #if $icon is not None
            #if $icon != 'none' and "includes/icons/" in $icon and '.svg' in $icon
              #include $icon
            #elif $icon != 'none' and "includes/icons/" not in $icon
              <img src="$icon" alt="$obs.label[$partial_obs]" />
            #end if
          #else
            #for $icon in $obs_icons
              <span>
                #include $icon
              </span>
            #end for
          #end if
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
            #set $combined_obs_binding = $get_data_binding($combined_obs, $context)

          <!--prettier-ignore-->
          #if $context == 'month' and $use_parameter_month
            #set $obs_context = $month($data_binding=$combined_obs_binding)
          <!--prettier-ignore-->
          #else if $context == 'year' and $use_parameter_year
            #set $obs_context = $year($data_binding=$combined_obs_binding)
          #else if $context == 'alltime'
            #set $obs_context = $alltime($data_binding=$combined_obs_binding)
          #else if $context == 'yesterday'
            #set $obs_context = $yesterday($data_binding=$combined_obs_binding)
          #else
            #set $obs_context = $span($data_binding=$combined_obs_binding ,$hour_delta=$get_hour_delta($context), $boundary=$get_diagram_boundary($context))
          #end if

          <script>
            /* prettier-ignore */
            var $series_name = $get_diagram_data($observation=$combined_obs, $observation_key=$series_observation_key, $context_key=$context, $start_ts=$obs_context.start.raw, $end_ts=$obs_context.end.raw, $data_binding=$combined_obs_binding, $alltime_start=$alltime.start.format('%d.%m.%Y'), alltime_end=$alltime.end.format('%d.%m.%Y'), combined=$combined_diagram);
          </script>

          <!--prettier-ignore-->
          #set $combined_index = $combined_index + 1
          #end for

          <div
            class="diagram combined"
            data-labels="$series_labels"
            data-value="$series_names"
            data-color="$series_colors"
            data-unit="$get_unit_label($get_unit_for_obs($get_custom_data_binding_obs_key($combined_diagram.obs[list($combined_diagram.obs.keys())[0]].observation), $context))"
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
