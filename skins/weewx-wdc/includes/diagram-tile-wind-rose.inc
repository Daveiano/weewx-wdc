<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8
#set diagram_classes = "bx--col-sm-4 bx--col-md-8 bx--col-lg-12 bx--col-xlg-6 bx--col-max-4"
#if $DisplayOptions.get('layout', 'alternative') == 'classic'
  #set diagram_classes = "bx--col-sm-4 bx--col-md-8 bx--col-lg-12 bx--col-xlg-6 bx--col-max-6"
#end if

<div class="$diagram_classes">
  <div class="bx--tile diagram-tile" data-test="windrose">
    <div class="bx--row">
      <div class="bx--col">
        <p class="label">
          <!--prettier-ignore-->
          #if $get_icon("windDir") is not None
            #include $get_icon("windDir")
          #end if
          $obs.label["windDir"]
        </p>
        <div class="value">
          <!--prettier-ignore-->
          #set $series_name = $partial_obs + 'Series' + str($diagram_index)

          <!--prettier-ignore-->
          #if $context == 'month' and $use_parameter_month
          <script>
            /* prettier-ignore */
            var $series_name = $get_windrose_data($month.start.raw, $month.end.raw, $context)
          </script>
          <!--prettier-ignore-->
          #else if $context == 'year' and $use_parameter_year
          <script>
            /* prettier-ignore */
            var $series_name = $get_windrose_data($year.start.raw, $year.end.raw, $context)
          </script>
          #else
          <script>
            /* prettier-ignore */
            #set $time_span = $get_time_span_from_attr($context, $day, $week, $month, $year, $alltime, $yesterday)
            var $series_name = $get_windrose_data($time_span.start.raw, $time_span.end.raw, $context)
          </script>
          #end if

          <div
            class="diagram plotly windrose"
            data-labels="['$obs.label[$partial_obs]']"
            data-color="['$get_color($partial_obs)']"
            data-value="$series_name"
            data-unit="$getattr($unit.label, $partial_obs)"
            data-obs="$get_diagram_type($partial_obs)"
            data-diagram="$get_diagram($partial_obs)"
            data-context="$context"
            data-aggregate-type="['$get_aggregate_type($partial_obs)']"
            data-nivo-props="$get_nivo_props($partial_obs)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</div>
