#errorCatcher Echo
#encoding UTF-8
#from datetime import datetime, timedelta

#set $diagrams_config = $DisplayOptions.get("diagrams", {})
#set global $layout = 'alternative'
#set $gauges_display = $DisplayOptions.get('gauges_display', 'before')
#set $show_gauges = 'Gauges' in $DisplayOptions and $context in $DisplayOptions['Gauges']

#def render_gauges($gauge_config)
  #set $gauges_index = 0
  #for $gauge_obs in $gauge_config
    #set $gauge_obs_data_binding = $get_data_binding($gauge_obs)

    ## I dont know why but $alltime($data_binding=$skin_obs_binding) crashes on the month-%Y-%m and year-%Y pages:
    ## ValueError: start time (1654034700) is greater than stop time (1640991600)
    #set $alltime_tag = None if $use_parameter_year or $use_parameter_month else $alltime($data_binding=$gauge_obs_data_binding)
    #set global $gauge_obs_binding = $getattr($get_time_span_from_context($context, $day($data_binding=$gauge_obs_data_binding), $week($data_binding=$gauge_obs_data_binding), $month($data_binding=$gauge_obs_data_binding), $year($data_binding=$gauge_obs_data_binding), $alltime_tag, $yesterday($data_binding=$gauge_obs_data_binding)), $get_custom_data_binding_obs_key($gauge_obs))

    #if $gauge_obs_binding.has_data
      #set global $gauges_index = $gauges_index
      #set global $partial_obs = $gauge_obs
      #include "includes/gauge-tile.inc"
      #set $gauges_index = $gauges_index + 1
    #end if
  #end for
#end def

#set $stat_tiles_xaggs_same_row = []
#set $stat_tiles_xaggs_extra_row = []
#if 'stat_tiles_xaggs' in $DisplayOptions
  #set $stat_tiles_xaggs = $DisplayOptions.stat_tiles_xaggs

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

    #if $to_bool($stat_tiles_xaggs[$xaggs]['show_extra_row']) is True
      #silent $stat_tiles_xaggs_extra_row.append($xaggs_to_append)
    #else
      #silent $stat_tiles_xaggs_same_row.append($xaggs_to_append)
    #end if
  #end for
#end if

#if os.path.exists("custom-content-top.inc") and $context == 'day' and not $daily_archive
  <div class="custom-content top">
      #include "custom-content-top.inc"
  </div>
#end if

#if $show_gauges and $gauges_display == 'before'
  <div class="bx--row">
    $render_gauges($DisplayOptions['Gauges'][$context])
  </div>
#end if

<div class="bx--row">
  #for $skin_obs in $DisplayOptions.get('stat_tile_observations')
    #if $skin_obs != 'windDir' and $skin_obs != 'windGustDir' and $skin_obs != 'rainRate'
      #set $skin_obs_binding = $get_data_binding($skin_obs)

      #set $show_sum = $get_show_sum($skin_obs)
      #set $show_min = $get_show_min($skin_obs)
      #set $show_max = $get_show_max($skin_obs)
      #set $use_day = $show_sum or $show_min or $show_max

      ## I dont know why but $alltime($data_binding=$skin_obs_binding) crashes on the month-%Y-%m and year-%Y pages:
      ## ValueError: start time (1654034700) is greater than stop time (1640991600)
      #set $alltime_tag = $alltime($data_binding=$skin_obs_binding) if $context == 'alltime' else None

      #if $context == 'day' and not $daily_archive and $use_day
        #set $stat_tile_check = $day($data_binding=$skin_obs_binding)
      #elif $context == 'day' and not $daily_archive and not $use_day
        #set $stat_tile_check = $current($data_binding=$skin_obs_binding)
      #else
        #set $stat_tile_check = $get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime_tag, $yesterday($data_binding=$skin_obs_binding))
      #end if

      #if $getattr($stat_tile_check, $get_custom_data_binding_obs_key($skin_obs)).has_data
        #set global $partial_obs = $skin_obs
        #include "includes/stat-tile.inc"
      #end if
    #end if
  #end for

  #if $stat_tiles_xaggs_same_row
    #set global $hide_xaggs_heading = False
    #for $stat_xaggs in $stat_tiles_xaggs_same_row
      #set global $stat_xaggs = $stat_xaggs
      #include "includes/stat-tile-xaggs.inc"
    #end for
  #end if
</div>

#if $show_gauges and $gauges_display == 'after'
  <div class="bx--row">
    $render_gauges($DisplayOptions['Gauges'][$context])
  </div>
#end if

#if $stat_tiles_xaggs_extra_row
#set global $hide_xaggs_heading = True
<header class="bx--col section-header">
  #if $context == 'day'
  <h2>$gettext("Historical values for today")</h2>
  #else
  <h2>$gettext("Historical values")</h2>
  #end if
</header>
<div class="bx--row">
  #for $stat_xaggs in $stat_tiles_xaggs_extra_row
    #set global $stat_xaggs = $stat_xaggs
    #include "includes/stat-tile-xaggs.inc"
  #end for
</div>
#end if

#if os.path.exists("custom-content-after-stat.inc") and $context == 'day' and not $daily_archive
  <div class="custom-content after-stat">
      #include "custom-content-after-stat.inc"
  </div>
#end if

#if $context == "day" and $daily_archive == False
#include "includes/forecast.inc"
#end if

<div class="bx--row">
  #include "includes/section-heading.inc"
</div>

<div class="bx--row">
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
      #set $alltime_tag = $alltime($data_binding=$skin_obs_binding) if $context == 'alltime' else None

      #if $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime_tag, $yesterday($data_binding=$skin_obs_binding)), $get_custom_data_binding_obs_key($combined_diagram.obs[$combined_obs].observation)).has_data or $combined_diagram.obs[$combined_obs].observation in $get_software_obs
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
    #set $alltime_tag = $alltime($data_binding=$skin_obs_binding) if $context == 'alltime' else None
    #if $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime_tag, $yesterday($data_binding=$skin_obs_binding)), $get_custom_data_binding_obs_key($skin_obs)).has_data or (($skin_obs == 'windDir' or $skin_obs == 'windRose') and $getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), 'windSpeed').has_data or $skin_obs in $get_software_obs)
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

#if os.path.exists("custom-content-bottom.inc") and $context == 'day' and not $daily_archive
  <div class="custom-content bottom">
      #include "custom-content-bottom.inc"
  </div>
#end if

#if 'table_tile_observations' in $DisplayOptions
<div class="bx--row">
  #set global $table_obs = None
  #include "includes/data-table-tile.inc"
</div>
#end if
