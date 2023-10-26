<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8

<script
  type="module"
  src="https://1.www.s81c.com/common/carbon/web-components/version/v1.21.0/tabs.min.js"
></script>

<bx-tabs trigger-content="Select an item" value="table" type="container">
  <!--prettier-ignore-->
  #for $clim_day in $DisplayOptions.get('climatological_days')
  <bx-tab
    id="tab-$gettext($clim_day)"
    target="panel-$gettext($clim_day)"
    value="$gettext($clim_day)"
    >$gettext($clim_day)</bx-tab
  >
  #end for
</bx-tabs>
