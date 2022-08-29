<!--prettier-ignore-->
#encoding UTF-8
#errorCatcher Echo
#set $table_tile_observations = $DisplayOptions.get("table_tile_observations")

<div class="bx--col">
  <div class="bx--tile data-table-tile">
    <div class="bx--row">
      <div class="bx--col">
        <script>
          /*prettier-ignore*/
          #if $precision == 'alltime'
          var tableRows = $get_table_rows($table_tile_observations, $alltime, $precision);
          var tableHeaders = $jsonize($get_table_headers($table_tile_observations, $alltime));
          #else if $precision == 'yesterday'
          var tableRows = $get_table_rows($table_tile_observations, $yesterday, $precision);
          var tableHeaders = $jsonize($get_table_headers($table_tile_observations, $yesterday));
          #else
          var tableRows = $get_table_rows($table_tile_observations, $span($hour_delta=$get_hour_delta($precision), $week_delta=$get_week_delta($precision), $boundary=$get_table_boundary($precision)), $precision);
          var tableHeaders = $jsonize($get_table_headers($table_tile_observations, $span($hour_delta=$get_hour_delta($precision), $week_delta=$get_week_delta($precision), $boundary=$get_table_boundary($precision))));
          #end if

          var tableTitle = '$gettext("All data")';
          var precision = "$precision";
        </script>
        <div class="table"></div>
      </div>
    </div>
  </div>
</div>
