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
  <bx-header-name href="index.html" prefix="">
    <!--prettier-ignore-->
    #include "includes/icons/wdc.svg"
    <span part="prefix" class="bx--header__name--prefix">WeeWX</span>
    $station.location
  </bx-header-name>
  <bx-header-nav menu-bar-label="Weewx $station.location - $current.dateTime">
    <bx-header-nav-item href="index.html">$gettext("Today")</bx-header-nav-item>
    <bx-header-nav-item href="week.html">$gettext("Week")</bx-header-nav-item>
    <bx-header-nav-item href="month.html">$gettext("Month")</bx-header-nav-item>
    <bx-header-nav-item href="year.html">$gettext("Year")</bx-header-nav-item>
  </bx-header-nav>
</bx-header>
<bx-side-nav aria-label="Side navigation" collapse-mode="responsive">
  <bx-side-nav-items>
    <bx-side-nav-link class="show-small" href="index.html"
      >$gettext("Today")</bx-side-nav-link
    >
    <bx-side-nav-link class="show-small" href="week.html"
      >$gettext("Week")</bx-side-nav-link
    >
    <bx-side-nav-link class="show-small" href="month.html"
      >$gettext("Month")</bx-side-nav-link
    >
    <bx-side-nav-link class="show-small" href="year.html"
      >$gettext("Year")</bx-side-nav-link
    >
    <bx-side-nav-divider class="show-small"></bx-side-nav-divider>
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
    #for $static_page in $get_static_pages()
    <bx-side-nav-link href="$static_page['link']">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        slot="title-icon"
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
        <polygon
          points="17 22 17 14 13 14 13 16 15 16 15 22 12 22 12 24 20 24 20 22 17 22"
        />
        <path d="M16,8a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,16,8Z" />
        <path
          d="M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z"
        />
        <rect class="cls-1" width="32" height="32" />
      </svg>
      $gettext($static_page['title'])
    </bx-side-nav-link>
    #end for

    <bx-side-nav-divider></bx-side-nav-divider>
    <bx-side-nav-link class="sidebar-heading"
      >$gettext('Archive & NOAA Reports')</bx-side-nav-link
    >
    <!--prettier-ignore-->
    #set $archive_months = $SummaryByMonth
    #if len($SummaryByYear) == 0
    #set $SummaryByYear = $fake_get_report_years($alltime.start, $alltime.end)
    #end if
    <bx-side-nav-menu title="$gettext('Years')">
      #for $year in $SummaryByYear
      <bx-side-nav-menu-item href="year-${year}.html">
        <b>$year</b>
      </bx-side-nav-menu-item>
      #end for
    </bx-side-nav-menu>
    <!--prettier-ignore-->
    #for $year in $SummaryByYear
    #set $months_for_year = $filter_months(archive_months, $year)
    <!--prettier-ignore-->
    <bx-side-nav-menu title="${year}">
      <!--prettier-ignore-->
      #for $month in $months_for_year
      <bx-side-nav-menu-item href="month-${month}.html">
        $month_string_format($month)
      </bx-side-nav-menu-item>
      #end for
    </bx-side-nav-menu>
    <!--prettier-ignore-->
    #end for
  </bx-side-nav-items>
</bx-side-nav>

<script>
  const bxSideNavLinks = document.querySelectorAll(
    "bx-side-nav-link, bx-side-nav-menu-item"
  );

  bxSideNavLinks.forEach((element) => {
    const isFront =
      element.getAttribute("href") === "index.html" &&
      window.location.pathname === "/";

    if (
      isFront ||
      "/" + element.getAttribute("href") === window.location.pathname
    ) {
      element.setAttribute("active", true);
    }
  });
</script>
