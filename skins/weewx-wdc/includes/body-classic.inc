<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8
#set $diagrams_config = $DisplayOptions.get("diagrams", {})
#set global $layout = 'classic'

#if 'stat_tiles_xaggs' in $DisplayOptions
  #set $stat_tiles_xaggs = $DisplayOptions.stat_tiles_xaggs
  #set $stat_tiles_xaggs_classic = []

  #for $xaggs in $stat_tiles_xaggs
    #if $context != "day" and ('avg_context' not in $stat_tiles_xaggs[$xaggs] or $context not in $stat_tiles_xaggs[$xaggs]['avg_context'])
      #continue
    #end if

    #set $xaggs_to_append = {'obs': $xaggs, **$stat_tiles_xaggs[$xaggs]}

    #if $context == "day"
      #silent $xaggs_to_append['aggregate_types'] = $list(filter(lambda aggregate_type: 'historical' in aggregate_type, $xaggs_to_append['aggregate_types']))
    #else
      #silent $xaggs_to_append['aggregate_types'] = $list(filter(lambda aggregate_type: 'historical' not in aggregate_type, $xaggs_to_append['aggregate_types']))
    #end if

    #silent $stat_tiles_xaggs_classic.append($xaggs_to_append)
  #end for
#end if

<!--prettier-ignore-->
<div class="bx--row">
  <div class="bx--col-sm-4 bx--col-md-8 bx--col-lg-6 bx--col-xlg-4 bx--col-max-4 layout-col">
    #include 'includes/conditions-table.inc'

    <!--prettier-ignore-->
    #if $context == "day" and $daily_archive == False
    #include "includes/forecast.inc"
    #end if

    <!--prettier-ignore-->
    #if $stat_tiles_xaggs_classic
    #set global $hide_xaggs_heading = True
    <!--prettier-ignore-->
    <header class="bx--col section-header" style="margin-top: 2rem;">
      #if $context == 'day'
      <h2>$gettext("Historical values for today")</h2>
      #else
      <h2>$gettext("Historical values")</h2>
      #end if
    </header>
    <!--prettier-ignore-->
    <div class="bx--row">
      #for $stat_xaggs in $stat_tiles_xaggs_classic
        #set global $stat_xaggs = $stat_xaggs
        #include "includes/stat-tile-xaggs.inc"
      #end for
    </div>
    #end if
  </div>


  <div class="bx--col-sm-4 bx--col-md-8 bx--col-lg-6 bx--col-xlg-8 bx--col-max-8 layout-col">
    <div class="bx--row">
    <!-- prettier-ignore -->
    #set $diagram_index = 0
    #set $context_for_diagrams = $context if $context != 'yesterday' else 'day'
    #set $diagram_context_config = $DisplayOptions.get("diagrams", {}).get($context_for_diagrams, {}).get('observations', {})
    #if "combined_observations" in $diagrams_config
      #set $combined = $diagrams_config.combined_observations
    #else
      #set $combined = {}
    #end if

    #for $skin_obs in $diagram_context_config
      #if $skin_obs in $combined.keys()
        #set $combined_diagram = $combined[$skin_obs]
        #for $combined_obs in $combined_diagram.obs.keys()
        #set $skin_obs_binding = $get_data_binding_combined_diagram($combined_obs, $combined_diagram, $skin_obs, $context)

        ## I dont know why but $alltime($data_binding=$skin_obs_binding) crashes on the month-%Y-%m and year-%Y pages:
        ## ValueError: start time (1654034700) is greater than stop time (1640991600)
        #set $alltime_tag = None if $use_parameter_year or $use_parameter_month else $alltime($data_binding=$skin_obs_binding)

        #if $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime_tag, $yesterday($data_binding=$skin_obs_binding)), $get_custom_data_binding_obs_key($combined_diagram.obs[$combined_obs].observation)).has_data
          #set global $comb_obs = $skin_obs
          #set global $combined_diagram = $combined_diagram
          #set global $diagram_index = $diagram_index
          #include "includes/combined-diagram-tile.inc"
          #set $diagram_index = $diagram_index + 1
          #break
          #end if
        #end for
      #else
        #set $skin_obs_binding = $get_data_binding($skin_obs, $context)
        #set $alltime_tag = None if $use_parameter_year or $use_parameter_month else $alltime($data_binding=$skin_obs_binding)
        #if $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime_tag, $yesterday($data_binding=$skin_obs_binding)), $get_custom_data_binding_obs_key($skin_obs)).has_data or (($skin_obs == 'windDir' or $skin_obs == 'windRose') and $getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), 'windSpeed').has_data)
          #set global $partial_obs = $skin_obs
          #set global $diagram_index = $diagram_index
          #if $skin_obs == 'windRose'
            #include "includes/diagram-tile-wind-rose.inc"
          #else
            #include "includes/diagram-tile.inc"
          #end if
          #set $diagram_index = $diagram_index + 1
        #end if
      #end if
    #end for
    </div>
  </div>
</div>

#if 'table_tile_observations' in $DisplayOptions
<div class="bx--row">
  <!-- prettier-ignore -->
  #set global $table_obs = None
  #include "includes/data-table-tile.inc"
</div>
#end if
