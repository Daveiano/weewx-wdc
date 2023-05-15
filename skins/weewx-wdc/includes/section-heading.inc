<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8
#from datetime import datetime, timedelta

<!--prettier-ignore-->
<header class="bx--col section-header">
  #if $context == 'day' and not $daily_archive
    <h2>$gettext("Last 24 hours")</h2>
  #else if $context == 'day' and $daily_archive
    <h2>$day.dateTime.format($get_time_format_dict['daily_archive'])</h2>
  #else if $context == 'yesterday'
    <h2>$gettext("Yesterday")</h2>
  #else if $context == 'week'
    <h2>$gettext("Last 7 days")</h2>
    #set $start_date_header = datetime.fromtimestamp($current.dateTime.raw) - timedelta(days=7)
    <h3>
      <!--prettier-ignore-->
      $start_date_header.strftime($get_time_format_dict['week']) - $current.dateTime.format($get_time_format_dict['week'])
    </h3>
  #else if $context == 'month' and not $use_parameter_month
    <h2>$gettext("Last 30 days")</h2>
    #set $start_date_header = datetime.fromtimestamp($current.dateTime.raw) - timedelta(days=30)
    <h3>
      $start_date_header.strftime($get_time_format_dict['month']) - $current.dateTime.format($get_time_format_dict['month'])
    </h3>
  #else if $context == 'month' and $use_parameter_month
    <h2>$month_name $year_name</h2>
  #else if $context == 'year' and not $use_parameter_year
    <h2>$gettext("Last 365 days")</h2>
    #set $start_date_header = datetime.fromtimestamp($current.dateTime.raw) - timedelta(days=365)
    <h3>
      $start_date_header.strftime($get_time_format_dict['year']) - $current.dateTime.format($get_time_format_dict['year'])
    </h3>
  #else if $context == 'year' and $use_parameter_year
    <h2>$year_name</h2>
  #else if $context == 'alltime'
    <h2>$gettext("All Time")</h2>
  #end if
</header>
