<!--prettier-ignore-->
#encoding UTF-8
#errorCatcher Echo

<script
  type="module"
  src="https://1.www.s81c.com/common/carbon/web-components/version/v1.21.0/ui-shell.min.js"
></script>

<bx-header aria-label="Weewx $station.location - $current.dateTime">
  <bx-header-menu-button
    button-label-active="Close menu"
    button-label-inactive="Open menu"
  ></bx-header-menu-button>
  <bx-header-name href="index.html" prefix="Weewx">
    $station.location
  </bx-header-name>
  <bx-header-nav menu-bar-label="Weewx $station.location - $current.dateTime">
    <bx-header-nav-item href="index.html">$gettext("Today")</bx-header-nav-item>
    <bx-header-nav-item href="week.html">$gettext("Week")</bx-header-nav-item>
    <bx-header-nav-item href="month.html">$gettext("Month")</bx-header-nav-item>
    <bx-header-nav-item href="year.html">$gettext("Year")</bx-header-nav-item>
  </bx-header-nav>
</bx-header>
<bx-side-nav aria-label="Side navigation" collapse-mode="rail">
  <bx-side-nav-items>
    <bx-side-nav-link href="celestial.html">
      <svg
        slot="title-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 32 32"
      >
        <defs>
          <style>
            .cls-1 {
              fill: none;
            }
          </style>
        </defs>
        <title>asleep</title>
        <path
          d="M13.5025,5.4136A15.0755,15.0755,0,0,0,25.096,23.6082a11.1134,11.1134,0,0,1-7.9749,3.3893c-.1385,0-.2782.0051-.4178,0A11.0944,11.0944,0,0,1,13.5025,5.4136M14.98,3a1.0024,1.0024,0,0,0-.1746.0156A13.0959,13.0959,0,0,0,16.63,28.9973c.1641.006.3282,0,.4909,0a13.0724,13.0724,0,0,0,10.702-5.5556,1.0094,1.0094,0,0,0-.7833-1.5644A13.08,13.08,0,0,1,15.8892,4.38,1.0149,1.0149,0,0,0,14.98,3Z"
        />
        <rect
          id="_Transparent_Rectangle_"
          data-name="&lt;Transparent Rectangle&gt;"
          class="cls-1"
          width="32"
          height="32"
        />
      </svg>
      $gettext("Celestial")
    </bx-side-nav-link>
    <bx-side-nav-link href="statistics.html">
      <svg
        slot="title-icon"
        width="16"
        height="16"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
      >
        <defs>
          <style>
            .cls-1 {
              fill: none;
            }
          </style>
        </defs>
        <title>analytics</title>
        <path d="M4,2H2V28a2,2,0,0,0,2,2H30V28H4Z" />
        <path
          d="M30,9H23v2h3.59L19,18.59l-4.29-4.3a1,1,0,0,0-1.42,0L6,21.59,7.41,23,14,16.41l4.29,4.3a1,1,0,0,0,1.42,0L28,12.41V16h2Z"
        />
        <rect
          id="_Transparent_Rectangle_"
          data-name="&lt;Transparent Rectangle&gt;"
          class="cls-1"
          width="32"
          height="32"
        />
      </svg>
      $gettext("Statistics")
    </bx-side-nav-link>
    <bx-side-nav-divider></bx-side-nav-divider>
    <bx-side-nav-menu title="$gettext('Archive & NOAA Reports')">
      <!--prettier-ignore-->
      #set $archive_months = $SummaryByMonth
      #for $year in $SummaryByYear
      #set $months_for_year = $filter_months(archive_months, $year)
      <!--prettier-ignore-->
      <bx-side-nav-menu-item href="year-${year}.html">
        <b>$year</b>
      </bx-side-nav-menu-item>
      <!--prettier-ignore-->
      #for $month in $months_for_year
      <bx-side-nav-menu-item href="month-${month}.html">
        &nbsp;&nbsp;&nbsp;&nbsp;$month_string_format($month)
      </bx-side-nav-menu-item>
      <!--prettier-ignore-->
      #end for
      #end for
    </bx-side-nav-menu>
  </bx-side-nav-items>
</bx-side-nav>
