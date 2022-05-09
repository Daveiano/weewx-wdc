#encoding UTF-8
<div class="bx--col-sm-4 bx--col-md-8 bx--col-lg-8 bx--col-xlg-8 bx--col-max-6">
  <div class="bx--tile diagram-tile combined">
    <div class="bx--row">
      <div class="bx--col">
        <!--prettier-ignore-->
        <p class="label">
          #for $combined_obs in $combined_diagram.obs.keys()
            <span>
              #if $get_icon($combined_obs) is not None
                #include $get_icon($combined_obs)
              #end if
            </span>
          #end for
          $combined_diagram.label
        </p>
        <div class="value">
          <!--prettier-ignore-->
          #set $series_names = []
          #set $series_colors = []
          #set $series_labels = []

          <!--prettier-ignore-->
          #for $combined_obs in $combined_diagram.obs.keys()
          #set $series_name = $combined_obs + 'Series' + str($diagram_index)
          #silent $series_names.append($series_name)
          #silent $series_labels.append($obs.label[$combined_obs])
          #if 'color' in $combined_diagram.obs[$combined_obs] then $series_colors.append($combined_diagram.obs[$combined_obs].color) else $series_colors.append($get_color($combined_obs))#
          <script>
            /* prettier-ignore */
            var $series_name = $getattr($span($hour_delta=24), $combined_obs).series(aggregate_type='avg', aggregate_interval='900', time_series='start', time_unit='unix_epoch').round(2).json;
          </script>
          #end for

          <div
            class="diagram combined"
            data-labels="$series_labels"
            data-value="$series_names"
            data-color="$series_colors"
            data-unit="$getattr($unit.label, $combined_diagram.obs.keys()[0])"
            data-obs="$get_diagram_type($combined_diagram.obs.keys()[0])"
          ></div>
        </div>
      </div>
    </div>
  </div>
</div>
