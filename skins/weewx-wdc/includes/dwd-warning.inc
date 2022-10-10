<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8

<div class="bx--tile" style="margin-bottom: 1.5rem">
  <header class="section-header" style="margin-top: 0; margin-bottom: 1rem">
    <h3>$region</h3>
  </header>
  <div class="dwd-warning" data-region="$region_key">
    <script>
      var warningdata_$region_key = #include raw "dwd/warn-" + $region_key + ".json"
    </script>
  </div>
</div>
