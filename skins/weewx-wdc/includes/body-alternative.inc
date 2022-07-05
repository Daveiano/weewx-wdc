<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8
#from datetime import datetime, timedelta
#set $diagrams_config = $DisplayOptions.get("diagrams", {})

<div class="bx--row">
  <!--prettier-ignore-->
  #for $skin_obs in $DisplayOptions.get('stat_tile_observations')
    ## Show windDir, see https://github.com/Daveiano/weewx-wdc/issues/2
    #if $skin_obs == 'windDir' or $skin_obs == 'windSpeed'
      #if $getattr($current, 'windSpeed').has_data
        #set global $partial_obs = $skin_obs
        #include "includes/stat-tile.inc"
      #end if
    #else
      #if $getattr($current, $skin_obs).has_data
        #set global $partial_obs = $skin_obs
        #include "includes/stat-tile.inc"
      #end if
    #end if
  #end for
</div>

<!--prettier-ignore-->
#if $precision == "day"
#include "includes/forecast.inc"
#end if

<div class="bx--row">
  <header class="bx--col section-header">
    <!--prettier-ignore-->
    #if $precision == 'day'
    <h2>$gettext("Last 24 hours")</h2>
    #else if $precision == 'week'
    <h2>$gettext("Last 7 days")</h2>
    <!--prettier-ignore-->
    #set $start_date_header = datetime.fromtimestamp($current.dateTime.raw) - timedelta(days=7)
    <h3>
      <!--prettier-ignore-->
      $start_date_header.strftime("%d. %b %Y") - $current.dateTime.format("%d. %b %Y")
    </h3>
    #else if $precision == 'month' and not $use_parameter_month
    <h2>$gettext("Last 30 days")</h2>
    <!--prettier-ignore-->
    #set $start_date_header = datetime.fromtimestamp($current.dateTime.raw) - timedelta(days=30)
    <h3>
      <!--prettier-ignore-->
      $start_date_header.strftime("%d. %b %Y") - $current.dateTime.format("%d. %b %Y")
    </h3>
    #else if $precision == 'month' and $use_parameter_month
    <h2>$month_name $year_name</h2>
    #else if $precision == 'year' and not $use_parameter_year
    <h2>$gettext("Last 365 days")</h2>
    <!--prettier-ignore-->
    #set $start_date_header = datetime.fromtimestamp($current.dateTime.raw) - timedelta(days=365)
    <h3>
      <!--prettier-ignore-->
      $start_date_header.strftime("%d. %b %Y") - $current.dateTime.format("%d. %b %Y")
    </h3>
    #else if $precision == 'year' and $use_parameter_year
    <h2>$year_name</h2>
    #else if $precision == 'alltime'
    <h2>$gettext("All Time")</h2>
    #end if
  </header>
</div>

<!-- prettier-ignore -->
<div class="bx--row">
#set $diagram_index = 0
#if "combined_observations" in $diagrams_config
  #set $combined = $diagrams_config.combined_observations
#else
  #set $combined = {}
#end if

#for $skin_obs in $DisplayOptions.get('diagram_tile_observations')
  #if $skin_obs in $combined.keys()
    #set $combined_diagram = $combined[$skin_obs]
    #for $combined_obs in $combined_diagram.obs.keys()
        #if $getattr($current, $combined_diagram.obs[$combined_obs].observation).has_data
          #set global $combined_diagram = $combined_diagram
          #set global $diagram_index = $diagram_index
          #include "includes/combined-diagram-tile.inc"
          #set $diagram_index = $diagram_index + 1
          #break
        #end if
    #end for
  #else
    #if $getattr($current, $skin_obs).has_data or ($skin_obs == 'windDir' and $current.windSpeed.has_data)
        #set global $partial_obs = $skin_obs
        #set global $diagram_index = $diagram_index
        #include "includes/diagram-tile.inc"
        #set $diagram_index = $diagram_index + 1
    #end if
  #end if
#end for
</div>

#if 'table_tile_observations' in $DisplayOptions
<div class="bx--row">
  <!-- prettier-ignore -->
  #include "includes/data-table-tile.inc"
</div>
#end if
