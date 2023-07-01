<!--prettier-ignore-->
#errorCatcher Echo
#import datetime
#import time

<!--prettier-ignore-->
#encoding UTF-8
## Input vars:
##   $combined_diagram - The diagrams config
##   $comb_obs - The skin observation (e.g. tempdew or temp_min_max_avg)
##   $context - The current context

#set $diagram_classes = "bx--col-sm-4 bx--col-md-8 bx--col-lg-12 bx--col-xlg-6 bx--col-max-4"
#if $DisplayOptions.get('layout', 'alternative') == 'classic'
  #set $diagram_classes = "bx--col-sm-4 bx--col-md-8 bx--col-lg-12 bx--col-xlg-6 bx--col-max-6"
#end if

#if $varExists('diagram_classes_custom')
  #set $diagram_classes = $diagram_classes_custom
#end if

#if $comb_obs == "climatogram_year" or $comb_obs == "climatogram_statistics"
  #set $diagram_classes = "bx--col"
#end if

<!--prettier-ignore-->
#set $combined_diagram_obs = {}
#for $combined_obs in $combined_diagram.obs.keys()
#silent $combined_diagram_obs.update({ $combined_obs: $combined_diagram.obs[$combined_obs].observation })
#end for

#set combined_obs_string = '-'.join($combined_diagram_obs.values())

#set $obs_icons = []
#for $combined_obs in $combined_diagram_obs.values()
  #set $obs_icon = $get_icon($combined_obs)
  #if $obs_icon is not None and $obs_icon not in $obs_icons and $obs_icon != 'none'
    #silent $obs_icons.append($obs_icon)
  #end if
#end for

#set $diagram_props = $get_diagram_props($comb_obs, $context)

<div class="$diagram_classes">
  <div class="bx--tile diagram-tile combined" data-test="$combined_obs_string">
    <div class="bx--row">
      <div class="bx--col">
        <!--prettier-ignore-->
        <p class="label">
          #set $icon = $get_icon($comb_obs, $use_combined_diagram_config=True, $context=$context)

          #if $icon != 'unset'
            #if $icon is not None and $icon != 'none'
              #if "includes/icons/" in $icon and '.svg' in $icon
                #include $icon
              #elif "includes/icons/" not in $icon
                <img src="$icon" alt="$obs.label[$partial_obs]" />
              #end if
            #else
              #for $icon in $obs_icons
                <span>
                  #include $icon
                </span>
              #end for
            #end if
          #end if

          $gettext($combined_diagram.label)
        </p>
        <!--prettier-ignore-->
        <div class="value">
          #set $series_names = []
          #set $series_colors = []
          #set $series_labels = []
          #set $series_units = []
          #set $series_observations = []
          #set $series_observation_keys = []
          #set $series_aggregate_type = []
          #set $diagram_types = []
          #set $combined_index = 0

          #for $combined_obs in $combined_diagram_obs.keys()
            #set $series_observation = $combined_diagram_obs[$combined_obs]
            #set $series_name = $series_observation + 'Series' + str($diagram_index) + str($combined_index)
            #silent $series_names.append($series_name)
            #silent $series_labels.append($obs.label[$series_observation])
            #silent $series_observations.append($series_observation)
            #silent $series_observation_keys.append($combined_obs)
            #silent $series_aggregate_type.append($gettext($get_aggregate_type($combined_obs, $context, combined=$combined_diagram.obs[$combined_obs]).capitalize()))
            #silent $series_colors.append($get_color($comb_obs, $context, combined=True, combined_obs_key=$combined_obs, combined_obs=$series_observation))
            #set $series_observation_key = $get_custom_data_binding_obs_key($series_observation)
            #set $combined_obs_binding = $get_data_binding($combined_obs, $context, combined_key=$comb_obs)
            #silent $series_units.append($get_unit_label($get_unit_for_obs($combined_obs, $series_observation_key, $context, combined=$combined_diagram, combined_key=$comb_obs)))
            #silent $diagram_types.append($get_diagram($series_observation_key, $context, combined_key=$comb_obs, combined_obs=$combined_obs))

          #if $context == 'month' and $use_parameter_month
            #set $obs_context = $month($data_binding=$combined_obs_binding)
            #set $start_ts=$obs_context.start.raw
            #set $end_ts=$obs_context.end.raw
            #set $context_key = $context
          #else if $context == 'year' and $use_parameter_year
            #set $obs_context = $year($data_binding=$combined_obs_binding)
            #set $start_ts=$obs_context.start.raw
            #set $end_ts=$obs_context.end.raw
            #set $context_key = $context
          #else if $context == 'alltime'
            #set $obs_context = $alltime($data_binding=$combined_obs_binding)
            #set $start_ts=$obs_context.start.raw
            #set $end_ts=$obs_context.end.raw
            #set $context_key = $context
          #else if $context == 'yesterday'
            #set $obs_context = $yesterday($data_binding=$combined_obs_binding)
            #set $start_ts=$obs_context.start.raw
            #set $end_ts=$obs_context.end.raw
            #set $context_key = $context
          #else if $context == 'custom'
            #set $start_ts = $context_start_ts
            #set $end_ts = $context_end_ts
            #set $context_key = $get_context_key_from_time_span($start_ts, $end_ts)
          #else
            #set $obs_context = $span($data_binding=$combined_obs_binding ,$hour_delta=$get_hour_delta($context), $boundary=$get_diagram_boundary($context))
            #set $start_ts=$obs_context.start.raw
            #set $end_ts=$obs_context.end.raw
            #set $context_key = $context
          #end if

          <script>
            /* prettier-ignore */
            var $series_name = $get_diagram_data($observation=$combined_obs, $observation_key=$series_observation_key, $context_key=$context_key, $start_ts=$start_ts, $end_ts=$end_ts, $data_binding=$combined_obs_binding, $alltime_start=$alltime.start.format('%d.%m.%Y'), alltime_end=$alltime.end.format('%d.%m.%Y'), combined=$combined_diagram, combined_key=$comb_obs);
          </script>

          <!--prettier-ignore-->
          #set $combined_index = $combined_index + 1
          #end for

          <div
            class="diagram combined"
            data-labels="$series_labels"
            data-value="$series_names"
            data-color="$series_colors"
            data-unit="$series_units"
            data-observations="$series_observations"
            data-combinedkeys="$series_observation_keys"
            data-diagram="$diagram_types"
            data-context="$context_key"
            data-aggregate-type="$series_aggregate_type"
            data-nivo-props="$diagram_props"
          ></div>
        </div>
      </div>
    </div>
  </div>
</div>
