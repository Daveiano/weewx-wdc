#errorCatcher Echo
#encoding UTF-8

#if $DisplayOptions.get('layout', 'alternative') == 'alternative' and 'stat_tile_links' in $DisplayOptions
  #for $skin_obs in $DisplayOptions.get('stat_tile_links')
    #set $render_modal = "stat_tile_links" in $DisplayOptions and $skin_obs in $DisplayOptions["stat_tile_links"] and $DisplayOptions["stat_tile_links"][$skin_obs]["open"] == "modal"
    #set $skin_obs_key = $get_custom_data_binding_obs_key($skin_obs)

    #if $render_modal
        <cds-modal id="modal-$skin_obs_key" size="lg" fullWidth>
        <cds-modal-header>
            <cds-modal-close-button></cds-modal-close-button>
            <!-- <cds-modal-label>Label (Optional)</cds-modal-label> -->
            <cds-modal-heading>$obs.label[$skin_obs]</cds-modal-heading>
        </cds-modal-header>
        <cds-modal-body>
            <iframe src='$DisplayOptions["stat_tile_links"][$skin_obs]["link"]' style="width: 100%; height: 100%; border: none;" ></iframe>
        </cds-modal-body>
        </cds-modal>

        <script type="text/javascript">
            document
                .querySelector(".stat-tile[data-observation='$skin_obs_key']")
                .addEventListener("click", () => {
                    document.getElementById("modal-$skin_obs_key").open = true;
                });
        </script>

        <style>
            .stat-tile[data-observation='$skin_obs_key'] {
                cursor: pointer;
            }
            #modal-$skin_obs_key cds-modal-body {
                min-height: 65vh;
                overflow: hidden;
            }
        </style>
    #end if
  #end for
#end if