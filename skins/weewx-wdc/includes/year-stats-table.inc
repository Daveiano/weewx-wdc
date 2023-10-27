<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8

#set $first_option = $DisplayOptions.get('climatological_days', [])[0].replace(' ', '_').lower()

<script
  type="module"
  src="https://1.www.s81c.com/common/carbon/web-components/version/v1.21.0/tabs.min.js"
></script>

<bx-tabs
  trigger-content="Select an item"
  value="$first_option"
  type="container"
>
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
    #end if
  </div>
  #end for
</div>
