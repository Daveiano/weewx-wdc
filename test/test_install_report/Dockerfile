FROM python:3.10-buster

LABEL org.opencontainers.image.authors="David Baetge <david.baetge@gmail.com>"

ARG WEEWX_VERSION="4.9.1"
ARG WDC_VERSION="v1.3.1"
ARG WEEWX_UID=2749
ENV WEEWX_HOME="/home/weewx"
RUN current_date=$(date +%Y-%m-%d\ %H:%M:%S)
ENV CURRENT_DATE=$current_date

EXPOSE 9877

COPY src/install-input.txt /tmp/
COPY src/start.sh /start.sh
COPY src/start-classic.sh /start-classic.sh
COPY src/start-forecast.sh /start-forecast.sh
COPY src/start-custom.sh /start-custom.sh
COPY src/start-dwd.sh /start-dwd.sh
COPY src/start-without-forecast.sh /start-without-forecast.sh
RUN chmod +x /start.sh &&\
    chmod +x /start-classic.sh &&\
    chmod +x /start-without-forecast.sh &&\
    chmod +x /start-forecast.sh &&\
    chmod +x /start-custom.sh &&\
    chmod +x /start-dwd.sh

# @see https://blog.nuvotex.de/running-syslog-in-a-container/
RUN apt-get update &&\
    apt-get install -q -y --no-install-recommends gcc make git rsyslog=8.1901.0-1+deb10u2 python3-configobj python3-requests &&\
    apt-get clean &&\
    rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid ${WEEWX_UID} weewx &&\
    adduser --system --uid ${WEEWX_UID} --ingroup weewx weewx

# Configure timezone.
RUN ln -sf /usr/share/zoneinfo/Europe/Berlin /etc/localtime

WORKDIR /tmp

RUN git clone https://github.com/wolfcw/libfaketime.git &&\
    cd libfaketime/src &&\
    #sed -i -z -e 's|CFLAGS +=|CFLAGS += -DFORCE_MONOTONIC_FIX -DFORCE_PTHREAD_NONVER |g' Makefile &&\
    make install
    #cd .. && make test

RUN wget -nv -O "weewx-${WEEWX_VERSION}.tar.gz" "https://github.com/weewx/weewx/archive/refs/tags/v${WEEWX_VERSION}.tar.gz" &&\
    wget -nv -O "weewx-interceptor.zip" "https://github.com/matthewwall/weewx-interceptor/archive/master.zip" &&\
    wget -nv -O "weewx-forecast.zip" "https://github.com/chaunceygardiner/weewx-forecast/archive/refs/heads/master.zip" &&\
    tar xfz "weewx-${WEEWX_VERSION}.tar.gz"

COPY src/weewx-wdc.zip /tmp/weewx-wdc.zip

RUN mkdir /tmp/weewx-wdc/ &&\
    unzip -q /tmp/weewx-wdc.zip -d /tmp/weewx-wdc/

WORKDIR /tmp/weewx-${WEEWX_VERSION}

RUN pip install --no-cache-dir -r ./requirements.txt &&\
    python ./setup.py build && python ./setup.py install < /tmp/install-input.txt

WORKDIR ${WEEWX_HOME}

RUN bin/wee_extension --install /tmp/weewx-interceptor.zip &&\
    bin/wee_extension --install /tmp/weewx-forecast.zip &&\
    bin/wee_extension --install /tmp/weewx-wdc/ &&\
    bin/wee_config --reconfigure --driver=user.interceptor --no-prompt

COPY src/skin.conf ./skins/weewx-wdc/
COPY src/skin-forecast.conf ./skins/weewx-wdc/
COPY src/skin-custom.conf ./skins/weewx-wdc/
COPY src/skin-dwd.conf ./skins/weewx-wdc/
COPY src/weewx-dwd.conf ./skins/weewx-wdc/

RUN sed -i -e 's/device_type = acurite-bridge/device_type = ecowitt-client\n    port = 9877\n    address = 0.0.0.0/g' weewx.conf &&\
    sed -i -z -e 's/skin = Seasons\n        enable = true/skin = Seasons\n        enable = false/g' weewx.conf &&\
    sed -i -z -e 's/skin = forecast/skin = forecast\n        enable = false/g' weewx.conf

ADD src/weewx-db_06_23_2022_08_00.tar ./archive

ENTRYPOINT [ "/start.sh" ]
