#errorCatcher Echo
#encoding UTF-8

#import calendar
#import datetime
#from weeutil.weeutil import startOfDay, startOfArchiveDay

<script
  type="module"
  src="https://1.www.s81c.com/common/carbon/web-components/version/v1.21.0/structured-list.min.js"
></script>

#if $context == 'alltime'
  #set $archive_months = $SummaryByMonth
  #if len($SummaryByYear) == 0
    #set $SummaryByYear = $fake_get_report_years($alltime.start.format("%Y"), $latest.dateTime.format("%Y"))
  #end if
#elif $context == 'year'
  #set $SummaryByYear = [str($year_name)]
  #set $archive_months = $filter_months($SummaryByMonth, $year_name)
#end if

#for $agg in $stat_table_aggregate_types
  <h3 class="bx--type-productive-heading-02">
    $gettext($agg.capitalize()) $obs.label[$stat_table_obs]
  </h3>

  #set $per_month = {}
  #set $per_year = {}
  #set $per_all = []

  <bx-structured-list class="year-obs-stat-table">
    <bx-structured-list-head>
      <bx-structured-list-header-row>
        #if $context == "alltime"
          <bx-structured-list-header-cell>
              $gettext('Year')
          </bx-structured-list-header-cell>
        #end if

        #for $month in range(1, 13)
          <bx-structured-list-header-cell>
              $gettext(calendar.month_abbr[$month])
          </bx-structured-list-header-cell>
        #end for

        <bx-structured-list-header-cell>
          $gettext($agg.capitalize())
        </bx-structured-list-header-cell>
      </bx-structured-list-header-row>
    </bx-structured-list-head>
    <bx-structured-list-body>
      #for $year in $SummaryByYear
        #if not $year in $per_year
          #set $per_year[$year] = []
        #end if
        <bx-structured-list-row>
          #if $context == "alltime"
            <bx-structured-list-cell>$year</bx-structured-list-cell>
          #end if

          #set $months_for_year = $filter_months($archive_months, $year)

          #for $month in range(1, 13)
            #if not $month in $per_month
              #set $per_month[$month] = []
            #end if

            #set $month_from_range = $year + '-' + str($month).zfill(2)
            #set $time_span_start_ts = $startOfDay($datetime.datetime.strptime($month_from_range, "%Y-%m").replace(day=1).timestamp())
            #set $time_span_end_ts = $datetime.datetime.strptime($month_from_range, "%Y-%m").replace(day=$calendar.monthrange(int($year), int($month))[1], hour=23, minute=59).timestamp()

            #if $month_from_range in $months_for_year
              #set $agg_for_value = $agg

              #if $stat_table_obs in $DisplayOptions.get('stat_tiles_show_sum', ['rain', 'ET', 'hail', 'snow', 'lightning_strike_count', 'windrun'])
                #set $agg_for_value = 'sum'
              #end if

              #set $stat_month = $get_stat_table_month_obs($time_span_start_ts, $time_span_end_ts)
              #set $raw_value = $getattr($getattr($stat_month, $stat_table_obs), $agg_for_value).raw

              #silent $per_month[$month].append($raw_value)
              #silent $per_year[$year].append($raw_value)
              #silent $per_all.append($raw_value)

              <bx-structured-list-cell data-testid="$month_from_range">
                $getattr($getattr($stat_month, $stat_table_obs), $agg_for_value)
              </bx-structured-list-cell>
            #else
              <bx-structured-list-cell>-</bx-structured-list-cell>
            #end if
          #end for

          <bx-structured-list-cell data-testid="year-$year">
            #if $year in $per_year
              <strong>
                #if $agg == 'max'
                  $format_raw_value($max($per_year[$year]), $stat_table_obs)
                #elif $agg == 'min'
                  $format_raw_value($min($per_year[$year]), $stat_table_obs)
                #elif $agg == 'sum'
                  $format_raw_value($sum($per_year[$year]), $stat_table_obs)
                #elif $agg == 'avg'
                  $format_raw_value($sum($per_year[$year])/$len($per_year[$year]), $stat_table_obs)
                #end if
              </strong>
            #else
              <strong>-</strong>
            #end if
          </bx-structured-list-cell>
        </bx-structured-list-row>
      #end for
      <bx-structured-list-row>
        <bx-structured-list-cell>
          $gettext($agg.capitalize())
        </bx-structured-list-cell>

        #for $month in range(1, 13)
          #if $per_month[$month]
            <bx-structured-list-cell>
              #if $agg == 'max'
                $format_raw_value($max($per_month[$month]), $stat_table_obs)
              #elif $agg == 'min'
                $format_raw_value($min($per_month[$month]), $stat_table_obs)
              #elif $agg == 'sum'
                $format_raw_value($sum($per_month[$month]), $stat_table_obs)
              #elif $agg == 'avg'
                $format_raw_value($sum($per_month[$month])/$len($per_month[$month]), $stat_table_obs)
              #end if
            </bx-structured-list-cell>
          #else
            <bx-structured-list-cell>-</bx-structured-list-cell>
          #end if
        #end for

        <bx-structured-list-cell>
          <strong>
            #if $agg == 'max'
              $format_raw_value($max($per_all), $stat_table_obs)
            #elif $agg == 'min'
              $format_raw_value($min($per_all), $stat_table_obs)
            #elif $agg == 'sum'
              $format_raw_value($sum($per_all), $stat_table_obs)
            #elif $agg == 'avg'
              $format_raw_value($sum($per_all)/$len($per_all), $stat_table_obs)
            #end if
          </strong>
        </bx-structured-list-cell>
      </bx-structured-list-row>
    </bx-structured-list-body>
  </bx-structured-list>
#end for