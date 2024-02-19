FROM python:3.10-buster

LABEL org.opencontainers.image.authors="David Baetge <david.baetge@gmail.com>"

ARG WEEWX_VERSION="5.0.2"
ARG WEEWX_UID=2749
ENV WEEWX_HOME="/home/weewx-data"
RUN current_date=$(date +%Y-%m-%d\ %H:%M:%S)
ENV CURRENT_DATE=$current_date

EXPOSE 9877

COPY src/weewx-custom-binding.conf /weewx-custom-binding.conf
COPY src/start.sh /start.sh
COPY src/start-classic.sh /start-classic.sh
COPY src/start-forecast.sh /start-forecast.sh
COPY src/start-custom.sh /start-custom.sh
COPY src/start-custom-binding.sh /start-custom-binding.sh
COPY src/start-dwd.sh /start-dwd.sh
COPY src/start-without-forecast.sh /start-without-forecast.sh
COPY src/start-mqtt.sh /start-mqtt.sh
COPY src/start-sensor.sh /start-sensor.sh
COPY src/start-cmon.sh /start-cmon.sh
RUN chmod +x /start.sh &&\
    chmod +x /start-classic.sh &&\
    chmod +x /start-without-forecast.sh &&\
    chmod +x /start-forecast.sh &&\
    chmod +x /start-custom.sh &&\
    chmod +x /start-custom-binding.sh &&\
    chmod +x /start-dwd.sh &&\
    chmod +x /start-mqtt.sh &&\
    chmod +x /start-sensor.sh &&\
    chmod +x /start-cmon.sh

# @see https://blog.nuvotex.de/running-syslog-in-a-container/
RUN apt-get update &&\
    apt-get install -q -y --no-install-recommends gcc make git rsyslog=8.1901.0-1+deb10u2 python3-configobj python3-requests python3-pip python3-venv &&\
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

RUN wget -nv -O "weewx-interceptor.zip" "https://github.com/matthewwall/weewx-interceptor/archive/master.zip" &&\
    wget -nv -O "weewx-forecast.zip" "https://github.com/chaunceygardiner/weewx-forecast/archive/refs/heads/master.zip" &&\
    wget -nv -O "weewx-cmon.zip" "https://github.com/bellrichm/weewx-cmon/archive/refs/heads/master.zip"

COPY src/weewx-wdc.zip /tmp/weewx-wdc.zip

RUN mkdir /tmp/weewx-wdc/ &&\
    unzip -q /tmp/weewx-wdc.zip -d /tmp/weewx-wdc/

WORKDIR ${WEEWX_HOME}

RUN python3 -m venv ${WEEWX_HOME}/weewx-venv &&\
    # shellcheck source=/dev/null
    . ${WEEWX_HOME}/weewx-venv/bin/activate &&\
    python3 -m pip install --no-cache-dir weewx==${WEEWX_VERSION}

RUN . ${WEEWX_HOME}/weewx-venv/bin/activate &&\
    weectl station create "${WEEWX_HOME}" --no-prompt \
        --driver=weewx.drivers.simulator \
        --altitude="250,meter" \
        --latitude=51.209 \
        --longitude=14.085 \
        --location="Haselbachtal, Saxony, Germany" \
        --register="y" \
        --station-url="https://www.weewx-hbt.de/" \
        --units="metric"

# shellcheck source=/dev/null
RUN . "${WEEWX_HOME}/weewx-venv/bin/activate" &&\
    weectl extension install -y --config "${WEEWX_HOME}/weewx.conf" /tmp/weewx-interceptor.zip &&\
    weectl extension install -y --config "${WEEWX_HOME}/weewx.conf" /tmp/weewx-forecast.zip &&\
    weectl extension install -y --config "${WEEWX_HOME}/weewx.conf" /tmp/weewx-cmon.zip &&\
    weectl extension install -y --config "${WEEWX_HOME}/weewx.conf" /tmp/weewx-wdc/

# shellcheck source=/dev/null
RUN . "${WEEWX_HOME}/weewx-venv/bin/activate" && weectl extension list --config "${WEEWX_HOME}/weewx.conf"
RUN . "${WEEWX_HOME}/weewx-venv/bin/activate" && weectl station reconfigure --weewx-root "${WEEWX_HOME}" --config "${WEEWX_HOME}/weewx.conf" --driver=user.interceptor --no-prompt

COPY src/skin.conf ./skins/weewx-wdc/
COPY src/skin-forecast.conf ./skins/weewx-wdc/
COPY src/skin-custom.conf ./skins/weewx-wdc/
COPY src/skin-dwd.conf ./skins/weewx-wdc/
COPY src/skin-mqtt.conf ./skins/weewx-wdc/
COPY src/skin-custom-binding.conf ./skins/weewx-wdc/
COPY src/skin-sensor-status.conf ./skins/weewx-wdc/
COPY src/skin-cmon.conf ./skins/weewx-wdc/
COPY src/weewx-dwd.conf ./skins/weewx-wdc/
COPY src/dwd.py ./weewx-venv/lib/python3.10/site-packages/schemas/
COPY src/dwd-extensions.py /tmp
COPY src/cmon-extensions.py /tmp

RUN sed -i -e 's/device_type = acurite-bridge/device_type = ecowitt-client\n    port = 9877\n    address = 0.0.0.0/g' weewx.conf &&\
    sed -i -z -e 's/skin = Seasons\n        enable = true/skin = Seasons\n        enable = false/g' weewx.conf &&\
    sed -i -z -e 's/skin = cmon/skin = cmon\n        enable = false/g' weewx.conf &&\
    sed -i -z -e 's/skin = forecast/skin = forecast\n        enable = false/g' weewx.conf

ADD src/weewx-db_06_23_2022_08_00.tar ./archive
ADD src/weewx-generated-2022-06-23.tar.xz ./archive
ADD src/weewx-sensor-status.tar.xz ./archive
ADD src/weewx-cmon.tar.xz ./archive
ADD src/cmon.tar.xz ./archive

ENTRYPOINT [ "/start.sh" ]
