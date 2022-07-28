<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8

<script
  type="module"
  src="https://1.www.s81c.com/common/carbon/web-components/version/v1.21.0/structured-list.min.js"
></script>

<!--prettier-ignore-->
#set $label_sum = $get_labels('Sum', $precision)
#set $label_min = $get_labels('Min', $precision)
#set $label_max = $get_labels('Max', $precision)
#set $label_avg = $get_labels('Avg', $precision)
#set $label_totals = $get_labels('Total', $precision)

<div class="bx--tile obs-stat-tile">
  <div class="bx--row">
    <div class="bx--col">
      <!-- <h3>$gettext("Todays Min/Max")</h3> -->
      <bx-structured-list>
        <bx-structured-list-head>
          <bx-structured-list-header-row>
            <bx-structured-list-header-cell></bx-structured-list-header-cell>
            <bx-structured-list-header-cell>
              <!--prettier-ignore-->
              #if $precision != 'day'
                $gettext($label_avg)
              #end if
              <!--prettier-ignore-->
              #if $precision == 'day'
                $gettext("Current")
              #end if
            </bx-structured-list-header-cell>
            <bx-structured-list-header-cell
              >$gettext($label_min)</bx-structured-list-header-cell
            >
            <bx-structured-list-header-cell
              >$gettext($label_max)</bx-structured-list-header-cell
            >
          </bx-structured-list-header-row>
        </bx-structured-list-head>
        <!--prettier-ignore-->
        <bx-structured-list-body>
      #for $skin_obs in $DisplayOptions.get('stat_tile_observations')
        ## Show windDir, see https://github.com/Daveiano/weewx-wdc/issues/2
        #set $windData = ($skin_obs == 'windDir' or $skin_obs == 'windSpeed') and $current.windSpeed.has_data
        #set $otherData = ($skin_obs != 'windDir' and $skin_obs != 'windSpeed') and $getattr($current, $skin_obs).has_data

        #if $windData or $otherData and not $get_show_sum($skin_obs)
          <div class="mobile-header">
            <div class="label">$obs.label[$skin_obs]</div>
          </div>
          <bx-structured-list-row>
            <bx-structured-list-cell>$obs.label[$skin_obs]</bx-structured-list-cell>
            <bx-structured-list-cell>
              <!--prettier-ignore-->
              #if $precision == 'day'
                #if $skin_obs == "windDir" and $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
                  $getattr($current, $skin_obs).ordinal_compass, $getattr($current, $skin_obs)
                #else
                  $getattr($current, $skin_obs)
                #end if

              #else
                #if $get_show_sum($skin_obs)
                  $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).sum
                #else if $get_show_max($skin_obs)
                  $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).max
                #else
                  #if $skin_obs == "windDir" and $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
                    $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).avg.ordinal_compass, $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).avg
                  #else
                    $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).avg
                  #end if
                #end if
              #end if
            </bx-structured-list-cell>
            <bx-structured-list-cell>
              <!--prettier-ignore-->
              #if $skin_obs == "windDir" and $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
                $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).min.ordinal_compass, $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).min
              #else
                $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).min
              #end if


              <!--prettier-ignore-->
              #if $precision == 'year' or $precision == 'alltime'
                <span class="date">am $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).mintime.format($get_time_format_dict['stats'])</span>
              #end if
            </bx-structured-list-cell>
            <bx-structured-list-cell>
              <!--prettier-ignore-->
              #if $skin_obs == "windDir" and $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
                $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).max.ordinal_compass, $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).max
              #else
                $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).max
              #end if

              <!--prettier-ignore-->
              #if $precision == 'year' or $precision == 'alltime'
              <span class="date">am $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).maxtime.format($get_time_format_dict['stats'])</span>
              #end if
            </bx-structured-list-cell>
          </bx-structured-list-row>
        #end if
        #end for
    </bx-structured-list-body>
      </bx-structured-list>
    </div>
  </div>

  <div class="bx--row">
    <div class="bx--col">
      <h3>$gettext($label_totals)</h3>
      <bx-structured-list>
        <bx-structured-list-head>
          <bx-structured-list-header-row>
            <bx-structured-list-header-cell></bx-structured-list-header-cell>
            <bx-structured-list-header-cell></bx-structured-list-header-cell>
          </bx-structured-list-header-row>
        </bx-structured-list-head>
        <!--prettier-ignore-->
        <bx-structured-list-body>
          #for $skin_obs in $DisplayOptions.get('stat_tile_observations')
            ## Show windDir, see https://github.com/Daveiano/weewx-wdc/issues/2
            #set $windData = ($skin_obs == 'windDir' or $skin_obs == 'windSpeed') and $current.windSpeed.has_data
            #set $otherData = ($skin_obs != 'windDir' and $skin_obs != 'windSpeed') and $getattr($current, $skin_obs).has_data

            #if ($windData or $otherData) and $get_show_sum($skin_obs)
              <bx-structured-list-row>
                <bx-structured-list-cell class="keep-cell">$obs.label[$skin_obs]</bx-structured-list-cell>
                <bx-structured-list-cell>
                  <!--prettier-ignore-->
                  $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).sum
                </bx-structured-list-cell>
              </bx-structured-list-row>
            #end if
            #end for
        </bx-structured-list-body>
      </bx-structured-list>
    </div>
  </div>
</div>
