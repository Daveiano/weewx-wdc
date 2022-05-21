<!--prettier-ignore-->
#encoding UTF-8
#set $label_sum = $get_labels('Sum', $precision)
#set $label_min = $get_labels('Min', $precision)
#set $label_max = $get_labels('Max', $precision)
#set $label_avg = $get_labels('Avg', $precision)

<script
  type="module"
  src="https://1.www.s81c.com/common/carbon/web-components/version/v1.21.0/tooltip.min.js"
></script>

<div class="bx--col-sm-4 bx--col-md-4 bx--col-lg-6 bx--col-xlg-3 bx--col-max-2">
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
              #if $get_show_sum($partial_obs)
                $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $partial_obs).sum
              #else if $get_show_max($partial_obs)
                $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $partial_obs).max
              #else
                $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $partial_obs).avg
              #end if
            #end if
            <!--prettier-ignore-->
            #if $precision != 'day' and not $get_show_sum($partial_obs) and not $get_show_max($partial_obs)
            <span>$gettext("Avg")</span>
            #end if
            <!--prettier-ignore-->
            #if $precision != 'day' and $get_show_sum($partial_obs)
            <span>$gettext("Total")</span>
            #end if
            <!--prettier-ignore-->
            #if $precision != 'day' and $get_show_max($partial_obs)
            <span>$gettext("Max")</span>
            #end if
          </span>
        </p>
      </div>
    </div>
    <!--prettier-ignore-->
    #if $precision == 'day' and $get_show_sum($partial_obs)
    <div class="bx--row">
      <div class="bx--col">
        <p class="stat-label">$gettext($label_sum)</p>
        <p class="stat-value">
          <!--prettier-ignore-->
          $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $partial_obs).sum
        </p>
      </div>
    </div>
    <!--prettier-ignore-->
    #else if $precision != 'day' and $get_show_sum($partial_obs)
      #if $partial_obs == 'rain'
    <div class="bx--row">
      <div class="bx--col">
        <p class="stat-label">$gettext("Rain days")</p>
        <p class="stat-value">
          <!--prettier-ignore-->
          $get_climatological_day('rainDays', $get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $unit.unit_type, $unit.label)
        </p>
      </div>
    </div>
    #else
    <div class="bx--row">
      <div class="bx--col">
        <p class="stat-label">$gettext($label_avg)</p>
        <p class="stat-value">
          <!--prettier-ignore-->
          $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $partial_obs).avg
        </p>
      </div>
    </div>
    <!--prettier-ignore-->
    #end if
    #else
    <div class="bx--row">
      #if $get_show_min($partial_obs)
      <div class="bx--col">
        <p class="stat-label">
          <!--prettier-ignore-->
          #if $precision == 'year' or $precision == 'alltime'
          <bx-tooltip-definition
            alignment="center"
            body-text="$getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $partial_obs).mintime.format('%d.%m.%Y %H:%M')"
            direction="top"
          >
            $gettext($label_min)
          </bx-tooltip-definition>
          <!--prettier-ignore-->
          #else
            $gettext($label_min)
          #end if
        </p>
        <p class="stat-value">
          <!--prettier-ignore-->
          $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $partial_obs).min
        </p>
      </div>
      #end if
      <div class="bx--col">
        <p class="stat-label">
          <!--prettier-ignore-->
          #if $precision == 'year' or $precision == 'alltime'
          <bx-tooltip-definition
            alignment="center"
            body-text="$getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $partial_obs).maxtime.format('%d.%m.%Y %H:%M')"
            direction="top"
          >
            $gettext($label_max)
          </bx-tooltip-definition>
          <!--prettier-ignore-->
          #else
            $gettext($label_max)
          #end if
        </p>
        <p class="stat-value">
          <!--prettier-ignore-->
          $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $partial_obs).max
        </p>
      </div>
    </div>
    #end if
  </div>
</div>
