<!--prettier-ignore-->
#encoding UTF-8
#errorCatcher Echo

<div class="bx--col">
  <div class="bx--tile data-table-tile">
    <div class="bx--row">
      <div class="bx--col">
        <script>
          /*prettier-ignore*/
          #if $context == 'alltime'
          var tableRows = $get_table_rows($alltime.start.raw, $alltime.end.raw, $context, $table_obs);
          var tableHeaders = $jsonize($get_table_headers($alltime.start.raw, $alltime.end.raw, $table_obs));
          #else if $context == 'yesterday'
          var tableRows = $get_table_rows($yesterday.start.raw, $yesterday.end.raw, $context, $table_obs);
          var tableHeaders = $jsonize($get_table_headers($yesterday.start.raw, $yesterday.end.raw, $table_obs));
          #else
          #set $time_span = $span($hour_delta=$get_hour_delta($context), $boundary=$get_table_boundary($context))
          var tableRows = $get_table_rows($time_span.start.raw, $time_span.end.raw, $context, $table_obs);
          var tableHeaders = $jsonize($get_table_headers($time_span.start.raw, $time_span.end.raw, $table_obs));
          #end if

          var tableTitle = '$gettext("All data")';
          var context = "$context";
        </script>
        <div class="table"></div>
      </div>
    </div>
  </div>
</div>
