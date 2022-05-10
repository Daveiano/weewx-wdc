<!--prettier-ignore-->
#encoding UTF-8
#set $label_sum = 'Sum ' + $precision
#set $label_min = 'Min ' + $precision
#set $label_max = 'Max ' + $precision
<div class="bx--col-sm-4 bx--col-md-4 bx--col-lg-4 bx--col-xlg-4 bx--col-max-3">
  <div class="bx--tile stat-tile">
    <div class="bx--row">
      <div class="bx--col">
        <p class="label">$obs.label[$partial_obs]</p>
        <p class="value">
          <!--prettier-ignore-->
          #if $get_icon($partial_obs) is not None
          #include $get_icon($partial_obs)
          #end if

          <span>
            <!--prettier-ignore-->
            #if $precision == 'day'
              $getattr($current, $partial_obs)
            #else
              #if $get_show_only_sum($partial_obs)
                $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year), $partial_obs).sum
              #else
                $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year), $partial_obs).avg
              #end if
            #end if
            <!--prettier-ignore-->
            #if $precision != 'day' and not $get_show_only_sum($partial_obs)
            <span>$gettext("Avg")</span>
            #end if
            <!--prettier-ignore-->
            #if $precision != 'day' and $get_show_only_sum($partial_obs)
            <span>$gettext("Total")</span>
            #end if
          </span>
        </p>
      </div>
    </div>
    <!--prettier-ignore-->
    #if $get_show_only_sum($partial_obs)
    <div class="bx--row">
      <div class="bx--col">
        <p class="stat-label">$gettext($label_sum)</p>
        <p class="stat-value">
          <!--prettier-ignore-->
          $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year), $partial_obs).sum
        </p>
      </div>
    </div>
    #else
    <div class="bx--row">
      #if $get_show_min_stat($partial_obs)
      <div class="bx--col">
        <p class="stat-label">$gettext($label_min)</p>
        <p class="stat-value">
          <!--prettier-ignore-->
          $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year), $partial_obs).min
        </p>
      </div>
      #end if
      <div class="bx--col">
        <p class="stat-label">$gettext($label_max)</p>
        <p class="stat-value">
          <!--prettier-ignore-->
          $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year), $partial_obs).max
        </p>
      </div>
    </div>
    #end if
  </div>
</div>
