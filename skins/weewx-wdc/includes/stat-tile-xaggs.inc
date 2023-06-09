<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8
#from weewx.units import ValueHelper

#set $xaggs_obs = $stat_xaggs['obs']

#if $layout == 'alternative'
  #set $tile_classes = "bx--col-sm-4 bx--col-md-4 bx--col-lg-6 bx--col-xlg-6 bx--col-max-4"
#else
    #set $tile_classes = "bx--col-sm-4 bx--col-md-4 bx--col-lg-12 bx--col-xlg-12 bx--col-max-12"
#end if

<div class="$tile_classes">
  <div
    class="bx--tile stat-tile"
    data-test="$partial_obs"
    data-observation="$skin_obs_key"
    data-unit="$get_unit_label($get_unit_for_obs($partial_obs, $skin_obs_key, $context))"
    data-rounding="$rounding"
  >
    <!-- Main row -->
    <div class="bx--row">
      <div class="bx--col">
        <!--prettier-ignore-->
        <p class="label" style="padding-bottom: 0.5rem">
            #if $hide_xaggs_heading
              $obs.label[$xaggs_obs]
            #else
              #if $context == 'day'
                $obs.label[$xaggs_obs] - $gettext("Historical values for today")
              #else
                $obs.label[$xaggs_obs] - $gettext("Historical values")
              #end if
            #end if
        </p>

        <div class="value">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 32 32"
            style="
              enable-background: new 0 0 32 32;
              max-width: 80px;
              margin-right: 1rem;
            "
            xml:space="preserve"
          >
            <path
              d="M30,31.36H2c-0.199,0-0.36-0.161-0.36-0.36V4c0-0.199,0.161-0.36,0.36-0.36h5.64V1h0.72v2.64h7.28V1h0.72
           v2.64h7.28V1h0.721v2.64H30c0.199,0,0.36,0.161,0.36,0.36v27C30.36,31.199,30.199,31.36,30,31.36z M2.36,30.64h27.28V4.36h-5.28V7
           h-0.72V4.36h-7.28V7h-0.72V4.36H8.36V7H7.64V4.36H2.36V30.64z M25,27.36h-2c-0.199,0-0.36-0.161-0.36-0.36v-2
           c0-0.199,0.161-0.36,0.36-0.36h2c0.199,0,0.36,0.161,0.36,0.36v2C25.36,27.199,25.199,27.36,25,27.36z M23.36,26.64h1.279v-1.28
           H23.36V26.64z M17,27.36h-2c-0.199,0-0.36-0.161-0.36-0.36v-2c0-0.199,0.161-0.36,0.36-0.36h2c0.199,0,0.36,0.161,0.36,0.36v2
           C17.36,27.199,17.199,27.36,17,27.36z M15.36,26.64h1.28v-1.28h-1.28V26.64z M9,27.36H7c-0.199,0-0.36-0.161-0.36-0.36v-2
           c0-0.199,0.161-0.36,0.36-0.36h2c0.199,0,0.36,0.161,0.36,0.36v2C9.36,27.199,9.199,27.36,9,27.36z M7.36,26.64h1.28v-1.28H7.36
           V26.64z M25,20.36h-2c-0.199,0-0.36-0.161-0.36-0.36v-2c0-0.199,0.161-0.36,0.36-0.36h2c0.199,0,0.36,0.161,0.36,0.36v2
           C25.36,20.199,25.199,20.36,25,20.36z M23.36,19.64h1.279v-1.28H23.36V19.64z M17,20.36h-2c-0.199,0-0.36-0.161-0.36-0.36v-2
           c0-0.199,0.161-0.36,0.36-0.36h2c0.199,0,0.36,0.161,0.36,0.36v2C17.36,20.199,17.199,20.36,17,20.36z M15.36,19.64h1.28v-1.28
           h-1.28V19.64z M9,20.36H7c-0.199,0-0.36-0.161-0.36-0.36v-2c0-0.199,0.161-0.36,0.36-0.36h2c0.199,0,0.36,0.161,0.36,0.36v2
           C9.36,20.199,9.199,20.36,9,20.36z M7.36,19.64h1.28v-1.28H7.36V19.64z M25,13.36h-2c-0.199,0-0.36-0.161-0.36-0.36v-2
           c0-0.199,0.161-0.36,0.36-0.36h2c0.199,0,0.36,0.161,0.36,0.36v2C25.36,13.199,25.199,13.36,25,13.36z M23.36,12.64h1.279v-1.28
           H23.36V12.64z M17,13.36h-2c-0.199,0-0.36-0.161-0.36-0.36v-2c0-0.199,0.161-0.36,0.36-0.36h2c0.199,0,0.36,0.161,0.36,0.36v2
           C17.36,13.199,17.199,13.36,17,13.36z M15.36,12.64h1.28v-1.28h-1.28V12.64z M9,13.36H7c-0.199,0-0.36-0.161-0.36-0.36v-2
           c0-0.199,0.161-0.36,0.36-0.36h2c0.199,0,0.36,0.161,0.36,0.36v2C9.36,13.199,9.199,13.36,9,13.36z M7.36,12.64h1.28v-1.28H7.36
           V12.64z"
            />
            <rect
              id="_Transparent_Rectangle"
              style="fill: none"
              width="32"
              height="32"
            />
          </svg>

          <div>
            <!--prettier-ignore-->
            #for $aggregate_type in $stat_xaggs['aggregate_types']
            <!--prettier-ignore-->
            <p class="bx--type-body-short-02">
                #if $aggregate_type == 'historical_min'
                  $pgettext("xaggs", "Low"):
                #elif $aggregate_type == 'historical_max'
                  $pgettext("xaggs", "High"):
                #elif $aggregate_type == 'historical_avg'
                  $pgettext("xaggs", "Average"):
                #elif $aggregate_type == 'historical_min_avg'
                  $pgettext("xaggs", "Low average"):
                #elif $aggregate_type == 'historical_max_avg'
                  $pgettext("xaggs", "High average"):
                #end if

                #if 'historical' in $aggregate_type
                    <strong>$getattr($getattr($day, $xaggs_obs), $aggregate_type)</strong>
                #elif ('avg_ge' in $aggregate_type or 'avg_gt' in $aggregate_type or 'avg_le' in $aggregate_type or 'avg_lt' in $aggregate_type) and $aggregate_type in $stat_xaggs
                    #set $aggregate_tuple_list = $to_list($stat_xaggs[$aggregate_type])
                    #silent $aggregate_tuple_list[0] = $float($aggregate_tuple_list[0])
                    #set $aggregate_tuple = $tuple($aggregate_tuple_list)

                    #if 'avg_ge' in $aggregate_type
                      $gettext("Days with average greater than or equal to") $getValueHelper($aggregate_tuple).format():
                      <strong>$getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), $xaggs_obs).avg_ge($aggregate_tuple)</strong>
                    #elif 'avg_gt' in $aggregate_type
                      $gettext("Days with average greater than") $getValueHelper($aggregate_tuple).format():
                      <strong>$getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), $xaggs_obs).avg_gt($aggregate_tuple)</strong>
                    #elif 'avg_le' in $aggregate_type
                      $gettext("Days with average less than or equal to") $getValueHelper($aggregate_tuple).format():
                      <strong>$getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), $xaggs_obs).avg_le($aggregate_tuple)</strong>
                    #elif 'avg_lt' in $aggregate_type
                      $gettext("Days with average less than") $getValueHelper($aggregate_tuple).format():
                      <strong>$getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), $xaggs_obs).avg_lt($aggregate_tuple)</strong>
                    #end if
                #end if

                #if $aggregate_type == 'historical_min' or $aggregate_type == 'historical_max'
                  $gettext("in")
                  $getattr($getattr($day, $xaggs_obs), $aggregate_type + 'time').format("%Y") - $getattr($getattr($day, $xaggs_obs), $aggregate_type + 'time').format("%H:%M")
                #end if
            </p>

            #end for
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
