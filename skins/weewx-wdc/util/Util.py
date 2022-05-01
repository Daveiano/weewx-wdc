from Cheetah.Template import Template


def get_icon(obs):
    if obs == 'outTemp':
        return 'temperature.svg'
    elif obs == 'outHumidity':
        return 'humidity.svg'
    elif obs == 'barometer':
        return 'pressure.svg'


class GetDataSeries(Template):
    def some_function():
        i = 1


class DoOtherStuff(Template):
    def some_other_funtion():
        i = 2
        test_tuple = (1, 2, 3)
