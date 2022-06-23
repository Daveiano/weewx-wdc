<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8

<!--prettier-ignore-->
<div class="bx--row">
  <div class="bx--col-sm-4 bx--col-md-8 bx--col-lg-6 bx--col-xlg-4 bx--col-max-4 layout-col">
    #include 'includes/conditions-table.inc'

    <!--prettier-ignore-->
    #include "includes/forecast.inc"
  </div>


  <div class="bx--col-sm-4 bx--col-md-8 bx--col-lg-6 bx--col-xlg-8 bx--col-max-8 layout-col">
    <div class="bx--row">
    <!-- prettier-ignore -->
    #set $diagram_index = 0
    #set $combined = $DisplayOptions.get('diagram_tile_combined_obervations')
    #for $skin_obs in $DisplayOptions.get('diagram_tile_observations')
        #if $skin_obs in $combined.keys()
        #set $combined_diagram = $combined[$skin_obs]
        #for $combined_obs in $combined_diagram.obs.keys()
            #if $getattr($current, $combined_obs).has_data
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
  </div>
</div>

#if 'table_tile_observations' in $DisplayOptions
<div class="bx--row">
  <!-- prettier-ignore -->
  #include "includes/data-table-tile.inc"
</div>
#end if
