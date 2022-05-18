<!--@todo Remove template.-->
<!--prettier-ignore-->
#encoding UTF-8
#errorCatcher Echo

<div class="bx--tile obs-stat-tile">
  <!--prettier-ignore-->
  #for $skin_obs in $DisplayOptions.get('stat_tile_observations')
    ## Show windDir, see https://github.com/Daveiano/weewx-wdc/issues/2
    #set $windData = ($skin_obs == 'windDir' or $skin_obs == 'windSpeed') and $current.windSpeed.has_data
    #set $otherData = ($skin_obs != 'windDir' and $skin_obs != 'windSpeed') and $getattr($current, $skin_obs).has_data
    #if $windData or $otherData
    #set $label_sum = $get_labels('Sum', $precision)
    #set $label_min = $get_labels('Min', $precision)
    #set $label_max = $get_labels('Max', $precision)
  <div class="obs-stat">
    <h3 class="bx--type-expressive-heading-02">$obs.label[$skin_obs]</h3>
    <div class="value">
      <!--prettier-ignore-->
      #if $get_icon($skin_obs) is not None
        #include $get_icon($skin_obs)
      #end if

      <h4 class="bx--type-productive-heading-05">
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

        <!--prettier-ignore-->
        #if $precision != 'day' and not $get_show_sum($skin_obs) and not $get_show_max($skin_obs)
        <span>$gettext("Avg")</span>
        #end if
        <!--prettier-ignore-->
        #if $precision != 'day' and $get_show_sum($skin_obs)
        <span>$gettext("Total")</span>
        #end if
        <!--prettier-ignore-->
        #if $precision != 'day' and $get_show_max($skin_obs)
        <span>$gettext("Max")</span>
        #end if
      </h4>
    </div>
    <div>
      <!--prettier-ignore-->
      #if $get_show_sum($skin_obs)
      <div class="bx--row">
        <div class="bx--col">
          <p class="stat-label">$gettext($label_sum)</p>
          <p class="stat-value">
            <!--prettier-ignore-->
            $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).sum
          </p>
        </div>
      </div>
      #else
      <div class="bx--row">
        #if $get_show_min($skin_obs)
        <div class="bx--col">
          <p class="stat-label">
            <!--prettier-ignore-->
            $gettext($label_min)
            #if $precision == 'year' or $precision == 'alltime'
                $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).mintime.format("%d.%m.%Y %H:%M")
            #end if
          </p>
          <p class="stat-value">
            <!--prettier-ignore-->
            $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).min
          </p>
        </div>
        #end if
        <div class="bx--col">
          <p class="stat-label">
            <!--prettier-ignore-->
            $gettext($label_max)
            #if $precision == 'year' or $precision == 'alltime'
                $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).maxtime.format("%d.%m.%Y %H:%M")
            #end if
          </p>
          <p class="stat-value">
            <!--prettier-ignore-->
            $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).max
          </p>
        </div>
      </div>
      #end if
    </div>
  </div>
  <!--prettier-ignore-->
  #end if
#end for
</div>
