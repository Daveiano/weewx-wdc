<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8

#import calendar
#import datetime
#from weeutil.weeutil import startOfDay, startOfArchiveDay

#set $first_option = $DisplayOptions.get('climatological_days', [])[0].replace(' ', '_').lower()

<script
  type="module"
  src="https://1.www.s81c.com/common/carbon/web-components/version/v1.21.0/tabs.min.js"
></script>

<script
  type="module"
  src="https://1.www.s81c.com/common/carbon/web-components/version/v1.21.0/structured-list.min.js"
></script>

<bx-tabs trigger-content="Select an item" value="$first_option" type="default">
  <!--prettier-ignore-->
  #for $clim_day in $DisplayOptions.get('climatological_days')
  #set $clim_day_class = $clim_day.replace(' ', '_').lower()
  <bx-tab
    id="tab-$gettext($clim_day_class)"
    target="panel-$gettext($clim_day_class)"
    value="$gettext($clim_day_class)"
    >$gettext($clim_day)</bx-tab
  >
  #end for
</bx-tabs>

<div class="bx-ce-demo-devenv--tab-panels">
  <!--prettier-ignore-->
  #for $clim_day in $DisplayOptions.get('climatological_days')
  #set $clim_day_class = $clim_day.replace(' ', '_').lower()
  <!--prettier-ignore-->
  <div
    class="climatological-day-table"
    id="panel-$clim_day_class"
    role="tabpanel"
    aria-labelledby="tab-$clim_day_class"
    hidden
  >
    #if $context == 'alltime'
      #set $archive_months = $SummaryByMonth
      #if len($SummaryByYear) == 0
        #set $SummaryByYear = $fake_get_report_years($alltime.start.format("%Y"), $latest.dateTime.format("%Y"))
      #end if

      #set $totals_per_month = {}
      #set $totals_per_year = {}

      <bx-structured-list>
        <bx-structured-list-head>
          <bx-structured-list-header-row>
            <bx-structured-list-header-cell>
              $gettext('Year')
            </bx-structured-list-header-cell>

            #for $month in range(1, 13)
              <bx-structured-list-header-cell>
                $gettext(calendar.month_abbr[$month])
              </bx-structured-list-header-cell>
            #end for

            <bx-structured-list-header-cell>
              $gettext('Total')
            </bx-structured-list-header-cell>
          </bx-structured-list-header-row>
        </bx-structured-list-head>
        <bx-structured-list-body>
          #for $year in $SummaryByYear
          <bx-structured-list-row>
            <bx-structured-list-cell>$year</bx-structured-list-cell>

            #set $months_for_year = $filter_months($archive_months, $year)

            #for $month in range(1, 13)
              #if not $month in $totals_per_month
                #set $totals_per_month[$month] = []
              #end if
              #set $month_from_range = $year + '-' + str($month).zfill(2)

              #if $month_from_range in $months_for_year
                <bx-structured-list-cell data-testid="$month_from_range">
                  #set $time_span_start_ts = $startOfDay($datetime.datetime.strptime($month_from_range, "%Y-%m").replace(day=1).timestamp())
                  #set $time_span_end_ts = $datetime.datetime.strptime($month_from_range, "%Y-%m").replace(day=$calendar.monthrange(int($year), int($month))[1], hour=23, minute=59).timestamp()

                  #set $number_of_days = $get_climatological_day($clim_day, $time_span_start_ts, $time_span_end_ts)
                  #set $totals_per_year[$year] = $number_of_days + $totals_per_year[$year] if $year in $totals_per_year else $number_of_days
                  #silent $totals_per_month[$month].append($number_of_days)

                  $number_of_days
                </bx-structured-list-cell>
              #else
                <bx-structured-list-cell>-</bx-structured-list-cell>
              #end if
            #end for

            <bx-structured-list-cell data-testid="year-$year">
              #if $year in $totals_per_year
                <strong>$totals_per_year[$year]</strong>
              #else
                <strong>-</strong>
              #end if
            </bx-structured-list-cell>
          </bx-structured-list-row>
          #end for
          <bx-structured-list-row data-test="total">
            <bx-structured-list-cell>
              <strong>$gettext("Total")</strong>
            </bx-structured-list-cell>
            #for $month in range(1, 13)
              #if $month in $totals_per_month
                <bx-structured-list-cell data-testid="month-$month">
                  <strong>$sum($totals_per_month[$month])</strong>
                </bx-structured-list-cell>
              #else
                <bx-structured-list-cell>-</bx-structured-list-cell>
              #end if
            #end for
            <bx-structured-list-cell>
              <strong>
                $get_climatological_day($clim_day, $alltime.start.raw, $alltime.end.raw)
              </strong>
            </bx-structured-list-cell>
          </bx-structured-list-row>
          <bx-structured-list-row data-test="average">
            <bx-structured-list-cell>
              <strong>$gettext("Average")</strong>
            </bx-structured-list-cell>
            #for $month in range(1, 13)
              #if $month in $totals_per_month and $len($totals_per_month[$month]) > 0
                <bx-structured-list-cell data-testid="month-$month">
                  <strong>$round($sum($totals_per_month[$month]) / $len($totals_per_month[$month]), 1)</strong>
                </bx-structured-list-cell>
              #else
                <bx-structured-list-cell>-</bx-structured-list-cell>
              #end if
            #end for

            #if $len($SummaryByYear) > 0
            <bx-structured-list-cell>
              <strong>
                $round($get_climatological_day($clim_day, $alltime.start.raw, $alltime.end.raw) / $len($SummaryByYear), 1)
              </strong>
            </bx-structured-list-cell>
            #else
            <bx-structured-list-cell>-</bx-structured-list-cell>
            #end if
          </bx-structured-list-row>
        </bx-structured-list-body>
      </bx-structured-list>
    #end if
  </div>
  #end for
</div>
