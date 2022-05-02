# installer for the 'wdc' (weather data center) skin
# Copyright 2022 David Baetge

from weecfg.extension import ExtensionInstaller


def loader():
    return BasicInstaller()


class BasicInstaller(ExtensionInstaller):
    def __init__(self):
        super(BasicInstaller, self).__init__(
            version="1.0.0-alpha1",
            name='weewx-wdc',
            description='Weather Data Center skin for weewx.',
            author="David Baetge",
            author_email="david.baetge@gmail.com",
            config={
                'StdReport': {
                    'WdcReport': {
                        'skin': 'weewx-wdc',
                        'enable': 'true',
                        'HTML_ROOT': '/var/www/html/weewx/wdc',
                        'lang': 'en',
                        # 'unit_system': 'US'
                    }
                }
            },
            files=[
                ('bin/user', ['bin/user/get_icon.py']),
                ('skins/weewx-wdc',
                 ['skins/weewx-wdc/index.html.tmpl',
                  'skins/weewx-wdc/skin.conf',
                  'skins/weewx-wdc/lang/de.conf',
                  'skins/weewx-wdc/lang/en.conf',
                  'skins/weewx-wdc/dist/scss/index.css',
                  'skins/weewx-wdc/dist/js/index.js',
                  'skins/weewx-wdc/favicon.ico',
                  'skins/weewx-wdc/includes/stat-tile.inc',
                  'skins/weewx-wdc/includes/ui-shell.inc',
                  'skins/weewx-wdc/includes/icons/barometer.svg',
                  'skins/weewx-wdc/includes/icons/humidity.svg',
                  'skins/weewx-wdc/includes/icons/temp.svg',
                  ]),
            ]
        )

    # def configure(self, engine):
    #    """Customized configuration that sets a language code"""
    #    # TODO: Set a units code as well
    #    code = engine.get_lang_code('wdc', 'en')
    #    self['config']['StdReport']['WdcReport']['lang'] = code
    #    return True
