<!--@todo Remove template.-->
<!--prettier-ignore-->
#encoding UTF-8
#errorCatcher Echo

<script
  type="module"
  src="https://1.www.s81c.com/common/carbon/web-components/version/v1.21.0/structured-list.min.js"
></script>

<!--prettier-ignore-->
#set $label_sum = $get_labels('Sum', $precision)
#set $label_min = $get_labels('Min', $precision)
#set $label_max = $get_labels('Max', $precision)

<div class="bx--tile obs-stat-tile">
  <bx-structured-list>
    <bx-structured-list-head>
      <bx-structured-list-header-row>
        <bx-structured-list-header-cell></bx-structured-list-header-cell>
        <bx-structured-list-header-cell>
          <!--prettier-ignore-->
          #if $precision != 'day' and not $get_show_sum($skin_obs) and not $get_show_max($skin_obs)
            $gettext("Avg")
          #end if
          <!--prettier-ignore-->
          #if $precision != 'day' and $get_show_sum($skin_obs)
            $gettext("Total")
          #end if
          <!--prettier-ignore-->
          #if $precision != 'day' and $get_show_max($skin_obs)
            $gettext("Max")
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
        <bx-structured-list-header-cell
          >$gettext($label_sum)</bx-structured-list-header-cell
        >
      </bx-structured-list-header-row>
    </bx-structured-list-head>
    <!--prettier-ignore-->
    <bx-structured-list-body>
      #for $skin_obs in $DisplayOptions.get('stat_tile_observations')
        ## Show windDir, see https://github.com/Daveiano/weewx-wdc/issues/2
        #set $windData = ($skin_obs == 'windDir' or $skin_obs == 'windSpeed') and $current.windSpeed.has_data
        #set $otherData = ($skin_obs != 'windDir' and $skin_obs != 'windSpeed') and $getattr($current, $skin_obs).has_data

        #if $windData or $otherData
          <bx-structured-list-row>
            <bx-structured-list-cell>$obs.label[$skin_obs]</bx-structured-list-cell>
            <bx-structured-list-cell>
              <!--prettier-ignore-->
              #if $precision == 'day'
                  $getattr($current, $skin_obs)
              #else
                #if $get_show_sum($skin_obs)
                  $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).sum
                #else if $get_show_max($skin_obs)
                  $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).max
                #else
                  $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).avg
                #end if
              #end if
            </bx-structured-list-cell>
            <bx-structured-list-cell>
              <!--prettier-ignore-->
              $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).min

              <!--prettier-ignore-->
              #if $precision == 'year' or $precision == 'alltime'
                am $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).mintime.format("%d.%m.%Y %H:%M")
              #end if
            </bx-structured-list-cell>
            <bx-structured-list-cell>
              <!--prettier-ignore-->
              $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).max

              <!--prettier-ignore-->
              #if $precision == 'year' or $precision == 'alltime'
                  am $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).maxtime.format("%d.%m.%Y %H:%M")
              #end if
            </bx-structured-list-cell>
            <bx-structured-list-cell>
              #if $get_show_sum($skin_obs)
                <!--prettier-ignore-->
                $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).sum
              #end if
            </bx-structured-list-cell>
          </bx-structured-list-row>
        #end if
        #end for
    </bx-structured-list-body>
  </bx-structured-list>
</div>
